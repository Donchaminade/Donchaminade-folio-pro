import React, { Suspense, useEffect, useState } from 'react';
import App from './App';
import BlogList from './pages/BlogList';
import BlogPostPage from './pages/BlogPostPage';
import { getBlogPreviewTokenFromPath, getBlogSlugFromPath, getPathname, isBlogListPath } from './lib/navigation';

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

  let page: React.ReactNode = <App />;
  if (isBlogListPath()) {
    page = <BlogList />;
  } else if (previewToken) {
    page = <BlogPostPage previewToken={previewToken} />;
  } else if (slug) {
    page = <BlogPostPage slug={slug} />;
  }

  return (
    <>
      {page}
      <Suspense fallback={null}>
        <PortfolioChat />
      </Suspense>
    </>
  );
};

export default AppRouter;
