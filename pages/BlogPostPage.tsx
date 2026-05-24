import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowUp, Clock, Eye } from 'lucide-react';
import BlogEngagement from '../components/blog/BlogEngagement';
import BlogContent from '../components/blog/BlogContent';
import BlogMeta from '../components/blog/BlogMeta';
import BlogCategoryPill from '../components/blog/BlogCategoryPill';
import BlogShell from '../components/blog/BlogShell';
import BlogTableOfContents from '../components/blog/BlogTableOfContents';
import BlogShareActions from '../components/blog/BlogShareActions';
import { fetchBlogCategories } from '../lib/api';
import { getBlogCategory, setBlogCategoriesRegistry } from '../lib/blogCategories';
import { mediaUrl } from '../lib/media';
import { BlogPostDetail, fetchBlogPost, isApiConfigured } from '../lib/api';
import { navigate } from '../lib/navigation';

interface Props {
  slug: string;
}

const BlogPostPage: React.FC<Props> = ({ slug }) => {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTop, setShowTop] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isApiConfigured()) {
      setError('API non configurée.');
      setLoading(false);
      return;
    }
    Promise.all([
      fetchBlogPost(slug),
      fetchBlogCategories().catch(() => []),
    ])
      .then(([data, cats]) => {
        if (cats.length) {
          setBlogCategoriesRegistry(
            cats.map((c) => ({ id: c.slug, label: c.label, emoji: c.emoji || '📝' }))
          );
        }
        setPost(data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Article introuvable'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <BlogShell backLabel="Blog" backTo="/blog">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </BlogShell>
    );
  }

  if (error || !post) {
    return (
      <BlogShell backLabel="Blog" backTo="/blog">
        <div className="max-w-lg mx-auto py-24 px-6 text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={40} />
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'Article introuvable'}</p>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="text-blue-600 font-bold text-sm"
          >
            ← Retour au blog
          </button>
        </div>
      </BlogShell>
    );
  }

  const cat = getBlogCategory(post.category);
  const date = new Date(post.published_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <BlogShell backLabel="Blog" backTo="/blog" showProgress>
      <BlogMeta post={post} />

      {post.cover_image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full max-h-[min(55vh,480px)] overflow-hidden bg-slate-200 dark:bg-slate-900"
        >
          <img
            src={mediaUrl(post.cover_image)}
            alt=""
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover min-h-[260px] max-h-[min(55vh,480px)] opacity-100"
          />
          {/* Léger fondu en bas uniquement — l'image reste ≥ 90 % visible */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-[var(--blog-bg)]/90 to-transparent"
            aria-hidden
          />
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        <div className="flex gap-12 xl:gap-16 justify-center">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[min(100%,880px)] min-w-0"
          >
            <header className="mb-10 md:mb-14">
              <div className="mb-5">
                <BlogCategoryPill category={post.category} size="md" />
              </div>
              <h1 className="font-serif-blog text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-slate-900 dark:text-white leading-[1.12] tracking-tight mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <div className="notion-callout mb-8">
                  <span className="text-2xl" aria-hidden>
                    💬
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-light m-0">
                    {post.excerpt}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                <time dateTime={post.published_at}>{date}</time>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> {post.reading_time} min de lecture
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={15} /> {post.views_count} vues
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Partager
                </span>
                <BlogShareActions
                  slug={post.slug}
                  title={post.title}
                  shareUrl={post.share_url}
                  sharesCount={post.shares_count}
                  onSharesUpdate={(count) => setPost((p) => (p ? { ...p, shares_count: count } : p))}
                  onFeedback={setShareFeedback}
                  size="md"
                  showCount
                />
                {shareFeedback && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-medium">{shareFeedback}</p>
                )}
              </div>
            </header>

            <BlogContent ref={contentRef} content={post.content} />

            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 pt-10 border-t border-slate-200 dark:border-white/10"
            >
              <BlogEngagement post={post} onUpdate={(patch) => setPost((p) => (p ? { ...p, ...patch } : p))} />
            </motion.section>
          </motion.article>

          <BlogTableOfContents contentRef={contentRef} htmlContent={post.content} />
        </div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-6 z-50 p-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-110 transition-transform"
        aria-label="Retour en haut"
      >
        <ArrowUp size={20} />
      </motion.button>
    </BlogShell>
  );
};

export default BlogPostPage;
