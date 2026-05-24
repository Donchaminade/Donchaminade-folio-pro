import { TECH_ICONS } from '../constants';

export interface TechTag {
  name: string;
  icon?: string | null;
}

/** Normalise tags API (objets) ou constants (strings) */
export function normalizeProjectTags(
  tags?: string[],
  tagDetails?: TechTag[]
): TechTag[] {
  if (tagDetails && tagDetails.length > 0) {
    return tagDetails;
  }
  return (tags ?? []).map((name) => ({
    name,
    icon: TECH_ICONS[name] ?? null,
  }));
}

export function techIconUrl(tag: TechTag): string | null {
  return tag.icon || TECH_ICONS[tag.name] || null;
}
