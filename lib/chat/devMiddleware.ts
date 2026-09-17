import type { IncomingMessage, ServerResponse } from 'http';
import { handleChatRequest } from './handler';

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export async function handleViteChat(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
  const host = req.headers.host || 'localhost';
  const url = `http://${host}${req.url || '/api/chat'}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  const request = new Request(url, {
    method: req.method || 'POST',
    headers,
    body: body && body.length > 0 ? new Uint8Array(body) : undefined,
  });

  const response = await handleChatRequest(request);
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
