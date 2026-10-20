import type { Metadata } from 'next';
import Script from 'next/script';
import '@fontsource/archivo/800.css';
import '@fontsource/archivo/900.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';
import { Providers } from '@/lib/i18n';
import PortfolioChat from '@/components/PortfolioChat';

export const metadata: Metadata = {
  title: 'Chaminade ADJOLOU — Portfolio',
  description: 'Développeur Web & Mobile. Ingénieur IT passionné, je conçois et déploie des solutions numériques sur mesure.',
};

const boot = `(function(){try{var t=localStorage.getItem('theme');var l=localStorage.getItem('lang');var r=document.documentElement;r.dataset.theme=t==='light'?'light':'dark';r.lang=l==='en'?'en':'fr';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Script id="theme-boot" strategy="beforeInteractive">{boot}</Script>
        <Providers>
          {children}
          <PortfolioChat />
        </Providers>
      </body>
    </html>
  );
}
