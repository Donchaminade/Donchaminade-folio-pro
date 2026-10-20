'use client';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Loader from './Loader';
import Nav from './Nav';
import Pointeur from './Pointeur';
import DotBoard from './DotBoard';
import { Hero, About, Services, Work, Components, Contact } from './Sections';
import { nav } from '@/lib/data';

export default function Portfolio() {
  const reduced = !!useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('accueil');
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (new URLSearchParams(location.search).has('sansintro')) setLoading(false);
  }, []);

  useEffect(() => {
    const els = [...nav.map((n) => n.id), 'hello'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) setActive(e.target.id === 'hello' ? 'composants' : e.target.id);
    }), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} reduced={reduced} />}</AnimatePresence>
      <Pointeur />
      {!loading && <Nav active={active} />}
      <main>
        <Hero ready={!loading} />
        <About />
        <Services />
        <Work />
        <Components />
        <DotBoard reduced={reduced} />
        <Contact />
      </main>
    </MotionConfig>
  );
}
