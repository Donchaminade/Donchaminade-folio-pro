export const API = 'https://donchamfolio.grosbit.com/api/blog.php';
export const MEDIA = 'https://donchamfolio.grosbit.com/public';

export type BlogComment = {
  id: number;
  name: string;
  content: string;
  created_at?: string;
  replies?: BlogComment[];
};

export type Post = {
  slug: string; title: string; excerpt?: string; content?: string; category?: string;
  cover_image?: string; reading_time?: string | number; published_at?: string;
  title_en?: string; excerpt_en?: string; content_en?: string;
  likes_count?: number; liked?: boolean; comments?: BlogComment[]; comments_count?: number;
  shares_count?: number; share_url?: string; is_preview?: boolean;
};

export type BlogCategory = { slug: string; label: string; label_en?: string; emoji?: string };

export function localized(post: Post, lang: 'fr' | 'en') {
  const english = (post.content_en || '').replace(/<[^>]+>/g, '').trim();
  if (lang === 'en' && !english) {
    return { title: post.title_en || post.title, excerpt: '', content: '', frenchOnly: true };
  }
  if (lang === 'en') {
    return { title: post.title_en || post.title, excerpt: post.excerpt_en || post.excerpt || '', content: post.content_en || '', frenchOnly: false };
  }
  return { title: post.title, excerpt: post.excerpt || '', content: post.content || '', frenchOnly: false };
}

export function headingIds(html: string): { html: string; items: { id: string; text: string; level: 2 | 3 }[] } {
  const items: { id: string; text: string; level: 2 | 3 }[] = [];
  const used = new Set<string>();
  const next = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_full, level: string, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!text) return _full;
    let base = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'section';
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    items.push({ id, text, level: Number(level) as 2 | 3 });
    const clean = attrs.replace(/\s+id=(["']).*?\1/i, '');
    return `<h${level}${clean} id="${id}">${inner}</h${level}>`;
  });
  return { html: next, items };
}

export function media(src?: string): string {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) return src;
  return MEDIA + (src.startsWith('/public/') ? src.slice(7) : src.startsWith('/') ? src : '/' + src);
}

export function fixHtml(html = ''): string {
  return html.replace(/(src|href)=(["'])(\/(?:public\/)?uploads\/[^"']+)\2/g, (_m, a, q, p) => `${a}=${q}${media(p)}${q}`);
}

async function get(qs: string): Promise<any> {
  try {
    const r = await fetch(`${API}?${qs}`);
    if (!r.ok) return null;
    const j = await r.json();
    return j?.success ? j.data : null;
  } catch { return null; }
}

export async function listPosts(): Promise<Post[]> {
  const all: Post[] = [];
  for (let page = 1; page <= 20; page++) {
    const data = await get(`action=list&limit=50&page=${page}`);
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < 50) break;
  }
  return all;
}
export const getPost = (slug: string) => get(`action=post&slug=${encodeURIComponent(slug)}`) as Promise<Post | null>;
export const getPreview = (token: string) => get(`action=preview&token=${encodeURIComponent(token)}`) as Promise<Post | null>;

export async function listCategories(): Promise<BlogCategory[]> {
  const data = await get('action=categories');
  return Array.isArray(data) ? data as BlogCategory[] : [];
}

async function postJson(body: Record<string, unknown>) {
  const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j?.success === false) throw new Error(j?.error || j?.message || 'api');
  return j;
}

export async function toggleLike(slug: string): Promise<{ liked: boolean; likes_count: number }> {
  const j = await postJson({ action: 'like', slug });
  return j.data as { liked: boolean; likes_count: number };
}

export async function postComment(slug: string, name: string, content: string, email?: string): Promise<{ message: string; comments: BlogComment[]; comments_count: number }> {
  const j = await postJson({ action: 'comment', slug, name, content, email: email || undefined });
  return { message: j.message as string, comments: (j.data?.comments || []) as BlogComment[], comments_count: Number(j.data?.comments_count || 0) };
}
