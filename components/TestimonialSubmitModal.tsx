import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquareQuote, Send } from 'lucide-react';
import { submitTestimonial, isApiConfigured } from '../lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full mt-0.5 px-3 py-2 rounded-lg bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20';

const LABEL_CLS = 'text-[9px] font-black uppercase tracking-widest text-slate-500';

const TestimonialSubmitModal: React.FC<Props> = ({ open, onClose }) => {
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const reset = () => {
    setQuote('');
    setName('');
    setEmail('');
    setRole('');
    setCompany('');
    setPhoto(null);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isApiConfigured()) {
      setError('API non disponible — vérifiez XAMPP et le proxy Vite.');
      return;
    }
    setLoading(true);
    try {
      const msg = await submitTestimonial(
        { quote, name, email: email || undefined, role, company },
        photo ? [photo] : []
      );
      setSuccess(msg);
      setTimeout(() => handleClose(), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400 shrink-0">
                  <MessageSquareQuote size={18} />
                </div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                  Témoigner
                </h2>
              </div>
              <button type="button" onClick={handleClose} className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-2.5 overflow-hidden">
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                Relu avant publication sur le site.
              </p>

              <div>
                <label className={LABEL_CLS}>Témoignage *</label>
                <textarea
                  className={`${INPUT_CLS} resize-none h-16`}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  minLength={30}
                  maxLength={3000}
                  placeholder="Min. 30 caractères…"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Nom *</label>
                  <input className={INPUT_CLS} value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
                </div>
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Email</label>
                  <input type="email" className={INPUT_CLS} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Fonction</label>
                  <input className={INPUT_CLS} value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Entreprise</label>
                  <input className={INPUT_CLS} value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Photo</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-violet-600 file:text-white file:font-bold"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              {success && <p className="text-xs text-emerald-500 font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest"
              >
                <Send size={14} />
                {loading ? 'Envoi…' : 'Envoyer'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialSubmitModal;
