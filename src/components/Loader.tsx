'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const words = ['CHAMINADE', 'DONCHAMINADE'];

function Word({ text }: { text: string }) {
  const long = text.length > 10;
  return (
    <div className={`flex max-w-full justify-center font-display font-black whitespace-nowrap ${long ? 'wordmark' : 'text-[13vw] leading-none tracking-tight md:text-[9vw]'}`} style={{ perspective: 800 }}>
      {text.split('').map((c, i) => (
        <motion.span
          key={i}
          className="inline-block text-white [text-shadow:0_0_30px_rgba(255,255,255,.25)]"
          initial={{ y: -260, rotate: -200, rotateX: 90, opacity: 0 }}
          animate={{ y: [-260, 30, -18, 0], rotate: [-200, 15, -6, 0], rotateX: [90, 0, 0, 0], opacity: 1 }}
                    transition={{ duration: 0.75, delay: 0.12 + i * 0.07, times: [0, 0.6, 0.8, 1], ease: 'easeOut', opacity: { duration: 0.3, delay: 0.12 + i * 0.07 } }}
        >{c}</motion.span>
      ))}
    </div>
  );
}

export default function Loader({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const [step, setStep] = useState(0); // 0 point, 1 CHAMINADE, 2 DONCHAMINADE, 3 fin
  useEffect(() => {
    if (reduced) { onDone(); return; }
    const t = [setTimeout(() => setStep(1), 600), setTimeout(() => setStep(2), 1900), setTimeout(() => setStep(3), 3300), setTimeout(onDone, 3800)];
    return () => t.forEach(clearTimeout);
  }, [reduced, onDone]);

  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-ink" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} aria-label="Chargement">
      {step === 0 && (
        <motion.span className="h-4 w-4 rounded-full bg-white"
          initial={{ y: -300 }} animate={{ y: [-300, 0, -80, 0, -20, 0] }} transition={{ duration: 0.6, ease: 'easeOut' }} />
      )}
      {step === 1 && <Word key="w1" text={words[0]} />}
      {step >= 2 && <Word key="w2" text={words[1]} />}
      <span className="label absolute bottom-6 right-6 text-white/40">@donchaminade</span>
    </motion.div>
  );
}
