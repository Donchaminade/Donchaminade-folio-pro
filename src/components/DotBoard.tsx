'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DotGame, readBest, type Phase } from '@/lib/dotGame';
import { useI18n } from '@/lib/i18n';
import { Heartbeat, MotionIcon } from './MotionIcon';

const STEP = 1000 / 60;

export default function DotBoard({ reduced }: { reduced: boolean }) {
  const { t, theme } = useI18n();
  const soften = reduced || !!useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<DotGame | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const themeRef = useRef(theme);
  const softenRef = useRef(soften);
  themeRef.current = theme;
  softenRef.current = soften;

  useEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    if (!canvas || !zone) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const game = new DotGame(readBest());
    gameRef.current = game;
    setBest(game.best);
    const keys = { left: false, right: false };
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const born = performance.now();
    const shown = { score: game.score, lives: game.lives, phase: game.phase, best: game.best };

    const publish = () => {
      if (game.score !== shown.score) { shown.score = game.score; setScore(game.score); }
      if (game.lives !== shown.lives) { shown.lives = game.lives; setLives(game.lives); }
      if (game.best !== shown.best) { shown.best = game.best; setBest(game.best); }
      if (game.phase !== shown.phase) { shown.phase = game.phase; setPhase(game.phase); }
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.resize(w, h);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, game.width, game.height);
      const light = themeRef.current === 'light';
      const ink = light ? '24,24,27' : '255,255,255';
      const quiet = softenRef.current || game.phase !== 'idle';
      game.bricks.forEach((brick, index) => {
        const fade = quiet ? 1 : Math.min(1, Math.max(0, (now - born - index * 6) / 260));
        const alpha = (brick.alive ? 1 : 0.14) * fade;
        if (alpha <= 0) return;
        ctx.fillStyle = `rgba(${ink},${alpha})`;
        ctx.beginPath();
        ctx.arc(brick.x, brick.y, brick.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = light ? '#18181b' : '#ffffff';
      ctx.beginPath();
      ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = light ? '#18181b' : '#d9d0c1';
      ctx.beginPath();
      ctx.roundRect(game.paddle - game.paddleW / 2, game.paddleY(), game.paddleW, game.paddleH, 4);
      ctx.fill();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let delta = now - last;
      last = now;
      if (delta > 80) delta = 80;
      if (game.phase === 'playing') {
        acc += delta;
        let guard = 0;
        while (acc >= STEP && guard < 5) {
          const seconds = STEP / 1000;
          if (keys.left) game.nudge(-480 * seconds);
          if (keys.right) game.nudge(480 * seconds);
          game.step(seconds);
          acc -= STEP;
          guard += 1;
        }
        publish();
      } else {
        acc = 0;
        if (game.phase === 'idle') game.stick();
      }
      draw(now);
    };

    const point = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      game.setPaddle(((clientX - rect.left) / rect.width) * game.width);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.type === 'pointerdown') canvas.focus({ preventScroll: true });
      point(event.clientX);
    };
    const onTouch = (event: TouchEvent) => {
      if (game.phase !== 'playing') return;
      event.preventDefault();
      const touch = event.touches[0] || event.changedTouches[0];
      if (touch) point(touch.clientX);
    };
    const inside = () => zone.matches(':hover') || zone.contains(document.activeElement);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const active = game.phase === 'playing' || game.phase === 'paused';
      if (!active || !inside()) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') keys.left = true;
      if (event.key === 'ArrowRight') keys.right = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') keys.left = false;
      if (event.key === 'ArrowRight') keys.right = false;
    };
    const onHide = () => {
      if (document.hidden && game.phase === 'playing') {
        game.pause();
        publish();
      }
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) && game.phase === 'playing') {
        game.pause();
        publish();
      }
    }, { threshold: 0.2 });

    fit();
    last = performance.now();
    raf = requestAnimationFrame(frame);
    observer.observe(zone);
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('pointermove', onPointer);
    zone.addEventListener('touchmove', onTouch, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('pointermove', onPointer);
      zone.removeEventListener('touchmove', onTouch);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onHide);
      gameRef.current = null;
    };
  }, []);

  const act = (kind: 'start' | 'pause' | 'resume' | 'restart') => {
    const game = gameRef.current;
    if (!game) return;
    if (kind === 'start') game.start();
    if (kind === 'pause') game.pause();
    if (kind === 'resume') game.resume();
    if (kind === 'restart') game.restart();
    setPhase(game.phase);
    setScore(game.score);
    setLives(game.lives);
    setBest(game.best);
  };

  return (
    <section id="hello" className="wrap relative py-20 md:py-24"
      data-dot-phase={phase} data-dot-score={score} data-dot-lives={lives} data-dot-best={best}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <span className="label w-fit rounded-full border border-white/20 px-3 py-1.5 text-white/60">{t.dotKicker}</span>
        <span className="label text-white/40">{t.dotHint}</span>
      </div>
      <div ref={zoneRef} className={`relative mt-6 ${phase === 'playing' ? 'touch-none' : ''}`}>
        <canvas ref={canvasRef} tabIndex={0} role="application" aria-label={t.dotAria}
          className="h-[60vh] min-h-[320px] w-full rounded-3xl border border-white/10 bg-white/[.03] outline-none focus-visible:border-cream" />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
          <p className="rounded-full border border-white/15 bg-black/55 px-3 py-2 text-sm text-[#fafafa]">
            {t.dotScore} <span className="font-semibold">{score}</span>
            <span className="mx-2 opacity-40">·</span>
            {t.dotBest} <span className="font-semibold">{best}</span>
          </p>
          <p className="rounded-full border border-white/15 bg-black/55 px-3 py-2 text-sm text-[#fafafa]" aria-label={`${t.dotLives} ${lives}`}>
            {t.dotLives} {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < lives ? 'text-[#d9d0c1]' : 'opacity-30'}>●</span>
            ))}
          </p>
        </div>
        {(phase === 'playing' || phase === 'paused') && (
          <button type="button" onClick={() => act(phase === 'playing' ? 'pause' : 'resume')}
            className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/70 px-4 text-sm font-medium text-[#fafafa]">
            {phase === 'playing'
              ? <><MotionIcon icon={Pause} size={16} effect="bounce" />{t.dotPause}</>
              : <><MotionIcon icon={Play} size={16} effect="slide" />{t.dotResume}</>}
          </button>
        )}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div key="play" className="pointer-events-none absolute inset-0 grid place-items-center"
              initial={soften ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={soften ? undefined : { opacity: 0 }}>
              <Heartbeat>
                <button type="button" onClick={() => act('start')}
                  className="pointer-events-auto inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-8 text-base font-medium text-ink">
                  <MotionIcon icon={Play} size={18} effect="slide" />
                  {t.dotPlay}
                </button>
              </Heartbeat>
            </motion.div>
          )}
          {(phase === 'over' || phase === 'won') && (
            <motion.div key={phase} className="absolute inset-0 z-10 grid place-items-center bg-black/55 px-4 backdrop-blur-sm"
              initial={soften ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={soften ? undefined : { opacity: 0 }}>
              <motion.div initial={soften ? false : { scale: 0.92, y: 18 }} animate={{ scale: 1, y: 0 }}
                transition={soften ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 24 }}
                className="w-full max-w-sm rounded-3xl border border-white/20 bg-black/75 px-6 py-8 text-center text-[#fafafa]">
                <p className="font-display text-4xl font-black uppercase">{phase === 'won' ? t.dotWin : t.dotOver}</p>
                <p className="mt-3 text-base">{t.dotScore} {score}</p>
                <p className="text-base text-[#d9d0c1]">{t.dotBest} {Math.max(best, score)}</p>
                <button type="button" onClick={() => act('restart')}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d9d0c1] px-6 text-base font-medium text-[#18181b]">
                  <MotionIcon icon={RotateCcw} size={16} effect="spin" />
                  {t.dotRestart}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
