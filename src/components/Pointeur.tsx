'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Pointeur() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [on, setOn] = useState(false);
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setOn(true); document.body.classList.add('has-pointeur');
    const m = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setBig(!!(e.target as HTMLElement).closest('a,button')); };
    window.addEventListener('pointermove', m);
    return () => { window.removeEventListener('pointermove', m); document.body.classList.remove('has-pointeur'); };
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: big ? 44 : 12, height: big ? 44 : 12 }} transition={{ duration: 0.2 }} />
  );
}
