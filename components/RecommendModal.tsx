import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, Send } from 'lucide-react';
import { submitRecommendation, isApiConfigured } from '../lib/api';
import { StarRatingInput } from './StarRating';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const INPUT_CLS =
  'w-full mt-0.5 px-3 py-2 rounded-lg bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20';

const LABEL_CLS = 'text-[9px] font-black uppercase tracking-widest text-slate-500';

const RecommendModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
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
    setName('');
    setEmail('');
    setRole('');
    setCompany('');
    setBody('');
    setRating(0);
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
      setError('API non disponible en local — vérifiez XAMPP et le proxy Vite.');
      return;
    }
    if (rating < 1) {
      setError('Choisissez une note entre 1 et 5 étoiles.');
      return;
    }
    setLoading(true);
    try {
      const msg = await submitRecommendation({
        name,
        email: email || undefined,
        role: role || undefined,
        company: company || undefined,
        body,
        rating,
      });
      setSuccess(msg);
      onSuccess?.();
      setTimeout(() => handleClose(), 2000);
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
                <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-500 shrink-0">
                  <ThumbsUp size={18} />
                </div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                  Me recommander
                </h2>
              </div>
              <button type="button" onClick={handleClose} className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-2.5 overflow-hidden">
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <span className={LABEL_CLS}>Votre note *</span>
                <div className="mt-1">
                  <StarRatingInput value={rating} onChange={setRating} size={22} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Nom *</label>
                  <input className={INPUT_CLS} value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
                </div>
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Email</label>
                  <input type="email" className={INPUT_CLS} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Fonction</label>
                  <input className={INPUT_CLS} value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Entreprise</label>
                  <input className={INPUT_CLS} value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Message *</label>
                <textarea
                  className={`${INPUT_CLS} resize-none h-16`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  minLength={30}
                  maxLength={2000}
                  placeholder="Min. 30 caractères…"
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              {success && <p className="text-xs text-emerald-500 font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest"
              >
                <Send size={14} />
                {loading ? 'Envoi…' : 'Publier'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecommendModal;
