import type { Metadata } from 'next';
import { CareerPage } from '@/components/InnerPages';

export const metadata: Metadata = { title: 'Parcours — Chaminade.dev' };
export default function Page() { return <CareerPage />; }
