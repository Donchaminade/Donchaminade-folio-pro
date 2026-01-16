
import React from 'react';
import { Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { EXPERIENCES, TECH_ICONS } from '../constants';

const Experience: React.FC = () => {
    return (
        <Section 
          id="experience" 
          title="Parcours" 
          subtitle="Une expertise forgée au cœur de projets d'envergure."
          bgImage="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="max-w-4xl mx-auto">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="relative pl-8 md:pl-20 pb-12 md:pb-20 last:pb-0 group">
                <div className="absolute left-[7px] md:left-[35px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent group-last:bg-none" />
                
                <div className="absolute left-0 md:left-[23px] top-0 w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-950 border-2 md:border-3 border-blue-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform duration-300">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>

                <GlassCard className="p-6 md:p-12 border-white/5 hover:border-blue-500/40 transition-all rounded-[3rem] bg-slate-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-700">
                    <Briefcase size={120} className="rotate-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-6 md:mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-blue-500/20 mb-3">
                           <Calendar size={12} className="text-blue-500" />
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-2 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                        <div className="text-base md:text-xl text-slate-300 font-bold flex items-center gap-3">
                          <span className="w-6 h-[1px] bg-blue-500/50" /> {exp.company}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10">
                      {exp.description.map((item, j) => (
                        <li key={j} className="text-base md:text-lg text-slate-400 leading-relaxed font-light flex gap-4 items-start">
                          <div className="p-1 glass rounded-full mt-1.5 shrink-0">
                            <CheckCircle2 size={12} className="text-blue-500/60" />
                          </div> 
                          {item}
                        </li>
                      ))}
                    </ul>

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="pt-8 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Technologies clés</p>
                        <div className="flex flex-wrap gap-3">
                          {exp.tags.map((tag) => {
                            const iconUrl = TECH_ICONS[tag];
                            return (
                              <div key={tag} className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border-white/5 hover:border-blue-500/30 transition-all group/tag cursor-default">
                                {iconUrl ? (
                                  <img src={iconUrl} alt={tag} className="w-5 h-5 group-hover/tag:scale-110 transition-transform" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                                )}
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover/tag:text-white transition-colors tracking-widest">{tag}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </Section>
    );
}

export default Experience;
