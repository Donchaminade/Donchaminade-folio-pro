import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, Send, FileText, Video, Check, ChevronDown, Calendar, Plus, Trash2, Upload, Paperclip } from 'lucide-react';
import { submitCollaboration, isApiConfigured } from '../lib/api';
import { shownApiMessage, useI18n } from '../lib/i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCEPT_FILES =
  '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/jpeg,image/png,image/webp,image/gif,application/pdf';

const MAX_FILES = 8;
const MAX_FILE_MB = 12;

const PLATFORM_VALUES = ['google_meet', 'zoom', 'teams', 'whatsapp', 'phone', 'other'] as const;

const INPUT_CLS =
  'w-full mt-1 px-4 py-3 rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[var(--accent-soft)] focus:ring-2 focus:ring-[var(--accent-soft)]/20';

const DATETIME_CLS =
  `${INPUT_CLS} dark:[color-scheme:dark] [color-scheme:light] cursor-pointer`;

function formatSlotLabel(isoLocal: string, locale: string): string {
  if (!isoLocal) return '';
  const d = new Date(isoLocal);
  if (Number.isNaN(d.getTime())) return isoLocal;
  return d.toLocaleString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function minDateTimeLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const initialForm = () => ({
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  collaboration_brief: '',
  has_documents: false,
  documents_details: '',
  meeting_platform: 'google_meet',
  meeting_notes: '',
});

interface PlatformSelectProps {
  value: string;
  onChange: (v: string) => void;
}

const PlatformSelect: React.FC<PlatformSelectProps> = ({ value, onChange }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = t.platforms[value as keyof typeof t.platforms];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${INPUT_CLS} flex items-center justify-between text-left`}
      >
        <span>{selected ?? t.choose}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 shadow-xl py-1"
          >
            {PLATFORM_VALUES.map((platform) => (
              <li key={platform}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(platform);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    platform === value
                      ? 'bg-[var(--ink)]/15 text-[var(--accent-muted)] dark:text-[var(--accent-soft)] font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {t.platforms[platform]}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const CollaborateModal: React.FC<Props> = ({ open, onClose }) => {
  const { lang, t } = useI18n();
  const [form, setForm] = useState(initialForm);
  const [slotDates, setSlotDates] = useState<string[]>(['']);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ReturnType<typeof initialForm>, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm());
    setSlotDates(['']);
    setDocFiles([]);
    setFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next: File[] = [...docFiles];
    for (let i = 0; i < incoming.length; i++) {
      const f = incoming[i];
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setFeedback({ type: 'error', text: t.fileTooBig(f.name, MAX_FILE_MB) });
        return;
      }
      if (next.length >= MAX_FILES) {
        setFeedback({ type: 'error', text: t.maxFiles(MAX_FILES) });
        return;
      }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) {
        next.push(f);
      }
    }
    setDocFiles(next);
    setFeedback(null);
  };

  const removeFile = (index: number) => {
    setDocFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiConfigured()) {
      setFeedback({ type: 'error', text: t.serviceDown });
      return;
    }

    if (form.has_documents && docFiles.length === 0 && !form.documents_details.trim()) {
      setFeedback({
        type: 'error',
        text: t.docsMissing,
      });
      return;
    }

    const filledSlots = slotDates.filter(Boolean);
    const meeting_slots = filledSlots.map((s) => `• ${formatSlotLabel(s, lang === 'en' ? 'en-GB' : 'fr-FR')}`).join('\n');

    setLoading(true);
    setFeedback(null);
    try {
      const msg = await submitCollaboration(
        {
          ...form,
          has_documents: form.has_documents || docFiles.length > 0,
          meeting_slots,
        },
        docFiles
      );
      setFeedback({ type: 'success', text: shownApiMessage(lang, msg, t.collabSent) });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2500);
    } catch (err) {
      setFeedback({ type: 'error', text: shownApiMessage(lang, err instanceof Error ? err.message : '', t.sendError) });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar rounded-t-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--ink)]/20 text-[var(--accent)] dark:text-[var(--accent-soft)]">
                <Handshake size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">{t.collabTitle}</h2>
                <p className="text-xs text-slate-500">{t.collabLead}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500" aria-label={t.closeDialog}>
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.name} *</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={INPUT_CLS} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.email} *</label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className={INPUT_CLS} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.phone}</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={INPUT_CLS} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.org}</label>
                <input value={form.company} onChange={(e) => update('company', e.target.value)} className={INPUT_CLS} />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.subject}</label>
              <input
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
                placeholder={t.subjectPh}
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.need} *</label>
              <textarea
                required
                rows={5}
                value={form.collaboration_brief}
                onChange={(e) => update('collaboration_brief', e.target.value)}
                placeholder={t.needPh}
                className={`${INPUT_CLS} resize-none`}
              />
            </div>

            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/15 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.has_documents}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    update('has_documents', checked);
                    if (!checked) {
                      setDocFiles([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-[var(--accent)]"
                />
                <span className="flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                  <FileText size={16} className="text-[var(--accent-soft)] shrink-0 mt-0.5" /> {t.docs}
                </span>
              </label>
              {form.has_documents && (
                <div className="space-y-3 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPT_FILES}
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-[var(--accent-soft)]/40 bg-[var(--accent-soft)]/5 hover:bg-[var(--ink-muted)]/10 hover:border-[var(--accent-soft)]/60 transition-all"
                  >
                    <Upload size={28} className="text-[var(--accent-soft)]" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {t.addFiles}
                    </span>
                    <span className="text-[10px] text-slate-500 text-center px-4">
                      {t.fileHint(MAX_FILES, MAX_FILE_MB)}
                    </span>
                  </button>

                  {docFiles.length > 0 && (
                    <ul className="space-y-2">
                      {docFiles.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                        >
                          <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 min-w-0">
                            <Paperclip size={14} className="shrink-0 text-[var(--accent-soft)]" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(1)} {t.sizeUnit})
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 shrink-0"
                            aria-label={t.remove}
                          >
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <textarea
                    rows={2}
                    value={form.documents_details}
                    onChange={(e) => update('documents_details', e.target.value)}
                    placeholder={t.notePh}
                    className={`${INPUT_CLS} mt-0`}
                  />
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/15 space-y-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Video size={16} className="text-blue-500" /> {t.slot}
              </p>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.platform}</label>
                <PlatformSelect value={form.meeting_platform} onChange={(v) => update('meeting_platform', v)} />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
                  <Calendar size={12} /> {t.slotDate}
                </label>
                {slotDates.map((slot, index) => (
                  <div key={index} className="flex gap-2 items-center min-w-0">
                    <input
                      type="datetime-local"
                      value={slot}
                      min={minDateTimeLocal()}
                      onChange={(e) => {
                        const next = [...slotDates];
                        next[index] = e.target.value;
                        setSlotDates(next);
                      }}
                      className={`${DATETIME_CLS} min-w-0`}
                      aria-label={t.slotN(index + 1)}
                    />
                    {slotDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSlotDates((s) => s.filter((_, i) => i !== index))}
                        className="p-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 shrink-0"
                        aria-label={t.removeSlot}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {slotDates.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setSlotDates((s) => [...s, ''])}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] dark:text-[var(--accent-soft)] hover:text-[var(--accent-soft)]"
                  >
                    <Plus size={14} /> {t.addSlot}
                  </button>
                )}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.notes}</label>
                <textarea
                  rows={2}
                  value={form.meeting_notes}
                  onChange={(e) => update('meeting_notes', e.target.value)}
                  placeholder={t.notesPh}
                  className={`${INPUT_CLS} resize-none`}
                />
              </div>
            </div>

            {feedback && (
              <p
                className={`text-center text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center justify-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {feedback.type === 'success' && <Check size={14} />}
                {feedback.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-4 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-[0.14em] rounded-2xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {t.sendRequest}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CollaborateModal;
