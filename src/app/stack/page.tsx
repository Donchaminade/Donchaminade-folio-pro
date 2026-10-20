import type { Metadata } from 'next';
import { StackPage } from '@/components/InnerPages';

export const metadata: Metadata = { title: 'Stack — Chaminade.dev' };
export default function Page() { return <StackPage />; }
