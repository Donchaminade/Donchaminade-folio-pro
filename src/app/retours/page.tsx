import type { Metadata } from 'next';
import { Proof } from '@/components/Proof';

export const metadata: Metadata = { title: 'Retours — Chaminade.dev' };

export default function Page() {
  return <Proof page />;
}
