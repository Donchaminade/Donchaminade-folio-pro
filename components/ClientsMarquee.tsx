import React from 'react';
import { CLIENTS } from '../constants';

const ClientsMarquee: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full py-8 md:py-12 pause-marquee">
      <div className="flex w-max items-center animate-marquee-slow">
        <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 items-center cursor-default">
          {CLIENTS.map((client, i) => (
            <div key={`oc-${i}`} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center p-4 md:p-5 grayscale group-hover:grayscale-0 transition-all border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/5">
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-[9px] md:text-xs font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 items-center cursor-default" aria-hidden="true">
          {CLIENTS.map((client, i) => (
            <div key={`dc-${i}`} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center p-4 md:p-5 grayscale group-hover:grayscale-0 transition-all border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/5">
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-[9px] md:text-xs font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default ClientsMarquee;
