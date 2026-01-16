
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Trophy } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { SKILLS, EDUCATION, AWARDS } from '../constants';
import ImageGalleryCarousel from './ImageGalleryCarousel';

const About: React.FC = () => {
    return (
        <Section 
          id="apropos" 
          title="Mon Profil" 
          subtitle="Une maîtrise complète des architectures Web & Mobiles modernes."
          bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            <GlassCard className="lg:col-span-2 p-6 md:p-10 rounded-[2.5rem]">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-8 md:mb-12 flex items-center gap-4"><Code size={28} className="text-blue-500" /> Stack Technique</h3>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"
              >
                {SKILLS.map((skill, i) => (
                  <motion.div 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                    }}
                    className="flex flex-col items-center gap-3 md:gap-4 p-4 md:p-6 glass rounded-3xl hover:bg-blue-500/10 transition-all border-white/5 hover:border-blue-500/40 group cursor-default"
                  >
                    <img src={skill.icon} alt={skill.name} className="w-10 h-10 md:w-12 md:h-12 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">{skill.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
            
            <div className="space-y-6">
              {EDUCATION.map((edu, i) => (
                <GlassCard key={i} className="p-6 md:p-8 rounded-[2rem] bg-blue-900/5 hover:bg-blue-900/10 border-white/5">
                  <div className="font-black text-white text-lg md:text-xl uppercase leading-tight tracking-tight">{edu.degree}</div>
                  <div className="text-sm md:text-base text-slate-400 mt-2 font-light">{edu.field}</div>
                  <div className="text-[10px] md:text-xs font-black text-slate-500 mt-6 uppercase tracking-widest border-t border-white/10 pt-4 flex justify-between">
                    <span>{edu.school}</span>
                    <span className="text-blue-500">{edu.year}</span>
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="lg:col-span-1 p-6 md:p-10 rounded-[2.5rem]">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-8 md:mb-10 flex items-center gap-4"><Trophy size={28} className="text-blue-500" /> Distinctions</h3>
              <div className="space-y-6 md:space-y-8">
                {AWARDS.map((award, i) => (
                  <div key={i} className="border-l-2 md:border-l-3 border-blue-500/30 pol-4 md:pl-6 py-2">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{award.year}</div>
                    <div className="text-lg md:text-xl font-black text-white uppercase tracking-tight mt-1">{award.title}</div>
                    <p className="text-sm md:text-base text-slate-400 mt-2 leading-relaxed font-light">{award.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
            
            <div className="lg:col-span-2"><ImageGalleryCarousel /></div>
          </div>
        </Section>
    )
}

export default About;
