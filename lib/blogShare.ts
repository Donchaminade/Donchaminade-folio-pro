import { getApiBase, recordBlogShare, isApiConfigured } from './api';

export type SharePlatform = 'linkedin' | 'twitter' | 'facebook' | 'whatsapp' | 'copy' | 'email';

export const SHARE_PLATFORMS: {
  id: SharePlatform;
  label: string;
  shortLabel: string;
}[] = [
  { id: 'whatsapp', label: 'WhatsApp', shortLabel: 'WA' },
  { id: 'facebook', label: 'Facebook', shortLabel: 'FB' },
  { id: 'linkedin', label: 'LinkedIn', shortLabel: 'in' },
  { id: 'twitter', label: 'X / Twitter', shortLabel: 'X' },
  { id: 'email', label: 'Email', shortLabel: '@' },
  { id: 'copy', label: 'Copier le lien', shortLabel: '⎘' },
];

export function getBlogShareUrl(slug: string, shareUrl?: string): string {
  if (shareUrl) return shareUrl;
  if (typeof window === 'undefined') return '';
  const base = getApiBase();
  if (base) {
    return `${base}/blog/share.php?slug=${encodeURIComponent(slug)}`;
  }
  return `${window.location.origin}/blog/${slug}`;
}

export function openSharePlatform(platform: SharePlatform, title: string, url: string): void {
  const text = encodeURIComponent(title);
  const encoded = encodeURIComponent(url);

  const urls: Partial<Record<SharePlatform, string>> = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    whatsapp: `https://wa.me/?text=${text}%20${encoded}`,
    email: `mailto:?subject=${text}&body=${text}%0A%0A${encoded}`,
  };

  if (platform === 'copy') {
  } else if (urls[platform]) {
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  }
}

export async function shareBlogPost(
  platform: SharePlatform,
  slug: string,
  title: string,
  shareUrl?: string
): Promise<{ message: string; sharesCount?: number }> {
  const url = getBlogShareUrl(slug, shareUrl);

  if (platform === 'copy') {
    await navigator.clipboard.writeText(url);
    if (isApiConfigured()) {
      try {
        const sharesCount = await recordBlogShare(slug, platform);
        return { message: 'Lien copié !', sharesCount };
      } catch {
        return { message: 'Lien copié !' };
      }
    }
    return { message: 'Lien copié !' };
  }

  openSharePlatform(platform, title, url);

  if (isApiConfigured()) {
    try {
      const sharesCount = await recordBlogShare(slug, platform);
      return { message: 'Partagé !', sharesCount };
    } catch {
      return { message: 'Partagé !' };
    }
  }

  return { message: 'Partagé !' };
}
