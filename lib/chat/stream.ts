export type ChatUiMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: Array<{ type: 'text'; text: string }>;
};

function encodeSse(payload: unknown): string {
  return `data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`;
}

/** Flux UI Message v1 sans importer le package `ai` (évite un crash CJS/ESM sur Vercel). */
export function textToUiResponse(
  text: string,
  headers?: Record<string, string>
): Response {
  const messageId = `msg-${Date.now().toString(36)}`;
  const parts: string[] = [
    encodeSse({ type: 'start', messageId }),
    encodeSse({ type: 'text-start', id: 'answer' }),
  ];
  const chunkSize = 80;
  for (let i = 0; i < text.length; i += chunkSize) {
    parts.push(
      encodeSse({
        type: 'text-delta',
        id: 'answer',
        delta: text.slice(i, i + chunkSize),
      })
    );
  }
  parts.push(encodeSse({ type: 'text-end', id: 'answer' }));
  parts.push(encodeSse('[DONE]'));

  return new Response(parts.join(''), {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
      'x-accel-buffering': 'no',
      'X-Chat-Mode': 'fallback',
      'x-vercel-ai-ui-message-stream': 'v1',
      ...headers,
    },
  });
}

export function lastUserText(messages: ChatUiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;
    const text = (message.parts ?? [])
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (text) return text;
  }
  return '';
}

export function normalizeMessages(raw: unknown): ChatUiMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const sliced = raw.slice(-8);
  const messages: ChatUiMessage[] = [];

  for (let i = 0; i < sliced.length; i += 1) {
    const item = sliced[i] as Record<string, unknown>;
    if (!item || typeof item !== 'object') continue;
    const role = item.role === 'assistant' ? 'assistant' : 'user';
    if (item.role === 'system') continue;

    let text = '';
    if (Array.isArray(item.parts)) {
      text = item.parts
        .map((part) => {
          if (part && typeof part === 'object' && (part as { type?: string }).type === 'text') {
            return String((part as { text?: string }).text || '');
          }
          return '';
        })
        .join('\n');
    } else if (typeof item.content === 'string') {
      text = item.content;
    }

    text = text.trim().slice(0, 800);
    if (!text) continue;

    messages.push({
      id: typeof item.id === 'string' ? item.id : `msg-${i}`,
      role,
      parts: [{ type: 'text', text }],
    });
  }

  if (messages.length === 0) return null;
  if (messages[messages.length - 1]?.role !== 'user') return null;
  return messages;
}
