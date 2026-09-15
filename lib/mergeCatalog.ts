import type { Community, Experience, Project } from '../types';

function keyOf(value: string): string {
  return value.trim().toLowerCase();
}

/** Fusionne l'API et le catalogue local : l'admin peut modifier certains projets, le reste vient de constants. */
export function mergeProjects(apiProjects: Project[] | undefined, catalog: Project[]): Project[] {
  const fromApi = apiProjects ?? [];
  if (fromApi.length === 0) {
    return catalog;
  }
  if (fromApi.length >= catalog.length) {
    return fromApi;
  }
  const apiTitles = new Set(fromApi.map((p) => keyOf(p.title)));
  const extras = catalog.filter((p) => !apiTitles.has(keyOf(p.title)));
  return [...fromApi, ...extras];
}

export function mergeExperiences(apiItems: Experience[] | undefined, catalog: Experience[]): Experience[] {
  const fromApi = apiItems ?? [];
  if (fromApi.length === 0) {
    return catalog;
  }
  const seen = new Set(fromApi.map((item) => keyOf(item.company)));
  const extras = catalog.filter((item) => !seen.has(keyOf(item.company)));
  return extras.length === 0 ? fromApi : [...fromApi, ...extras];
}

export function mergeCommunities(apiItems: Community[] | undefined, catalog: Community[]): Community[] {
  const fromApi = apiItems ?? [];
  if (fromApi.length === 0) {
    return catalog;
  }
  const seen = new Set(fromApi.map((item) => keyOf(item.name)));
  const extras = catalog.filter((item) => !seen.has(keyOf(item.name)));
  return extras.length === 0 ? fromApi : [...fromApi, ...extras];
}
