import React, { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { navigate } from '../../lib/navigation';

type Current = 'home' | 'blog';

const LINKS = [
  { href: '/#profil', id: 'profil', label: 'Profil' },
  { href: '/#stack', id: 'stack', label: 'Stack' },
  { href: '/#projets', id: 'projets', label: 'Projets' },
  { href: '/#parcours', id: 'parcours', label: 'Parcours' },
  { href: '/blog', id: 'blog', label: 'Blog' },
];

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
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="/" onClick={(event) => go('/', event)}>
          <img src="/favicon.png" alt="" width="36" height="36" />
          <span>Chaminade<span className="muted">.dev</span></span>
        </a>
        <nav aria-label="Principale">
          <ul>
            {LINKS.map((link) => (
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
            aria-label={isDark ? 'Passer en thème clair' : 'Passer en thème sombre'}
            onClick={toggleTheme}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a className="btn btn-primary" href="/#contact" onClick={(event) => go('/#contact', event)}>
            Me contacter
          </a>
          <button
            className="icon-btn menu"
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
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
        {LINKS.map((link) => (
          <a key={link.id} href={link.href} onClick={(event) => { setOpen(false); go(link.href, event); }}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};

export const SiteFooter: React.FC<{ year: string; twitter?: string }> = ({ year, twitter = 'https://x.com/Donchaminade' }) => (
  <footer className="site">
    <div className="wrap">
      <span>© {year} Chaminade Adjolou · Lomé, Togo</span>
      <nav aria-label="Pied de page">
        <a className="btn btn-link" href="/" onClick={(event) => go('/', event)}>Portfolio</a>
        <a className="btn btn-link" href="/blog" onClick={(event) => go('/blog', event)}>Blog</a>
        <a className="btn btn-link" href="/#cv" onClick={(event) => go('/#cv', event)}>CV</a>
        <a className="btn btn-link" href={twitter} target="_blank" rel="noopener noreferrer">X</a>
      </nav>
    </div>
  </footer>
);

export const MobileNav: React.FC<{ current?: Current }> = ({ current = 'home' }) => {
  const items = [
    { href: '/#profil', label: 'Profil', on: current === 'home' },
    { href: '/#projets', label: 'Projets', on: false },
    { href: '/blog', label: 'Blog', on: current === 'blog' },
    { href: '/#contact', label: 'Contact', on: false },
  ];
  return (
    <nav className="mobile-nav" aria-label="Navigation mobile">
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
