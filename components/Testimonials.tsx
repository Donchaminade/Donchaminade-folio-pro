
import React from 'react';
import { Section } from './Section';
import TestimonialCarousel from './TestimonialCarousel';


const Testimonials: React.FC = () => {
    return (
        <Section 
          id="testimonials" 
          title="Témoignages" 
          subtitle="Ce que disent mes collaborateurs de notre travail."
          bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
        >
          <TestimonialCarousel />
        </Section>
    )
}

export default Testimonials;
