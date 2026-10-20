import type { Project } from './catalog';

/** API PHP déjà en ligne. Ne pas la déplacer ni la redéployer. */
export const API_BASE = 'https://donchamfolio.grosbit.com';

export type ApiOk = { success: true; message: string };

async function readJson(res: Response): Promise<{ error?: string; message?: string; success?: boolean; data?: unknown }> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function submitContact(name: string, email: string, message: string, website = ''): Promise<string> {
  const res = await fetch(`${API_BASE}/api/contact.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'contact', name, email, message, website }),
  });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return json.message || '';
}

export type CollaborationPayload = {
  name: string;
  email: string;
  subject: string;
  collaboration_brief: string;
  meeting_platform: string;
  meeting_slots: string;
  meeting_notes?: string;
  website?: string;
};

export async function submitCollaboration(data: CollaborationPayload): Promise<string> {
  const fd = new FormData();
  fd.append('type', 'collaboration');
  fd.append('name', data.name);
  fd.append('email', data.email);
  fd.append('subject', data.subject);
  fd.append('collaboration_brief', data.collaboration_brief);
  fd.append('has_documents', '0');
  fd.append('meeting_platform', data.meeting_platform);
  fd.append('meeting_slots', data.meeting_slots);
  if (data.meeting_notes) fd.append('meeting_notes', data.meeting_notes);
  if (data.website) fd.append('website', data.website);
  const res = await fetch(`${API_BASE}/api/contact.php`, { method: 'POST', body: fd });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return json.message || '';
}

export type Recommendation = {
  id?: number;
  name: string;
  role?: string;
  company?: string;
  body: string;
  rating?: number;
};

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const res = await fetch(`${API_BASE}/api/recommendations.php`);
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return Array.isArray(json.data) ? (json.data as Recommendation[]) : [];
}

export async function submitRecommendation(data: {
  name: string;
  email?: string;
  role?: string;
  company?: string;
  body: string;
  rating: number;
  website?: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/api/recommendations.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return json.message || '';
}

const FAKE_NAMES = new Set(['koffi mensah', 'abla doe', 'jean-pierre kouakou']);

export type PublishedTestimonial = {
  name: string;
  quote: string;
  role?: string;
  company?: string;
};

function realName(name: string | undefined): boolean {
  return !!name && !FAKE_NAMES.has(name.trim().toLowerCase());
}

/** Retours déjà publiés sur l’API. Listes vides = rien n’est en ligne. */
export async function fetchProof(): Promise<{ testimonials: PublishedTestimonial[]; recommendations: Recommendation[] }> {
  const res = await fetch(`${API_BASE}/api/index.php?resource=portfolio`);
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  const data = (json.data ?? {}) as {
    testimonials?: Array<{ name?: string; quote?: string; role?: string; company?: string }>;
    recommendations?: Recommendation[];
  };
  const testimonials = (data.testimonials ?? [])
    .filter((item) => realName(item.name) && !!item.quote)
    .map((item) => ({ name: item.name as string, quote: item.quote as string, role: item.role, company: item.company }));
  let recommendations = (data.recommendations ?? []).filter((item) => realName(item.name) && !!item.body);
  try {
    const published = await fetchRecommendations();
    if (published.length) recommendations = published.filter((item) => realName(item.name) && !!item.body);
  } catch { /* la liste du portfolio reste le repli */ }
  return { testimonials, recommendations };
}

export async function submitTestimonial(data: {
  quote: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  website?: string;
  image?: File | null;
}): Promise<string> {
  const fd = new FormData();
  fd.append('quote', data.quote);
  fd.append('name', data.name);
  if (data.email) fd.append('email', data.email);
  if (data.role) fd.append('role', data.role);
  if (data.company) fd.append('company', data.company);
  if (data.website) fd.append('website', data.website);
  if (data.image) fd.append('image_file', data.image);
  const res = await fetch(`${API_BASE}/api/testimonials.php`, { method: 'POST', body: fd });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return json.message || '';
}

export type ListedProject = Project & { featured?: boolean; order?: number };

const PRIVATE_REPO = /github\.com\/[^/]+\/(academiablanc|k7-memoire|devfest)(?:\.git)?\/?$/i;

function absMedia(src: string): string {
  if (!src || src === '#') return '';
  if (/^https?:\/\//i.test(src)) return src;
  return `${API_BASE}${src.startsWith('/') ? src : `/${src}`}`;
}

function cleanLink(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const link = value.trim();
  if (!link || link === '#' || link.toLowerCase() === 'null') return undefined;
  return link;
}

function mapProject(raw: Record<string, unknown>): ListedProject | null {
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null;
  if (raw.is_active === 0 || raw.is_active === false) return null;
  const status = typeof raw.status === 'string' ? raw.status.toLowerCase() : '';
  if (status === 'inactive' || status === 'draft' || status === 'hidden') return null;
  const fr = typeof raw.description === 'string' ? raw.description.trim() : '';
  const enRaw = raw.description_en ?? raw.descriptionEn;
  const en = typeof enRaw === 'string' && enRaw.trim() ? enRaw.trim() : fr;
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '') : [];
  const extra = Array.isArray(raw.additionalImages) ? raw.additionalImages : [];
  const images = [raw.image, ...extra]
    .filter((src): src is string => typeof src === 'string')
    .map((src) => absMedia(src.trim()))
    .filter(Boolean);
  const github = cleanLink(raw.github);
  return {
    title,
    type: raw.type === 'Mobile' ? 'Mobile' : 'Web',
    description: { fr: fr || title, en: en || fr || title },
    tags,
    images,
    link: cleanLink(raw.link),
    github: github && PRIVATE_REPO.test(github) ? undefined : github,
    featured: Number(raw.is_featured) === 1,
    order: Number(raw.sort_order ?? 0) || 0,
  };
}

/** Projets publiés par l’admin. Le site est exporté en statique : le rafraîchissement se fait dans le navigateur. */
export async function fetchPortfolioProjects(): Promise<ListedProject[]> {
  const res = await fetch(`${API_BASE}/api/index.php?resource=portfolio`, { cache: 'no-store' });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  const data = (json.data ?? {}) as { projects?: Record<string, unknown>[] };
  const projects = (data.projects ?? [])
    .map((item) => mapProject(item))
    .filter((item): item is ListedProject & { order: number } => item !== null);
  projects.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
  return projects;
}
