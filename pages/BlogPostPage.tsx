import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import BlogContent from '../components/blog/BlogContent';
import BlogEngagement from '../components/blog/BlogEngagement';
import BlogMeta from '../components/blog/BlogMeta';
import BlogTableOfContents from '../components/blog/BlogTableOfContents';
import { MobileNav, PageDecor, SiteFooter, SiteHeader } from '../components/layout/SiteChrome';
import { fetchBlogCategories, fetchBlogPost, fetchBlogPreview, isApiConfigured, type BlogPostDetail } from '../lib/api';
import { getBlogCategory, setBlogCategoriesRegistry } from '../lib/blogCategories';
import {
  isPlainBlogText,
  prepareBlogBody,
  readLocationHeadingId,
  scrollToBlogHeading,
} from '../lib/blogHeadings';
import { mediaUrl } from '../lib/media';
import { navigate } from '../lib/navigation';
import { sanitizeBlogHtml, stripDuplicateCover } from '../lib/sanitizeHtml';

interface Props {
  slug?: string;
  previewToken?: string;
}

function pillClass(id: string): string {
  if (id.includes('sante')) return 'pill sante';
  if (id.includes('spir')) return 'pill spi';
  if (id.includes('moti')) return 'pill moti';
  return 'pill';
}

const BlogPostPage: React.FC<Props> = ({ slug, previewToken }) => {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTop, setShowTop] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isApiConfigured()) {
      setError('API non configurée.');
      setLoading(false);
      return;
    }
    const loadPost = previewToken ? fetchBlogPreview(previewToken) : fetchBlogPost(slug!);
    Promise.all([loadPost, fetchBlogCategories().catch(() => [])])
      .then(([data, cats]) => {
        if (cats.length) {
          setBlogCategoriesRegistry(cats.map((item) => ({ id: item.slug, label: item.label, emoji: item.emoji || '📝' })));
        }
        setPost(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Article introuvable'))
      .finally(() => setLoading(false));
  }, [slug, previewToken]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const articleContent = post?.content ?? '';
  const cover = post?.cover_image ? mediaUrl(post.cover_image) : '';
  const body = useMemo(() => {
    if (!articleContent) return prepareBlogBody('');
    if (isPlainBlogText(articleContent)) return prepareBlogBody(articleContent);
    const cleaned = sanitizeBlogHtml(articleContent);
    return prepareBlogBody(cover ? stripDuplicateCover(cleaned, cover) : cleaned);
  }, [articleContent, cover]);

  useEffect(() => {
    if (!articleContent) return;
    const root = contentRef.current;
    let programmatic = false;
    let cancelled = false;

    const scrollToHash = (behavior: ScrollBehavior) => {
      if (cancelled) return;
      const id = readLocationHeadingId();
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      programmatic = true;
      scrollToBlogHeading(el, behavior);
      window.setTimeout(() => {
        programmatic = false;
      }, 80);
    };

    const onUserScroll = () => {
      if (!programmatic) cancelled = true;
    };
    const onPop = () => {
      cancelled = false;
      scrollToHash('smooth');
    };

    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchmove', onUserScroll, { passive: true });
    window.addEventListener('popstate', onPop);

    scrollToHash('auto');
    const raf = window.requestAnimationFrame(() => scrollToHash('auto'));
    const timers = [
      window.setTimeout(() => scrollToHash('auto'), 350),
      window.setTimeout(() => scrollToHash('auto'), 700),
    ];
    const onImageLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) scrollToHash('auto');
    };
    root?.addEventListener('load', onImageLoad, true);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);
      window.removeEventListener('popstate', onPop);
      root?.removeEventListener('load', onImageLoad, true);
    };
  }, [articleContent, body]);

  const shell = (children: React.ReactNode) => (
    <div className="page-pad">
      <a className="skip" href="#main">Aller au contenu</a>
      <PageDecor />
      <SiteHeader current="blog" />
      {children}
      <SiteFooter year={String(new Date().getFullYear())} />
      <MobileNav current="blog" />
    </div>
  );

  if (loading) return shell(<main id="main" className="section"><div className="wrap">Chargement de l’article…</div></main>);

  if (error || !post) {
    return shell(
      <main id="main" className="section">
        <div className="wrap">
          <AlertCircle aria-hidden="true" />
          <p>{error || 'Article introuvable'}</p>
          <button type="button" className="btn btn-link" onClick={() => navigate('/blog')}>Retour au blog</button>
        </div>
      </main>
    );
  }

  const cat = getBlogCategory(post.category);
  const date = new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isPreview = Boolean(previewToken || post.is_preview);
  const share = isPreview
    ? undefined
    : {
        slug: post.slug,
        title: post.title,
        shareUrl: post.share_url,
        sharesCount: post.shares_count,
        onSharesUpdate: (count: number) => setPost((current) => (current ? { ...current, shares_count: count } : current)),
      };

  return shell(
    <>
      <BlogMeta post={post} noIndex={isPreview} />
      <div className="progress" style={{ transform: 'scaleX(var(--read, 0))' }} aria-hidden="true" />
      <ReadingBar />
      {isPreview && <div className="preview-banner">Aperçu brouillon — non publié. Relisez, puis validez dans l’admin.</div>}
      <main id="main">
        <header className="a-head">
          <div className="dots" aria-hidden="true" />
          <div className="wrap">
            <div className="inner">
              <nav className="crumbs" aria-label="Fil d’Ariane">
                <a href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>Portfolio</a>
                <span aria-hidden="true">/</span>
                <a href="/blog" onClick={(event) => { event.preventDefault(); navigate('/blog'); }}>Blog</a>
                <span aria-hidden="true">/</span>
                <span>{cat.label}</span>
              </nav>
              <span className={pillClass(post.category)}>{cat.emoji} {cat.label}</span>
              <h1>{post.title}</h1>
              {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
              <div className="author">
                <img src="/pypicture.png" alt="" width="44" height="44" />
                <div>
                  <strong>Chaminade Adjolou</strong>
                  <div className="meta">
                    <span>{date}</span>
                    <span>{post.reading_time} min de lecture</span>
                    <span>{post.views_count} vues</span>
                  </div>
                </div>
              </div>
            </div>
            {cover && (
              <figure className="cover">
                <img src={cover} alt="" />
              </figure>
            )}
          </div>
        </header>
        <div className="band" aria-hidden="true" />
        <div className="wrap">
          <div className="a-layout">
            <article>
              <BlogTableOfContents mode="mobile" items={body.items} />
              <BlogContent ref={contentRef} body={body} />
              {!isPreview && (
                <BlogEngagement post={post} onUpdate={(patch) => setPost((current) => (current ? { ...current, ...patch } : current))} />
              )}
              <aside className="endcard card">
                <img src="/pypicture.png" alt="" />
                <div>
                  <strong>Écrit par Chaminade Adjolou</strong>
                  <p className="muted">Développeur Full-Stack Web & Mobile à Lomé.</p>
                </div>
                <a className="btn btn-primary" href="/#contact" onClick={(event) => { event.preventDefault(); navigate('/'); window.setTimeout(() => document.getElementById('contact')?.scrollIntoView(), 80); }}>Me contacter</a>
              </aside>
            </article>
            <BlogTableOfContents mode="desktop" items={body.items} share={share} />
          </div>
        </div>
      </main>
      <button
        type="button"
        className={showTop ? 'to-top' : 'to-top is-hidden'}
        aria-label="Retour en haut"
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      </button>
    </>
  );
};

const ReadingBar: React.FC = () => {
  useEffect(() => {
    const bar = document.querySelector('.progress') as HTMLElement | null;
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const value = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
      bar?.style.setProperty('transform', `scaleX(${value})`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
};

export default BlogPostPage;
