import {
  getCanonicalShareUrl,
  getSharePreviewImageUrl,
  SHARE_PREVIEW_HEIGHT,
  SHARE_PREVIEW_WIDTH,
} from './ogImage';

const SITE_NAME = 'Donchaminade';

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Balises sociales — même preview pour /, sans slash, ou #apropos */
export function applyPortfolioSeo(profile: {
  full_name?: string;
  bio?: string;
  hero_title?: string;
} | null): void {
  const siteUrl = getCanonicalShareUrl(
    (import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin
  );
  const pageUrl = getCanonicalShareUrl(window.location.href);
  const title = profile?.full_name
    ? `${profile.full_name} — Développeur Web & Mobile`
    : 'Donchaminade | Développeur Web & Mobile Full-Stack';
  const description =
    profile?.bio?.trim() ||
    'Portfolio de ADJOLOU Dondah Chaminade — développeur web & mobile. Solutions digitales sur mesure.';
  const image = getSharePreviewImageUrl(siteUrl);

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:secure_url', image);
  setMeta('property', 'og:image:type', 'image/jpeg');
  setMeta('property', 'og:image:width', String(SHARE_PREVIEW_WIDTH));
  setMeta('property', 'og:image:height', String(SHARE_PREVIEW_HEIGHT));
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
}
