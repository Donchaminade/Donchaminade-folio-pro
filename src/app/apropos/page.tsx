import type { Metadata } from 'next';
import { AboutPage } from '@/components/InnerPages';

export const metadata: Metadata = { title: 'À propos — Chaminade.dev' };
export default function Page() { return <AboutPage />; }
