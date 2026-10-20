'use client';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { awards, communities, education, experiences, managedPages, tagLabel } from '@/lib/catalog';
import GlassyGallery from './GlassyGallery';
import { MotionIcon } from './MotionIcon';
import { useI18n } from '@/lib/i18n';
import { fadeUp, hoverLift, inViewGroup, reveal } from '@/lib/motion';

function useMinMd() {
  return useSyncExternalStore(
    (on) => {
      const mq = window.matchMedia('(min-width: 768px)');
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    },
    () => window.matchMedia('(min-width: 768px)').matches,
    () => false,
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 45%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 28, restDelta: 0.001 });
  return (
    <div ref={ref} className="relative mt-12 md:mt-16">
      <div aria-hidden className="timeline-track absolute bottom-3 left-[7px] top-3 w-px md:left-1/2 md:-translate-x-1/2" />
      <motion.div aria-hidden className="timeline-fill absolute bottom-3 left-[7px] top-3 w-px origin-top md:left-1/2 md:-translate-x-1/2" style={{ scaleY: reduce ? 1 : scaleY }} />
      <ol className="relative">{children}</ol>
    </div>
  );
}

function TimelineItem({ index, children }: { index: number; children: React.ReactNode }) {
  const md = useMinMd();
  const left = index % 2 === 0;
  const x = md ? (left ? -72 : 72) : -32;
  return (
    <li className="relative grid grid-cols-1 pb-8 md:grid-cols-2 md:pb-14">
      <span aria-hidden className="timeline-dot absolute left-[7px] top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full md:left-1/2" />
      <motion.article
        key={md ? `d${index}` : `m${index}`}
        className={`min-w-0 pl-8 ${left ? 'md:col-start-1 md:pl-0 md:pr-12 md:text-right md:[&_.tags]:justify-end' : 'md:col-start-2 md:pl-12'}`}
        initial={{ opacity: 0, x }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease: 'easeOut' }}
      >
        <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 md:p-6">{children}</div>
      </motion.article>
    </li>
  );
}

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

export function Path({ showHeading = true }: { showHeading?: boolean }) {
  const { t, lang } = useI18n();
  return (
    <section id="parcours" className={`wrap ${showHeading ? 'py-20 md:py-28' : 'pb-16 pt-2 md:pb-24'}`}>
      {showHeading && (
        <h2 className="font-display text-[16vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
          <MaskTitle className="metal">{t.pathTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.pathTitleB}</span></Italic></MaskTitle>
        </h2>
      )}
      <Timeline>
        {experiences.map((e, i) => (
          <TimelineItem key={e.company} index={i}>
            <p className="label text-white/50">{e.period[lang]}</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none md:text-3xl">{e.company}</h3>
            <p className="mt-2 font-serif text-xl italic text-cream">{e.role[lang]}</p>
            <ul className="tags mt-4 flex flex-wrap gap-2">
              {e.tags.map((tag) => <li key={tag} className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-base text-white/70">{tagLabel(tag, lang)}</li>)}
            </ul>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-mist">
              {e.description[lang].map((line) => <li key={line}>{line}</li>)}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}

export function Pricing() {
  const { t } = useI18n();
  return (
    <section id="tarifs" className="wrap py-20 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[16vw] font-black uppercase leading-[.85] tracking-tight md:text-[7vw]">
          <MaskTitle className="metal">{t.pricingTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.pricingTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.p {...reveal(0.15)} className="max-w-sm text-base leading-relaxed text-mist">{t.pricingNote}</motion.p>
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
              {p.quote && <p className="mt-3 text-base leading-relaxed text-mist">{t.onQuoteBody}</p>}
            <a href="#rendez-vous" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-current px-4 text-base font-medium tracking-wide md:w-fit">{t.bookCall} <MotionIcon icon={ArrowUpRight} size={14} effect="slide" /></a>
          </motion.li>
        ))}
      </motion.ul>
      <motion.div {...reveal(0.2)} className="mt-8">
        <a href="#contact" className="label inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-ink hover:bg-white">{t.askQuote} <MotionIcon icon={ArrowUpRight} size={14} effect="slide" /></a>
      </motion.div>
    </section>
  );
}

export function Awards() {
  const { t, lang } = useI18n();
  return (
    <section id="distinctions" className="wrap py-20 md:py-28">
      <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
        <MaskTitle className="metal">{t.awardsTitleA}</MaskTitle>
        <MaskTitle><Italic><span className="text-cream">{t.awardsTitleB}</span></Italic></MaskTitle>
      </h2>
      <p className="label mt-10 text-white/40">{t.awardsKicker}</p>
      <Timeline>
        {awards.map((a, i) => (
          <TimelineItem key={a.title.fr} index={i}>
            <div className={`flex items-start justify-between gap-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <h3 className="font-display text-xl font-black uppercase leading-tight md:text-2xl">{a.title[lang]}</h3>
              <span className="label shrink-0 text-cream">{a.year}</span>
            </div>
            <p className="mt-3 text-base text-white/70">{a.issuer}</p>
            <p className="mt-3 text-base leading-relaxed text-mist">{a.description[lang]}</p>
          </TimelineItem>
        ))}
      </Timeline>
      <p className="label mt-14 text-white/40">{t.educationKicker}</p>
      <Timeline>
        {education.map((ed, i) => (
          <TimelineItem key={ed.school} index={i}>
            <p className="label text-cream">{ed.year}</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase">{ed.degree[lang]}</h3>
            <p className="mt-2 text-base text-white/80">{ed.field[lang]}</p>
            <p className="mt-2 text-base text-mist">{ed.school}</p>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}

export function Community({ showHeading = true }: { showHeading?: boolean }) {
  const { t, lang } = useI18n();
  return (
    <section id="communaute" className={`wrap ${showHeading ? 'py-20 md:py-28' : 'pb-16 pt-2 md:pb-24'}`}>
      {showHeading && (
        <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
          <MaskTitle className="metal">{t.communityTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.communityTitleB}</span></Italic></MaskTitle>
        </h2>
      )}
      <Timeline>
        {communities.map((c, i) => (
          <TimelineItem key={c.name} index={i}>
            <p className="label text-cream">{c.role[lang]}</p>
            <h3 className="mt-3 font-display text-2xl font-black uppercase">{c.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-mist">{c.description[lang]}</p>
          </TimelineItem>
        ))}
      </Timeline>
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
                ? <a href={p.link} target="_blank" rel="noreferrer" className="group block p-6">{inner} <MotionIcon icon={ArrowUpRight} size={16} effect="slide" className="mt-4" /></a>
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
    <section id="galerie" className="wrap py-20 md:py-28">
      <p className="label text-cream">{t.nav.galerie}</p>
      <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none md:text-7xl">
        <MaskTitle className="metal">{t.galleryKicker}</MaskTitle>
      </h2>
      <GlassyGallery />
    </section>
  );
}
