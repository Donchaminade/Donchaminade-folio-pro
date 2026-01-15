
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  // Added onClick prop to fix the error in App.tsx
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  onClick
}) => {
  return (
    <div 
      // Apply onClick to the container div
      onClick={onClick}
      className={`
      glass p-6 rounded-2xl transition-all duration-300 
      ${hoverEffect ? 'hover:bg-white/5 hover:-translate-y-1 hover:border-white/20' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};