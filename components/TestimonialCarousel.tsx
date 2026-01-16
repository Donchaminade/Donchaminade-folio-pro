
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { TESTIMONIALS } from '../constants';

// Testimonials Carousel Component
const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));

  return (
    <div className="relative max-w-4xl mx-auto group">
      <div className="overflow-hidden px-4 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <GlassCard className="p-6 md:p-16 rounded-[2.5rem] border-white/5 bg-slate-900/40 relative">
              <Quote className="absolute top-8 left-8 text-blue-500/10 w-24 h-24 -z-10" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {TESTIMONIALS[currentIndex].image && (
                  <img 
                    src={TESTIMONIALS[currentIndex].image} 
                    alt={TESTIMONIALS[currentIndex].name} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-blue-500/50 object-cover" 
                  />
                )}
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-slate-200 italic font-light leading-relaxed mb-6 md:mb-8">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">
                      {TESTIMONIALS[currentIndex].role} — {TESTIMONIALS[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronRight size={24} />
      </button>

      <div className="flex justify-center gap-3 mt-8">
        {TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)} 
            className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-10 bg-blue-500' : 'w-4 bg-white/10'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
