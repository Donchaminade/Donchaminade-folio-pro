'use client';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Loader from './Loader';
import Nav from './Nav';
import Pointeur from './Pointeur';
import DotBoard from './DotBoard';
import { Hero, About, Services, Work, Components, Contact } from './Sections';
import { Awards, Community, Gallery, Path, Pricing } from './More';
import Booking from './Booking';
import { navIds } from '@/lib/catalog';

function Shell() {
  const reduced = !!useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('accueil');
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (new URLSearchParams(location.search).has('sansintro')) setLoading(false);
  }, []);

  useEffect(() => {
    const els = [...navIds, 'hello'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) setActive(e.target.id === 'hello' ? 'ecrans' : e.target.id);
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
        <Path />
        <Services />
        <Pricing />
        <Booking />
        <Work />
        <Awards />
        <Community />
        <Gallery />
        <Components />
        <DotBoard reduced={reduced} />
        <Contact />
      </main>
    </MotionConfig>
  );
}

export default function Portfolio() {
  return <Shell />;
}
