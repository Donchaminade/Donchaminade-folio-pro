import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquareQuote, ThumbsUp, Send } from 'lucide-react';
import { submitTestimonial, submitRecommendation, isApiConfigured } from '../lib/api';
import { StarRatingInput } from './StarRating';
import type { SocialProofKind } from '../lib/socialProof';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialKind?: SocialProofKind;
}

const INPUT_CLS =
  'w-full mt-0.5 px-3 py-2 rounded-lg bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20';

const LABEL_CLS = 'text-[9px] font-black uppercase tracking-widest text-slate-500';

const SocialProofSubmitModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  initialKind = 'testimonial',
}) => {
  const [kind, setKind] = useState<SocialProofKind>(initialKind);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      setKind(initialKind);
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open, initialKind]);

  const reset = () => {
    setText('');
    setName('');
    setEmail('');
    setRole('');
    setCompany('');
    setPhoto(null);
    setRating(0);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isTestimonial = kind === 'testimonial';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isApiConfigured()) {
      setError('API non disponible — vérifiez XAMPP et le proxy Vite.');
      return;
    }
    if (!isTestimonial && rating < 1) {
      setError('Choisissez une note entre 1 et 5 étoiles.');
      return;
    }

    setLoading(true);
    try {
      if (isTestimonial) {
        const msg = await submitTestimonial(
          { quote: text, name, email: email || undefined, role, company },
          photo ? [photo] : []
        );
        setSuccess(msg);
        onSuccess?.();
      } else {
        const msg = await submitRecommendation({
          name,
          email: email || undefined,
          role: role || undefined,
          company: company || undefined,
          body: text,
          rating,
        });
        setSuccess(msg);
        onSuccess?.();
      }
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isTestimonial ? 'bg-violet-600/20 text-violet-400' : 'bg-blue-600/20 text-blue-500'
                  }`}
                >
                  {isTestimonial ? <MessageSquareQuote size={18} /> : <ThumbsUp size={18} />}
                </div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                  Laisser un avis
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setKind('testimonial')}
                  className={`py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    isTestimonial
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Témoignage
                </button>
                <button
                  type="button"
                  onClick={() => setKind('recommendation')}
                  className={`py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    !isTestimonial
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Recommandation
                </button>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                {isTestimonial
                  ? 'Votre témoignage sera relu avant publication. Photo optionnelle.'
                  : 'Votre recommandation avec note sera publiée après envoi.'}
              </p>

              {!isTestimonial && (
                <div>
                  <span className={LABEL_CLS}>Votre note *</span>
                  <div className="mt-1">
                    <StarRatingInput value={rating} onChange={setRating} size={22} />
                  </div>
                </div>
              )}

              <div>
                <label className={LABEL_CLS}>{isTestimonial ? 'Témoignage *' : 'Message *'}</label>
                <textarea
                  className={`${INPUT_CLS} resize-none h-20`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  minLength={30}
                  maxLength={isTestimonial ? 3000 : 2000}
                  placeholder="Min. 30 caractères…"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Nom *</label>
                  <input
                    className={INPUT_CLS}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={120}
                  />
                </div>
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Email</label>
                  <input
                    type="email"
                    className={INPUT_CLS}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Fonction</label>
                  <input className={INPUT_CLS} value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Entreprise</label>
                  <input className={INPUT_CLS} value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                {isTestimonial && (
                  <div className="col-span-2">
                    <label className={LABEL_CLS}>Photo (optionnel)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                      className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-violet-600 file:text-white file:font-bold"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              {success && <p className="text-xs text-emerald-500 font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest ${
                  isTestimonial ? 'bg-violet-600 hover:bg-violet-500' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                <Send size={14} />
                {loading ? 'Envoi…' : isTestimonial ? 'Envoyer' : 'Publier'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofSubmitModal;
