/**
 * Redirige les crawlers sociaux (WhatsApp, Facebook…) vers la page PHP
 * qui expose les balises Open Graph avec la photo de profil à jour.
 */
const BOT_UA =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Googlebot-Image|bingbot/i;

const API_BASE = process.env.VITE_API_URL?.replace(/\/$/, '') || 'https://donchamfolio.grosbit.com';
const SITE_URL =
  process.env.VITE_SITE_URL?.replace(/\/$/, '') || 'https://donchaminade-alpha.vercel.app';

export const config = {
  matcher: ['/', '/blog/:slug*'],
};

export default function middleware(request: Request): Response | undefined {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) {
    return undefined;
  }

  const { pathname } = new URL(request.url);

  if (pathname === '/' || pathname === '') {
    const ogPage = new URL(`${API_BASE}/share/portfolio.php`);
    ogPage.searchParams.set('from', SITE_URL);
    return Response.redirect(ogPage.toString(), 302);
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    return Response.redirect(`${API_BASE}/blog/share.php?slug=${encodeURIComponent(slug)}`, 302);
  }

  return undefined;
}
