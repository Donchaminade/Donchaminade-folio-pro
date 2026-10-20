/** Appels vers l’admin PHP déjà en ligne. Le cookie de session reste celui du serveur. */

const ROOT = '/php/admin';

export class AdminAuthError extends Error {
  constructor() { super('Session requise.'); }
}

let csrf = '';

function tokenFrom(html: string) {
  const found = html.match(/name="_csrf" value="([a-f0-9]+)"/);
  if (found) csrf = found[1];
  return csrf;
}

function flashFrom(html: string) {
  const type = html.match(/id="adminFlashData"[^>]*data-type="([^"]*)"/)?.[1]
    || html.match(/data-type="([^"]*)"[^>]*id="adminFlashData"/)?.[1]
    || '';
  const message = html.match(/id="adminFlashData"[^>]*data-message="([^"]*)"/)?.[1]
    || html.match(/data-message="([^"]*)"[^>]*id="adminFlashData"/)?.[1]
    || '';
  return { type, message: decode(message) };
}

function decode(value: string) {
  const el = document.createElement('textarea');
  el.innerHTML = value;
  return el.value;
}

function assertHtml(res: Response, html: string) {
  tokenFrom(html);
  if (res.url.includes('login.php') || html.includes('name="password"') && html.includes('login-card')) {
    throw new AdminAuthError();
  }
  const flash = flashFrom(html);
  if (flash.type === 'error' && flash.message) throw new Error(flash.message);
  return flash;
}

export async function adminGet(path: string) {
  const res = await fetch(`${ROOT}/${path}`, { credentials: 'include', cache: 'no-store' });
  const html = await res.text();
  const flash = assertHtml(res, html);
  return { html, flash, url: res.url };
}

export async function adminHasSession() {
  try {
    const res = await fetch(`${ROOT}/index.php`, { credentials: 'include', cache: 'no-store' });
    const html = await res.text();
    tokenFrom(html);
    return res.ok && !res.url.includes('login.php') && html.includes('id="adminSidebar"');
  } catch {
    return false;
  }
}

export async function adminLogin(email: string, password: string) {
  const page = await fetch(`${ROOT}/login.php`, { credentials: 'include', cache: 'no-store' });
  const html = await page.text();
  const token = tokenFrom(html);
  if (!token) throw new Error('Jeton de session introuvable.');
  const body = new FormData();
  body.append('_csrf', token);
  body.append('email', email.trim());
  body.append('password', password);
  const res = await fetch(`${ROOT}/login.php`, { method: 'POST', body, credentials: 'include' });
  const out = await res.text();
  tokenFrom(out);
  const alert = out.match(/role="alert"[^>]*>([^<]+)/)?.[1]?.trim();
  if (alert || res.url.includes('login.php') || !out.includes('id="adminSidebar"')) {
    throw new Error(alert || 'Identifiants incorrects.');
  }
}

export async function adminLogout() {
  await fetch(`${ROOT}/logout.php`, { credentials: 'include' });
  csrf = '';
}

async function ensureToken() {
  if (csrf) return csrf;
  const res = await fetch(`${ROOT}/index.php`, { credentials: 'include', cache: 'no-store' });
  const html = await res.text();
  if (!tokenFrom(html) || res.url.includes('login.php')) throw new AdminAuthError();
  return csrf;
}

export async function adminSubmit(path: string, fields: FormData, file?: { field: string; file: File }) {
  const token = await ensureToken();
  const body = new FormData();
  body.append('_csrf', token);
  fields.forEach((value, key) => {
    if (key !== '_csrf') body.append(key, value);
  });
  if (file) body.set(file.field, file.file);
  const res = await fetch(`${ROOT}/${path}`, { method: 'POST', body, credentials: 'include' });
  const type = res.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const json = await res.json().catch(() => ({})) as { success?: boolean; error?: string; url?: string; message?: string };
    if (!res.ok || json.success === false || json.error) throw new Error(json.error || 'Envoi refusé.');
    return json.url || json.message || 'Fichier enregistré.';
  }
  const html = await res.text();
  const flash = assertHtml(res, html);
  return flash.message || 'Enregistré.';
}

export type AdminRow = { id: string; title: string; meta: string; status: 'live' | 'draft' };

export function parseRows(html: string): AdminRow[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('table tbody tr')].flatMap((tr) => {
    const href = tr.querySelector('a[href*="edit"], a[href*="id="]')?.getAttribute('href') || '';
    const hidden = tr.querySelector('input[name="id"]')?.getAttribute('value') || '';
    const id = href.match(/(?:\bid|edit)=(\d+)/)?.[1] || hidden;
    if (!id) return [];
    const cells = [...tr.querySelectorAll('td')].map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim());
    const text = cells.join(' ');
    const live = !/brouillon|draft|masqu|inactif|cach|hidden|non publi/i.test(text) && /publi|actif|\boui\b|visible|approuv/i.test(text);
    return [{ id, title: cells[0] || `#${id}`, meta: cells.slice(1, 4).join(' · '), status: live ? 'live' as const : 'draft' as const }];
  });
}

export function parseStats(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('a.stat-card')].map((card) => ({
    label: card.querySelector('.uppercase')?.textContent?.trim() || '',
    value: card.querySelector('[style*="a-display"]')?.textContent?.trim() || '0',
    href: card.getAttribute('href') || '',
  })).filter((card) => card.label);
}

export function collectForm(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const form = [...doc.querySelectorAll('form')].find((item) => item.querySelector('[name="action"][value="save"], textarea, input[name="full_name"], input[name^="skill_"]')) || doc.querySelector('form');
  const data = new FormData();
  form?.querySelectorAll('input[name], textarea[name], select[name]').forEach((node) => {
    const el = node as HTMLInputElement;
    if (!el.name || el.name === '_csrf' || el.type === 'file') return;
    if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
    data.append(el.name, el.value ?? '');
  });
  return data;
}

export type SectionCall = {
  page: string;
  edit?: (id: string) => string;
  titleKey: string;
  detailKey: string;
  extraKey?: string;
  extraLabel: { fr: string; en: string };
  fileField?: string;
  uploadCategory?: string;
  canCreate: boolean;
  canDelete: boolean;
  publishAction?: string;
  saveAction?: string;
};

export const sectionCalls: Record<string, SectionCall> = {
  blog: { page: 'blog.php', edit: (id) => `blog.php?action=edit&id=${id}`, titleKey: 'title', detailKey: 'content', extraKey: 'excerpt', extraLabel: { fr: 'Extrait', en: 'Excerpt' }, fileField: 'cover_file', uploadCategory: 'blog', canCreate: true, canDelete: true, publishAction: 'publish', saveAction: 'save' },
  commentaires: { page: 'blog-comments.php', titleKey: 'content', detailKey: 'content', extraLabel: { fr: 'Réponse', en: 'Reply' }, canCreate: false, canDelete: true, publishAction: 'unhide', saveAction: 'reply' },
  technologies: { page: 'technologies.php', edit: (id) => `technologies.php?action=edit&id=${id}`, titleKey: 'name', detailKey: 'icon_url', extraLabel: { fr: 'Icône', en: 'Icon' }, fileField: 'icon_file', uploadCategory: 'technologies', canCreate: true, canDelete: true, saveAction: 'save' },
  projets: { page: 'projects.php', edit: (id) => `projects.php?action=edit&id=${id}`, titleKey: 'title', detailKey: 'description', extraKey: 'link', extraLabel: { fr: 'Lien', en: 'Link' }, fileField: 'image_file', uploadCategory: 'projects', canCreate: true, canDelete: true, publishAction: 'save', saveAction: 'save' },
  experiences: { page: 'experiences.php', edit: (id) => `experiences.php?action=edit&id=${id}`, titleKey: 'company', detailKey: 'role', extraKey: 'period', extraLabel: { fr: 'Période', en: 'Period' }, canCreate: true, canDelete: true, saveAction: 'save' },
  profil: { page: 'profile.php', titleKey: 'full_name', detailKey: 'bio', extraKey: 'email', extraLabel: { fr: 'Email', en: 'Email' }, fileField: 'photo_file', uploadCategory: 'profile', canCreate: false, canDelete: false, saveAction: 'save' },
  statistiques: { page: 'stats.php', edit: (id) => `stats.php?edit=${id}`, titleKey: 'label', detailKey: 'value', extraKey: 'suffix', extraLabel: { fr: 'Suffixe', en: 'Suffix' }, canCreate: true, canDelete: true, saveAction: 'save' },
  temoignages: { page: 'testimonials.php', edit: (id) => `testimonials.php?edit=${id}`, titleKey: 'name', detailKey: 'quote', extraKey: 'role', extraLabel: { fr: 'Rôle', en: 'Role' }, fileField: 'image_file', uploadCategory: 'testimonials', canCreate: true, canDelete: true, publishAction: 'approve', saveAction: 'save' },
  recommandations: { page: 'recommendations.php', titleKey: 'id', detailKey: 'id', extraLabel: { fr: 'Note', en: 'Note' }, canCreate: false, canDelete: true, publishAction: 'hide', saveAction: 'unhide' },
  communautes: { page: 'communities.php', edit: (id) => `communities.php?edit=${id}`, titleKey: 'name', detailKey: 'description', extraKey: 'role', extraLabel: { fr: 'Rôle', en: 'Role' }, fileField: 'logo_file', uploadCategory: 'communities', canCreate: true, canDelete: true, saveAction: 'save' },
  distinctions: { page: 'awards.php', edit: (id) => `awards.php?edit=${id}`, titleKey: 'title', detailKey: 'description', extraKey: 'year', extraLabel: { fr: 'Année', en: 'Year' }, canCreate: true, canDelete: true, saveAction: 'save' },
  messages: { page: 'messages.php', titleKey: 'id', detailKey: 'id', extraLabel: { fr: 'Message', en: 'Message' }, canCreate: false, canDelete: false, saveAction: 'read' },
  competences: { page: 'skills.php', titleKey: 'title', detailKey: 'title', extraLabel: { fr: 'Titre', en: 'Title' }, canCreate: false, canDelete: false, saveAction: 'save' },
};
