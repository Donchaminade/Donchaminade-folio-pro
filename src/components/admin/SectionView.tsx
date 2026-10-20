'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

function Dashboard({ t, onAuth }: { t: (typeof adminCopy)['fr']; onAuth: () => void }) {
  const reduce = !!useReducedMotion();
  const guard = useGuard(onAuth);
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');
  const [cards, setCards] = useState<{ label: string; value: string }[]>([]);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const hour = new Date().getHours();
  const hello = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingDay : t.greetingEvening;

  useEffect(() => {
    adminGet('index.php').then(({ html }) => setCards(parseStats(html))).catch(guard);
    adminGet('projects.php').then(({ html }) => setRows(parseRows(html))).catch(guard);
  }, []);

  return (
    <div className="grid gap-6">
      <Reveal>
        <p className="font-display text-3xl font-black tracking-tight sm:text-4xl">{hello}, Chaminade</p>
        <p className="mt-2 max-w-xl text-sm text-[var(--ad-muted)]">{t.greetingHint}</p>
      </Reveal>
      <div className="admin-float inline-flex w-fit max-w-full gap-1 p-1" role="tablist">
        {(['overview', 'activity'] as const).map((id) => (
          <motion.button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`admin-tab ${tab === id ? 'is-on' : ''}`}
            whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.96 }}>
            {id === 'overview' ? t.overview : t.activity}
          </motion.button>
        ))}
      </div>
      {tab === 'overview' ? (
        <motion.div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          {cards.map((card, index) => (
            <motion.article key={card.label} variants={cardPop} className={`admin-kpi ${index === 0 ? 'is-hot' : ''}`}>
              <p className="text-xs uppercase tracking-[.16em] opacity-70">{card.label}</p>
              <p className="mt-3 font-display text-4xl font-black">{card.value}</p>
            </motion.article>
          ))}
        </motion.div>
      ) : <DataTable t={t} rows={rows.slice(0, 8)} />}
    </div>
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

function Editor({ section, onAuth }: { section: AdminSectionId; onAuth: () => void }) {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const cfg = sectionCalls[section];
  const guard = useGuard(onAuth);
  const base = useRef<FormData | null>(null);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [extra, setExtra] = useState('');
  const [selected, setSelected] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');
  const [pairs, setPairs] = useState<{ name: string; value: string }[]>([]);

  const reload = () => adminGet(cfg.page).then(({ html }) => {
    setRows(parseRows(html));
    if (!cfg.edit) {
      const form = collectForm(html);
      base.current = form;
      if (section === 'competences') {
        const next: { name: string; value: string }[] = [];
        form.forEach((value, name) => { if (typeof value === 'string') next.push({ name, value }); });
        setPairs(next);
      }
    }
  }).catch(guard);

  useEffect(() => { reload(); }, [section]);

  const choose = async (row: AdminRow) => {
    setSelected(row.id);
    setTitle(row.title);
    setDetail('');
    if (!cfg.edit) return;
    try {
      const { html } = await adminGet(cfg.edit(row.id));
      const form = collectForm(html);
      base.current = form;
      setTitle(String(form.get(cfg.titleKey) || row.title));
      setDetail(String(form.get(cfg.detailKey) || ''));
      if (cfg.extraKey) setExtra(String(form.get(cfg.extraKey) || ''));
    } catch (error) { guard(error); }
  };

  const send = async (publishing: boolean) => {
    if ((cfg.canDelete || cfg.saveAction !== 'save') && !selected && cfg.saveAction !== 'save') throw new Error(t.needFields);
    if (cfg.canCreate && cfg.saveAction === 'save' && !selected && !title.trim()) throw new Error(t.needFields);
    if ((cfg.page === 'profile.php' || cfg.page === 'skills.php') && !base.current) throw new Error(t.empty);
    const body = section === 'competences'
      ? pairs.reduce((form, pair) => { form.set(pair.name, pair.value); return form; }, new FormData())
      : buildBody(cfg, selected ? base.current : (cfg.edit ? null : base.current), title, detail, extra, selected, publishing);
    try {
      const message = await adminSubmit(cfg.page, body, file && cfg.fileField ? { field: cfg.fileField, file } : undefined);
      setNote(message);
      setTitle('');
      setDetail('');
      setExtra('');
      setSelected('');
      setFile(null);
      base.current = null;
      await reload();
    } catch (error) {
      guard(error);
    }
  };

  const remove = async (row: AdminRow) => {
    const body = new FormData();
    body.set('action', 'delete');
    body.set('id', row.id);
    try {
      const message = await adminSubmit(cfg.page, body);
      setNote(message);
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

  const shown = rows.filter((row) => `${row.title} ${row.meta}`.toLowerCase().includes(query.trim().toLowerCase()));
  const detailLabel = cfg.detailKey === 'content' ? (lang === 'fr' ? 'Contenu' : 'Content') : t.detail;

  return (
    <div className="grid gap-5">
      <Reveal>
        <h2 className="font-display text-3xl font-black">{t.nav[section]}</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ad-muted)]">{t.hints[section]}</p>
      </Reveal>
      <Reveal className="admin-card grid gap-3 p-4 sm:p-5">
        {section === 'competences' ? pairs.map((pair) => (
          <label key={pair.name} className="grid gap-1 text-sm">
            <span className="text-[var(--ad-muted)]">{pair.name}</span>
            <input className="admin-input" value={pair.value} onChange={(event) => setPairs((list) => list.map((item) => item.name === pair.name ? { ...item, value: event.target.value } : item))} />
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
            <textarea id="row-detail" value={detail} onChange={(event) => setDetail(event.target.value)} rows={4} className="admin-input min-h-28 resize-y" />
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
        <div className="flex flex-wrap gap-2 pt-2">
          {cfg.saveAction ? <LiquidButton action={() => send(false)}>{t.save}</LiquidButton> : null}
          {cfg.publishAction ? <LiquidButton action={() => send(true)}>{t.publish}</LiquidButton> : null}
          {cfg.uploadCategory ? <LiquidButton action={upload}>{t.upload}</LiquidButton> : null}
        </div>
        {note ? <p className="text-sm text-[var(--ad-muted)]" role="status">{note}</p> : null}
      </Reveal>
      <label className="admin-label" htmlFor="row-filter">{t.search}</label>
      <input id="row-filter" value={query} onChange={(event) => setQuery(event.target.value)} className="admin-input" />
      {shown.length === 0 ? <EmptyHint t={t} /> : (
        <motion.div className="grid gap-3" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
          {shown.map((row) => (
            <motion.article key={row.id} variants={cardPop} className="admin-card flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => choose(row)}>
                <p className="truncate font-semibold">{row.title}</p>
                <p className="mt-1 break-words text-sm text-[var(--ad-muted)]">{row.meta}</p>
              </button>
              <motion.span variants={badgePop} className={`admin-badge shrink-0 ${row.status === 'live' ? 'is-live' : ''}`}>
                {row.status === 'live' ? t.live : t.draft}
              </motion.span>
              {cfg.canDelete ? <LiquidButton tone="danger" action={() => remove(row)}>{t.remove}</LiquidButton> : null}
            </motion.article>
          ))}
        </motion.div>
      )}
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
