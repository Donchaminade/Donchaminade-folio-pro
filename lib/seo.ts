import { mediaUrl } from './media';

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

/** Met à jour les balises sociales quand le profil API est chargé (complète index.html). */
export function applyPortfolioSeo(profile: {
  full_name?: string;
  bio?: string;
  photo_path?: string;
  hero_title?: string;
} | null): void {
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || window.location.origin;
  const title = profile?.full_name
    ? `${profile.full_name} — Développeur Web & Mobile`
    : 'Donchaminade | Développeur Web & Mobile Full-Stack';
  const description =
    profile?.bio?.trim() ||
    'Portfolio de ADJOLOU Dondah Chaminade — développeur web & mobile. Solutions digitales sur mesure.';
  const image = mediaUrl(profile?.photo_path) || `${siteUrl}/pypicture.png`;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:url', `${siteUrl}/`);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:secure_url', image);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
}
