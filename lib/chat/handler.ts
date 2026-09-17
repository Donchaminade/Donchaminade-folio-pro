import { fallbackAnswer } from './fallback';
import { detectLang } from './language';
import { buildInstructions } from './prompt';
import { clientIp, consumeRateLimit } from './rateLimit';
import { retrievePortfolioContext } from './retrieve';
import { lastUserText, normalizeMessages, textToUiResponse } from './stream';

export const CHAT_MAX_DURATION = 30;

function hasLlmKey(): boolean {
  return Boolean(
    process.env.GROQ_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY
  );
}

function jsonError(message: string, status: number, extra?: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });
}

async function streamWithLlm(
  messages: ReturnType<typeof normalizeMessages>,
  contextText: string,
  lang: ReturnType<typeof detectLang>,
  fallback: string
): Promise<Response> {
  const { createGoogle, google } = await import('@ai-sdk/google');
  const { groq } = await import('@ai-sdk/groq');
  const {
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    streamText,
  } = await import('ai');

  const model = process.env.GROQ_API_KEY
    ? groq(process.env.GROQ_MODEL || 'llama-3.1-8b-instant')
    : process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ? google(process.env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.5-flash')
      : createGoogle({ apiKey: process.env.GEMINI_API_KEY })(
          process.env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.5-flash'
        );

  const stream = createUIMessageStream({
    async execute({ writer }) {
      writer.write({ type: 'start' });
      try {
        const result = streamText({
          model,
          instructions: buildInstructions(contextText, lang),
          messages: await convertToModelMessages(messages!),
          maxOutputTokens: 1000,
        });
        let started = false;
        for await (const delta of result.textStream) {
          if (!started) {
            writer.write({ type: 'text-start', id: 'answer' });
            started = true;
          }
          writer.write({ type: 'text-delta', id: 'answer', delta });
        }
        if (started) {
          writer.write({ type: 'text-end', id: 'answer' });
          return;
        }
      } catch {
        // Provider / réseau : on bascule sur les faits publics.
      }
      writer.write({ type: 'text-start', id: 'answer' });
      for (let i = 0; i < fallback.length; i += 80) {
        writer.write({ type: 'text-delta', id: 'answer', delta: fallback.slice(i, i + 80) });
      }
      writer.write({ type: 'text-end', id: 'answer' });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: {
      'X-Chat-Mode': 'llm',
      'Cache-Control': 'no-store',
    },
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

  if (!hasLlmKey()) {
    return textToUiResponse(fallback);
  }

  try {
    return await streamWithLlm(messages, contextText, lang, fallback);
  } catch {
    return textToUiResponse(fallback);
  }
}
