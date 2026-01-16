
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Component for Parallax Project Image
const ParallaxImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.img 
        style={{ y, scale: 1.15 }}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default ParallaxImage;
