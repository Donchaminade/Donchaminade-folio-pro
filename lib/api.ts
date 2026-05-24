export function getApiBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  // En dev : proxy Vite → XAMPP (voir vite.config.ts)
  if (import.meta.env.DEV) {
    return '';
  }
  return '';
}

export function isApiConfigured(): boolean {
  return getApiBase() !== '' || import.meta.env.DEV;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!isApiConfigured()) {
    throw new Error('VITE_API_URL non configurée (obligatoire en production Vercel)');
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Erreur API (${res.status})`);
  }

  return json as T;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  reading_time: number;
  published_at: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  comments_count: number;
}

export interface BlogComment {
  id: number;
  parent_id?: number | null;
  author_name: string;
  author_role?: 'visitor' | 'admin';
  is_admin?: boolean;
  content: string;
  created_at: string;
  replies?: BlogComment[];
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  liked: boolean;
  share_url?: string;
  og_image_url?: string;
  comments: BlogComment[];
}

export interface BlogCommentResponse {
  id: number;
  parent_id?: number | null;
  comments: BlogComment[];
  comments_count: number;
}

export interface BlogCategoryApi {
  slug: string;
  label: string;
  emoji: string;
}

export async function fetchBlogCategories(): Promise<BlogCategoryApi[]> {
  const res = await apiFetch<ApiResponse<BlogCategoryApi[]>>('/api/blog.php?action=categories');
  return res.data;
}

export async function fetchBlogList(
  page = 1,
  category?: string
): Promise<{
  data: BlogPostSummary[];
  page: number;
  total: number;
  hasMore: boolean;
  categories: BlogCategoryApi[];
}> {
  const cat = category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const res = await apiFetch<
    ApiResponse<BlogPostSummary[]> & {
      page: number;
      total: number;
      hasMore: boolean;
      categories?: BlogCategoryApi[];
    }
  >(`/api/blog.php?action=list&page=${page}&limit=12${cat}`);
  return {
    data: res.data,
    page: res.page,
    total: res.total ?? res.data.length,
    hasMore: res.hasMore ?? false,
    categories: res.categories ?? [],
  };
}

export async function fetchBlogPost(slug: string): Promise<BlogPostDetail> {
  const res = await apiFetch<ApiResponse<BlogPostDetail>>(
    `/api/blog.php?action=post&slug=${encodeURIComponent(slug)}`
  );
  return res.data;
}

export async function toggleBlogLike(slug: string): Promise<{ liked: boolean; likes_count: number }> {
  const res = await apiFetch<ApiResponse<{ liked: boolean; likes_count: number }>>('/api/blog.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'like', slug }),
  });
  return res.data;
}

export async function recordBlogShare(slug: string, platform: string): Promise<number> {
  const res = await apiFetch<ApiResponse<{ shares_count: number }>>('/api/blog.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'share', slug, platform }),
  });
  return res.data.shares_count;
}

export async function postBlogComment(
  slug: string,
  name: string,
  content: string,
  email?: string,
  parentId?: number | null
): Promise<{ message: string; comments: BlogComment[]; comments_count: number }> {
  const res = await apiFetch<{
    success: boolean;
    message: string;
    data: BlogCommentResponse;
  }>('/api/blog.php', {
    method: 'POST',
    body: JSON.stringify({
      action: 'comment',
      slug,
      name,
      content,
      email,
      parent_id: parentId ?? undefined,
    }),
  });
  return {
    message: res.message,
    comments: res.data.comments,
    comments_count: res.data.comments_count,
  };
}

/** Nombre total de commentaires (racines + réponses) */
export function countBlogComments(comments: BlogComment[]): number {
  return comments.reduce((n, c) => n + 1 + countBlogComments(c.replies ?? []), 0);
}

export async function fetchPortfolio<T>(): Promise<T> {
  const res = await apiFetch<ApiResponse<T>>('/api/index.php?resource=portfolio');
  return res.data;
}

export interface RecommendationPayload {
  name: string;
  email?: string;
  role?: string;
  company?: string;
  body: string;
  rating: number;
}

export interface TestimonialPayload {
  quote: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
}

export async function submitTestimonial(
  data: TestimonialPayload,
  files: File[] = []
): Promise<string> {
  if (!isApiConfigured()) {
    throw new Error('VITE_API_URL non configurée');
  }

  const fd = new FormData();
  fd.append('quote', data.quote);
  fd.append('name', data.name);
  if (data.email) fd.append('email', data.email);
  if (data.role) fd.append('role', data.role);
  if (data.company) fd.append('company', data.company);
  if (files[0]) fd.append('image_file', files[0]);

  const res = await fetch(`${getApiBase()}/api/testimonials.php`, {
    method: 'POST',
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Erreur API (${res.status})`);
  }
  return json.message as string;
}

export async function submitRecommendation(data: RecommendationPayload): Promise<string> {
  const res = await apiFetch<{ success: boolean; message: string }>('/api/recommendations.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.message;
}

export async function submitContact(name: string, email: string, message: string): Promise<string> {
  const res = await apiFetch<{ success: boolean; message: string }>('/api/contact.php', {
    method: 'POST',
    body: JSON.stringify({ type: 'contact', name, email, message }),
  });
  return res.message;
}

export interface CollaborationPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  collaboration_brief: string;
  has_documents: boolean;
  documents_details?: string;
  meeting_platform?: string;
  /** Créneaux formatés (générés depuis les sélecteurs date/heure) */
  meeting_slots?: string;
  meeting_notes?: string;
}

export async function submitCollaboration(
  data: CollaborationPayload,
  files: File[] = []
): Promise<string> {
  if (!isApiConfigured()) {
    throw new Error('VITE_API_URL non configurée');
  }

  const fd = new FormData();
  fd.append('type', 'collaboration');
  fd.append('name', data.name);
  fd.append('email', data.email);
  fd.append('collaboration_brief', data.collaboration_brief);
  fd.append('has_documents', data.has_documents ? '1' : '0');
  if (data.phone) fd.append('phone', data.phone);
  if (data.company) fd.append('company', data.company);
  if (data.subject) fd.append('subject', data.subject);
  if (data.documents_details) fd.append('documents_details', data.documents_details);
  if (data.meeting_platform) fd.append('meeting_platform', data.meeting_platform);
  if (data.meeting_slots) fd.append('meeting_slots', data.meeting_slots);
  if (data.meeting_notes) fd.append('meeting_notes', data.meeting_notes);
  files.forEach((file) => fd.append('documents[]', file));

  const res = await fetch(`${getApiBase()}/api/contact.php`, {
    method: 'POST',
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Erreur API (${res.status})`);
  }
  return json.message as string;
}
