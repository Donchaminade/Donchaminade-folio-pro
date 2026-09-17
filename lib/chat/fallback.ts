import { detectIntent, isDisallowed } from './language';
import type { ChatLang, PortfolioFacts } from './types';

function linkOrEmpty(url?: string): string {
  if (!url || url === '#') return '';
  return url;
}

export function fallbackAnswer(query: string, facts: PortfolioFacts, lang: ChatLang): string {
  const blocked = isDisallowed(query);
  if (blocked === 'harm') {
    return lang === 'en'
      ? 'I only answer questions about Donchaminade’s public portfolio. I cannot help with harmful requests.'
      : 'Je ne réponds qu’aux questions sur le portfolio public de Donchaminade. Je ne peux pas aider pour une demande dangereuse.';
  }
  if (blocked === 'private') {
    return lang === 'en'
      ? 'I only share public portfolio information. I don’t speculate about private life or unpublished details.'
      : 'Je ne partage que les informations publiques du portfolio. Je ne spécule pas sur la vie privée ni sur des détails non publiés.';
  }

  const intent = detectIntent(query);
  const p = facts.profile;

  if (intent === 'offtopic') {
    return lang === 'en'
      ? 'I only answer questions about Donchaminade Chamiande Adjolou: bio, projects, experience, blogs, skills, and public contact. What would you like to know about the portfolio?'
      : 'Je ne réponds qu’aux questions sur Donchaminade Chamiande Adjolou : bio, projets, expériences, blogs, compétences et contact public. Que souhaitez-vous savoir sur le portfolio ?';
  }

  if (intent === 'pycon') {
    const exp = facts.experiences.find((e) => /pycon/i.test(e.company + e.role));
    const community = facts.communities.find((c) => /pycon/i.test(c.name));
    if (lang === 'en') {
      return [
        'At PyCon Togo 2026 I volunteer as Speaker Coordinator.',
        exp ? exp.description.join(' ') : community?.description || '',
        'That includes arrivals, departures, transport from the border, and on-site speaker logistics.',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return [
      'Pour PyCon Togo 2026, je suis bénévole — chargé des speakers.',
      exp ? exp.description.join(' ') : community?.description || '',
      'Concrètement : arrivées, départs, transport depuis la frontière et logistique speakers sur site.',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (intent === 'yas') {
    const exp = facts.experiences.find((e) => /yas|next gen/i.test(e.company));
    if (lang === 'en') {
      return [
        'I coach teams at the 48h Hackathon YAS Togo and Next Gen (2026).',
        exp ? exp.description.join(' ') : '',
        'Focus: product framing, technical choices, and pitching a viable prototype under time pressure.',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return [
      'Je suis coach au 48h Hackathon YAS Togo et à Next Gen (2026).',
      exp ? exp.description.join(' ') : '',
      'J’accompagne le cadrage produit, les choix techniques et le pitch d’un prototype viable dans un temps contraint.',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (intent === 'projects') {
    const list = facts.projects
      .slice(0, 8)
      .map((project) => {
        const extra = [linkOrEmpty(project.link), linkOrEmpty(project.github)].filter(Boolean).join(' · ');
        const stack = project.tags?.length ? ` [${project.tags.join(', ')}]` : '';
        return `• ${project.title} — ${project.description}${stack}${extra ? ` (${extra})` : ''}`;
      })
      .join('\n');
    return lang === 'en'
      ? `Here are some of my public projects:\n${list}\nAsk about a title if you want more detail.`
      : `Voici une sélection de mes projets publics :\n${list}\nDemandez un titre pour le détail.`;
  }

  if (intent === 'blogs') {
    if (!facts.blogs.length) {
      return lang === 'en'
        ? 'Published articles live at /blog. I do not currently have a fresh list — open the Blog section of the site.'
        : 'Les articles publiés sont sur /blog. Je n’ai pas de liste fraîche pour le moment — ouvrez la section Blog du site.';
    }
    const list = facts.blogs
      .slice(0, 6)
      .map((b) => `• ${b.title} — ${b.excerpt} (/blog/${b.slug})`)
      .join('\n');
    return lang === 'en'
      ? `Latest public posts:\n${list}`
      : `Derniers articles publics :\n${list}`;
  }

  if (intent === 'experience') {
    const list = facts.experiences
      .slice(0, 8)
      .map((e) => `• ${e.role} — ${e.company} (${e.period})`)
      .join('\n');
    return lang === 'en'
      ? `My recent path:\n${list}\nAsk about PyCon, YAS, GROSBIT or another role for details.`
      : `Mon parcours récent :\n${list}\nDemandez PyCon, YAS, GROSBIT ou un autre poste pour le détail.`;
  }

  if (intent === 'skills') {
    return lang === 'en'
      ? `I work across web & mobile: ${facts.skills.slice(0, 24).join(', ')}. Typical stack: React/Next.js, Flutter, PHP/MySQL, TypeScript.`
      : `Je travaille en web & mobile : ${facts.skills.slice(0, 24).join(', ')}. Stack habituelle : React/Next.js, Flutter, PHP/MySQL, TypeScript.`;
  }

  if (intent === 'contact') {
    return lang === 'en'
      ? `Public contact: ${p.email || ''} · ${p.phone || ''} · ${p.linkedin_url || ''} · booking via the “Réserver un créneau” button on the site.`
      : `Contact public : ${p.email || ''} · ${p.phone || ''} · ${p.linkedin_url || ''} · réservation via le bouton « Réserver un créneau » du site.`;
  }

  if (intent === 'testimonials') {
    const t = facts.testimonials[0];
    if (!t) {
      return lang === 'en'
        ? 'Public testimonials are on the site’s Réf. section.'
        : 'Les témoignages publics sont dans la section Réf. du site.';
    }
    return lang === 'en'
      ? `Example: “${t.quote}” — ${t.name}, ${t.role || ''} ${t.company || ''}.`
      : `Exemple : « ${t.quote} » — ${t.name}, ${t.role || ''} ${t.company || ''}.`;
  }

  if (intent === 'community') {
    const list = facts.communities.map((c) => `• ${c.name} — ${c.role}`).join('\n');
    return lang === 'en'
      ? `Communities I contribute to:\n${list}`
      : `Communautés auxquelles je contribue :\n${list}`;
  }

  if (intent === 'awards') {
    const list = facts.awards.map((a) => `• ${a.title} (${a.issuer}, ${a.year})`).join('\n');
    return lang === 'en' ? `Public distinctions:\n${list}` : `Distinctions publiques :\n${list}`;
  }

  return lang === 'en'
    ? `I'm ${p.full_name}, ${p.hero_title} ${p.bio} I have ${p.experience_badge || 'several years'} of experience. Ask me about projects, PyCon, YAS coaching, or latest blogs.`
    : `Je suis ${p.full_name}, ${p.hero_title} ${p.bio} ${p.experience_badge || ''} d’expérience. Demandez-moi les projets, PyCon, le coaching YAS ou les derniers blogs.`;
}
