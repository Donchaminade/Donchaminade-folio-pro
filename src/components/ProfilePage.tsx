'use client';
import { motion } from 'framer-motion';
import { profile } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import { fadeUp, inViewGroup } from '@/lib/motion';
import { Hero } from './Sections';

export default function ProfilePage() {
  const { t, lang } = useI18n();
  return (
    <article>
      <Hero ready />
      <section className="wrap py-20 md:py-28">
        <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">{profile.bio[lang]}</p>
        <p className="label mt-6 text-cream">{profile.availability[lang]}</p>
        <motion.ul {...inViewGroup(0.08)} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {t.stats.map((s) => (
            <motion.li key={s.label} variants={fadeUp} className="rounded-3xl border border-white/10 px-4 py-6">
              <p className="font-display text-4xl font-black">{s.value}<span className="text-cream">{s.suffix}</span></p>
              <p className="label mt-2 text-white/50">{s.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </article>
  );
}
