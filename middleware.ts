import { next } from '@vercel/functions/middleware';
import {
  DEFAULT_API_BASE,
  applyOgMeta,
  articleOgMeta,
  blogIndexOgMeta,
  isSocialCrawler,
  matchBlogRoute,
  type BlogPostOgSource,
} from './lib/blogOg';

export const config = {
  matcher: ['/blog', '/blog/:path*'],
};

const API_TTL_MS = 10 * 60 * 1000;
const MISS_TTL_MS = 60 * 1000;
const TEMPLATE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = { at: number; ttl: number; value: T };

const memory = new Map<string, CacheEntry<unknown>>();

function apiBase(): string {
  return (process.env.VITE_API_URL || process.env.PORTFOLIO_API_URL || DEFAULT_API_BASE).replace(
    /\/$/,
    ''
  );
}

function readCache<T>(key: string): T | undefined {
  const hit = memory.get(key) as CacheEntry<T> | undefined;
  if (!hit) return undefined;
  if (Date.now() - hit.at > hit.ttl) {
    memory.delete(key);
    return undefined;
  }
  return hit.value;
}

function writeCache<T>(key: string, value: T, ttl: number): void {
  memory.set(key, { at: Date.now(), ttl, value });
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const json = (await response.json()) as Record<string, unknown>;
    return json;
  } catch {
    return null;
  }
}

async function findPost(slug: string): Promise<BlogPostOgSource | null> {
  const key = `post:${slug}`;
  const cached = readCache<BlogPostOgSource | null>(key);
  if (cached !== undefined) return cached;

  const base = apiBase();
  for (let page = 1; page <= 5; page += 1) {
    const json = await fetchJson(`${base}/api/blog.php?action=list&page=${page}&limit=50`);
    if (!json || json.success !== true || !Array.isArray(json.data)) {
      writeCache(key, null, MISS_TTL_MS);
      return null;
    }
    const found = (json.data as BlogPostOgSource[]).find((post) => post.slug === slug);
    if (found) {
      writeCache(key, found, API_TTL_MS);
      return found;
    }
    if (!json.hasMore) break;
  }
  writeCache(key, null, MISS_TTL_MS);
  return null;
}

async function latestCover(): Promise<{ ok: true; cover: string | null } | { ok: false }> {
  const key = 'blog-index-cover';
  const cached = readCache<{ ok: true; cover: string | null } | { ok: false }>(key);
  if (cached !== undefined) return cached;
  const json = await fetchJson(`${apiBase()}/api/blog.php?action=list&page=1&limit=1`);
  if (!json || json.success !== true || !Array.isArray(json.data)) {
    const miss = { ok: false as const };
    writeCache(key, miss, MISS_TTL_MS);
    return miss;
  }
  const cover = (json.data[0] as BlogPostOgSource | undefined)?.cover_image || null;
  const hit = { ok: true as const, cover };
  writeCache(key, hit, API_TTL_MS);
  return hit;
}

let template: { at: number; html: string } | null = null;

async function indexTemplate(request: Request): Promise<string | null> {
  if (template && Date.now() - template.at < TEMPLATE_TTL_MS) return template.html;
  try {
    const headers = new Headers({
      accept: 'text/html',
      'user-agent': 'Mozilla/5.0',
    });
    const cookie = request.headers.get('cookie');
    if (cookie) headers.set('cookie', cookie);
    const bypass =
      request.headers.get('x-vercel-protection-bypass') ||
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypass) headers.set('x-vercel-protection-bypass', bypass);

    const indexUrl = new URL('/index.html', request.url);
    const share = new URL(request.url).searchParams.get('_vercel_share');
    if (share) indexUrl.searchParams.set('_vercel_share', share);

    const response = await fetch(indexUrl, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return template?.html ?? null;
    const html = await response.text();
    if (!html.includes('id="root"')) return template?.html ?? null;
    template = { at: Date.now(), html };
    return html;
  } catch {
    return template?.html ?? null;
  }
}

const MINIMAL_SHELL = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Donchaminade | Développeur Web &amp; Mobile Full-Stack</title>
  <meta name="description" content="Portfolio Donchaminade">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Donchaminade">
  <meta property="og:url" content="https://donchaminade-alpha.vercel.app">
  <meta property="og:title" content="Donchaminade | Développeur Web &amp; Mobile Full-Stack">
  <meta property="og:description" content="Portfolio Donchaminade">
  <meta property="og:image" content="https://donchaminade-alpha.vercel.app/og-share.jpg">
  <meta property="og:image:secure_url" content="https://donchaminade-alpha.vercel.app/og-share.jpg">
  <meta property="og:image:alt" content="Donchaminade">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1445">
  <meta property="og:image:height" content="890">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Donchaminade | Développeur Web &amp; Mobile Full-Stack">
  <meta name="twitter:description" content="Portfolio Donchaminade">
  <meta name="twitter:image" content="https://donchaminade-alpha.vercel.app/og-share.jpg">
</head>
<body></body>
</html>`;

function htmlResponse(html: string, variant: string, ttl: number): Response {
  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=86400`,
      vary: 'User-Agent',
      'x-blog-og': variant,
    },
  });
}

export default async function middleware(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  const userAgent = request.headers.get('user-agent');
  if (!isSocialCrawler(userAgent)) return next();

  const url = new URL(request.url);
  const route = matchBlogRoute(url.pathname);
  if (route.kind === 'skip') return next();

  const shell = (await indexTemplate(request)) ?? MINIMAL_SHELL;

  const origin = url.origin;
  const api = apiBase();

  try {
    if (route.kind === 'index') {
      const listed = await latestCover();
      if (!listed.ok) return htmlResponse(shell, 'fallback', 60);
      const meta = blogIndexOgMeta(origin, api, listed.cover);
      return htmlResponse(applyOgMeta(shell, meta), 'blog', 600);
    }

    const post = await findPost(route.slug);
    if (!post?.title) {
      return htmlResponse(shell, 'fallback', 60);
    }
    const meta = articleOgMeta(post, origin, api);
    return htmlResponse(applyOgMeta(shell, meta), 'article', 600);
  } catch {
    return htmlResponse(shell, 'fallback', 60);
  }
}
