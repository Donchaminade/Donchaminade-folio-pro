import type { Project } from '../types';

/** Fusionne l'API et le catalogue local : l'admin peut modifier certains projets, le reste vient de constants. */
export function mergeProjects(apiProjects: Project[] | undefined, catalog: Project[]): Project[] {
  const fromApi = apiProjects ?? [];
  if (fromApi.length === 0) {
    return catalog;
  }
  if (fromApi.length >= catalog.length) {
    return fromApi;
  }
  const apiTitles = new Set(fromApi.map((p) => p.title.trim().toLowerCase()));
  const extras = catalog.filter((p) => !apiTitles.has(p.title.trim().toLowerCase()));
  return [...fromApi, ...extras];
}
