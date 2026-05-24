import type { Recommendation, Testimonial } from '../types';

export type SocialProofKind = 'testimonial' | 'recommendation';
export type SocialProofFilter = 'all' | SocialProofKind;

export interface SocialProofItem {
  id: string;
  kind: SocialProofKind;
  name: string;
  role?: string;
  company?: string;
  text: string;
  image?: string;
  rating?: number;
}

export function testimonialToItem(t: Testimonial, index: number): SocialProofItem {
  return {
    id: `testimonial-${index}-${t.name}`,
    kind: 'testimonial',
    name: t.name,
    role: t.role,
    company: t.company,
    text: t.quote,
    image: t.image,
  };
}

export function recommendationToItem(r: Recommendation, index: number): SocialProofItem {
  return {
    id: `recommendation-${index}-${r.name}-${r.createdAt ?? index}`,
    kind: 'recommendation',
    name: r.name,
    role: r.role ?? undefined,
    company: r.company ?? undefined,
    text: r.body,
    rating: r.rating,
  };
}

export function mergeSocialProof(
  testimonials: Testimonial[],
  recommendations: Recommendation[]
): SocialProofItem[] {
  const items: SocialProofItem[] = [
    ...testimonials.map(testimonialToItem),
    ...recommendations.map(recommendationToItem),
  ];
  return items;
}

export function filterSocialProof(items: SocialProofItem[], filter: SocialProofFilter): SocialProofItem[] {
  if (filter === 'all') return items;
  return items.filter((i) => i.kind === filter);
}

export const SOCIAL_PROOF_FILTERS: { id: SocialProofFilter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'recommendation', label: 'Recommandations' },
  { id: 'testimonial', label: 'Témoignages' },
];
