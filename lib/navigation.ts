export function getPathname(): string {
  return window.location.pathname;
}

export function navigate(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getBlogSlugFromPath(): string | null {
  const match = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isBlogListPath(): boolean {
  return /^\/blog\/?$/.test(window.location.pathname);
}
