'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MotionIcon } from './MotionIcon';
import { navIds } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import Controls from './Controls';

export default function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const links = navIds.map((id) => ({ id, label: t.nav[id] }));
  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/60 backdrop-blur-md">
      <div className="wrap flex items-center justify-between gap-2 py-2 md:py-3">
        <a href="#accueil" className="shrink-0 font-display text-[10px] font-black tracking-[.14em] sm:text-[12px] sm:tracking-[.2em]">CHAMINADE</a>
        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-3 overflow-x-auto xl:flex">
          {links.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={`label relative whitespace-nowrap pb-1 transition-colors ${active === n.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>
              {n.label}
              {active === n.id && <motion.span layoutId="underline" className="fg absolute inset-x-0 -bottom-0.5 h-px" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
            </a>
          ))}
          <a href="/blog" className="label whitespace-nowrap pb-1 text-white/50 hover:text-white">{t.nav.blog}</a>
        </nav>
        <div className="flex items-center gap-1">
          <Controls />
          <button className="grid h-11 w-11 shrink-0 place-items-center xl:hidden" aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen(!open)}>{open ? <MotionIcon icon={X} size={20} effect="spin" /> : <MotionIcon icon={Menu} size={20} effect="bounce" />}</button>
        </div>
      </div>
      {open && (
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/10 bg-ink/95 xl:hidden">
          <div className="wrap grid grid-cols-2 gap-x-4 gap-y-1 py-3">
            {links.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className={`label flex min-h-11 items-center ${active === n.id ? 'text-white underline underline-offset-8' : 'text-white/60'}`}>{n.label}</a>
            ))}
            <a href="/blog" onClick={() => setOpen(false)} className="label flex min-h-11 items-center text-white/60">{t.nav.blog}</a>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
