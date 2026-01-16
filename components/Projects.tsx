
import React from 'react';
import { Layers } from 'lucide-react';
import { Section } from './Section';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectsProps {
    homeProjects: Project[];
    setSelectedProject: (project: Project) => void;
    setShowAllProjects: (show: boolean) => void;
}

const Projects: React.FC<ProjectsProps> = ({ homeProjects, setSelectedProject, setShowAllProjects }) => {
    return (
        <Section 
          id="projets" 
          title="Réalisations" 
          subtitle="Chaque projet est une réponse unique à un défi technique complexe."
          bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {homeProjects.map((project, i) => <ProjectCard key={project.title} project={project} onClick={() => setSelectedProject(project)} />)}
            <div className="flex flex-col items-center justify-center p-10 md:p-12 glass rounded-[2.5rem] border-dashed border-2 border-white/10 hover:border-blue-500/50 cursor-pointer group" onClick={() => setShowAllProjects(true)}>
              <div className="p-6 md:p-8 bg-blue-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <Layers size={40} className="text-blue-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-3">Plus de 25 Projets</h3>
              <p className="text-slate-500 text-center text-sm mb-6 md:mb-8 font-light">Découvrez l'intégralité de mon portfolio.</p>
              <button className="px-8 md:px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20">VOIR TOUT</button>
            </div>
          </div>
        </Section>
    )
}

export default Projects;
