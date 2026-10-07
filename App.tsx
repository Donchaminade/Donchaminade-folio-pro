import React, { useEffect, useMemo, useState } from 'react';
import { fetchPortfolio } from './lib/api';
import { applyPortfolioSeo } from './lib/seo';
import { useI18n } from './lib/i18n';
import { buildPortfolioView, type PortfolioBundle } from './lib/portfolioView';
import HomeView from './components/home/HomeView';
import AllProjects from './components/AllProjects';
import { MobileNav, PageDecor, SiteFooter, SiteHeader } from './components/layout/SiteChrome';

const App: React.FC = () => {
  const { lang, t } = useI18n();
  const [bundle, setBundle] = useState<PortfolioBundle | null>(null);
  const [showAll, setShowAll] = useState(false);
  const view = useMemo(() => buildPortfolioView(bundle, lang), [bundle, lang]);

  useEffect(() => {
    fetchPortfolio<PortfolioBundle>()
      .then((data) => setBundle(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    applyPortfolioSeo({
      full_name: view.name,
      hero_title: view.roleLine,
      bio: view.lead,
    }, lang);
  }, [view, lang]);

  return (
    <div className="page-pad">
      <a className="skip" href="#main">{t.skip}</a>
      <PageDecor />
      <SiteHeader current="home" />
      <main id="main">
        {showAll ? (
          <AllProjects projects={view.projects} onBack={() => setShowAll(false)} />
        ) : (
          <HomeView data={view} onShowAll={() => { setShowAll(true); window.scrollTo(0, 0); }} />
        )}
      </main>
      <SiteFooter year={view.year} twitter={view.socials.twitter} />
      <MobileNav current="home" />
    </div>
  );
};

export default App;
