'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const ease = 'easeOut' as const;

export const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const stagger = (step: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: step } },
});

export const cardPop = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

export const badgePop = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
};

const view = { once: true, amount: 0.15 } as const;

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={reveal} initial="hidden" whileInView="show" viewport={view}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '', step = 0.1 }: { children: React.ReactNode; className?: string; step?: number }) {
  return (
    <motion.div className={className} variants={stagger(step)} initial="hidden" whileInView="show" viewport={view}>
      {children}
    </motion.div>
  );
}

export function Orbs() {
  const reduce = !!useReducedMotion();
  const spots = [
    { className: 'left-[-8%] top-[-6%] h-72 w-72 bg-[rgba(217,208,193,.22)]', drift: { x: [0, 36, -12, 0], y: [0, 24, -18, 0] } },
    { className: 'right-[-10%] top-[18%] h-80 w-80 bg-[rgba(113,113,122,.28)]', drift: { x: [0, -28, 16, 0], y: [0, -22, 30, 0] } },
    { className: 'bottom-[-12%] left-[28%] h-64 w-64 bg-[rgba(255,255,255,.08)]', drift: { x: [0, 20, -24, 0], y: [0, -16, 12, 0] } },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {spots.map((spot) => (
        <motion.span
          key={spot.className}
          className={`absolute rounded-full blur-3xl ${spot.className}`}
          animate={reduce ? undefined : spot.drift}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function Pressable({
  children,
  className = '',
  type = 'button',
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const reduce = !!useReducedMotion();
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={reduce || disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.2, ease }}
    >
      {children}
    </motion.button>
  );
}

type Phase = 'idle' | 'loading' | 'success' | 'error';

export function LiquidButton({
  children,
  action,
  tone = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  action: () => Promise<void>;
  tone?: 'primary' | 'danger';
  className?: string;
}) {
  const reduce = !!useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (phase !== 'success' && phase !== 'error') return undefined;
    const id = window.setTimeout(() => setPhase('idle'), 2500);
    return () => window.clearTimeout(id);
  }, [phase]);

  const run = async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    try {
      await action();
      setPhase('success');
    } catch {
      setPhase('error');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={run}
      disabled={phase !== 'idle'}
      aria-busy={phase === 'loading'}
      data-phase={phase}
      whileHover={reduce || phase !== 'idle' ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce || phase !== 'idle' ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.2, ease }}
      className={`liquid liquid-${tone} ${phase === 'error' ? 'is-error' : ''} ${phase === 'success' ? 'is-success' : ''} ${className}`}
    >
      <span className={`liquid-wave ${phase === 'loading' ? 'is-on' : ''}`} aria-hidden />
      <span className={`liquid-wave liquid-wave-b ${phase === 'loading' ? 'is-on' : ''}`} aria-hidden />
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">
        {phase === 'success' ? <Check size={16} strokeWidth={2.5} /> : null}
        {children}
      </span>
    </motion.button>
  );
}
