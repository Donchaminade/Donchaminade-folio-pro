import type { Metadata } from 'next';
import { getPost, listPosts, media } from '@/lib/blog';
import { BlogArticle } from '@/components/blog/BlogViews';
import ClientPost from '@/components/blog/ClientPost';

export const dynamicParams = false;
export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: 'article' }];
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPost(params.slug);
  if (!p) return { title: 'Blog — Chaminade ADJOLOU' };
  return { title: `${p.title} — Chaminade ADJOLOU`, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, images: p.cover_image ? [media(p.cover_image)] : [] } };
}
export default async function Page({ params }: { params: { slug: string } }) {
  const p = await getPost(params.slug);
  return p ? <BlogArticle post={p} /> : <ClientPost mode="slug" />;
}
