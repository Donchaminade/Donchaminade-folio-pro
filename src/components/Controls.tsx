'use client';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Controls() {
  const { lang, setLang, theme, setTheme, t } = useI18n();
  const light = theme === 'light';
  return (
    <div className="flex items-center gap-2">
      <div role="group" aria-label={t.langLabel} className="flex items-center rounded-full border border-white/25 p-0.5">
        {(['fr', 'en'] as const).map((code, i) => (
          <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code}
            className={`relative px-2 py-1 text-[10px] font-semibold uppercase tracking-[.18em] ${lang === code ? 'text-ink' : 'text-white/55'}`}>
            {i === 1 && <span className="pointer-events-none absolute -left-px top-1/2 h-3 w-px -translate-y-1/2 bg-white/25" aria-hidden />}
            {lang === code && (
              <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-cream"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
            )}
            <span className="relative">{code}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setTheme(light ? 'dark' : 'light')} aria-label={light ? t.themeLight : t.themeDark}
        className="relative h-8 w-14 shrink-0 rounded-full border border-white/25 bg-white/10">
        <motion.span className="absolute top-0.5 grid h-7 w-7 place-items-center rounded-full bg-cream text-ink shadow"
          animate={{ left: light ? '1.55rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 480, damping: 30 }}>
          {light ? <Sun size={14} /> : <Moon size={14} />}
        </motion.span>
      </button>
    </div>
  );
}
