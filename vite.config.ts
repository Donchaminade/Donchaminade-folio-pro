import path from 'path';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleViteChat } from './lib/chat/devMiddleware';

const PHP_LOCAL = 'http://localhost/donchaminade-d%C3%A9veloppeur-web';
const SHARE_PREVIEW_IMAGE = '/og-share.jpg';

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
    const ogImage = env.VITE_OG_IMAGE?.trim() || `${siteUrl}${SHARE_PREVIEW_IMAGE}`;

    return {
      publicDir: false,
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: PHP_LOCAL,
            changeOrigin: true,
            bypass(req) {
              if (req.url?.split('?')[0] === '/api/chat') return req.url;
            },
          },
          '/uploads': { target: PHP_LOCAL, changeOrigin: true, rewrite: (p) => `/public${p}` },
        },
      },
      plugins: [
        {
          name: 'portfolio-chat-dev',
          configureServer(server) {
            process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
            process.env.GOOGLE_GENERATIVE_AI_API_KEY ||= env.GOOGLE_GENERATIVE_AI_API_KEY;
            process.env.GEMINI_API_KEY ||= env.GEMINI_API_KEY;
            process.env.PORTFOLIO_API_URL ||= env.PORTFOLIO_API_URL || env.VITE_API_URL;
            server.middlewares.use(async (req, res, next) => {
              if (req.url?.split('?')[0] === '/api/chat') {
                try {
                  await handleViteChat(req, res);
                } catch (error) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Chat error' }));
                }
                return;
              }
              next();
            });
          },
        },
        react(),
        copyPublicWithoutUploads(),
        {
          name: 'inject-og-meta',
          transformIndexHtml(html) {
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
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
