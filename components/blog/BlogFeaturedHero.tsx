import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Eye } from 'lucide-react';
import { BlogPostSummary } from '../../lib/api';
import { getBlogCategory } from '../../lib/blogCategories';
import { navigate } from '../../lib/navigation';
import { mediaUrl } from '../../lib/media';
import BlogCategoryPill from './BlogCategoryPill';

interface Props {
  post: BlogPostSummary;
}

const BlogFeaturedHero: React.FC<Props> = ({ post }) => {
  const cat = getBlogCategory(post.category);
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className={`group relative w-full text-left overflow-hidden rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl ${cat.shadow} hover:border-blue-500/40 hover:scale-[1.01] transition-all duration-500`}
    >
      <div className="relative grid lg:grid-cols-2 gap-0 min-h-[280px] md:min-h-[340px]">
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-4">
            <BlogCategoryPill category={post.category} size="md" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">À la une</span>
          <h2 className="font-serif-blog text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.reading_time} min
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.views_count}
            </span>
          </div>
          <span className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${cat.text}`}>
            Lire l&apos;article <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-full overflow-hidden order-1 lg:order-2">
          {post.cover_image ? (
            <img
              src={mediaUrl(post.cover_image)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`absolute inset-0 ${cat.bgSoft}`} />
          )}
          <div
            className="absolute inset-x-0 bottom-0 h-12 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-16 lg:h-full bg-gradient-to-t lg:bg-gradient-to-l from-[var(--blog-bg)]/85 to-transparent pointer-events-none"
            aria-hidden
          />
        </div>
      </div>
    </motion.button>
  );
};

export default BlogFeaturedHero;
