import type { IncomingMessage, ServerResponse } from 'http';

export const config = { maxDuration: 30 };

function chatMode(): 'groq' | 'gemini' | 'fallback' {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY) return 'gemini';
  return 'fallback';
}

function healthResponse(): Response {
  return Response.json({ ok: true, mode: chatMode() });
}

function isWebRequest(value: unknown): value is Request {
  return typeof Request !== 'undefined' && value instanceof Request;
}

async function nodeToWebRequest(req: IncomingMessage & { body?: unknown }): Promise<Request> {
  const host = req.headers.host || 'localhost';
  const url = `https://${host}${req.url || '/api/chat'}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.body != null) {
      body =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? req.body
          : JSON.stringify(req.body);
    } else {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const buf = Buffer.concat(chunks);
      if (buf.length) body = new Uint8Array(buf);
    }
  }

  return new Request(url, {
    method: req.method || 'POST',
    headers,
    body,
  });
}

async function writeWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  if (!response.body) {
    res.end();
    return;
  }
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(Buffer.from(value));
    }
  } finally {
    res.end();
  }
}

async function handleFetch(request: Request): Promise<Response> {
  try {
    if (request.method === 'GET' || request.method === 'HEAD') {
      return healthResponse();
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }
    const { handleChatRequest } = await import('../lib/chat/handler');
    return await handleChatRequest(request);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'chat_failed';
    return Response.json({ error: 'assistant_unavailable', detail }, { status: 500 });
  }
}

async function handle(
  req: Request | (IncomingMessage & { body?: unknown }),
  res?: ServerResponse
): Promise<Response | void> {
  try {
    if (isWebRequest(req) && !res) {
      return await handleFetch(req);
    }
    if (!res) {
      throw new Error('Missing Node response');
    }
    const method = String((req as IncomingMessage).method || 'GET').toUpperCase();
    if (method === 'GET' || method === 'HEAD') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: true, mode: chatMode() }));
      return;
    }
    if (method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    const request = await nodeToWebRequest(req as IncomingMessage & { body?: unknown });
    await writeWebResponse(res, await handleFetch(request));
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'chat_failed';
    if (res && !res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'assistant_unavailable', detail }));
      return;
    }
    return Response.json({ error: 'assistant_unavailable', detail }, { status: 500 });
  }
}

const handler = Object.assign(handle, { fetch: handleFetch });
export default handler;

export const GET = async (): Promise<Response> => healthResponse();
export const OPTIONS = async (): Promise<Response> => new Response(null, { status: 204 });
export const POST = async (request: Request): Promise<Response> => handleFetch(request);
