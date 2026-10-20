import type { Metadata } from 'next';
import ProfilePage from '@/components/ProfilePage';

export const metadata: Metadata = { title: 'Profil — Chaminade.dev' };
export default function Page() { return <ProfilePage />; }
