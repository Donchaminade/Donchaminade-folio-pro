'use client';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Controls from './Controls';

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
  const links = LINKS.map((link) => ({
    ...link,
    label: t.links[link.key],
    on: link.href === '/blog' ? path.startsWith('/blog') : path === link.href,
  }));

  return (
    <motion.header initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/60 backdrop-blur-md">
      <div className="wrap flex items-center gap-3 py-2 md:py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/favicon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-display text-sm font-black tracking-tight sm:text-base">Chaminade<span className="font-serif text-base font-normal italic text-cream">.dev</span></span>
        </Link>
        <nav aria-label={t.links.profile} className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={link.on ? 'page' : undefined}
              className={`label relative whitespace-nowrap pb-1 ${link.on ? 'text-white' : 'text-white/55 hover:text-white'}`}>
              {link.label}
              {link.on && <motion.span layoutId="nav-line" className="absolute inset-x-0 -bottom-0.5 h-px bg-cream" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Controls />
          <a href="/#contact" className="hidden min-h-11 items-center rounded-full bg-cream px-4 text-sm font-medium text-ink lg:inline-flex">{t.contactCta}</a>
          <button type="button" className="grid h-11 w-11 place-items-center lg:hidden" aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-ink/95 lg:hidden">
          <div className="wrap grid gap-1 py-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center text-base ${link.on ? 'text-cream' : 'text-white/80'}`}>{link.label}</Link>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="flex min-h-11 items-center text-base text-cream">{t.contactCta}</a>
          </div>
        </nav>
      )}
    </motion.header>
  );
}
