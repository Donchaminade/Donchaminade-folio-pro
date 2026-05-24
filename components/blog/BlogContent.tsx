import React, { forwardRef } from 'react';
import { mediaUrl } from '../../lib/media';

interface Props {
  content: string;
}

const BlogContent = forwardRef<HTMLElement, Props>(({ content }, ref) => {
  const isPlainText = content !== '' && !/<[a-z][\s\S]*>/i.test(content.trim());

  if (isPlainText) {
    const blocks = content.split(/\n\s*\n/);
    return (
      <article ref={ref} className="notion-prose font-light">
        {blocks.map((block, i) => {
          const trimmed = block.trim();
          const h2 = trimmed.match(/^##\s+(.+)$/);
          const h3 = trimmed.match(/^###\s+(.+)$/);
          if (h2) {
            return (
              <h2 key={i} id={`section-${i}`}>
                {h2[1]}
              </h2>
            );
          }
          if (h3) {
            return (
              <h3 key={i} id={`section-${i}`}>
                {h3[1]}
              </h3>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={i}>
                {trimmed.replace(/^>\s?/gm, '')}
              </blockquote>
            );
          }
          return <p key={i}>{trimmed}</p>;
        })}
      </article>
    );
  }

  const html = content.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
    if (!srcMatch) return tag;
    const rawSrc = srcMatch[1].replace(/^\/public(\/uploads\/)/i, '$1');
    const url = mediaUrl(rawSrc);
    let next = attrs.replace(/\ssrc=["'][^"']+["']/i, ` src="${url}"`);
    if (!/loading=/i.test(next)) next += ' loading="lazy"';
    if (!/decoding=/i.test(next)) next += ' decoding="async"';
    if (!/referrerpolicy=/i.test(next) && /^https?:\/\//i.test(url)) {
      next += ' referrerpolicy="no-referrer"';
    }
    return `<img${next}>`;
  });

  return (
    <article
      ref={ref}
      className="notion-prose blog-content font-light"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

BlogContent.displayName = 'BlogContent';

export default BlogContent;
