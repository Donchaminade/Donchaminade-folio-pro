import React, { forwardRef, useEffect } from 'react';
import type { PreparedBlogBody } from '../../lib/blogHeadings';

interface Props {
  body: PreparedBlogBody;
}

const BlogContent = forwardRef<HTMLElement, Props>(({ body }, ref) => {
  useEffect(() => {
    const root = typeof ref === 'object' && ref ? ref.current : null;
    if (!root) return;

    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy')) return;
      const classMatch = pre.className.match(/language-([a-z0-9]+)/i);
      const lang = (pre.getAttribute('data-lang') || classMatch?.[1] || 'code').toLowerCase();
      pre.setAttribute('data-lang', lang);
      if (!pre.querySelector('.lang-label')) {
        const label = document.createElement('span');
        label.className = 'lang-label';
        label.textContent = lang;
        pre.prepend(label);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy';
      button.textContent = document.documentElement.lang === 'en' ? 'Copy' : 'Copier';
      pre.prepend(button);
    });

    const onClick = async (event: Event) => {
      const button = (event.target as HTMLElement | null)?.closest('.copy');
      if (!(button instanceof HTMLButtonElement)) return;
      const pre = button.closest('pre');
      const code = pre?.querySelector('code')?.textContent || '';
      try {
        await navigator.clipboard.writeText(code.trim());
        const english = document.documentElement.lang === 'en';
        button.textContent = english ? 'Copied' : 'Copié';
        window.setTimeout(() => {
          button.textContent = english ? 'Copy' : 'Copier';
        }, 1600);
      } catch {
        button.textContent = document.documentElement.lang === 'en' ? 'Unavailable' : 'Impossible';
      }
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [ref, body]);

  if (body.format === 'plain') {
    return (
      <article ref={ref} className="prose notion-prose">
        {body.blocks.map((block) => {
          if (block.kind === 'h2') {
            return (
              <h2 key={block.key} id={block.id}>
                {block.text}
              </h2>
            );
          }
          if (block.kind === 'h3') {
            return (
              <h3 key={block.key} id={block.id}>
                {block.text}
              </h3>
            );
          }
          if (block.kind === 'quote') {
            return <blockquote key={block.key}>{block.text}</blockquote>;
          }
          return <p key={block.key}>{block.text}</p>;
        })}
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className="prose notion-prose blog-content"
      dangerouslySetInnerHTML={body.markup}
    />
  );
});

BlogContent.displayName = 'BlogContent';

export default BlogContent;
