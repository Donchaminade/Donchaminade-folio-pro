'use client';

import { MotionConfig } from 'framer-motion';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dictionary, type Lang, type Copy } from './dictionary';

type Theme = 'dark' | 'light';

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: Copy;
};

const I18nContext = createContext<Ctx | null>(null);

function readLang(): Lang {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'fr';
  } catch {
    return 'fr';
  }
}

function readTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const nextLang = readLang();
    const nextTheme = readTheme();
    setLangState(nextLang);
    setThemeState(nextTheme);
    document.documentElement.lang = nextLang;
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    try { localStorage.setItem('lang', next); } catch { /* stockage indisponible */ }
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* stockage indisponible */ }
  };

  const value = useMemo(() => ({ lang, setLang, theme, setTheme, t: dictionary[lang] }), [lang, theme]);

  return (
    <MotionConfig reducedMotion="user">
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </MotionConfig>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n');
  return ctx;
}
