'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

// Police matricielle 5x7 pour HELLO WORLD
const F: Record<string, string[]> = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11100', '10010', '10001', '10001', '10001', '10010', '11100'],
};

export default function DotBoard({ reduced }: { reduced: boolean }) {
  const { t, theme } = useI18n();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!; const ctx = cv.getContext('2d')!;
    let W = 0, H = 0, raf = 0, cell = 10;
    const dots: { x: number; y: number; on: number; born: number }[] = [];
    const ball = { x: 0, y: 0, vx: 3.2, vy: -3.6, r: 6 };
    let paddle = 0; let t0 = performance.now();
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.min(W / 34, H / 22); dots.length = 0;
      ['HELLO', 'WORLD'].forEach((word, line) => {
        const ox = (W - 29 * cell) / 2, oy = H * 0.14 + line * 9 * cell;
        word.split('').forEach((ch, ci) => F[ch].forEach((row, ry) => row.split('').forEach((b, rx) => {
          if (b === '1') dots.push({ x: ox + (ci * 6 + rx) * cell + cell / 2, y: oy + ry * cell + cell / 2, on: 1, born: (ci + line * 5) * 90 + ry * 20 });
        })));
      });
      ball.x = W / 2; ball.y = H * 0.82; ball.r = Math.max(4, cell * 0.45); paddle = W / 2; t0 = performance.now();
    };
    const draw = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const a = reduced ? 1 : Math.min(1, Math.max(0, (t - d.born) / 300));
        if (d.on < 1) d.on = Math.min(1, d.on + 0.004);
        const ink = theme === 'light' ? '24,24,27' : '255,255,255';
        ctx.fillStyle = `rgba(${ink},${(0.15 + 0.85 * d.on) * a})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, cell * 0.36, 0, Math.PI * 2); ctx.fill();
      }
      const pw = Math.max(90, W * 0.14), py = H * 0.9;
      if (!reduced) {
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
        if (ball.y < ball.r) ball.vy *= -1;
        if (ball.vy > 0 && ball.y + ball.r >= py && Math.abs(ball.x - paddle) < pw / 2) { ball.vy = -Math.abs(ball.vy); ball.vx += (ball.x - paddle) * 0.03; ball.vx = Math.max(-5, Math.min(5, ball.vx)); }
        if (ball.y > H + 20) { ball.x = W / 2; ball.y = H * 0.6; ball.vy = -3.6; }
        for (const d of dots) if (d.on > 0.8 && Math.hypot(d.x - ball.x, d.y - ball.y) < cell * 0.7) { d.on = 0.05; ball.vy *= -1; break; }
      }
      ctx.fillStyle = theme === 'light' ? '#18181b' : '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = theme === 'light' ? '#18181b' : '#d9d0c1'; ctx.beginPath(); ctx.roundRect(paddle - pw / 2, py, pw, 6, 3); ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); paddle = e.clientX - r.left; };
    build(); raf = requestAnimationFrame(draw);
    let auto = 0; const autoT = setInterval(() => { if (Date.now() - auto > 1500) paddle += (ball.x - paddle) * 0.5; }, 30);
    const mv = (e: PointerEvent) => { auto = Date.now(); move(e); };
    cv.addEventListener('pointermove', mv); window.addEventListener('resize', build);
    return () => { cancelAnimationFrame(raf); clearInterval(autoT); cv.removeEventListener('pointermove', mv); window.removeEventListener('resize', build); };
  }, [reduced, theme]);
  return (
    <section id="hello" className="wrap relative py-20 md:py-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="label w-fit rounded-full border border-white/20 px-3 py-1.5 text-white/60">{t.dotKicker}</span>
        <span className="label text-white/40">{t.dotHint}</span>
      </div>
      <motion.canvas ref={ref} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="mt-6 h-[60vh] min-h-[320px] w-full touch-none" aria-label={t.dotAria} role="img" />
    </section>
  );
}
