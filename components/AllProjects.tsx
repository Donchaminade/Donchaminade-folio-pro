
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

interface AllProjectsProps {
    setShowAllProjects: (show: boolean) => void;
}

const AllProjects: React.FC<AllProjectsProps> = ({ setShowAllProjects }) => {

    const [projectFilter, setProjectFilter] = useState<'All' | 'Web' | 'Mobile' | 'Design'>('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const filteredProjects = projectFilter === 'All' ? PROJECTS : PROJECTS.filter(p => p.type === projectFilter);

    return (
        <main className="min-h-screen pb-20 px-4 md:px-0 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto pt-12">
                <button onClick={() => setShowAllProjects(false)} className="flex items-center gap-3 text-blue-600 dark:text-blue-500 font-black uppercase text-[10px] md:text-xs tracking-widest hover:text-slate-900 dark:hover:text-white mb-12 transition-colors"><ArrowLeft size={18} /> Retour au Portfolio</button>
                <h1 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter text-slate-900 dark:text-white">Nos <span className="text-blue-600 dark:text-blue-500">Projets.</span></h1>
                <div className="flex flex-wrap gap-3 md:gap-4 mb-16">
                    {['All', 'Web', 'Mobile', 'Design'].map((filter) => (
                        <button key={filter} onClick={() => setProjectFilter(filter as any)} className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black tracking-widest border transition-all ${projectFilter === filter ? 'bg-blue-600 text-white border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' : 'glass text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-white/20 hover:bg-slate-200/50 dark:hover:bg-transparent'}`}>{filter.toUpperCase()}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredProjects.map((project) => <motion.div key={project.title} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ProjectCard project={project} onClick={() => setSelectedProject(project)} /></motion.div>)}
                </div>
            </div>
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </main>
    );
};

export default AllProjects;
