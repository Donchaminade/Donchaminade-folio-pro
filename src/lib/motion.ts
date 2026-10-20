import type { Variants, Transition } from 'framer-motion';

/** Style « Animated Website » (@code.xr) : fondu + montée, easeOut 0,6 s. */
export const ease = 'easeOut' as const;
export const easeSoft: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const stagger = (step = 0.15, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** Props prêtes à étaler sur un motion.* : entrée au scroll (une fois). */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay, ease } as Transition,
});

export const slideIn = (x: number, delay = 0) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, delay, ease } as Transition,
});

/** Groupe parent pour enfants `variants={fadeUp}` déclenché au scroll. */
export const inViewGroup = (step = 0.15, delay = 0) => ({
  variants: stagger(step, delay),
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.2 },
});

/** Carte flottante inclinée : dérive + fondu en boucle (cycle 2–4 s). */
export const floatingCard = (i: number, tilt: number): Variants => ({
  hidden: { opacity: 0, y: 40, rotate: tilt },
  show: {
    opacity: [0, 1],
    y: 0,
    transition: { duration: 0.6, delay: 0.3 + i * 0.12, ease },
  },
  drift: {
    x: [0, 6 * (i % 2 ? 1 : -1), 0],
    y: [0, -8, 0],
    rotate: [tilt, tilt + (i % 2 ? 1.5 : -1.5), tilt],
    opacity: i === 0 ? 1 : [0.85, 0.55, 0.85],
    transition: { duration: 2.6 + i * 0.45, repeat: Infinity, ease: 'easeInOut' },
  },
});

export const hoverLift = { whileHover: { y: -8, scale: 1.02 }, whileTap: { scale: 0.97 } };
