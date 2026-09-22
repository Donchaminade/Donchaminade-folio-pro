
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Package,
  Layers,
  Briefcase,
  User,
  Moon,
  Sun,
  BookOpen,
  Users,
  CalendarCheck2
} from 'lucide-react';
import { navigate } from './lib/navigation';
import { fetchPortfolio } from './lib/api';
import { mergeProjects } from './lib/mergeProjects';
import { applyPortfolioSeo } from './lib/seo';
import { PROJECTS } from './constants';
import { Project, SiteProfile } from './types';
import BrandMark from './components/BrandMark';

import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Community from './components/Community';
import Contact from './components/Contact';
import Trust from './components/Trust';
import LinkedInMarquee from './components/LinkedInMarquee';
import AllProjects from './components/AllProjects';
import ProjectModal from './components/ProjectModal';


const SOCIALS = {
  linkedin: 'https://linkedin.com/in/chaminadeadjolou',
  twitter: 'https://x.com/Donchaminde',
  github: 'https://github.com/Donchaminade',
};
const BOOKING_URL = 'https://doodle.com/bp/chaminadedondahadjolou/donchaminade';

const NAV_ITEMS = [
  { name: 'Profil', id: 'apropos', icon: <User size={20} /> },
  { name: 'Parcours', id: 'experience', icon: <Briefcase size={20} /> },
  { name: 'Projets', id: 'projets', icon: <Package size={20} /> },
  { name: 'Blog', id: 'blog', icon: <BookOpen size={20} />, href: '/blog' },
  { name: 'Réf.', id: 'testimonials', icon: <Layers size={20} /> },
  { name: 'Comm.', id: 'communaute', icon: <Users size={20} /> },
];

const NavItem: React.FC<{ item: typeof NAV_ITEMS[0] }> = ({ item }) => {
  const isBlog = 'href' in item && item.href;
  const className = "relative py-1 group overflow-hidden transition-colors hover:text-[var(--accent)]";
  const inner = (
    <>
      <span className="font-semibold tracking-[0.12em] text-[11px] uppercase">{item.name}</span>
      <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </>
  );
  if (isBlog) {
    return (
      <a href={item.href} onClick={(e) => { e.preventDefault(); navigate(item.href!); }} className={className}>
        {inner}
      </a>
    );
  }
  return <a href={`#${item.id}`} className={className}>{inner}</a>;
};

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    fetchPortfolio<{ projects: Project[]; profile: SiteProfile | null }>()
      .then((data) => {
        setProjects(mergeProjects(data.projects, PROJECTS));
        if (data.profile) applyPortfolioSeo(data.profile);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (showAllProjects) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showAllProjects]);

  const homeProjects = projects.slice(0, 5);

  if (showAllProjects) {
    return <AllProjects setShowAllProjects={setShowAllProjects} projects={projects} />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative selection:bg-[rgba(61,110,168,0.25)] selection:text-[var(--ink)]">
      {/* Mobile Top Controls */}
      <div className="fixed top-4 right-4 z-[70] lg:hidden">
        <button type="button" onClick={toggleTheme} aria-label="Changer le thème" className="p-3 min-h-11 min-w-11 glass rounded-full text-[var(--ink-muted)]">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <header className="fixed top-4 xl:top-6 left-1/2 -translate-x-1/2 z-50 w-[min(96%,72rem)] hidden lg:block">
        <nav className="glass-dark px-4 xl:px-7 py-3 xl:py-3.5 rounded-full flex items-center justify-between gap-3 xl:gap-6 min-w-0">
          <BrandMark className="shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <div className="flex items-center gap-4 xl:gap-7 text-[var(--ink-muted)] min-w-0 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => <NavItem key={item.id} item={item} />)}
          </div>
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            <button type="button" onClick={toggleTheme} className="p-2 min-h-11 min-w-11 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Changer le thème">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="#contact" className="px-4 xl:px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">Contact</a>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-collaborate-modal'));
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-accent px-4 xl:px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em]"
            >
              Collaborons
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] w-[min(96%,28rem)] lg:hidden glass-dark rounded-[1.5rem] px-1.5 sm:px-3 py-2 flex justify-between items-stretch">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={'href' in item && item.href ? item.href : `#${item.id}`}
            onClick={'href' in item && item.href ? (e) => { e.preventDefault(); navigate(item.href!); } : undefined}
            className="min-w-0 flex-1 text-[var(--ink-muted)] hover:text-[var(--accent)] active:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-0.5 py-1.5 min-h-11 touch-manipulation"
          >
            <div className="p-0.5">
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-wide opacity-80 truncate max-w-full px-0.5">{item.name}</span>
          </a>
        ))}
      </nav>

      <main className="pb-28 lg:pb-0">
        <Hero bookingUrl={BOOKING_URL} />
        <Stats />
        <About />
        <Projects homeProjects={homeProjects} setSelectedProject={setSelectedProject} setShowAllProjects={setShowAllProjects} />
        <Experience />
        <Community />
        <LinkedInMarquee />
        <Testimonials />
        <Trust />
        <Contact />
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed right-5 bottom-8 z-[55] px-4 py-4 min-h-11 rounded-2xl bg-[var(--ink)] hover:bg-[var(--ink-muted)] text-white shadow-[var(--shadow-soft-lg)] border border-[var(--border)] transition-all active:scale-95 items-center gap-3"
      >
        <CalendarCheck2 size={18} />
        <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.14em]">Réserver un créneau</span>
      </a>

      <footer className="py-16 md:py-24 pb-32 lg:pb-24 text-center border-t border-[var(--border)] px-4 sm:px-6">
        <div className="flex justify-center mb-6 md:mb-8">
          <BrandMark />
        </div>
        <div className="flex justify-center gap-8 md:gap-10 mb-10 md:mb-12 text-[var(--ink-muted)]">
          <a href={SOCIALS.github} target="_blank" className="hover:text-[var(--accent)] transition-all"><Github size={26} /></a>
          <a href={SOCIALS.linkedin} target="_blank" className="hover:text-[var(--accent)] transition-all"><Linkedin size={26} /></a>
          <a href={SOCIALS.twitter} target="_blank" className="hover:text-[var(--accent)] transition-all"><Twitter size={26} /></a>
        </div>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-7 md:px-8 py-3.5 md:py-4 rounded-2xl bg-[var(--ink)] hover:bg-[var(--ink-muted)] text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.14em] transition-all active:scale-95 mb-10 md:mb-12"
        >
          <CalendarCheck2 size={18} />
          Réserver un créneau
        </a>
        <div className="text-[10px] uppercase font-semibold tracking-[0.18em] text-[var(--ink-muted)] opacity-70 break-words">© 2024 Donchaminade. Tous droits réservés.</div>
      </footer>
    </div>
  );
};

export default App;
