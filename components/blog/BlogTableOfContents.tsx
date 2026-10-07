import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import {
  blogStickyOffset,
  pushHeadingHash,
  scrollToBlogHeading,
  type TocItem,
} from '../../lib/blogHeadings';

interface Props {
  items: TocItem[];
}

const BlogTableOfContents: React.FC<Props> = ({ items }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!activeId) return;
    const link = document.querySelector<HTMLAnchorElement>(`a.blog-toc-link[href="#${activeId}"]`);
    const list = link?.closest('ul');
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

  return (
    <nav className="hidden xl:block sticky top-28 self-start w-56 shrink-0" aria-label="Sommaire">
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
          <List size={14} /> Sommaire
        </div>
        <ul className="space-y-0.5 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`blog-toc-link ${item.level === 3 ? 'depth-3' : ''} ${activeId === item.id ? 'is-active' : ''}`}
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                  ) {
                    return;
                  }
                  const el = document.getElementById(item.id);
                  if (!el) return;
                  event.preventDefault();
                  setActiveId(item.id);
                  scrollToBlogHeading(el, 'smooth');
                  pushHeadingHash(item.id);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BlogTableOfContents;
