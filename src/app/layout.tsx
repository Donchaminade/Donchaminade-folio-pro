import type { Metadata } from 'next';
import '@fontsource/archivo/800.css';
import '@fontsource/archivo/900.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chaminade ADJOLOU — Portfolio',
  description: 'Développeur Web & Mobile. Ingénieur IT passionné, je conçois et déploie des solutions numériques sur mesure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
