
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES } from '../constants';
import { fetchPortfolio } from '../lib/api';
import type { GalleryImage } from '../types';

const ImageGalleryCarousel: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(GALLERY_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPortfolio<{ galleryImages: GalleryImage[] }>()
      .then((data) => {
        if (data.galleryImages?.length) setImages(data.galleryImages);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[2.5rem] glass border border-slate-200 dark:border-white/10 shadow-2xl">
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
            src={current.url}
            alt={current.caption || 'Galerie'}
            className="w-full h-full object-cover"
          />
          {current.caption ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex items-end p-6 md:p-16">
              <p className="text-white text-lg md:text-3xl font-black uppercase tracking-widest leading-none">
                {current.caption}
              </p>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 z-10 glass px-4 py-2 rounded-full border border-white/10">
        <span className="text-white font-black text-xs md:text-sm">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="text-white/30 text-[10px] md:text-xs">/</span>
        <span className="text-white/50 font-black text-xs md:text-sm">{String(images.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default ImageGalleryCarousel;
