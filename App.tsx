import React, { useEffect, useState } from 'react';
import { fetchPortfolio } from './lib/api';
import { applyPortfolioSeo } from './lib/seo';
import { HERO_LEAD, buildPortfolioView, type PortfolioBundle, type PortfolioView } from './lib/portfolioView';
import HomeView from './components/home/HomeView';
import AllProjects from './components/AllProjects';
import { MobileNav, PageDecor, SiteFooter, SiteHeader } from './components/layout/SiteChrome';

const App: React.FC = () => {
  const [view, setView] = useState<PortfolioView>(() => buildPortfolioView(null));
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPortfolio<PortfolioBundle>()
      .then((data) => {
        const next = buildPortfolioView(data);
        setView(next);
        applyPortfolioSeo({
          full_name: next.name,
          hero_title: next.roleLine,
          bio: HERO_LEAD,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-pad">
      <a className="skip" href="#main">Aller au contenu</a>
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
