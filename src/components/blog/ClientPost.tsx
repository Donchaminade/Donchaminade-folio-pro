'use client';
import { useEffect, useState } from 'react';
import { Post, getPost, getPreview } from '@/lib/blog';
import { BlogArticle } from './BlogViews';

export default function ClientPost({ mode }: { mode: 'slug' | 'preview' }) {
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const parts = location.pathname.split('/').filter(Boolean);
    const key = q.get(mode === 'slug' ? 'slug' : 'token') || (parts[parts.length - 1] !== 'article' && parts[parts.length - 1] !== 'preview' ? parts[parts.length - 1] : '');
    if (!key) { setPost(null); return; }
    (mode === 'slug' ? getPost(key) : getPreview(key)).then(setPost);
  }, [mode]);
  if (post === undefined) return <main className="mx-auto max-w-3xl px-5 py-24 opacity-70">Chargement…</main>;
  if (!post) return <main className="mx-auto max-w-3xl px-5 py-24"><h1 className="text-3xl font-black">Article introuvable</h1><a href="/blog" className="label mt-6 inline-block">← Blog</a></main>;
  return <BlogArticle post={post} />;
}
