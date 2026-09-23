
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, Linkedin, Twitter, Download, ShieldCheck, ArrowUpRight, CalendarCheck2 } from 'lucide-react';
import GlitchText from './GlitchText';
import { fetchPortfolio } from '../lib/api';
import { mediaUrl } from '../lib/media';
import type { SiteProfile } from '../types';

const DEFAULT_PHOTO = '/pypicture.png';
const DEFAULT_CV = '/CV_ADJOLOU_DONDAH_CHAMINADE.pdf';

const DEFAULT_SOCIALS = {
  linkedin: 'https://linkedin.com/in/chaminadeadjolou',
  twitter: 'https://x.com/Donchaminde',
  github: 'https://github.com/Donchaminade',
  whatsapp: '+22899181626',
};

function splitFullName(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return [fullName.toUpperCase(), ''];
  return [parts[0].toUpperCase(), parts.slice(1).join(' ')];
}

type HeroProps = {
  bookingUrl: string;
};

const Hero: React.FC<HeroProps> = ({ bookingUrl }) => {
  const [profile, setProfile] = useState<SiteProfile | null>(null);

  useEffect(() => {
    fetchPortfolio<{ profile: SiteProfile | null }>()
      .then((data) => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const heroImageY = useTransform(smoothScrollY, [0, 500], [0, 80]);
  const heroTextY = useTransform(smoothScrollY, [0, 500], [0, -40]);
  const heroBgY = useTransform(smoothScrollY, [0, 1000], ['0%', '20%']);

  const fullName = profile?.full_name?.trim() || 'ADJOLOU Dondah Chaminade';
  const [firstName, lastName] = splitFullName(fullName);
  const heroTitle = profile?.hero_title?.trim() || 'Développeur Web & Mobile.';
  const bio =
    profile?.bio?.trim() ||
    "Ingénieur IT passionné, je conçois et déploie des solutions digitales sur mesure. Avec plus de 3 ans d'expertise en ingénierie logicielle et support IT, j'accompagne les entreprises dans leur transformation technologique avec des applications robustes, esthétiques et évolutives.";
  const availability = profile?.availability_text?.trim() || 'Disponible pour de nouveaux défis';
  const expBadge = profile?.experience_badge?.trim() || '3+ ans';
  const expLabel = profile?.experience_badge_label?.trim() || 'Expérience Solide';

  const photoSrc = mediaUrl(profile?.photo_path) || DEFAULT_PHOTO;
  const cvHref = mediaUrl(profile?.cv_path) || DEFAULT_CV;

  const socials = {
    linkedin: profile?.linkedin_url?.trim() || DEFAULT_SOCIALS.linkedin,
    twitter: profile?.twitter_url?.trim() || DEFAULT_SOCIALS.twitter,
    github: profile?.github_url?.trim() || DEFAULT_SOCIALS.github,
    whatsapp: profile?.whatsapp?.trim() || DEFAULT_SOCIALS.whatsapp,
  };

  return (
    <section id="hero" className="relative pt-20 md:pt-48 lg:pt-64 pb-32 md:pb-56 lg:pb-48 px-4 sm:px-6 max-w-7xl mx-auto overflow-x-hidden min-w-0">
      <motion.div
        style={{ y: heroBgY }}
        className="absolute inset-0 -z-30 opacity-[0.05] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 -z-20 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H90 V30 H70 V90' fill='none' stroke='%233b82f6' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%233b82f6'/%3E%3Ccircle cx='70' cy='90' r='2' fill='%233b82f6'/%3E%3C/svg%3E")`,
          backgroundSize: '250px 250px',
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center min-w-0">
        <motion.div
          style={{ y: heroTextY }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="min-w-0"
        >
          <div className="inline-flex max-w-full items-center gap-3 px-4 py-2 glass rounded-full mb-6 md:mb-8">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-soft)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] truncate">
              {availability}
            </span>
          </div>

          <div className="mb-5 md:mb-7 min-w-0">
            <h2 className="font-display text-[clamp(1.75rem,5vw+0.5rem,4.25rem)] font-semibold tracking-tight text-[var(--ink)] leading-[1.05] mb-2 md:mb-3 break-words">
              <GlitchText text={firstName || fullName.toUpperCase()} />
            </h2>
            {lastName ? (
              <h2 className="font-display text-[clamp(1.05rem,2.4vw+0.4rem,2.25rem)] font-medium tracking-tight text-[var(--accent)] leading-tight break-words">
                <GlitchText text={lastName} />
              </h2>
            ) : null}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] font-semibold mb-6 md:mb-9 leading-[1.15] tracking-tight text-[var(--accent)] break-words">
            {heroTitle}
          </h1>

          <p className="text-[0.95rem] sm:text-base md:text-lg text-[var(--ink-muted)] mb-8 md:mb-10 lg:mb-12 max-w-xl font-normal leading-relaxed whitespace-pre-line">
            {bio}
          </p>

          <div className="flex flex-col lg:flex-row flex-wrap gap-3 md:gap-4 items-stretch lg:items-center">
            <a
              href="#projets"
              className="group btn-accent w-full lg:w-auto justify-center min-h-12 px-6 md:px-10 py-3.5 md:py-4 text-white font-bold text-[11px] md:text-xs uppercase tracking-[0.14em] rounded-2xl flex items-center gap-3 touch-manipulation"
            >
              Mes réalisations{' '}
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href={cvHref}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto justify-center min-h-12 px-6 md:px-8 py-3.5 md:py-4 glass text-[var(--ink)] font-bold text-[11px] md:text-xs uppercase tracking-[0.14em] rounded-2xl flex items-center gap-3 hover:bg-[var(--bg-elevated)] transition-all active:scale-[0.98] touch-manipulation"
            >
              <Download size={18} className="text-[var(--accent)]" /> Télécharger CV
            </a>

            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full lg:w-auto justify-center min-h-12 px-6 md:px-8 py-3.5 md:py-4 text-white font-bold text-[11px] md:text-xs uppercase tracking-[0.14em] rounded-2xl flex items-center gap-3 touch-manipulation"
            >
              <CalendarCheck2 size={18} /> Réserver un créneau
            </a>
          </div>

          <div className="mt-10 md:mt-14 flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Me suivre</span>
            <div className="flex gap-4">
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-slate-200 dark:border-white/5"
              >
                <Github size={20} />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-slate-200 dark:border-white/5"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-slate-200 dark:border-white/5"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroImageY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative flex flex-col items-center lg:items-end min-w-0 w-full overflow-hidden"
        >
          <div className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-xl aspect-square rounded-[2rem] md:rounded-[2.75rem] overflow-hidden glass p-2.5 md:p-3 group">
            <img
              src={photoSrc}
              alt="Portrait professionnel"
              className="w-full h-full object-cover rounded-[1.65rem] md:rounded-[2.35rem] transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
            className="mt-[-24px] md:mt-[-48px] z-20 max-w-[calc(100%-1rem)] glass-dark p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-[var(--shadow-soft-lg)] flex items-center gap-4 md:gap-6 border-l-[3px] border-l-[var(--accent)]"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[rgba(61,110,168,0.12)] flex items-center justify-center text-[var(--accent)] border border-[rgba(61,110,168,0.2)]">
              <ShieldCheck className="w-8 h-8 md:w-9 md:h-9" />
            </div>
            <div>
              <div className="font-display text-2xl md:text-4xl font-semibold text-[var(--ink)] leading-none">{expBadge}</div>
              <div className="text-[10px] md:text-[11px] uppercase font-semibold text-[var(--accent)] tracking-[0.16em] mt-2 break-words">
                {expLabel}
              </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[28rem] aspect-square bg-[rgba(61,110,168,0.08)] rounded-full -z-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
