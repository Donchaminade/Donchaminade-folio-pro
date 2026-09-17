import type { IncomingMessage, ServerResponse } from 'http';
import catalog from './catalog.json';

export const config = { maxDuration: 30 };

type Lang = 'fr' | 'en';
type Project = {
  title: string;
  description: string;
  detailedDescription?: string;
  tags?: string[];
  type?: string;
  link?: string;
  github?: string;
};
type Experience = {
  company: string;
  role: string;
  period: string;
  description: string[];
  tags?: string[];
};
type Facts = {
  profile: {
    full_name: string;
    hero_title: string;
    bio: string;
    availability_text?: string;
    experience_badge?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    twitter_url?: string;
    github_url?: string;
  };
  projects: Project[];
  experiences: Experience[];
  blogs: Array<{ title: string; slug: string; excerpt: string; category: string }>;
  testimonials: Array<{ quote: string; name: string; role?: string; company?: string }>;
  communities: Array<{ name: string; role: string; description: string }>;
  awards: Array<{ title: string; issuer: string; year: string; description: string }>;
  skills: string[];
  education: string[];
};

const PROFILE = {
  full_name: 'ADJOLOU Dondah Chaminade',
  hero_title: 'Développeur Web & Mobile.',
  bio: 'Ingénieur IT passionné, je conçois et déploie des solutions digitales sur mesure.',
  availability_text: 'Disponible pour de nouveaux défis',
  experience_badge: '3+ ans',
  email: 'chaminade.dondah.adjolou@gmail.com',
  phone: '+22899181626',
  linkedin_url: 'https://linkedin.com/in/chaminadeadjolou',
  twitter_url: 'https://x.com/Donchaminde',
  github_url: 'https://github.com/Donchaminade',
};

const SNAPSHOT_BLOGS = [
  {
    title: 'Santé mentale : quand « ce n’est rien » coûte des vies',
    slug: 'sante-mentale-ce-n-est-pas-rien',
    excerpt:
      'Dépression, silence, suicide : pourquoi tant de souffrances sont minimisées, comment repérer les signaux, et pourquoi demander de l’aide n’est jamais une faiblesse.',
    category: 'sante',
  },
  {
    title: 'Construire un blog moderne : React côté public, PHP côté données',
    slug: 'blog-react-php-architecture-moderne',
    excerpt: 'Architecture du blog Donchaminade : MySQL, API PHP, React/Vite, Quill, images et déploiement.',
    category: 'tech',
  },
  {
    title: 'Lâcher prise : retrouver l’équilibre quand tout va vite',
    slug: 'lacher-prise-developpeur-equilibre',
    excerpt: 'Guide sur le lâcher-prise pour développeurs et créatifs.',
    category: 'spiritualite',
  },
  {
    title: 'Le bénévolat : pourquoi, comment, quand et où s’engager',
    slug: 'bienfaits-benevolat-guide-complet',
    excerpt: 'Guide pratique pour s’engager, en local ou en ligne, avec les compétences numériques.',
    category: 'motivation',
  },
  {
    title: 'MCP et Cursor : comprendre les super-pouvoirs de l’IA dans votre IDE',
    slug: 'mcp-cursor-avantages-fonctionnement',
    excerpt: 'Model Context Protocol, architecture, sécurité et cas concrets pour connecter Cursor.',
    category: 'tech',
  },
  {
    title: 'Quill : rédiger un blog professionnel sans écrire de HTML',
    slug: 'quill-editeur-visuel-blog',
    excerpt: 'Guide de l’éditeur Quill de l’admin : structure, images, code et checklist de publication.',
    category: 'tech',
  },
];

function chatMode(): 'groq' | 'gemini' | 'fallback' {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY) return 'gemini';
  return 'fallback';
}

function snapshotFacts(): Facts {
  return {
    profile: PROFILE,
    projects: catalog.projects as Project[],
    experiences: catalog.experiences as Experience[],
    blogs: SNAPSHOT_BLOGS,
    testimonials: catalog.testimonials,
    communities: catalog.communities,
    awards: catalog.awards,
    skills: catalog.skills,
    education: catalog.education,
  };
}

function keyOf(value: string): string {
  return value.trim().toLowerCase();
}

function mergeBy<T>(live: T[], extra: T[], key: (item: T) => string): T[] {
  if (live.length === 0) return extra;
  const seen = new Set(live.map(key));
  const more = extra.filter((item) => !seen.has(key(item)));
  return more.length === 0 ? live : [...live, ...more];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : '')).filter(Boolean);
}

async function fetchJson<T>(url: string, timeoutMs = 4500): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'DonchaminadePortfolioChat/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

let cache: { at: number; facts: Facts } | null = null;

async function loadFacts(): Promise<Facts> {
  if (cache && Date.now() - cache.at < 5 * 60 * 1000) return cache.facts;
  const fallback = snapshotFacts();
  const base = (process.env.PORTFOLIO_API_URL || process.env.VITE_API_URL || 'https://donchamfolio.grosbit.com')
    .trim()
    .replace(/\/$/, '');
  try {
    const [portfolioRes, blogRes] = await Promise.all([
      fetchJson<{ data?: Record<string, unknown> }>(`${base}/api/index.php?resource=portfolio`),
      fetchJson<{ data?: unknown }>(`${base}/api/blog.php?action=list&page=1&limit=12`).catch(() => ({ data: [] })),
    ]);
    const data = portfolioRes?.data;
    if (!data) {
      cache = { at: Date.now(), facts: fallback };
      return fallback;
    }
    const liveProjects = (Array.isArray(data.projects) ? data.projects : [])
      .map((item) => {
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
      })
      .filter((p) => p.title);
    const liveExperiences = (Array.isArray(data.experiences) ? data.experiences : [])
      .map((item) => {
        const e = item as Record<string, unknown>;
        return {
          company: asString(e.company),
          role: asString(e.role),
          period: asString(e.period),
          description: asStringList(e.description),
          tags: asStringList(e.tags),
        };
      })
      .filter((e) => e.company);
    const liveCommunities = (Array.isArray(data.communities) ? data.communities : [])
      .map((item) => {
        const c = item as Record<string, unknown>;
        return { name: asString(c.name), role: asString(c.role), description: asString(c.description) };
      })
      .filter((c) => c.name);
    const liveBlogs = (Array.isArray(blogRes?.data) ? blogRes.data : [])
      .map((item) => {
        const b = item as Record<string, unknown>;
        return {
          title: asString(b.title),
          slug: asString(b.slug),
          excerpt: asString(b.excerpt),
          category: asString(b.category),
        };
      })
      .filter((b) => b.title && b.slug);

    const facts: Facts = {
      profile: {
        full_name: asString((data.profile as Record<string, unknown> | undefined)?.full_name, PROFILE.full_name),
        hero_title: asString((data.profile as Record<string, unknown> | undefined)?.hero_title, PROFILE.hero_title),
        bio: asString((data.profile as Record<string, unknown> | undefined)?.bio, PROFILE.bio),
        availability_text: asString(
          (data.profile as Record<string, unknown> | undefined)?.availability_text,
          PROFILE.availability_text
        ),
        experience_badge: asString(
          (data.profile as Record<string, unknown> | undefined)?.experience_badge,
          PROFILE.experience_badge
        ),
        email: asString((data.profile as Record<string, unknown> | undefined)?.email, PROFILE.email),
        phone: asString((data.profile as Record<string, unknown> | undefined)?.phone, PROFILE.phone),
        linkedin_url: asString((data.profile as Record<string, unknown> | undefined)?.linkedin_url, PROFILE.linkedin_url),
        twitter_url: asString((data.profile as Record<string, unknown> | undefined)?.twitter_url, PROFILE.twitter_url),
        github_url: asString((data.profile as Record<string, unknown> | undefined)?.github_url, PROFILE.github_url),
      },
      projects: mergeBy(liveProjects, fallback.projects, (p) => keyOf(p.title)),
      experiences: mergeBy(liveExperiences, fallback.experiences, (e) => keyOf(e.company)),
      blogs:
        liveBlogs.length === 0
          ? fallback.blogs
          : [
              ...liveBlogs,
              ...fallback.blogs.filter((b) => !liveBlogs.some((live) => live.slug === b.slug)),
            ],
      testimonials: fallback.testimonials,
      communities: mergeBy(liveCommunities, fallback.communities, (c) => keyOf(c.name)),
      awards: fallback.awards,
      skills: fallback.skills,
      education: fallback.education,
    };
    cache = { at: Date.now(), facts };
    return facts;
  } catch {
    cache = { at: Date.now(), facts: fallback };
    return fallback;
  }
}

function detectLang(text: string): Lang {
  const en = text.match(/\b(what|who|your|you|are|is|the|latest|tell|about|please|hello|hi|thanks)\b/gi)?.length ?? 0;
  const fr =
    text.match(/\b(quel|quels|quelles|tes|ton|parle|derniers?|bonjour|salut|merci|expérience)\b/gi)?.length ?? 0;
  return en > fr ? 'en' : 'fr';
}

function detectIntent(q: string): string {
  const t = q.toLowerCase();
  if (/\b(bombe|arme|malware|how to kill|csam)\b/i.test(t)) return 'harm';
  if (/\b(adresse personnelle|vie privée|home address|admin password)\b/i.test(t)) return 'private';
  if (/\b(pycon|speakers?|intervenants?)\b/i.test(t)) return 'pycon';
  if (/\b(yas|next gen|hackathon|coach)\b/i.test(t)) return 'yas';
  if (/\b(blogs?|articles?|posts?)\b/i.test(t)) return 'blogs';
  if (/\b(projets?|réalisations?|github)\b/i.test(t)) return 'projects';
  if (/\b(témoignages?|testimonials?|avis)\b/i.test(t)) return 'testimonials';
  if (/\b(compétences?|skills?|stack)\b/i.test(t)) return 'skills';
  if (/\b(contact|email|whatsapp|téléphone|linkedin|cv)\b/i.test(t)) return 'contact';
  if (/\b(communautés?|gdg|wtm|python togo)\b/i.test(t)) return 'community';
  if (/\b(prix|awards?|distinctions?)\b/i.test(t)) return 'awards';
  if (/\b(expérience|parcours|carrière)\b/i.test(t)) return 'experience';
  return 'generic';
}

function fallbackAnswer(query: string, facts: Facts, lang: Lang): string {
  const intent = detectIntent(query);
  const p = facts.profile;
  if (intent === 'harm') {
    return lang === 'en'
      ? 'I only answer questions about Donchaminade’s public portfolio. I cannot help with harmful requests.'
      : 'Je ne réponds qu’aux questions sur le portfolio public de Donchaminade. Je ne peux pas aider pour une demande dangereuse.';
  }
  if (intent === 'private') {
    return lang === 'en'
      ? 'I only share public portfolio information. I don’t speculate about private life or unpublished details.'
      : 'Je ne partage que les informations publiques du portfolio. Je ne spécule pas sur la vie privée ni sur des détails non publiés.';
  }
  if (intent === 'pycon') {
    const exp = facts.experiences.find((e) => /pycon/i.test(e.company + e.role));
    return lang === 'en'
      ? `At PyCon Togo 2026 I volunteer as Speaker Coordinator. ${exp ? exp.description.join(' ') : ''} That includes arrivals, departures, transport from the border, and on-site speaker logistics.`
      : `Pour PyCon Togo 2026, je suis bénévole — chargé des speakers. ${exp ? exp.description.join(' ') : ''} Concrètement : arrivées, départs, transport depuis la frontière et logistique speakers sur site.`;
  }
  if (intent === 'yas') {
    const exp = facts.experiences.find((e) => /yas|next gen/i.test(e.company));
    return lang === 'en'
      ? `I coach teams at the 48h Hackathon YAS Togo and Next Gen (2026). ${exp ? exp.description.join(' ') : ''}`
      : `Je suis coach au 48h Hackathon YAS Togo et à Next Gen (2026). ${exp ? exp.description.join(' ') : ''} J’accompagne le cadrage produit, les choix techniques et le pitch.`;
  }
  if (intent === 'projects') {
    const list = facts.projects
      .slice(0, 8)
      .map((project) => {
        const extra = [project.link, project.github].filter((u) => u && u !== '#').join(' · ');
        return `• ${project.title} — ${project.description}${extra ? ` (${extra})` : ''}`;
      })
      .join('\n');
    return lang === 'en'
      ? `Here are some of my public projects:\n${list}`
      : `Voici une sélection de mes projets publics :\n${list}`;
  }
  if (intent === 'blogs') {
    const list = facts.blogs.slice(0, 6).map((b) => `• ${b.title} — ${b.excerpt} (/blog/${b.slug})`).join('\n');
    return lang === 'en' ? `Latest public posts:\n${list}` : `Derniers articles publics :\n${list}`;
  }
  if (intent === 'experience') {
    const list = facts.experiences.slice(0, 8).map((e) => `• ${e.role} — ${e.company} (${e.period})`).join('\n');
    return lang === 'en' ? `My recent path:\n${list}` : `Mon parcours récent :\n${list}`;
  }
  if (intent === 'skills') {
    return lang === 'en'
      ? `I work across web & mobile: ${facts.skills.slice(0, 24).join(', ')}.`
      : `Je travaille en web & mobile : ${facts.skills.slice(0, 24).join(', ')}.`;
  }
  if (intent === 'contact') {
    return `Contact public : ${p.email} · ${p.phone} · ${p.linkedin_url}`;
  }
  if (intent === 'testimonials') {
    const t = facts.testimonials[0];
    return t ? `« ${t.quote} » — ${t.name}, ${t.role || ''} ${t.company || ''}.` : 'Les témoignages sont dans la section Réf.';
  }
  if (intent === 'community') {
    return facts.communities.map((c) => `• ${c.name} — ${c.role}`).join('\n');
  }
  if (intent === 'awards') {
    return facts.awards.map((a) => `• ${a.title} (${a.issuer}, ${a.year})`).join('\n');
  }
  return lang === 'en'
    ? `I'm ${p.full_name}, ${p.hero_title} ${p.bio} Ask me about projects, PyCon, YAS coaching, or latest blogs.`
    : `Je suis ${p.full_name}, ${p.hero_title} ${p.bio} Demandez-moi les projets, PyCon, le coaching YAS ou les derniers blogs.`;
}

function sse(text: string, mode: string): Response {
  const messageId = `msg-${Date.now().toString(36)}`;
  const chunks = [
    `data: ${JSON.stringify({ type: 'start', messageId })}\n\n`,
    `data: ${JSON.stringify({ type: 'text-start', id: 'answer' })}\n\n`,
  ];
  for (let i = 0; i < text.length; i += 80) {
    chunks.push(`data: ${JSON.stringify({ type: 'text-delta', id: 'answer', delta: text.slice(i, i + 80) })}\n\n`);
  }
  chunks.push(`data: ${JSON.stringify({ type: 'text-end', id: 'answer' })}\n\n`);
  chunks.push('data: [DONE]\n\n');
  return new Response(chunks.join(''), {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
      'x-accel-buffering': 'no',
      'X-Chat-Mode': mode,
      'x-vercel-ai-ui-message-stream': 'v1',
    },
  });
}

function userText(body: unknown): string | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const last = messages[messages.length - 1] as Record<string, unknown>;
  if (typeof last?.content === 'string' && last.content.trim()) return last.content.trim().slice(0, 800);
  if (Array.isArray(last?.parts)) {
    const text = last.parts
      .map((part) =>
        part && typeof part === 'object' && (part as { type?: string }).type === 'text'
          ? String((part as { text?: string }).text || '')
          : ''
      )
      .join('\n')
      .trim();
    return text ? text.slice(0, 800) : null;
  }
  return null;
}

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateOk(ip: string): boolean {
  const now = Date.now();
  const cur = rateBuckets.get(ip);
  if (!cur || now >= cur.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (cur.count >= 12) return false;
  cur.count += 1;
  return true;
}

async function handleChat(request: Request): Promise<Response> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return Response.json({ ok: true, mode: chatMode() });
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') {
    return Response.json({ error: 'Méthode non autorisée' }, { status: 405 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateOk(ip)) {
    return Response.json({ error: 'Trop de messages. Réessayez dans un instant.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const query = userText(body);
  if (!query) return Response.json({ error: 'Message utilisateur manquant ou trop long.' }, { status: 400 });

  const facts = await loadFacts();
  const lang = detectLang(query);
  return sse(fallbackAnswer(query, facts, lang), 'fallback');
}

async function nodeToWeb(req: IncomingMessage & { body?: unknown }): Promise<Request> {
  const host = req.headers.host || 'localhost';
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }
  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.body != null) {
      body = typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
    } else {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const buf = Buffer.concat(chunks);
      if (buf.length) body = new Uint8Array(buf);
    }
  }
  return new Request(`https://${host}${req.url || '/api/chat'}`, {
    method: req.method || 'POST',
    headers,
    body,
  });
}

async function writeRes(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (!response.body) {
    res.end();
    return;
  }
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(Buffer.from(value));
    }
  } finally {
    res.end();
  }
}

async function handle(
  req: Request | (IncomingMessage & { body?: unknown }),
  res?: ServerResponse
): Promise<Response | void> {
  try {
    if (typeof Request !== 'undefined' && req instanceof Request && !res) {
      return await handleChat(req);
    }
    if (!res) throw new Error('Missing Node response');
    await writeRes(res, await handleChat(await nodeToWeb(req as IncomingMessage & { body?: unknown })));
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'chat_failed';
    if (res && !res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'assistant_unavailable', detail }));
      return;
    }
    return Response.json({ error: 'assistant_unavailable', detail }, { status: 500 });
  }
}

const handler = Object.assign(handle, { fetch: handleChat });
export default handler;
export const GET = async (): Promise<Response> => Response.json({ ok: true, mode: chatMode() });
export const OPTIONS = async (): Promise<Response> => new Response(null, { status: 204 });
export const POST = async (request: Request): Promise<Response> => handleChat(request);
