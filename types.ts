
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

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tags?: string[];
}

export interface Education {
  degree: string;
  field: string;
  school: string;
  year: string;
}

export interface Project {
  title: string;
  description: string;
  detailedDescription?: string;
  tags: string[];
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
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
}

export interface ManagedPage {
  name: string;
  logo: string;
  link: string;
  followers?: string;
  category: string;
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
