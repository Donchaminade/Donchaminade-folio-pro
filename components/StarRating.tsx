import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
  className?: string;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  size = 16,
  className = '',
}) => {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-400 dark:text-slate-600'}
        />
      ))}
    </div>
  );
};

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange, size = 28 }) => {
  const [hover, setHover] = React.useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Votre note">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={n <= active ? 'fill-amber-400 text-amber-400' : 'text-slate-400 dark:text-slate-600'}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-amber-500">{active > 0 ? `${active}/5` : '—'}</span>
    </div>
  );
};
