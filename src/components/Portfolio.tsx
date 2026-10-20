'use client';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Loader from './Loader';
import Pointeur from './Pointeur';
// Jeu casse-briques conservé dans DotBoard. Décommenter pour le réafficher.
// import DotBoard from './DotBoard';
import { Hero, About, Services, Work, Components, Contact } from './Sections';
import { Awards, Community, Gallery, Path, Pricing } from './More';
import Booking from './Booking';
import { Proof, Trust } from './Proof';

function Shell() {
  const reduced = !!useReducedMotion();
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (new URLSearchParams(location.search).has('sansintro')) setLoading(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} reduced={reduced} />}</AnimatePresence>
      <Pointeur />
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
        <Proof />
        <Trust />
        <Gallery />
        <Components />
        {/* <DotBoard reduced={reduced} /> */}
        <Contact />
      </main>
    </MotionConfig>
  );
}

export default function Portfolio() {
  return <Shell />;
}
