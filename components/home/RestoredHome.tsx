import React, { useState } from 'react';
import RecommendModal from '../RecommendModal';
import TestimonialSubmitModal from '../TestimonialSubmitModal';
import { useI18n } from '../../lib/i18n';
import { BOOKING_URL, isStockPhoto, type PortfolioView } from '../../lib/portfolioView';

export const AboutSection: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  if (!data.education.length && !data.softSkills.length && !data.awards.length) return null;
  return (
    <section className="section" id="apropos">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">{t.aboutKicker}</p>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutLead}</p>
          </div>
        </div>
        <div className="stack-grid">
          {data.education.length > 0 && (
            <article className="card">
              <h3>{t.education}</h3>
              <ul className="timeline">
                {data.education.map((item) => (
                  <li key={`${item.school}-${item.year}`}>
                    <div className="when">{item.year}</div>
                    <div className="what">
                      <h3>{item.degree}</h3>
                      <p className="org">{item.school}{item.field ? <span> · {item.field}</span> : null}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          )}
          {data.softSkills.length > 0 && (
            <article className="card">
              <h3>{t.softSkills}</h3>
              <ul className="quote-list">
                {data.softSkills.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.impact}</p>
                  </li>
                ))}
              </ul>
            </article>
          )}
          {data.awards.length > 0 && (
            <article className="card">
              <h3>{t.awards}</h3>
              <ul className="quote-list">
                {data.awards.map((item) => (
                  <li key={`${item.title}-${item.year}`}>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.issuer} · {item.year}</p>
                    {item.description ? <p>{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export const CommunitySection: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  if (!data.communities.length) return null;
  return (
    <section className="section" id="communaute">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">{t.communityKicker}</p>
            <h2>{t.communityTitle}</h2>
            <p>{t.communityLead}</p>
          </div>
        </div>
        <div className="comm-grid">
          {data.communities.map((community, index) => {
            const href = community.websiteUrl || community.linkedinUrl || undefined;
            const expanded = open === index;
            return (
              <article key={community.name} className="comm-card card">
                <strong>{community.name}</strong>
                <span>{community.role}</span>
                <div className="ctas" style={{ marginTop: 10 }}>
                  <button type="button" className="btn btn-link" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : index)}>
                    {expanded ? t.close : t.discover}
                  </button>
                  {href && (
                    <a className="btn btn-link" href={href} target="_blank" rel="noopener noreferrer">{t.website}</a>
                  )}
                </div>
                {expanded && community.description ? <p>{community.description}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const PagesMarquee: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  const pages = data.managedPages.filter((page) => page.name && !isStockPhoto(page.logo));
  if (!pages.length) return null;
  const loop = [...pages, ...pages];
  return (
    <section className="section" id="pages" aria-label={t.pagesTitle}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">{t.pagesKicker}</p>
            <h2>{t.pagesTitle}</h2>
            <p>{t.pagesLead}</p>
          </div>
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((page, index) => (
            <a key={`${page.name}-${index}`} className="page-tile card" href={page.link && page.link !== '#' ? page.link : undefined} target="_blank" rel="noopener noreferrer">
              <strong>{page.name}</strong>
              <span className="muted">{page.category}</span>
              {page.followers ? <span className="muted">{page.followers} {t.followers}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProofSection: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 't' | 'r'>('all');
  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [recommendOpen, setRecommendOpen] = useState(false);
  const testimonials = filter === 'r' ? [] : data.testimonials;
  const recommendations = filter === 't' ? [] : data.recommendations;
  return (
    <section className="section" id="temoignages">
      <TestimonialSubmitModal open={testimonialOpen} onClose={() => setTestimonialOpen(false)} />
      <RecommendModal open={recommendOpen} onClose={() => setRecommendOpen(false)} />
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">{t.proofKicker}</p>
            <h2>{t.proofTitle}</h2>
            <p>{t.proofLead}</p>
          </div>
          <div className="ctas">
            <button type="button" className="btn btn-primary" onClick={() => setTestimonialOpen(true)}>{t.leaveTestimonial}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setRecommendOpen(true)}>{t.leaveRecommendation}</button>
          </div>
        </div>
        <div className="filters" role="tablist" aria-label={t.proofFilters}>
          {([['all', t.allProof], ['t', t.testimonials], ['r', t.recommendations]] as const).map(([key, label]) => (
            <button key={key} type="button" className={filter === key ? 'chip on' : 'chip'} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
        <div className="quote-list">
          {testimonials.map((item) => (
            <blockquote key={item.name + item.quote.slice(0, 12)} className="card">
              <p>{item.quote}</p>
              <p className="muted">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
            </blockquote>
          ))}
          {recommendations.map((item) => (
            <blockquote key={`${item.name}-${item.body.slice(0, 12)}`} className="card">
              <p>{item.body}</p>
              <p className="muted">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
            </blockquote>
          ))}
          {testimonials.length === 0 && filter !== 'r' && <p className="muted">{t.emptyTestimonials}</p>}
          {recommendations.length === 0 && filter !== 't' && <p className="muted">{t.emptyRecommendations}</p>}
        </div>
      </div>
    </section>
  );
};

export const ClientsSection: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  if (!data.clients.length) return null;
  return (
    <section className="section" id="confiance">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">{t.trustKicker}</p>
            <h2>{t.trustTitle}</h2>
            <p>{t.trustLead}</p>
          </div>
        </div>
        <ul className="chips">
          {data.clients.map((client) => (
            <li key={client.name} className="chip">
              <img src={client.logo} alt="" width="28" height="28" />
              {client.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const BookFab: React.FC = () => {
  const { t } = useI18n();
  return (
    <a className="book-fab btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
      {t.bookFloat}
    </a>
  );
};
