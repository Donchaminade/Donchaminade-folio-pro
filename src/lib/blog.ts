export const API = 'https://donchamfolio.grosbit.com/api/blog.php';
export const MEDIA = 'https://donchamfolio.grosbit.com/public';

export type Post = {
  slug: string; title: string; excerpt?: string; content?: string; category?: string;
  cover_image?: string; reading_time?: string | number; published_at?: string;
  title_en?: string; excerpt_en?: string; content_en?: string;
};

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
