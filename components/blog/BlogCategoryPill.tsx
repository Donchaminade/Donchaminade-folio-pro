import React from 'react';
import { getBlogCategory } from '../../lib/blogCategories';

interface Props {
  category?: string | null;
  size?: 'sm' | 'md';
  className?: string;
}

const BlogCategoryPill: React.FC<Props> = ({ category, size = 'sm', className = '' }) => {
  const cat = getBlogCategory(category);
  const sizeCls =
    size === 'md'
      ? 'px-3 py-1.5 text-xs gap-2'
      : 'px-2.5 py-1 text-[10px] gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-widest rounded-full ${cat.bg} text-white shadow-lg ${cat.shadow} ${sizeCls} ${className}`}
    >
      <span aria-hidden>{cat.emoji}</span>
      {cat.label}
    </span>
  );
};

export default BlogCategoryPill;
