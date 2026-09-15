
import React, { useEffect, useState } from 'react';
import { STATS } from '../constants';
import { fetchPortfolio } from '../lib/api';
import type { Stat } from '../types';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>(STATS);

  useEffect(() => {
    fetchPortfolio<{ stats: Stat[] }>()
      .then((data) => {
        if (data.stats?.length) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="px-4 sm:px-6 py-12 md:py-20 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.05]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center group min-w-0 px-1">
            <div className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors break-words">
              {stat.value}
              <span className="text-blue-600 text-xl sm:text-2xl md:text-3xl ml-1">{stat.suffix}</span>
            </div>
            <div className="text-slate-500 uppercase text-[9px] md:text-xs font-black tracking-wider md:tracking-[0.4em] break-words leading-snug">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
