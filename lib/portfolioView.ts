import {
  AWARDS,
  CLIENTS,
  COMMUNITIES,
  EDUCATION,
  EXPERIENCES,
  MANAGED_PAGES,
  PROJECTS,
  SOFT_SKILLS,
} from '../constants';
import { enText } from './enText';
import { mergeCommunities } from './mergeCatalog';
import { mediaUrl } from './media';
import type { Award, Community, Experience, Project, Recommendation, SiteProfile, SkillBlock, Stat, Testimonial } from '../types';

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
  stats?: Stat[];
  skillBlocks?: SkillBlock[];
  techIcons?: Record<string, string>;
  education?: typeof EDUCATION;
  softSkills?: typeof SOFT_SKILLS;
  managedPages?: typeof MANAGED_PAGES;
  clients?: typeof CLIENTS;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectView {
  title: string;
  kicker: string;
  description: string;
  detail?: string;
  tags: string[];
  image: string;
  badge?: string;
  initials: string;
  gradient: string;
  links: ProjectLink[];
  type: Project['type'];
  github?: string;
}

export interface FactView {
  strong: string;
  label: string;
}

export interface StackChip {
  label: string;
  icon?: string;
}

export interface StackGroup {
  title: string;
  chips: StackChip[];
}

export interface PlayCaption {
  title: string;
  detail: string;
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
  lead: string;
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
  facts: FactView[];
  stacks: StackGroup[];
  playCaption: PlayCaption | null;
  year: string;
  education: typeof EDUCATION;
  awards: Award[];
  softSkills: typeof SOFT_SKILLS;
  managedPages: typeof MANAGED_PAGES;
  clients: Array<{ name: string; logo: string }>;
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

function linkLabel(href: string): string {
  if (/play\.google\.com/i.test(href)) return 'Google Play';
  if (/github\.com/i.test(href)) return 'GitHub';
  return 'Site';
}

function looseView(project: Project, index: number): ProjectView {
  const gradients = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
  const links: ProjectLink[] = [];
  const seen = new Set<string>();
  const push = (href: string | undefined, label: string) => {
    const url = (href || '').trim();
    if (!url || url === '#') return;
    if (seen.has(url)) return;
    seen.add(url);
    links.push({ label, href: url });
  };
  push(project.link, linkLabel(project.link || ''));
  push(project.github, 'GitHub');
  const words = project.title.split(/\s+/).filter(Boolean);
  const initials = (words[0]?.slice(0, 2) || 'PR').toUpperCase();
  const detail = project.detailedDescription?.trim();
  return {
    title: project.title,
    kicker: project.type || 'Projet',
    description: project.description,
    detail: detail && detail !== project.description ? detail : undefined,
    tags: project.tags || [],
    image: usableImage(project.image),
    initials,
    gradient: gradients[index % gradients.length],
    links,
    type: project.type,
    github: project.github,
  };
}

function isFeatured(project: Project): boolean {
  const flag = project.is_featured;
  return flag === true || flag === 1 || flag === '1';
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
  return parts.length > 0 ? parts : ['Ambassadeur SpaceXAI', 'Co-organisateur GDG Lomé'];
}

function formatStat(stat: Stat): string {
  const value = String(stat.value ?? '').trim();
  const suffix = String(stat.suffix ?? '').trim();
  if (!suffix) return value;
  if (/^[+%°]/.test(suffix)) return `${value}${suffix}`;
  return `${value} ${suffix}`;
}

function asIcon(value: unknown, techIcons: Record<string, string>): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw) || raw.startsWith('/')) return raw;
  return techIcons[raw];
}

function stacksFrom(blocks: SkillBlock[] | undefined, techIcons: Record<string, string> | undefined): StackGroup[] {
  if (!blocks?.length) return [];
  const icons = techIcons || {};
  return blocks
    .map((block) => {
      const chips: StackChip[] = [];
      for (const category of block.categories || []) {
        const icon = (category.icons || []).map((item) => asIcon(item, icons)).find(Boolean);
        const skills = category.skills?.length ? category.skills : category.name ? [category.name] : [];
        for (const skill of skills) {
          const label = skill.trim();
          if (!label) continue;
          chips.push({ label, icon });
        }
      }
      return { title: block.title, chips };
    })
    .filter((group) => group.title && group.chips.length > 0);
}

function rolesFromExperiences(items: Experience[]): RoleView[] {
  return items
    .map((item) => ({
      period: item.period?.trim() || '',
      role: item.role?.trim() || '',
      company: item.company?.trim() || '',
      meta: (item.tags || []).filter(Boolean).join(' · '),
      summary: (item.description || []).filter(Boolean).join(' '),
    }))
    .filter((role) => role.company || role.role);
}

function playCaptionFrom(projects: ProjectView[]): PlayCaption | null {
  for (const project of projects) {
    const href = project.links.find((link) => /play\.google\.com/i.test(link.href))?.href;
    if (!href) continue;
    const id = href.match(/[?&]id=([^&]+)/)?.[1];
    return {
      title: 'App sur Google Play',
      detail: id ? `${project.title} · ${id}` : project.title,
    };
  }
  return null;
}

function fallbackFacts(profile: SiteProfile, projectCount: number, prizeCount: number, roleCount: number): FactView[] {
  return [
    { strong: profile.experience_badge?.trim() || `${EXPERIENCE_BADGE} ans`, label: 'd’expérience web et mobile' },
    { strong: String(projectCount), label: 'projets au catalogue' },
    { strong: `${prizeCount} prix`, label: 'hackathons et concours' },
    { strong: String(roleCount), label: 'postes et stages' },
  ];
}

function fallbackProjectList(): Project[] {
  return [
    ...PROJECTS,
    ...EXTRA_PROJECTS.filter((extra) => !PROJECTS.some((item) => normKey(item.title) === normKey(extra.title))),
  ];
}

function viewsFromFallback(projects: Project[]): { projects: ProjectView[]; featured: ProjectView[] } {
  const featured = FEATURED_SPECS.map((spec) => toView(spec, findProject(projects, spec.keys)));
  const featuredKeys = FEATURED_SPECS.flatMap((spec) => spec.keys);
  const rest = projects
    .filter((project) => {
      const key = normKey(project.title);
      return !featuredKeys.some((candidate) => key === candidate || key.includes(candidate));
    })
    .map((project, index) => looseView(project, index));
  return { featured, projects: [...featured, ...rest] };
}

export function buildPortfolioView(bundle: PortfolioBundle | null, lang: 'fr' | 'en' = 'fr'): PortfolioView {
  const profile = bundle?.profile || {};
  const apiProjects = bundle?.projects ?? [];
  let projects: ProjectView[];
  let featured: ProjectView[];
  if (apiProjects.length > 0) {
    projects = apiProjects.map((project, index) => looseView(project, index));
    const highlighted = projects.filter((_, index) => isFeatured(apiProjects[index]));
    featured = highlighted.length > 0 ? highlighted : projects;
  } else {
    const fallback = viewsFromFallback(fallbackProjectList());
    projects = fallback.projects;
    featured = fallback.featured;
  }

  const apiExperiences = bundle?.experiences ?? [];
  const roles = rolesFromExperiences(apiExperiences.length > 0 ? apiExperiences : EXPERIENCES);

  const awards = bundle == null ? AWARDS : (bundle.awards ?? []);
  const prizeCount = awards.filter((award) => /prix/i.test(award.title)).length;
  const testimonials = (bundle?.testimonials || []).filter(
    (item) => item?.name && item?.quote && !isFakeTestimonial(item.name) && !isStockPhoto(item.image)
  );
  const recommendations = (bundle?.recommendations || []).filter((item) => item?.name && item?.body);
  const facts = bundle && (bundle.stats?.length || 0) > 0
    ? bundle.stats!.map((stat) => ({ strong: formatStat(stat), label: stat.label }))
    : fallbackFacts(profile, projects.length, prizeCount, roles.length);

  const year = profile.footer_year?.trim() || String(new Date().getFullYear());
  const education = bundle == null ? EDUCATION : (bundle.education ?? []);
  const softSkills = bundle == null ? SOFT_SKILLS : (bundle.softSkills ?? []);
  const managedPages = bundle?.managedPages?.length ? bundle.managedPages : MANAGED_PAGES;
  const clients = (bundle == null ? CLIENTS : (bundle.clients ?? [])).filter(
    (client) => client?.name && client?.logo && !isStockPhoto(client.logo)
  );

  const view: PortfolioView = {
    profile,
    name: profile.full_name?.trim() || 'Chaminade Adjolou',
    roleLine: profile.hero_title?.trim() || 'Développeur Full-Stack Web & Mobile',
    lead: profile.bio?.trim() || HERO_LEAD,
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
    facts,
    stacks: stacksFrom(bundle?.skillBlocks, bundle?.techIcons),
    playCaption: playCaptionFrom(projects),
    year,
    education,
    awards,
    softSkills,
    managedPages,
    clients,
  };
  return lang === 'en' ? localizePortfolio(view, bundle) : view;
}

function localizeProject(project: ProjectView, source?: Project): ProjectView {
  return {
    ...project,
    title: enText(project.title, source?.titleEn),
    description: enText(project.description, source?.descriptionEn),
    detail: project.detail ? enText(project.detail, source?.detailedDescriptionEn) : project.detail,
    kicker: enText(project.kicker),
    tags: project.tags.map((tag) => enText(tag)).filter(Boolean),
  };
}

function localizePortfolio(view: PortfolioView, bundle: PortfolioBundle | null): PortfolioView {
  const profile = bundle?.profile;
  const stats = bundle?.stats ?? [];
  return {
    ...view,
    roleLine: enText(view.roleLine, profile?.hero_title_en),
    lead: enText(view.lead, profile?.bio_en),
    availability: enText(view.availability, profile?.availability_text_en),
    badges: view.badges.map((badge) => enText(badge, profile?.hero_subtitle_en)).filter(Boolean),
    projects: view.projects.map((project, index) => localizeProject(project, bundle?.projects?.[index])),
    featured: view.featured.map((project) => {
      const index = view.projects.findIndex((item) => item.title === project.title && item.description === project.description);
      return localizeProject(project, index >= 0 ? bundle?.projects?.[index] : undefined);
    }),
    roles: view.roles.map((role, index) => {
      const source = (bundle?.experiences?.length ? bundle.experiences : EXPERIENCES)[index];
      const lines = source?.description_en || [];
      const summary = lines.filter(Boolean).join(' ');
      return {
        ...role,
        role: enText(role.role, source?.role_en),
        period: enText(role.period, source?.period_en),
        summary: enText(role.summary, summary),
        meta: enText(role.meta),
      };
    }),
    communities: view.communities.map((item) => ({
      ...item,
      role: enText(item.role, (item as { role_en?: string }).role_en),
      description: enText(item.description, (item as { description_en?: string }).description_en),
    })),
    testimonials: view.testimonials.map((item) => ({
      ...item,
      quote: enText(item.quote, (item as { quote_en?: string }).quote_en),
      role: item.role ? enText(item.role, (item as { role_en?: string }).role_en) : item.role,
    })),
    recommendations: view.recommendations.map((item) => ({
      ...item,
      body: enText(item.body, (item as { body_en?: string }).body_en),
      role: item.role ? enText(item.role, (item as { role_en?: string }).role_en) : item.role,
    })),
    facts: view.facts.map((fact, index) => ({
      strong: enText(fact.strong),
      label: enText(fact.label, stats[index]?.label_en),
    })),
    stacks: view.stacks.map((group, index) => {
      const block = bundle?.skillBlocks?.[index];
      return {
        ...group,
        title: enText(group.title, (block as { titleEn?: string } | undefined)?.titleEn),
        chips: group.chips.map((chip) => ({ ...chip, label: enText(chip.label) })),
      };
    }),
    playCaption: view.playCaption
      ? { title: enText(view.playCaption.title), detail: enText(view.playCaption.detail) || view.playCaption.detail }
      : null,
    education: view.education.map((item) => ({
      ...item,
      degree: enText(item.degree, (item as { degree_en?: string }).degree_en),
      field: enText(item.field, (item as { field_en?: string }).field_en),
    })),
    awards: view.awards.map((item) => ({
      ...item,
      title: enText(item.title, (item as { title_en?: string }).title_en),
      description: enText(item.description, (item as { description_en?: string }).description_en),
    })),
    softSkills: view.softSkills.map((item) => ({
      ...item,
      title: enText(item.title, (item as { titleEn?: string }).titleEn),
      impact: enText(item.impact, (item as { impactEn?: string }).impactEn),
    })),
    managedPages: view.managedPages.map((item) => ({
      ...item,
      category: enText(item.category, (item as { category_en?: string }).category_en),
    })),
  };
}
