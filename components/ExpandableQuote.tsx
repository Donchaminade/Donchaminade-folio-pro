import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DEFAULT_MAX = 140;

interface ExpandableQuoteProps {
  text: string;
  maxLength?: number;
  className?: string;
  modalTitle?: string;
}

const ExpandableQuote: React.FC<ExpandableQuoteProps> = ({
  text,
  maxLength = DEFAULT_MAX,
  className = 'text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed',
  modalTitle = 'Témoignage complet',
}) => {
  const [open, setOpen] = useState(false);
  const trimmed = text.trim();
  const isLong = trimmed.length > maxLength;
  const preview = isLong ? trimmed.slice(0, maxLength).trimEnd() + '…' : trimmed;

  return (
    <>
      <p className={className}>
        &ldquo;{preview}&rdquo;
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
        >
          Lire tout
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quote-modal-title"
              className="relative max-w-lg w-full p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
              <h3 id="quote-modal-title" className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 pr-8">
                {modalTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed italic">
                &ldquo;{trimmed}&rdquo;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableQuote;
