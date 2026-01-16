
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Linkedin } from 'lucide-react';
import { Section } from './Section';
import { GlassCard } from './GlassCard';
import { COMMUNITIES } from '../constants';

const Community: React.FC = () => {
    const [activeCommunity, setActiveCommunity] = useState<number | null>(null);

    return (
        <Section 
          id="communaute" 
          title="Communauté" 
          subtitle="Un engagement actif pour l'épanouissement technologique local."
          bgImage="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-start">
            {COMMUNITIES.map((comm, i) => (
              <GlassCard 
                key={i} 
                className={`p-10 cursor-pointer rounded-[3rem] transition-all border-white/5 relative overflow-hidden group/card ${activeCommunity === i ? 'ring-2 ring-blue-500 bg-blue-500/10 scale-[1.02]' : 'hover:bg-white/5 hover:-translate-y-2'}`} 
                onClick={() => setActiveCommunity(activeCommunity === i ? null : i)}
              >
                <div className="absolute top-[-20%] right-[-10%] opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                   <div className="text-[140px] font-black">{comm.logo}</div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 bg-blue-500/5">
                    {comm.logo}
                  </div>
                  <h3 className="font-black text-white text-2xl uppercase tracking-tighter leading-none mb-4">{comm.name}</h3>
                  <div className="px-4 py-1.5 glass rounded-full border-blue-500/30">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{comm.role}</p>
                  </div>
                  
                  <AnimatePresence>
                    {activeCommunity === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm md:text-base text-slate-400 mt-8 leading-relaxed overflow-hidden font-light"
                      >
                        <div className="pt-6 border-t border-white/10">
                           {comm.description}
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                           <div className="p-3 glass rounded-xl text-blue-400 hover:text-white transition-colors"><Globe size={18} /></div>
                           <div className="p-3 glass rounded-xl text-blue-400 hover:text-white transition-colors"><Linkedin size={18} /></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8">
                     <button className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/50 group-hover/card:text-blue-500 transition-colors">
                       {activeCommunity === i ? 'FERMER' : 'DÉCOUVRIR MON IMPACT'}
                     </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
    );
}

export default Community;
