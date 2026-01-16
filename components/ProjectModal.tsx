
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Smartphone, Layout, Activity, Zap, X } from 'lucide-react';
import { Project } from '../types';
import ProjectCarousel from './ProjectCarousel';
import { TECH_ICONS } from '../constants';

const ProjectModal: React.FC<{ project: Project | null, onClose: () => void }> = ({ project, onClose }) => (
    <AnimatePresence>
      {project && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/98 backdrop-blur-2xl overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="bg-slate-900/60 border border-white/10 rounded-[3rem] w-full max-w-6xl my-auto relative shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Control */}
            <div className="absolute top-6 right-6 flex gap-3 z-[60]">
               <button 
                onClick={onClose} 
                className="p-4 glass rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Media Part */}
              <div className="lg:col-span-7 relative h-[380px] lg:h-[750px] bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5">
                <ProjectCarousel project={project} />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
              </div>

              {/* Information Part */}
              <div className="lg:col-span-5 flex flex-col p-8 md:p-14 lg:p-16 h-full overflow-y-auto no-scrollbar bg-slate-900/40">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex items-center gap-2 px-5 py-2 glass rounded-full border border-blue-500/20">
                      {project.type === 'Mobile' ? <Smartphone size={14} className="text-blue-400" /> : <Layout size={14} className="text-blue-400" />}
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{project.type}</span>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-10">
                    {project.title}
                  </h2>

                  <div className="space-y-12">
                    {/* Concept */}
                    <div className="space-y-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
                        <Activity size={14} /> LE CONCEPT
                      </p>
                      <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                        {project.detailedDescription || project.description}
                      </p>
                    </div>

                    {/* Stack Section with Icons */}
                    <div className="space-y-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
                        <Zap size={14} /> TECHNOLOGIES UTILISÉES
                      </p>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {project.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2.5 px-4 py-2.5 glass rounded-2xl border border-white/5 text-[11px] font-black uppercase tracking-wider text-slate-300">
                            {TECH_ICONS[tag] && <img src={TECH_ICONS[tag]} alt={tag} className="w-4 h-4" />}
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Links Area - Prominent and Detailed */}
                <div className="mt-16 pt-12 border-t border-white/5 space-y-5">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">ACTIONS & LIENS</p>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                    {project.link && project.link !== '#' && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:scale-[1.02] active:scale-95 group"
                      >
                        VOIR LE SITE <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    
                    {project.github && project.github !== '#' && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 glass text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 border border-white/10 transition-all hover:scale-[1.02] active:scale-95 group"
                      >
                        CODE SOURCE <Github size={18} className="group-hover:rotate-12 transition-transform" />
                      </a>
                    )}

                    {(!project.github || project.github === '#') && (!project.link || project.link === '#') && (
                      <div className="flex-1 py-5 glass rounded-2xl text-slate-500 font-black text-[11px] uppercase tracking-widest border border-white/5 italic text-center">
                         Propriété privée ou confidentielle
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest text-center mt-4 italic">
                    * Certains projets peuvent être sous accords de confidentialité (NDA).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  export default ProjectModal;
