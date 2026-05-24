import React from 'react';
import { MessageSquareQuote, ThumbsUp } from 'lucide-react';
import type { SocialProofKind } from '../lib/socialProof';

interface Props {
  kind: SocialProofKind;
  className?: string;
}

const SocialProofBadge: React.FC<Props> = ({ kind, className = '' }) => {
  const isRec = kind === 'recommendation';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        isRec
          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25'
          : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25'
      } ${className}`}
    >
      {isRec ? <ThumbsUp size={10} /> : <MessageSquareQuote size={10} />}
      {isRec ? 'Recommandation' : 'Témoignage'}
    </span>
  );
};

export default SocialProofBadge;
