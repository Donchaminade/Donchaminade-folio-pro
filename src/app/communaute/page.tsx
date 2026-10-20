import type { Metadata } from 'next';
import { CommunityPage } from '@/components/InnerPages';

export const metadata: Metadata = { title: 'Communauté — Chaminade.dev' };
export default function Page() { return <CommunityPage />; }
