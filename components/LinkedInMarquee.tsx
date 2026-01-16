
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { MANAGED_PAGES } from '../constants';

const LinkedInMarquee: React.FC = () => {
  const doublePages = [...MANAGED_PAGES, ...MANAGED_PAGES];

  return (
    <Section 
      id="linkedin" 
      title="Gestion LinkedIn" 
      subtitle="Stratégies digitales performantes."
      bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="relative overflow-hidden w-full py-8 md:py-12 -mx-6 px-6">
        <motion.div 
          className="flex gap-6 md:gap-8 w-max"
          animate={{ x: [0, -1100] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" }}
        >
          {doublePages.map((page, i) => (
            <GlassCard key={i} className="flex flex-col items-center gap-4 w-56 md:w-64 p-6 md:p-8 border-white/5 hover:border-blue-500/30">
              <div className="w-16 h-16 md:w-20 md:h-20 glass rounded-2xl flex items-center justify-center p-3 md:p-4">
                <img src={page.logo} alt={page.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-white text-base md:text-lg uppercase tracking-tight">{page.name}</h3>
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">{page.category}</p>
              </div>
              <a href={page.link} target="_blank" rel="noreferrer" className="mt-3 md:mt-4 text-slate-500 hover:text-blue-500 transition-colors">
                <Linkedin size={18} />
              </a>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default LinkedInMarquee;
