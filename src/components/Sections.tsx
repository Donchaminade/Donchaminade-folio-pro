'use client';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Linkedin, Mail, Phone, Twitter, Plus, Minus, Download, MessageCircle, Send } from 'lucide-react';
import { Heartbeat, MotionIcon } from './MotionIcon';
import { fetchPortfolioProjects, submitContact } from '@/lib/api';
import { fadeUp, hoverLift, inViewGroup, reveal, slideIn } from '@/lib/motion';
import { extraProjects, mergeRemoteProjects, phoneScreens, profile, projects, skillBlocks, skillRows, softSkills, tagLabel, type Bi, type Project } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import type { Lang } from '@/lib/dictionary';

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function textOf(value: string | Bi, lang: Lang) {
  return typeof value === 'string' ? value : value[lang];
}

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

function splitTitle(title: string) {
  const spaced = title.indexOf(' ');
  const dotted = title.indexOf('.');
  if (dotted > 0 && (spaced < 0 || dotted < spaced)) {
    return { accent: title.slice(0, dotted), rest: title.slice(dotted) };
  }
  if (spaced < 0) return { accent: title, rest: '' };
  return { accent: title.slice(0, spaced), rest: title.slice(spaced + 1) };
}

function longestToken(accent: string, rest: string) {
  const parts = [accent, ...rest.split(/\s+/).filter(Boolean)];
  return parts.reduce((max, part) => Math.max(max, part.length), 1);
}

function RoleLine({ size }: { size: 'm' | 'd' }) {
  const { t } = useI18n();
  const big = size === 'd';
  return (
    <p className={`max-w-[18rem] font-display font-extrabold leading-tight sm:max-w-none ${big ? 'text-3xl' : 'text-2xl'}`}>
      {t.developer}{' '}
      <span className={`role-focus font-serif font-normal italic ${big ? 'text-4xl' : 'text-[1.7rem]'}`}>{t.roleFocus}</span>
    </p>
  );
}

/* ---------- 1. HERO ---------- */
export function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useI18n();
  const reduced = !!useReducedMotion();
  const path = usePathname() || '/';
  const home = path === '/';
  const book = home ? '#rendez-vous' : '/#rendez-vous';
  const contact = home ? '#contact' : '/#contact';
  const mx = useMotionValue(0), my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, [-1, 1], [-8, 8]), { stiffness: 60, damping: 20 });
  const tx = useTransform(px, (v) => -v / 2);
  const portrait = `${t.portraitOf} ${profile.fullName}`;
  const portraitOf = (className: string) => (
    <picture>
      <source srcSet="/img/portrait-cartoon.webp" type="image/webp" />
      <img src="/img/portrait-cartoon.png" alt={portrait} draggable={false} className={className} />
    </picture>
  );
  return (
    <section id="accueil" className="spot relative overflow-hidden">
      <div className="flex min-h-[100svh] flex-col px-6 pb-6 pt-24 md:hidden">
        <motion.h1 initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 0.6, ease: 'easeOut' }}
          className="wordmark-m metal shrink-0 select-none text-center font-display font-black">
          DONCHAMINADE
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mx-auto mt-2 flex w-full max-h-[50svh] justify-center">
          {portraitOf('max-h-[50svh] w-full object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_86%,transparent)]')}
        </motion.div>
        <motion.div initial="hidden" animate={ready ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
          className="mt-3 shrink-0">
          <motion.div variants={fadeUp}>
            <p className="label mb-2 text-white/50">{profile.fullName}</p>
            <RoleLine size="m" />
            <p className="mt-2 text-base leading-relaxed text-mist">{profile.heroSubtitle[lang]}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-4 grid gap-3">
            <a href={contact} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 text-base font-medium tracking-wide">{t.contact} <MotionIcon icon={ArrowUpRight} size={16} effect="slide" /></a>
            <Heartbeat className="w-full">
              <a href={book} className="flex min-h-11 w-full items-center justify-center rounded-full bg-cream px-5 text-base font-medium tracking-wide text-ink">{t.bookCall}</a>
            </Heartbeat>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative hidden min-h-[100svh] flex-col items-center justify-end overflow-hidden pt-24 md:flex"
        onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1); }}>
        <motion.h1 style={{ x: tx }} initial={{ opacity: 0, scale: 1.15 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1, ease: 'easeOut' }}
          className="wordmark metal pointer-events-none absolute inset-x-0 top-[16%] w-full select-none text-center font-display font-black">
          DONCHAMINADE
        </motion.h1>
        <motion.div style={{ x: px, y: py }}
          initial={{ opacity: 0, y: 120 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-[52vw] max-w-[820px]">
          {portraitOf('h-auto w-full [mask-image:linear-gradient(to_bottom,#000_86%,transparent)]')}
        </motion.div>
        <motion.div initial="hidden" animate={ready ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
          className="absolute inset-x-0 bottom-0 z-20">
          <div className="wrap flex items-end justify-between gap-6 pb-10">
            <motion.div variants={fadeUp}>
              <p className="label mb-2 text-white/50">{profile.fullName}</p>
              <RoleLine size="d" />
              <p className="mt-1 text-base text-mist">{profile.heroSubtitle[lang]}</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Heartbeat>
                <a href={book} className="inline-flex min-h-11 items-center rounded-full bg-cream px-5 text-sm font-medium tracking-wide text-ink hover:bg-white">{t.bookCall}</a>
              </Heartbeat>
              <a href={contact} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 text-sm font-medium tracking-wide backdrop-blur hover:bg-cream hover:text-ink">{t.contact} <MotionIcon icon={ArrowUpRight} size={14} effect="slide" /></a>
              <span className="flex h-11 w-5 justify-center rounded-full border border-white/40 pt-1.5" aria-hidden>
                <motion.span className="fg h-1.5 w-1 rounded-full" animate={reduced ? undefined : { y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
              </span>
              <span className="text-sm tracking-[0.18em] text-white/40">@donchaminade</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 2. À PROPOS ---------- */
export function About({ showHeading = true }: { showHeading?: boolean }) {
  const { t, lang, theme } = useI18n();
  const badge = lang === 'en' ? profile.experienceBadgeEn : profile.experienceBadge;
  return (
    <section id="apropos" className={`wrap relative ${showHeading ? 'py-20 md:py-28' : 'pb-16 pt-2 md:pb-24'}`}>
      <div className={showHeading ? 'grid gap-10 md:grid-cols-2' : 'max-w-3xl'}>
        {showHeading && (
          <h2 className="font-display text-[22vw] font-black uppercase leading-[.85] tracking-tight md:text-[12vw]">
            <MaskTitle className="metal">{t.aboutTitleA}</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">{t.aboutTitleB}</span></Italic></MaskTitle>
          </h2>
        )}
        <motion.div {...reveal(0.2)} className="self-start rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur md:p-8">
          <p className="label mb-4 text-cream">{profile.availability[lang]}</p>
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">{profile.bio[lang]}</p>
          <p className="mt-3 text-base leading-relaxed text-mist">{profile.heroTitle[lang]} {profile.heroSubtitle[lang]}</p>
          <div className="mt-6 border-t border-white/10 pt-3">
            <span className="font-display text-3xl font-black">{badge}</span>
            <p className="label mt-1 text-white/50">{t.experienceSolid}</p>
          </div>
        </motion.div>
      </div>
      <motion.ul {...inViewGroup(0.08)} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {t.stats.map((s) => (
          <motion.li key={s.label} variants={fadeUp} className="rounded-2xl border border-white/10 px-4 py-5">
            <p className="font-display text-4xl font-black">{s.value}<span className="text-cream">{s.suffix}</span></p>
            <p className="label mt-2 text-white/50">{s.label}</p>
          </motion.li>
        ))}
      </motion.ul>
      <div className="mt-14 space-y-3 overflow-hidden">
        {skillRows.map((row, i) => (
          <motion.div key={i} {...inViewGroup(0.06, i * 0.08)} className={`flex flex-wrap gap-2 md:gap-3 ${i % 2 ? 'md:pl-24' : ''}`}>
            {row.map((s) => {
              const label = textOf(s, lang);
              return (
                <motion.span key={label} variants={fadeUp} whileHover={{ y: -3, backgroundColor: theme === 'light' ? '#18181b' : '#d9d0c1', color: theme === 'light' ? '#fafafa' : '#060708' }}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[.03] px-4 py-2 text-base text-white/85">{label}</motion.span>
              );
            })}
          </motion.div>
        ))}
      </div>
      <p className="label mt-16 text-white/45">{t.softTitle}</p>
      <motion.ul {...inViewGroup(0.06)} className="mt-5 grid gap-4 md:grid-cols-2">
        {softSkills.map((s) => (
          <motion.li key={s.title.fr} variants={fadeUp} {...hoverLift} className="rounded-3xl border border-white/10 p-5">
            <h3 className="font-display text-lg font-black uppercase leading-tight">{s.title[lang]}</h3>
            <p className="label mt-3 text-cream">{t.impact}</p>
            <p className="mt-2 text-base leading-relaxed text-mist">{s.impact[lang]}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

/* ---------- 3. SERVICES ---------- */
export function Services({ showHeading = true }: { showHeading?: boolean }) {
  const { t, lang, theme } = useI18n();
  const [open, setOpen] = useState<number>(2);
  const fg = theme === 'light' ? '#18181b' : '#ffffff';
  const openBg = theme === 'light' ? '#f4f4f5' : '#d9d0c1';
  const openFg = '#18181b';
  return (
    <section id="services" className={`wrap relative ${showHeading ? 'py-20 md:py-28' : 'pb-16 pt-2 md:pb-24'}`}>
      {showHeading && (
        <h2 className="ml-auto max-w-3xl text-right font-display text-[13vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
          <MaskTitle className="metal">{t.servicesTitleA}</MaskTitle>
          <MaskTitle className="metal">{t.servicesTitleB} <Italic>{t.servicesDo}</Italic></MaskTitle>
        </h2>
      )}
      <motion.ul {...inViewGroup(0.08)} className={`${showHeading ? 'mt-14' : 'mt-8'} border-t border-white/10`}>
        {skillBlocks.map((s, i) => {
          const isOpen = open === i;
          return (
            <motion.li key={s.title.fr} variants={fadeUp} onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(i)}
              animate={{ backgroundColor: isOpen ? openBg : 'rgba(0,0,0,0)', color: isOpen ? openFg : fg }} transition={{ duration: 0.4 }}
              className="border-b border-white/10">
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-3 py-5 text-left md:px-6">
                <span className="font-display text-sm font-black opacity-60">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 font-display text-base font-extrabold uppercase tracking-wide md:text-xl">{s.title[lang]}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
                  {isOpen ? <MotionIcon icon={Minus} size={18} effect="spin" /> : <MotionIcon icon={Plus} size={18} effect="spin" />}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }} className="overflow-hidden">
                    <div className="space-y-5 px-3 pb-6 md:pl-16 md:pr-6">
                      {s.categories.map((cat) => (
                        <div key={cat.name.fr}>
                          <p className="label mb-2 opacity-70">{cat.name[lang]}</p>
                          <ul className="flex flex-wrap gap-2">
                            {cat.items[lang].map((it) => <li key={it} className="inline-flex items-center rounded-full border border-ink/20 px-3 py-1.5 text-base">{it}</li>)}
                          </ul>
                        </div>
                      ))}
                      <a href="#contact" className="label inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-cream">{t.discuss} <MotionIcon icon={ArrowUpRight} size={14} effect="slide" /></a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}

/* ---------- 4. PROJETS ---------- */
function Device({ type, images }: { type: 'Mobile' | 'Web'; images: string[] }) {
  const reduced = !!useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced || images.length < 2) return;
    const timer = setInterval(() => setK((v) => (v + 1) % images.length), 2600);
    return () => clearInterval(timer);
  }, [images.length, reduced]);
  const frame = type === 'Mobile'
    ? 'aspect-[9/19] w-[58%] sm:w-[46%] lg:w-[44%] rounded-[2.4rem] border-[7px]'
    : 'aspect-[16/10] w-full rounded-2xl border-[10px] border-b-[18px]';
  return (
    <div className="spot relative flex w-full max-w-full items-center justify-center py-4 md:py-6">
      <div className={`relative overflow-hidden border-neutral-800 bg-black shadow-[0_40px_90px_-18px_rgba(0,0,0,.9)] ${frame}`}>
        <AnimatePresence>
          <motion.img key={images[k]} src={images[k]} alt="" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} className="absolute inset-0 h-full w-full object-cover object-top" />
        </AnimatePresence>
      </div>
      <div className="absolute bottom-6 h-6 w-1/2 rounded-[50%] bg-black/80 blur-xl" />
    </div>
  );
}

const PAGE = 6;

export function Work({ showHeading = true }: { showHeading?: boolean }) {
  const { t, lang } = useI18n();
  const [list, setList] = useState<Project[]>(projects);
  const featured = list.filter((p) => p.images.length > 0);
  const [i, setI] = useState(0);
  const [filter, setFilter] = useState<'all' | 'Web' | 'Mobile'>('all');
  const [more, setMore] = useState(false);
  useEffect(() => {
    let cancel = false;
    const load = () => {
      fetchPortfolioProjects()
        .then((remote) => {
          if (!cancel && remote.length) setList(mergeRemoteProjects(remote, extraProjects));
        })
        .catch(() => { /* le catalogue local reste affiché */ });
    };
    load();
    const timer = window.setInterval(load, 60_000);
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancel = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  const count = featured.length;
  const index = count ? ((i % count) + count) % count : 0;
  const p = featured[index];
  const { accent, rest } = splitTitle(p?.title ?? '');
  const titleChars = longestToken(accent, rest);
  const filtered = list.filter((q) => filter === 'all' || q.type === filter);
  const shown = more ? filtered : filtered.slice(0, PAGE);
  const filters = [
    { id: 'all' as const, label: t.filterAll },
    { id: 'Web' as const, label: t.filterWeb },
    { id: 'Mobile' as const, label: t.filterMobile },
  ];
  return (
    <section id="projets" className={`wrap relative overflow-x-clip ${showHeading ? 'py-20 md:py-28' : 'pb-16 pt-2 md:pb-24'}`}>
      {showHeading && (
        <h2 className="font-display text-[14vw] font-black uppercase leading-[.85] tracking-tight md:text-[6.5vw]">
          <MaskTitle className="metal">{t.projectsTitle} <Italic>{t.projectsChosen}</Italic></MaskTitle>
        </h2>
      )}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="label text-white/45">{String(count ? index + 1 : 0).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => count && setI((index - 1 + count) % count)} className="label inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 px-4 hover:bg-white hover:text-ink" aria-label={t.prevScreen}><MotionIcon icon={ChevronLeft} size={16} effect="slideBack" /></button>
          <button type="button" onClick={() => count && setI((index + 1) % count)} className="label inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-ink" aria-label={t.next}>{t.next} <MotionIcon icon={ChevronRight} size={16} effect="slide" /></button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {featured.map((q, j) => (
          <button key={q.title} type="button" onClick={() => setI(j)}
            className={`label inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 ${index === j ? 'border-cream bg-cream text-ink' : 'border-white/20 text-white/60'}`}>{q.title}</button>
        ))}
      </div>
      {p && <div className="mt-12 grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.16fr)] lg:gap-12">
        <AnimatePresence mode="wait">
          <motion.div key={p.title} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="project-title-slot order-2 w-full min-w-0 lg:order-1">
            <motion.p variants={fadeUp} className="text-base font-medium uppercase tracking-[0.14em] text-white/60">{String(index + 1).padStart(2, '0')} — {p.type === 'Mobile' ? t.mobileApp : t.webApp}</motion.p>
            <motion.h3 variants={fadeUp} className="project-title mt-4 w-full min-w-0 font-display font-black uppercase" style={{ ['--chars' as string]: titleChars }}>
              <span className="title-lead">{accent}</span>
              {rest && (
                <span className="title-rest">
                  <Italic>
                    <span className="text-cream">
                      {rest.split(/(\s+)/).map((part, n) => (
                        part.trim()
                          ? <span key={`${part}-${n}`} className="inline-block whitespace-nowrap">{part}</span>
                          : ' '
                      ))}
                    </span>
                  </Italic>
                </span>
              )}
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.65] text-mist [overflow-wrap:anywhere]">{p.description[lang]}</motion.p>
            <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-2">{p.tags.map((tag) => <li key={tag} className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-base text-white/75">{tagLabel(tag, lang)}</li>)}</motion.ul>
            <ProjectLinks p={p} />
          </motion.div>
        </AnimatePresence>
        <motion.div {...slideIn(28, 0.1)} className="order-1 min-w-0 max-w-full overflow-hidden lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div key={p.title} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
              <Device type={p.type} images={p.images} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>}

      <div className="mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="font-display text-4xl font-black uppercase md:text-5xl">{t.catalogKicker}</h3>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f.id} type="button" onClick={() => { setFilter(f.id); setMore(false); }}
              className={`label inline-flex min-h-11 items-center rounded-full border px-4 ${filter === f.id ? 'border-cream bg-cream text-ink' : 'border-white/20 text-white/60'}`}>{f.label}</button>
          ))}
        </div>
      </div>
      <motion.ul {...inViewGroup(0.05)} className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((q) => <ProjectCard key={q.title} p={q} />)}
      </motion.ul>
      {filtered.length > PAGE && (
        <button type="button" onClick={() => setMore((v) => !v)} className="label mt-8 inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 hover:bg-white hover:text-ink">
          {more ? t.seeLess : t.seeAll}
        </button>
      )}
    </section>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  const { t } = useI18n();
  return (
    <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
      {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-base font-medium tracking-wide text-ink hover:bg-white">{p.link.includes('play.google') ? t.googlePlay : t.seeSite} <MotionIcon icon={ArrowUpRight} size={16} effect="slide" /></a>}
      {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-6 text-base font-medium tracking-wide hover:bg-white hover:text-ink"><MotionIcon icon={Github} size={16} effect="bounce" /> GitHub</a>}
    </motion.div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const { t, lang } = useI18n();
  const shot = p.images[0];
  return (
    <motion.li variants={fadeUp} {...hoverLift} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.03]">
      <div className="relative aspect-[3/2] overflow-hidden bg-black/40">
        {shot
          ? <img src={shot} alt="" className="h-full w-full object-cover object-top" />
          : <div className="grid h-full place-items-center"><span className="font-display text-4xl font-black text-white/30">{t.noImage}</span></div>}
      </div>
      <div className="p-5">
        <p className="label text-cream">{p.type === 'Mobile' ? t.mobileApp : t.webApp}</p>
        <h4 className="mt-2 font-display text-2xl font-black uppercase leading-tight [overflow-wrap:normal] [word-break:keep-all]">{p.title}</h4>
        <p className="mt-3 text-base leading-relaxed text-mist [overflow-wrap:anywhere]">{p.description[lang]}</p>
        <ul className="mt-3 flex flex-wrap gap-2">{p.tags.map((tag) => <li key={tag} className="label rounded-full border border-white/15 px-2 py-1 text-white/60">{tagLabel(tag, lang)}</li>)}</ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-base hover:text-cream">{p.link.includes('play.google') ? t.googlePlay : t.seeSite} <MotionIcon icon={ArrowUpRight} size={14} effect="slide" /></a>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-base hover:text-cream"><MotionIcon icon={Github} size={14} effect="bounce" /> GitHub</a>}
        </div>
      </div>
    </motion.li>
  );
}

/* ---------- 5. ÉCRANS ---------- */
export function Components() {
  const { t, lang } = useI18n();
  const reduce = !!useReducedMotion();
  const [c, setC] = useState(2);
  const dragged = useRef(false);
  const last = phoneScreens.length - 1;
  return (
    <section id="ecrans" className="wrap relative overflow-hidden py-20 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.6fr]">
        <div>
          <h2 className="font-display text-5xl font-black uppercase leading-[.9] tracking-tight md:text-6xl">
            <MaskTitle className="metal">{t.screensA}</MaskTitle>
            <MaskTitle className="metal">{t.screensB}</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">{t.screensC}</span></Italic></MaskTitle>
          </h2>
          <motion.p {...reveal(0.2)} className="mt-5 max-w-sm text-base leading-relaxed text-mist">{t.screensNote}</motion.p>
          <motion.div {...reveal(0.3)} className="mt-6 flex gap-3">
            <button type="button" onClick={() => setC(Math.max(0, c - 1))} className="label inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 px-4 hover:bg-white hover:text-ink" aria-label={t.prevScreen}><MotionIcon icon={ChevronLeft} size={16} effect="slideBack" /></button>
            <button type="button" onClick={() => setC(Math.min(last, c + 1))} className="label inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-cream px-4 text-ink" aria-label={t.nextScreen}><MotionIcon icon={ChevronRight} size={16} effect="slide" /></button>
            <span className="label self-center text-white/40">{String(c + 1).padStart(2, '0')} / {String(phoneScreens.length).padStart(2, '0')}</span>
          </motion.div>
        </div>
        <motion.div
          {...inViewGroup(0.08)}
          className="relative h-[460px] cursor-grab touch-pan-y active:cursor-grabbing md:h-[560px]"
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => { dragged.current = false; }}
          onDrag={(_, info) => { if (Math.abs(info.offset.x) > 8) dragged.current = true; }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -48) setC((v) => Math.min(last, v + 1));
            else if (info.offset.x > 48) setC((v) => Math.max(0, v - 1));
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.screensA}
        >
          {phoneScreens.map((s, j) => {
            const d = j - c;
            return (
              <motion.button key={s.src} variants={{ hidden: { opacity: 0, x: 200 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                onClick={() => { if (dragged.current) { dragged.current = false; return; } setC(j); }} aria-label={s.label[lang]} type="button"
                className="absolute left-1/2 top-1/2 w-[200px] md:w-[240px]" style={{ zIndex: 20 - Math.abs(d) }}>
                <motion.div animate={{ x: `calc(-50% + ${d * 48}%)`, y: '-50%', scale: d === 0 ? 1 : 0.82, opacity: Math.abs(d) > 2 ? 0 : d === 0 ? 1 : 0.45, filter: d === 0 ? 'blur(0px)' : 'blur(2px)' }}
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden rounded-[2rem] border-[5px] border-neutral-800 bg-black shadow-2xl">
                  <img src={s.src} alt="" draggable={false} className="pointer-events-none aspect-[9/19] w-full object-cover object-top" />
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 6. CONTACT ---------- */
export function Contact() {
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  const [notice, setNotice] = useState('');
  const rows = [
    { icon: Mail, label: t.email, value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: t.phone, value: profile.phoneDisplay, href: `tel:${profile.phone}` },
    { icon: MessageCircle, label: t.whatsapp, value: profile.phoneDisplay, href: profile.whatsapp },
  ];
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!name.trim() || !email.trim() || !message.trim()) { setNotice(t.contactRequired); setStatus('fail'); return; }
    if (!emailOk) { setNotice(t.contactEmailInvalid); setStatus('fail'); return; }
    if (message.trim().length < 10) { setNotice(t.contactShort); setStatus('fail'); return; }
    setNotice('');
    setStatus('sending');
    try {
      const msg = await submitContact(name.trim(), email.trim(), message.trim(), website);
      setNotice(msg || t.contactSent);
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setNotice(err instanceof Error && err.message ? err.message : t.sendError);
      setStatus('fail');
    }
  };
  return (
    <section id="contact" className="wrap relative box-border flex min-h-[100svh] w-full max-w-full flex-col overflow-x-clip pt-24">
      <div className="marble" aria-hidden />
      <div className="relative grid min-w-0 flex-1 items-center gap-10 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="font-display text-[15vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
            <MaskTitle className="metal">{t.contactTitleA}</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">{t.contactTitleB}</span></Italic></MaskTitle>
          </h2>
          <motion.div {...reveal(0.2)} className="mt-8 flex flex-wrap gap-3">
            <Heartbeat>
              <a href={`mailto:${profile.email}`} className="label inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-ink hover:bg-white"><MotionIcon icon={Mail} size={14} effect="draw" /> {t.writeEmail}</a>
            </Heartbeat>
            <a href={profile.cv} target="_blank" rel="noreferrer" className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-6 hover:bg-white hover:text-ink"><MotionIcon icon={Download} size={14} effect="bounce" /> {t.myCv}</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className="box-border mx-auto w-full min-w-0 max-w-full rounded-3xl border border-white/15 bg-white/[.06] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl md:p-10">
          <p className="label text-white/50">{profile.fullName}</p>
          <ul className="mt-6 divide-y divide-white/10">
            {rows.map(({ icon: I, label, value, href }) => (
              <li key={label} className="flex min-w-0 items-center gap-4 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5"><MotionIcon icon={I} size={16} effect="draw" /></span>
                <div className="min-w-0 flex-1">
                  <p className="label text-white/40">{label}</p>
                  <a href={href} className="block break-all text-base hover:text-cream">{value}</a>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={send} className="mt-6 grid min-w-0 gap-3">
            <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={t.bookName} aria-label={t.bookName} className="box-border min-h-11 w-full min-w-0 max-w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder={t.email} aria-label={t.email} className="box-border min-h-11 w-full min-w-0 max-w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder={t.bookMessage} aria-label={t.bookMessage} className="box-border w-full min-w-0 max-w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none focus:border-cream" />
            <AnimatePresence mode="wait">
              {notice && (
                <motion.p key={status + notice} role={status === 'fail' ? 'alert' : 'status'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-base text-cream">{notice}</motion.p>
              )}
            </AnimatePresence>
            <Heartbeat className="max-w-full">
              <motion.button type="submit" disabled={status === 'sending'} whileTap={{ scale: 0.98 }} className="box-border inline-flex max-w-full min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-base font-medium text-ink disabled:opacity-60">
                <MotionIcon icon={Send} size={16} effect="slide" />
                {status === 'sending' ? t.sending : t.contactSend}
              </motion.button>
            </Heartbeat>
          </form>
          <div className="mt-6 flex gap-3">
            {[{ I: Github, h: profile.github, l: 'GitHub' }, { I: Linkedin, h: profile.linkedin, l: 'LinkedIn' }, { I: Twitter, h: profile.twitter, l: 'X' }].map(({ I, h, l }) => (
              <motion.a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} whileHover={{ y: -4 }} whileTap={{ scale: 0.94 }} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-cream hover:text-ink"><MotionIcon icon={I} size={16} effect="bounce" /></motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      <footer className="relative mt-16 flex min-w-0 flex-col gap-3 border-t border-white/10 py-6 md:flex-row md:justify-between">
        <span className="label text-white/40">© {profile.year} {profile.fullName}</span>
        <a href="/blog" className="label text-white/40 hover:text-cream">{t.nav.blog}</a>
        <span className="label max-w-full break-words text-white/40">{profile.heroSubtitle[lang]}</span>
      </footer>
    </section>
  );
}
