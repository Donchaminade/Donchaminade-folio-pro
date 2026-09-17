import React, { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';

const SUGGESTIONS = [
  'Quels sont tes projets ?',
  'Parle-moi de ton expérience PyCon',
  'Derniers blogs ?',
];

function messageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  return (message.parts ?? [])
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text as string)
    .join('\n');
}

const PortfolioChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const busy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = (): HTMLElement[] => {
      if (!panel) return [];
      return Array.from(
        panel.querySelectorAll(
          'button, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node): node is HTMLElement => {
        return (
          node instanceof HTMLElement &&
          !node.hasAttribute('disabled') &&
          node.getAttribute('aria-hidden') !== 'true'
        );
      });
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = focusables();
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
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => inputRef.current?.focus(), 40);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [open]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    clearError();
    sendMessage({ text });
    setInput('');
  };

  const ask = (text: string) => {
    if (busy) return;
    clearError();
    sendMessage({ text });
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="portfolio-chat-dialog"
            aria-label="Ouvrir l’assistant portfolio"
            className="fixed left-3 bottom-[5.5rem] lg:left-5 lg:bottom-8 z-[65] min-h-12 pl-3 pr-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] border border-white/20 flex items-center gap-2.5 touch-manipulation"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <MessageCircle size={18} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center lg:items-end lg:justify-start p-0 sm:p-3 lg:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Fermer l’assistant"
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="portfolio-chat-dialog"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ y: 28, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative w-full h-[min(100dvh,100%)] sm:h-auto sm:max-h-[min(88dvh,720px)] sm:max-w-md lg:w-[26rem] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 sm:rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.28)] flex flex-col overflow-hidden"
            >
              <header className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles size={12} /> Portfolio
                  </div>
                  <h2 id={titleId} className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Assistant Donchaminade
                  </h2>
                  <p id={descId} className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Questions sur le profil, les projets, le parcours et les blogs publics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-11 min-w-11 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  aria-label="Fermer l’assistant"
                >
                  <X size={18} />
                </button>
              </header>

              <div ref={listRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10 p-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Bonjour — je peux parler de mon parcours, de PyCon Togo, du coaching YAS / Next Gen, des projets et des derniers articles. Hors sujet, je passerai mon tour.
                  </div>
                )}

                {messages.map((message) => {
                  const text = messageText(message);
                  if (!text) return null;
                  const mine = message.role === 'user';
                  return (
                    <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          mine
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 rounded-bl-md'
                        }`}
                      >
                        {text}
                      </div>
                    </div>
                  );
                })}

                {busy && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Loader2 size={14} className="animate-spin" />
                    Rédaction en cours…
                  </div>
                )}

                {error && (
                  <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
                    {error.message || 'Impossible de répondre pour le moment. Réessayez.'}
                  </p>
                )}

                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => ask(suggestion)}
                        className="text-left text-xs font-semibold px-3 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 min-h-11"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="px-4 sm:px-5 pb-2 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                Réponses à partir du contenu public du portfolio. Les échanges ne sont pas conservés.
              </p>

              <form
                onSubmit={submit}
                className="px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 border-t border-slate-200/80 dark:border-white/10"
              >
                <div className="flex items-end gap-2">
                  <label htmlFor="portfolio-chat-input" className="sr-only">
                    Votre question
                  </label>
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
                    placeholder="Ex. Quels sont tes projets ?"
                    className="flex-1 resize-none rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3.5 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 min-h-11 max-h-28"
                  />
                  {busy ? (
                    <button
                      type="button"
                      onClick={() => stop()}
                      className="min-h-11 min-w-11 rounded-2xl bg-slate-800 text-white text-[10px] font-black uppercase"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      aria-label="Envoyer le message"
                      className="min-h-11 min-w-11 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center"
                    >
                      <Send size={16} />
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
};

export default PortfolioChat;
