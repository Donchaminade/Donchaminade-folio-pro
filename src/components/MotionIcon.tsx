'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useRef } from 'react';

export type IconEffect = 'lift' | 'spin' | 'bounce' | 'slide' | 'slideBack' | 'heart' | 'draw';

const spring = { type: 'spring' as const, stiffness: 420, damping: 17 };

function hoverOf(effect: IconEffect) {
  if (effect === 'spin') return { rotate: 18, scale: 1.08 };
  if (effect === 'bounce') return { y: -4, scale: 1.08 };
  if (effect === 'slide') return { x: 5, y: -2 };
  if (effect === 'slideBack') return { x: -5, y: -2 };
  if (effect === 'heart') return { scale: [1, 1.18, 1] };
  if (effect === 'draw') return { scale: 1.06 };
  return { y: -2, scale: 1.08 };
}

function drawStroke(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll('path, line, polyline, circle, ellipse, rect').forEach((node) => {
    const geom = node as SVGGeometryElement;
    if (typeof geom.getTotalLength !== 'function') return;
    let len = 28;
    try { len = geom.getTotalLength() || 28; } catch { len = 28; }
    geom.style.transition = 'none';
    geom.style.strokeDasharray = `${len}`;
    geom.style.strokeDashoffset = `${len}`;
    geom.getBoundingClientRect();
    geom.style.transition = 'stroke-dashoffset .55s ease';
    geom.style.strokeDashoffset = '0';
  });
}

export function MotionIcon({
  icon: Icon,
  size = 18,
  effect = 'lift',
  className = '',
  strokeWidth = 2,
  filled = false,
}: {
  icon: LucideIcon;
  size?: number;
  effect?: IconEffect;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const glyph = <Icon size={size} className={filled ? 'fill-current' : undefined} strokeWidth={strokeWidth} aria-hidden />;
  if (reduce) return glyph;
  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className}`}
      whileHover={hoverOf(effect)}
      whileTap={{ scale: 0.88 }}
      transition={spring}
      onHoverStart={() => { if (effect === 'draw') drawStroke(ref.current); }}
      onTapStart={() => { if (effect === 'draw') drawStroke(ref.current); }}
    >
      {glyph}
    </motion.span>
  );
}

/** Pulsation légère des boutons d’appel à l’action. */
export function Heartbeat({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = !!useReducedMotion();
  return (
    <motion.span
      className={`inline-flex ${className}`}
      animate={reduce ? undefined : { scale: [1, 1.045, 1] }}
      transition={reduce ? undefined : { duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}
