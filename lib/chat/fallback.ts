import { detectIntent, isDisallowed } from './language';
import type { ChatExperienceFact, ChatLang, ChatProjectFact, PortfolioFacts } from './types';

function linkOrEmpty(url?: string): string {
  if (!url || url === '#') return '';
  return url;
}

function norm(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function namedHits<T>(query: string, items: T[], label: (item: T) => string): T[] {
  const q = norm(query);
  return items.filter((item) => {
    const tokens = norm(label(item))
      .split(/[^a-z0-9+]+/i)
      .filter((tok) => tok.length > 3);
    return tokens.some((tok) => q.includes(tok));
  });
}

function formatProjectLine(project: ChatProjectFact): string {
  const extra = [linkOrEmpty(project.link), linkOrEmpty(project.github)].filter(Boolean).join(' · ');
  const stack = project.tags?.length ? ` [${project.tags.join(', ')}]` : '';
  return `• ${project.title} — ${project.description}${stack}${extra ? ` (${extra})` : ''}`;
}

function formatExperienceDetail(exp: ChatExperienceFact, lang: ChatLang): string {
  const bullets = (exp.description || []).map((line) => `• ${line}`).join('\n');
  return lang === 'en'
    ? `${exp.role} at ${exp.company} (${exp.period}).\n${bullets}`
    : `${exp.role} chez ${exp.company} (${exp.period}).\n${bullets}`;
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

  if (intent === 'grosbit') {
    const exp = facts.experiences.find((e) => /grosbit/i.test(e.company));
    const picon = facts.projects.find((p) => /picon/i.test(p.title));
    if (lang === 'en') {
      return [
        'I currently work at GROSBIT SARLU (February 2026 – present) as IT Support and web & mobile developer (Next.js, Flutter).',
        exp ? exp.description.join(' ') : '',
        'GROSBIT is a Cisco partner; I help deploy network solutions and keep infrastructure running.',
        picon
          ? `I also work on ${picon.title}: ${picon.description}`
          : 'LinkedIn also mentions a mobile app for printed-photo order and delivery (PICON).',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return [
      'Je travaille actuellement chez GROSBIT SARLU (février 2026 – présent) comme IT Support et développeur web & mobile (Next.js, Flutter).',
      exp ? exp.description.join(' ') : '',
      'GROSBIT est partenaire Cisco : assistance au déploiement réseau et maintien en conditions opérationnelles.',
      picon
        ? `Je contribue aussi à ${picon.title} : ${picon.description}`
        : 'LinkedIn mentionne aussi l’app mobile de commande / livraison de photos imprimées (PICON).',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (intent === 'education') {
    const list = facts.education.join('\n• ');
    return lang === 'en'
      ? `Public education:\n• ${list}\nLomé Business School (Professional Bachelor, 2024) and École Polytechnique DEFITECH (BTS, 2023).`
      : `Formations publiques :\n• ${list}\nLicence Pro à Lomé Business School (2024) et BTS à l’École Polytechnique DEFITECH (2023).`;
  }

  if (intent === 'flutter') {
    const flutterProjects = facts.projects
      .filter((p) => (p.tags || []).some((t) => /flutter|dart/i.test(t)))
      .slice(0, 8)
      .map((p) => p.title);
    return lang === 'en'
      ? `Yes — Flutter / Dart is a core mobile skill: interactive UIs, state, navigation. Used at GROSBIT, Picon Studio (Dec 2025 – Feb 2026) and Efficorpe (Aug–Oct 2025). Public apps include ${flutterProjects.join(', ') || 'PICON, Akontaa, CoachFlow'}. I also speak about Flutter and Firebase at GDG Lomé.`
      : `Oui — Flutter / Dart est une compétence mobile centrale : interfaces interactives, état, navigation. Utilisé chez GROSBIT, Picon Studio (déc. 2025 – fév. 2026) et Efficorpe (août–oct. 2025). Apps publiques : ${flutterProjects.join(', ') || 'PICON, Akontaa, CoachFlow'}. J’interviens aussi sur Flutter et Firebase au GDG Lomé.`;
  }

  if (intent === 'pycon') {
    const exp = facts.experiences.find((e) => /pycon/i.test(e.company + e.role));
    const community = facts.communities.find((c) => /pycon/i.test(c.name));
    const yasNote = /\b(yas|next gen)\b/i.test(query)
      ? lang === 'en'
        ? 'I also coach teams at the 48h Hackathon YAS Togo | Next Gen (2026).'
        : 'Je suis aussi coach au 48h Hackathon YAS Togo | Next Gen (2026).'
      : '';
    if (lang === 'en') {
      return [
        'At PyCon Togo 2026 I volunteer as Speaker Coordinator.',
        exp ? exp.description.join(' ') : community?.description || '',
        'That includes arrivals, departures, transport from the border, and on-site speaker logistics.',
        yasNote,
      ]
        .filter(Boolean)
        .join(' ');
    }
    return [
      'Pour PyCon Togo 2026, je suis bénévole — chargé des speakers.',
      exp ? exp.description.join(' ') : community?.description || '',
      'Concrètement : arrivées, départs, transport depuis la frontière et logistique speakers sur site.',
      yasNote,
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
    const hits = namedHits(query, facts.projects, (project) => project.title);
    const selected = (hits.length ? hits : facts.projects).slice(0, 8);
    const list = selected.map(formatProjectLine).join('\n');
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
    const hits = namedHits(query, facts.experiences, (exp) => `${exp.company} ${exp.role}`);
    if (hits.length === 1) {
      return formatExperienceDetail(hits[0], lang);
    }
    const selected = (hits.length ? hits : facts.experiences).slice(0, 8);
    const list = selected.map((e) => `• ${e.role} — ${e.company} (${e.period})`).join('\n');
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
    const phones = (p.phones && p.phones.length ? p.phones : [p.phone]).filter(Boolean).join(' · ');
    const linkedin = p.linkedin_url || 'https://www.linkedin.com/in/chaminadeadjolou';
    return lang === 'en'
      ? `Public contact: ${p.email || ''} · ${phones} · LinkedIn ${linkedin} · GitHub ${p.github_url || ''} · booking via the “Réserver un créneau” button on the site.`
      : `Contact public : ${p.email || ''} · ${phones} · LinkedIn ${linkedin} · GitHub ${p.github_url || ''} · réservation via le bouton « Réserver un créneau » du site.`;
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

  const linkedin = p.linkedin_url || 'https://www.linkedin.com/in/chaminadeadjolou';
  return lang === 'en'
    ? `I'm ${p.full_name}, ${p.hero_title} ${p.location ? `Based in ${p.location}.` : ''} ${p.bio} Current role: GROSBIT SARLU (Feb 2026 – present). Education: Lomé Business School (2024) and DEFITECH (2023). LinkedIn: ${linkedin}. Ask me about Flutter, projects, PyCon, YAS coaching, or latest blogs.`
    : `Je suis ${p.full_name}, ${p.hero_title} ${p.location ? `Basé à ${p.location}.` : ''} ${p.bio} Poste actuel : GROSBIT SARLU (février 2026 – présent). Formations : Lomé Business School (2024) et DEFITECH (2023). LinkedIn : ${linkedin}. Demandez-moi Flutter, les projets, PyCon, le coaching YAS ou les derniers blogs.`;
}
