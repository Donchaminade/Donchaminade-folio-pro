import path from 'path';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const PHP_LOCAL = 'http://localhost/donchaminade-d%C3%A9veloppeur-web';

/** Photo de profil pour og:image (build Vercel → aperçu WhatsApp du lien frontend). */
async function resolveOgImage(apiUrl: string, explicit?: string): Promise<string> {
  if (explicit?.trim()) return explicit.trim();
  try {
    const res = await fetch(`${apiUrl}/api/index.php?resource=profile`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { data?: { photo_path?: string } };
    const path = json?.data?.photo_path?.trim();
    if (path) {
      let normalized = path.startsWith('/') ? path : `/${path}`;
      if (normalized.startsWith('/uploads/') && !normalized.startsWith('/public/')) {
        normalized = `/public${normalized}`;
      }
      return `${apiUrl}${normalized}`;
    }
  } catch {
    // fallback ci-dessous
  }
  return `${apiUrl}/public/gallerie/pypicture.jpg`;
}

/** Copie public/ vers dist/ sans uploads/ (médias servis par l'API Hostinger). */
function copyPublicWithoutUploads() {
  return {
    name: 'copy-public-without-uploads',
    closeBundle() {
      const publicDir = join(__dirname, 'public');
      const outDir = join(__dirname, 'dist');
      if (!existsSync(publicDir)) return;
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      for (const name of readdirSync(publicDir)) {
        if (name === 'uploads') continue;
        cpSync(join(publicDir, name), join(outDir, name), { recursive: true });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const siteUrl = (env.VITE_SITE_URL || 'https://donchaminade-alpha.vercel.app').replace(/\/$/, '');
    const apiUrl = (env.VITE_API_URL || 'https://donchamfolio.grosbit.com').replace(/\/$/, '');
    const ogImage = env.VITE_OG_IMAGE || `${apiUrl}/public/gallerie/pypicture.jpg`;

    return {
      publicDir: false,
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Dev local : le front (3000) appelle l'API XAMPP sans CORS
        proxy: {
          '/api': { target: PHP_LOCAL, changeOrigin: true },
          '/uploads': { target: PHP_LOCAL, changeOrigin: true, rewrite: (p) => `/public${p}` },
        },
      },
      plugins: [
        react(),
        copyPublicWithoutUploads(),
        {
          name: 'inject-og-meta',
          async transformIndexHtml(html) {
            const ogImage = await resolveOgImage(apiUrl, resolvedOgImage);
            return html
              .replaceAll('__SITE_URL__', siteUrl)
              .replaceAll('__OG_IMAGE__', ogImage);
          },
        },
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
