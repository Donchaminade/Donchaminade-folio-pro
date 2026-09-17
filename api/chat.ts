import { handleChatRequest } from '../lib/chat/handler';

export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return handleChatRequest(req);
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204 });
}
