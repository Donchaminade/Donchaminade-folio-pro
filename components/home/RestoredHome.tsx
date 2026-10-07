import React, { useState } from 'react';
import { GraduationCap, Sparkles, Trophy } from 'lucide-react';
import RecommendModal from '../RecommendModal';
import TestimonialSubmitModal from '../TestimonialSubmitModal';
import { useI18n } from '../../lib/i18n';
import { BOOKING_URL, isStockPhoto, type PortfolioView } from '../../lib/portfolioView';

const SKILL_PREVIEW = 4;

export const AboutSection: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  const [skillsOpen, setSkillsOpen] = useState(false);
  if (!data.education.length && !data.softSkills.length && !data.awards.length) return null;
  const skills = skillsOpen ? data.softSkills : data.softSkills.slice(0, SKILL_PREVIEW);
  const moreSkills = data.softSkills.length > SKILL_PREVIEW;
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
        <div className="about-grid">
          {data.education.length > 0 && (
            <article className="about-card">
              <h3 className="about-card-title"><GraduationCap size={18} strokeWidth={1.5} aria-hidden="true" />{t.education}</h3>
              <ol className="edu-list">
                {data.education.map((item) => (
                  <li key={`${item.school}-${item.year}`}>
                    {item.year ? <span className="year-badge">{item.year}</span> : null}
                    <strong>{item.degree}</strong>
                    <p>{item.school}{item.field ? <span> · {item.field}</span> : null}</p>
                  </li>
                ))}
              </ol>
            </article>
          )}
          {data.softSkills.length > 0 && (
            <article className="about-card">
              <h3 className="about-card-title"><Sparkles size={18} strokeWidth={1.5} aria-hidden="true" />{t.softSkills}</h3>
              <ul className="skill-list">
                {skills.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    {item.impact ? <p>{item.impact}</p> : null}
                  </li>
                ))}
              </ul>
              {moreSkills && (
                <button type="button" className="btn btn-link about-more" aria-expanded={skillsOpen} onClick={() => setSkillsOpen((open) => !open)}>
                  {skillsOpen ? t.seeLess : t.seeMore}
                </button>
              )}
            </article>
          )}
          {data.awards.length > 0 && (
            <article className="about-card">
              <h3 className="about-card-title"><Trophy size={18} strokeWidth={1.5} aria-hidden="true" />{t.awards}</h3>
              <ul className="award-list">
                {data.awards.map((item) => (
                  <li key={`${item.title}-${item.year}`} className="award-mini">
                    <span className="award-ico" aria-hidden="true"><Trophy size={16} strokeWidth={1.5} /></span>
                    <div>
                      <div className="award-top">
                        <strong>{item.title}</strong>
                        {item.year ? <span className="year-badge">{item.year}</span> : null}
                      </div>
                      {item.issuer ? <p className="award-issuer">{item.issuer}</p> : null}
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
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

function pageLogo(logo: string | undefined): { kind: 'img' | 'mark'; value: string } | null {
  const value = (logo || '').trim();
  if (!value || isStockPhoto(value)) return null;
  if (/^(https?:|\/)/i.test(value) || /\.(svg|png|jpe?g|webp|gif)(\?|$)/i.test(value)) {
    return { kind: 'img', value };
  }
  return { kind: 'mark', value: value.slice(0, 2) };
}

export const PagesMarquee: React.FC<{ data: PortfolioView }> = ({ data }) => {
  const { t } = useI18n();
  const pages = data.managedPages.filter((page) => page.name);
  if (!pages.length) return null;
  const sequence: typeof pages = [];
  while (sequence.length < 8) sequence.push(...pages);
  const renderGroup = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {sequence.map((page, index) => {
        const logo = pageLogo(page.logo);
        const href = page.link && page.link !== '#' ? page.link : undefined;
        return (
          <a
            key={`${page.name}-${index}`}
            className={logo ? 'page-tile card' : 'page-tile page-tile-plain card'}
            href={href}
            target={href ? '_blank' : undefined}
            rel={href ? 'noopener noreferrer' : undefined}
            tabIndex={hidden ? -1 : undefined}
          >
            {logo?.kind === 'img' ? (
              <img src={logo.value} alt="" width="40" height="40" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            ) : null}
            {logo?.kind === 'mark' ? <span className="page-logo-mark" aria-hidden="true">{logo.value}</span> : null}
            <strong>{page.name}</strong>
            {page.category ? <span className="muted">{page.category}</span> : null}
            {page.followers ? <span className="muted">{page.followers} {t.followers}</span> : null}
          </a>
        );
      })}
    </div>
  );
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
          {renderGroup(false)}
          {renderGroup(true)}
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
