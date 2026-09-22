import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface SectionProps {
  id: string;
  title: string | React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bgImage?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = '', bgImage }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothYProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 32,
    restDelta: 0.001,
  });

  const y = useTransform(smoothYProgress, [0, 1], ['-8%', '8%']);
  const opacity = useTransform(smoothYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.35]);

  return (
    <section id={id} ref={ref} className={`relative py-16 md:py-28 overflow-x-hidden overflow-hidden w-full min-w-0 ${className}`}>
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10 pointer-events-none h-[115%] -top-[7.5%]">
        {bgImage ? (
          <img src={bgImage} alt="" className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.06]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[min(90vw,42rem)] h-[min(90vw,42rem)] rounded-full bg-[rgba(61,110,168,0.06)] dark:bg-[rgba(91,134,184,0.07)]" />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10 md:mb-14 z-10 px-4 sm:px-6 max-w-7xl mx-auto min-w-0"
      >
        <h2 className="section-title mb-4 md:mb-5 text-[var(--ink)] max-w-3xl">
          {title}
          <span className="text-[var(--accent)]">.</span>
        </h2>
        {subtitle && <p className="section-lead">{subtitle}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-6% 0px' }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 min-w-0 ${className === 'full-width' ? '' : 'px-4 sm:px-6 max-w-7xl mx-auto'}`}
      >
        {children}
      </motion.div>
    </section>
  );
};
