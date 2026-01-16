
import React, { useState, useEffect } from 'react';

// Subtle Glitch Text Component
const GlitchText: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    };
    const interval = setInterval(triggerGlitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`glitch-text ${isGlitching ? 'is-glitching' : ''} ${className || ''}`} 
      data-text={text}
    >
      {text}
    </span>
  );
};

export default GlitchText;
