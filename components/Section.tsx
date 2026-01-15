import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bgImage?: string; // Optional background image for parallax
}

export const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = "", bgImage }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Use spring for smoother parallax transitions
  const smoothYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Subtle parallax effect: moves the background layer slightly slower than the scroll
  const y = useTransform(smoothYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(smoothYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const opacity = useTransform(smoothYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id={id} ref={ref} className={`relative py-16 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden ${className}`}>
      {/* Parallax Background Layer */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="absolute inset-0 -z-10 pointer-events-none h-[120%] -top-[10%]"
      >
        {/* Abstract Tech Decor Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] md:opacity-[0.05] z-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H90 V30 H70 V90' fill='none' stroke='%233b82f6' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%233b82f6'/%3E%3Ccircle cx='70' cy='90' r='2' fill='%233b82f6'/%3E%3Cpath d='M20 50 H40 V70' fill='none' stroke='%233b82f6' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='70' r='1.5' fill='%233b82f6'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px'
        }} />
        
        {bgImage ? (
          <>
            <img 
              src={bgImage} 
              alt="" 
              className="w-full h-full object-cover opacity-[0.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             {/* A subtle tech-inspired abstract shape if no image is provided */}
             <div className="w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mb-10 md:mb-16 z-10"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 uppercase tracking-tighter text-white">
          {title}<span className="text-blue-500">.</span>
        </h2>
        {subtitle && <p className="text-slate-300 text-lg md:text-2xl max-w-3xl font-light leading-relaxed">{subtitle}</p>}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};
