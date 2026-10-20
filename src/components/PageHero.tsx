'use client';
import { motion } from 'framer-motion';

export default function PageHero({ kicker, title, italic, lead }: { kicker: string; title: string; italic?: string; lead?: string }) {
  return (
    <header className="wrap pb-4 pt-28 md:pt-36">
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="label text-cream">{kicker}</motion.p>
      <h1 className="mt-3 overflow-hidden font-display text-[14vw] font-black uppercase leading-[.82] tracking-tight md:text-[7.5vw]">
        <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }} className="metal block">{title}</motion.span>
        {italic && (
          <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.65, 0, 0.35, 1] }}
            className="block font-serif text-[0.72em] font-normal normal-case italic text-cream">{italic}</motion.span>
        )}
      </h1>
      {lead && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">{lead}</motion.p>}
    </header>
  );
}
