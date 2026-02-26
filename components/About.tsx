
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Trophy, Server, Layout, Smartphone, BrainCircuit, CheckCircle2, Star, Users } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { SKILL_BLOCKS, SOFT_SKILLS, EDUCATION, AWARDS } from '../constants';
import ImageGalleryCarousel from './ImageGalleryCarousel';

const iconMap: Record<string, React.ReactNode> = {
  Server: <Server size={24} className="text-blue-500" />,
  Layout: <Layout size={24} className="text-blue-500" />,
  Smartphone: <Smartphone size={24} className="text-blue-500" />,
  BrainCircuit: <BrainCircuit size={24} className="text-blue-500" />,
  Users: <Users size={24} className="text-blue-500" />
};

const About: React.FC = () => {
  return (
    <Section
      id="apropos"
      title="Mon Profil"
      subtitle="Développeur Fullstack orienté Backend, Data et Solutions Intelligentes."
      bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* EDUCATION SECTION (Top) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
          {EDUCATION.map((edu, i) => (
            <GlassCard key={i} className="p-6 md:p-8 rounded-[2rem] bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-900/5 dark:hover:bg-blue-900/10 border-slate-200 dark:border-white/5 transition-all group">
              <div className="font-black text-slate-900 dark:text-white text-lg md:text-xl uppercase leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{edu.degree}</div>
              <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">{edu.field}</div>
              <div className="text-[10px] md:text-xs font-black text-slate-500 mt-6 uppercase tracking-widest border-t border-slate-200 dark:border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>{edu.school}</span>
                <span className="text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full w-fit">{edu.year}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* STACK TECHNIQUE SECTION (Horizontal) */}
        <GlassCard className="lg:col-span-3 p-6 md:p-10 rounded-[2.5rem]">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase mb-8 md:mb-12 flex items-center gap-4"><Code size={28} className="text-blue-600 dark:text-blue-500" /> Stack Technique</h3>

          <div className="flex flex-col gap-10 lg:gap-14">
            {SKILL_BLOCKS.map((block, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm text-blue-600 dark:text-blue-400">
                    {iconMap[block.icon]}
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{block.title}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {block.categories.map((cat, j) => (
                    <div key={j} className="glass p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-white/40 dark:hover:bg-blue-900/10 transition-all group flex flex-col h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] dark:shadow-none">
                      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                        <h5 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-relaxed">{cat.name}</h5>
                        {cat.icons && cat.icons.length > 0 && (
                          <div className="flex items-center gap-1.5 shrink-0 self-start">
                            {cat.icons.map((icon, iconIdx) => (
                              <div key={iconIdx} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 p-1.5 group-hover:scale-110 transition-transform">
                                <img src={icon} alt={`Icon`} className="w-full h-full object-contain" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <ul className="space-y-3 mt-4">
                        {cat.skills.map((skill, k) => (
                          <li key={k} className="flex items-start gap-3 text-[13px] text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <span className="leading-relaxed font-light">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3 p-6 md:p-10 rounded-[2.5rem]">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-4"><Star size={28} className="text-blue-600 dark:text-blue-500" /> Soft Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {SOFT_SKILLS.map((skill, i) => (
              <div key={i} className="glass p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group flex flex-col h-full shadow-sm hover:shadow-md">
                <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{skill.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed font-medium">"{skill.impact}"</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {skill.context.map((ctx, j) => (
                    <span key={j} className="text-[9px] font-black px-2 py-1 rounded-md bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-widest shadow-sm">{ctx}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3 p-6 md:p-10 rounded-[2.5rem]">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase mb-6 md:mb-8 flex items-center gap-4"><Trophy size={28} className="text-blue-600 dark:text-blue-500" /> Distinctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {AWARDS.map((award, i) => (
              <div key={i} className="glass p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-black w-fit px-2 py-1 rounded-md bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-3">{award.year}</div>
                  <div className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{award.title}</div>
                </div>
                <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-light">{award.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* <div className="lg:col-span-3"><ImageGalleryCarousel /></div> */}
      </div>
    </Section>
  )
}

export default About;
