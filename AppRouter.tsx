import React, { useEffect, useState } from 'react';
import App from './App';
import BlogList from './pages/BlogList';
import BlogPostPage from './pages/BlogPostPage';
import { getBlogPreviewTokenFromPath, getBlogSlugFromPath, getPathname, isBlogListPath } from './lib/navigation';

const AppRouter: React.FC = () => {
  const [path, setPath] = useState(getPathname);

  useEffect(() => {
    const onPop = () => setPath(getPathname());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const slug = getBlogSlugFromPath();
  const previewToken = getBlogPreviewTokenFromPath();

  if (isBlogListPath()) {
    return <BlogList />;
  }

  if (previewToken) {
    return <BlogPostPage previewToken={previewToken} />;
  }

  if (slug) {
    return <BlogPostPage slug={slug} />;
  }

  return <App />;
};

export default AppRouter;
