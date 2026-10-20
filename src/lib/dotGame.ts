/** Casse-briques HELLO WORLD. Physique à pas fixe, indépendante du canvas. */

export const BEST_KEY = 'dotboard-best';

export type Phase = 'idle' | 'playing' | 'paused' | 'over' | 'won';

export type Brick = { id: string; x: number; y: number; r: number; alive: boolean };

const GLYPHS: Record<string, string[]> = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11100', '10010', '10001', '10001', '10001', '10010', '11100'],
};

const WORDS = ['HELLO', 'WORLD'];

export function readBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export class DotGame {
  width = 1;
  height = 1;
  bricks: Brick[] = [];
  ball = { x: 0, y: 0, vx: 0, vy: 0, r: 6 };
  paddle = 0;
  paddleW = 96;
  paddleH = 8;
  score = 0;
  lives = 3;
  best = 0;
  phase: Phase = 'idle';
  broken = 0;
  private serveIn = 0;
  private alive = new Map<string, boolean>();

  constructor(best = 0) {
    this.best = best;
  }

  resize(width: number, height: number) {
    const prevW = this.width;
    const prevH = this.height;
    const had = this.bricks.length > 0 && prevW > 1;
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.layout();
    if (had) {
      const sx = this.width / prevW;
      const sy = this.height / prevH;
      this.ball.x *= sx;
      this.ball.y *= sy;
      this.paddle *= sx;
      const mag = Math.hypot(this.ball.vx, this.ball.vy);
      if (mag > 1) {
        const speed = this.speed();
        this.ball.vx = (this.ball.vx / mag) * speed;
        this.ball.vy = (this.ball.vy / mag) * speed;
      }
    }
    this.clampPaddle();
    if (this.phase === 'idle' || this.serveIn > 0) this.stick();
  }

  setPaddle(x: number) {
    this.paddle = x;
    this.clampPaddle();
    if (this.phase === 'idle' || this.serveIn > 0) this.stick();
  }

  nudge(dx: number) {
    this.setPaddle(this.paddle + dx);
  }

  paddleY() {
    return this.height - Math.max(22, this.height * 0.06);
  }

  start() {
    if (this.phase !== 'idle') return;
    this.phase = 'playing';
    this.serveIn = 0;
    this.stick();
    this.launch();
  }

  pause() {
    if (this.phase === 'playing') this.phase = 'paused';
  }

  resume() {
    if (this.phase === 'paused') this.phase = 'playing';
  }

  restart() {
    this.score = 0;
    this.lives = 3;
    this.broken = 0;
    this.serveIn = 0;
    this.alive.clear();
    this.layout();
    this.phase = 'playing';
    this.stick();
    this.launch();
  }

  stick() {
    this.ball.x = this.paddle;
    this.ball.y = this.paddleY() - this.ball.r - 6;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  /** Un pas de physique. `dt` est en secondes. */
  step(dt: number) {
    if (this.phase !== 'playing') return;
    if (this.serveIn > 0) {
      this.serveIn -= dt;
      this.stick();
      if (this.serveIn <= 0) this.launch();
      return;
    }
    const travel = Math.hypot(this.ball.vx, this.ball.vy) * dt;
    const parts = Math.max(1, Math.min(8, Math.ceil(travel / Math.max(4, this.ball.r * 0.7))));
    const sub = dt / parts;
    for (let i = 0; i < parts; i += 1) {
      if (this.phase !== 'playing' || this.serveIn > 0) return;
      this.integrate(sub);
    }
  }

  private layout() {
    const cell = Math.min(this.width / 36, this.height / 24);
    const next: Brick[] = [];
    WORDS.forEach((word, line) => {
      const span = word.length * 6 - 1;
      const ox = (this.width - span * cell) / 2;
      const oy = this.height * 0.1 + line * 9 * cell;
      word.split('').forEach((ch, ci) => {
        (GLYPHS[ch] || []).forEach((row, ry) => {
          row.split('').forEach((bit, rx) => {
            if (bit !== '1') return;
            const id = `${line}:${ci}:${rx}:${ry}`;
            next.push({
              id,
              x: ox + (ci * 6 + rx) * cell + cell / 2,
              y: oy + ry * cell + cell / 2,
              r: cell * 0.34,
              alive: this.alive.get(id) !== false,
            });
          });
        });
      });
    });
    this.bricks = next;
    this.paddleW = Math.max(72, Math.min(this.width * 0.18, 168));
    this.ball.r = Math.max(5, cell * 0.42);
    if (!this.paddle) this.paddle = this.width / 2;
  }

  private clampPaddle() {
    const half = this.paddleW / 2;
    this.paddle = Math.max(half, Math.min(this.width - half, this.paddle));
  }

  private speed() {
    return Math.max(220, Math.min(this.height * 0.72 + this.broken * 2.4, 640));
  }

  private launch() {
    const speed = this.speed();
    let target: Brick | undefined;
    let best = Infinity;
    for (const brick of this.bricks) {
      if (!brick.alive || brick.y > this.ball.y - brick.r) continue;
      const dx = brick.x - this.ball.x;
      const dy = brick.y - this.ball.y;
      const d = dx * dx + dy * dy;
      if (d < best) {
        best = d;
        target = brick;
      }
    }
    if (!target) {
      this.ball.vx = speed * 0.2;
      this.ball.vy = -Math.abs(speed);
      return;
    }
    const dx = target.x - this.ball.x;
    const dy = target.y - this.ball.y;
    const len = Math.hypot(dx, dy) || 1;
    this.ball.vx = (dx / len) * speed;
    this.ball.vy = (dy / len) * speed;
  }

  private integrate(dt: number) {
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;
    const r = this.ball.r;
    if (this.ball.x < r) {
      this.ball.x = r;
      this.ball.vx = Math.abs(this.ball.vx);
    } else if (this.ball.x > this.width - r) {
      this.ball.x = this.width - r;
      this.ball.vx = -Math.abs(this.ball.vx);
    }
    if (this.ball.y < r) {
      this.ball.y = r;
      this.ball.vy = Math.abs(this.ball.vy);
    }

    const py = this.paddleY();
    const half = this.paddleW / 2;
    const hitX = this.ball.x > this.paddle - half - r && this.ball.x < this.paddle + half + r;
    if (this.ball.vy > 0 && hitX && this.ball.y + r >= py && this.ball.y + r <= py + this.paddleH + r) {
      const offset = (this.ball.x - this.paddle) / half;
      const angle = Math.max(-1, Math.min(1, offset)) * (Math.PI / 3);
      const speed = this.speed();
      this.ball.vx = Math.sin(angle) * speed;
      this.ball.vy = -Math.abs(Math.cos(angle) * speed);
      this.ball.y = py - r - 0.5;
    }

    let struck: Brick | undefined;
    let struckDist = Infinity;
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const dx = this.ball.x - brick.x;
      const dy = this.ball.y - brick.y;
      const dist = Math.hypot(dx, dy);
      const limit = r + brick.r;
      if (dist < limit && dist < struckDist) {
        struck = brick;
        struckDist = dist;
      }
    }
    if (struck) {
      const dx = this.ball.x - struck.x;
      const dy = this.ball.y - struck.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = r + struck.r - dist;
      this.ball.x += nx * overlap;
      this.ball.y += ny * overlap;
      const dot = this.ball.vx * nx + this.ball.vy * ny;
      if (dot < 0) {
        this.ball.vx -= 2 * dot * nx;
        this.ball.vy -= 2 * dot * ny;
      }
      const mag = Math.hypot(this.ball.vx, this.ball.vy) || 1;
      const speed = this.speed();
      this.ball.vx = (this.ball.vx / mag) * speed;
      this.ball.vy = (this.ball.vy / mag) * speed;
      if (Math.abs(this.ball.vy) < speed * 0.18) {
        this.ball.vy = Math.sign(this.ball.vy || -1) * speed * 0.18;
      }
      struck.alive = false;
      this.alive.set(struck.id, false);
      this.broken += 1;
      this.score += 10;
      this.commitBest();
      if (this.bricks.every((brick) => !brick.alive)) {
        this.phase = 'won';
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.commitBest();
      }
    }

    if (this.ball.y > this.height + r) this.miss();
  }

  private miss() {
    this.lives -= 1;
    this.stick();
    if (this.lives <= 0) {
      this.phase = 'over';
      this.commitBest();
      return;
    }
    this.serveIn = 0.6;
  }

  private commitBest() {
    if (this.score <= this.best) return;
    this.best = this.score;
    try {
      localStorage.setItem(BEST_KEY, String(this.best));
    } catch { /* stockage indisponible */ }
  }
}
