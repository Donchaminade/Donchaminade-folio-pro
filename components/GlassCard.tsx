
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  onClick
}) => {
  const hasBrandBorder = className.includes('glass-brand-border');

  return (
    <div
      onClick={onClick}
      className={`
      glass p-6 rounded-2xl transition-all duration-300 
      ${hoverEffect ? `hover:bg-slate-200/50 dark:hover:bg-white/5 hover:-translate-y-1${hasBrandBorder ? '' : ' hover:border-slate-300 dark:hover:border-white/20'}` : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
