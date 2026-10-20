'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { gallery } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import { MotionIcon } from './MotionIcon';

const spring = { type: 'spring' as const, stiffness: 260, damping: 28 };

function useNarrow() {
  return useSyncExternalStore(
    (on) => {
      const mq = window.matchMedia('(max-width: 767px)');
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    },
    () => window.matchMedia('(max-width: 767px)').matches,
    () => true,
  );
}

function wrap(offset: number, count: number) {
  let delta = offset;
  const half = count / 2;
  if (delta > half) delta -= count;
  if (delta < -half) delta += count;
  return delta;
}

export default function GlassyGallery() {
  const { t } = useI18n();
  const reduce = !!useReducedMotion();
  const narrow = useNarrow();
  const count = gallery.length;
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const dragged = useRef(false);
  const step = narrow ? 78 : 198;

  const go = (dir: number) => setIndex((value) => (value + dir + count) % count);

  useEffect(() => {
    if (reduce || hover || dragging || open || count < 2) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % count), 4200);
    return () => window.clearInterval(id);
  }, [reduce, hover, dragging, open, count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeId = `gallery-shot-${index}`;

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <motion.div
          className="relative mx-auto h-[380px] w-full cursor-grab touch-pan-y active:cursor-grabbing sm:h-[500px]"
          style={{ perspective: 1200 }}
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragStart={() => { dragged.current = false; setDragging(true); }}
          onDrag={(_, info) => { if (Math.abs(info.offset.x) > 8) dragged.current = true; }}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -48) go(1);
            else if (info.offset.x > 48) go(-1);
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.nav.galerie}
        >
          {gallery.map((src, i) => {
            const offset = wrap(i - index, count);
            if (Math.abs(offset) > 2) return null;
            const active = offset === 0;
            const srcSafe = encodeURI(src);
            return (
              <motion.button
                key={src}
                type="button"
                className="glass-card absolute left-1/2 top-1/2 w-[min(64vw,280px)] overflow-hidden rounded-[28px] p-2 backdrop-blur-xl"
                style={{ transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * step}px)`,
                  y: '-50%',
                  rotateY: reduce ? 0 : offset * -26,
                  scale: active ? 1.1 : Math.abs(offset) === 1 ? 0.82 : 0.72,
                  opacity: active ? 1 : Math.abs(offset) === 1 ? 0.62 : 0.38,
                  filter: reduce || active ? 'blur(0px)' : `blur(${Math.abs(offset) * 3}px)`,
                  zIndex: 10 - Math.abs(offset),
                }}
                transition={spring}
                onClick={() => {
                  if (dragged.current) { dragged.current = false; return; }
                  if (active) setOpen(true);
                  else setIndex(i);
                }}
                aria-current={active ? 'true' : undefined}
                aria-label={active ? t.galleryOpen : t.photoAlt}
              >
                <motion.img
                  src={srcSafe}
                  alt={t.photoAlt}
                  draggable={false}
                  layoutId={active ? activeId : undefined}
                  className="aspect-[3/4] w-full rounded-[22px] object-cover"
                />
              </motion.button>
            );
          })}
        </motion.div>

        <button type="button" onClick={() => go(-1)} aria-label={t.galleryPrev}
          className="absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/45 text-[#fff] backdrop-blur md:left-2">
          <MotionIcon icon={ChevronLeft} size={18} effect="slideBack" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={t.galleryNext}
          className="absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/45 text-[#fff] backdrop-blur md:right-2">
          <MotionIcon icon={ChevronRight} size={18} effect="slide" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1" role="tablist" aria-label={t.nav.galerie}>
        {gallery.map((src, i) => (
          <button key={src} type="button" role="tab" aria-selected={i === index} aria-label={`${i + 1}`}
            onClick={() => setIndex(i)} className="grid h-11 w-7 place-items-center">
            <span className={`block h-1.5 rounded-full ${i === index ? 'w-6 bg-cream' : 'w-1.5 bg-current opacity-40'}`} />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img
              layoutId={activeId}
              src={encodeURI(gallery[index])}
              alt={t.photoAlt}
              className="max-h-[86svh] max-w-[min(94vw,980px)] rounded-[28px] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button type="button" onClick={() => setOpen(false)} aria-label={t.galleryClose}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-[#fff]">
              <MotionIcon icon={X} size={18} effect="spin" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
