import React, { useState } from 'react';
import { HeartHandshake } from 'lucide-react';
import { Section } from './Section';
import SocialProofCarousel from './SocialProofCarousel';
import SocialProofSubmitModal from './SocialProofSubmitModal';
import type { SocialProofFilter } from '../lib/socialProof';

const Testimonials: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<SocialProofFilter>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Section
      id="testimonials"
      title="Références"
      subtitle="Témoignages et recommandations de personnes avec qui j'ai collaboré."
      bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 transition-all"
        >
          <HeartHandshake size={18} />
          Laisser un avis
        </button>
      </div>

      <SocialProofCarousel
        filter={filter}
        onFilterChange={setFilter}
        refreshKey={refreshKey}
      />

      <SocialProofSubmitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
        initialKind={filter === 'recommendation' ? 'recommendation' : 'testimonial'}
      />
    </Section>
  );
};

export default Testimonials;
