import type { Metadata } from 'next';
import { listPosts } from '@/lib/blog';
import { BlogList } from '@/components/blog/BlogViews';

export const metadata: Metadata = { title: 'Blog — Chaminade ADJOLOU' };
export default async function Page() { return <BlogList posts={await listPosts()} />; }
