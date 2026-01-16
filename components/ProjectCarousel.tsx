
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

// Component for Project Carousel
const ProjectCarousel: React.FC<{ project: Project }> = ({ project }) => {
  const allImages = [project.image, ...(project.additionalImages || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          src={allImages[currentIndex]}
          alt={`${project.title} screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {allImages.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/10 transition-colors z-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/10 transition-colors z-30"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {allImages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCarousel;
