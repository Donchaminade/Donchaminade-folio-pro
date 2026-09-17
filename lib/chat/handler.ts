import { createGoogle, google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from 'ai';
import { fallbackAnswer } from './fallback';
import { detectLang } from './language';
import { buildInstructions } from './prompt';
import { clientIp, consumeRateLimit } from './rateLimit';
import { retrievePortfolioContext } from './retrieve';
import { lastUserText, normalizeMessages, textToUiResponse } from './stream';

export const CHAT_MAX_DURATION = 30;

function getFreeModel() {
  if (process.env.GROQ_API_KEY) {
    return groq(process.env.GROQ_MODEL || 'llama-3.1-8b-instant');
  }
  const modelId = process.env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.5-flash';
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google(modelId);
  }
  if (process.env.GEMINI_API_KEY) {
    return createGoogle({ apiKey: process.env.GEMINI_API_KEY })(modelId);
  }
  return null;
}

function jsonError(message: string, status: number, extra?: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });
}

export async function handleChatRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  if (req.method !== 'POST') {
    return jsonError('Méthode non autorisée', 405);
  }

  const limit = consumeRateLimit(clientIp(req));
  if (limit.ok === false) {
    return jsonError('Trop de messages. Réessayez dans un instant.', 429, {
      'Retry-After': String(limit.retryAfter),
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Requête invalide', 400);
  }

  const messages = normalizeMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return jsonError('Message utilisateur manquant ou trop long.', 400);
  }

  const query = lastUserText(messages);
  if (!query) {
    return jsonError('Message vide', 400);
  }

  const lang = detectLang(query);
  const { facts, contextText } = await retrievePortfolioContext(query);
  const fallback = fallbackAnswer(query, facts, lang);
  const model = getFreeModel();

  if (!model) {
    return textToUiResponse(fallback);
  }

  try {
    const result = streamText({
      model,
      instructions: buildInstructions(contextText, lang),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 700,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: () => fallback,
      }),
      headers: {
        'X-Chat-Mode': 'llm',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return textToUiResponse(fallback);
  }
}
