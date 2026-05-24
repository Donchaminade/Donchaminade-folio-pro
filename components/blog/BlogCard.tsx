import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { BlogPostSummary } from '../../lib/api';
import { getBlogCategory } from '../../lib/blogCategories';
import { navigate } from '../../lib/navigation';
import { mediaUrl } from '../../lib/media';
import BlogCategoryPill from './BlogCategoryPill';
import BlogShareActions from './BlogShareActions';

interface Props {
  post: BlogPostSummary;
  index?: number;
}

const BlogCard: React.FC<Props> = ({ post, index = 0 }) => {
  const cat = getBlogCategory(post.category);
  const [shareHint, setShareHint] = useState('');

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const openPost = () => navigate(`/blog/${post.slug}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col h-full rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/40 backdrop-blur-sm overflow-visible shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-shadow duration-300"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${cat.bg} opacity-90`} />
      <button
        type="button"
        onClick={openPost}
        className="text-left flex flex-col flex-1 min-h-0"
      >
        <div className="aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
          {post.cover_image ? (
            <img
              src={mediaUrl(post.cover_image)}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-full h-full ${cat.bgSoft}`} />
          )}
          <div className="absolute top-3 left-3">
            <BlogCategoryPill category={post.category} />
          </div>
        </div>
        <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <span>{date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.reading_time} min
            </span>
          </div>
          <h2 className="font-serif-blog text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        </div>
      </button>

      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 mt-auto">
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
            <span className="flex items-center gap-1">
              <Heart size={13} className="text-rose-400" /> {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} className={cat.text} /> {post.comments_count}
            </span>
          </div>

          <div className="flex items-center gap-1 min-w-0">
            <BlogShareActions
              slug={post.slug}
              title={post.title}
              sharesCount={post.shares_count}
              onFeedback={setShareHint}
              size="sm"
              menuAlign="right"
            />
            <button
              type="button"
              onClick={openPost}
              className={`ml-1 p-2 rounded-xl ${cat.bg} text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all shrink-0`}
              aria-label="Lire l'article"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        {shareHint && (
          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-medium">{shareHint}</p>
        )}
      </div>
    </motion.article>
  );
};

export default BlogCard;
