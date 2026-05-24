import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '../../lib/navigation';
import BlogReadingProgress from './BlogReadingProgress';

interface Props {
  children: React.ReactNode;
  backLabel?: string;
  backTo?: string;
  showProgress?: boolean;
}

const BlogShell: React.FC<Props> = ({
  children,
  backLabel = 'Portfolio',
  backTo = '/',
  showProgress = false,
}) => (
  <div className="blog-page relative">
    <div className="blog-mesh" aria-hidden />
    {showProgress && <BlogReadingProgress />}
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/10 bg-[var(--blog-bg)]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{backLabel}</span>
        </button>
        <motion.button
          type="button"
          onClick={() => navigate('/blog')}
          className="font-black text-lg tracking-tight text-slate-900 dark:text-white"
          whileHover={{ scale: 1.02 }}
        >
          Donchaminade <span className="text-blue-600">·</span> Blog
        </motion.button>
        <div className="w-24 hidden sm:block" />
      </div>
    </header>
    <div className="relative z-10">{children}</div>
  </div>
);

export default BlogShell;
