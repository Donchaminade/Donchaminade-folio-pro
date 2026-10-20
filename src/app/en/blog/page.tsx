import type { Metadata } from 'next';
import { listCategories, listPosts } from '@/lib/blog';
import { BlogList } from '@/components/blog/BlogViews';

export const metadata: Metadata = { title: 'Blog — Chaminade.dev' };
export default async function Page() {
  const [posts, categories] = await Promise.all([listPosts(), listCategories()]);
  return <BlogList posts={posts} categories={categories} />;
}
