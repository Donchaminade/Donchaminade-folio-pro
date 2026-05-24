/**
 * Crawlers sociaux → page OG PHP (même image preview pour toutes les URLs du front).
 */
const BOT_UA =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Googlebot-Image|bingbot/i;

const API_BASE = process.env.VITE_API_URL?.replace(/\/$/, '') || 'https://donchamfolio.grosbit.com';
const SITE_URL =
  process.env.VITE_SITE_URL?.replace(/\/$/, '') || 'https://donchaminade-alpha.vercel.app';

export const config = {
  matcher: ['/((?!image\\.png|favicon\\.png|assets|api|.*\\..*).*)'],
};

export default function middleware(request: Request): Response | undefined {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) {
    return undefined;
  }

  const { pathname } = new URL(request.url);
  if (pathname === '/image.png' || pathname === '/favicon.png') {
    return undefined;
  }

  const ogPage = new URL(`${API_BASE}/share/portfolio.php`);
  ogPage.searchParams.set('from', `${SITE_URL}${pathname}`);
  return Response.redirect(ogPage.toString(), 302);
}
