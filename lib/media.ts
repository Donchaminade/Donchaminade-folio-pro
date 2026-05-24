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
  // Sur Hostinger/XAMPP, les fichiers sont sous public/uploads/ (racine = projet PHP)
  if (normalized.startsWith('/uploads/') && !normalized.startsWith('/public/')) {
    normalized = `/public${normalized}`;
  }
  const base = getApiBase();
  return base ? `${base}${normalized}` : normalized;
}
