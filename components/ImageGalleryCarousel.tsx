
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES } from '../constants';

// Image Gallery Carousel
const ImageGalleryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[2.5rem] glass border border-white/10 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-full"
        >
          <img 
            src={GALLERY_IMAGES[currentIndex].url} 
            alt={GALLERY_IMAGES[currentIndex].caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex items-end p-6 md:p-16">
             <p className="text-white text-lg md:text-3xl font-black uppercase tracking-widest leading-none">
               {GALLERY_IMAGES[currentIndex].caption}
             </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-2 z-10">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 transition-all rounded-full ${i === currentIndex ? 'w-8 md:w-12 bg-blue-500' : 'w-2 md:w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryCarousel;
