'use client';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, Phone, Twitter, Plus, Minus, Download, MessageCircle } from 'lucide-react';
import { fadeUp, hoverLift, inViewGroup, reveal, slideIn } from '@/lib/motion';
import { phoneScreens, profile, projects, roles, skillBlocks, skillRows, softSkills, tagLabel, type Bi, type Project } from '@/lib/catalog';
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
  const i = title.indexOf(' ');
  if (i < 0) return { accent: title, rest: '' };
  return { accent: title.slice(0, i), rest: title.slice(i) };
}

/* ---------- 1. HERO ---------- */
export function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useI18n();
  const reduced = !!useReducedMotion();
  const [r, setR] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setR((v) => (v + 1) % roles.length), 2200);
    return () => clearInterval(timer);
  }, [reduced]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, [-1, 1], [-8, 8]), { stiffness: 60, damping: 20 });
  const tx = useTransform(px, (v) => -v / 2);
  return (
    <section id="accueil" onPointerMove={(e) => { mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1); }}
      className="spot relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden pt-24">
      <motion.h1 style={{ x: tx }} initial={{ opacity: 0, scale: 1.15 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1, ease: 'easeOut' }}
        className="wordmark metal pointer-events-none absolute inset-x-0 top-[30%] w-full select-none text-center font-display font-black md:top-[16%]">
        DONCHAMINADE
      </motion.h1>
      <motion.img src={profile.photo} alt={`${t.portraitOf} ${profile.fullName}`} style={{ x: px, y: py }}
        initial={{ opacity: 0, y: 120 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-[118vw] max-w-none md:w-[52vw] md:max-w-[820px] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]" />
      <motion.div initial="hidden" animate={ready ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pb-6 pt-16 md:bottom-10 md:bg-none md:pb-0 md:pt-0 md:flex-row md:items-end md:justify-between md:px-10">
        <motion.div variants={fadeUp}>
          <p className="label mb-2 text-white/50">{profile.fullName}</p>
          <p className="font-display text-xl font-extrabold md:text-3xl">
            {t.developer}{' '}
            <span className="relative inline-block min-w-[5ch] align-bottom">
              <span className="invisible font-serif text-2xl italic md:text-4xl">Next.js</span>
              {roles.map((w, k) => (
                <motion.span key={w} initial={false} animate={{ y: k === r ? 0 : 20, opacity: k === r ? 1 : 0 }} transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 font-serif text-2xl font-normal italic text-cream md:text-4xl">{w}</motion.span>
              ))}
            </span>
          </p>
          <p className="mt-1 text-xs text-mist md:text-sm">{profile.heroSubtitle[lang]}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <a href="#contact" className="label rounded-full border border-white/30 bg-white/5 px-5 py-3 backdrop-blur hover:bg-cream hover:text-ink">{t.contact}</a>
          <span className="hidden h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5 md:flex" aria-hidden>
            <motion.span className="fg h-1.5 w-1 rounded-full" animate={reduced ? undefined : { y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </span>
          <span className="label hidden text-white/40 md:inline">@donchaminade</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- 2. À PROPOS ---------- */
export function About() {
  const { t, lang } = useI18n();
  const badge = lang === 'en' ? profile.experienceBadgeEn : profile.experienceBadge;
  return (
    <section id="apropos" className="relative px-5 py-20 md:px-10 md:py-28">
      <div className="grid gap-10 md:grid-cols-2">
        <h2 className="font-display text-[22vw] font-black uppercase leading-[.85] tracking-tight md:text-[12vw]">
          <MaskTitle className="metal">{t.aboutTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.aboutTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.div {...reveal(0.2)} className="self-start rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur md:p-8">
          <p className="label mb-4 text-cream">{profile.availability[lang]}</p>
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">{profile.bio[lang]}</p>
          <p className="mt-3 text-sm text-mist">{profile.heroTitle[lang]} {profile.heroSubtitle[lang]}</p>
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
                <motion.span key={label} variants={fadeUp} whileHover={{ y: -3, backgroundColor: '#d9d0c1', color: '#060708' }}
                  className="rounded-full border border-white/15 bg-white/[.03] px-4 py-2 text-xs text-white/85 md:text-sm">{label}</motion.span>
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
            <p className="mt-2 text-sm leading-relaxed text-mist">{s.impact[lang]}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

/* ---------- 3. SERVICES ---------- */
export function Services() {
  const { t, lang, theme } = useI18n();
  const [open, setOpen] = useState<number>(2);
  const fg = theme === 'light' ? '#1c1814' : '#ffffff';
  return (
    <section id="services" className="relative px-5 py-20 md:px-10 md:py-28">
      <h2 className="ml-auto max-w-3xl text-right font-display text-[13vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
        <MaskTitle className="metal">{t.servicesTitleA}</MaskTitle>
        <MaskTitle className="metal">{t.servicesTitleB} <Italic>{t.servicesDo}</Italic></MaskTitle>
      </h2>
      <motion.ul {...inViewGroup(0.08)} className="mt-14 border-t border-white/10">
        {skillBlocks.map((s, i) => {
          const isOpen = open === i;
          return (
            <motion.li key={s.title.fr} variants={fadeUp} onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(i)}
              animate={{ backgroundColor: isOpen ? '#d9d0c1' : 'rgba(0,0,0,0)', color: isOpen ? '#1c1814' : fg }} transition={{ duration: 0.4 }}
              className="border-b border-white/10">
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-3 py-5 text-left md:px-6">
                <span className="font-display text-sm font-black opacity-60">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 font-display text-base font-extrabold uppercase tracking-wide md:text-xl">{s.title[lang]}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }}>{isOpen ? <Minus size={18} /> : <Plus size={18} />}</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }} className="overflow-hidden">
                    <div className="space-y-5 px-3 pb-6 md:pl-16 md:pr-6">
                      {s.categories.map((cat) => (
                        <div key={cat.name.fr}>
                          <p className="label mb-2 opacity-70">{cat.name[lang]}</p>
                          <ul className="flex flex-wrap gap-2">
                            {cat.items[lang].map((it) => <li key={it} className="rounded-full border border-ink/20 px-3 py-1 text-xs md:text-sm">{it}</li>)}
                          </ul>
                        </div>
                      ))}
                      <a href="#contact" className="label inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-cream">{t.discuss} <ArrowUpRight size={14} /></a>
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
    ? 'aspect-[9/19] w-[46%] md:w-[38%] rounded-[2.2rem] border-[6px]'
    : 'aspect-[16/10] w-[92%] rounded-xl border-[8px] border-b-[14px]';
  return (
    <div className="spot relative flex h-full min-h-[340px] items-center justify-center md:min-h-[520px]">
      <div className={`relative overflow-hidden border-neutral-800 bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)] ${frame}`}>
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

export function Work() {
  const { t, lang } = useI18n();
  const featured = projects.filter((p) => p.images.length > 0);
  const [i, setI] = useState(0);
  const [filter, setFilter] = useState<'all' | 'Web' | 'Mobile'>('all');
  const [more, setMore] = useState(false);
  const p = featured[i] ?? featured[0];
  const { accent, rest } = splitTitle(p.title);
  const list = projects.filter((q) => filter === 'all' || q.type === filter);
  const shown = more ? list : list.slice(0, PAGE);
  const filters = [
    { id: 'all' as const, label: t.filterAll },
    { id: 'Web' as const, label: t.filterWeb },
    { id: 'Mobile' as const, label: t.filterMobile },
  ];
  return (
    <section id="projets" className="relative px-5 py-20 md:px-10 md:py-28">
      <h2 className="font-display text-[14vw] font-black uppercase leading-[.85] tracking-tight md:text-[6.5vw]">
        <MaskTitle className="metal">{t.projectsTitle} <Italic>{t.projectsChosen}</Italic></MaskTitle>
      </h2>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="label text-white/45">{String(i + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setI((i - 1 + featured.length) % featured.length)} className="label rounded-full border border-white/25 px-4 py-2 hover:bg-white hover:text-ink" aria-label={t.prevScreen}>←</button>
          <button type="button" onClick={() => setI((i + 1) % featured.length)} className="label rounded-full bg-cream px-4 py-2 text-ink" aria-label={t.next}>{t.next} →</button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {featured.map((q, j) => (
          <button key={q.title} type="button" onClick={() => setI(j)}
            className={`label shrink-0 rounded-full border px-3 py-2 ${i === j ? 'border-cream bg-cream text-ink' : 'border-white/20 text-white/60'}`}>{q.title}</button>
        ))}
      </div>
      <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.3fr]">
        <AnimatePresence mode="wait">
          <motion.div key={p.title} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="order-2 md:order-1">
            <motion.p variants={fadeUp} className="font-display text-sm font-black text-white/50">{String(i + 1).padStart(2, '0')} — {p.type === 'Mobile' ? t.mobileApp : t.webApp}</motion.p>
            <motion.h3 variants={fadeUp} className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              {accent}{rest && <Italic><span className="text-cream">{rest}</span></Italic>}
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-sm leading-relaxed text-mist md:text-base">{p.description[lang]}</motion.p>
            <motion.ul variants={fadeUp} className="mt-4 flex flex-wrap gap-2">{p.tags.map((tag) => <li key={tag} className="label rounded-full border border-white/15 px-3 py-1 text-white/70">{tagLabel(tag, lang)}</li>)}</motion.ul>
            <ProjectLinks p={p} />
          </motion.div>
        </AnimatePresence>
        <motion.div {...slideIn(80, 0.1)} className="order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div key={p.title} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
              <Device type={p.type} images={p.images} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="font-display text-4xl font-black uppercase md:text-5xl">{t.catalogKicker}</h3>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f.id} type="button" onClick={() => { setFilter(f.id); setMore(false); }}
              className={`label rounded-full border px-4 py-2 ${filter === f.id ? 'border-cream bg-cream text-ink' : 'border-white/20 text-white/60'}`}>{f.label}</button>
          ))}
        </div>
      </div>
      <motion.ul {...inViewGroup(0.05)} className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((q) => <ProjectCard key={q.title} p={q} />)}
      </motion.ul>
      {list.length > PAGE && (
        <button type="button" onClick={() => setMore((v) => !v)} className="label mt-8 rounded-full border border-white/25 px-6 py-3 hover:bg-white hover:text-ink">
          {more ? t.seeLess : t.seeAll}
        </button>
      )}
    </section>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  const { t } = useI18n();
  return (
    <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
      {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-ink hover:bg-white">{p.link.includes('play.google') ? t.googlePlay : t.seeSite} <ArrowUpRight size={14} /></a>}
      {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 hover:bg-white hover:text-ink"><Github size={14} /> GitHub</a>}
    </motion.div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const { t, lang } = useI18n();
  const shot = p.images[0];
  return (
    <motion.li variants={fadeUp} {...hoverLift} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.03]">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        {shot
          ? <img src={shot} alt="" className="h-full w-full object-cover object-top" />
          : <div className="grid h-full place-items-center"><span className="font-display text-4xl font-black text-white/30">{t.noImage}</span></div>}
      </div>
      <div className="p-5">
        <p className="label text-cream">{p.type === 'Mobile' ? t.mobileApp : t.webApp}</p>
        <h4 className="mt-2 font-display text-2xl font-black uppercase leading-none">{p.title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-mist">{p.description[lang]}</p>
        <ul className="mt-3 flex flex-wrap gap-2">{p.tags.map((tag) => <li key={tag} className="label rounded-full border border-white/15 px-2 py-1 text-white/60">{tagLabel(tag, lang)}</li>)}</ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-cream">{p.link.includes('play.google') ? t.googlePlay : t.seeSite} <ArrowUpRight size={14} /></a>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-cream"><Github size={14} /> GitHub</a>}
        </div>
      </div>
    </motion.li>
  );
}

/* ---------- 5. ÉCRANS ---------- */
export function Components() {
  const { t, lang } = useI18n();
  const [c, setC] = useState(2);
  return (
    <section id="ecrans" className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.6fr]">
        <div>
          <h2 className="font-display text-5xl font-black uppercase leading-[.9] tracking-tight md:text-6xl">
            <MaskTitle className="metal">{t.screensA}</MaskTitle>
            <MaskTitle className="metal">{t.screensB}</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">{t.screensC}</span></Italic></MaskTitle>
          </h2>
          <motion.p {...reveal(0.2)} className="mt-5 max-w-sm text-sm text-mist">{t.screensNote}</motion.p>
          <motion.div {...reveal(0.3)} className="mt-6 flex gap-3">
            <button type="button" onClick={() => setC(Math.max(0, c - 1))} className="label rounded-full border border-white/25 px-4 py-2 hover:bg-white hover:text-ink" aria-label={t.prevScreen}>←</button>
            <button type="button" onClick={() => setC(Math.min(phoneScreens.length - 1, c + 1))} className="label rounded-full bg-cream px-4 py-2 text-ink" aria-label={t.nextScreen}>→</button>
            <span className="label self-center text-white/40">{String(c + 1).padStart(2, '0')} / {String(phoneScreens.length).padStart(2, '0')}</span>
          </motion.div>
        </div>
        <motion.div {...inViewGroup(0.08)} className="relative h-[460px] md:h-[560px]">
          {phoneScreens.map((s, j) => {
            const d = j - c;
            return (
              <motion.button key={s.src} variants={{ hidden: { opacity: 0, x: 200 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                onClick={() => setC(j)} aria-label={s.label[lang]} type="button"
                className="absolute left-1/2 top-1/2 w-[200px] md:w-[240px]" style={{ zIndex: 20 - Math.abs(d) }}>
                <motion.div animate={{ x: `calc(-50% + ${d * 72}%)`, y: '-50%', scale: d === 0 ? 1 : 0.82, opacity: Math.abs(d) > 2 ? 0 : d === 0 ? 1 : 0.45, filter: d === 0 ? 'blur(0px)' : 'blur(2px)' }}
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden rounded-[2rem] border-[5px] border-neutral-800 bg-black shadow-2xl">
                  <img src={s.src} alt={s.label[lang]} className="aspect-[9/19] w-full object-cover object-top" />
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
  const rows = [
    { icon: Mail, label: t.email, value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: t.phone, value: profile.phoneDisplay, href: `tel:${profile.phone}` },
    { icon: MessageCircle, label: t.whatsapp, value: profile.phoneDisplay, href: profile.whatsapp },
  ];
  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-24 md:px-10">
      <div className="marble" aria-hidden />
      <div className="relative grid flex-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-[15vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
            <MaskTitle className="metal">{t.contactTitleA}</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">{t.contactTitleB}</span></Italic></MaskTitle>
          </h2>
          <motion.div {...reveal(0.2)} className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="label rounded-full bg-cream px-6 py-3 text-ink hover:bg-white">{t.writeEmail}</a>
            <a href={profile.cv} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 hover:bg-white hover:text-ink"><Download size={14} /> {t.myCv}</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rounded-3xl border border-white/15 bg-white/[.06] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl md:p-10">
          <p className="label text-white/50">{profile.fullName}</p>
          <ul className="mt-6 divide-y divide-white/10">
            {rows.map(({ icon: I, label, value, href }) => (
              <li key={label} className="flex items-center gap-4 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5"><I size={16} /></span>
                <div className="min-w-0">
                  <p className="label text-white/40">{label}</p>
                  <a href={href} className="block truncate text-sm hover:text-cream md:text-base">{value}</a>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            {[{ I: Github, h: profile.github, l: 'GitHub' }, { I: Linkedin, h: profile.linkedin, l: 'LinkedIn' }, { I: Twitter, h: profile.twitter, l: 'X' }].map(({ I, h, l }) => (
              <motion.a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} whileHover={{ y: -4 }} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-cream hover:text-ink"><I size={16} /></motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      <footer className="relative mt-16 flex flex-col gap-3 border-t border-white/10 py-6 md:flex-row md:justify-between">
        <span className="label text-white/40">© {profile.year} {profile.fullName}</span>
        <span className="label text-white/40">{profile.heroSubtitle[lang]}</span>
      </footer>
    </section>
  );
}
