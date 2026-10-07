import React, { useMemo, useState } from 'react';
import type { ProjectView } from '../lib/portfolioView';

const External = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="14" height="14">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

const AllProjects: React.FC<{ projects: ProjectView[]; onBack: () => void }> = ({ projects, onBack }) => {
  const [filter, setFilter] = useState('Tous');
  const visible = useMemo(() => {
    if (filter === 'Tous') return projects;
    return projects.filter((project) => {
      const blob = `${project.type} ${project.tags.join(' ')} ${project.kicker}`.toLowerCase();
      if (filter === 'Web') return /web|react|next/.test(blob) || project.type === 'Web';
      if (filter === 'Mobile') return project.type === 'Mobile' || /flutter|mobile|expo/.test(blob);
      if (filter === 'Backend') return /spring|php|node|go|api/.test(blob);
      return Boolean(project.github);
    });
  }, [filter, projects]);

  return (
    <section className="section">
      <div className="wrap">
        <button type="button" className="btn btn-link" onClick={onBack}>← Retour à l’accueil</button>
        <div className="section-head">
          <div>
            <p className="kicker">Catalogue</p>
            <h2>{projects.length} projets</h2>
          </div>
        </div>
        <div className="filters" role="tablist" aria-label="Filtrer le catalogue">
          {['Tous', 'Web', 'Mobile', 'Backend', 'Open source'].map((item) => (
            <button key={item} type="button" className={filter === item ? 'chip on' : 'chip'} onClick={() => setFilter(item)} aria-selected={filter === item}>
              {item}
            </button>
          ))}
        </div>
        <div className="pgrid">
          {visible.map((project) => (
            <article key={project.title} className="pcard card">
              <div className="pmedia">
                {project.image ? (
                  <img src={project.image} alt="" loading="lazy" />
                ) : (
                  <div className={`ph ${project.gradient}`} aria-hidden="true"><span>{project.initials}</span></div>
                )}
              </div>
              <div className="pbody">
                <p className="kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p className="pdesc">{project.description}</p>
                <ul className="ptags">{project.tags.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}</ul>
                <div className="plinks">
                  {project.links.map((link) => (
                    <a key={link.href} className="btn btn-secondary btn-sm" href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}<External />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProjects;
