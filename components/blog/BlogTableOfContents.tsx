import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface Props {
  contentRef: React.RefObject<HTMLElement | null>;
  htmlContent: string;
}

function slugify(text: string, used: Set<string>): string {
  let base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  if (!base) base = 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

export function buildTocFromHtml(html: string): TocItem[] {
  if (typeof DOMParser === 'undefined') return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items: TocItem[] = [];
  const used = new Set<string>();
  doc.querySelectorAll('h2, h3').forEach((el) => {
    const level = el.tagName === 'H2' ? 2 : 3;
    const text = el.textContent?.trim() || '';
    if (!text) return;
    items.push({ id: slugify(text, used), text, level });
  });
  return items;
}

const BlogTableOfContents: React.FC<Props> = ({ contentRef, htmlContent }) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const isHtml = /<[a-z][\s\S]*>/i.test(htmlContent.trim());
    let toc: TocItem[] = [];

    const used = new Set<string>();
    if (isHtml) {
      toc = buildTocFromHtml(htmlContent);
    }
    const headings = root.querySelectorAll('h2, h3');
    headings.forEach((el, i) => {
      const text = el.textContent?.trim() || '';
      if (!text) return;
      const level = el.tagName === 'H2' ? 2 : 3;
      const id = toc[i]?.id ?? slugify(text, used);
      el.id = id;
      if (!isHtml) {
        toc.push({ id, text, level });
      }
    });
    if (!isHtml) {
      setItems(toc);
    } else {
      setItems(toc);
    }
  }, [contentRef, htmlContent]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5] }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="hidden xl:block sticky top-28 self-start w-56 shrink-0">
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
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
