import {
  AWARDS,
  COMMUNITIES,
  EDUCATION,
  EXPERIENCES,
  PROJECTS,
  RELATIONNELLES,
  SKILLS,
  TESTIMONIALS,
} from '../../constants';
import { mergeCommunities, mergeExperiences, mergeProjects } from '../mergeCatalog';
import { detectIntent } from './language';
import type {
  ChatAwardFact,
  ChatBlogFact,
  ChatCommunityFact,
  ChatExperienceFact,
  ChatProfileFact,
  ChatProjectFact,
  ChatTestimonialFact,
  PortfolioFacts,
  RetrievedContext,
} from './types';

const DEFAULT_API = 'https://donchamfolio.grosbit.com';
const CACHE_TTL_MS = Number(process.env.CHAT_CACHE_TTL_MS || 5 * 60 * 1000);

let cache: { at: number; facts: PortfolioFacts } | null = null;

const SNAPSHOT_PROFILE: ChatProfileFact = {
  full_name: 'ADJOLOU Dondah Chaminade',
  hero_title: 'Développeur Web & Mobile.',
  bio: 'Ingénieur IT passionné, je conçois et déploie des solutions digitales sur mesure.',
  availability_text: 'Disponible pour de nouveaux défis',
  experience_badge: '3+ ans',
  email: 'chaminade.dondah.adjolou@gmail.com',
  phone: '+22899181626',
  whatsapp: '22899181626',
  linkedin_url: 'https://linkedin.com/in/chaminadeadjolou',
  twitter_url: 'https://x.com/Donchaminde',
  github_url: 'https://github.com/Donchaminade',
};

function apiBase(): string {
  const raw = (process.env.PORTFOLIO_API_URL || process.env.VITE_API_URL || DEFAULT_API).trim();
  return raw.replace(/\/$/, '') || DEFAULT_API;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : '')).filter(Boolean);
}

const SNAPSHOT_BLOGS: ChatBlogFact[] = [
  {
    title: 'Santé mentale : quand « ce n’est rien » coûte des vies',
    slug: 'sante-mentale-ce-n-est-pas-rien',
    excerpt:
      'Dépression, silence, suicide : pourquoi tant de souffrances sont minimisées, comment repérer les signaux, et pourquoi demander de l’aide n’est jamais une faiblesse.',
    category: 'sante',
    published_at: '2026-05-23',
  },
  {
    title: 'Construire un blog moderne : React côté public, PHP côté données',
    slug: 'blog-react-php-architecture-moderne',
    excerpt:
      'Architecture du blog Donchaminade : MySQL, API PHP, React/Vite, Quill, images et déploiement.',
    category: 'tech',
    published_at: '2026-05-20',
  },
  {
    title: 'Lâcher prise : retrouver l’équilibre quand tout va vite',
    slug: 'lacher-prise-developpeur-equilibre',
    excerpt: 'Guide sur le lâcher-prise pour développeurs et créatifs.',
    category: 'spiritualite',
    published_at: '2026-05-17',
  },
  {
    title: 'Le bénévolat : pourquoi, comment, quand et où s’engager',
    slug: 'bienfaits-benevolat-guide-complet',
    excerpt: 'Guide pratique pour s’engager, en local ou en ligne, avec les compétences numériques.',
    category: 'motivation',
    published_at: '2026-05-14',
  },
  {
    title: 'MCP et Cursor : comprendre les super-pouvoirs de l’IA dans votre IDE',
    slug: 'mcp-cursor-avantages-fonctionnement',
    excerpt: 'Model Context Protocol, architecture, sécurité et cas concrets pour connecter Cursor.',
    category: 'tech',
    published_at: '2026-05-11',
  },
  {
    title: 'Quill : rédiger un blog professionnel sans écrire de HTML',
    slug: 'quill-editeur-visuel-blog',
    excerpt: 'Guide de l’éditeur Quill de l’admin : structure, images, code et checklist de publication.',
    category: 'tech',
    published_at: '2026-05-08',
  },
];

function snapshotFacts(blogs: ChatBlogFact[] = SNAPSHOT_BLOGS): PortfolioFacts {
  return {
    profile: SNAPSHOT_PROFILE,
    projects: PROJECTS.map((p) => ({
      title: p.title,
      description: p.description,
      detailedDescription: p.detailedDescription,
      tags: p.tags ?? [],
      type: p.type,
      link: p.link,
      github: p.github,
    })),
    experiences: EXPERIENCES.map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      description: e.description,
      tags: e.tags,
    })),
    blogs,
    testimonials: TESTIMONIALS.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      company: t.company,
    })),
    communities: COMMUNITIES.map((c) => ({
      name: c.name,
      role: c.role,
      description: c.description,
    })),
    awards: AWARDS.map((a) => ({
      title: a.title,
      issuer: a.issuer,
      year: a.year,
      description: a.description,
    })),
    skills: [
      ...SKILLS.map((s) => s.name),
      ...RELATIONNELLES,
    ],
    education: EDUCATION.map((ed) => `${ed.degree} — ${ed.field}, ${ed.school} (${ed.year})`),
    source: 'snapshot',
  };
}

async function fetchJson<T>(url: string, timeoutMs = 4500): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'DonchaminadePortfolioChat/1.0',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function mapProjects(raw: unknown): ChatProjectFact[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const p = item as Record<string, unknown>;
    return {
      title: asString(p.title),
      description: asString(p.description),
      detailedDescription: asString(p.detailedDescription || p.detailed_description),
      tags: asStringList(p.tags),
      type: asString(p.type),
      link: asString(p.link),
      github: asString(p.github),
    };
  }).filter((p) => p.title);
}

function mapExperiences(raw: unknown): ChatExperienceFact[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const e = item as Record<string, unknown>;
    return {
      company: asString(e.company),
      role: asString(e.role),
      period: asString(e.period),
      description: asStringList(e.description),
      tags: asStringList(e.tags),
    };
  }).filter((e) => e.company);
}

function mapBlogs(raw: unknown): ChatBlogFact[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const b = item as Record<string, unknown>;
    return {
      title: asString(b.title),
      slug: asString(b.slug),
      excerpt: asString(b.excerpt),
      category: asString(b.category),
      published_at: asString(b.published_at),
    };
  }).filter((b) => b.title && b.slug);
}

function flattenSkills(skillBlocks: unknown, softSkills: unknown): string[] {
  const names: string[] = [];
  if (Array.isArray(skillBlocks)) {
    for (const block of skillBlocks) {
      const cats = (block as { categories?: unknown }).categories;
      if (!Array.isArray(cats)) continue;
      for (const cat of cats) {
        const c = cat as { name?: string; skills?: unknown };
        if (c.name) names.push(c.name);
        names.push(...asStringList(c.skills));
      }
    }
  }
  if (Array.isArray(softSkills)) {
    for (const soft of softSkills) {
      const title = (soft as { title?: string }).title;
      if (title) names.push(title);
    }
  }
  return names;
}

async function loadLiveFacts(): Promise<PortfolioFacts> {
  const base = apiBase();
  const fallback = snapshotFacts();
  try {
    const [portfolioRes, blogRes] = await Promise.all([
      fetchJson<{ success?: boolean; data?: Record<string, unknown> }>(
        `${base}/api/index.php?resource=portfolio`
      ),
      fetchJson<{ success?: boolean; data?: unknown }>(
        `${base}/api/blog.php?action=list&page=1&limit=12`
      ).catch(() => ({ data: [] })),
    ]);

    const data = portfolioRes?.data;
    if (!data) return fallback;

    const liveProjects = mapProjects(data.projects);
    const liveExperiences = mapExperiences(data.experiences);
    const liveCommunities = Array.isArray(data.communities)
      ? (data.communities as ChatCommunityFact[]).map((c) => ({
          name: asString(c.name),
          role: asString(c.role),
          description: asString(c.description),
        }))
      : [];
    const liveTestimonials = Array.isArray(data.testimonials)
      ? (data.testimonials as ChatTestimonialFact[]).map((t) => ({
          quote: asString(t.quote),
          name: asString(t.name),
          role: asString(t.role),
          company: asString(t.company),
        }))
      : [];
    const liveAwards = Array.isArray(data.awards)
      ? (data.awards as ChatAwardFact[]).map((a) => ({
          title: asString(a.title),
          issuer: asString(a.issuer),
          year: asString(a.year),
          description: asString(a.description),
        }))
      : [];

    const mergedProjects = mergeProjects(liveProjects as never, PROJECTS);
    const mergedExperiences = mergeExperiences(liveExperiences as never, EXPERIENCES);
    const mergedCommunities = mergeCommunities(liveCommunities as never, COMMUNITIES);

    const profileRaw = (data.profile || {}) as Record<string, unknown>;
    const facts: PortfolioFacts = {
      profile: {
        full_name: asString(profileRaw.full_name, fallback.profile.full_name),
        hero_title: asString(profileRaw.hero_title, fallback.profile.hero_title),
        bio: asString(profileRaw.bio, fallback.profile.bio),
        availability_text: asString(profileRaw.availability_text, fallback.profile.availability_text),
        experience_badge: asString(profileRaw.experience_badge, fallback.profile.experience_badge),
        email: asString(profileRaw.email, fallback.profile.email),
        phone: asString(profileRaw.phone, fallback.profile.phone),
        whatsapp: asString(profileRaw.whatsapp, fallback.profile.whatsapp),
        linkedin_url: asString(profileRaw.linkedin_url, fallback.profile.linkedin_url),
        twitter_url: asString(profileRaw.twitter_url, fallback.profile.twitter_url),
        github_url: asString(profileRaw.github_url, fallback.profile.github_url),
        cv_path: asString(profileRaw.cv_path, fallback.profile.cv_path),
      },
      projects: mergedProjects.map((p) => ({
        title: p.title,
        description: p.description,
        detailedDescription: p.detailedDescription,
        tags: p.tags ?? [],
        type: p.type,
        link: p.link,
        github: p.github,
      })),
      experiences: mergedExperiences.map((e) => ({
        company: e.company,
        role: e.role,
        period: e.period,
        description: e.description,
        tags: e.tags,
      })),
      blogs: (() => {
        const live = mapBlogs(blogRes?.data);
        if (live.length === 0) return fallback.blogs;
        const seen = new Set(live.map((b) => b.slug));
        return [...live, ...fallback.blogs.filter((b) => !seen.has(b.slug))];
      })(),
      testimonials: liveTestimonials.length ? liveTestimonials : fallback.testimonials,
      communities: mergedCommunities.map((c) => ({
        name: c.name,
        role: c.role,
        description: c.description,
      })),
      awards: liveAwards.length ? liveAwards : fallback.awards,
      skills: flattenSkills(data.skillBlocks, data.softSkills).length
        ? flattenSkills(data.skillBlocks, data.softSkills)
        : fallback.skills,
      education: fallback.education,
      source: 'mixed',
    };
    return facts;
  } catch {
    return fallback;
  }
}

export async function getPortfolioFacts(force = false): Promise<PortfolioFacts> {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.facts;
  }
  const facts = await loadLiveFacts();
  cache = { at: Date.now(), facts };
  return facts;
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-z0-9+.#]+/i)
    .filter((t) => t.length > 2);
}

function scoreText(query: string, haystack: string): number {
  const q = tokens(query);
  const h = tokens(haystack);
  if (q.length === 0 || h.length === 0) return 0;
  const set = new Set(h);
  let score = 0;
  for (const tok of q) {
    if (set.has(tok)) score += 2;
    else if (h.some((w) => w.includes(tok) || tok.includes(w))) score += 1;
  }
  return score;
}

function publicLink(link?: string): string {
  if (!link || link === '#') return '';
  return link;
}

function formatFactsBlock(facts: PortfolioFacts): string[] {
  const p = facts.profile;
  const lines: string[] = [
    `PROFIL: ${p.full_name} — ${p.hero_title} ${p.experience_badge || ''}`.trim(),
    `BIO: ${p.bio}`,
    p.availability_text ? `DISPO: ${p.availability_text}` : '',
    `CONTACT: email ${p.email || ''} · tel ${p.phone || ''} · LinkedIn ${p.linkedin_url || ''} · GitHub ${p.github_url || ''} · X ${p.twitter_url || ''}`,
    `FORMATION: ${facts.education.join(' | ')}`,
    `COMPÉTENCES: ${facts.skills.slice(0, 40).join(', ')}`,
  ];
  return lines.filter(Boolean);
}

export function selectContext(query: string, facts: PortfolioFacts): RetrievedContext {
  const intent = detectIntent(query);
  const chunks: { title: string; text: string; score: number; pin?: boolean }[] = [];

  for (const project of facts.projects) {
    const text = [
      `PROJET: ${project.title} (${project.type || 'projet'})`,
      project.description,
      project.detailedDescription || '',
      `Stack: ${(project.tags || []).join(', ')}`,
      publicLink(project.link) ? `Lien: ${publicLink(project.link)}` : '',
      publicLink(project.github) ? `GitHub: ${publicLink(project.github)}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    const boost = intent === 'projects' ? 4 : 0;
    chunks.push({ title: project.title, text, score: scoreText(query, text) + boost });
  }

  for (const exp of facts.experiences) {
    const text = [
      `EXPÉRIENCE: ${exp.role} @ ${exp.company} (${exp.period})`,
      ...(exp.description || []),
      (exp.tags || []).join(', '),
    ].join('\n');
    let boost = intent === 'experience' ? 3 : 0;
    if (intent === 'pycon' && /pycon/i.test(exp.company + exp.role + text)) boost += 12;
    if (intent === 'yas' && /yas|next gen|hackathon|coach/i.test(exp.company + exp.role + text)) {
      boost += 12;
    }
    chunks.push({ title: `${exp.role} — ${exp.company}`, text, score: scoreText(query, text) + boost });
  }

  for (const blog of facts.blogs) {
    const text = `ARTICLE: ${blog.title}\n${blog.excerpt}\nCatégorie: ${blog.category}\nSlug: /blog/${blog.slug}`;
    const boost = intent === 'blogs' ? 6 : 0;
    chunks.push({ title: blog.title, text, score: scoreText(query, text) + boost });
  }

  for (const t of facts.testimonials) {
    const text = `TÉMOIGNAGE: ${t.name} (${t.role || ''} ${t.company || ''}) — ${t.quote}`;
    chunks.push({
      title: `Avis ${t.name}`,
      text,
      score: scoreText(query, text) + (intent === 'testimonials' ? 6 : 0),
    });
  }

  for (const c of facts.communities) {
    const text = `COMMUNAUTÉ: ${c.name} — ${c.role}. ${c.description}`;
    let boost = intent === 'community' ? 5 : 0;
    if (intent === 'pycon' && /pycon/i.test(text)) boost += 10;
    chunks.push({ title: c.name, text, score: scoreText(query, text) + boost });
  }

  for (const a of facts.awards) {
    const text = `DISTINCTION: ${a.title} — ${a.issuer} (${a.year}). ${a.description}`;
    chunks.push({
      title: a.title,
      text,
      score: scoreText(query, text) + (intent === 'awards' ? 5 : 0),
    });
  }

  chunks.sort((a, b) => b.score - a.score);
  const picked = chunks.filter((c) => c.score > 0).slice(0, 10);
  const selected = picked.length > 0 ? picked : chunks.slice(0, 6);

  const header = formatFactsBlock(facts).join('\n');
  const contextText = [header, '', ...selected.map((c) => c.text)].join('\n\n').slice(0, 9000);

  return {
    facts,
    contextText,
    selectedTitles: selected.map((c) => c.title),
  };
}

export async function retrievePortfolioContext(query: string): Promise<RetrievedContext> {
  const facts = await getPortfolioFacts();
  return selectContext(query, facts);
}

export function __resetChatCache(): void {
  cache = null;
}
