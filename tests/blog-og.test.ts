import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  applyOgMeta,
  articleOgMeta,
  blogIndexOgMeta,
  isSocialCrawler,
  matchBlogRoute,
} from '../lib/blogOg';

const shell = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const post = articleOgMeta(
  {
    slug: 'cloudflare-ai-search-ga-rag-hybride-multimodal-ocr',
    title: 'Cloudflare AI Search en GA',
    excerpt: 'Pipeline RAG managé, avant la facturation.',
    cover_image: '/uploads/blog/6b3fa3db1e6dea16_1791286083.jpg',
    published_at: '2026-10-06 11:32:14',
  },
  'https://donchaminade-alpha.vercel.app',
  'https://donchamfolio.grosbit.com'
);

test('les couvertures /uploads deviennent une URL https publique', () => {
  assert.equal(
    post.image,
    'https://donchamfolio.grosbit.com/public/uploads/blog/6b3fa3db1e6dea16_1791286083.jpg'
  );
  assert.equal(post.type, 'article');
  assert.equal(post.publishedTime, '2026-10-06T11:32:14.000Z');
  assert.equal(
    post.url,
    'https://donchaminade-alpha.vercel.app/blog/cloudflare-ai-search-ga-rag-hybride-multimodal-ocr'
  );
});

test('le HTML des crawlers porte les balises Open Graph et Twitter', () => {
  const html = applyOgMeta(shell, post);
  assert.match(html, /<title>Cloudflare AI Search en GA — Donchaminade<\/title>/);
  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /property="og:title" content="Cloudflare AI Search en GA"/);
  assert.match(html, /property="og:description" content="Pipeline RAG managé, avant la facturation\."/);
  assert.match(html, /property="og:image" content="https:\/\/donchamfolio\.grosbit\.com\/public\/uploads\/blog\/6b3fa3db1e6dea16_1791286083\.jpg"/);
  assert.match(html, /property="og:url" content="https:\/\/donchaminade-alpha\.vercel\.app\/blog\/cloudflare-ai-search-ga-rag-hybride-multimodal-ocr"/);
  assert.match(html, /property="article:published_time" content="2026-10-06T11:32:14\.000Z"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:site" content="@Donchaminade"/);
  assert.match(html, /name="twitter:creator" content="@Donchaminade"/);
  assert.match(html, /name="twitter:image" content="https:\/\/donchamfolio\.grosbit\.com\/public\/uploads\/blog\/6b3fa3db1e6dea16_1791286083\.jpg"/);
  assert.doesNotMatch(html, /og:image:width/);
  assert.doesNotMatch(html, /Donchaminade \| Développeur Web &amp; Mobile Full-Stack/);
});

test('la liste /blog et les robots', () => {
  assert.deepEqual(matchBlogRoute('/blog'), { kind: 'index' });
  assert.deepEqual(matchBlogRoute('/blog/'), { kind: 'index' });
  assert.equal(matchBlogRoute('/blog/preview/abc').kind, 'skip');
  assert.equal(matchBlogRoute('/blog/cloudflare-ai-search-ga-rag-hybride-multimodal-ocr').kind, 'post');
  assert.equal(isSocialCrawler('facebookexternalhit/1.1'), true);
  assert.equal(isSocialCrawler('Twitterbot/1.0'), true);
  assert.equal(isSocialCrawler('Mozilla/5.0'), false);

  const index = blogIndexOgMeta('https://donchaminade-alpha.vercel.app', 'https://donchamfolio.grosbit.com', null);
  const html = applyOgMeta(shell, index);
  assert.match(html, /property="og:title" content="Blog — Donchaminade"/);
  assert.match(html, /property="og:type" content="website"/);
  assert.match(html, /property="og:image" content="https:\/\/donchaminade-alpha\.vercel\.app\/og-share\.jpg"/);
  assert.match(html, /name="twitter:site" content="@Donchaminade"/);
});
