import React from 'react';
import { Linkedin } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { MANAGED_PAGES } from '../constants';

const LinkedInMarquee: React.FC = () => {
  return (
    <Section
      id="linkedin"
      className="full-width"
      title={
        <>
          Membre <span className="text-blue-600 dark:text-blue-500 underline decoration-slate-300 dark:decoration-white/20">actif</span> des communautés
        </>
      }
      subtitle="Un engagement prononcé pour l'épanouissement technologique local."
      bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="relative overflow-hidden w-full py-8 md:py-12 pause-marquee">
        <div className="flex w-max animate-marquee">
          <div className="flex gap-4 md:gap-8 pr-4 md:pr-8 items-center cursor-default">
            {MANAGED_PAGES.map((page, i) => (
              <GlassCard
                key={`om-${i}`}
                className={`flex flex-col justify-center items-center gap-4 w-56 md:w-64 h-40 p-6 md:p-8 transition-all group hover:bg-slate-200/50 dark:hover:bg-white/5 ${page.borderColor && page.borderColor !== 'border border-white/5' ? page.borderColor : 'border border-slate-200 dark:border-white/5'}`}
              >
                <div className="text-center">
                  <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-xl uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{page.name}</h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{page.category}</p>
                </div>
                {page.link !== '#' && (
                  <a href={page.link} target="_blank" rel="noreferrer" className="absolute top-4 right-4 text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-white transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
              </GlassCard>
            ))}
          </div>
          <div className="flex gap-4 md:gap-8 pr-4 md:pr-8 items-center cursor-default" aria-hidden="true">
            {MANAGED_PAGES.map((page, i) => (
              <GlassCard
                key={`dm-${i}`}
                className={`flex flex-col justify-center items-center gap-4 w-56 md:w-64 h-40 p-6 md:p-8 transition-all group hover:bg-slate-200/50 dark:hover:bg-white/5 ${page.borderColor && page.borderColor !== 'border border-white/5' ? page.borderColor : 'border border-slate-200 dark:border-white/5'}`}
              >
                <div className="text-center">
                  <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-xl uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{page.name}</h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{page.category}</p>
                </div>
                {page.link !== '#' && (
                  <a href={page.link} target="_blank" rel="noreferrer" className="absolute top-4 right-4 text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-white transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LinkedInMarquee;
