/** Bleu officiel du site — utilisé partout sur le blog (sans dégradés) */
export const BLOG_BRAND = {
  bg: 'bg-blue-600',
  bgHover: 'hover:bg-blue-500',
  bgSoft: 'bg-blue-500/10',
  border: 'border-blue-500/30',
  text: 'text-blue-600 dark:text-blue-400',
  shadow: 'shadow-blue-600/25',
  ring: 'ring-blue-500/40',
} as const;

export interface BlogCategoryDef {
  id: string;
  label: string;
  emoji: string;
}

export const BLOG_BUILTIN_CATEGORIES: BlogCategoryDef[] = [
  { id: 'tech', label: 'Tech & Dev', emoji: '⚡' },
  { id: 'energie', label: 'Énergie', emoji: '🔥' },
  { id: 'motivation', label: 'Motivation', emoji: '🚀' },
  { id: 'spiritualite', label: 'Spiritualité', emoji: '✨' },
  { id: 'carriere', label: 'Carrière', emoji: '💼' },
  { id: 'lifestyle', label: 'Lifestyle', emoji: '🌿' },
  { id: 'sante', label: 'Santé mentale', emoji: '🧠' },
];

let categoriesRegistry: BlogCategoryDef[] = [...BLOG_BUILTIN_CATEGORIES];

export function setBlogCategoriesRegistry(cats: BlogCategoryDef[]): void {
  categoriesRegistry = cats.length > 0 ? cats : [...BLOG_BUILTIN_CATEGORIES];
}

export function getBlogCategoriesRegistry(): BlogCategoryDef[] {
  return categoriesRegistry;
}

export function getBlogCategory(id?: string | null): BlogCategoryDef & typeof BLOG_BRAND {
  const slug = (id || 'tech').toLowerCase();
  const found = categoriesRegistry.find((c) => c.id === slug);
  if (found) {
    return { ...found, ...BLOG_BRAND };
  }
  if (slug && slug !== 'autre') {
    const label = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { id: slug, label, emoji: '📝', ...BLOG_BRAND };
  }
  return { ...BLOG_BUILTIN_CATEGORIES[0], ...BLOG_BRAND };
}

export function normalizeBlogCategory(id?: string | null): string {
  return id && categoriesRegistry.some((c) => c.id === id) ? id : id || 'tech';
}

export function slugifyCategoryLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}
