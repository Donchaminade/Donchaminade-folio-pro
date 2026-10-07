import React, { Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { getBlogPreviewTokenFromPath, getBlogSlugFromPath, getPathname, isBlogListPath } from './lib/navigation';
import { ThemeProvider } from './lib/theme';

const BlogList = React.lazy(() => import('./pages/BlogList'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const PortfolioChat = React.lazy(() => import('./components/PortfolioChat'));

const AppRouter: React.FC = () => {
  const [path, setPath] = useState(getPathname);

  useEffect(() => {
    const onPop = () => setPath(getPathname());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const slug = getBlogSlugFromPath();
  const previewToken = getBlogPreviewTokenFromPath();
  void path;

  let page: React.ReactNode = <App />;
  if (isBlogListPath()) page = <BlogList />;
  else if (previewToken) page = <BlogPostPage previewToken={previewToken} />;
  else if (slug) page = <BlogPostPage slug={slug} />;

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<div className="wrap" style={{ padding: '48px 0' }}>Chargement…</div>}>
          {page}
        </Suspense>
        <Suspense fallback={null}>
          <PortfolioChat />
        </Suspense>
      </MotionConfig>
    </ThemeProvider>
  );
};

export default AppRouter;
