import React, { forwardRef } from 'react';
import type { PreparedBlogBody } from '../../lib/blogHeadings';

interface Props {
  body: PreparedBlogBody;
}

const BlogContent = forwardRef<HTMLElement, Props>(({ body }, ref) => {
  if (body.format === 'plain') {
    return (
      <article ref={ref} className="notion-prose font-light">
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
      className="notion-prose blog-content font-light"
      dangerouslySetInnerHTML={body.markup}
    />
  );
});

BlogContent.displayName = 'BlogContent';

export default BlogContent;
