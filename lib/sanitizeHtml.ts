import DOMPurify from 'dompurify';

const IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'codepen.io',
  'www.loom.com',
]);

let hooked = false;

function ensureHook(): void {
  if (hooked || typeof window === 'undefined') return;
  hooked = true;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return;
    const el = node as Element;
    const src = el.getAttribute('src') || '';
    let host = '';
    try {
      host = new URL(src, window.location.origin).hostname;
    } catch {
      host = '';
    }
    if (!IFRAME_HOSTS.has(host)) {
      el.parentNode?.removeChild(el);
    }
  });
}

export function sanitizeBlogHtml(html: string): string {
  ensureHook();
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['figure', 'figcaption', 'iframe'],
    ADD_ATTR: [
      'id',
      'target',
      'rel',
      'loading',
      'decoding',
      'width',
      'height',
      'data-lang',
      'allow',
      'allowfullscreen',
      'frameborder',
      'referrerpolicy',
    ],
  });
}

function sameAsset(a: string, b: string): boolean {
  const file = (value: string) => {
    try {
      const path = value.split('?')[0].split('#')[0];
      return decodeURIComponent(path.split('/').pop() || '').toLowerCase();
    } catch {
      return '';
    }
  };
  const left = file(a);
  const right = file(b);
  return Boolean(left && right && left === right);
}

/** Retire la première figure si elle répète la couverture. */
export function stripDuplicateCover(html: string, coverUrl: string): string {
  if (!coverUrl || typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const figure = doc.body.querySelector('figure');
  const img = figure?.querySelector('img');
  const src = img?.getAttribute('src') || '';
  if (figure && img && sameAsset(src, coverUrl)) {
    figure.remove();
  }
  return doc.body.innerHTML;
}
