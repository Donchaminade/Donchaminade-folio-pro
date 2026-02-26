
import React from 'react';
import { Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="relative border-l-2 md:border-l-4 border-blue-500/20 ml-4 md:ml-12 space-y-12 md:space-y-20">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              className="relative pl-8 md:pl-16 group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[11px] md:-left-[18px] top-6 md:top-8 w-5 h-5 md:w-8 md:h-8 rounded-full bg-slate-950 border-4 border-blue-500 flex items-center justify-center p-1 md:p-1.5 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-125 group-hover:bg-blue-500 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-blue-400 group-hover:bg-white animate-pulse" />
              </div>

              <GlassCard className="p-6 md:p-10 border-white/5 hover:border-blue-500/40 hover:bg-white/[0.02] transition-all rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                  <Briefcase size={140} />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-2 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                      <div className="text-lg md:text-xl text-slate-300 font-bold flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-blue-500/50" /> {exp.company}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border-blue-500/30 whitespace-nowrap w-fit">
                      <Calendar size={14} className="text-blue-500" />
                      <span className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-widest">{exp.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {exp.description.map((item, j) => (
                      <li key={j} className="text-sm md:text-base text-slate-400 leading-relaxed font-light flex gap-4 items-start group/item">
                        <div className="p-1 glass rounded-full mt-1 shrink-0 group-hover/item:border-blue-500/50 transition-colors">
                          <CheckCircle2 size={14} className="text-blue-500/60 group-hover/item:text-blue-400 transition-colors" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.tags && exp.tags.length > 0 && (
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 mb-4 opacity-70">Technologies clés</p>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {exp.tags.map((tag) => {
                          const iconUrl = TECH_ICONS[tag];
                          return (
                            <div key={tag} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 glass rounded-xl border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group/tag cursor-default">
                              {iconUrl ? (
                                <img src={iconUrl} alt={tag} className="w-4 h-4 md:w-5 md:h-5 group-hover/tag:scale-110 transition-transform" />
                              ) : (
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500/50" />
                              )}
                              <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-300 group-hover/tag:text-white transition-colors tracking-widest">{tag}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default Experience;
