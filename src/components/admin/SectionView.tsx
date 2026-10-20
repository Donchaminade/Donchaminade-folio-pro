'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, ExternalLink, Eye, EyeOff, FolderKanban, LayoutGrid, Mail, Newspaper, Pencil, Plus, Save, Search, Send, Trash2, TrendingUp, Upload, X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchPortfolioProjects } from '@/lib/api';
import { listPosts } from '@/lib/blog';
import { adminCopy, type AdminSectionId } from '@/lib/admin-copy';
import {
  AdminAuthError, adminGet, adminSubmit, collectForm, parseRows, parseStats, sectionCalls,
  type AdminRow, type SectionCall,
} from '@/lib/admin-server';
import { useI18n } from '@/lib/i18n';
import AdminShell from './AdminShell';
import { badgePop, cardPop, LiquidButton, Reveal, stagger } from './ui';

function cloneForm(source: FormData | null) {
  const next = new FormData();
  source?.forEach((value, key) => next.append(key, value));
  return next;
}

function buildBody(cfg: SectionCall, base: FormData | null, title: string, detail: string, extra: string, selected: string, publishing: boolean) {
  if (publishing && cfg.publishAction && cfg.publishAction !== 'save') {
    const only = new FormData();
    only.set('action', cfg.publishAction);
    only.set('id', selected);
    return only;
  }
  if (cfg.saveAction && cfg.saveAction !== 'save' && !publishing) {
    const only = new FormData();
    only.set('action', cfg.saveAction);
    only.set('id', selected);
    if (cfg.saveAction === 'reply') only.set('content', detail);
    return only;
  }
  const body = cloneForm(base);
  body.set('action', cfg.saveAction || 'save');
  if (cfg.edit || cfg.canDelete) body.set('id', selected || '0');
  if (cfg.titleKey !== 'id' && cfg.titleKey !== cfg.detailKey) body.set(cfg.titleKey, title);
  if (cfg.detailKey !== 'id') body.set(cfg.detailKey, detail);
  if (cfg.extraKey) body.set(cfg.extraKey, extra);
  if (cfg.page === 'projects.php') {
    if (!body.get('type')) body.set('type', 'Web');
    if (!body.get('github')) body.set('github', '#');
    if (!body.get('link')) body.set('link', extra || '#');
    if (publishing || !selected) body.set('is_active', 'on');
  }
  if (cfg.page === 'experiences.php' && !selected) body.set('is_active', 'on');
  if (cfg.page === 'blog.php') {
    if (!body.get('category')) body.set('category', 'tech');
    if (!body.get('reading_time')) body.set('reading_time', '5');
  }
  return body;
}

export default function SectionView({ section }: { section: AdminSectionId }) {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const router = useRouter();
  if (section === 'tableau') return <AdminShell><Dashboard t={t} onAuth={() => router.replace('/admin')} /></AdminShell>;
  if (section === 'audit') return <AdminShell><Audit t={t} onAuth={() => router.replace('/admin')} /></AdminShell>;
  return <AdminShell><Editor section={section} onAuth={() => router.replace('/admin')} /></AdminShell>;
}

function useGuard(onAuth: () => void) {
  return (error: unknown) => {
    if (error instanceof AdminAuthError) onAuth();
    throw error;
  };
}

const L = (lang: 'fr' | 'en', fr: string, en: string) => (lang === 'fr' ? fr : en);

function Kpi({ label, value, hint, hot, icon: Icon, href }: { label: string; value: string | number; hint?: string; hot?: boolean; icon: typeof Plus; href?: string }) {
  const reduce = !!useReducedMotion();
  const body = (
    <motion.article variants={cardPop} whileHover={reduce ? undefined : { y: -5 }} className={`admin-kpi h-full ${hot ? 'is-hot' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[.16em] opacity-70">{label}</p>
        <span className="admin-kpi-icon" aria-hidden><Icon size={16} /></span>
      </div>
      <p className="mt-3 font-display text-4xl font-black" data-testid="kpi-value">{value}</p>
      {hint ? <p className="mt-1 text-xs opacity-70">{hint}</p> : null}
    </motion.article>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}

function Dashboard({ t, onAuth }: { t: (typeof adminCopy)['fr']; onAuth: () => void }) {
  const { lang } = useI18n();
  const guard = useGuard(onAuth);
  const [cards, setCards] = useState<{ label: string; value: string }[]>([]);
  const [projects, setProjects] = useState<AdminRow[] | null>(null);
  const [posts, setPosts] = useState<AdminRow[] | null>(null);
  const [mails, setMails] = useState<AdminRow[] | null>(null);
  const hour = new Date().getHours();
  const hello = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingDay : t.greetingEvening;

  useEffect(() => {
    const soft = (error: unknown) => { try { guard(error); } catch { /* affiché vide */ } };
    adminGet('index.php').then(({ html }) => setCards(parseStats(html))).catch(soft);
    adminGet('projects.php').then(({ html }) => setProjects(parseRows(html))).catch((e) => { setProjects([]); soft(e); });
    adminGet('blog.php').then(({ html }) => setPosts(parseRows(html))).catch((e) => { setPosts([]); soft(e); });
    adminGet('messages.php').then(({ html }) => setMails(parseRows(html))).catch((e) => { setMails([]); soft(e); });
  }, []);

  const count = (list: AdminRow[] | null, live?: boolean) => list === null ? '…' : live === undefined ? list.length : list.filter((r) => (r.status === 'live') === live).length;

  return (
    <div className="grid gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">{L(lang, 'Tableau de bord', 'Dashboard')}</p>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">{hello}, <span className="font-serif font-normal italic text-[var(--ad-accent)]">Chaminade</span></h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--ad-muted)]">{t.greetingHint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projets?new=1" className="admin-cta"><Plus size={16} />{L(lang, 'Projet', 'Project')}</Link>
          <Link href="/admin/blog?new=1" className="admin-cta is-ghost"><Plus size={16} />{L(lang, 'Article', 'Article')}</Link>
        </div>
      </Reveal>
      <motion.div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} data-testid="kpis">
        <Kpi hot icon={FolderKanban} href="/admin/projets" label={L(lang, 'Projets', 'Projects')} value={count(projects)} hint={`${count(projects, true)} ${L(lang, 'actifs', 'active')} · ${count(projects, false)} ${L(lang, 'masqués', 'hidden')}`} />
        <Kpi icon={Newspaper} href="/admin/blog" label={L(lang, 'Articles', 'Articles')} value={count(posts)} hint={`${count(posts, true)} ${L(lang, 'publiés', 'published')} · ${count(posts, false)} ${L(lang, 'brouillons', 'drafts')}`} />
        <Kpi icon={Mail} href="/admin/messages" label={L(lang, 'Messages', 'Messages')} value={count(mails)} />
        <Kpi icon={TrendingUp} label={L(lang, 'Taux publié', 'Published rate')} value={posts && posts.length ? `${Math.round((posts.filter((r) => r.status === 'live').length / posts.length) * 100)}%` : '—'} hint={L(lang, 'articles en ligne', 'articles live')} />
      </motion.div>
      {cards.length ? (
        <motion.div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {cards.map((card) => (
            <motion.div key={card.label} variants={cardPop} className="admin-card p-3">
              <p className="truncate text-[11px] uppercase tracking-[.14em] text-[var(--ad-muted)]">{card.label}</p>
              <p className="mt-1 font-display text-2xl font-black">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Recent title={L(lang, 'Derniers projets', 'Latest projects')} href="/admin/projets" rows={projects} t={t} />
        <Recent title={L(lang, 'Derniers articles', 'Latest articles')} href="/admin/blog" rows={posts} t={t} />
      </div>
    </div>
  );
}

function Recent({ title, href, rows, t }: { title: string; href: string; rows: AdminRow[] | null; t: (typeof adminCopy)['fr'] }) {
  return (
    <Reveal className="admin-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-black">{title}</h2>
        <Link href={href} className="admin-text-btn inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm">{t.dashboard === 'Dashboard' ? 'All' : 'Tout'} <ArrowUpRight size={14} /></Link>
      </div>
      {rows === null ? <p className="text-sm text-[var(--ad-muted)]">…</p> : rows.length === 0 ? <p className="text-sm text-[var(--ad-muted)]">{t.empty}</p> : (
        <motion.ul className="grid gap-1" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {rows.slice(0, 5).map((row) => (
            <motion.li key={row.id} variants={cardPop} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-[var(--ad-line)]">
              <span className={`admin-dot ${row.status === 'live' ? 'is-live' : ''}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{row.title}</span>
                <span className="block truncate text-xs text-[var(--ad-muted)]">{row.meta}</span>
              </span>
              <span className={`admin-badge shrink-0 ${row.status === 'live' ? 'is-live' : ''}`}>{row.status === 'live' ? t.live : t.draft}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </Reveal>
  );
}

function Audit({ t, onAuth }: { t: (typeof adminCopy)['fr']; onAuth: () => void }) {
  const guard = useGuard(onAuth);
  const [rows, setRows] = useState<AdminRow[]>([]);
  useEffect(() => {
    adminGet('audit-logs.php').then(({ html }) => setRows(parseRows(html))).catch(guard);
  }, []);
  return (
    <div className="grid gap-4">
      <Reveal>
        <h2 className="font-display text-3xl font-black">{t.nav.audit}</h2>
        <p className="mt-2 text-sm text-[var(--ad-muted)]">{t.hints.audit}</p>
      </Reveal>
      {rows.length === 0 ? <EmptyHint t={t} /> : <DataTable t={t} rows={rows} />}
    </div>
  );
}

function IconAction({ label, onClick, tone, children }: { label: string; onClick: () => void; tone?: 'danger'; children: React.ReactNode }) {
  const reduce = !!useReducedMotion();
  return (
    <motion.button type="button" aria-label={label} title={label} data-tip={label} onClick={onClick}
      whileHover={reduce ? undefined : { y: -2, scale: 1.08 }} whileTap={reduce ? undefined : { scale: 0.92 }}
      className={`admin-crud ${tone === 'danger' ? 'is-danger' : ''}`}>
      {children}
    </motion.button>
  );
}

function Dialog({ open, onClose, title, children, label }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; label: string }) {
  const reduce = !!useReducedMotion();
  useEffect(() => {
    if (!open) return undefined;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, onClose]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="admin-root admin-portal">
    <AnimatePresence>
      {open ? (
        <motion.div className="admin-modal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} className="admin-card admin-modal" onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-black">{title}</h3>
              <IconAction label={label} onClick={onClose}><X size={16} /></IconAction>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </div>,
    document.body,
  );
}

const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, ' ');

/** Liens publics : /blog/article?slug=… pour les articles, lien du projet (sinon /projets). */
function usePublicLinks(section: AdminSectionId) {
  const [links, setLinks] = useState<Record<string, string>>({});
  useEffect(() => {
    if (section === 'blog') {
      listPosts().then((posts) => setLinks(Object.fromEntries(posts.map((p) => [norm(p.title), `/blog/article?slug=${encodeURIComponent(p.slug)}`])))).catch(() => undefined);
    } else if (section === 'projets') {
      fetchPortfolioProjects().then((list) => setLinks(Object.fromEntries(list.map((p) => [norm(p.title), p.link || '/projets'])))).catch(() => undefined);
    }
  }, [section]);
  return (row: AdminRow) => {
    if (row.status !== 'live' || (section !== 'blog' && section !== 'projets')) return '';
    return links[norm(row.title)] || (section === 'projets' ? '/projets' : '');
  };
}

function Editor({ section, onAuth }: { section: AdminSectionId; onAuth: () => void }) {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const cfg = sectionCalls[section];
  const guard = useGuard(onAuth);
  const base = useRef<FormData | null>(null);
  const [rows, setRows] = useState<AdminRow[] | null>(null);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [extra, setExtra] = useState('');
  const [selected, setSelected] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'draft'>('all');
  const [note, setNote] = useState('');
  const [pairs, setPairs] = useState<{ name: string; value: string }[]>([]);
  const [form, setForm] = useState(!cfg.edit && !cfg.canDelete);
  const [viewing, setViewing] = useState<{ row: AdminRow; detail: string; extra: string } | null>(null);
  const [doomed, setDoomed] = useState<AdminRow | null>(null);
  const singleForm = !cfg.edit && !cfg.canDelete;
  const publicUrl = usePublicLinks(section);

  const reload = () => adminGet(cfg.page).then(({ html }) => {
    setRows(parseRows(html));
    if (!cfg.edit) {
      const data = collectForm(html);
      base.current = data;
      if (section === 'competences') {
        const next: { name: string; value: string }[] = [];
        data.forEach((value, name) => { if (typeof value === 'string') next.push({ name, value }); });
        setPairs(next);
      }
      if (singleForm && section !== 'competences') {
        setTitle(String(data.get(cfg.titleKey) || ''));
        setDetail(String(data.get(cfg.detailKey) || ''));
        if (cfg.extraKey) setExtra(String(data.get(cfg.extraKey) || ''));
      }
    }
  }).catch((e) => { setRows([]); guard(e); });

  useEffect(() => {
    reload().catch(() => undefined);
    if (cfg.canCreate && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new')) startCreate();
  }, [section]);

  const resetFields = () => { setTitle(''); setDetail(''); setExtra(''); setSelected(''); setFile(null); base.current = null; };

  function startCreate() { resetFields(); setNote(''); setForm(true); }

  const load = async (row: AdminRow) => {
    if (!cfg.edit) return { detail: '', extra: '', title: row.title };
    const { html } = await adminGet(cfg.edit(row.id));
    const data = collectForm(html);
    base.current = data;
    return { title: String(data.get(cfg.titleKey) || row.title), detail: String(data.get(cfg.detailKey) || ''), extra: cfg.extraKey ? String(data.get(cfg.extraKey) || '') : '' };
  };

  const choose = async (row: AdminRow) => {
    setSelected(row.id);
    setTitle(row.title);
    setDetail('');
    setExtra('');
    setNote('');
    setForm(true);
    try {
      const got = await load(row);
      setTitle(got.title); setDetail(got.detail); setExtra(got.extra);
    } catch (error) { try { guard(error); } catch (e) { setNote((e as Error).message); } }
  };

  const view = async (row: AdminRow) => {
    setViewing({ row, detail: '…', extra: '' });
    try {
      const got = await load(row);
      setViewing({ row, detail: got.detail || row.meta, extra: got.extra });
    } catch { setViewing({ row, detail: row.meta, extra: '' }); }
  };

  const send = async (publishing: boolean) => {
    if ((cfg.canDelete || cfg.saveAction !== 'save') && !selected && cfg.saveAction !== 'save') throw new Error(t.needFields);
    if (cfg.canCreate && cfg.saveAction === 'save' && !selected && !title.trim()) throw new Error(t.needFields);
    if ((cfg.page === 'profile.php' || cfg.page === 'skills.php') && !base.current) throw new Error(t.empty);
    const body = section === 'competences'
      ? pairs.reduce((data, pair) => { data.set(pair.name, pair.value); return data; }, new FormData())
      : buildBody(cfg, selected ? base.current : (cfg.edit ? null : base.current), title, detail, extra, selected, publishing);
    try {
      const message = await adminSubmit(cfg.page, body, file && cfg.fileField ? { field: cfg.fileField, file } : undefined);
      setNote(message);
      if (!singleForm) { resetFields(); window.setTimeout(() => setForm(false), 1200); }
      await reload();
    } catch (error) {
      guard(error);
    }
  };

  const remove = async () => {
    if (!doomed) return;
    const body = new FormData();
    body.set('action', 'delete');
    body.set('id', doomed.id);
    try {
      const message = await adminSubmit(cfg.page, body);
      setNote(message);
      window.setTimeout(() => setDoomed(null), 900);
      await reload();
    } catch (error) { guard(error); }
  };

  const upload = async () => {
    if (!file || !cfg.uploadCategory) throw new Error(t.needFile);
    const body = new FormData();
    body.set('category', cfg.uploadCategory);
    body.set('file_key', 'file');
    try {
      const message = await adminSubmit('api/upload.php', body, { field: 'file', file });
      setNote(message);
      if (cfg.detailKey === 'icon_url') setDetail(message);
    } catch (error) { guard(error); }
  };

  const list = rows || [];
  const shown = list
    .filter((row) => filter === 'all' || row.status === filter)
    .filter((row) => `${row.title} ${row.meta}`.toLowerCase().includes(query.trim().toLowerCase()));
  const detailLabel = cfg.detailKey === 'content' ? L(lang, 'Contenu', 'Content') : t.detail;
  const live = list.filter((r) => r.status === 'live').length;

  return (
    <div className="grid gap-5">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">Admin</p>
          <h1 className="font-display text-3xl font-black">{t.nav[section]}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ad-muted)]">{t.hints[section]}</p>
        </div>
        {cfg.canCreate ? (
          <motion.button type="button" onClick={startCreate} className="admin-cta" aria-label={`${t.add} — ${t.nav[section]}`} title={t.add}
            whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Plus size={16} />{t.add}
          </motion.button>
        ) : null}
      </Reveal>

      {!singleForm ? (
        <motion.div className="grid grid-cols-3 gap-3" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <Kpi hot icon={LayoutGrid} label={L(lang, 'Total', 'Total')} value={rows ? list.length : '…'} />
          <Kpi icon={Eye} label={t.live} value={rows ? live : '…'} />
          <Kpi icon={EyeOff} label={t.draft} value={rows ? list.length - live : '…'} />
        </motion.div>
      ) : null}

      {note && !form ? <p className="admin-card px-4 py-3 text-sm" role="status">{note}</p> : null}

      <AnimatePresence initial={false}>
        {form ? (
          <motion.section key="form" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="admin-card grid gap-1 p-4 sm:p-5" aria-label={L(lang, 'Formulaire', 'Form')}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 font-display text-lg font-black">
                {selected ? <Pencil size={16} /> : singleForm ? <Pencil size={16} /> : <Plus size={16} />}
                {selected ? L(lang, 'Modifier', 'Edit') : singleForm ? L(lang, 'Modifier', 'Edit') : t.add}
              </h2>
              {!singleForm ? <IconAction label={t.close} onClick={() => { setForm(false); resetFields(); }}><X size={16} /></IconAction> : null}
            </div>
            {section === 'competences' ? pairs.map((pair) => (
              <label key={pair.name} className="grid gap-1 text-sm">
                <span className="text-[var(--ad-muted)]">{pair.name}</span>
                <input className="admin-input" value={pair.value} onChange={(event) => setPairs((all) => all.map((item) => item.name === pair.name ? { ...item, value: event.target.value } : item))} />
              </label>
            )) : null}
            {section !== 'competences' && cfg.titleKey !== 'id' ? (
              <>
                <label className="admin-label" htmlFor="row-title">{t.title}</label>
                <input id="row-title" value={title} onChange={(event) => setTitle(event.target.value)} className="admin-input" />
              </>
            ) : null}
            {cfg.detailKey !== 'id' && cfg.detailKey !== cfg.titleKey ? (
              <>
                <label className="admin-label" htmlFor="row-detail">{detailLabel}</label>
                <textarea id="row-detail" value={detail} onChange={(event) => setDetail(event.target.value)} rows={5} className="admin-input min-h-28 resize-y" />
              </>
            ) : null}
            {cfg.extraKey ? (
              <>
                <label className="admin-label" htmlFor="row-extra">{cfg.extraLabel[lang]}</label>
                <input id="row-extra" value={extra} onChange={(event) => setExtra(event.target.value)} className="admin-input" />
              </>
            ) : null}
            {cfg.fileField ? (
              <>
                <label className="admin-label" htmlFor="row-file">{t.upload}</label>
                <input id="row-file" type="file" className="admin-input" onChange={(event) => setFile(event.target.files?.[0] || null)} />
              </>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-3">
              {cfg.saveAction ? <LiquidButton action={() => send(false)}><Save size={15} />{t.save}</LiquidButton> : null}
              {cfg.publishAction ? <LiquidButton action={() => send(true)}><Send size={15} />{t.publish}</LiquidButton> : null}
              {cfg.uploadCategory ? <LiquidButton action={upload}><Upload size={15} />{t.upload}</LiquidButton> : null}
            </div>
            {note ? <p className="pt-2 text-sm text-[var(--ad-muted)]" role="status">{note}</p> : null}
          </motion.section>
        ) : null}
      </AnimatePresence>

      {!singleForm ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="admin-search flex-1">
              <Search size={16} aria-hidden />
              <span className="sr-only">{t.search}</span>
              <input id="row-filter" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />
            </label>
            <div className="admin-float inline-flex w-fit gap-1 p-1" role="tablist" aria-label={t.status}>
              {(['all', 'live', 'draft'] as const).map((id) => (
                <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)} className={`admin-tab ${filter === id ? 'is-on' : ''}`}>
                  {id === 'all' ? L(lang, 'Tous', 'All') : id === 'live' ? t.live : t.draft}
                </button>
              ))}
            </div>
          </div>
          {rows === null ? <p className="text-sm text-[var(--ad-muted)]">…</p> : shown.length === 0 ? <EmptyHint t={t} /> : (
            <motion.div className="admin-card overflow-hidden" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.02 }} data-testid="crud-list">
              {shown.map((row) => (
                <motion.div key={row.id} variants={cardPop} className="admin-row">
                  <span className={`admin-dot ${row.status === 'live' ? 'is-live' : ''}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{row.title}</p>
                    <p className="mt-0.5 truncate text-sm text-[var(--ad-muted)]">{row.meta}</p>
                  </div>
                  <motion.span variants={badgePop} className={`admin-badge hidden shrink-0 sm:inline-flex ${row.status === 'live' ? 'is-live' : ''}`}>
                    {row.status === 'live' ? t.live : t.draft}
                  </motion.span>
                  <div className="flex shrink-0 gap-1">
                    {publicUrl(row) ? (
                      <motion.a href={publicUrl(row)} target="_blank" rel="noopener noreferrer" className="admin-crud"
                        aria-label={`${L(lang, 'Voir sur le site', 'View on site')} : ${row.title}`} title={L(lang, 'Voir sur le site', 'View on site')} data-tip={L(lang, 'Voir sur le site', 'View on site')}
                        whileHover={{ y: -2, scale: 1.08 }} whileTap={{ scale: 0.92 }}><ExternalLink size={16} /></motion.a>
                    ) : null}
                    <IconAction label={`${L(lang, 'Voir', 'View')} : ${row.title}`} onClick={() => view(row)}><Eye size={16} /></IconAction>
                    {cfg.edit || cfg.saveAction ? <IconAction label={`${L(lang, 'Modifier', 'Edit')} : ${row.title}`} onClick={() => choose(row)}><Pencil size={16} /></IconAction> : null}
                    {cfg.canDelete ? <IconAction tone="danger" label={`${t.remove} : ${row.title}`} onClick={() => setDoomed(row)}><Trash2 size={16} /></IconAction> : null}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      ) : null}

      <Dialog open={!!viewing} onClose={() => setViewing(null)} title={viewing?.row.title || ''} label={t.close}>
        {viewing ? (
          <div className="grid gap-3 text-sm">
            <span className={`admin-badge w-fit ${viewing.row.status === 'live' ? 'is-live' : ''}`}>{viewing.row.status === 'live' ? t.live : t.draft}</span>
            <p className="text-[var(--ad-muted)]">{viewing.row.meta}</p>
            <p className="max-h-72 overflow-y-auto whitespace-pre-wrap">{viewing.detail}</p>
            {viewing.extra ? <p className="break-all"><strong>{cfg.extraLabel[lang]} :</strong> {viewing.extra}</p> : null}
          </div>
        ) : null}
      </Dialog>

      <Dialog open={!!doomed} onClose={() => setDoomed(null)} title={L(lang, 'Supprimer ?', 'Delete?')} label={t.close}>
        <p className="text-sm text-[var(--ad-muted)]">{L(lang, 'Cette action est définitive :', 'This cannot be undone:')} <strong className="text-[var(--ad-ink)]">{doomed?.title}</strong></p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="button" className="admin-cta is-ghost" onClick={() => setDoomed(null)}>{L(lang, 'Annuler', 'Cancel')}</button>
          <LiquidButton tone="danger" action={remove}><Trash2 size={15} />{t.remove}</LiquidButton>
        </div>
      </Dialog>
    </div>
  );
}

function DataTable({ t, rows }: { t: (typeof adminCopy)['fr']; rows: AdminRow[] }) {
  return (
    <Reveal className="admin-card overflow-hidden">
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t.title}</th>
            <th>{t.detail}</th>
            <th>{t.status}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label={t.title}>{row.title}</td>
              <td data-label={t.detail}>{row.meta}</td>
              <td data-label={t.status}>{row.status === 'live' ? t.live : t.draft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}

function EmptyHint({ t }: { t: (typeof adminCopy)['fr'] }) {
  return (
    <Reveal className="admin-card p-6">
      <p className="font-semibold">{t.empty}</p>
      <p className="mt-1 text-sm text-[var(--ad-muted)]">{t.emptyHint}</p>
    </Reveal>
  );
}
