'use client';
import { FormEvent, useMemo, useState } from 'react';
import { Heart, Send } from 'lucide-react';
import Link from 'next/link';
import { Heartbeat, MotionIcon } from '@/components/MotionIcon';
import { BlogCategory, BlogComment, Post, fixHtml, headingIds, localized, media, postComment, toggleLike } from '@/lib/blog';
import { useI18n } from '@/lib/i18n';

const dateOf = (d: string | undefined, lang: 'fr' | 'en') => (
  d ? new Date(d.replace(' ', 'T') + (d.includes('T') ? '' : 'Z')).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
);

function catLabel(categories: BlogCategory[], slug: string | undefined, lang: 'fr' | 'en') {
  const found = categories.find((c) => c.slug === slug);
  if (!found) return slug || '';
  return `${found.emoji ? `${found.emoji} ` : ''}${lang === 'en' ? (found.label_en || found.label) : found.label}`;
}

export function BlogList({ posts, categories }: { posts: Post[]; categories: BlogCategory[] }) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const filtered = useMemo(() => posts.filter((p) => {
    if (cat !== 'all' && p.category !== cat) return false;
    const blob = `${p.title} ${p.title_en || ''} ${p.excerpt || ''}`.toLowerCase();
    return blob.includes(q.trim().toLowerCase());
  }), [posts, q, cat]);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <article>
      <header className="wrap pb-8 pt-28 md:pt-36">
        <p className="label text-cream">Chaminade.dev</p>
        <h1 className="mt-3 font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6.5vw]">
          <span className="metal">{t.blogTitleBefore}</span>
          <span className="font-serif font-normal normal-case italic text-cream">{t.blogTitleEm}</span>
          <span className="metal">{t.blogTitleAfter}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">{t.blogLead}</p>
        <label className="mt-8 block max-w-xl">
          <span className="label text-white/50">{t.searchLabel}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder} className="mt-2 min-h-11 w-full rounded-full border border-white/15 bg-white/5 px-5 text-base outline-none focus:border-cream" />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setCat('all')} className={`min-h-11 rounded-full border px-4 text-base ${cat === 'all' ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>{t.filterAll}</button>
          {categories.map((c) => (
            <button key={c.slug} type="button" onClick={() => setCat(c.slug)} className={`min-h-11 rounded-full border px-4 text-base ${cat === c.slug ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>
              {catLabel(categories, c.slug, lang)}
            </button>
          ))}
        </div>
      </header>
      {posts.length === 0 && <p className="wrap text-base text-mist">{t.loadingPosts}</p>}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="wrap grid items-end gap-8 pb-12 md:grid-cols-2">
          <span className="block overflow-hidden rounded-3xl border border-white/10">
            {featured.cover_image ? <img src={media(featured.cover_image)} alt="" className="aspect-[16/10] w-full object-cover" /> : <span className="block aspect-[16/10] bg-white/5" />}
          </span>
          <span>
            <span className="label text-cream">{t.featured}</span>
            <span className="mt-3 block font-display text-4xl font-black uppercase leading-[.95] md:text-6xl">{localized(featured, lang).title}</span>
            <span className="mt-4 block text-base text-mist">{catLabel(categories, featured.category, lang)} · {dateOf(featured.published_at, lang)}</span>
          </span>
        </Link>
      )}
      <ul className="wrap grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-3xl border border-white/10">
              {p.cover_image && <img src={media(p.cover_image)} alt="" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03]" />}
              <span className="block p-5">
                <span className="label text-white/50">{catLabel(categories, p.category, lang)} · {dateOf(p.published_at, lang)}</span>
                <span className="mt-2 block font-display text-2xl font-black uppercase leading-tight">{localized(p, lang).title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Thread({ items }: { items: BlogComment[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((c) => (
        <li key={c.id} className="rounded-2xl border border-white/10 p-4">
          <p className="text-base">{c.content}</p>
          <p className="mt-2 text-sm text-mist">{c.name}</p>
          {c.replies && c.replies.length > 0 && <div className="ml-4"><Thread items={c.replies} /></div>}
        </li>
      ))}
    </ul>
  );
}

export function BlogArticle({ post, preview = false }: { post: Post; preview?: boolean }) {
  const { t, lang } = useI18n();
  const copy = localized(post, lang);
  const body = headingIds(fixHtml(copy.content));
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [liked, setLiked] = useState(!!post.liked);
  const [comments, setComments] = useState<BlogComment[]>(post.comments || []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [fail, setFail] = useState('');

  const like = async () => {
    setFail('');
    try {
      const res = await toggleLike(post.slug);
      setLikes(res.likes_count);
      setLiked(res.liked);
    } catch {
      setFail(t.likeFail);
    }
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setFail('');
    try {
      const res = await postComment(post.slug, name.trim(), text.trim(), email.trim());
      setComments(res.comments);
      setText('');
      setNote(res.message || t.commentSent);
    } catch {
      setFail(t.sendFail);
    }
  };

  return (
    <article>
      {preview && <p className="wrap pt-24 text-base text-cream">{t.previewBanner}</p>}
      <header className={`wrap ${preview ? 'pt-6' : 'pt-28'} md:pt-36`}>
        <Link href="/blog" className="label inline-flex min-h-11 items-center text-white/60 hover:text-white">{t.backBlog}</Link>
        <p className="label mt-6 text-cream">{post.category}{post.published_at ? ` · ${dateOf(post.published_at, lang)}` : ''}{post.reading_time ? ` · ${post.reading_time} min` : ''}</p>
        <h1 className="mt-3 font-display text-[10vw] font-black uppercase leading-[.9] tracking-tight md:text-7xl">{copy.title}</h1>
        {copy.excerpt && <p className="mt-6 max-w-3xl font-serif text-2xl italic text-cream md:text-3xl">{copy.excerpt}</p>}
      </header>
      {copy.frenchOnly ? (
        <p className="wrap max-w-xl py-16 text-base leading-relaxed">{t.frenchOnly}. {t.frenchOnlyLead}</p>
      ) : (
        <div className="wrap grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            {post.cover_image && <img src={media(post.cover_image)} alt="" className="mb-10 w-full rounded-3xl" />}
            <div className="blog-content text-base" dangerouslySetInnerHTML={{ __html: body.html }} />
            <div className="mt-12 border-t border-white/10 pt-8">
              <button type="button" onClick={like} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-base">
                <MotionIcon icon={Heart} size={16} effect="heart" filled={liked} className={liked ? 'text-cream' : ''} /> {likes}
              </button>
              {fail && <p className="mt-3 text-base text-cream" role="alert">{fail}</p>}
              <Thread items={comments} />
              <form onSubmit={send} className="mt-6 grid gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.bookName} aria-label={t.bookName} className="min-h-11 rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} aria-label={t.email} className="min-h-11 rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.commentPlaceholder} aria-label={t.commentPlaceholder} rows={4} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none focus:border-cream" />
                {note && <p className="text-base text-cream" role="status">{note}</p>}
                <Heartbeat>
                  <button type="submit" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-cream px-6 text-base font-medium text-ink">
                    <MotionIcon icon={Send} size={16} effect="slide" />{t.contactSend}
                  </button>
                </Heartbeat>
              </form>
            </div>
          </div>
          {body.items.length > 0 && (
            <aside className="hidden lg:block">
              <ul className="sticky top-28 grid gap-2 text-base text-mist">
                {body.items.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                    <a href={`#${item.id}`} className="hover:text-cream">{item.text}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </article>
  );
}
