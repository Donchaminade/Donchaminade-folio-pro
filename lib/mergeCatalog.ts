import type { Community, Experience, Project } from '../types';

/**
 * L'admin gagne : une liste API non vide est affichée telle quelle.
 * Le catalogue local ne sert que lorsque l'API ne renvoie rien.
 */
export function mergeProjects(apiProjects: Project[] | undefined, catalog: Project[]): Project[] {
  const fromApi = apiProjects ?? [];
  return fromApi.length === 0 ? catalog : fromApi;
}

export function mergeExperiences(apiItems: Experience[] | undefined, catalog: Experience[]): Experience[] {
  const fromApi = apiItems ?? [];
  return fromApi.length === 0 ? catalog : fromApi;
}

export function mergeCommunities(apiItems: Community[] | undefined, catalog: Community[]): Community[] {
  const fromApi = apiItems ?? [];
  return fromApi.length === 0 ? catalog : fromApi;
}
