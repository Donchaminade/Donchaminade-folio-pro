import React, { FormEvent, useMemo, useState } from 'react';
import Reveal from '../Reveal';
import CollaborateModal from '../CollaborateModal';
import { submitContact } from '../../lib/api';
import {
  BOOKING_URL,
  CV_EN,
  CV_EN_FILE,
  CV_EN_SIZE,
  CV_FR,
  CV_FR_FILE,
  CV_FR_SIZE,
  CV_UPDATED,
  HERO_LEAD,
  type PortfolioView,
  type ProjectView,
} from '../../lib/portfolioView';

const External = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

const STACK = [
  {
    title: 'Backend',
    chips: [
      { label: 'Java 17 · Spring Boot', icon: 'spring/spring-original.svg', fresh: true },
      { label: 'Node.js · Express', icon: 'nodejs/nodejs-original.svg' },
      { label: 'PHP 8 · Laravel', icon: 'php/php-original.svg' },
      { label: 'API REST · JWT' },
      { label: 'Socket.IO' },
    ],
  },
  {
    title: 'Frontend',
    chips: [
      { label: 'React 19', icon: 'react/react-original.svg' },
      { label: 'Next.js', icon: 'nextjs/nextjs-original.svg' },
      { label: 'TypeScript', icon: 'typescript/typescript-original.svg' },
      { label: 'Vite', icon: 'vitejs/vitejs-original.svg' },
      { label: 'Tailwind CSS', icon: 'tailwindcss/tailwindcss-original.svg' },
      { label: 'PWA' },
    ],
  },
  {
    title: 'Mobile',
    chips: [
      { label: 'Flutter · Dart', icon: 'flutter/flutter-original.svg' },
      { label: 'React Native · Expo', icon: 'react/react-original.svg', fresh: true },
      { label: 'sqflite · Hive' },
      { label: 'FCM', icon: 'firebase/firebase-original.svg' },
    ],
  },
  {
    title: 'Données',
    chips: [
      { label: 'PostgreSQL', icon: 'postgresql/postgresql-original.svg' },
      { label: 'MySQL', icon: 'mysql/mysql-original.svg' },
      { label: 'Supabase', icon: 'supabase/supabase-original.svg' },
      { label: 'SQLite', icon: 'sqlite/sqlite-original.svg' },
      { label: 'Flyway' },
    ],
  },
  {
    title: 'Livraison',
    chips: [
      { label: 'Git · GitHub Actions', icon: 'githubactions/githubactions-original.svg' },
      { label: 'Docker', icon: 'docker/docker-original.svg' },
      { label: 'Vercel', icon: 'vercel/vercel-original.svg' },
      { label: 'Render' },
      { label: 'JUnit' },
    ],
  },
  {
    title: 'Intégrations',
    chips: [
      { label: 'Mobile Money (Flooz, T-Money)' },
      { label: 'PayDunya' },
      { label: 'Web Push' },
      { label: 'Firebase Auth', icon: 'firebase/firebase-original.svg' },
      { label: 'API d’IA (Groq, Gemini)' },
    ],
  },
];

function iconUrl(path: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;
}

function matchesFilter(project: ProjectView, filter: string): boolean {
  if (filter === 'Tous') return true;
  const blob = `${project.type} ${project.tags.join(' ')} ${project.kicker} ${project.title}`.toLowerCase();
  if (filter === 'Web') return project.type === 'Web' || /web|react|next/.test(blob);
  if (filter === 'Mobile') return project.type === 'Mobile' || /flutter|expo|mobile/.test(blob);
  if (filter === 'Backend') return /spring|php|node|go|api|postgres|mysql/.test(blob);
  if (filter === 'Open source') return Boolean(project.github && project.github !== '#');
  return true;
}

const ProjectTile: React.FC<{ project: ProjectView }> = ({ project }) => (
  <article className="pcard card">
    <div className="pmedia">
      {project.image ? (
        <img src={project.image} alt="" loading="lazy" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className={`ph ${project.gradient}`} aria-hidden="true"><span>{project.initials}</span></div>
      )}
      {project.badge && <span className="badge">{project.badge}</span>}
    </div>
    <div className="pbody">
      <p className="kicker">{project.kicker}</p>
      <h3>{project.title}</h3>
      <p className="pdesc">{project.description}</p>
      <ul className="ptags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      <div className="plinks">
        {project.links.map((link) => (
          <a key={link.href + link.label} className="btn btn-secondary btn-sm" href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}<External />
          </a>
        ))}
      </div>
    </div>
  </article>
);

const HomeView: React.FC<{ data: PortfolioView; onShowAll: () => void }> = ({ data, onShowAll }) => {
  const [filter, setFilter] = useState('Tous');
  const [cvLang, setCvLang] = useState<'fr' | 'en'>('fr');
  const [collaborateOpen, setCollaborateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const visible = useMemo(
    () => (filter === 'Tous' ? data.featured : data.projects.filter((project) => matchesFilter(project, filter)).slice(0, 8)),
    [data.featured, data.projects, filter]
  );
  const cvHref = cvLang === 'fr' ? CV_FR : CV_EN;
  const proof = data.testimonials.length + data.recommendations.length;

  const send = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback('');
    setError('');
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 10) {
      setError('Indiquez un nom, un e-mail et un message d’au moins 10 caractères.');
      return;
    }
    setSending(true);
    try {
      setFeedback(await submitContact(form.name.trim(), form.email.trim(), form.message.trim()));
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible pour le moment.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <CollaborateModal open={collaborateOpen} onClose={() => setCollaborateOpen(false)} />
      <section className="hero" id="profil">
        <div className="blob" style={{ width: 420, height: 420, background: '#3E7BC2', top: -80, right: -60 }} />
        <div className="blob" style={{ width: 300, height: 300, background: '#2BA3A0', bottom: -60, left: -80 }} />
        <div className="wrap hero-grid">
          <div>
            <p className="status"><span className="pulse" aria-hidden="true" />{data.availability}</p>
            <h1>{data.name}</h1>
            <p className="role">Développeur Full-Stack <em>Web & Mobile</em></p>
            <p className="lead">{HERO_LEAD}</p>
            <ul className="badges">{data.badges.map((badge) => <li key={badge}>{badge}</li>)}</ul>
            <div className="ctas">
              <a className="btn btn-primary btn-lg" href="#projets">Voir mes projets</a>
              <a className="btn btn-secondary btn-lg" href={cvHref} download={cvLang === 'fr' ? CV_FR_FILE : CV_EN_FILE}>
                Télécharger le CV
              </a>
              <span className="cv-switch" role="group" aria-label="Langue du CV">
                <button type="button" className={cvLang === 'fr' ? 'on' : ''} onClick={() => setCvLang('fr')}>FR</button>
                <button type="button" className={cvLang === 'en' ? 'on' : ''} onClick={() => setCvLang('en')}>EN</button>
              </span>
              <a className="btn btn-link" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Réserver un appel de 30 min</a>
            </div>
            <ul className="socials" aria-label="Réseaux">
              <li>
                <a className="icon-btn" href={data.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.7.11 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>
                </a>
              </li>
              <li>
                <a className="icon-btn" href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 9H4V20h2.5V9ZM5.25 3.5A1.75 1.75 0 1 0 5.26 7a1.75 1.75 0 0 0 0-3.5ZM20 20h-2.5v-5.6c0-1.55-.55-2.6-1.93-2.6-1.05 0-1.68.71-1.96 1.4-.1.24-.12.58-.12.92V20H11V9h2.4v1.51c.36-.55 1.01-1.34 2.46-1.34 1.8 0 3.14 1.17 3.14 3.7V20Z" /></svg>
                </a>
              </li>
              <li>
                <a className="icon-btn" href={data.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="X">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.7 10.4 21.4 3h-1.6l-5.8 6.4L9.2 3H3.4l7 9.9L3.4 21h1.6l6.2-6.8 4.9 6.8h5.8l-7.2-10.6Zm-2.2 2.4-.7-1-5.7-7.8h2.4l4.6 6.3.7 1 6 8.2h-2.4l-4.9-6.7Z" /></svg>
                </a>
              </li>
            </ul>
          </div>
          <figure className="hero-photo">
            <div className="frame">
              <img src={data.photo} alt="Chaminade Adjolou au travail sur son ordinateur" width="699" height="559" />
            </div>
            <figcaption className="card">
              <strong>1 app sur Google Play</strong>
              <span className="muted">Picon · com.photopicon.app</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="facts" aria-label="Repères">
        <div className="wrap">
          <ul>
            <li><strong>{data.profile.experience_badge?.includes('4') ? '4+' : '4+'} ans</strong><span>d’expérience web et mobile</span></li>
            <li><strong>{data.projectCount}</strong><span>projets au catalogue</span></li>
            <li><strong>{data.prizeCount} prix</strong><span>hackathons et concours 2025</span></li>
            <li><strong>{data.roles.length}</strong><span>postes et stages depuis 2024</span></li>
          </ul>
        </div>
      </section>

      <section className="section" id="stack">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Stack</p>
              <h2>Ce que j’utilise en production</h2>
              <p>Regroupé par domaine. Chaque techno renvoie à au moins un projet livré.</p>
            </div>
          </div>
          <div className="stack-grid">
            {STACK.map((group) => (
              <Reveal key={group.title}>
                <article className="stack-group card">
                  <h3>{group.title}</h3>
                  <ul className="chips">
                    {group.chips.map((chip) => (
                      <li key={chip.label} className={chip.fresh ? 'chip new' : 'chip'} title={chip.fresh ? 'Ajout récent au portfolio' : undefined}>
                        {chip.icon ? (
                          <span className="ico"><img src={iconUrl(chip.icon)} alt="" width="14" height="14" loading="lazy" /></span>
                        ) : (
                          <span className="dot" aria-hidden="true" />
                        )}
                        {chip.label}
                        {chip.fresh && <span className="sr-only">, nouveau</span>}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projets">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Projets</p>
              <h2>Réalisations récentes</h2>
              <p>Les chiffres viennent du code des dépôts (audit GitHub du 7 octobre 2026).</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={onShowAll}>Voir les {data.projectCount} projets</button>
          </div>
          <div className="filters" role="tablist" aria-label="Filtrer les projets">
            {['Tous', 'Web', 'Mobile', 'Backend', 'Open source'].map((item) => (
              <button key={item} type="button" className={filter === item ? 'chip on' : 'chip'} role="tab" aria-selected={filter === item} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="pgrid">
            {visible.map((project) => (
              <Reveal key={project.title}><ProjectTile project={project} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="parcours">
        <div className="wrap two-col">
          <div>
            <div className="section-head"><div><p className="kicker">Parcours</p><h2>Expérience</h2></div></div>
            <ol className="timeline">
              {data.roles.map((role) => (
                <li key={role.company}>
                  <div className="when">{role.period}</div>
                  <div className="what">
                    <h3>{role.role}</h3>
                    <p className="org">{role.company} <span>· {role.meta}</span></p>
                    <p className="muted">{role.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside id="cv" className="cv card" aria-labelledby="cv-title">
            <p className="kicker">CV</p>
            <h2 id="cv-title">Mon CV, en français ou en anglais</h2>
            <p className="muted">Développeur Full-Stack Web & Mobile · 2 pages · PDF texte · mis à jour en {CV_UPDATED}.</p>
            <div className="cv-rows">
              <div className="cv-row">
                <span className="lang">FR</span>
                <div><strong>CV Full-Stack</strong><span className="muted">PDF · {CV_FR_SIZE}</span></div>
                <a className="btn btn-primary" href={CV_FR} download={CV_FR_FILE} hreflang="fr">Télécharger</a>
              </div>
              <div className="cv-row">
                <span className="lang">EN</span>
                <div><strong>Full-Stack résumé</strong><span className="muted">PDF · {CV_EN_SIZE}</span></div>
                <a className="btn btn-secondary" href={CV_EN} download={CV_EN_FILE} hreflang="en">Download</a>
              </div>
            </div>
            <a className="btn btn-link" href={CV_FR} target="_blank" rel="noopener noreferrer">Ouvrir l’aperçu dans un nouvel onglet</a>
          </aside>
        </div>
      </section>

      {data.communities.length > 0 && (
        <section className="section" id="communaute">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="kicker">Communautés</p>
                <h2>Là où je m’implique</h2>
              </div>
            </div>
            <div className="comm-grid">
              {data.communities.map((community) => {
                const href = community.websiteUrl || community.linkedinUrl || undefined;
                const inner = (
                  <>
                    <strong>{community.name}</strong>
                    <span>{community.role}</span>
                  </>
                );
                return href ? (
                  <a key={community.name} className="comm-card card" href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <article key={community.name} className="comm-card card">{inner}</article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {proof > 0 && (
        <section className="section" id="temoignages">
          <div className="wrap">
            <div className="section-head"><div><p className="kicker">Retours</p><h2>Ce que disent les collaborations</h2></div></div>
            <div className="quote-list">
              {data.testimonials.map((item) => (
                <blockquote key={item.name} className="card">
                  <p>{item.quote}</p>
                  <p className="muted">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
                </blockquote>
              ))}
              {data.recommendations.map((item) => (
                <blockquote key={`${item.name}-${item.createdAt || item.body.slice(0, 12)}`} className="card">
                  <p>{item.body}</p>
                  <p className="muted">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section contact" id="contact">
        <div className="wrap">
          <div className="contact-card card">
            <div>
              <p className="kicker">Contact</p>
              <h2>Un projet, un poste, une mission ?</h2>
              <p className="muted">Écrivez-moi ou réservez directement un créneau de 30 minutes.</p>
            </div>
            <div className="ctas">
              <a className="btn btn-primary btn-lg" href={`mailto:${data.email}`}>Écrire un e-mail</a>
              <a className="btn btn-secondary btn-lg" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Réserver un appel</a>
              <button type="button" className="btn btn-link" onClick={() => setCollaborateOpen(true)}>Proposer une collaboration</button>
            </div>
            <form onSubmit={send} style={{ width: '100%' }}>
              <div className="form-grid">
                <label className="field">Nom
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" required />
                </label>
                <label className="field">E-mail
                  <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required />
                </label>
                <label className="field" style={{ gridColumn: '1 / -1' }}>Message
                  <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required minLength={10} />
                </label>
              </div>
              <div className="ctas" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Envoi…' : 'Envoyer le message'}</button>
              </div>
              {feedback && <p className="form-note ok" role="status">{feedback}</p>}
              {error && <p className="form-note err" role="alert">{error}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeView;
