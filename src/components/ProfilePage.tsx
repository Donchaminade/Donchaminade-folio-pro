'use client';
import { motion } from 'framer-motion';
import { profile, roles } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import { fadeUp, inViewGroup } from '@/lib/motion';
import PageHero from './PageHero';

export default function ProfilePage() {
  const { t, lang } = useI18n();
  const [family, ...given] = profile.fullName.split(' ');
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={family} italic={given.join(' ')} lead={profile.heroTitle[lang]} />
      <div className="wrap grid items-end gap-10 pb-24 md:grid-cols-[.9fr_1.1fr]">
        <motion.img {...fadeUp} src={profile.photo} alt={`${t.portraitOf} ${profile.fullName}`} className="mx-auto max-h-[70svh] w-full object-contain object-bottom" />
        <div>
          <p className="font-serif text-2xl italic text-cream md:text-4xl">{profile.heroSubtitle[lang]}</p>
          <p className="mt-6 text-base leading-relaxed text-mist md:text-lg">{profile.bio[lang]}</p>
          <p className="label mt-6 text-cream">{profile.availability[lang]}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {roles.map((role) => <li key={role} className="rounded-full border border-white/15 px-4 py-2 text-base">{role}</li>)}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/#contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-cream px-6 text-base font-medium text-ink">{t.contactCta}</a>
            <a href="/#rendez-vous" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-base">{t.bookCall}</a>
          </div>
        </div>
      </div>
      <motion.ul {...inViewGroup(0.08)} className="wrap grid grid-cols-2 gap-3 pb-24 md:grid-cols-4">
        {t.stats.map((s) => (
          <motion.li key={s.label} variants={fadeUp} className="rounded-3xl border border-white/10 px-4 py-6">
            <p className="font-display text-4xl font-black">{s.value}<span className="text-cream">{s.suffix}</span></p>
            <p className="label mt-2 text-white/50">{s.label}</p>
          </motion.li>
        ))}
      </motion.ul>
    </article>
  );
}
