'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import SunMoon from './SunMoon';

export default function Controls() {
  const { lang, setLang, theme, setTheme, t } = useI18n();
  const light = theme === 'light';
  const reduce = !!useReducedMotion();
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <div role="group" aria-label={t.langLabel} className="flex items-center rounded-full border border-white/25 p-0.5">
        {(['fr', 'en'] as const).map((code, i) => (
          <motion.button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code}
            whileHover={reduce ? undefined : { y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            className={`relative grid h-10 min-w-10 place-items-center px-2 text-[10px] font-semibold uppercase tracking-[.12em] sm:h-11 sm:min-w-11 sm:px-2.5 sm:text-[11px] sm:tracking-[.14em] ${lang === code ? 'text-ink accent-label' : 'text-white/70'}`}>
            {i === 1 && <span className="pointer-events-none absolute -left-px top-1/2 h-3 w-px -translate-y-1/2 bg-white/25" aria-hidden />}
            {lang === code && (
              <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-cream"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
            )}
            <span className="relative">{code === 'fr' ? 'FR' : 'ENG'}</span>
          </motion.button>
        ))}
      </div>
      <button type="button" onClick={() => setTheme(light ? 'dark' : 'light')} aria-label={light ? t.themeLight : t.themeDark}
        className="relative h-10 w-[3.75rem] shrink-0 overflow-hidden rounded-full border border-white/25 bg-white/10 sm:h-11 sm:w-16">
        <span className="absolute left-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-cream text-ink shadow transition-[left] duration-300 ease-out [[data-theme=light]_&]:left-[calc(100%-0.25rem-2rem)] sm:top-1.5">
          <SunMoon light={light} />
        </span>
      </button>
    </div>
  );
}
