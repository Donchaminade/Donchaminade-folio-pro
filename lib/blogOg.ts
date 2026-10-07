import { absoluteMediaUrl } from './mediaUrl';

export const DEFAULT_API_BASE = 'https://donchamfolio.grosbit.com';
export const DEFAULT_SITE_ORIGIN = 'https://donchaminade-alpha.vercel.app';
export const TWITTER_HANDLE = '@Donchaminade';
export const SITE_NAME = 'Donchaminade';
export const DEFAULT_OG_PATH = '/og-share.jpg';

const CRAWLER_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|Pinterest|redditbot|Applebot|Googlebot|bingbot|Embedly|Iframely|vkShare|Quora Link Preview/i;

export function isSocialCrawler(userAgent: string | null | undefined): boolean {
  return CRAWLER_UA.test(userAgent || '');
}

export type BlogRoute =
  | { kind: 'index' }
  | { kind: 'post'; slug: string }
  | { kind: 'skip' };

export function matchBlogRoute(pathname: string): BlogRoute {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/blog') return { kind: 'index' };
  const match = path.match(/^\/blog\/([^/]+)$/);
  if (!match) return { kind: 'skip' };
  let slug = match[1];
  try {
    slug = decodeURIComponent(slug);
  } catch {
    return { kind: 'skip' };
  }
  if (slug === 'preview' || !/^[a-z0-9-]+$/i.test(slug)) return { kind: 'skip' };
  return { kind: 'post', slug };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** "2026-10-06 11:32:14" → "2026-10-06T11:32:14" */
export function toPublishedIso(value: string | null | undefined): string {
  const raw = (value || '').trim();
  if (!raw) return '';
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const date = new Date(normalized.includes('Z') || /[+-]\d{2}:\d{2}$/.test(normalized) ? normalized : `${normalized}Z`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export interface OgMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'article' | 'website';
  publishedTime?: string;
  imageAlt: string;
  imageType?: string;
}

export interface BlogPostOgSource {
  slug: string;
  title?: string;
  excerpt?: string;
  cover_image?: string;
  published_at?: string;
}

export function coverImageUrl(cover: string | null | undefined, apiBase: string, fallback: string): string {
  const absolute = absoluteMediaUrl(cover, apiBase);
  if (/^https:\/\//i.test(absolute)) return absolute;
  return fallback;
}

export function imageMime(url: string): string {
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export function articleOgMeta(
  post: BlogPostOgSource,
  origin: string,
  apiBase: string
): OgMeta {
  const site = origin.replace(/\/$/, '');
  const title = (post.title || 'Article').trim();
  const description = (post.excerpt || '').trim() || `${title} — article publié sur le blog ${SITE_NAME}.`;
  const fallback = `${site}${DEFAULT_OG_PATH}`;
  const image = coverImageUrl(post.cover_image, apiBase, fallback);
  const publishedTime = toPublishedIso(post.published_at);
  return {
    title,
    description,
    image,
    url: `${site}/blog/${encodeURIComponent(post.slug)}`,
    type: 'article',
    publishedTime: publishedTime || undefined,
    imageAlt: title,
    imageType: imageMime(image),
  };
}

export function blogIndexOgMeta(
  origin: string,
  apiBase: string,
  latestCover?: string | null
): OgMeta {
  const site = origin.replace(/\/$/, '');
  const fallback = `${site}${DEFAULT_OG_PATH}`;
  return {
    title: `Blog — ${SITE_NAME}`,
    description:
      'Notes et analyses de Donchaminade : développement web et mobile, outils, et retours de terrain.',
    image: coverImageUrl(latestCover, apiBase, fallback),
    url: `${site}/blog`,
    type: 'website',
    imageAlt: `Blog ${SITE_NAME}`,
    imageType: imageMime(coverImageUrl(latestCover, apiBase, fallback)),
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertMeta(html: string, attr: 'property' | 'name', key: string, content: string): string {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}">`;
  const keyRe = escapeRegex(key);
  const patterns = [
    new RegExp(
      `<meta\\s+${attr}\\s*=\\s*["']${keyRe}["']\\s+content\\s*=\\s*["'][\\s\\S]*?["']\\s*/?>`,
      'i'
    ),
    new RegExp(
      `<meta\\s+content\\s*=\\s*["'][\\s\\S]*?["']\\s+${attr}\\s*=\\s*["']${keyRe}["']\\s*/?>`,
      'i'
    ),
  ];
  for (const pattern of patterns) {
    if (pattern.test(html)) return html.replace(pattern, tag);
  }
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function removeMeta(html: string, attr: 'property' | 'name', key: string): string {
  const keyRe = escapeRegex(key);
  const patterns = [
    new RegExp(
      `[ \\t]*<meta\\s+${attr}\\s*=\\s*["']${keyRe}["']\\s+content\\s*=\\s*["'][\\s\\S]*?["']\\s*/?>\\n?`,
      'i'
    ),
    new RegExp(
      `[ \\t]*<meta\\s+content\\s*=\\s*["'][\\s\\S]*?["']\\s+${attr}\\s*=\\s*["']${keyRe}["']\\s*/?>\\n?`,
      'i'
    ),
  ];
  return patterns.reduce((next, pattern) => next.replace(pattern, ''), html);
}

export function applyOgMeta(html: string, meta: OgMeta): string {
  const documentTitle = meta.type === 'article' ? `${meta.title} — ${SITE_NAME}` : meta.title;
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(documentTitle)}</title>`);
  next = upsertMeta(next, 'name', 'description', meta.description);
  next = upsertMeta(next, 'property', 'og:type', meta.type);
  next = upsertMeta(next, 'property', 'og:site_name', SITE_NAME);
  next = upsertMeta(next, 'property', 'og:url', meta.url);
  next = upsertMeta(next, 'property', 'og:title', meta.title);
  next = upsertMeta(next, 'property', 'og:description', meta.description);
  next = upsertMeta(next, 'property', 'og:image', meta.image);
  next = upsertMeta(next, 'property', 'og:image:secure_url', meta.image);
  next = upsertMeta(next, 'property', 'og:image:alt', meta.imageAlt);
  next = upsertMeta(next, 'property', 'og:locale', 'fr_FR');
  if (meta.imageType) next = upsertMeta(next, 'property', 'og:image:type', meta.imageType);
  if (meta.image.endsWith(DEFAULT_OG_PATH)) {
    next = upsertMeta(next, 'property', 'og:image:width', '1445');
    next = upsertMeta(next, 'property', 'og:image:height', '890');
  } else {
    next = removeMeta(next, 'property', 'og:image:width');
    next = removeMeta(next, 'property', 'og:image:height');
  }
  if (meta.publishedTime) {
    next = upsertMeta(next, 'property', 'article:published_time', meta.publishedTime);
  }
  next = upsertMeta(next, 'name', 'twitter:card', 'summary_large_image');
  next = upsertMeta(next, 'name', 'twitter:site', TWITTER_HANDLE);
  next = upsertMeta(next, 'name', 'twitter:creator', TWITTER_HANDLE);
  next = upsertMeta(next, 'name', 'twitter:title', meta.title);
  next = upsertMeta(next, 'name', 'twitter:description', meta.description);
  next = upsertMeta(next, 'name', 'twitter:image', meta.image);
  const canonical = `<link rel="canonical" href="${escapeHtml(meta.url)}">`;
  if (/<link\s+rel=["']canonical["']/i.test(next)) {
    next = next.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonical);
  } else {
    next = next.replace(/<\/head>/i, `    ${canonical}\n  </head>`);
  }
  return next;
}
