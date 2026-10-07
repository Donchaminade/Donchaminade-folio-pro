import React, { useEffect, useState } from 'react';
import { fetchPortfolio } from '../../lib/api';
import { navigate } from '../../lib/navigation';
import { fixPublicXUrl } from '../../lib/portfolioView';
import { useTheme } from '../../lib/theme';
import { LanguageSwitch, useI18n } from '../../lib/i18n';

type Current = 'home' | 'blog';

const LINK_DEFS = [
  { href: '/#profil', id: 'profil', key: 'profile' },
  { href: '/#apropos', id: 'apropos', key: 'about' },
  { href: '/#stack', id: 'stack', key: 'stack' },
  { href: '/#projets', id: 'projets', key: 'projects' },
  { href: '/#parcours', id: 'parcours', key: 'path' },
  { href: '/#communaute', id: 'communaute', key: 'community' },
  { href: '/blog', id: 'blog', key: 'blog' },
] as const;

function go(href: string, event: React.MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  if (href.startsWith('/#')) {
    const id = href.slice(2);
    if (window.location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView();
      window.history.replaceState(null, '', href);
      return;
    }
    navigate('/');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60);
    return;
  }
  navigate(href);
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
  </svg>
);

export const SiteHeader: React.FC<{ current?: Current }> = ({ current = 'home' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const links = LINK_DEFS.map((link) => ({ ...link, label: t.links[link.key] }));

  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="/" onClick={(event) => go('/', event)}>
          <img src="/favicon.png" alt="" width="36" height="36" />
          <span>Chaminade<span className="muted">.dev</span></span>
        </a>
        <nav aria-label={t.navMain}>
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={link.id === 'blog' && current === 'blog' ? 'page' : undefined}
                  onClick={(event) => go(link.href, event)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="actions">
          <button
            className="icon-btn"
            type="button"
            aria-label={isDark ? t.themeLight : t.themeDark}
            onClick={toggleTheme}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <LanguageSwitch />
          <a className="btn btn-primary" href="/#contact" onClick={(event) => go('/#contact', event)}>
            {t.contactCta}
          </a>
          <button
            className="icon-btn menu"
            type="button"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`menu-panel${open ? ' open' : ''}`}>
        <LanguageSwitch id="lang-mobile" />
        {links.map((link) => (
          <a key={link.id} href={link.href} onClick={(event) => { setOpen(false); go(link.href, event); }}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};

export const SiteFooter: React.FC<{ year?: string; twitter?: string; name?: string }> = ({ year, twitter, name }) => {
  const { t } = useI18n();
  const [live, setLive] = useState<{ name?: string; year?: string; twitter?: string }>({});
  useEffect(() => {
    let cancelled = false;
    fetchPortfolio<{ profile?: { full_name?: string; footer_year?: string; twitter_url?: string } | null }>()
      .then((data) => {
        if (cancelled || !data?.profile) return;
        setLive({
          name: data.profile.full_name?.trim() || undefined,
          year: data.profile.footer_year?.trim() || undefined,
          twitter: data.profile.twitter_url?.trim() || undefined,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const shownName = live.name || name || 'Chaminade Adjolou';
  const shownYear = live.year || year || String(new Date().getFullYear());
  const shownTwitter = fixPublicXUrl(live.twitter || twitter);
  return (
    <footer className="site">
      <div className="wrap">
        <span>© {shownYear} {shownName} · Lomé, Togo · {t.rights}</span>
        <nav aria-label={t.navFooter}>
          <a className="btn btn-link" href="/" onClick={(event) => go('/', event)}>{t.links.profile}</a>
          <a className="btn btn-link" href="/blog" onClick={(event) => go('/blog', event)}>{t.links.blog}</a>
          <a className="btn btn-link" href="/#cv" onClick={(event) => go('/#cv', event)}>{t.links.cv}</a>
          <a className="btn btn-link" href={shownTwitter} target="_blank" rel="noopener noreferrer">X</a>
        </nav>
      </div>
    </footer>
  );
};

export const MobileNav: React.FC<{ current?: Current }> = ({ current = 'home' }) => {
  const { t } = useI18n();
  const items = [
    { href: '/#profil', label: t.links.profile, on: current === 'home' },
    { href: '/#projets', label: t.links.projects, on: false },
    { href: '/blog', label: t.links.blog, on: current === 'blog' },
    { href: '/#contact', label: t.links.contact, on: false },
  ];
  return (
    <nav className="mobile-nav" aria-label={t.navMobile}>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.href} aria-current={item.on ? 'page' : undefined} onClick={(event) => go(item.href, event)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const PageDecor: React.FC = () => <div className="bg-decor" aria-hidden="true" />;
