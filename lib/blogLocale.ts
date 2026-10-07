import { enText, looksFrench } from './enText';

function readableSlug(slug?: string): string {
  if (!slug) return '';
  const title = slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return looksFrench(title) ? '' : title;
}

export function hasEnglishVersion(post: { has_english?: number | string | boolean; content_en?: string | null }): boolean {
  if (typeof post.has_english === 'number') return post.has_english === 1;
  if (typeof post.has_english === 'boolean') return post.has_english;
  if (typeof post.has_english === 'string') return post.has_english === '1';
  return Boolean((post.content_en || '').replace(/<[^>]+>/g, '').trim());
}

export function blogCopy(
  lang: 'fr' | 'en',
  post: { title: string; slug?: string; excerpt?: string; content?: string; title_en?: string; excerpt_en?: string; content_en?: string; has_english?: number | string | boolean }
): { title: string; excerpt: string; content: string; frenchOnly: boolean } {
  if (lang !== 'en') {
    return { title: post.title, excerpt: post.excerpt || '', content: post.content || '', frenchOnly: false };
  }
  const title = enText(post.title, post.title_en) || readableSlug(post.slug);
  if (!hasEnglishVersion(post)) {
    return { title, excerpt: '', content: '', frenchOnly: true };
  }
  return {
    title,
    excerpt: enText(post.excerpt || '', post.excerpt_en),
    content: post.content_en || '',
    frenchOnly: false,
  };
}
