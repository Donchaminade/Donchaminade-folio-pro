import {
  AWARDS,
  COMMUNITIES,
  EXPERIENCES,
  PROJECTS,
} from '../constants';
import { mergeCommunities, mergeExperiences, mergeProjects } from './mergeCatalog';
import { mediaUrl } from './media';
import type { Award, Community, Experience, Project, Recommendation, SiteProfile, Testimonial } from '../types';

export const EXPERIENCE_BADGE = '4+';
export const BOOKING_URL = 'https://doodle.com/bp/chaminadedondahadjolou/donchaminade';
export const PUBLIC_EMAIL = 'chaminade.dondah.adjolou@gmail.com';
export const CV_FR = '/cv/CV-Chaminade-Adjolou-FR-FullStack-Master.pdf';
export const CV_EN = '/cv/CV-Chaminade-Adjolou-EN-FullStack-Master.pdf';
export const CV_FR_FILE = 'CV-Chaminade-Adjolou-FR-FullStack-Master.pdf';
export const CV_EN_FILE = 'CV-Chaminade-Adjolou-EN-FullStack-Master.pdf';
export const CV_FR_SIZE = '9 Ko';
export const CV_EN_SIZE = '9 KB';
export const CV_UPDATED = 'octobre 2026';

export const HERO_LEAD =
  'Je livre des produits de bout en bout : API en Spring Boot, Node.js et PHP, interfaces React / Next.js et apps Flutter, dont une publiée sur Google Play. Basé à Lomé, je travaille en remote.';

const FAKE_NAMES = new Set(['koffi mensah', 'abla doe', 'jean-pierre kouakou']);

export function isFakeTestimonial(name: string): boolean {
  return FAKE_NAMES.has(name.trim().toLowerCase());
}

export function isStockPhoto(url: string | undefined | null): boolean {
  if (!url) return false;
  return /images\.unsplash\.com|unsplash\.com/i.test(url);
}

export function fixPublicXUrl(url?: string | null): string {
  const fallback = 'https://x.com/Donchaminade';
  const value = (url || '').trim();
  if (!value) return fallback;
  return value.replace(/https?:\/\/(www\.)?(x|twitter)\.com\/Donchaminde\b/i, fallback);
}

export function cleanPublicBio(bio: string): string {
  return bio
    .replace(/solutions numérique(?!s)/gi, 'solutions numériques')
    .replace(/\s*en 72\s*h(?:eures)?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface PortfolioBundle {
  profile?: SiteProfile | null;
  projects?: Project[];
  experiences?: Experience[];
  communities?: Community[];
  testimonials?: Testimonial[];
  recommendations?: Recommendation[];
  awards?: Award[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectView {
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  image: string;
  badge?: string;
  initials: string;
  gradient: string;
  links: ProjectLink[];
  type: Project['type'];
  github?: string;
}

export interface RoleView {
  period: string;
  role: string;
  company: string;
  meta: string;
  summary: string;
}

export interface PortfolioView {
  profile: SiteProfile;
  name: string;
  roleLine: string;
  availability: string;
  badges: string[];
  socials: { github: string; linkedin: string; twitter: string };
  email: string;
  photo: string;
  projects: ProjectView[];
  featured: ProjectView[];
  projectCount: number;
  roles: RoleView[];
  communities: Community[];
  testimonials: Testimonial[];
  recommendations: Recommendation[];
  prizeCount: number;
  year: string;
}

interface FeatureSpec {
  keys: string[];
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  badge?: string;
  gradient: string;
  initials: string;
  links: ProjectLink[];
  image?: string;
  type: Project['type'];
}

const FEATURED_SPECS: FeatureSpec[] = [
  {
    keys: ['picon', 'photopicon'],
    title: 'Picon',
    kicker: 'Mobile · Google Play',
    description:
      'App de tirage photo publiée sur Google Play (com.photopicon.app). J’ai écrit environ 89 % du code Dart : 26 écrans Flutter, Firebase Auth, hors ligne, paiement mobile money.',
    tags: ['Flutter', 'Firebase', 'Spring Boot'],
    badge: 'En production',
    gradient: 'g1',
    initials: 'Pi',
    image: '/picon.png',
    type: 'Mobile',
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.photopicon.app' },
      { label: 'Site', href: 'https://photopicon.com' },
    ],
  },
  {
    keys: ['payflex'],
    title: 'PayFlex',
    kicker: 'Fintech · Web + Mobile',
    description:
      'Cotisation journalière et financement d’équipements pour artisans. API Spring Boot de 179 handlers (57 endpoints REST mobile), 34 tables Flyway, app Flutter de 48 écrans.',
    tags: ['Spring Boot', 'Flutter', 'Next.js'],
    gradient: 'g2',
    initials: 'Pa',
    image: '/payf.png',
    type: 'Web',
    links: [
      { label: 'Vitrine', href: 'https://pay-flex.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Donchaminade/PayFlex' },
    ],
  },
  {
    keys: ['ezoato', 'ezoa'],
    title: 'EZOA-TO',
    kicker: 'EdTech · Fondateur',
    description:
      'Plateforme des épreuves d’examens au Togo : 28 routes web, 81 actions d’API PHP, 31 tables, app Flutter hors ligne de 26 écrans (après un prototype React Native / Expo).',
    tags: ['React 19', 'PHP', 'Flutter', 'Expo'],
    gradient: 'g1',
    initials: 'EZ',
    type: 'Web',
    links: [{ label: 'GitHub', href: 'https://github.com/Donchaminade/ezoato' }],
  },
  {
    keys: ['togosaas'],
    title: 'TogoSaaS',
    kicker: 'Annuaire · Web',
    description:
      'Hub des solutions SaaS et communautés du Togo, développé seul : 106 routes API sur 16 contrôleurs, 21 tables, 20 pages React, Web Push.',
    tags: ['React', 'PHP 8', 'MySQL'],
    badge: 'En ligne',
    gradient: 'g2',
    initials: 'To',
    type: 'Web',
    links: [
      { label: 'Site', href: 'https://togosaas.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Donchaminade/togosaas' },
    ],
  },
  {
    keys: ['twinflow'],
    title: 'TwinFlow',
    kicker: 'Infra · Go',
    description:
      'Sidecar devant PostgreSQL : pool borné, rate-limit, file d’écriture et miroir SQLite. 7 endpoints, 31 tests Go. Conçu et piloté avec des agents IA.',
    tags: ['Go', 'PostgreSQL', 'Docker'],
    gradient: 'g3',
    initials: 'Tw',
    type: 'Web',
    links: [
      { label: 'Démo', href: 'https://twinflow-eosin.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Donchaminade/twinflow' },
    ],
  },
  {
    keys: ['copyto'],
    title: 'CopyTo',
    kicker: 'Sécurité · TypeScript',
    description:
      'Presse-papier synchronisé et chiffré de bout en bout entre PC et mobile : extension Chrome, PWA, serveur, librairie partagée. X25519 + AES-GCM, WebRTC P2P.',
    tags: ['TypeScript', 'WebRTC', 'Socket.IO'],
    gradient: 'g4',
    initials: 'Co',
    type: 'Web',
    links: [{ label: 'GitHub', href: 'https://github.com/Donchaminade/copyto' }],
  },
  {
    keys: ['lignee', 'storylineage', 'lineage'],
    title: 'Lignée',
    kicker: 'Famille · PWA',
    description:
      'Arbre familial interactif avec fiches éditables et import de récit qui suggère personnes et relations.',
    tags: ['PWA', 'IA'],
    gradient: 'g5',
    initials: 'Li',
    type: 'Web',
    links: [
      { label: 'Démo', href: 'https://story-lineage.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Donchaminade/story-lineage' },
    ],
  },
  {
    keys: ['k7memoire', 'k7'],
    title: 'K7 Mémoire',
    kicker: 'CMS · Sanity',
    description:
      'Récits audio de Lomé dans une interface cassette/radio, contenus dans Sanity (Studio sur /studio). Projet du Sanity Challenge.',
    tags: ['Next.js', 'Sanity', 'GROQ'],
    gradient: 'g6',
    initials: 'K7',
    type: 'Web',
    links: [{ label: 'Démo', href: 'https://k7-memoire.vercel.app' }],
  },
];

const EXTRA_PROJECTS: Project[] = FEATURED_SPECS.filter((spec) =>
  ['ezoato', 'copyto', 'lignee', 'k7memoire'].includes(spec.keys[0])
).map((spec) => ({
  title: spec.title,
  description: spec.description,
  tags: spec.tags,
  image: spec.image || '',
  link: spec.links[0]?.href || '#',
  github: spec.links.find((link) => /github/i.test(link.label))?.href,
  type: spec.type,
}));

const CANON_ROLES: Array<RoleView & { match: RegExp }> = [
  {
    match: /grosbit/i,
    period: 'Nov. 2025 – juin 2026',
    role: 'IT Support, Développeur Web & Mobile',
    company: 'GROSBIT SARLU',
    meta: 'CDD / Freelance · Remote',
    summary:
      'Applications web et mobiles (Next.js, Flutter) pour un intégrateur partenaire Cisco, refonte du site public, assistance aux déploiements réseau.',
  },
  {
    match: /picon studio/i,
    period: 'Déc. 2025 – févr. 2026',
    role: 'Développeur Frontend Mobile',
    company: 'Picon Studio',
    meta: 'CDD / Freelance',
    summary:
      'Livraison de l’app Picon sur Google Play : 26 écrans Flutter, Firebase Auth, hors ligne ; contribution au backend Spring Boot (JWT, WebSocket).',
  },
  {
    match: /tayba/i,
    period: '2025',
    role: 'Consultant IT & Lead Tech',
    company: 'Tayba Market',
    meta: 'CDD / Freelance',
    summary: 'Audit IT puis application de gestion en React / Node.js : ventes, stocks, clients, clôtures de caisse.',
  },
  {
    match: /efficorpe/i,
    period: 'Août – oct. 2025',
    role: 'Développeur Frontend Mobile',
    company: 'Efficorpe',
    meta: 'Stage',
    summary: 'Interfaces Flutter sur backend Supabase, en équipe Agile.',
  },
  {
    match: /axone/i,
    period: 'Déc. 2024 – juil. 2025',
    role: 'Développeur Web & Mobile',
    company: 'Axone Digital Company',
    meta: 'Stage',
    summary: 'Fonctionnalités web et mobiles en Next.js, TypeScript, PHP et MySQL / PostgreSQL.',
  },
];

function normKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function usableImage(path: string | undefined): string {
  if (!path || path === '#') return '';
  if (/^\/48\d*\.png$/i.test(path)) return '';
  if (isStockPhoto(path)) return '';
  return mediaUrl(path);
}

function toView(spec: FeatureSpec, source?: Project): ProjectView {
  const image = usableImage(source?.image) || usableImage(spec.image);
  return {
    title: spec.title,
    kicker: spec.kicker,
    description: spec.description,
    tags: spec.tags,
    image,
    badge: spec.badge,
    initials: spec.initials,
    gradient: spec.gradient,
    links: spec.links.filter((link) => link.href && link.href !== '#'),
    type: spec.type,
    github: spec.links.find((link) => /github\.com/i.test(link.href))?.href,
  };
}

function looseView(project: Project, index: number): ProjectView {
  const gradients = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
  const links: ProjectLink[] = [];
  if (project.link && project.link !== '#') links.push({ label: 'Site', href: project.link });
  if (project.github && project.github !== '#') links.push({ label: 'GitHub', href: project.github });
  const words = project.title.split(/\s+/).filter(Boolean);
  const initials = (words[0]?.slice(0, 2) || 'PR').toUpperCase();
  return {
    title: project.title,
    kicker: project.type || 'Projet',
    description: project.description,
    tags: project.tags || [],
    image: usableImage(project.image),
    initials,
    gradient: gradients[index % gradients.length],
    links,
    type: project.type,
    github: project.github,
  };
}

function findProject(projects: Project[], keys: string[]): Project | undefined {
  return projects.find((project) => {
    const key = normKey(project.title);
    return keys.some((candidate) => key === candidate || key.includes(candidate));
  });
}

function heroBadges(subtitle?: string): string[] {
  const parts = (subtitle || '')
    .split(/[|•·]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const badges = parts.length > 0 ? parts : ['Ambassadeur SpaceXAI', 'Co-organisateur GDG Lomé'];
  const experience = '4+ ans d’expérience';
  const withoutYears = badges.filter((badge) => !/expérience|\d\s*\+?\s*ans/i.test(badge));
  return [...withoutYears, experience];
}

function displayName(fullName: string): string {
  if (/chaminade/i.test(fullName)) return 'Chaminade Adjolou';
  return fullName.trim() || 'Chaminade Adjolou';
}

export function buildPortfolioView(bundle: PortfolioBundle | null): PortfolioView {
  const profile = bundle?.profile || {};
  const mergedAll = mergeProjects(
    [...(bundle?.projects || [])],
    [...PROJECTS, ...EXTRA_PROJECTS.filter((extra) => !PROJECTS.some((item) => normKey(item.title) === normKey(extra.title)))]
  );
  const merged = [
    ...mergedAll.filter((project) => !/grok meetup/i.test(project.title)),
    ...mergedAll.filter((project) => /grok meetup/i.test(project.title)),
  ];

  const featured = FEATURED_SPECS.map((spec) => toView(spec, findProject(merged, spec.keys)));
  const featuredKeys = FEATURED_SPECS.flatMap((spec) => spec.keys);
  const rest = merged
    .filter((project) => {
      const key = normKey(project.title);
      return !featuredKeys.some((candidate) => key === candidate || key.includes(candidate));
    })
    .map((project, index) => looseView(project, index));

  const projects = [...featured, ...rest];
  const experiences = mergeExperiences(bundle?.experiences, EXPERIENCES);
  const roles = CANON_ROLES.map((role) => {
    const fromApi = experiences.find((item) => role.match.test(item.company));
    return {
      period: role.period,
      role: role.role,
      company: role.company,
      meta: role.meta,
      summary: role.summary || (fromApi?.description || []).join(' '),
    };
  });

  const awards = bundle?.awards?.length ? bundle.awards : AWARDS;
  const prizeCount = awards.filter((award) => /prix/i.test(award.title)).length;
  const testimonials = (bundle?.testimonials || []).filter(
    (item) => item?.name && item?.quote && !isFakeTestimonial(item.name) && !isStockPhoto(item.image)
  );
  const recommendations = (bundle?.recommendations || []).filter((item) => item?.name && item?.body);

  const year = profile.footer_year?.trim() || String(new Date().getFullYear());

  return {
    profile,
    name: displayName(profile.full_name?.trim() || 'Chaminade Adjolou'),
    roleLine: 'Développeur Full-Stack Web & Mobile',
    availability: profile.availability_text?.trim() || 'Disponible · remote, temps plein ou freelance',
    badges: heroBadges(profile.hero_subtitle),
    socials: {
      github: profile.github_url?.trim() || 'https://github.com/Donchaminade',
      linkedin: profile.linkedin_url?.trim() || 'https://www.linkedin.com/in/chaminadeadjolou',
      twitter: fixPublicXUrl(profile.twitter_url),
    },
    email: profile.email?.trim() || PUBLIC_EMAIL,
    photo: mediaUrl(profile.photo_path) || '/pypicture.png',
    projects,
    featured,
    projectCount: projects.length,
    roles,
    communities: mergeCommunities(bundle?.communities, COMMUNITIES),
    testimonials,
    recommendations,
    prizeCount,
    year,
  };
}
