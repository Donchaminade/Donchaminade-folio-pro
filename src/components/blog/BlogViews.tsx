import Link from 'next/link';
import { Post, media, fixHtml } from '@/lib/blog';

const date = (d?: string) => (d ? new Date(d.replace(' ', 'T') + 'Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-24">
      <Link href="/" className="label opacity-70 hover:opacity-100">← Accueil</Link>
      <h1 className="mt-6 text-5xl font-black tracking-tight">Blog</h1>
      {posts.length === 0 && <p className="mt-10 opacity-70">Les articles arrivent bientôt.</p>}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] hover:border-white/30">
            {p.cover_image && <img src={media(p.cover_image)} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
            <div className="p-5">
              <p className="label opacity-60">{p.category} · {date(p.published_at)}</p>
              <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:underline">{p.title}</h2>
              {p.excerpt && <p className="mt-2 line-clamp-3 text-sm opacity-70">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function BlogArticle({ post }: { post: Post }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24">
      <Link href="/blog" className="label opacity-70 hover:opacity-100">← Blog</Link>
      <p className="label mt-8 opacity-60">{post.category} · {date(post.published_at)}{post.reading_time ? ` · ${post.reading_time} min` : ''}</p>
      <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight">{post.title}</h1>
      {post.excerpt && <p className="mt-4 text-lg opacity-75">{post.excerpt}</p>}
      {post.cover_image && <img src={media(post.cover_image)} alt="" className="mt-10 w-full rounded-2xl" />}
      <article className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: fixHtml(post.content) }} />
    </main>
  );
}
