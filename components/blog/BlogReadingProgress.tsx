import React, { useEffect, useState } from 'react';

const BlogReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="blog-reading-bar"
      style={{ width: '100%', transform: `scaleX(${progress})` }}
      aria-hidden
    />
  );
};

export default BlogReadingProgress;
