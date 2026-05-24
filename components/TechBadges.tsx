import React from 'react';
import { TechTag, techIconUrl } from '../lib/projectTags';
import { mediaUrl } from '../lib/media';

interface Props {
  tags: TechTag[];
  max?: number;
  size?: 'sm' | 'md';
}

const TechBadges: React.FC<Props> = ({ tags, max = 6, size = 'sm' }) => {
  const shown = tags.slice(0, max);
  const iconClass = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const padClass = size === 'md' ? 'px-3 py-1.5' : 'px-2.5 py-1';

  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((tag) => {
        const icon = techIconUrl(tag);
        const src = icon ? (icon.startsWith('http') ? icon : mediaUrl(icon)) : null;
        return (
          <span
            key={tag.name}
            className={`inline-flex items-center gap-1.5 ${padClass} glass rounded-lg border border-slate-200 dark:border-white/10`}
            title={tag.name}
          >
            {src ? (
              <img src={src} alt="" className={`${iconClass} object-contain`} />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
              {tag.name}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default TechBadges;
