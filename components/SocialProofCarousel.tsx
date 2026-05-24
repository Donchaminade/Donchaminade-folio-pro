import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { GlassCard } from './GlassCard';
import ExpandableQuote from './ExpandableQuote';
import SocialProofBadge from './SocialProofBadge';
import { StarRatingDisplay } from './StarRating';
import { fetchPortfolio } from '../lib/api';
import { mediaUrl } from '../lib/media';
import {
  mergeSocialProof,
  filterSocialProof,
  SOCIAL_PROOF_FILTERS,
  type SocialProofFilter,
  type SocialProofItem,
} from '../lib/socialProof';
import type { Recommendation, Testimonial } from '../types';
import { TESTIMONIALS } from '../constants';

interface Props {
  filter: SocialProofFilter;
  onFilterChange: (f: SocialProofFilter) => void;
  refreshKey?: number;
}

const SocialProofCarousel: React.FC<Props> = ({ filter, onFilterChange, refreshKey = 0 }) => {
  const [allItems, setAllItems] = useState<SocialProofItem[]>(
    mergeSocialProof(TESTIMONIALS, [])
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    fetchPortfolio<{ testimonials: Testimonial[]; recommendations: Recommendation[] }>()
      .then((data) => {
        const merged = mergeSocialProof(data.testimonials ?? [], data.recommendations ?? []);
        if (merged.length > 0) {
          setAllItems(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const items = useMemo(() => filterSocialProof(allItems, filter), [allItems, filter]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const next = () =>
    setCurrentIndex((prev) => (items.length === 0 ? 0 : prev === items.length - 1 ? 0 : prev + 1));
  const prev = () =>
    setCurrentIndex((prev) => (items.length === 0 ? 0 : prev === 0 ? items.length - 1 : prev - 1));

  const emptyLabel =
    filter === 'recommendation'
      ? 'Aucune recommandation pour le moment.'
      : filter === 'testimonial'
        ? 'Aucun témoignage publié pour le moment.'
        : 'Aucun avis publié pour le moment.';

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        {SOCIAL_PROOF_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              filter === id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-500/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loaded && items.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          {emptyLabel}
        </p>
      )}

      {items.length > 0 && (
        <div className="relative max-w-2xl mx-auto group">
          <div className="overflow-hidden px-2 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[currentIndex]?.id ?? currentIndex}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {(() => {
                  const current = items[currentIndex];
                  const imageSrc = current.image ? mediaUrl(current.image) : '';
                  const isRec = current.kind === 'recommendation';

                  return (
                    <GlassCard className="p-5 md:p-8 rounded-2xl border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 relative">
                      <Quote className="absolute top-4 left-4 text-blue-500/10 w-12 h-12 -z-10" />
                      <div className="absolute top-4 right-4 z-10">
                        <SocialProofBadge kind={current.kind} />
                      </div>

                      <div className="relative z-10 flex gap-4 items-start pt-6">
                        {!isRec && imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={current.name}
                            className="w-14 h-14 rounded-full border-2 border-violet-500/50 object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-14 h-14 rounded-full border-2 shrink-0 flex items-center justify-center text-2xl ${
                              isRec
                                ? 'border-blue-500/40 bg-blue-500/10'
                                : 'border-violet-500/30 bg-slate-200 dark:bg-slate-800'
                            }`}
                            aria-hidden
                          >
                            {isRec ? '👍' : '👤'}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {isRec && current.rating != null && current.rating > 0 && (
                            <StarRatingDisplay rating={current.rating} size={14} className="mb-2" />
                          )}
                          <ExpandableQuote
                            text={current.text}
                            maxLength={140}
                            className="text-sm md:text-base text-slate-700 dark:text-slate-200 italic leading-relaxed"
                            modalTitle={
                              isRec
                                ? `Recommandation de ${current.name}`
                                : `Témoignage de ${current.name}`
                            }
                          />
                          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/5">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                              {current.name}
                            </h4>
                            {(current.role || current.company) && (
                              <p
                                className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${
                                  isRec ? 'text-blue-400' : 'text-violet-400'
                                }`}
                              >
                                {[current.role, current.company].filter(Boolean).join(' — ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute -left-1 md:left-0 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 border-slate-200 dark:border-white/10"
                aria-label="Précédent"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute -right-1 md:right-0 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 border-slate-200 dark:border-white/10"
                aria-label="Suivant"
              >
                <ChevronRight size={20} />
              </button>

              <div className="flex justify-center gap-2 mt-5">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === currentIndex ? 'w-8 bg-blue-600 dark:bg-blue-500' : 'w-3 bg-slate-200 dark:bg-white/10'
                    }`}
                    aria-label={`Avis ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialProofCarousel;
