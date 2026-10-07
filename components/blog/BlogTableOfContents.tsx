import React, { useEffect, useState } from 'react';
import {
  blogStickyOffset,
  pushHeadingHash,
  scrollToBlogHeading,
  type TocItem,
} from '../../lib/blogHeadings';
import BlogShareActions from './BlogShareActions';

interface Props {
  items: TocItem[];
  mode: 'mobile' | 'desktop';
  share?: {
    slug: string;
    title: string;
    shareUrl?: string;
    sharesCount: number;
    onSharesUpdate: (count: number) => void;
  };
}

const BlogTableOfContents: React.FC<Props> = ({ items, mode, share }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!activeId) return;
    const link = document.querySelector<HTMLAnchorElement>(`a.blog-toc-link[href="#${CSS.escape(activeId)}"]`);
    const list = link?.closest('ol, ul');
    if (!link || !list) return;
    const linkRect = link.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (linkRect.top < listRect.top || linkRect.bottom > listRect.bottom) {
      list.scrollTop += linkRect.top - listRect.top - list.clientHeight / 3;
    }
  }, [activeId]);

  useEffect(() => {
    if (items.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = blogStickyOffset() + 8;
      let current = '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
      }
      if (!current) current = items[0]?.id ?? '';
      setActiveId((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length < 2) return null;

  const list = (
    <ol>
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? 'd3' : undefined}>
          <a
            href={`#${item.id}`}
            className={`blog-toc-link${item.level === 3 ? ' depth-3' : ''}${activeId === item.id ? ' is-active' : ''}`}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
                return;
              }
              const el = document.getElementById(item.id);
              if (!el) return;
              event.preventDefault();
              setActiveId(item.id);
              scrollToBlogHeading(el, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
              pushHeadingHash(item.id);
            }}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (mode === 'mobile') {
    return (
      <details className="toc-mobile card">
        <summary>
          Sommaire · {items.length} parties <span aria-hidden="true">▾</span>
        </summary>
        {list}
      </details>
    );
  }

  return (
    <nav className="toc card" aria-label="Sommaire">
      <h2>Sommaire</h2>
      {list}
      {share && (
        <div className="share">
          <BlogShareActions
            slug={share.slug}
            title={share.title}
            shareUrl={share.shareUrl}
            sharesCount={share.sharesCount}
            onSharesUpdate={share.onSharesUpdate}
            size="md"
          />
        </div>
      )}
    </nav>
  );
};

export default BlogTableOfContents;
