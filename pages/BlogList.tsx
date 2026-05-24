import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import BlogFeaturedHero from '../components/blog/BlogFeaturedHero';
import BlogShell from '../components/blog/BlogShell';
import { BLOG_BRAND, setBlogCategoriesRegistry, type BlogCategoryDef } from '../lib/blogCategories';
import { BlogCategoryApi, BlogPostSummary, fetchBlogList, isApiConfigured } from '../lib/api';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [filterCategories, setFilterCategories] = useState<BlogCategoryDef[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const applyCategories = (apiCats: BlogCategoryApi[]) => {
    const mapped: BlogCategoryDef[] = apiCats.map((c) => ({
      id: c.slug,
      label: c.label,
      emoji: c.emoji || '📝',
    }));
    setFilterCategories(mapped);
    setBlogCategoriesRegistry(mapped);
  };

  const load = useCallback(
    async (pageNum: number, cat: string, append: boolean) => {
      if (!isApiConfigured()) {
        setError('Configurez VITE_API_URL pour afficher le blog.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetchBlogList(pageNum, cat === 'all' ? undefined : cat);
        if (res.categories?.length) {
          applyCategories(res.categories);
        }
        setPosts((prev) => (append ? [...prev, ...res.data] : res.data));
        setHasMore(res.hasMore);
        setPage(pageNum);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement');
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setError('');
    load(1, category, false).finally(() => setLoading(false));
  }, [category, load]);

  const featured = posts[0];
  const gridPosts = posts.length > 1 ? posts.slice(1) : posts.length === 1 ? [] : [];

  return (
    <BlogShell backLabel="Portfolio" backTo="/">
      <main className="max-w-6xl mx-auto px-5 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${BLOG_BRAND.border} ${BLOG_BRAND.bgSoft} ${BLOG_BRAND.text} text-xs font-bold mb-6`}>
            <Sparkles size={14} /> Idées · Tech · Énergie · Foi
          </div>
          <h1 className="font-serif-blog text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-5">
            Un espace pour{' '}
            <span className={BLOG_BRAND.text}>penser, créer et inspirer</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
            Développement, énergie, motivation, spiritualité… Chaque article se lit d&apos;un seul trait — comme une page Notion.
          </p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar -mx-1 px-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              category === 'all'
                ? `${BLOG_BRAND.bg} text-white border-transparent shadow-lg ${BLOG_BRAND.shadow}`
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
            }`}
          >
            Tout
          </button>
          {filterCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                category === c.id
                  ? `${BLOG_BRAND.bg} text-white border-transparent shadow-lg ${BLOG_BRAND.shadow}`
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex gap-4 max-w-xl">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <p className="text-slate-600 dark:text-slate-400 text-sm">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && !error && (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {posts.length === 0 && (
                <p className="text-slate-500 py-16 text-center">Aucun article dans cette catégorie.</p>
              )}

              {featured && category === 'all' && page === 1 && (
                <div className="mb-10">
                  <BlogFeaturedHero post={featured} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category === 'all' && page === 1 ? gridPosts : posts).map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={async () => {
                      setLoadingMore(true);
                      await load(page + 1, category, true);
                      setLoadingMore(false);
                    }}
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-full ${BLOG_BRAND.bg} ${BLOG_BRAND.bgHover} text-white font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 shadow-lg ${BLOG_BRAND.shadow}`}
                  >
                    {loadingMore ? <Loader2 size={18} className="animate-spin" /> : null}
                    Charger plus d&apos;articles
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </BlogShell>
  );
};

export default BlogList;
