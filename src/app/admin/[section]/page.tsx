import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SectionView from '@/components/admin/SectionView';
import { adminSectionIds, type AdminSectionId } from '@/lib/admin-copy';

export function generateStaticParams() {
  return adminSectionIds.map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  return { title: `${params.section} — Admin` };
}

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  if (!adminSectionIds.includes(params.section as AdminSectionId)) notFound();
  return <SectionView section={params.section as AdminSectionId} />;
}
