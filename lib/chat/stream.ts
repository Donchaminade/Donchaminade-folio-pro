import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';

export function textToUiResponse(
  text: string,
  headers?: Record<string, string>
): Response {
  const stream = createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: 'start' });
      writer.write({ type: 'text-start', id: 'answer' });
      const chunkSize = 80;
      for (let i = 0; i < text.length; i += chunkSize) {
        writer.write({
          type: 'text-delta',
          id: 'answer',
          delta: text.slice(i, i + chunkSize),
        });
      }
      writer.write({ type: 'text-end', id: 'answer' });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: {
      'X-Chat-Mode': 'fallback',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;
    const parts = message.parts ?? [];
    const text = parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (text) return text;
  }
  return '';
}

export function normalizeMessages(raw: unknown): UIMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const sliced = raw.slice(-8);
  const messages: UIMessage[] = [];

  for (let i = 0; i < sliced.length; i += 1) {
    const item = sliced[i] as Record<string, unknown>;
    if (!item || typeof item !== 'object') continue;
    const role = item.role === 'assistant' || item.role === 'system' ? item.role : 'user';
    if (role === 'system') continue;

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
