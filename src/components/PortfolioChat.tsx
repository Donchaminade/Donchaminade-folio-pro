'use client';

import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { MotionIcon } from './MotionIcon';
import { useI18n } from '@/lib/i18n';

type Role = 'user' | 'assistant';
type Msg = { id: string; role: Role; text: string };

const spring = { type: 'spring' as const, stiffness: 420, damping: 28 };

function messageText(raw: string) {
  return raw.replace(/\s+\n/g, '\n').trim();
}

export default function PortfolioChat() {
  const { lang, t } = useI18n();
  const path = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>('button, textarea, a[href]')).filter(
        (node) => !node.hasAttribute('disabled'),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  };

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(false);
    const history = [...messages, { id: `u-${Date.now().toString(36)}`, role: 'user' as const, text: trimmed }];
    const assistantId = `a-${Date.now().toString(36)}`;
    setMessages(history);
    setInput('');
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Portfolio-Lang': lang,
        },
        signal: controller.signal,
        body: JSON.stringify({
          lang,
          messages: history.slice(-8).map((message) => ({
            id: message.id,
            role: message.role,
            parts: [{ type: 'text', text: message.text }],
          })),
        }),
      });
      if (!response.ok || !response.body) {
        setError(true);
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answer = '';
      const push = (next: string) => {
        answer = next;
        setMessages([...history, { id: assistantId, role: 'assistant', text: next }]);
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';
        for (const frame of frames) {
          const data = frame
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trim())
            .join('');
          if (!data || data === '[DONE]') continue;
          try {
            const event = JSON.parse(data) as { type?: string; delta?: string };
            if (event.type === 'text-delta' && event.delta) push(answer + event.delta);
          } catch {
            /* fragment incomplet */
          }
        }
      }
      if (!messageText(answer)) setError(true);
    } catch (err) {
      if ((err as { name?: string }).name !== 'AbortError') setError(true);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    void ask(input);
  };

  if (path.startsWith('/admin')) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="portfolio-chat-dialog"
            aria-label={t.chatOpen}
            className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-cream text-ink shadow-[0_16px_40px_-12px_rgba(0,0,0,.55)]"
          >
            <MotionIcon icon={MessageCircle} size={22} effect="bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-end md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button type="button" aria-label={t.chatClose} className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] md:bg-ink/30" onClick={() => setOpen(false)} />
            <motion.div
              id="portfolio-chat-dialog"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ y: 48, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 28, opacity: 0, scale: 0.98 }}
              transition={spring}
              className="relative flex h-[100svh] w-full flex-col overflow-hidden border border-white/15 bg-ink/60 shadow-[0_24px_80px_-20px_rgba(0,0,0,.55)] backdrop-blur-2xl md:h-[min(720px,calc(100svh-3rem))] md:w-[26rem] md:rounded-3xl"
            >
              <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="min-w-0">
                  <p className="label inline-flex items-center gap-1.5 text-cream">
                    <MotionIcon icon={Sparkles} size={12} effect="spin" /> Assistant
                  </p>
                  <h2 id={titleId} className="mt-1 font-display text-2xl font-black uppercase leading-none">{t.chatTitle}</h2>
                  <p id={descId} className="mt-2 text-base leading-relaxed text-mist">{t.chatLead}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label={t.chatClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20">
                  <MotionIcon icon={X} size={18} effect="spin" />
                </button>
              </header>

              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.length === 0 && (
                  <p className="rounded-3xl border border-white/10 bg-white/[.04] p-4 text-base leading-relaxed text-white/85">{t.chatHello}</p>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <p className={`max-w-[90%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-base leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-cream text-ink' : 'rounded-bl-md border border-white/10 bg-white/[.06] text-white/90'}`}>
                        {message.text}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {busy && (
                  <div className="flex items-center gap-2 text-base text-mist" aria-live="polite">
                    <span className="flex h-8 items-center gap-1 rounded-full border border-white/15 bg-white/[.04] px-3">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="h-1.5 w-1.5 rounded-full bg-cream"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                        />
                      ))}
                    </span>
                    {t.chatWriting}
                  </div>
                )}
                {error && <p className="text-base text-cream" role="alert">{t.chatError}</p>}
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {t.chatSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        type="button"
                        onClick={() => void ask(suggestion.text)}
                        className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/[.04] px-4 text-base"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="px-5 pb-2 text-sm leading-relaxed text-white/50">{t.chatNote}</p>
              <form onSubmit={submit} className="border-t border-white/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                <div className="flex items-end gap-2">
                  <label htmlFor="portfolio-chat-input" className="sr-only">{t.chatAsk}</label>
                  <textarea
                    id="portfolio-chat-input"
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submit();
                      }
                    }}
                    maxLength={800}
                    placeholder={t.chatPlaceholder}
                    className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none focus:border-cream"
                  />
                  {busy ? (
                    <button type="button" onClick={stop} className="inline-flex min-h-11 items-center rounded-2xl border border-white/20 px-4 text-sm font-semibold uppercase tracking-wide">
                      {t.chatStop}
                    </button>
                  ) : (
                    <button type="submit" disabled={!input.trim()} aria-label={t.chatSend} className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-ink disabled:opacity-40">
                      <MotionIcon icon={Send} size={16} effect="slide" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
