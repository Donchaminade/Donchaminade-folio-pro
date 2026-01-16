
import React from 'react';
import { STATS } from '../constants';

const Stats: React.FC = () => {
    return (
        <section className="px-6 py-12 md:py-20 bg-white/[0.01] border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 md:mb-3 group-hover:text-blue-500 transition-colors">
                  {stat.value}<span className="text-blue-600 text-2xl md:text-3xl ml-1">{stat.suffix}</span>
                </div>
                <div className="text-slate-500 uppercase text-[9px] md:text-xs font-black tracking-[0.4em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
    );
}

export default Stats;
