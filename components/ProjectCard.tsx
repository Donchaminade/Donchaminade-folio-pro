
import React from 'react';
import { Project } from '../types';
import { GlassCard } from './GlassCard';
import ParallaxImage from './ParallaxImage';

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => (
    <GlassCard onClick={onClick} className="h-full flex flex-col p-0 overflow-hidden border-white/5 hover:border-blue-500/30 cursor-pointer group rounded-[2.5rem] shadow-2xl">
      <div className="relative aspect-video overflow-hidden">
        <ParallaxImage src={project.image} alt={project.title} />
        <div className="absolute top-4 left-4 z-10"><span className="px-3 py-1 glass-dark text-[8px] font-black uppercase rounded-lg border border-white/10">{project.type}</span></div>
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none">{project.title}</h3>
        <p className="text-slate-400 text-xs md:text-sm line-clamp-2 mt-3 md:mt-4 font-light leading-relaxed">{project.description}</p>
        <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] md:text-[10px] font-black uppercase text-slate-600 tracking-widest">{tag}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );

  export default ProjectCard;
