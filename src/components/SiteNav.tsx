'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Controls from './Controls';
import { Heartbeat, MotionIcon } from './MotionIcon';

const LINKS = [
  { href: '/profil', key: 'profile' },
  { href: '/apropos', key: 'about' },
  { href: '/stack', key: 'stack' },
  { href: '/projets', key: 'projects' },
  { href: '/parcours', key: 'career' },
  { href: '/communaute', key: 'community' },
  { href: '/blog', key: 'blog' },
] as const;

export default function SiteNav() {
  const { t } = useI18n();
  const path = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const reduce = !!useReducedMotion();
  const links = LINKS.map((link) => ({
    ...link,
    label: t.links[link.key],
    on: link.href === '/blog' ? path.startsWith('/blog') : path === link.href,
  }));

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4 md:px-6">
      <div className={`nav-float mx-auto w-full max-w-[1440px] backdrop-blur-xl ${open ? 'rounded-3xl' : 'rounded-full'} px-3 py-2 md:px-4`}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
            <img src="/favicon.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            <span className="hidden min-[380px]:inline font-display text-[13px] font-black tracking-tight sm:text-base">Chaminade<span className="font-serif text-base font-normal italic text-cream">.dev</span></span>
          </Link>
          <nav aria-label={t.links.profile} className="hidden min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto xl:flex xl:gap-5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} aria-current={link.on ? 'page' : undefined}
                className="nav-link label whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Controls />
            <span className="hidden xl:inline-flex">
              <Heartbeat>
                <a href="/#contact" className="inline-flex min-h-11 items-center rounded-full bg-cream px-4 text-sm font-medium text-ink">{t.contactCta}</a>
              </Heartbeat>
            </span>
            <button type="button" className="grid h-10 w-10 shrink-0 place-items-center xl:hidden" aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen(!open)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'close' : 'open'} className="grid place-items-center"
                  initial={reduce ? false : { rotate: -80, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { rotate: 80, opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
                  {open ? <MotionIcon icon={X} size={20} effect="spin" /> : <MotionIcon icon={Menu} size={20} effect="bounce" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
        {open && (
          <nav className="mt-2 grid gap-2 border-t border-white/10 pt-2 xl:hidden">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={link.on ? 'page' : undefined}
                className="nav-link label min-h-11 w-full justify-start px-4">{link.label}</Link>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-full bg-cream px-4 text-sm font-medium text-ink">{t.contactCta}</a>
          </nav>
        )}
      </div>
    </header>
  );
}
