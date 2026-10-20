'use client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone, Twitter, Plus, Minus, Download, MessageCircle } from 'lucide-react';
import { fadeUp, inViewGroup, reveal, slideIn } from '@/lib/motion';
import { profile, roles, skills, services, projects, phoneScreens, experiences } from '@/lib/data';

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

/* Grand titre qui monte derrière un masque */
function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

/* ---------- 1. HERO ---------- */
export function Hero({ ready }: { ready: boolean }) {
  const [r, setR] = useState(0);
  useEffect(() => { const t = setInterval(() => setR((v) => (v + 1) % roles.length), 2200); return () => clearInterval(t); }, []);
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
      <motion.img src={profile.photo} alt={`Portrait de ${profile.fullName}`} style={{ x: px, y: py }}
        initial={{ opacity: 0, y: 120 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-[118vw] max-w-none md:w-[52vw] md:max-w-[820px] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]" />
      <motion.div initial="hidden" animate={ready ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pb-6 pt-16 md:bottom-10 md:bg-none md:pb-0 md:pt-0 md:flex-row md:items-end md:justify-between md:px-10">
        <motion.div variants={fadeUp}>
          <p className="label mb-2 text-white/50">{profile.fullName}</p>
          <p className="font-display text-xl font-extrabold md:text-3xl">
            Développeur{' '}
            <span className="relative inline-block min-w-[5ch] align-bottom">
              <span className="invisible font-serif text-2xl italic md:text-4xl">Next.js</span>
              {roles.map((w, k) => (
                <motion.span key={w} initial={false} animate={{ y: k === r ? 0 : 20, opacity: k === r ? 1 : 0 }} transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 font-serif text-2xl font-normal italic text-cream md:text-4xl">{w}</motion.span>
              ))}
            </span>
          </p>
          <p className="mt-1 text-xs text-mist md:text-sm">{profile.heroSubtitle}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <a href="#contact" className="label rounded-full border border-white/30 bg-white/5 px-5 py-3 backdrop-blur hover:bg-cream hover:text-ink">Contact</a>
          <span className="hidden h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5 md:flex" aria-hidden>
            <motion.span className="h-1.5 w-1 rounded-full bg-white" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </span>
          <span className="label hidden text-white/40 md:inline">@donchaminade</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- 2. À PROPOS ---------- */
export function About() {
  return (
    <section id="apropos" className="relative min-h-[100svh] px-5 py-28 md:px-10">
      <div className="grid gap-10 md:grid-cols-2">
        <h2 className="font-display text-[22vw] font-black uppercase leading-[.85] tracking-tight md:text-[12vw]">
          <MaskTitle className="metal">Intro</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">duction</span></Italic></MaskTitle>
        </h2>
        <motion.div {...reveal(0.2)} className="self-start rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur md:p-8">
          <p className="label mb-4 text-cream">{profile.availability}</p>
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">{profile.bio}</p>
          <p className="mt-3 text-sm text-mist">{profile.heroTitle} {profile.heroSubtitle}.</p>
          <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="border-t border-white/10 pt-3"><span className="font-display text-3xl font-black">{profile.experienceBadge}</span><p className="label mt-1 text-white/50">Expérience solide</p></div>
            {experiences.slice(0, 2).map((e) => (
              <div key={e.company} className="border-t border-white/10 pt-3"><p className="font-semibold">{e.company}</p><p className="text-xs text-mist">{e.role}</p><p className="label mt-1 text-white/40">{e.period}</p></div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="mt-14 space-y-3 overflow-hidden">
        {skills.map((row, i) => (
          <motion.div key={i} {...inViewGroup(0.06, i * 0.15)} className={`flex flex-wrap gap-2 md:gap-3 ${i % 2 ? 'md:pl-24' : ''}`}>
            {row.map((s) => (
              <motion.span key={s} variants={fadeUp} whileHover={{ y: -3, backgroundColor: '#d9d0c1', color: '#060708' }}
                className="rounded-full border border-white/15 bg-white/[.03] px-4 py-2 text-xs text-white/85 md:text-sm">{s}</motion.span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 3. SERVICES ---------- */
export function Services() {
  const [open, setOpen] = useState<number>(2);
  return (
    <section id="services" className="relative min-h-[100svh] px-5 py-28 md:px-10">
      <h2 className="ml-auto max-w-3xl text-right font-display text-[13vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
        <MaskTitle className="metal">Ce que je</MaskTitle>
        <MaskTitle className="metal">sais <Italic>faire</Italic></MaskTitle>
      </h2>
      <motion.ul {...inViewGroup(0.08)} className="mt-14 border-t border-white/10">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <motion.li key={s.title} variants={fadeUp} onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(i)}
              animate={{ backgroundColor: isOpen ? '#d9d0c1' : 'rgba(0,0,0,0)', color: isOpen ? '#060708' : '#ffffff' }} transition={{ duration: 0.4 }}
              className="border-b border-white/10">
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-5 px-3 py-5 text-left md:px-6">
                <span className="font-display text-sm font-black opacity-60">0{i + 1}</span>
                <span className="flex-1 font-display text-base font-extrabold uppercase tracking-wide md:text-xl">{s.title}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }}>{isOpen ? <Minus size={18} /> : <Plus size={18} />}</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }} className="overflow-hidden">
                    <div className="flex flex-col gap-4 px-3 pb-6 md:flex-row md:items-end md:justify-between md:pl-16 md:pr-6">
                      <ul className="flex flex-wrap gap-2">
                        {s.items.map((it) => <li key={it} className="rounded-full border border-ink/25 px-3 py-1 text-xs md:text-sm">{it}</li>)}
                      </ul>
                      <a href="#contact" className="label inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-cream">Discutons-en <ArrowUpRight size={14} /></a>
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
  const [k, setK] = useState(0);
  useEffect(() => { const t = setInterval(() => setK((v) => (v + 1) % images.length), 2600); return () => clearInterval(t); }, [images.length]);
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

export function Work() {
  const [i, setI] = useState(0);
  const p = projects[i];
  return (
    <section id="projets" className="relative min-h-[100svh] px-5 py-28 md:px-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[14vw] font-black uppercase leading-[.85] tracking-tight md:text-[6.5vw]">
          <MaskTitle className="metal">Projets <Italic>choisis</Italic></MaskTitle>
        </h2>
        <motion.div {...reveal(0.1)} className="flex gap-2">
          {projects.map((q, j) => (
            <button key={q.title} onClick={() => setI(j)} aria-label={`Voir ${q.title}`}
              className={`label rounded-full border px-3 py-2 transition ${i === j ? 'border-cream bg-cream text-ink' : 'border-white/20 text-white/60 hover:text-white'}`}>0{j + 1}</button>
          ))}
        </motion.div>
      </div>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_1.3fr]">
        <AnimatePresence mode="wait">
          <motion.div key={p.title} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="order-2 md:order-1">
            <motion.p variants={fadeUp} className="font-display text-sm font-black text-white/50">0{i + 1} — {p.type === 'Mobile' ? 'Application mobile' : 'Application web'}</motion.p>
            <motion.h3 variants={fadeUp} className="mt-3 font-display text-5xl font-black uppercase leading-none md:text-7xl">
              {p.accent}<Italic><span className="text-cream">{p.rest}</span></Italic>
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-sm leading-relaxed text-mist md:text-base">{p.description}</motion.p>
            <motion.ul variants={fadeUp} className="mt-4 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="label rounded-full border border-white/15 px-3 py-1 text-white/70">{t}</li>)}</motion.ul>
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-ink hover:bg-white">{p.link.includes('play.google') ? 'Google Play' : 'Voir le site'} <ArrowUpRight size={14} /></a>}
              {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 hover:bg-white hover:text-ink"><Github size={14} /> GitHub</a>}
              <button onClick={() => setI((i + 1) % projects.length)} className="label inline-flex items-center gap-2 rounded-full px-3 py-3 text-white/60 hover:text-white">Suivant →</button>
            </motion.div>
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
    </section>
  );
}

/* ---------- 5. COMPOSANTS (carrousel d'écrans) ---------- */
export function Components() {
  const [c, setC] = useState(2);
  return (
    <section id="composants" className="relative overflow-hidden px-5 py-28 md:px-10">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.6fr]">
        <div>
          <h2 className="font-display text-5xl font-black uppercase leading-[.9] tracking-tight md:text-6xl">
            <MaskTitle className="metal">Des écrans</MaskTitle>
            <MaskTitle className="metal">qui tiennent</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">sous pression.</span></Italic></MaskTitle>
          </h2>
          <motion.p {...reveal(0.2)} className="mt-5 max-w-sm text-sm text-mist">Interfaces mobiles réelles de Picon (Google Play), Akontaa et Ratoufa, développées en Flutter.</motion.p>
          <motion.div {...reveal(0.3)} className="mt-6 flex gap-3">
            <button onClick={() => setC(Math.max(0, c - 1))} className="label rounded-full border border-white/25 px-4 py-2 hover:bg-white hover:text-ink" aria-label="Écran précédent">←</button>
            <button onClick={() => setC(Math.min(phoneScreens.length - 1, c + 1))} className="label rounded-full bg-cream px-4 py-2 text-ink" aria-label="Écran suivant">→</button>
            <span className="label self-center text-white/40">{String(c + 1).padStart(2, '0')} / {String(phoneScreens.length).padStart(2, '0')}</span>
          </motion.div>
        </div>
        <motion.div {...inViewGroup(0.08)} className="relative h-[460px] md:h-[560px]">
          {phoneScreens.map((s, j) => {
            const d = j - c;
            return (
              <motion.button key={s.src} variants={{ hidden: { opacity: 0, x: 200 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                onClick={() => setC(j)} aria-label={s.label}
                className="absolute left-1/2 top-1/2 w-[200px] md:w-[240px]" style={{ zIndex: 20 - Math.abs(d) }}>
                <motion.div animate={{ x: `calc(-50% + ${d * 72}%)`, y: '-50%', scale: d === 0 ? 1 : 0.82, opacity: Math.abs(d) > 2 ? 0 : d === 0 ? 1 : 0.45, filter: d === 0 ? 'blur(0px)' : 'blur(2px)' }}
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden rounded-[2rem] border-[5px] border-neutral-800 bg-black shadow-2xl">
                  <img src={s.src} alt={s.label} className="aspect-[9/19] w-full object-cover object-top" />
                </motion.div>
                {d === 0 && <p className="label mt-3 -translate-x-1/2 text-center text-white/60" style={{ transform: 'translate(-50%, 240px)' }}>{s.label}</p>}
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
  const rows = [
    { icon: Mail, label: 'E-mail', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Téléphone', value: profile.phoneDisplay, href: `tel:${profile.phone}` },
    { icon: MessageCircle, label: 'WhatsApp', value: profile.phoneDisplay, href: profile.whatsapp },
    { icon: MapPin, label: 'Localisation', value: profile.location },
  ];
  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-28 md:px-10">
      <div className="marble" aria-hidden />
      <div className="relative grid flex-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-[15vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
            <MaskTitle className="metal">Restons</MaskTitle>
            <MaskTitle><Italic><span className="text-cream">en contact</span></Italic></MaskTitle>
          </h2>
          <motion.div {...reveal(0.2)} className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="label rounded-full bg-cream px-6 py-3 text-ink hover:bg-white">Écrire un e-mail</a>
            <a href={profile.cv} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 hover:bg-white hover:text-ink"><Download size={14} /> Mon CV</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rounded-3xl border border-white/15 bg-white/[.06] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl md:p-10">
          <p className="label text-white/50">{profile.fullName}</p>
          <ul className="mt-6 divide-y divide-white/10">
            {rows.map(({ icon: I, label, value, href }) => (
              <li key={label} className="flex items-center gap-4 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5"><I size={16} /></span>
                <div className="min-w-0"><p className="label text-white/40">{label}</p>
                  {href ? <a href={href} className="block truncate text-sm hover:text-cream md:text-base">{value}</a> : <p className={`text-sm md:text-base ${value.startsWith('TODO') ? 'text-amber-300/80' : ''}`}>{value}</p>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            {[{ I: Github, h: profile.github, l: 'GitHub' }, { I: Linkedin, h: profile.linkedin, l: 'LinkedIn' }, { I: Twitter, h: profile.twitter, l: 'X (Twitter)' }].map(({ I, h, l }) => (
              <motion.a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} whileHover={{ y: -4 }} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-cream hover:text-ink"><I size={16} /></motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      <footer className="relative mt-16 flex flex-col gap-3 border-t border-white/10 py-6 md:flex-row md:justify-between">
        <span className="label text-white/40">© {profile.year} {profile.fullName}</span>
        <span className="label text-white/40">{profile.heroSubtitle}</span>
      </footer>
    </section>
  );
}
