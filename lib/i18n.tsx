import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { copy, type Copy, type Lang } from './copy';

const STORAGE_KEY = 'donchaminade-lang';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
}

const I18nContext = createContext<I18nValue | null>(null);

function readLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'fr';
  } catch {
    return 'fr';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: copy[lang],
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    return { lang: 'fr', setLang: () => {}, t: copy.fr };
  }
  return value;
}

export function shownApiMessage(lang: Lang, message: string, english: string): string {
  if (lang === 'fr') return message;
  if (!message.trim()) return english;
  if (/[àâäéèêëïîôùûüç]|(\b(le|la|les|votre|envoyé|erreur|impossible|merci|article)\b)/i.test(message)) {
    return english;
  }
  return message;
}

const FrenchFlag = () => (
  <svg className="flag" viewBox="0 0 60 36" aria-hidden="true">
    <rect width="20" height="36" fill="#0055A4" />
    <rect x="20" width="20" height="36" fill="#fff" />
    <rect x="40" width="20" height="36" fill="#EF4135" />
  </svg>
);

const EnglandFlag = () => (
  <svg className="flag" viewBox="0 0 60 36" aria-hidden="true">
    <rect width="60" height="36" fill="#fff" />
    <rect x="25" width="10" height="36" fill="#CF142B" />
    <rect y="13" width="60" height="10" fill="#CF142B" />
  </svg>
);

export const LanguageSwitch: React.FC<{ id?: string }> = ({ id }) => {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t.langGroup} id={id}>
      <button type="button" className={lang === 'fr' ? 'on' : ''} aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>
        <FrenchFlag />
        <span>FR</span>
      </button>
      <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        <EnglandFlag />
        <span>ENG</span>
      </button>
    </div>
  );
};
