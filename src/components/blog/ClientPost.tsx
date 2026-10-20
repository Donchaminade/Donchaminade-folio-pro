'use client';
import { useEffect, useState } from 'react';
import { Post, getPost, getPreview } from '@/lib/blog';
import { useI18n } from '@/lib/i18n';
import { BlogArticle } from './BlogViews';

export default function ClientPost({ mode }: { mode: 'slug' | 'preview' }) {
  const { t } = useI18n();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const parts = location.pathname.split('/').filter(Boolean);
    const key = q.get(mode === 'slug' ? 'slug' : 'token') || (parts[parts.length - 1] !== 'article' && parts[parts.length - 1] !== 'preview' ? parts[parts.length - 1] : '');
    if (!key) { setPost(null); return; }
    (mode === 'slug' ? getPost(key) : getPreview(key)).then(setPost);
  }, [mode]);
  if (post === undefined) return <main className="wrap pt-32 text-base text-mist">{t.loadingArticle}</main>;
  if (!post) return <main className="wrap pt-32"><h1 className="font-display text-4xl font-black uppercase">{t.missingArticle}</h1><a href="/blog" className="label mt-6 inline-flex min-h-11 items-center">{t.backBlog}</a></main>;
  return <BlogArticle post={post} preview={mode === 'preview' || !!post.is_preview} />;
}
