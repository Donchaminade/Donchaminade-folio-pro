import React, { useState } from 'react';

interface BrandMarkProps {
  className?: string;
  onClick?: () => void;
}

/** Logo DC (favicon) avec repli monogramme si l’image est absente */
const BrandMark: React.FC<BrandMarkProps> = ({ className = '', onClick }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const inner = imgFailed ? (
    <span
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black tracking-tighter text-white shadow-lg shadow-blue-600/30"
      aria-hidden
    >
      DC
    </span>
  ) : (
    <img
      src="/favicon.png"
      alt="Donchaminade"
      className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-lg shadow-blue-600/20"
      onError={() => setImgFailed(true)}
    />
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 ${className}`} aria-label="Accueil">
        {inner}
      </button>
    );
  }

  return <div className={`inline-flex items-center gap-2 ${className}`}>{inner}</div>;
};

export default BrandMark;
