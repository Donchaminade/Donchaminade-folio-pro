import { Stat, Skill, Experience, Project, Community, Education, Testimonial, ManagedPage, Award, GalleryImage, Client } from './types';

export const STATS: Stat[] = [
  { label: "Expérience Web", value: '3', suffix: 'ans+' },
  { label: 'Expérience Mobile', value: '2', suffix: 'an' },
  { label: 'Comm. Digitale', value: '2', suffix: 'ans' },
  { label: 'Projets Impactants', value: '10', suffix: '+' }
];

export const TECH_ICONS: Record<string, string> = {
  'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'Dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Tailwind': 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'Figma': 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'Supabase': 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg',
  'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'GitHub': 'https://www.vectorlogo.zone/logos/github/github-icon.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'Agile': 'https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg',
  'Intelligence Artificielle': 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg',
  'Marketing Digital': 'https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg',
  'Creation Visuelle': 'https://www.vectorlogo.zone/logos/adobe_illustrator/adobe_illustrator-icon.svg',
};

export const SKILLS: Skill[] = [
  { name: 'Flutter', icon: TECH_ICONS['Flutter'], category: 'Mobile' },
  { name: 'React', icon: TECH_ICONS['React'], category: 'Web' },
  { name: 'Laravel', icon: TECH_ICONS['Laravel'], category: 'Backend' },
  { name: 'Supabase', icon: TECH_ICONS['Supabase'], category: 'Backend' },
  { name: 'Next.js', icon: TECH_ICONS['Next.js'], category: 'Web' },
  { name: 'TypeScript', icon: TECH_ICONS['TypeScript'], category: 'Langage' },
  { name: 'PHP', icon: TECH_ICONS['PHP'], category: 'Langage' },
  { name: 'MySQL', icon: TECH_ICONS['MySQL'], category: 'Database' },
  { name: 'Firebase', icon: TECH_ICONS['Firebase'], category: 'Backend' },
  { name: 'PostgreSQL', icon: TECH_ICONS['PostgreSQL'], category: 'Database' },
  { name: 'Git', icon: TECH_ICONS['Git'], category: 'Tools' },
  { name: 'GitHub', icon: TECH_ICONS['GitHub'], category: 'Tools' },
  { name: 'Bootstrap', icon: TECH_ICONS['Bootstrap'], category: 'Web' },
  { name: 'Tailwind', icon: TECH_ICONS['Tailwind'], category: 'Design' },
  { name: 'Figma', icon: TECH_ICONS['Figma'], category: 'Design' },
];

export const EXPERIENCES: Experience[] = [
  {
    company: 'Efficorpe',
    role: 'Développeur Mobile',
    period: 'Août 2025 - Octobre 2025',
    tags: ['Flutter', 'Dart', 'Firebase', 'Agile'],
    description: [
      'Création et intégration d’interfaces mobiles interactives sous Flutter.',
      'Optimisation du code et correction des anomalies techniques.',
      'Collaboration en équipe Agile pour le développement des projets mobiles.'
    ]
  },
  {
    company: 'ISF | WTM | Ecobank | GDG',
    role: 'Formateur en Informatique',
    period: 'Juillet 2025 - Octobre 2025',
    tags: ['Intelligence Artificielle', 'TypeScript', 'Tailwind', 'Git'],
    description: [
      'Animation d’ateliers sur l’IA, les réseaux sociaux et le développement web pour divers publics (Ecobank, ISF).',
      'Conception de supports pédagogiques interactifs favorisant l’apprentissage pratique.',
      'Accompagnement personnalisé des apprenants dans la mise en pratique d’outils numériques modernes.'
    ]
  },
  {
    company: 'Axone Digital Company',
    role: 'Développeur Web/Mobile',
    period: 'Décembre 2024 - Juillet 2025',
    tags: ['React', 'Next.js', 'Node.js', 'Tailwind', 'PostgreSQL'],
    description: [
      'Réalisation d’applications web et mobiles dynamiques à forte valeur ajoutée.',
      'Amélioration de la stabilité front-end et back-end pour garantir une expérience utilisateur fluide.',
      'Collaboration étroite avec les équipes produit pour l’intégration de fonctionnalités complexes.'
    ]
  },
  {
    company: 'Hyver | Python Togo | ABC',
    role: 'Social Media & Community Manager',
    period: 'Depuis 2024 (Saisonnier)',
    tags: ['Marketing Digital', 'Creation Visuelle', 'Python', 'Git'],
    description: [
      'Gestion stratégique et animation des réseaux sociaux pour accroître la visibilité communautaire.',
      'Création de visuels et de contenus vidéo attractifs adaptés aux audiences tech.',
      'Suivi des performances et interaction continue avec les membres des différentes communautés.'
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    title: 'AI228 (Open Source)',
    description: 'Projet communautaire recensant les outils IA pour faciliter leur adoption au quotidien.',
    detailedDescription: 'AI228 est une plateforme centralisée conçue pour l\'écosystème tech togolais. Elle agit comme un hub recensant les outils d\'intelligence artificielle les plus pertinents, classés par cas d\'utilisation. Le projet est entièrement open-source pour encourager la contribution locale et la transparence.',
    tags: ['React', 'Next.js', 'Tailwind', 'Supabase'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    ],
    link: 'https://ai228.com',
    github: 'https://github.com/Donchaminade/ai228',
    type: 'Web'
  },
  {
    title: 'Efficorpe App',
    description: 'Solution mobile haute performance pour le suivi et l\'optimisation des flux de travail.',
    detailedDescription: 'Développement d\'une application mobile robuste destinée aux entreprises souhaitant digitaliser leurs processus métier. L\'application inclut des tableaux de bord interactifs, une gestion des notifications temps réel via Firebase et une architecture optimisée pour la scalabilité.',
    tags: ['Flutter', 'Dart', 'Firebase', 'State Management'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    ],
    link: 'https://efficorpe.io',
    github: 'https://github.com/Donchaminade/efficorpe-mobile',
    type: 'Mobile'
  },
  {
    title: 'Axone B2B Dashboard',
    description: 'Interface de gestion administrative et analytique pour partenaires institutionnels.',
    detailedDescription: 'Conception et réalisation d\'un dashboard analytique complexe. Utilisation de bibliothèques de visualisation de données avancées, intégration d\'une authentification sécurisée et optimisation des requêtes PostgreSQL pour gérer de gros volumes de données.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Charts.js'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://axone-digital.net/demo',
    github: '#',
    type: 'Web'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Chaminade est un développeur exceptionnel. Sa capacité à transformer des concepts complexes en interfaces Flutter fluides a été un atout majeur pour notre projet Efficorpe.",
    name: "Koffi Mensah",
    role: "Lead Developer",
    company: "Efficorpe",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "En tant que formateur, il sait transmettre sa passion pour l'IA et le web avec une clarté remarquable. Ses ateliers sont toujours très appréciés des étudiants.",
    name: "Abla Doe",
    role: "Responsable Pédagogique",
    company: "ISF Informatique",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "Sa polyvalence entre le développement et la gestion communautaire est rare. Il a su dynamiser notre présence digitale tout en fournissant un code de qualité chez Axone.",
    name: "Jean-Pierre Kouakou",
    role: "Product Manager",
    company: "Axone Digital",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  }
];

export const MANAGED_PAGES: ManagedPage[] = [
  {
    name: "Python Togo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    link: "https://www.linkedin.com/company/python-togo/",
    followers: "1k+",
    category: "Communauté Tech"
  },
  {
    name: "GDG Lomé",
    logo: "https://www.gstatic.com/devrel-devsite/prod/vc893708466e31e515d90616b3f7495b46e393b6e76d99723223087268d813470/developers/images/touchicon-180.png",
    link: "https://www.linkedin.com/company/gdglome/",
    followers: "2k+",
    category: "Google Developer Groups"
  },
  {
    name: "WTM Lomé",
    logo: "https://developers.google.com/static/community/wtm/images/wtm-logo.png",
    link: "https://www.linkedin.com/showcase/wtmlome/",
    followers: "800+",
    category: "Women Techmakers"
  },
  {
    name: "Hyver",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100",
    link: "#",
    followers: "500+",
    category: "Startup Agency"
  }
];

export const COMMUNITIES: Community[] = [
  {
    name: 'Women Techmakers',
    logo: '👩‍💻',
    role: 'Mentor & Logistique',
    description: 'En tant que mentor chez WTM Lomé, je soutiens activement les initiatives visant à réduire la fracture numérique de genre. Je participe à l\'organisation logistique des meetups mensuels et j\'accompagne les jeunes femmes dans leur initiation au code et aux outils du numérique.'
  },
  {
    name: 'Google Developer Groups',
    logo: '🌐',
    role: 'Speaker & Organisateur',
    description: 'Membre actif du GDG Lomé, j\'interviens régulièrement en tant que speaker sur des thématiques liées à Flutter et Firebase. J\'aide également à la coordination d’événements majeurs comme le DevFest, favorisant le partage de connaissances tech au sein de l\'écosystème local.'
  },
  {
    name: 'Python Togo',
    logo: '🐍',
    role: 'Social Media & Logistique',
    description: 'Je contribue au rayonnement de Python Togo en gérant leur stratégie de contenu sur les réseaux sociaux. Mon rôle est de vulgariser le langage Python auprès des étudiants et des professionnels, tout en assurant le support logistique lors des ateliers pratiques.'
  }
];

export const EDUCATION: Education[] = [
  {
    degree: 'Licence Professionnelle',
    field: 'Système d’Information & Développement d’Application',
    school: 'Lomé Business School',
    year: '2024'
  },
  {
    degree: 'BTS Informatique de Gestion',
    field: 'Développement d’Application',
    school: 'Ecole Polytechnique DEFITECH',
    year: '2023'
  }
];

export const AWARDS: Award[] = [
  {
    title: "Vainqueur Hackathon Tech228",
    issuer: "Ministère de l'Économie Numérique",
    year: "2024",
    description: "Premier prix pour le développement d'une solution de gestion des déchets connectée."
  },
  {
    title: "Mentor de l'année WTM",
    issuer: "Women Techmakers Togo",
    year: "2023",
    description: "Reconnaissance pour l'engagement dans l'éducation tech des jeunes femmes."
  },
  {
    title: "Top 10 Innovateurs Digitaux",
    issuer: "Cinaf",
    year: "2023",
    description: "Sélectionné parmi les 10 meilleurs profils tech influents du pays."
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    caption: "Session de formation Google Developer Groups"
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    caption: "Hackathon 2024 - Présentation du projet"
  },
  {
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
    caption: "Meetup Python Togo"
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    caption: "Atelier Women Techmakers"
  }
];

export const CLIENTS: Client[] = [
  { name: 'Efficorpe', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100' },
  { name: 'Ecobank', logo: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=100' },
  { name: 'GDG', logo: 'https://www.gstatic.com/devrel-devsite/prod/vc893708466e31e515d90616b3f7495b46e393b6e76d99723223087268d813470/developers/images/touchicon-180.png' },
  { name: 'Axone', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=100' },
  { name: 'Python Togo', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' },
  { name: 'ISF', logo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=100' }
];

export const RELATIONNELLES = [
  "Leadership & Organisation",
  "Communication Claire & Efficace",
  "Esprit d’Équipe & Collaboration",
  "Créativité & Innovation",
  "Adaptabilité & Apprentissage Rapide",
  "Gestion du Stress & Rigueur",
  "Esprit d’Initiative & Autonomie",
  "Facultés Pédagogiques"
];