import type {
  ChatAwardFact,
  ChatCommunityFact,
  ChatExperienceFact,
  ChatProjectFact,
  ChatTestimonialFact,
} from './types';

/** Snapshot public (sans constants.tsx) pour la fonction Vercel. */
export const CATALOG_PROJECTS: ChatProjectFact[] = [
  {
    "title": "PICON",
    "description": "Application mobile innovante développée en 2026.",
    "detailedDescription": "Conception et développement d'une application mobile complète sur mesure. Elle vise à optimiser les processus dimpression de photos en ligne avec integration de moyens de paiementet à offrir une expérience utilisateur exceptionnelle.",
    "tags": [
      "Flutter",
      "Dart"
    ],
    "type": "Mobile",
    "link": "https://photopicon.vercel.app",
    "github": "https://github.com/Donchaminade/photopicon"
  },
  {
    "title": "Tayba Market ERP",
    "description": "Système complet de gestion commerciale pour Tayba Market.",
    "detailedDescription": "Logiciel sur-mesure (SaaS) conçu pour digitaliser entièrement l'activité : gestion des ventes, suivi des stocks en temps réel, fidélisation clients, gestion des caissiers et clôtures de caisses.",
    "tags": [
      "React",
      "Node.js",
      "ERP",
      "Digitalisation"
    ],
    "type": "Web",
    "link": "#",
    "github": "#"
  },
  {
    "title": "La 8e Tranche",
    "description": "Site web pour le restaurant La 8e Tranche à Lomé.",
    "detailedDescription": "Une expérience culinaire ivoiro-togolaise authentique dans un cadre chaleureux et raffiné. Le site permet de découvrir le menu, de lire les avis et de réserver une table.",
    "tags": [
      "React",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://8-me-tranche-delights.vercel.app",
    "github": "#"
  },
  {
    "title": "RachCargo",
    "description": "Plateforme d'expédition premium de colis par voie aérienne.",
    "detailedDescription": "Service d'expédition rapide et certifié depuis le Togo, Bénin et Ghana vers le monde entier. Transport sécurisé avec suivi de colis en temps réel.",
    "tags": [
      "Next.js",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://rachcargo.vercel.app/",
    "github": "#"
  },
  {
    "title": "Africa Power Platform",
    "description": "Le premier sommet dédié à Microsoft Power Platform en Afrique de l'Ouest.",
    "detailedDescription": "Une initiative panafricaine pour éduquer, connecter et impacter (Édition 2024 - Cotonou, Bénin).",
    "tags": [
      "React",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://africapowerplateform.vercel.app/",
    "github": "#"
  },
  {
    "title": "PayFlex",
    "description": "Solution de paiement flexible pour les apprentis et artisans.",
    "detailedDescription": "Plateforme innovante dédiée aux artisans pour faciliter la gestion financière et les paiements échelonnés de leurs apprentis.",
    "tags": [
      "React",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://pay-flex.vercel.app/",
    "github": "https://github.com/Donchaminade/PayFlex"
  },
  {
    "title": "AI228 (Open Source)",
    "description": "Projet communautaire recensant les outils IA pour faciliter leur adoption au quotidien.",
    "detailedDescription": "AI228 est une plateforme centralisée conçue pour l'écosystème tech togolais. Elle agit comme un hub recensant les outils d'intelligence artificielle les plus pertinents, classés par cas d'utilisation. Le projet est entièrement open-source pour encourager la contribution locale et la transparence.",
    "tags": [
      "Github",
      "Git",
      "Next.js",
      "Tailwind",
      "json"
    ],
    "type": "Web",
    "link": "https://ai228-hub.vercel.app/",
    "github": "https://github.com/Donchaminade/ai228-hub/"
  },
  {
    "title": "Nutripack",
    "description": "Plateforme e-Commerce de vente de produits alimentaires bio.",
    "detailedDescription": "Nutripack est une plateforme e-commerce spécialisée dans la vente de produits alimentaires bio. Elle offre une solution simple et rapide pour les utilisateurs souhaitant acheter des produits frais et sains, avec une livraison à domicile.",
    "tags": [
      "Next.js",
      "Tailwind",
      "Supabase",
      "json"
    ],
    "type": "Web",
    "link": "https://nutripack.vercel.app/",
    "github": "https://github.com/Donchaminade/nutripack/"
  },
  {
    "title": "Ratoufa",
    "description": "Solution mobile de gestion des commandes et de réservation de tickets pour événements.",
    "detailedDescription": "Développement d’une application mobile permettant la gestion des commandes et la réservation de tickets pour des événements, offrant une solution digitale fiable pour les organisateurs et une expérience simple et rapide pour les utilisateurs.",
    "tags": [
      "Flutter",
      "Dart",
      "Agile"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "#"
  },
  {
    "title": "Locafrica",
    "description": "Solution mobile de location des chambres/maisons et de réservation en afrique.",
    "detailedDescription": "Développement des interfaces mobiles permettant de trouver les chambres/maisons dispo, voir sa localisation et se rendre ou de faire simplement la réservation offrant une solution rapide pour les utilisateurs.",
    "tags": [
      "Flutter",
      "Dart",
      "Agile"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "#"
  },
  {
    "title": "Axone Digital Company",
    "description": "Mise en place du site vitrine de l'entreprise Axone Digital Company.",
    "detailedDescription": "Conception et réalisation d’un site vitrine dédié au branding de l’entreprise, mettant en valeur son identité visuelle, ses services et sa vision. Le site a été pensé pour offrir une expérience utilisateur fluide, un design moderne et une navigation claire, afin de renforcer la crédibilité de la marque et sa présence en ligne.",
    "tags": [
      "Bootstrap",
      "HTML",
      "CSS",
      "javascript"
    ],
    "type": "Web",
    "link": "https://axone-digital.net/demo",
    "github": "#"
  },
  {
    "title": "Akontaa App",
    "description": "Application mobile de gestion des dettes et redevances.",
    "detailedDescription": "Conception et développement d’une application mobile dédiée à la gestion des dettes et redevances. Akontaa permet aux utilisateurs de suivre, enregistrer et organiser leurs créances de manière simple et intuitive. L’application met l’accent sur une expérience utilisateur fluide, une interface moderne et une navigation optimisée pour un usage quotidien.",
    "tags": [
      "Flutter",
      "Dart",
      "Tailwind"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "https://github.com/Donchaminade/akontaa_v2"
  },
  {
    "title": "48 lois app vf",
    "description": "Application mobile des 48 lois du pouvoir de Robert Greene.",
    "detailedDescription": "Une application Anglaise existante reproduite fidelement en Francais, la toute 1ere au Togo avec des apports personnels comme des exemples concrets afin d'aider les lecteurs a mieux comprendre chaque lois, avec une fonctionnalite de notification journaliere selon le paraetrage de chaque utilisateur.",
    "tags": [
      "Flutter",
      "Dart"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "https://github.com/Donchaminade/48laws"
  },
  {
    "title": "PROCOPE Afrique",
    "description": "Site vitrine du Centre Incubateur PROCOPE Afrique.",
    "detailedDescription": "Conception et personnalisation d’un site web vitrine pour le Centre Incubateur PROCOPE Afrique, à partir d’un modèle de site statique. Le site a été adapté pour répondre aux besoins spécifiques du centre, en mettant en avant sa mission, ses programmes d’incubation et ses activités. Une attention particulière a été portée au branding, à la clarté des contenus et à l’expérience utilisateur.",
    "tags": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "type": "Web",
    "link": "https://www.procopeafrique.org",
    "github": "https://github.com/Donchaminade/procope-afrique"
  },
  {
    "title": "AndyKC",
    "description": "Site vitrine des services de consulting, accompagnement et suivis.",
    "tags": [
      "React",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://andykc.com",
    "github": "https://github.com/Donchaminade/andykc"
  },
  {
    "title": "TwinFlow",
    "description": "Sidecar base de données : lisse les pics d’écriture PostgreSQL et sert les lectures non critiques depuis un miroir local.",
    "detailedDescription": "TwinFlow s’interpose devant PostgreSQL : pool borné, file d’écriture et miroir SQLite synchronisé en environ une seconde. API HTTP JSON, indépendante du langage. La base centrale reste la source de vérité.",
    "tags": [
      "Go",
      "PostgreSQL",
      "SQLite",
      "Docker"
    ],
    "type": "Web",
    "link": "https://twinflow-eosin.vercel.app",
    "github": "https://github.com/Donchaminade/twinflow"
  },
  {
    "title": "Togo Communities Hub",
    "description": "Annuaire public qui recense, valorise et connecte les communautés du Togo.",
    "detailedDescription": "Vitrine des communautés togolaises (tech, culture, sport, citoyenneté) : fiches riches, contacts des leads, espace d’administration et signalements.",
    "tags": [
      "React",
      "TypeScript",
      "Tailwind"
    ],
    "type": "Web",
    "link": "https://togo-communities-hub.vercel.app",
    "github": "https://github.com/Donchaminade/togo-communities-hub"
  },
  {
    "title": "TogoSaaS",
    "description": "Hub qui recense les SaaS togolais, filtrable par ville et thématique.",
    "detailedDescription": "Annuaire public des produits SaaS du Togo, avec fiches détaillées, espace lead, modération et signalements. Stack React + TypeScript, API PHP/MySQL.",
    "tags": [
      "React",
      "TypeScript",
      "PHP",
      "MySQL"
    ],
    "type": "Web",
    "link": "https://togosaas.vercel.app",
    "github": "https://github.com/Donchaminade/togosaas"
  },
  {
    "title": "Optibloc",
    "description": "Site vitrine d’Optibloc, conçu et déployé pour présenter l’offre en ligne.",
    "detailedDescription": "Site vitrine moderne pour Optibloc : mise en avant de l’identité, des services et du parcours utilisateur, déployé sur Vercel.",
    "tags": [
      "React",
      "TypeScript",
      "Vite"
    ],
    "type": "Web",
    "link": "https://optibloc.vercel.app",
    "github": "https://github.com/Donchaminade/Optibloc"
  },
  {
    "title": "IEPP Tsévié",
    "description": "Plateforme web réalisée pour l’inspection de l’enseignement (IEPP Tsévié).",
    "detailedDescription": "Projet institutionnel pour l’IEPP Tsévié : digitalisation des processus de l’inspection et mise à disposition d’un site opérationnel.",
    "tags": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "type": "Web",
    "link": "https://iepp-tsevie.vercel.app",
    "github": "https://github.com/Donchaminade/IEPP_TSEVIE"
  },
  {
    "title": "CoachFlow",
    "description": "Application mobile de coaching IA : personas expertes, contexte personnel et conversation vocale.",
    "detailedDescription": "CoachFlow démocratise le coaching personnel via des personas IA, un contexte unique et Llama 3.1. Offline-first, biométrie, backend Supabase. Démo publique non publiée à ce jour.",
    "tags": [
      "Flutter",
      "Dart",
      "Supabase",
      "Riverpod"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "https://github.com/Donchaminade/CoachFlow"
  },
  {
    "title": "HorusSight",
    "description": "Plateforme d’intelligence cybersécurité : scan, tableau de bord et rapports IA.",
    "detailedDescription": "HorusSight relie un moteur de scan Python à un centre de commande Next.js. L’assistant EWABA (Gemini) transforme les findings en rapports métier. Démo publique non publiée à ce jour.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Python",
      "Tailwind"
    ],
    "type": "Web",
    "link": "#",
    "github": "https://github.com/Donchaminade/HorusSight"
  },
  {
    "title": "CredHub",
    "description": "Coffre-fort d’identifiants 100 % local, chiffré, mobile et web.",
    "detailedDescription": "Gestionnaire de credentials hors cloud : les secrets restent sur l’appareil. Flutter multiplateforme. Aucune démo hébergée — le produit est pensé pour rester privé.",
    "tags": [
      "Flutter",
      "Dart",
      "Sécurité"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "https://github.com/Donchaminade/CredHub"
  },
  {
    "title": "ConseilBox",
    "description": "Application mobile de partage de conseils et d’expériences, avec API PHP.",
    "detailedDescription": "ConseilBox permet de découvrir, proposer et mettre en favoris des conseils. Frontend Flutter, backend API PHP. Pas d’URL publique de production à ce jour.",
    "tags": [
      "Flutter",
      "Dart",
      "PHP"
    ],
    "type": "Mobile",
    "link": "#",
    "github": "https://github.com/Donchaminade/conseilbox"
  },
  {
    "title": "Grosbit",
    "description": "Site web de GROSBIT, entreprise d’infrastructures et de solutions IT.",
    "detailedDescription": "Refonte du site de GROSBIT SARLU : présentation de l’entreprise, des services réseau et de l’accompagnement technique.",
    "tags": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "type": "Web",
    "link": "https://grosbit.vercel.app",
    "github": "https://github.com/Donchaminade/grosbit"
  }
];

export const CATALOG_EXPERIENCES: ChatExperienceFact[] = [
  {
    "company": "GROSBIT SARLU",
    "role": "IT Support, Développeur Web & Mobile",
    "period": "Février 2026 - Présent",
    "description": [
      "Assistance technique (IT Support) et assistance au déploiement de solutions réseau pour les clients (entreprise partenaire Cisco).",
      "Développement d’applications web et mobiles (Next.js, Flutter).",
      "Maintien en conditions opérationnelles des infrastructures et assistance à la résolution des incidents."
    ],
    "tags": [
      "Cisco",
      "Support IT",
      "Next.js",
      "Flutter",
      "Remote"
    ]
  },
  {
    "company": "PyCon Togo 2026",
    "role": "Bénévole — Chargé des Speakers",
    "period": "2026",
    "description": [
      "Coordination de l’accueil des intervenants de PyCon Togo 2026 : arrivées, départs et suivi tout au long de la conférence.",
      "Organisation du transport depuis la frontière et de la logistique speakers sur site.",
      "Accompagnement des speakers internationaux et locaux pour garantir une expérience fluide et professionnelle."
    ],
    "tags": [
      "Logistique",
      "Événementiel",
      "Python",
      "Bénévolat"
    ]
  },
  {
    "company": "48h Hackathon YAS Togo | Next Gen",
    "role": "Coach",
    "period": "2026",
    "description": [
      "Coaching des équipes participantes au 48h Hackathon YAS Togo et à Next Gen.",
      "Accompagnement sur le cadrage produit, les choix techniques et la préparation du pitch.",
      "Transmission de méthodes de travail pour livrer un prototype viable dans un temps contraint."
    ],
    "tags": [
      "Coaching",
      "Hackathon",
      "Mentorat"
    ]
  },
  {
    "company": "Tayba Market",
    "role": "Consultant IT & Lead Tech",
    "period": "2025",
    "description": [
      "Accompagnement dans la digitalisation globale des processus de travail et le choix des infrastructures.",
      "Audit technique et conseil sur l’adoption d’outils informatiques adaptés aux besoins du métier.",
      "Développement et mise en place d’une application complète de gestion (Ventes, Stocks, Clients, Caisses)."
    ],
    "tags": [
      "Digitalisation",
      "Audit IT",
      "ERP",
      "Management"
    ]
  },
  {
    "company": "Efficorpe",
    "role": "Développeur Frontend Mobile",
    "period": "Août 2025 - Octobre 2025",
    "description": [
      "Création et intégration d’interfaces mobiles interactives sous Flutter.",
      "Optimisation du code et correction des anomalies techniques.",
      "Collaboration en équipe Agile pour le développement des projets mobiles."
    ],
    "tags": [
      "Flutter",
      "Dart",
      "Supabase",
      "Agile"
    ]
  },
  {
    "company": "ISF | WTM | Ecobank | GDG",
    "role": "Formateur en Informatique",
    "period": "Juillet 2025 - Octobre 2025",
    "description": [
      "Animation d’ateliers sur l’IA, les réseaux sociaux et le développement web pour divers publics.",
      "Conception de supports pédagogiques interactifs favorisant l’apprentissage pratique.",
      "Accompagnement personnalisé des apprenants dans la mise en pratique d’outils numériques modernes."
    ],
    "tags": [
      "Intelligence Artificielle",
      "Word",
      "Python",
      "VScode"
    ]
  },
  {
    "company": "Axone Digital Company",
    "role": "Développeur Web/Mobile",
    "period": "Décembre 2024 - Juillet 2025",
    "description": [
      "Réalisation d’applications web et mobiles dynamiques à forte valeur ajoutée.",
      "Amélioration de la stabilité front-end et back-end pour garantir une expérience utilisateur fluide.",
      "Collaboration étroite avec les équipes produit pour l’intégration de fonctionnalités complexes."
    ],
    "tags": [
      "Php",
      "TypeScript",
      "Next.js",
      "MySQL",
      "Tailwind",
      "PostgreSQL"
    ]
  },
  {
    "company": "Hyver | Python Togo | ABC",
    "role": "Social Media & Community Manager",
    "period": "Depuis 2024 (Saisonnier)",
    "description": [
      "Gestion stratégique et animation des réseaux sociaux pour accroître la visibilité communautaire.",
      "Création de visuels et de contenus vidéo attractifs adaptés aux audiences tech.",
      "Suivi des performances et interaction continue avec les membres des différentes communautés.",
      "Mobilisation de plus de 600 participants lors d’événements tech locaux."
    ],
    "tags": [
      "Marketing Digital",
      "Creation Visuelle",
      "Agile"
    ]
  }
];

export const CATALOG_TESTIMONIALS: ChatTestimonialFact[] = [
  {
    "quote": "Chaminade est un développeur exceptionnel. Sa capacité à transformer des concepts complexes en interfaces Flutter fluides a été un atout majeur pour notre projet Efficorpe.",
    "name": "Koffi Mensah",
    "role": "Lead Developer",
    "company": "Efficorpe"
  },
  {
    "quote": "En tant que formateur, il sait transmettre sa passion pour l'IA et le web avec une clarté remarquable. Ses ateliers sont toujours très appréciés des étudiants.",
    "name": "Abla Doe",
    "role": "Responsable Pédagogique",
    "company": "ISF Informatique"
  },
  {
    "quote": "Sa polyvalence entre le développement et la gestion communautaire est rare. Il a su dynamiser notre présence digitale tout en fournissant un code de qualité chez Axone.",
    "name": "Jean-Pierre Kouakou",
    "role": "Product Manager",
    "company": "Axone Digital"
  }
];

export const CATALOG_COMMUNITIES: ChatCommunityFact[] = [
  {
    "name": "PyCon Togo",
    "role": "Chargé des Speakers — 2026",
    "description": "Bénévole chargé des speakers pour PyCon Togo 2026 : arrivées, départs, transport depuis la frontière et accompagnement logistique des intervenants tout au long de la conférence."
  },
  {
    "name": "Women Techmakers",
    "role": "Mentor & Logistique",
    "description": "En tant que mentor chez WTM Lomé, je soutiens activement les initiatives visant à réduire la fracture numérique de genre. Je participe à l'organisation logistique des meetups mensuels et j'accompagne les jeunes femmes dans leur initiation au code et aux outils du numérique."
  },
  {
    "name": "Google Developer Groups",
    "role": "Speaker & Organisateur",
    "description": "Membre actif du GDG Lomé, j'interviens régulièrement en tant que speaker sur des thématiques liées à Flutter et Firebase. J'aide également à la coordination d’événements majeurs comme le DevFest, favorisant le partage de connaissances tech au sein de l'écosystème local."
  },
  {
    "name": "Python Togo",
    "role": "Social Media & Logistique",
    "description": "Je contribue au rayonnement de Python Togo en gérant leur stratégie de contenu sur les réseaux sociaux. Mon rôle est de vulgariser le langage Python auprès des étudiants et des professionnels, tout en assurant le support logistique lors des ateliers pratiques."
  }
];

export const CATALOG_AWARDS: ChatAwardFact[] = [
  {
    "title": "Coorganisateur Hackathon MLH",
    "issuer": "Major League Hacking Togo",
    "year": "2025",
    "description": "Coorganisation de l'événement qui a réuni plus de 50 participants locaux."
  },
  {
    "title": "1er Prix Hackathon Ecole IA",
    "issuer": "ACAN",
    "year": "2025",
    "description": "Récompensé pour le projet Hletitii (gestion des locations et des paiements mensuels)."
  },
  {
    "title": "2e Prix AssurTech & Coup de cœur",
    "issuer": "CSIS",
    "year": "2025",
    "description": "2e prix et projet coup de coeur lors du hackathon AssurTech."
  },
  {
    "title": "2e Prix Projet Innov",
    "issuer": "Lomé Business School",
    "year": "2025",
    "description": "Reconnaissance pour la présentation d'un projet innovant."
  }
];

export const CATALOG_EDUCATION: string[] = [
  "Licence Professionnelle — Système d’Information & Développement d’Application, Lomé Business School (2024)",
  "BTS Informatique de Gestion — Développement d’Application, Ecole Polytechnique DEFITECH (2023)"
];

export const CATALOG_SKILLS: string[] = [
  "Flutter",
  "React",
  "Laravel",
  "Supabase",
  "Next.js",
  "TypeScript",
  "PHP",
  "MySQL",
  "PostgreSQL",
  "Git",
  "GitHub",
  "Bootstrap",
  "Tailwind",
  "Figma",
  "Canva",
  "Leadership & Organisation",
  "Communication Claire & Efficace",
  "Esprit d’Équipe & Collaboration",
  "Créativité & Innovation",
  "Adaptabilité & Apprentissage Rapide",
  "Gestion du Stress & Rigueur",
  "Esprit d’Initiative & Autonomie",
  "Facultés Pédagogiques"
];
