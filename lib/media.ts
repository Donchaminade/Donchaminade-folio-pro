import { getApiBase } from './api';

/**
 * URL absolue pour médias uploadés sur le serveur PHP (images, PDF).
 * Sur Vercel, les fichiers sont servis depuis l'API, pas depuis le build statique.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  let normalized = path.trim();
  // URLs externes (Unsplash, CDN…) : ne jamais réécrire
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }
  normalized = normalized.startsWith('/') ? normalized : `/${normalized}`;
  if (normalized.startsWith('/public/uploads/')) {
    normalized = normalized.slice('/public'.length);
  }
  const base = getApiBase();
  return base ? `${base}${normalized}` : normalized;
}
