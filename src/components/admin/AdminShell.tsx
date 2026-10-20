'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Award, BarChart3, Briefcase, Cpu, FolderKanban, LayoutDashboard, Mail, Menu, MessageSquare,
  Newspaper, ScrollText, Sparkles, Star, UserRound, Users, X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminCopy, adminSectionIds, type AdminSectionId } from '@/lib/admin-copy';
import { useI18n } from '@/lib/i18n';
import Controls from '../Controls';
import { Orbs, Pressable } from './ui';

const icons: Record<AdminSectionId, typeof Mail> = {
  tableau: LayoutDashboard,
  blog: Newspaper,
  commentaires: MessageSquare,
  audit: ScrollText,
  technologies: Cpu,
  projets: FolderKanban,
  experiences: Briefcase,
  profil: UserRound,
  statistiques: BarChart3,
  temoignages: Star,
  recommandations: Star,
  communautes: Users,
  distinctions: Award,
  messages: Mail,
  competences: Sparkles,
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const path = usePathname() || '';
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const current = adminSectionIds.find((id) => path.endsWith(`/${id}`)) || 'tableau';

  useEffect(() => {
    let allowed = false;
    try { allowed = sessionStorage.getItem('admin-ui') === '1'; } catch { allowed = false; }
    if (!allowed) router.replace('/admin');
    else setReady(true);
  }, [router]);

  useEffect(() => { setOpen(false); }, [path]);

  const leave = () => {
    try { sessionStorage.removeItem('admin-ui'); } catch { /* déjà fermé */ }
    router.push('/admin');
  };

  if (!ready) {
    return <main className="admin-root min-h-[100dvh]" />;
  }

  return (
    <div className="admin-root relative min-h-[100dvh] overflow-x-clip">
      <Orbs />
      {open ? <motion.button type="button" className="admin-overlay lg:hidden" aria-label={t.close} onClick={() => setOpen(false)} whileTap={reduce ? undefined : { opacity: .85 }} /> : null}
      <aside className={`admin-side ${open ? 'is-open' : ''}`} aria-label={t.dashboard}>
        <div className="flex items-center gap-2 px-3 pb-3">
          <Link href="/admin/tableau" className="admin-brand min-w-0 flex-1">
            <img src="/favicon.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-xl object-cover" />
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-black">Chaminade</span>
              <span className="block font-serif text-sm italic text-[var(--ad-accent)]">.dev</span>
            </span>
          </Link>
          <Pressable className="admin-icon-btn lg:hidden" ariaLabel={t.close} onClick={() => setOpen(false)}><X size={16} /></Pressable>
        </div>
        <nav className="admin-nav">
          {adminSectionIds.map((id) => {
            const Icon = icons[id];
            const on = current === id;
            return (
              <Link key={id} href={`/admin/${id}`} aria-current={on ? 'page' : undefined} className="admin-link" title={t.nav[id]}>
                <Icon size={16} />
                <span className="truncate">{t.nav[id]}</span>
              </Link>
            );
          })}
        </nav>
        <div className="grid shrink-0 gap-2 border-t border-[var(--ad-line)] p-3">
          <motion.a href="/" whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }} className="admin-quiet">
            {t.site}
          </motion.a>
          <Pressable className="admin-logout" onClick={leave}>{t.logout}</Pressable>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-float sticky top-3 z-20 flex items-center gap-2 px-2 py-2 sm:px-3">
          <Pressable className="admin-icon-btn lg:hidden" ariaLabel={t.menu} onClick={() => setOpen(true)}>
            <Menu size={16} />
          </Pressable>
          <span className="admin-pill min-w-0 truncate px-3 py-1.5 text-sm font-semibold">{t.nav[current]}</span>
          <span className="ml-auto shrink-0"><Controls /></span>
        </header>
        <div className="relative z-[1] mx-auto w-full max-w-6xl px-1 py-6 sm:px-2">{children}</div>
      </div>
    </div>
  );
}
