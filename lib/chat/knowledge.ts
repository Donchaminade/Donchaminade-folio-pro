import type {
  ChatCommunityFact,
  ChatExperienceFact,
  ChatFaqFact,
  ChatProfileFact,
  ChatProjectFact,
  PortfolioFacts,
} from './types';

/**
 * Faits publics fusionnés (CV + LinkedIn + catalogue).
 * L’API portfolio reste la source de vérité pour les projets actuellement affichés.
 * Ces extraits comblent les trous (timeline, formations, communautés, projets perso).
 */
export const KNOWLEDGE_PROFILE: ChatProfileFact = {
  full_name: 'ADJOLOU Dondah Chaminade',
  aliases: [
    'Donchaminade',
    'Dondah Chaminade Adjolou',
    'Chaminade Adjolou',
    'Donchaminade Chamiande Adjolou',
  ],
  hero_title: 'Développeur Web & Mobile.',
  headline:
    'Web & Mobile Developer — Next.js, React, Flutter, Java Spring Boot, Node.js, Python, PHP ; Event & Team Coordinator ; Community Manager ; Ambassadeur Cursor',
  bio: 'Développeur web et mobile basé à Lomé (Togo). Environ 3 ans d’expérience web, 2 ans en mobile et 2 ans en communication digitale / organisation d’événements tech. Je conçois des solutions numériques centrées utilisateur (React/Next.js, Flutter, PHP, Node.js, Python, Java/Spring Boot). Poste actuel : IT Support et développeur web & mobile chez GROSBIT SARLU (Février 2026 – Présent). Formé à Lomé Business School (Licence Pro 2024) et à l’École Polytechnique DEFITECH (BTS 2023). Intérêts publics : HiveQL et IA.',
  location: 'Lomé, Togo',
  availability_text: 'Disponible pour de nouveaux défis',
  experience_badge: '3+ ans',
  email: 'chaminade.dondah.adjolou@gmail.com',
  phone: '+228 99 18 16 26',
  phones: ['+228 99 18 16 26', '+228 92 59 56 61'],
  whatsapp: '22899181626',
  linkedin_url: 'https://www.linkedin.com/in/chaminadeadjolou',
  twitter_url: 'https://x.com/Donchaminde',
  github_url: 'https://github.com/Donchaminade',
};

/** Expériences CV / LinkedIn absentes ou trop courtes dans l’API portfolio. */
export const KNOWLEDGE_EXPERIENCES: ChatExperienceFact[] = [
  {
    company: 'Picon Studio',
    role: 'Développeur Frontend Mobile',
    period: 'Décembre 2025 – Février 2026',
    description: [
      'Conception et intégration d’interfaces mobiles interactives sous Flutter, pour améliorer la fluidité de navigation.',
      'Optimisation du code et résolution d’anomalies techniques, réduisant les bugs de production.',
      'Collaboration en équipe Agile pour la qualité, la performance et la satisfaction utilisateur.',
    ],
    tags: ['Flutter', 'Dart', 'Agile', 'Mobile'],
  },
  {
    company: 'Africa Power Platform / House of Challenge',
    role: 'Développeur Web et Mobile',
    period: 'Mention publique LinkedIn',
    description: [
      'Développement de la plateforme événementielle Africa Power Platform / House of Challenge.',
      'Application mobile de check-in pour l’événement.',
      'Le premier sommet dédié à Microsoft Power Platform en Afrique de l’Ouest (édition 2024, Cotonou).',
    ],
    tags: ['React', 'Flutter', 'Événementiel'],
  },
  {
    company: 'Google Developer Group Lomé',
    role: 'Chef d’équipes & Coordinateur',
    period: '2025 – présent',
    description: [
      'Supervision de l’avancement des cellules logistique, communication, technique et partenariats.',
      'Coordination des équipes pour les projets et événements (dont Google I/O Extended Lomé).',
      'Participation aux décisions stratégiques, comptes rendus et séances de débriefing.',
    ],
    tags: ['GDG', 'Leadership', 'Événementiel'],
  },
  {
    company: 'WTM | GDG | Hyver | ETHAfrique | ABC | PythonTogo',
    role: 'Chef Logistique Événementiel',
    period: 'Depuis 2024',
    description: [
      'Planification et coordination logistique d’événements tech (200 à 500+ participants) : Google I/O Extended Lomé 2026, PyCon Togo 2026.',
      'Gestion des partenaires, prestataires et fournisseurs ; TDRs, comptes rendus et rapports logistiques.',
      'Supervision des installations, des flux pendant l’événement et évaluation post-événement.',
    ],
    tags: ['Logistique', 'Événementiel', 'PyCon', 'WTM'],
  },
  {
    company: 'Cursor Togo Community',
    role: 'Responsable senior / communauté — Ambassadeur Cursor',
    period: 'Mention publique LinkedIn',
    description: [
      'Responsable senior de la Cursor Togo Community.',
      'Ambassadeur Cursor : animation communautaire et accompagnement autour de l’IDE et des workflows IA.',
    ],
    tags: ['Cursor', 'Communauté', 'IA'],
  },
  {
    company: 'Major League Hacking Togo',
    role: 'Responsable adjoint',
    period: '2025',
    description: [
      'Responsable adjoint MLH Togo (mention publique LinkedIn).',
      'Coorganisation du hackathon MLH qui a réuni plus de 50 participants locaux.',
    ],
    tags: ['MLH', 'Hackathon', 'Bénévolat'],
  },
];

/** Projets perso CV / LinkedIn non (ou partiellement) listés par l’API live. */
export const KNOWLEDGE_PROJECTS: ChatProjectFact[] = [
  {
    title: 'Ezoato',
    description: 'App web et mobile d’accès aux épreuves, examens et devoirs des écoles du Togo.',
    detailedDescription:
      'Projet personnel : accès aux épreuves du nord au sud du Togo. Système de contribution rémunérée (points convertibles après validation). Paiement mobile pour l’accès premium et les retraits. Stack publique : React, Flutter, Node.js, paiement mobile.',
    tags: ['React', 'Flutter', 'Node.js', 'Paiement Mobile'],
    type: 'Mobile',
  },
  {
    title: 'Meneur TV',
    description: 'PWA de streaming TV via API IPTV (chaînes nationales et internationales).',
    detailedDescription:
      'Projet personnel : plateforme de streaming PWA avec API IPTV, guide des programmes, recherche de chaînes et lecture adaptative selon la connexion. Stack publique : React, PWA, API IPTV.',
    tags: ['React', 'PWA', 'IPTV', 'Streaming'],
    type: 'Web',
  },
  {
    title: 'Billing Shop',
    description: 'Projet mentionné publiquement sur LinkedIn (Togosaas, Billing Shop, CoachFlow, Grosbit).',
    detailedDescription:
      'Billing Shop figure parmi les projets cités sur le profil LinkedIn public. Pas de stack ni d’URL publique détaillée dans les sources fusionnées — renvoyer vers LinkedIn ou le dépôt GitHub si le visiteur veut le détail.',
    tags: ['LinkedIn'],
    type: 'Web',
  },
];

export const KNOWLEDGE_COMMUNITIES: ChatCommunityFact[] = [
  {
    name: 'Cursor Togo Community',
    role: 'Responsable senior / Ambassadeur Cursor',
    description:
      'Animation de la communauté Cursor au Togo : ambassade, coordination d’équipe et accompagnement sur les workflows IA dans l’IDE.',
  },
  {
    name: 'ETHAfrique',
    role: 'Social Media, CM & logistique (saisonnier depuis 2024)',
    description:
      'Contribution à ETHAfrique : réseaux sociaux, visuels/vidéos (Canva, CapCut) et logistique autour de l’ETHAfrique Summit.',
  },
  {
    name: 'Hyver',
    role: 'Social Media & Community Manager (saisonnier depuis 2024)',
    description:
      'Animation des réseaux de Hyver Organization, campagnes digitales et coordination événementielle (Google I/O Extended, meetups).',
  },
  {
    name: 'ABC',
    role: 'Social Media & logistique (saisonnier depuis 2024)',
    description:
      'Community management et logistique événementielle pour ABC, aux côtés de Hyver, Python Togo et ETHAfrique.',
  },
  {
    name: 'Major League Hacking',
    role: 'Responsable adjoint — coorganisateur hackathon 2025',
    description:
      'Responsable adjoint MLH Togo ; coorganisation d’un hackathon de plus de 50 participants locaux.',
  },
];

export const KNOWLEDGE_SKILLS: string[] = [
  'Flutter',
  'Dart',
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'PWA',
  'Node.js',
  'Python',
  'FastAPI',
  'Flask',
  'Java',
  'Spring Boot',
  'PHP',
  'REST API',
  'GraphQL',
  'JWT',
  'OAuth2',
  'Paiement Mobile',
  'PostgreSQL',
  'MySQL',
  'SQLite',
  'Git',
  'GitHub',
  'Agile',
  'Scrum',
  'CI/CD',
  'LLM',
  'Prompt Engineering',
  'HiveQL',
  'Canva',
  'CapCut',
  'Figma',
];

export const KNOWLEDGE_SOFT_SKILLS: string[] = [
  'Leadership & organisation',
  'Communication claire',
  'Esprit d’équipe & Agile',
  'Adaptabilité',
  'Créativité',
  'Résolution de problèmes',
  'Autonomie',
  'Rigueur',
  'Gestion du temps',
  'Facultés pédagogiques',
];

/**
 * Fourchettes indicatives — PAS le salaire actuel, PAS une cotation légale.
 *
 * Hypothèses documentées (marchés publics Afrique de l’Ouest / Togo mid-level + remote, ~2025–2026) :
 * - PME locales Lomé, mid-level web/mobile 3–4 ans : souvent ~250 000–500 000 XOF / mois.
 * - Profil « builder + digitalisation/ERP + formation + logistique 200–500+ pers. » :
 *   demande raisonnable 400 000–750 000 XOF / mois (4 800 000–9 000 000 XOF / an)
 *   selon taille d’organisation, présentiel vs remote, et périmètre (lead vs IC).
 * - Banques / ONG internationales / telcos peuvent dépasser 1 000 000 XOF / mois :
 *   hors bande mid-level par défaut — ne pas les présenter comme le marché standard.
 * - Remote international (contrat Afrique → UE/US, mid, pas FAANG senior) :
 *   souvent 18 000–36 000 EUR / an ou 20 000–40 000 USD / an selon volume d’heures,
 *   recouvrement de fuseau et staff-aug vs projet.
 * - Parité : 1 EUR = 655,957 XOF (fixe). USD/XOF ~600 (approximatif).
 *   4 800 000 XOF ≈ 7 300 EUR ; 9 000 000 XOF ≈ 13 700 EUR — d’où l’écart local vs remote.
 * - Positionnement honnête : mid-level builder solide + multiplicateur communautaire,
 *   pas un senior FAANG / staff engineer.
 */
export const SALARY_BANDS = {
  localAnnualXof: { min: 4_800_000, max: 9_000_000 },
  localMonthlyXof: { min: 400_000, max: 750_000 },
  remoteAnnualEur: { min: 18_000, max: 36_000 },
  remoteAnnualUsd: { min: 20_000, max: 40_000 },
} as const;

export const KNOWLEDGE_SALARY_CONTEXT = `PRÉTENTIONS SALARIALES (indicatives, pas le salaire actuel, pas une cotation légale) :
- CDI local Togo / UEMOA : 4 800 000 – 9 000 000 XOF / an (soit 400 000 – 750 000 XOF / mois).
- Contrat remote international : 18 000 – 36 000 EUR / an, ou 20 000 – 40 000 USD / an.
- Drivers : stack Next.js / Flutter / Node / PHP ; livraison ERP/apps (Tayba Market, PICON) ; formation & speaking ; logistique d’événements 200–500+ personnes (GDG, PyCon, YAS).
- Leviers : remote vs présentiel, CDI vs freelance, périmètre (IC vs lead/coach), fuseau, volume.
- Honnêteté : mid-level builder + multiplicateur communautaire — pas un senior FAANG.`;

export const KNOWLEDGE_VALUE_CONTEXT = `VALEUR AJOUTÉE AU-DELÀ DU CODE :
- Digitalisation métier : ERP Tayba Market (ventes, stocks, caisses, fidélisation) — de l’audit IT à la mise en prod.
- Apps opérationnelles : PICON (logistique photo / commande-livraison), Ratoufa (tickets), PayFlex, RachCargo.
- Pédagogie : formateur ISF / WTM / Ecobank / GDG (IA, web, réseaux sociaux) ; coach 48h Hackathon YAS Togo | Next Gen.
- Community & logistique : GDG Lomé, WTM, Python Togo, PyCon Togo speakers, Hyver / ETHAfrique / ABC, ambassadeur Cursor Togo ; événements 200–500+ personnes.
- Impact business : un profil qui livre, forme, et ouvre un réseau local — pas seulement des tickets Jira.`;

export const KNOWLEDGE_NETWORK_CONTEXT = `FORCE DU RÉSEAU (faits publics) :
- GDG Lomé : speaker Flutter/Firebase, organisateur, chef d’équipes & coordinateur (Google I/O Extended).
- WTM Lomé : mentor & logistique, réduction de la fracture numérique de genre.
- Python Togo : social media & logistique ; PyCon Togo 2026 chargé des speakers (arrivées, frontière, site).
- YAS Togo | Next Gen 2026 : coach hackathon 48h.
- Hyver, ETHAfrique, ABC : CM / visuels / logistique saisonniers depuis 2024.
- Cursor Togo Community : responsable senior, ambassadeur Cursor.
- MLH Togo : responsable adjoint, hackathon 50+ participants.
- Taille : événements tech 200 à 500+ personnes ; pages animées (GDG Lomé 2k+, Python Togo 1k+, WTM 800+, Hyver 500+).
- Mobilisation citée : plus de 600 participants lors d’événements tech locaux (CM Hyver / Python Togo / ABC).`;

export function formatSalaryAnswer(lang: 'fr' | 'en'): string {
  if (lang === 'en') {
    return [
      'I can share an indicative annual range for this profile — not Donchaminade’s current pay, and not a legal quote.',
      '',
      'Local full-time (Togo / UEMOA): 4 800 000 – 9 000 000 XOF per year (about 400 000 – 750 000 XOF / month).',
      'Remote international contract: 18 000 – 36 000 EUR per year, or 20 000 – 40 000 USD per year.',
      '',
      'Why this band: ~3–4 years web, mobile delivery (Next.js, Flutter, Node, PHP), shipped ERP and ops apps (Tayba Market, PICON), plus training, speaking, and logistics for 200–500+ attendee events (GDG Lomé, PyCon Togo speakers, YAS coach). That is a mid-level strong builder with a community multiplier — not a FAANG senior.',
      '',
      'Negotiation levers: remote vs onsite, full-time vs freelance, scope (IC vs lead/coach), timezone overlap, and whether the role includes community or training. Upper local band fits NGOs, telcos or regional product teams; the lower band fits a local SME with a narrower scope.',
      '',
      'Is this a local CDI, a remote contract, or freelance — and which currency matters most for you?',
    ].join('\n');
  }
  return [
    'Je peux proposer une fourchette annuelle indicative pour ce profil — pas le salaire actuel de Donchaminade, et pas une cotation légale.',
    '',
    'CDI local Togo / UEMOA : 4 800 000 – 9 000 000 XOF / an (soit 400 000 – 750 000 XOF / mois).',
    'Contrat remote international : 18 000 – 36 000 EUR / an, ou 20 000 – 40 000 USD / an.',
    '',
    'Pourquoi cette bande : environ 3–4 ans de web, livraison mobile (Next.js, Flutter, Node, PHP), ERP et apps opérationnelles livrées (Tayba Market, PICON), plus la formation, le speaking et la logistique d’événements de 200–500+ personnes (GDG Lomé, speakers PyCon Togo, coach YAS). C’est un mid-level builder solide, multiplicateur communautaire — pas un senior FAANG.',
    '',
    'Leviers de négociation : remote vs présentiel, CDI vs freelance, périmètre (IC vs lead/coach), fuseau, et la part de communauté ou de formation. Le haut de bande locale correspond plutôt aux ONG, telcos ou équipes produit régionales ; le bas à une PME locale au périmètre plus étroit.',
    '',
    'On parle d’un CDI local, d’un contrat remote, ou de freelance — et quelle devise compte le plus pour vous ?',
  ].join('\n');
}

export function formatValueAnswer(lang: 'fr' | 'en'): string {
  if (lang === 'en') {
    return [
      'Beyond writing features, Donchaminade helps a company move from “we should digitize this” to a tool people actually use.',
      '',
      'He has led digitalisation end-to-end at Tayba Market (ERP: sales, stock, cashiers, loyalty), ships operational apps such as PICON for printed-photo logistics, and trains teams (ISF, WTM, Ecobank, GDG) while coaching hackathon squads at YAS / Next Gen.',
      '',
      'The extra value is leverage: fewer process gaps, faster delivery, and a community door (GDG, PyCon, Cursor Togo) that helps hiring, talks, and events. He is a builder who also organizes — not only a ticket-closer.',
      '',
      'Are you hiring for product delivery, internal digitalisation, or community / training as well?',
    ].join('\n');
  }
  return [
    'Au-delà d’écrire des fonctionnalités, Donchaminade aide une entreprise à passer de « il faudrait digitaliser ça » à un outil que les équipes utilisent vraiment.',
    '',
    'Il a mené la digitalisation de bout en bout chez Tayba Market (ERP : ventes, stocks, caisses, fidélisation), livre des apps opérationnelles comme PICON pour la logistique photo, forme des publics (ISF, WTM, Ecobank, GDG) et coache des équipes au hackathon YAS / Next Gen.',
    '',
    'La valeur ajoutée, c’est le levier : moins de trous dans les process, une livraison plus courte, et une porte communautaire (GDG, PyCon, Cursor Togo) utile pour recruter, parler et organiser. C’est un builder qui organise aussi — pas seulement quelqu’un qui ferme des tickets.',
    '',
    'Vous recrutez surtout pour la livraison produit, une digitalisation interne, ou aussi pour la communauté et la formation ?',
  ].join('\n');
}

export function formatNetworkAnswer(lang: 'fr' | 'en'): string {
  if (lang === 'en') {
    return [
      'His network is operational, not decorative: he speaks, coaches, and runs logistics for rooms of 200–500+ people.',
      '',
      'GDG Lomé (speaker on Flutter/Firebase, organizer, team coordinator — including Google I/O Extended), WTM Lomé (mentor & logistics), Python Togo (social + logistics) and PyCon Togo 2026 speaker coordination (arrivals, border transport, on-site). He coaches at the 48h YAS Togo | Next Gen hackathon, contributes seasonally to Hyver, ETHAfrique and ABC, and is senior lead / Cursor ambassador for Cursor Togo. He was also deputy lead for MLH Togo (50+ hackathon).',
      '',
      'Public pages he helps animate: GDG Lomé 2k+, Python Togo 1k+, WTM 800+, Hyver 500+. Community management work has mobilized 600+ participants at local tech events.',
      '',
      'Would you like the community angle, the speaker/logistics angle, or how this helps a hiring team in Lomé or remotely?',
    ].join('\n');
  }
  return [
    'Son réseau est opérationnel, pas décoratif : il parle, coache et tient la logistique de salles de 200–500+ personnes.',
    '',
    'GDG Lomé (speaker Flutter/Firebase, organisateur, chef d’équipes — dont Google I/O Extended), WTM Lomé (mentor & logistique), Python Togo (réseaux + logistique) et PyCon Togo 2026 chargé des speakers (arrivées, transport depuis la frontière, site). Il coache au hackathon 48h YAS Togo | Next Gen, contribue de façon saisonnière à Hyver, ETHAfrique et ABC, et est responsable senior / ambassadeur Cursor Togo. Il a aussi été responsable adjoint MLH Togo (hackathon 50+).',
    '',
    'Pages publiques animées : GDG Lomé 2k+, Python Togo 1k+, WTM 800+, Hyver 500+. Le community management a déjà mobilisé plus de 600 participants lors d’événements tech locaux.',
    '',
    'Vous voulez l’angle communauté, l’angle speakers/logistique, ou comment cela aide une équipe qui recrute à Lomé ou en remote ?',
  ].join('\n');
}

export const KNOWLEDGE_FAQ: ChatFaqFact[] = [
  {
    q: 'Où travaille Donchaminade actuellement ?',
    a: 'Chez GROSBIT SARLU depuis février 2026 (poste actuel, source API portfolio). Rôle : IT Support et développeur web & mobile (Next.js, Flutter). Assistance réseau pour des clients, entreprise partenaire Cisco, maintien en conditions opérationnelles. Travail également sur l’app mobile de commande / livraison de photos imprimées (PICON / PhotoPicon).',
    tags: ['grosbit', 'emploi', 'actuel', 'cisco', 'picon'],
  },
  {
    q: 'Quelles sont ses formations ?',
    a: 'Licence Professionnelle — Système d’Information & Développement d’Application, Lomé Business School (2024). BTS Informatique de Gestion — Développement d’Application, École Polytechnique DEFITECH (2023).',
    tags: ['formation', 'éducation', 'lbs', 'defitech', 'diplôme'],
  },
  {
    q: 'Maîtrise-t-il Flutter ?',
    a: 'Oui. Flutter / Dart : interfaces interactives, état, navigation. Utilisé chez GROSBIT (PICON), Picon Studio (déc. 2025 – fév. 2026), Efficorpe (août–oct. 2025), et sur Akontaa, Ratoufa, Locafrica, CoachFlow, CredHub, ConseilBox, 48 lois. Speaker GDG Lomé sur Flutter et Firebase.',
    tags: ['flutter', 'dart', 'mobile', 'compétences'],
  },
  {
    q: 'Quel est son LinkedIn ?',
    a: 'https://www.linkedin.com/in/chaminadeadjolou — aussi GitHub https://github.com/Donchaminade et e-mail chaminade.dondah.adjolou@gmail.com.',
    tags: ['linkedin', 'contact', 'profil'],
  },
  {
    q: 'Quel est son rôle à PyCon Togo et YAS ?',
    a: 'PyCon Togo 2026 : bénévole chargé des speakers (arrivées, départs, transport depuis la frontière, logistique sur site) et chef logistique événementiel. 48h Hackathon YAS Togo | Next Gen 2026 : coach (cadrage produit, choix techniques, pitch).',
    tags: ['pycon', 'yas', 'hackathon', 'communauté'],
  },
  {
    q: 'Qu’est-ce que Picon Studio par rapport à PICON / Grosbit ?',
    a: 'Picon Studio (déc. 2025 – fév. 2026) est une expérience CV : développeur frontend mobile Flutter. PICON / PhotoPicon est le projet mobile Grosbit de commande et livraison de photos imprimées (Flutter/Dart), montré sur le portfolio. Ce sont deux faits distincts.',
    tags: ['picon', 'studio', 'grosbit', 'photopicon'],
  },
  {
    q: 'Quels projets personnels hors vitrine API ?',
    a: 'TogoSaaS (annuaire SaaS togolais, React/TS/PHP/MySQL), Ezoato (épreuves scolaires Togo, React/Flutter/Node + paiement mobile), Togo Communities Hub, Akontaa (dettes/créances Flutter/SQLite), Meneur TV (PWA IPTV), CoachFlow, Billing Shop (cité sur LinkedIn). L’API portfolio prime pour les projets actuellement affichés sur le site (PICON, Tayba ERP, 8e Tranche, etc.).',
    tags: ['togosaas', 'ezoato', 'akontaa', 'meneur', 'projets'],
  },
  {
    q: 'Quelles prétentions salariales pour ce profil ?',
    a: KNOWLEDGE_SALARY_CONTEXT,
    tags: ['salaire', 'prétentions', 'fourchette', 'xof', 'fcfa', 'eur', 'usd', 'remote', 'rémunération'],
  },
  {
    q: 'Quelle valeur ajoutée au-delà du code ?',
    a: KNOWLEDGE_VALUE_CONTEXT,
    tags: ['valeur', 'digitalisation', 'erp', 'tayba', 'formation', 'impact'],
  },
  {
    q: 'Quelle est la force de son réseau ?',
    a: KNOWLEDGE_NETWORK_CONTEXT,
    tags: ['réseau', 'network', 'gdg', 'pycon', 'wtm', 'cursor', '200', '500'],
  },
];

export const KNOWLEDGE_NOTES: string[] = [
  'CONFLITS: pour le poste actuel, privilégier l’API portfolio — GROSBIT SARLU, Février 2026 – Présent.',
  'Le CV plus ancien (PDF) s’arrête à Efficorpe / formateur et n’a pas encore GROSBIT ni Picon Studio : ne pas s’y fier pour le job actuel.',
  'Ne pas inventer le salaire actuel / réel, l’adresse personnelle, la famille, ni les contacts privés de tiers (références CV). Les fourchettes indicatives du contexte (XOF / EUR / USD) sont autorisées pour les prétentions — toujours les labeller comme indicatives.',
  'Témoins / références CV (noms publics seulement, sans téléphone) : Bienvenu Agbavon (Co-Lead GDG Lomé), Agnilonda Pakou (Lead Hyver), Seti Afanou (Lead GDG Lomé), Wachiou Bouraima (co-fondateur Python Togo), Irene Amedji (IT & Community manager).',
];

function keyOf(value: string): string {
  return value.trim().toLowerCase();
}

function mergeBy<T>(primary: T[], extra: T[], key: (item: T) => string): T[] {
  const seen = new Set(primary.map(key).filter(Boolean));
  const more = extra.filter((item) => {
    const k = key(item);
    return k && !seen.has(k);
  });
  return more.length === 0 ? primary : [...primary, ...more];
}

export function mergeUniqueStrings(primary: string[], extra: string[]): string[] {
  const seen = new Set(primary.map(keyOf));
  const out = [...primary];
  for (const item of extra) {
    const k = keyOf(item);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function withKnowledge(facts: PortfolioFacts): PortfolioFacts {
  const p = facts.profile;
  return {
    ...facts,
    profile: {
      ...p,
      full_name: p.full_name || KNOWLEDGE_PROFILE.full_name,
      aliases: p.aliases?.length ? p.aliases : KNOWLEDGE_PROFILE.aliases,
      hero_title: p.hero_title || KNOWLEDGE_PROFILE.hero_title,
      headline: p.headline || KNOWLEDGE_PROFILE.headline,
      bio: p.bio && p.bio.length > 80 ? p.bio : KNOWLEDGE_PROFILE.bio,
      location: p.location || KNOWLEDGE_PROFILE.location,
      email: p.email || KNOWLEDGE_PROFILE.email,
      phone: p.phone || KNOWLEDGE_PROFILE.phone,
      phones: p.phones?.length ? p.phones : KNOWLEDGE_PROFILE.phones,
      whatsapp: p.whatsapp || KNOWLEDGE_PROFILE.whatsapp,
      linkedin_url: normalizeLinkedIn(p.linkedin_url) || KNOWLEDGE_PROFILE.linkedin_url,
      twitter_url: p.twitter_url || KNOWLEDGE_PROFILE.twitter_url,
      github_url: p.github_url || KNOWLEDGE_PROFILE.github_url,
      availability_text: p.availability_text || KNOWLEDGE_PROFILE.availability_text,
      experience_badge: p.experience_badge || KNOWLEDGE_PROFILE.experience_badge,
    },
    projects: mergeBy(facts.projects, KNOWLEDGE_PROJECTS, (item) => keyOf(item.title)),
    experiences: mergeBy(facts.experiences, KNOWLEDGE_EXPERIENCES, (item) => keyOf(item.company)),
    communities: mergeBy(facts.communities, KNOWLEDGE_COMMUNITIES, (item) => keyOf(item.name)),
    skills: mergeUniqueStrings(
      facts.skills,
      [...KNOWLEDGE_SKILLS, ...KNOWLEDGE_SOFT_SKILLS]
    ),
    faq: facts.faq?.length ? facts.faq : KNOWLEDGE_FAQ,
    notes: facts.notes?.length ? facts.notes : KNOWLEDGE_NOTES,
  };
}

export function normalizeLinkedIn(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/linkedin\.com\/in\/chaminadeadjolou/i.test(trimmed)) {
    return 'https://www.linkedin.com/in/chaminadeadjolou';
  }
  return trimmed;
}
