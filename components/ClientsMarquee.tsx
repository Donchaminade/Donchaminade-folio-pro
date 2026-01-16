
import React from 'react';
import { motion } from 'framer-motion';
import { CLIENTS } from '../constants';

// Clients Marquee Component
const ClientsMarquee: React.FC = () => {
  const doubleClients = [...CLIENTS, ...CLIENTS];
  return (
    <div className="relative overflow-hidden w-full py-8 md:py-12">
      <motion.div 
        className="flex gap-8 md:gap-12 w-max items-center"
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
      >
        {doubleClients.map((client, i) => (
          <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
            <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center p-4 md:p-5 grayscale group-hover:grayscale-0 transition-all border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5">
              <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
              {client.name}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default ClientsMarquee;
