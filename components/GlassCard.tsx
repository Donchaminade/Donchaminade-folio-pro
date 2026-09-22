import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
      glass p-5 sm:p-6 rounded-2xl transition-all duration-300
      ${hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-lg)]' : ''}
      ${className}
    `}
    >
      {children}
    </div>
  );
};
