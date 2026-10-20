'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchPortfolioProjects, fetchProof, type PublishedTestimonial, type Recommendation } from '@/lib/api';
import { adminCopy, type AdminSectionId } from '@/lib/admin-copy';
import { awards, communities, experiences, profile, projects as localProjects, skillRows, softSkills } from '@/lib/catalog';
import { listPosts, type Post } from '@/lib/blog';
import { useI18n } from '@/lib/i18n';
import AdminShell from './AdminShell';
import { badgePop, cardPop, LiquidButton, Reveal, stagger } from './ui';

type Item = { id: string; title: string; meta: string; status: 'draft' | 'live' };
type LogItem = Item & { at: string };

const visit: LogItem[] = [];
const logListeners = new Set<() => void>();

function pushLog(title: string, meta: string) {
  visit.unshift({ id: `${Date.now()}`, title, meta, status: 'live', at: new Date().toLocaleString() });
  if (visit.length > 40) visit.pop();
  logListeners.forEach((fn) => fn());
}

function useVisitLog() {
  const [, bump] = useState(0);
  useEffect(() => {
    const fn = () => bump((value) => value + 1);
    logListeners.add(fn);
    return () => { logListeners.delete(fn); };
  }, []);
  return visit;
}

function line(value: { fr: string; en: string } | string, lang: 'fr' | 'en') {
  return typeof value === 'string' ? value : value[lang];
}

export default function SectionView({ section }: { section: AdminSectionId }) {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const [remoteProjects, setRemoteProjects] = useState<typeof localProjects | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [quotes, setQuotes] = useState<PublishedTestimonial[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetchPortfolioProjects().then((list) => setRemoteProjects(list)).catch(() => {});
    listPosts().then(setPosts).catch(() => {});
    fetchProof().then((proof) => {
      setQuotes(proof.testimonials);
      setRecs(proof.recommendations);
    }).catch(() => {});
  }, []);

  const projects = remoteProjects ?? localProjects;

  return (
    <AdminShell>
      {section === 'tableau' ? <Dashboard t={t} projects={projects} posts={posts} quotes={quotes.length} recs={recs.length} /> : null}
      {section === 'statistiques' ? <Stats t={t} projects={projects.length} posts={posts.length} quotes={quotes.length} recs={recs.length} /> : null}
      {section === 'messages' ? <Empty t={t} /> : null}
      {section === 'audit' ? <Audit t={t} /> : null}
      {section !== 'tableau' && section !== 'statistiques' && section !== 'messages' && section !== 'audit' ? (
        <Editor section={section} lang={lang} projects={projects} posts={posts} quotes={quotes} recs={recs} />
      ) : null}
    </AdminShell>
  );
}

function greeting(t: (typeof adminCopy)['fr'], hour: number) {
  if (hour < 12) return t.greetingMorning;
  if (hour < 18) return t.greetingDay;
  return t.greetingEvening;
}

function Dashboard({
  t, projects, posts, quotes, recs,
}: {
  t: (typeof adminCopy)['fr'];
  projects: typeof localProjects;
  posts: Post[];
  quotes: number;
  recs: number;
}) {
  const reduce = !!useReducedMotion();
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');
  const hour = new Date().getHours();
  const web = projects.filter((item) => item.type !== 'Mobile').length;
  const mobile = projects.length - web;
  const cards = [
    { label: t.nav.projets, value: projects.length, hot: true },
    { label: t.nav.blog, value: posts.length, hot: false },
    { label: t.nav.temoignages, value: quotes, hot: false },
    { label: t.nav.recommandations, value: recs, hot: false },
  ];
  return (
    <div className="grid gap-6">
      <Reveal>
        <p className="font-display text-3xl font-black tracking-tight sm:text-4xl">{greeting(t, hour)}, Chaminade</p>
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
      <motion.div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        {cards.map((card) => (
          <motion.article key={card.label} variants={cardPop} className={`admin-kpi ${card.hot ? 'is-hot' : ''}`}>
            <p className="text-xs uppercase tracking-[.16em] opacity-70">{card.label}</p>
            <p className="mt-3 font-display text-4xl font-black">{card.value}</p>
          </motion.article>
        ))}
      </motion.div>
      {tab === 'overview' ? (
        <Reveal className="admin-card p-5">
          <p className="admin-kicker">{t.nav.projets}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Bar label="Web" value={web} max={Math.max(projects.length, 1)} />
            <Bar label="Mobile" value={mobile} max={Math.max(projects.length, 1)} />
          </div>
        </Reveal>
      ) : (
        <DataTable t={t} rows={projects.slice(0, 6).map((item) => ({ id: item.title, title: item.title, meta: item.type, status: 'live' as const }))} />
      )}
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span>{label}</span>
        <motion.span variants={badgePop} initial="hidden" whileInView="show" viewport={{ once: true }} className="admin-badge">{value}</motion.span>
      </div>
      <div className="admin-bar"><span style={{ height: `${Math.max(8, (value / max) * 100)}%` }} /></div>
    </div>
  );
}

function Stats({ t, projects, posts, quotes, recs }: { t: (typeof adminCopy)['fr']; projects: number; posts: number; quotes: number; recs: number }) {
  const cards = [
    [t.nav.projets, projects],
    [t.nav.blog, posts],
    [t.nav.experiences, experiences.length],
    [t.nav.distinctions, awards.length],
    [t.nav.communautes, communities.length],
    [t.nav.competences, softSkills.length],
    [t.nav.temoignages, quotes],
    [t.nav.recommandations, recs],
  ] as const;
  return (
    <div className="grid gap-4">
      <Reveal>
        <h2 className="font-display text-3xl font-black">{t.nav.statistiques}</h2>
        <p className="mt-2 text-sm text-[var(--ad-muted)]">{profile.experienceBadge}</p>
      </Reveal>
      <motion.div className="grid gap-3 sm:grid-cols-2" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
        {cards.map(([label, value]) => (
          <motion.article key={label} variants={cardPop} className="admin-kpi">
            <p className="text-xs uppercase tracking-[.14em] text-[var(--ad-muted)]">{label}</p>
            <p className="mt-2 font-display text-3xl font-black">{value}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

function Empty({ t }: { t: (typeof adminCopy)['fr'] }) {
  return (
    <Reveal className="admin-card p-6">
      <h2 className="font-display text-3xl font-black">{t.nav.messages}</h2>
      <p className="mt-3 text-sm text-[var(--ad-muted)]">{t.empty}</p>
      <p className="mt-1 text-sm text-[var(--ad-muted)]">{t.emptyHint}</p>
    </Reveal>
  );
}

function Audit({ t }: { t: (typeof adminCopy)['fr'] }) {
  const rows = useVisitLog();
  return (
    <div className="grid gap-4">
      <Reveal>
        <h2 className="font-display text-3xl font-black">{t.nav.audit}</h2>
        <p className="mt-2 text-sm text-[var(--ad-muted)]">{t.hints.audit}</p>
      </Reveal>
      {rows.length === 0 ? <EmptyHint t={t} /> : <DataTable t={t} rows={rows.map((row) => ({ ...row, meta: `${row.at} · ${row.meta}` }))} />}
    </div>
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

function Editor({
  section, lang, projects, posts, quotes, recs,
}: {
  section: AdminSectionId;
  lang: 'fr' | 'en';
  projects: typeof localProjects;
  posts: Post[];
  quotes: PublishedTestimonial[];
  recs: Recommendation[];
}) {
  const t = adminCopy[lang];
  const seeded = useMemo(() => seed(section, lang, projects, posts, quotes, recs), [section, lang, projects, posts, quotes, recs]);
  const [rows, setRows] = useState<Item[]>(seeded);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [fileName, setFileName] = useState('');
  const [query, setQuery] = useState('');
  const dirty = useRef(false);
  const seen = useRef(seeded);

  useEffect(() => {
    if (dirty.current) return;
    if (seen.current === seeded) return;
    seen.current = seeded;
    setRows(seeded);
  }, [seeded]);

  const shown = rows.filter((row) => `${row.title} ${row.meta}`.toLowerCase().includes(query.trim().toLowerCase()));

  const save = async () => {
    if (!title.trim()) throw new Error(t.needFields);
    dirty.current = true;
    setRows((list) => [{ id: `${Date.now()}`, title: title.trim(), meta: detail.trim() || t.add, status: 'draft' }, ...list]);
    pushLog(t.saved, title.trim());
    setTitle('');
    setDetail('');
  };
  const publish = async () => {
    if (!rows.length) throw new Error(t.needFields);
    dirty.current = true;
    setRows((list) => list.map((row, index) => (index === 0 ? { ...row, status: 'live' } : row)));
    pushLog(t.published, rows[0].title);
  };
  const upload = async () => {
    if (!fileName) throw new Error(t.needFile);
    pushLog(t.uploaded, fileName);
  };
  const remove = async (row: Item) => {
    dirty.current = true;
    setRows((list) => list.filter((item) => item.id !== row.id));
    pushLog(t.removed, row.title);
  };

  return (
    <div className="grid gap-5">
      <Reveal>
        <h2 className="font-display text-3xl font-black">{t.nav[section]}</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ad-muted)]">{t.hints[section]}</p>
      </Reveal>
      <Reveal className="admin-card grid gap-3 p-4 sm:p-5">
        <label className="admin-label" htmlFor="row-title">{t.title}</label>
        <input id="row-title" value={title} onChange={(event) => setTitle(event.target.value)} className="admin-input" />
        <label className="admin-label" htmlFor="row-detail">{t.detail}</label>
        <textarea id="row-detail" value={detail} onChange={(event) => setDetail(event.target.value)} rows={4} className="admin-input min-h-28 resize-y" />
        <label className="admin-label" htmlFor="row-file">{t.upload}</label>
        <input id="row-file" type="file" className="admin-input" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} />
        <div className="flex flex-wrap gap-2 pt-2">
          <LiquidButton action={save}>{t.save}</LiquidButton>
          <LiquidButton action={publish}>{t.publish}</LiquidButton>
          <LiquidButton action={upload}>{t.upload}</LiquidButton>
        </div>
      </Reveal>
      <label className="admin-label" htmlFor="row-filter">{t.search}</label>
      <input id="row-filter" value={query} onChange={(event) => setQuery(event.target.value)} className="admin-input" />
      {shown.length === 0 ? <EmptyHint t={t} /> : (
        <motion.div className="grid gap-3" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
          {shown.map((row) => (
            <motion.article key={row.id} variants={cardPop} className="admin-card flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{row.title}</p>
                <p className="mt-1 break-words text-sm text-[var(--ad-muted)]">{row.meta}</p>
              </div>
              <motion.span variants={badgePop} className={`admin-badge shrink-0 ${row.status === 'live' ? 'is-live' : ''}`}>
                {row.status === 'live' ? t.live : t.draft}
              </motion.span>
              <LiquidButton tone="danger" action={() => remove(row)}>{t.remove}</LiquidButton>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function DataTable({ t, rows }: { t: (typeof adminCopy)['fr']; rows: Item[] }) {
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

function seed(
  section: AdminSectionId,
  lang: 'fr' | 'en',
  projects: typeof localProjects,
  posts: Post[],
  quotes: PublishedTestimonial[],
  recs: Recommendation[],
): Item[] {
  if (section === 'projets') return projects.map((item) => ({ id: item.title, title: item.title, meta: item.type, status: 'live' }));
  if (section === 'blog') return posts.map((item) => ({ id: item.slug, title: item.title, meta: item.category || '', status: 'live' }));
  if (section === 'commentaires') return posts.map((item) => ({ id: item.slug, title: item.title, meta: String(item.comments_count ?? 0), status: 'live' }));
  if (section === 'technologies') {
    return skillRows.flatMap((row) => row.filter((item): item is string => typeof item === 'string')).map((name, index) => ({ id: `${name}-${index}`, title: name, meta: 'stack', status: 'live' as const }));
  }
  if (section === 'experiences') return experiences.map((item) => ({ id: item.company, title: item.company, meta: line(item.role, lang), status: 'live' }));
  if (section === 'profil') return [{ id: 'profile', title: profile.fullName, meta: profile.email, status: 'live' }];
  if (section === 'temoignages') return quotes.map((item, index) => ({ id: `${item.name}-${index}`, title: item.name, meta: item.quote, status: 'live' }));
  if (section === 'recommandations') return recs.map((item, index) => ({ id: `${item.name}-${index}`, title: item.name, meta: item.body, status: 'live' }));
  if (section === 'communautes') return communities.map((item) => ({ id: item.name, title: item.name, meta: line(item.role, lang), status: 'live' }));
  if (section === 'distinctions') return awards.map((item) => ({ id: item.issuer + item.year, title: line(item.title, lang), meta: `${item.issuer} · ${item.year}`, status: 'live' }));
  if (section === 'competences') return softSkills.map((item) => ({ id: line(item.title, lang), title: line(item.title, lang), meta: line(item.impact, lang), status: 'live' }));
  return [];
}
