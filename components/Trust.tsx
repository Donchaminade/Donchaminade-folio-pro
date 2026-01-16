
import React from 'react';
import { Section } from './Section';
import ClientsMarquee from './ClientsMarquee';

const Trust: React.FC = () => {
    return (
        <Section 
          id="trust" 
          title="Ils m'ont fait confiance" 
          subtitle="Une collaboration basée on the performance et l'innovation."
          bgImage="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
        >
          <ClientsMarquee />
        </Section>
    );
}

export default Trust;
