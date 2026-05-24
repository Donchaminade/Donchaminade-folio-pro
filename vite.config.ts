import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const PHP_LOCAL = 'http://localhost/donchaminade-d%C3%A9veloppeur-web';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Dev local : le front (3000) appelle l'API XAMPP sans CORS
        proxy: {
          '/api': { target: PHP_LOCAL, changeOrigin: true },
          '/uploads': { target: PHP_LOCAL, changeOrigin: true, rewrite: (p) => `/public${p}` },
        },
      },
      plugins: [react()],
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
