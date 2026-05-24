/** Image unique pour tous les aperçus de partage (WhatsApp, Facebook, etc.) */
export const SHARE_PREVIEW_IMAGE = '/og-share.jpg';

/** Dimensions de public/og-share.jpg (généré depuis image.png) */
export const SHARE_PREVIEW_WIDTH = 1445;
export const SHARE_PREVIEW_HEIGHT = 890;

export function getSharePreviewImageUrl(siteUrl?: string): string {
  const explicit = (import.meta.env.VITE_OG_IMAGE as string | undefined)?.trim();
  if (explicit) return explicit;

  const base =
    siteUrl?.replace(/\/$/, '') ||
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://donchaminade-alpha.vercel.app');

  return `${base}${SHARE_PREVIEW_IMAGE}`;
}
