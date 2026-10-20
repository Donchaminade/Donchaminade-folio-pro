'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { nav } from '@/lib/data';

export default function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-ink/60 px-5 py-4 backdrop-blur-md md:px-10">
      <a href="#accueil" className="font-display text-[12px] font-black tracking-[.2em]">CHAMINADE ADJOLOU</a>
      <nav className="hidden gap-7 md:flex">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={`label relative pb-1 transition-colors ${active === n.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>
            {n.label}
            {active === n.id && <motion.span layoutId="underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-white" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
          </a>
        ))}
      </nav>
      <button className="md:hidden" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      {open && (
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 top-full flex flex-col gap-5 border-b border-white/10 bg-ink/95 px-5 py-6 md:hidden">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className={`label ${active === n.id ? 'text-white underline underline-offset-8' : 'text-white/60'}`}>{n.label}</a>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
}
