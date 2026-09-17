export type ChatLang = 'fr' | 'en';

export type ChatIntent =
  | 'projects'
  | 'experience'
  | 'pycon'
  | 'yas'
  | 'blogs'
  | 'about'
  | 'skills'
  | 'contact'
  | 'testimonials'
  | 'community'
  | 'awards'
  | 'offtopic'
  | 'generic';

export interface ChatProjectFact {
  title: string;
  description: string;
  detailedDescription?: string;
  tags: string[];
  type?: string;
  link?: string;
  github?: string;
}

export interface ChatExperienceFact {
  company: string;
  role: string;
  period: string;
  description: string[];
  tags?: string[];
}

export interface ChatBlogFact {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at?: string;
}

export interface ChatTestimonialFact {
  quote: string;
  name: string;
  role?: string;
  company?: string;
}

export interface ChatCommunityFact {
  name: string;
  role: string;
  description: string;
}

export interface ChatAwardFact {
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export interface ChatProfileFact {
  full_name: string;
  hero_title: string;
  bio: string;
  availability_text?: string;
  experience_badge?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  cv_path?: string;
}

export interface PortfolioFacts {
  profile: ChatProfileFact;
  projects: ChatProjectFact[];
  experiences: ChatExperienceFact[];
  blogs: ChatBlogFact[];
  testimonials: ChatTestimonialFact[];
  communities: ChatCommunityFact[];
  awards: ChatAwardFact[];
  skills: string[];
  education: string[];
  source: 'live' | 'snapshot' | 'mixed';
}

export interface RetrievedContext {
  facts: PortfolioFacts;
  contextText: string;
  selectedTitles: string[];
}
