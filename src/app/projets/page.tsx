import type { Metadata } from 'next';
import { ProjectsPage } from '@/components/InnerPages';

export const metadata: Metadata = { title: 'Projets — Chaminade.dev' };
export default function Page() { return <ProjectsPage />; }
