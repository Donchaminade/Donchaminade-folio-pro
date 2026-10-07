import { getApiBase } from './api';
import { absoluteMediaUrl } from './mediaUrl';

/**
 * URL absolue pour médias uploadés sur le serveur PHP (images, PDF).
 * Sur Vercel, les fichiers sont servis depuis l'API, pas depuis le build statique.
 */
export function mediaUrl(path: string | null | undefined): string {
  return absoluteMediaUrl(path, getApiBase());
}
