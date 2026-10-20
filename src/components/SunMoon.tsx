'use client';
import { motion, useReducedMotion } from 'framer-motion';

const rays = [0, 45, 90, 135, 180, 225, 270, 315];
const spring = { type: 'spring' as const, stiffness: 320, damping: 22 };

/** Soleil dont les rayons se rétractent et le disque se creuse en lune. */
export default function SunMoon({ light }: { light: boolean }) {
  const reduce = !!useReducedMotion();
  const jump = reduce ? { duration: 0 } : spring;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="overflow-visible">
      <defs>
        <mask id="sunmoon-mask">
          <rect width="24" height="24" fill="white" />
          <motion.circle
            cy="9.5"
            fill="black"
            initial={false}
            animate={{ cx: light ? 30 : 16.5, r: light ? 0 : 6.2 }}
            transition={jump}
          />
        </mask>
      </defs>
      <motion.circle
        cy="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        mask="url(#sunmoon-mask)"
        initial={false}
        animate={{ cx: light ? 12 : 11, r: light ? 4 : 6 }}
        transition={jump}
      />
      {rays.map((deg) => (
        <motion.line
          key={deg}
          x1="12"
          y1="2.2"
          x2="12"
          y2="4.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: '12px 12px' }}
          initial={false}
          animate={{ rotate: deg, scale: light ? 1 : 0, opacity: light ? 1 : 0 }}
          transition={jump}
        />
      ))}
    </svg>
  );
}
