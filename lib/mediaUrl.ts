/**
 * Chemin public d'un média uploadé, aligné sur mediaUrl / uploadDisplayUrl.
 * /uploads/blog/x → /public/uploads/blog/x
 */
export function publicMediaPath(path: string | null | undefined): string {
  if (!path) return '';
  let normalized = path.trim();
  if (/^https?:\/\//i.test(normalized)) return normalized;
  normalized = normalized.startsWith('/') ? normalized : `/${normalized}`;
  if (normalized.startsWith('/public/uploads/')) {
    normalized = normalized.slice('/public'.length);
  }
  if (normalized.startsWith('/uploads/') && !normalized.startsWith('/public/')) {
    normalized = `/public${normalized}`;
  }
  return normalized;
}

/** URL absolue du média. Sans base API, renvoie le chemin public seul. */
export function absoluteMediaUrl(path: string | null | undefined, apiBase: string): string {
  const normalized = publicMediaPath(path);
  if (!normalized) return '';
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const base = apiBase.replace(/\/$/, '');
  return base ? `${base}${normalized}` : normalized;
}
