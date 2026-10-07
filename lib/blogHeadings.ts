import { mediaUrl } from './media';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export type PlainBlock =
  | { key: number; kind: 'h2' | 'h3'; text: string; id: string }
  | { key: number; kind: 'quote' | 'p'; text: string };

export type PreparedBlogBody =
  | { format: 'plain'; blocks: PlainBlock[]; items: TocItem[] }
  | { format: 'html'; markup: { __html: string }; items: TocItem[] };

export function slugifyHeading(text: string, used: Set<string>): string {
  let base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  if (!base) base = 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

export function isPlainBlogText(content: string): boolean {
  return content !== '' && !/<[a-z][\s\S]*>/i.test(content.trim());
}

function annotateHtml(html: string): { html: string; items: TocItem[] } {
  if (typeof DOMParser === 'undefined') {
    return { html, items: [] };
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items: TocItem[] = [];
  const used = new Set<string>();
  doc.body.querySelectorAll('h2, h3').forEach((el) => {
    const text = el.textContent?.trim() || '';
    if (!text) return;
    const level: 2 | 3 = el.tagName === 'H2' ? 2 : 3;
    const id = slugifyHeading(text, used);
    el.id = id;
    items.push({ id, text, level });
  });
  return { html: doc.body.innerHTML, items };
}

function rewriteContentImages(html: string): string {
  return html.replace(/<img\b([^>]*?)>/gi, (tag, attrs: string) => {
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
    if (!srcMatch) return tag;
    const rawSrc = srcMatch[1].replace(/^\/public(\/uploads\/)/i, '$1');
    const url = mediaUrl(rawSrc);
    let next = attrs.replace(/\ssrc=["'][^"']+["']/i, ` src="${url}"`);
    if (!/loading=/i.test(next)) next += ' loading="lazy"';
    if (!/decoding=/i.test(next)) next += ' decoding="async"';
    if (!/referrerpolicy=/i.test(next) && /^https?:\/\//i.test(url)) {
      next += ' referrerpolicy="no-referrer"';
    }
    return `<img${next}>`;
  });
}

function preparePlain(content: string): PreparedBlogBody {
  const blocks: PlainBlock[] = [];
  const items: TocItem[] = [];
  const used = new Set<string>();
  content.split(/\n\s*\n/).forEach((block, key) => {
    const trimmed = block.trim();
    const h3 = trimmed.match(/^###\s+(.+)$/);
    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h3) {
      const text = h3[1].trim();
      const id = slugifyHeading(text, used);
      blocks.push({ key, kind: 'h3', text, id });
      items.push({ id, text, level: 3 });
      return;
    }
    if (h2) {
      const text = h2[1].trim();
      const id = slugifyHeading(text, used);
      blocks.push({ key, kind: 'h2', text, id });
      items.push({ id, text, level: 2 });
      return;
    }
    if (trimmed.startsWith('> ')) {
      blocks.push({ key, kind: 'quote', text: trimmed.replace(/^>\s?/gm, '') });
      return;
    }
    blocks.push({ key, kind: 'p', text: trimmed });
  });
  return { format: 'plain', blocks, items };
}

/** HTML prêt à rendre : images réécrites et ids stables sur les h2/h3. */
export function prepareBlogBody(content: string): PreparedBlogBody {
  if (isPlainBlogText(content)) return preparePlain(content);
  const annotated = annotateHtml(rewriteContentImages(content));
  return {
    format: 'html',
    markup: { __html: annotated.html },
    items: annotated.items,
  };
}

export function blogStickyOffset(): number {
  const header = document.querySelector<HTMLElement>('.blog-page > header');
  return (header?.offsetHeight || 72) + 16;
}

export function scrollToBlogHeading(el: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
  const top = window.scrollY + el.getBoundingClientRect().top - blogStickyOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function readLocationHeadingId(): string {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function pushHeadingHash(id: string): void {
  const next = `#${id}`;
  if (window.location.hash === next) return;
  const url = `${window.location.pathname}${window.location.search}${next}`;
  window.history.pushState(null, '', url);
}
