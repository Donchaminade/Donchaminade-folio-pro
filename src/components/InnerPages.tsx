'use client';
import PageHero from './PageHero';
import { About, Services, Work } from './Sections';
import { Awards, Community, Path } from './More';
import { profile } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';

export function AboutPage() {
  const { t } = useI18n();
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={t.links.about} italic={t.awardsTitleB} />
      <About />
      <Awards />
    </article>
  );
}

export function StackPage() {
  const { t } = useI18n();
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={t.links.stack} italic={t.servicesDo} />
      <Services />
    </article>
  );
}

export function ProjectsPage() {
  const { t } = useI18n();
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={t.links.projects} italic={t.projectsChosen} />
      <Work />
    </article>
  );
}

export function CareerPage() {
  const { t } = useI18n();
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={t.links.career} italic={t.pathTitleB} />
      <Path />
      <p className="wrap pb-20">
        <a href={profile.cv} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-base">{t.myCv}</a>
      </p>
    </article>
  );
}

export function CommunityPage() {
  const { t } = useI18n();
  return (
    <article>
      <PageHero kicker="Chaminade.dev" title={t.links.community} italic={t.communityTitleB} />
      <Community />
    </article>
  );
}
