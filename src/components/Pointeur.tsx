'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Curseur souris uniquement. Inactif au toucher (pointer: coarse) et sans survol. */
export default function Pointeur() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [on, setOn] = useState(false);
  const [big, setBig] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const allowed = () => fine.matches && !coarse.matches;
    const hide = () => { setOn(false); document.body.classList.remove('has-pointeur'); };
    const move = (e: PointerEvent) => {
      if (!allowed() || e.pointerType !== 'mouse') { hide(); return; }
      setOn(true);
      document.body.classList.add('has-pointeur');
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement | null)?.closest?.('a,button'));
    };
    window.addEventListener('pointermove', move);
    fine.addEventListener('change', hide);
    coarse.addEventListener('change', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      fine.removeEventListener('change', hide);
      coarse.removeEventListener('change', hide);
      hide();
    };
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div className="pointeur-dot pointer-events-none fixed left-0 top-0 z-[90] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: big ? 44 : 12, height: big ? 44 : 12 }} transition={{ duration: 0.2 }} />
  );
}
