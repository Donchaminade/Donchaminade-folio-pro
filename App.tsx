
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
  Users
} from 'lucide-react';
import { navigate } from './lib/navigation';
import { fetchPortfolio } from './lib/api';
import { mergeProjects } from './lib/mergeProjects';
import { PROJECTS } from './constants';
import { Project } from './types';
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
  const className = "relative py-1 group overflow-hidden transition-colors hover:text-blue-600 dark:hover:text-blue-400";
  const inner = (
    <>
      <span className="font-bold tracking-widest text-[11px] uppercase">{item.name}</span>
      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
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
    fetchPortfolio<{ projects: Project[] }>()
      .then((data) => {
        setProjects(mergeProjects(data.projects, PROJECTS));
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
    <div className="min-h-screen w-full overflow-x-hidden relative selection:bg-blue-500 selection:text-white dark:selection:text-white">
      {/* Mobile Top Controls */}
      <div className="fixed top-4 right-4 z-[70] lg:hidden">
        <button onClick={toggleTheme} className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl hidden lg:block">
        <nav className="glass-dark px-8 py-4 rounded-full flex items-center justify-between gap-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/10 dark:shadow-2xl">
          <BrandMark onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <div className="flex items-center gap-8 text-slate-600 dark:text-slate-400 shrink-0">
            {NAV_ITEMS.map((item) => <NavItem key={item.id} item={item} />)}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="#contact" className="px-6 py-3 bg-slate-800/80 dark:bg-white/10 hover:bg-slate-700 rounded-full text-[11px] font-black uppercase text-white transition-all border border-white/10">Contact</a>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-collaborate-modal'));
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-full text-[11px] font-black uppercase text-white transition-all shadow-lg shadow-violet-600/25"
            >
              Collaborons
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md lg:hidden bg-gradient-to-b from-white/90 to-slate-50/90 dark:from-slate-900/60 dark:to-slate-950/90 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 px-6 md:px-8 py-4 md:py-5 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={'href' in item && item.href ? item.href : `#${item.id}`}
            onClick={'href' in item && item.href ? (e) => { e.preventDefault(); navigate(item.href!); } : undefined}
            className="text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 active:text-blue-500 dark:active:text-blue-400 transition-all flex flex-col items-center gap-1 md:gap-2"
          >
            <div className="p-1 hover:scale-110 transition-transform">
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-80">{item.name}</span>
          </a>
        ))}
      </nav>

      <main className="pb-16 lg:pb-0">
        <Hero />
        <Stats />
        <About />
        <Projects homeProjects={homeProjects} setSelectedProject={setSelectedProject} setShowAllProjects={setShowAllProjects} />
        <Experience />
        <LinkedInMarquee />
        <Testimonials />
        <Community />
        <Trust />
        <Contact />
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <footer className="py-16 md:py-24 text-center border-t border-slate-200 dark:border-white/5 px-6 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex justify-center mb-6 md:mb-8">
          <BrandMark />
        </div>
        <div className="flex justify-center gap-8 md:gap-10 mb-10 md:mb-12 text-slate-400 dark:text-slate-500">
          <a href={SOCIALS.github} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-500 transition-all hover:scale-110"><Github size={28} /></a>
          <a href={SOCIALS.linkedin} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-500 transition-all hover:scale-110"><Linkedin size={28} /></a>
          <a href={SOCIALS.twitter} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-500 transition-all hover:scale-110"><Twitter size={28} /></a>
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.5em] text-slate-500 dark:text-white opacity-40 dark:opacity-30">© 2024 Donchaminade. Tous droits réservés.</div>
      </footer>
    </div>
  );
};

export default App;
