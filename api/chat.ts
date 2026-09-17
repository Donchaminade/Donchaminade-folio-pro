import { handleChatRequest } from '../lib/chat/handler';

export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return handleChatRequest(req);
}

export async function GET(): Promise<Response> {
  const mode = process.env.GROQ_API_KEY
    ? 'groq'
    : process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
      ? 'gemini'
      : 'fallback';
  return Response.json({ ok: true, mode });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204 });
}
