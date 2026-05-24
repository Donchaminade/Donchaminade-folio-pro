
export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface Skill {
  name: string;
  icon: string;
  category: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
  icons?: string[];
}

export interface SkillBlock {
  title: string;
  icon: string;
  categories: SkillCategory[];
}

export interface SoftSkill {
  title: string;
  context: string[];
  impact: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tags?: string[];
  tagDetails?: TechTag[];
}

export interface Education {
  degree: string;
  field: string;
  school: string;
  year: string;
}

export interface TechTag {
  name: string;
  icon?: string | null;
}

export interface Project {
  title: string;
  description: string;
  detailedDescription?: string;
  tags: string[];
  tagDetails?: TechTag[];
  image: string;
  additionalImages?: string[];
  link: string;
  github?: string;
  type: 'Web' | 'Mobile' | 'Design';
}

export interface Community {
  name: string;
  logo: string;
  role: string;
  description: string;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
}

export interface Recommendation {
  name: string;
  role?: string | null;
  company?: string | null;
  body: string;
  rating: number;
  createdAt?: string;
}

export interface ManagedPage {
  name: string;
  logo: string;
  link: string;
  followers?: string;
  category: string;
  borderColor?: string;
}

export interface Award {
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface Client {
  name: string;
  logo: string;
}
