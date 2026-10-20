import type { Lang } from './dictionary';

export type Bi = Record<Lang, string>;
const b = (fr: string, en: string): Bi => ({ fr, en });
const lines = (fr: string[], en: string[]): Record<Lang, string[]> => ({ fr, en });

export const profile = {
  fullName: 'ADJOLOU Dondah Chaminade',
  heroTitle: b('Développeur Web & Mobile.', 'Web & Mobile Developer.'),
  heroSubtitle: b('Ambassadeur SpaceXAI | Co-organisateur GDG Lomé', 'SpaceXAI ambassador | GDG Lomé co-organiser'),
  bio: b(
    'Ingénieur IT passionné, je conçois et déploie des solutions numériques sur mesure.',
    'An IT engineer, I design and ship tailored digital products.',
  ),
  availability: b('Disponible pour de nouveaux défis', 'Open to new challenges'),
  experienceBadge: '4+ ans',
  experienceBadgeEn: '4+ yrs',
  email: 'chaminade.dondah.adjolou@gmail.com',
  phone: '+22899181626',
  phoneDisplay: '+228 99 18 16 26',
  whatsapp: 'https://wa.me/22899181626',
  linkedin: 'https://linkedin.com/in/chaminadeadjolou',
  twitter: 'https://x.com/Donchaminade',
  github: 'https://github.com/Donchaminade',
  cv: '/img/CV_ADJOLOU_DONDAH_CHAMINADE.pdf',
  photo: '/img/portrait-cutout.png',
  year: '2026',
};

export const roles = ['Web', 'Mobile', 'Flutter', 'Next.js'];

export const skillRows = [
  ['Flutter', 'React', 'Laravel', 'Supabase', 'Next.js', 'TypeScript', 'PHP', 'MySQL'],
  ['PostgreSQL', 'Git', 'GitHub', 'Bootstrap', 'Tailwind', 'Figma', 'Canva'],
  [
    b('Leadership & Organisation', 'Leadership & organisation'),
    b('Communication claire & efficace', 'Clear, effective communication'),
    b('Esprit d’équipe & collaboration', 'Teamwork & collaboration'),
    b('Créativité & innovation', 'Creativity & innovation'),
  ],
  [
    b('Adaptabilité & apprentissage rapide', 'Adaptability & fast learning'),
    b('Gestion du stress & rigueur', 'Stress management & rigor'),
    b('Esprit d’initiative & autonomie', 'Initiative & autonomy'),
    b('Facultés pédagogiques', 'Teaching ability'),
  ],
];

export const softSkills: { title: Bi; impact: Bi }[] = [
  { title: b('Pensée analytique & résolution de problèmes complexes', 'Analytical thinking & complex problem solving'), impact: b('Diagnostic technique structuré, debugging méthodique, analyse causale et approche orientée solution.', 'Structured diagnosis, methodical debugging, causal analysis and a solution-first approach.') },
  { title: b('Architecture thinking & vision systémique', 'Architecture thinking & systems view'), impact: b('Vision systémique, capacité à penser scalabilité et structuration claire de projets complexes.', 'A systems view, an eye for scale, and clear structure on complex projects.') },
  { title: b('Autonomie technique avancée', 'Advanced technical autonomy'), impact: b('Capacité d’auto-formation rapide, recherche proactive de solutions et apprentissage autodidacte continu.', 'Fast self-teaching, proactive research and continuous self-directed learning.') },
  { title: b('Rigueur et précision dans l’exécution', 'Rigor and precision'), impact: b('Attention au détail, sens de la sécurité et discipline technique solide.', 'Attention to detail, a sense of security and solid technical discipline.') },
  { title: b('Orientation produit & solution digitale', 'Product and digital-solution focus'), impact: b('Pensée orientée produit, compréhension des besoins utilisateurs et traduction digitale efficace.', 'Product thinking, an understanding of user needs and a clear digital translation.') },
  { title: b('Adaptabilité multi-technologies', 'Multi-technology adaptability'), impact: b('Flexibilité technique, environnement multi-stacks et adaptation rapide aux nouveaux outils.', 'Technical flexibility across stacks and fast adaptation to new tools.') },
  { title: b('Communication technique claire', 'Clear technical communication'), impact: b('Vulgarisation technique, communication structurée et forte capacité à documenter.', 'Plain-language explanations, structured communication and strong documentation.') },
  { title: b('Apprentissage continu & growth mindset', 'Continuous learning & growth mindset'), impact: b('Ambition technique constante, vision long terme et engagement vers l’excellence.', 'Steady technical ambition, a long-term view and a push toward excellence.') },
];

export const experiences: { company: string; role: Bi; period: Bi; tags: string[]; description: Record<Lang, string[]> }[] = [
  { company: 'GROSBIT SARLU', role: b('IT Support, Développeur Web & Mobile', 'IT support, web & mobile developer'), period: b('Nov. 2025 – juin 2026', 'Nov. 2025 – June 2026'), tags: ['CDD', 'Freelance', 'Remote', 'Cisco', 'Next.js', 'Flutter'], description: lines(['Assistance technique (IT Support) et assistance au déploiement de solutions réseau pour les clients (entreprise partenaire Cisco).', 'Développement d’applications web et mobiles (Next.js, Flutter).', 'Maintien en conditions opérationnelles des infrastructures et assistance à la résolution des incidents.'], ['Technical support and help deploying network solutions for clients (Cisco partner).', 'Web and mobile development (Next.js, Flutter).', 'Keeping infrastructure running and helping resolve incidents.']) },
  { company: 'Picon Studio', role: b('Développeur Frontend Mobile', 'Mobile frontend developer'), period: b('Déc. 2025 – févr. 2026', 'Dec. 2025 – Feb. 2026'), tags: ['Flutter', 'Firebase', 'Spring Boot'], description: lines(['Livraison de l’app Picon sur Google Play : 26 écrans Flutter, Firebase Auth, hors ligne.', 'Contribution au backend Spring Boot (JWT, WebSocket).'], ['Shipped the Picon app on Google Play: 26 Flutter screens, Firebase Auth, offline.', 'Contribution to the Spring Boot backend (JWT, WebSocket).']) },
  { company: 'PyCon Togo 2026', role: b('Bénévole — Chargé des Speakers', 'Volunteer — speaker liaison'), period: b('2026', '2026'), tags: ['Logistique', 'Python', 'Bénévolat'], description: lines(['Coordination de l’accueil des intervenants de PyCon Togo 2026 : arrivées, départs et suivi tout au long de la conférence.', 'Organisation du transport depuis la frontière et de la logistique speakers sur site.', 'Accompagnement des speakers internationaux et locaux.'], ['Welcomed PyCon Togo 2026 speakers: arrivals, departures and follow-up through the conference.', 'Transport from the border and on-site speaker logistics.', 'Support for international and local speakers.']) },
  { company: '48h Hackathon YAS Togo | Next Gen', role: b('Coach', 'Coach'), period: b('2026', '2026'), tags: ['Coaching', 'Hackathon', 'Mentorat'], description: lines(['Coaching des équipes participantes au 48h Hackathon YAS Togo et à Next Gen.', 'Accompagnement sur le cadrage produit, les choix techniques et la préparation du pitch.', 'Transmission de méthodes de travail pour livrer un prototype viable dans un temps contraint.'], ['Coached teams at the YAS Togo 48h Hackathon and Next Gen.', 'Product framing, technical choices and pitch preparation.', 'Working methods to ship a viable prototype under a tight deadline.']) },
  { company: 'Tayba Market', role: b('Consultant IT & Lead Tech', 'IT consultant & lead tech'), period: b('2025', '2025'), tags: ['Digitalisation', 'Audit IT', 'ERP'], description: lines(['Accompagnement dans la digitalisation globale des processus de travail et le choix des infrastructures.', 'Audit technique et conseil sur l’adoption d’outils informatiques adaptés.', 'Développement et mise en place d’une application complète de gestion (ventes, stocks, clients, caisses).'], ['Support for digitising work processes and choosing infrastructure.', 'Technical audit and advice on the right tools.', 'Built and rolled out a full management app (sales, stock, customers, tills).']) },
  { company: 'Efficorpe', role: b('Développeur Frontend Mobile · Stage', 'Mobile frontend developer · internship'), period: b('Août 2025 – octobre 2025', 'August 2025 – October 2025'), tags: ['Flutter', 'Dart', 'Supabase', 'Agile'], description: lines(['Création et intégration d’interfaces mobiles interactives sous Flutter.', 'Optimisation du code et correction des anomalies techniques.', 'Collaboration en équipe Agile pour le développement des projets mobiles.'], ['Built and integrated interactive Flutter interfaces.', 'Code optimisation and bug fixing.', 'Agile teamwork on mobile projects.']) },
  { company: 'ISF | WTM | Ecobank | GDG', role: b('Formateur en Informatique', 'IT trainer'), period: b('Juillet 2025 – octobre 2025', 'July 2025 – October 2025'), tags: ['IA', 'Word', 'Python', 'VS Code'], description: lines(['Animation d’ateliers sur l’IA, les réseaux sociaux et le développement web.', 'Conception de supports pédagogiques interactifs.', 'Accompagnement personnalisé des apprenants sur des outils numériques modernes.'], ['Workshops on AI, social networks and web development.', 'Interactive teaching materials.', 'One-to-one support on modern digital tools.']) },
  { company: 'Axone Digital Company', role: b('Développeur Web & Mobile · Stage', 'Web & mobile developer · internship'), period: b('Décembre 2024 – juillet 2025', 'December 2024 – July 2025'), tags: ['PHP', 'TypeScript', 'Next.js', 'MySQL', 'Tailwind', 'PostgreSQL'], description: lines(['Réalisation d’applications web et mobiles dynamiques.', 'Amélioration de la stabilité front-end et back-end.', 'Collaboration avec les équipes produit pour des fonctionnalités complexes.'], ['Built dynamic web and mobile applications.', 'Improved front-end and back-end stability.', 'Worked with product teams on complex features.']) },
  { company: 'Hyver | Python Togo | ABC', role: b('Social Media & Community Manager', 'Social media & community manager'), period: b('Depuis 2024 (saisonnier)', 'Since 2024 (seasonal)'), tags: ['Marketing digital', 'Création visuelle', 'Agile'], description: lines(['Gestion stratégique et animation des réseaux sociaux.', 'Création de visuels et de contenus vidéo pour des audiences tech.', 'Suivi des performances et interaction avec les membres.', 'Mobilisation de plus de 600 participants lors d’événements tech locaux.'], ['Strategy and day-to-day social media.', 'Visuals and video for tech audiences.', 'Performance tracking and member interaction.', 'Brought together more than 600 people at local tech events.']) },
];

export const awards: { title: Bi; issuer: string; year: string; description: Bi }[] = [
  { title: b('Coorganisateur Hackathon MLH', 'MLH hackathon co-organiser'), issuer: 'Major League Hacking Togo', year: '2025', description: b('Coorganisation de l’événement qui a réuni plus de 50 participants locaux.', 'Co-organised the event, which brought together more than 50 local participants.') },
  { title: b('1er Prix Hackathon École IA', '1st prize, École IA hackathon'), issuer: 'ACAN', year: '2025', description: b('Récompensé pour le projet Hletitii (gestion des locations et des paiements mensuels).', 'Awarded for Hletitii (rental management and monthly payments).') },
  { title: b('2e Prix AssurTech & Coup de cœur', '2nd prize AssurTech & jury favourite'), issuer: 'CSIS', year: '2025', description: b('2e prix et projet coup de cœur lors du hackathon AssurTech.', '2nd prize and jury favourite at the AssurTech hackathon.') },
  { title: b('2e Prix Projet Innov', '2nd prize, innovative project'), issuer: 'Lomé Business School', year: '2025', description: b('Reconnaissance pour la présentation d’un projet innovant.', 'Recognition for presenting an innovative project.') },
];

export const education: { degree: Bi; field: Bi; school: string; year: string }[] = [
  { degree: b('Licence professionnelle', 'Professional bachelor’s degree'), field: b('Système d’information & développement d’application', 'Information systems & application development'), school: 'Lomé Business School', year: '2024' },
  { degree: b('BTS Informatique de Gestion', 'BTS in business computing'), field: b('Développement d’application', 'Application development'), school: 'École Polytechnique DEFITECH', year: '2023' },
];

export const communities: { name: string; role: Bi; description: Bi }[] = [
  { name: 'PyCon Togo', role: b('Chargé des Speakers — 2026', 'Speaker liaison — 2026'), description: b('Bénévole chargé des speakers pour PyCon Togo 2026 : arrivées, départs, transport depuis la frontière et accompagnement logistique des intervenants.', 'Volunteer speaker liaison for PyCon Togo 2026: arrivals, departures, transport from the border and logistics for speakers.') },
  { name: 'Women Techmakers', role: b('Mentor & logistique', 'Mentor & logistics'), description: b('Mentor chez WTM Lomé : initiatives pour réduire la fracture numérique de genre, logistique des meetups mensuels, initiation au code.', 'Mentor at WTM Lomé: work on the gender digital divide, logistics for monthly meetups, and introductions to code.') },
  { name: 'Google Developer Groups', role: b('Speaker & organisateur', 'Speaker & organiser'), description: b('Speaker au GDG Lomé sur Flutter et Firebase, et coordination d’événements comme le DevFest.', 'Speaker at GDG Lomé on Flutter and Firebase, and coordination of events such as DevFest.') },
  { name: 'Python Togo', role: b('Social media & logistique', 'Social media & logistics'), description: b('Stratégie de contenu pour vulgariser Python, et support logistique des ateliers pratiques.', 'Content strategy to make Python approachable, plus logistics for hands-on workshops.') },
];

export const managedPages: { name: string; link: string; followers: string; category: Bi }[] = [
  { name: 'Python Togo', link: 'https://www.linkedin.com/company/python-togo/', followers: '1k+', category: b('Communauté tech', 'Tech community') },
  { name: 'GDG Lomé', link: 'https://www.linkedin.com/company/gdglome/', followers: '2k+', category: b('Google Developer Groups', 'Google Developer Groups') },
  { name: 'WTM Lomé', link: 'https://www.linkedin.com/showcase/wtmlome/', followers: '800+', category: b('Women Techmakers', 'Women Techmakers') },
  { name: 'Hyver', link: '#', followers: '500+', category: b('Agence startup', 'Startup agency') },
];

export type Project = {
  title: string;
  type: 'Mobile' | 'Web';
  description: Bi;
  tags: string[];
  images: string[];
  link?: string;
  github?: string;
};

const img = (name: string) => `/img/${name}`;

export const projects: Project[] = [
  { title: 'Picon', type: 'Mobile', description: b('App de tirage photo publiée sur Google Play (com.photopicon.app). 26 écrans Flutter, Firebase Auth, hors ligne, paiement mobile money.', 'Photo-print app on Google Play (com.photopicon.app). 26 Flutter screens, Firebase Auth, offline, mobile-money payments.'), tags: ['Flutter', 'Firebase', 'Spring Boot'], images: [img('picon-play-2.jpg'), img('picon-play-5.jpg'), img('picon.png')], link: 'https://play.google.com/store/apps/details?id=com.photopicon.app', github: 'https://github.com/Donchaminade/photopicon' },
  { title: 'Tayba Market ERP', type: 'Web', description: b('Système complet de gestion commerciale : ventes, stocks, clients, caissiers et clôtures de caisses.', 'Full retail system: sales, stock, customers, cashiers and till closing.'), tags: ['React', 'Node.js', 'ERP'], images: [] },
  { title: 'La 8e Tranche', type: 'Web', description: b('Site du restaurant La 8e Tranche à Lomé : menu, avis et réservation.', 'Website for La 8e Tranche in Lomé: menu, reviews and booking.'), tags: ['React', 'Tailwind'], images: [img('resto8tranch.png'), img('8tran.png'), img('8tranch.png')], link: 'https://8-me-tranche-delights.vercel.app' },
  { title: 'RachCargo', type: 'Web', description: b('Plateforme d’expédition premium de colis par voie aérienne, avec suivi.', 'Premium air-freight platform for parcels, with tracking.'), tags: ['Next.js', 'Tailwind'], images: [img('rachcar.png'), img('rachcaar.png'), img('rachcarg.png')], link: 'https://rachcargo.vercel.app/' },
  { title: 'Africa Power Platform', type: 'Web', description: b('Premier sommet dédié à Microsoft Power Platform en Afrique de l’Ouest (Cotonou, 2024).', 'First summit dedicated to Microsoft Power Platform in West Africa (Cotonou, 2024).'), tags: ['React', 'Tailwind'], images: [img('afro.png'), img('afroo.png'), img('afrooo.png')], link: 'https://africapowerplateform.vercel.app/' },
  { title: 'PayFlex', type: 'Web', description: b('Cotisation journalière et financement d’équipements pour artisans. API Spring Boot et application Flutter.', 'Daily contributions and equipment financing for craftspeople. Spring Boot API and Flutter app.'), tags: ['Spring Boot', 'Flutter', 'Next.js'], images: [img('payf.png'), img('payff.png'), img('payfff.png')], link: 'https://pay-flex.vercel.app/', github: 'https://github.com/Donchaminade/PayFlex' },
  { title: 'AI228 (Open Source)', type: 'Web', description: b('Hub open source qui recense les outils d’IA pour l’écosystème tech togolais.', 'Open-source hub listing AI tools for the Togolese tech ecosystem.'), tags: ['Next.js', 'Tailwind', 'Git'], images: [img('ai.png'), img('aib.png'), img('splash.png')], link: 'https://ai228-hub.vercel.app/', github: 'https://github.com/Donchaminade/ai228-hub/' },
  { title: 'Nutripack', type: 'Web', description: b('Plateforme e-commerce de produits alimentaires bio, avec livraison.', 'E-commerce platform for organic food, with delivery.'), tags: ['Next.js', 'Tailwind', 'Supabase'], images: [img('nutri.png'), img('nutrii.png'), img('nutriii.png')], link: 'https://nutripack.vercel.app/', github: 'https://github.com/Donchaminade/nutripack/' },
  { title: 'Ratoufa', type: 'Mobile', description: b('Application mobile de gestion des commandes et de réservation de tickets pour événements.', 'Mobile app for orders and event ticket booking.'), tags: ['Flutter', 'Dart', 'Agile'], images: [img('rtf.jpeg'), img('rtf1.jpeg')] },
  { title: 'Locafrica', type: 'Mobile', description: b('Application mobile de location de chambres et de maisons en Afrique.', 'Mobile app for renting rooms and houses in Africa.'), tags: ['Flutter', 'Dart'], images: [img('loca.png'), img('loca1.png'), img('loca2.png')] },
  { title: 'Axone Digital Company', type: 'Web', description: b('Site vitrine de l’entreprise Axone Digital Company.', 'Showcase site for Axone Digital Company.'), tags: ['Bootstrap', 'HTML', 'CSS'], images: [img('axone.png')], link: 'https://axone-digital.net/demo' },
  { title: 'Akontaa App', type: 'Mobile', description: b('Application mobile de gestion des dettes et redevances.', 'Mobile app for tracking debts and amounts due.'), tags: ['Flutter', 'Dart', 'Tailwind'], images: [img('akk.jpeg'), img('ak.jpeg'), img('ak1.jpeg'), img('ak4.jpeg')], github: 'https://github.com/Donchaminade/akontaa_v2' },
  { title: '48 lois app vf', type: 'Mobile', description: b('Version française de l’application des 48 lois du pouvoir, avec exemples et notification journalière.', 'French version of the 48 Laws of Power app, with examples and a daily notification.'), tags: ['Flutter', 'Dart'], images: [], github: 'https://github.com/Donchaminade/48laws' },
  { title: 'PROCOPE Afrique', type: 'Web', description: b('Site vitrine du Centre Incubateur PROCOPE Afrique.', 'Showcase site for the PROCOPE Afrique incubator.'), tags: ['HTML', 'CSS', 'JavaScript'], images: [img('proco.png'), img('procoo.png'), img('procooo.png')], link: 'https://www.procopeafrique.org', github: 'https://github.com/Donchaminade/procope-afrique' },
  { title: 'AndyKC', type: 'Web', description: b('Site vitrine de consulting, d’accompagnement et de suivi.', 'Showcase site for consulting, support and follow-up.'), tags: ['React', 'Tailwind'], images: [img('andy.png'), img('andyy.png')], link: 'https://andykc.com', github: 'https://github.com/Donchaminade/andykc' },
  { title: 'TwinFlow', type: 'Web', description: b('Sidecar base de données : lisse les pics d’écriture PostgreSQL et sert les lectures non critiques depuis un miroir local.', 'Database sidecar: smooths PostgreSQL write spikes and serves non-critical reads from a local mirror.'), tags: ['Go', 'PostgreSQL', 'SQLite', 'Docker'], images: [], link: 'https://twinflow-eosin.vercel.app', github: 'https://github.com/Donchaminade/twinflow' },
  { title: 'Togo Communities Hub', type: 'Web', description: b('Annuaire public qui recense, valorise et connecte les communautés du Togo.', 'Public directory that lists, showcases and connects communities in Togo.'), tags: ['React', 'TypeScript', 'Tailwind'], images: [], link: 'https://togo-communities-hub.vercel.app', github: 'https://github.com/Donchaminade/togo-communities-hub' },
  { title: 'TogoSaaS', type: 'Web', description: b('Hub qui recense les SaaS togolais, filtrable par ville et thématique.', 'Hub listing Togolese SaaS products, filterable by city and topic.'), tags: ['React', 'TypeScript', 'PHP', 'MySQL'], images: [], link: 'https://togosaas.vercel.app', github: 'https://github.com/Donchaminade/togosaas' },
  { title: 'Optibloc', type: 'Web', description: b('Site vitrine d’Optibloc, conçu et déployé pour présenter l’offre en ligne.', 'Optibloc showcase site, designed and deployed to present the offer online.'), tags: ['React', 'TypeScript', 'Vite'], images: [], link: 'https://optibloc.vercel.app', github: 'https://github.com/Donchaminade/Optibloc' },
  { title: 'IEPP Tsévié', type: 'Web', description: b('Plateforme web réalisée pour l’inspection de l’enseignement (IEPP Tsévié).', 'Web platform built for the IEPP Tsévié education inspectorate.'), tags: ['HTML', 'CSS', 'JavaScript'], images: [], link: 'https://iepp-tsevie.vercel.app', github: 'https://github.com/Donchaminade/IEPP_TSEVIE' },
  { title: 'CoachFlow', type: 'Mobile', description: b('Application mobile de coaching IA : personas expertes, contexte personnel et conversation vocale.', 'AI coaching mobile app: expert personas, personal context and voice conversation.'), tags: ['Flutter', 'Dart', 'Supabase', 'Riverpod'], images: [], github: 'https://github.com/Donchaminade/CoachFlow' },
  { title: 'HorusSight', type: 'Web', description: b('Plateforme d’intelligence cybersécurité : scan, tableau de bord et rapports IA.', 'Cybersecurity intelligence platform: scanning, dashboard and AI reports.'), tags: ['Next.js', 'TypeScript', 'Python', 'Tailwind'], images: [], github: 'https://github.com/Donchaminade/HorusSight' },
  { title: 'CredHub', type: 'Mobile', description: b('Coffre-fort d’identifiants 100 % local, chiffré, mobile et web.', 'Fully local, encrypted credential vault, on mobile and web.'), tags: ['Flutter', 'Dart', 'Sécurité'], images: [], github: 'https://github.com/Donchaminade/CredHub' },
  { title: 'ConseilBox', type: 'Mobile', description: b('Application mobile de partage de conseils et d’expériences, avec API PHP.', 'Mobile app for sharing advice and experiences, with a PHP API.'), tags: ['Flutter', 'Dart', 'PHP'], images: [], github: 'https://github.com/Donchaminade/conseilbox' },
  { title: 'Grosbit', type: 'Web', description: b('Site web de GROSBIT, entreprise d’infrastructures et de solutions IT.', 'Website of GROSBIT, an infrastructure and IT-solutions company.'), tags: ['HTML', 'CSS', 'JavaScript'], images: [], link: 'https://grosbit.vercel.app', github: 'https://github.com/Donchaminade/grosbit' },
  { title: 'EZOA-TO', type: 'Web', description: b('Plateforme des épreuves d’examens au Togo : routes web, API PHP, app Flutter hors ligne.', 'Exam-paper platform for Togo: web routes, PHP API, offline Flutter app.'), tags: ['React 19', 'PHP', 'Flutter', 'Expo'], images: [], link: 'https://github.com/Donchaminade/ezoato', github: 'https://github.com/Donchaminade/ezoato' },
  { title: 'CopyTo', type: 'Web', description: b('Presse-papier synchronisé et chiffré de bout en bout entre PC et mobile.', 'End-to-end encrypted clipboard synced between PC and mobile.'), tags: ['TypeScript', 'WebRTC', 'Socket.IO'], images: [], link: 'https://github.com/Donchaminade/copyto', github: 'https://github.com/Donchaminade/copyto' },
  { title: 'Lignée', type: 'Web', description: b('Arbre familial interactif avec fiches éditables et import de récit.', 'Interactive family tree with editable profiles and story import.'), tags: ['PWA', 'IA'], images: [], link: 'https://story-lineage.vercel.app', github: 'https://github.com/Donchaminade/story-lineage' },
  { title: 'K7 Mémoire', type: 'Web', description: b('Récits audio de Lomé dans une interface cassette/radio, contenus dans Sanity.', 'Audio stories from Lomé in a cassette/radio interface, content in Sanity.'), tags: ['Next.js', 'Sanity', 'GROQ'], images: [], link: 'https://k7-memoire.vercel.app' },
];

export const gallery = ['/gallerie/adc.png', '/gallerie/pypicture.jpg'];

const enTag: Record<string, string> = {
  CDD: 'Fixed-term',
  Logistique: 'Logistics',
  Bénévolat: 'Volunteering',
  Mentorat: 'Mentoring',
  Digitalisation: 'Digitisation',
  'Audit IT': 'IT audit',
  'Marketing digital': 'Digital marketing',
  'Création visuelle': 'Visual design',
  Sécurité: 'Security',
  IA: 'AI',
};

export function tagLabel(tag: string, lang: Lang) {
  return lang === 'en' ? (enTag[tag] ?? tag) : tag;
}

export const skillBlocks: { title: Bi; categories: { name: Bi; items: Record<Lang, string[]> }[] }[] = [
  { title: b('Backend & API', 'Backend & API'), categories: [
    { name: b('PHP orienté production', 'Production-oriented PHP'), items: lines(['PHP procédural et structuré', 'PDO, transactions, sécurité SQL', 'Architecture MVC simplifiée', 'Rôles (RBAC)', 'Pagination, recherche, filtrage', 'Génération PDF', 'CRUD complets', 'Authentification sécurisée', 'Mot de passe oublié par e-mail'], ['Procedural, structured PHP', 'PDO, transactions, SQL safety', 'Simplified MVC', 'Roles (RBAC)', 'Pagination, search, filtering', 'PDF generation', 'Full CRUD', 'Secure authentication', 'Email password reset']) },
    { name: b('API REST', 'REST APIs'), items: lines(['APIs REST', 'FastAPI (Python)', 'Intégration front ↔ back', 'JSON et Swagger / OpenAPI', 'Architecture modulaire', 'Sous-domaines API'], ['REST APIs', 'FastAPI (Python)', 'Front ↔ back integration', 'JSON and Swagger / OpenAPI', 'Modular architecture', 'API subdomains']) },
    { name: b('Node.js', 'Node.js'), items: lines(['Déploiement d’API Node', 'React + API', 'Configuration serveur de production'], ['Node API deployment', 'React + API', 'Production server setup']) },
    { name: b('Bases de données', 'Databases'), items: lines(['Modélisation relationnelle', 'Optimisation SQL', 'Schémas normalisés', 'Bases multi-modules', 'Tables complexes'], ['Relational modelling', 'SQL optimisation', 'Normalised schemas', 'Multi-module databases', 'Complex tables']) },
    { name: b('DevOps & déploiement', 'DevOps & deployment'), items: lines(['Linux, Nginx, SSL Let’s Encrypt', 'Erreurs 500 et sous-domaines', 'Déploiement React + Node', 'Git, CLI, dépendances'], ['Linux, Nginx, Let’s Encrypt SSL', '500 errors and subdomains', 'React + Node deployment', 'Git, CLI, dependencies']) },
  ] },
  { title: b('Développement web fullstack', 'Full-stack web'), categories: [
    { name: b('React (TypeScript)', 'React (TypeScript)'), items: lines(['SPA', 'Configuration de production', 'Intégration backend', 'Déploiement Hostinger + Nginx'], ['SPA', 'Production setup', 'Backend integration', 'Hostinger + Nginx deployment']) },
    { name: b('HTML5 / CSS3 / JavaScript', 'HTML5 / CSS3 / JavaScript'), items: lines(['Interfaces responsives', 'UI orientée expérience', 'DOM et API', 'États dynamiques'], ['Responsive interfaces', 'Experience-led UI', 'DOM and APIs', 'Dynamic state']) },
    { name: b('Bootstrap & UI', 'Bootstrap & UI'), items: lines(['Dashboard admin', 'Modales dynamiques', 'Tables interactives'], ['Admin dashboard', 'Dynamic modals', 'Interactive tables']) },
    { name: b('Web design & UI/UX', 'Web design & UI/UX'), items: lines(['Interfaces', 'Parcours utilisateurs', 'Design system et maquettes', 'Prototypage'], ['Interfaces', 'User flows', 'Design system and mockups', 'Prototyping']) },
    { name: b('Architecture', 'Architecture'), items: lines(['Dossiers admin / public', 'Séparation des responsabilités', 'Structure modulaire', 'Architecture évolutive'], ['Admin / public folders', 'Separation of concerns', 'Modular structure', 'Evolvable architecture']) },
  ] },
  { title: b('Développement mobile', 'Mobile development'), categories: [
    { name: b('Flutter', 'Flutter'), items: lines(['Interfaces animées', 'Scripts backend', 'Intégration Python', 'Plugins Android', 'Debug mobile_scanner', 'Configuration Gradle'], ['Animated interfaces', 'Backend scripts', 'Python integration', 'Android plugins', 'mobile_scanner debugging', 'Gradle setup']) },
  ] },
  { title: b('IA & data', 'AI & data'), categories: [
    { name: b('Intégration IA', 'AI integration'), items: lines(['IA dans des apps Flutter', 'Automatisation Python', 'Génération de contenu', 'App SaaS (MailBlast)'], ['AI inside Flutter apps', 'Python automation', 'Content generation', 'SaaS app (MailBlast)']) },
    { name: b('Data', 'Data'), items: lines(['Portails de données', 'Dashboard décisionnel', 'Visualisation', 'Reporting'], ['Data portals', 'Decision dashboard', 'Visualisation', 'Reporting']) },
    { name: b('Python', 'Python'), items: lines(['Fichiers vers matrices', 'Interfaces de traitement', 'Automatisation'], ['Files to matrices', 'Processing interfaces', 'Automation']) },
  ] },
  { title: b('Marketing digital & management', 'Digital marketing & management'), categories: [
    { name: b('Réseaux & communauté', 'Social & community'), items: lines(['Stratégie réseaux sociaux', 'Visuels et contenus', 'Animation de communautés tech', 'Suivi des performances'], ['Social strategy', 'Visuals and content', 'Tech community hosting', 'Performance tracking']) },
    { name: b('Leadership', 'Leadership'), items: lines(['Gestion de projet Agile', 'Coordination d’équipes', 'Hackathons et meetups', 'Vulgarisation technique'], ['Agile project management', 'Team coordination', 'Hackathons and meetups', 'Plain-language tech']) },
  ] },
];

export const phoneScreens: { src: string; label: Bi }[] = [
  { src: '/img/picon-play-1.jpg', label: b('Picon — Accueil', 'Picon — Home') },
  { src: '/img/picon-play-3.jpg', label: b('Picon — Paiement', 'Picon — Payment') },
  { src: '/img/picon-play-4.jpg', label: b('Picon — Récapitulatif', 'Picon — Summary') },
  { src: '/img/ak2.jpeg', label: b('Akontaa', 'Akontaa') },
  { src: '/img/rtf.jpeg', label: b('Ratoufa', 'Ratoufa') },
  { src: '/img/rtf1.jpeg', label: b('Ratoufa — Tickets', 'Ratoufa — Tickets') },
  { src: '/img/ak3.jpeg', label: b('Akontaa — Suivi', 'Akontaa — Tracking') },
  { src: '/img/picon-play-7.jpg', label: b('Picon — Souvenirs', 'Picon — Memories') },
];

export const navIds = ['accueil', 'apropos', 'parcours', 'services', 'tarifs', 'projets', 'distinctions', 'communaute', 'galerie', 'ecrans', 'contact'] as const;
