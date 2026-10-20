'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { awards, communities, education, experiences, gallery, managedPages, tagLabel } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import { fadeUp, hoverLift, inViewGroup, reveal } from '@/lib/motion';

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

export function Path() {
  const { t, lang } = useI18n();
  return (
    <section id="parcours" className="px-5 py-20 md:px-10 md:py-28">
      <h2 className="font-display text-[16vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
        <MaskTitle className="metal">{t.pathTitleA}</MaskTitle>
        <MaskTitle><Italic><span className="text-cream">{t.pathTitleB}</span></Italic></MaskTitle>
      </h2>
      <motion.ol {...inViewGroup(0.08)} className="relative mt-14 border-l border-white/15 md:ml-4">
        {experiences.map((e) => (
          <motion.li key={e.company} variants={fadeUp} className="relative pb-12 pl-8 md:pl-12">
            <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-cream" />
            <p className="label text-white/40">{e.period[lang]}</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none md:text-4xl">{e.company}</h3>
            <p className="mt-2 font-serif text-xl italic text-cream">{e.role[lang]}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {e.tags.map((tag) => <li key={tag} className="label rounded-full border border-white/15 px-3 py-1 text-white/70">{tagLabel(tag, lang)}</li>)}
            </ul>
            <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-mist">
              {e.description[lang].map((line) => <li key={line}>{line}</li>)}
            </ul>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

export function Pricing() {
  const { t } = useI18n();
  return (
    <section id="tarifs" className="px-5 py-20 md:px-10 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[16vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
          <MaskTitle className="metal">{t.pricingTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.pricingTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.p {...reveal(0.15)} className="max-w-sm text-sm text-mist">{t.pricingNote}</motion.p>
      </div>
      <motion.ul {...inViewGroup(0.1)} className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {t.prices.map((p) => (
          <motion.li key={p.name} variants={fadeUp} {...hoverLift}
            className={`flex min-h-[240px] flex-col justify-between rounded-3xl border p-6 ${p.quote ? 'border-dashed border-cream/70 bg-transparent' : 'border-white/10 bg-white/[.04]'}`}>
            <div>
              <p className="label text-cream">{p.quote ? t.onQuote : t.from}</p>
              <h3 className="mt-4 font-display text-2xl font-black uppercase leading-none">{p.name}</h3>
            </div>
            {p.quote
              ? <p className="mt-8 font-serif text-3xl italic text-cream">{t.onQuote}</p>
              : <p className="mt-8 font-display text-5xl font-black tracking-tight">${p.amount}</p>}
            {p.quote && <p className="mt-3 text-sm text-mist">{t.onQuoteBody}</p>}
          </motion.li>
        ))}
      </motion.ul>
      <motion.div {...reveal(0.2)} className="mt-8">
        <a href="#contact" className="label inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-ink hover:bg-white">{t.askQuote} <ArrowUpRight size={14} /></a>
      </motion.div>
    </section>
  );
}

export function Awards() {
  const { t, lang } = useI18n();
  return (
    <section id="distinctions" className="px-5 py-20 md:px-10 md:py-28">
      <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
        <MaskTitle className="metal">{t.awardsTitleA}</MaskTitle>
        <MaskTitle><Italic><span className="text-cream">{t.awardsTitleB}</span></Italic></MaskTitle>
      </h2>
      <p className="label mt-10 text-white/40">{t.awardsKicker}</p>
      <motion.ul {...inViewGroup(0.08)} className="mt-5 grid gap-4 md:grid-cols-2">
        {awards.map((a) => (
          <motion.li key={a.title.fr} variants={fadeUp} {...hoverLift} className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-black uppercase leading-tight md:text-2xl">{a.title[lang]}</h3>
              <span className="label shrink-0 text-cream">{a.year}</span>
            </div>
            <p className="mt-3 text-sm text-white/70">{a.issuer}</p>
            <p className="mt-3 text-sm leading-relaxed text-mist">{a.description[lang]}</p>
          </motion.li>
        ))}
      </motion.ul>
      <p className="label mt-14 text-white/40">{t.educationKicker}</p>
      <motion.ul {...inViewGroup(0.1)} className="mt-5 grid gap-4 md:grid-cols-2">
        {education.map((ed) => (
          <motion.li key={ed.school} variants={fadeUp} className="border-t border-white/15 pt-5">
            <p className="label text-cream">{ed.year}</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase">{ed.degree[lang]}</h3>
            <p className="mt-1 text-sm text-white/80">{ed.field[lang]}</p>
            <p className="mt-2 text-sm text-mist">{ed.school}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

export function Community() {
  const { t, lang } = useI18n();
  return (
    <section id="communaute" className="px-5 py-20 md:px-10 md:py-28">
      <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
        <MaskTitle className="metal">{t.communityTitleA}</MaskTitle>
        <MaskTitle><Italic><span className="text-cream">{t.communityTitleB}</span></Italic></MaskTitle>
      </h2>
      <motion.ul {...inViewGroup(0.08)} className="mt-12 grid gap-4 md:grid-cols-2">
        {communities.map((c) => (
          <motion.li key={c.name} variants={fadeUp} {...hoverLift} className="rounded-3xl border border-white/10 p-6">
            <p className="label text-cream">{c.role[lang]}</p>
            <h3 className="mt-3 font-display text-2xl font-black uppercase">{c.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">{c.description[lang]}</p>
          </motion.li>
        ))}
      </motion.ul>
      <p className="label mt-14 text-white/40">{t.pagesKicker}</p>
      <motion.ul {...inViewGroup(0.08)} className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {managedPages.map((p) => {
          const real = p.link && p.link !== '#';
          const inner = (
            <>
              <p className="label text-white/40">{p.category[lang]}</p>
              <h3 className="mt-4 font-display text-xl font-black uppercase">{p.name}</h3>
              <p className="mt-6 font-display text-3xl font-black">{p.followers} <span className="font-serif text-lg font-normal italic text-cream">{t.followers}</span></p>
            </>
          );
          return (
            <motion.li key={p.name} variants={fadeUp} {...hoverLift} className="rounded-3xl border border-white/10 bg-white/[.03]">
              {real
                ? <a href={p.link} target="_blank" rel="noreferrer" className="block p-6">{inner} <ArrowUpRight size={16} className="mt-4" /></a>
                : <div className="p-6">{inner}</div>}
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}

export function Gallery() {
  const { t } = useI18n();
  return (
    <section id="galerie" className="px-5 py-20 md:px-10 md:py-28">
      <p className="label text-cream">{t.nav.galerie}</p>
      <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none md:text-7xl">
        <MaskTitle className="metal">{t.galleryKicker}</MaskTitle>
      </h2>
      <motion.ul {...inViewGroup(0.12)} className="mt-10 grid gap-4 md:grid-cols-2">
        {gallery.map((src) => (
          <motion.li key={src} variants={fadeUp} className="overflow-hidden rounded-3xl border border-white/10">
            <motion.img src={src} alt={t.photoAlt} className="aspect-[4/5] w-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
