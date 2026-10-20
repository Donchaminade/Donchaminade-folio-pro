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

export async function submitTestimonial(data: {
  quote: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  website?: string;
}): Promise<string> {
  const fd = new FormData();
  fd.append('quote', data.quote);
  fd.append('name', data.name);
  if (data.email) fd.append('email', data.email);
  if (data.role) fd.append('role', data.role);
  if (data.company) fd.append('company', data.company);
  if (data.website) fd.append('website', data.website);
  const res = await fetch(`${API_BASE}/api/testimonials.php`, { method: 'POST', body: fd });
  const json = await readJson(res);
  if (!res.ok || json.success === false) throw new Error(json.error || `Erreur API (${res.status})`);
  return json.message || '';
}
