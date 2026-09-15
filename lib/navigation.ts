export function getPathname(): string {
  return window.location.pathname;
}

export function navigate(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getBlogSlugFromPath(): string | null {
  const match = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = decodeURIComponent(match[1]);
  return slug === 'preview' ? null : slug;
}

export function getBlogPreviewTokenFromPath(): string | null {
  const match = window.location.pathname.match(/^\/blog\/preview\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isBlogListPath(): boolean {
  return /^\/blog\/?$/.test(window.location.pathname);
}
