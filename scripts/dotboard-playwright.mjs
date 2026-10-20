import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.DOTBOARD_URL || 'http://127.0.0.1:3456/?sansintro#hello';
const out = '/opt/cursor/artifacts/screenshots/dotboard/play-1440-dark.png';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem('lang', 'fr');
  localStorage.setItem('theme', 'dark');
  localStorage.removeItem('dotboard-best');
});
await page.goto(base, { waitUntil: 'networkidle' });
const board = page.locator('#hello');
await board.scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Jouer' }).click({ force: true });
await page.waitForFunction(() => document.querySelector('#hello')?.getAttribute('data-dot-phase') === 'playing');

const canvas = page.locator('#hello canvas');
const box = await canvas.boundingBox();
if (!box) throw new Error('canvas absent');
await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.86);
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.86, { steps: 12 });
await page.waitForFunction(() => Number(document.querySelector('#hello')?.getAttribute('data-dot-score')) > 0, null, { timeout: 8000 });
const mid = await page.evaluate(() => ({
  phase: document.querySelector('#hello')?.getAttribute('data-dot-phase'),
  score: document.querySelector('#hello')?.getAttribute('data-dot-score'),
  lives: document.querySelector('#hello')?.getAttribute('data-dot-lives'),
}));
if (mid.phase !== 'playing' || Number(mid.score) < 10 || Number(mid.lives) !== 3) {
  throw new Error(`brique non cassée: ${JSON.stringify(mid)}`);
}
await mkdir('/opt/cursor/artifacts/screenshots/dotboard', { recursive: true });
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  const el = document.querySelector('#hello');
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo(0, y);
});
await board.screenshot({ path: out });

await page.mouse.move(box.x + 12, box.y + box.height * 0.9, { steps: 8 });
await page.waitForFunction(() => Number(document.querySelector('#hello')?.getAttribute('data-dot-lives')) < 3, null, { timeout: 8000 });
const end = await page.evaluate(() => ({
  phase: document.querySelector('#hello')?.getAttribute('data-dot-phase'),
  score: document.querySelector('#hello')?.getAttribute('data-dot-score'),
  lives: document.querySelector('#hello')?.getAttribute('data-dot-lives'),
  best: localStorage.getItem('dotboard-best'),
}));
if (end.phase !== 'playing' || Number(end.lives) !== 2 || Number(end.score) < 10) {
  throw new Error(`vie non perdue: ${JSON.stringify(end)}`);
}
console.log(JSON.stringify({ ok: true, mid, end, screenshot: out }));
await browser.close();
