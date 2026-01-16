
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Package,
  Layers,
  Briefcase,
  MessageSquare,
  User
} from 'lucide-react';
import { PROJECTS } from './constants';
import { Project } from './types';

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


const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    if (showAllProjects) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showAllProjects]);

  const homeProjects = PROJECTS.slice(0, 5);

  const SOCIALS = {
    linkedin: 'https://linkedin.com/in/chaminadeadjolou',
    twitter: 'https://x.com/Donchaminde',
    github: 'https://github.com/Donchaminade',
  };

  const NAV_ITEMS = [
    { name: 'Profil', id: 'apropos', icon: <User size={20} /> },
    { name: 'Parcours', id: 'experience', icon: <Briefcase size={20} /> },
    { name: 'Projets', id: 'projets', icon: <Package size={20} /> },
    { name: 'Comm.', id: 'communaute', icon: <Layers size={20} /> },
    { name: 'Contact', id: 'contact', icon: <MessageSquare size={20} /> }
  ];

  const NavItem = ({ item }: { item: typeof NAV_ITEMS[0] }) => (
    <a href={`#${item.id}`} className="relative py-1 group overflow-hidden transition-colors hover:text-blue-400">
      <span className="font-bold tracking-widest text-[11px] uppercase">{item.name}</span>
      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
    </a>
  );

  if (showAllProjects) {
    return <AllProjects setShowAllProjects={setShowAllProjects} />;
  }

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Desktop Navigation */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl hidden lg:block">
        <nav className="glass-dark px-10 py-4 rounded-full flex items-center justify-between border border-white/10 shadow-2xl">
          <div className="text-2xl font-black text-blue-500 tracking-tighter uppercase cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Donchaminade</div>
          <div className="flex items-center gap-10 text-slate-400">
            {NAV_ITEMS.map((item) => <NavItem key={item.id} item={item} />)}
          </div>
          <a href="#contact" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-[11px] font-black uppercase text-white transition-all shadow-lg shadow-blue-600/20">ME CONTACTER</a>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md lg:hidden bg-gradient-to-b from-slate-900/60 to-slate-950/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 px-6 md:px-8 py-4 md:py-5 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => (
          <a 
            key={item.id} 
            href={`#${item.id}`} 
            className="text-slate-300 hover:text-blue-500 active:text-blue-400 transition-all flex flex-col items-center gap-1 md:gap-2"
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
        <Trust />
        <Community />
        <Contact />
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <footer className="py-16 md:py-24 text-center border-t border-white/5 px-6 bg-slate-950/40">
        <div className="text-2xl md:text-3xl font-black text-blue-500 mb-6 md:mb-8 uppercase tracking-tighter">Donchaminade</div>
        <div className="flex justify-center gap-8 md:gap-10 mb-10 md:mb-12 text-slate-500">
          <a href={SOCIALS.github} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Github size={28} /></a>
          <a href={SOCIALS.linkedin} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Linkedin size={28} /></a>
          <a href={SOCIALS.twitter} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Twitter size={28} /></a>
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30">© 2024 Donchaminade. Tous droits réservés.</div>
      </footer>
    </div>
  );
};

export default App;
