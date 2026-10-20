// Contenu réel repris de Donchaminade-folio-pro (database/catalog/profile-catalog.php,
// api/catalog.json, constants.tsx). Les éléments absents sont marqués TODO.
export const profile = {
  fullName: 'ADJOLOU Dondah Chaminade',
  short: 'CHAMINADE',
  heroTitle: 'Développeur Web & Mobile.',
  heroSubtitle: 'Ambassadeur SpaceXAI | Co-organisateur GDG Lomé',
  bio: 'Ingénieur IT passionné, je conçois et déploie des solutions numériques sur mesure.',
  availability: 'Disponible pour de nouveaux défis',
  experienceBadge: '4+ ans',
  email: 'chaminade.dondah.adjolou@gmail.com',
  phone: '+22899181626',
  phoneDisplay: '+228 99 18 16 26',
  whatsapp: 'https://wa.me/22899181626',
  linkedin: 'https://linkedin.com/in/chaminadeadjolou',
  twitter: 'https://x.com/Donchaminade',
  github: 'https://github.com/Donchaminade',
  cv: '/img/CV_ADJOLOU_DONDAH_CHAMINADE.pdf',
  photo: '/img/portrait-cutout.png',
  location: 'TODO : ville / pays à confirmer',
  year: '2026',
};

export const roles = ['Web', 'Mobile', 'Flutter', 'Next.js'];

export const skills: string[][] = [
  ['Flutter', 'React', 'Laravel', 'Supabase', 'Next.js', 'TypeScript', 'PHP', 'MySQL'],
  ['PostgreSQL', 'Git', 'GitHub', 'Bootstrap', 'Tailwind', 'Figma', 'Canva'],
  ['Leadership & Organisation', 'Communication Claire & Efficace', 'Esprit d’Équipe & Collaboration', 'Créativité & Innovation'],
  ['Adaptabilité & Apprentissage Rapide', 'Gestion du Stress & Rigueur', 'Esprit d’Initiative & Autonomie', 'Facultés Pédagogiques'],
];

export const experiences = [
  { company: 'GROSBIT SARLU', role: 'IT Support, Développeur Web & Mobile', period: 'Février 2026 – Présent' },
  { company: 'Tayba Market', role: 'Consultant IT & Lead Tech', period: '2025' },
  { company: 'Efficorpe', role: 'Développeur Frontend Mobile', period: 'Août 2025 – Octobre 2025' },
];

// Les 5 blocs de compétences du portfolio actuel (SKILL_BLOCKS), utilisés comme services.
export const services = [
  { title: 'Backend & API Engineering', items: ['PHP (architecture orientée production)', 'API Development & RESTful Services', 'Node.js', 'Base de données (MySQL & modélisation)', 'DevOps & déploiement'] },
  { title: 'Fullstack Web Development', items: ['React (TypeScript)', 'HTML5 / CSS3 / JavaScript', 'Bootstrap & outils UI', 'Web design & UI/UX', 'Architecture & structuration'] },
  { title: 'Mobile Development', items: ['Flutter'] },
  { title: 'AI & Data Solutions', items: ['Intégration IA', 'Data', 'Python'] },
  { title: 'Digital Marketing & Management', items: ['Social media & community', 'Leadership & team management'] },
];

export type Project = {
  title: string; accent: string; rest: string; type: 'Mobile' | 'Web';
  description: string; tags: string[]; images: string[]; link?: string; github?: string;
};

export const projects: Project[] = [
  {
    title: 'Picon', accent: 'Pic', rest: 'on', type: 'Mobile',
    description: 'App de tirage photo publiée sur Google Play (com.photopicon.app). 26 écrans Flutter, Firebase Auth, hors ligne, paiement mobile money.',
    tags: ['Flutter', 'Firebase', 'Spring Boot'],
    images: ['/img/picon-play-2.jpg', '/img/picon-play-5.jpg', '/img/picon-play-6.jpg'],
    link: 'https://play.google.com/store/apps/details?id=com.photopicon.app',
    github: 'https://github.com/Donchaminade/photopicon',
  },
  {
    title: 'Akontaa App', accent: 'Akon', rest: 'taa App', type: 'Mobile',
    description: 'Application mobile de gestion des dettes et redevances.',
    tags: ['Flutter', 'Dart', 'Tailwind'],
    images: ['/img/akk.jpeg', '/img/ak.jpeg', '/img/ak1.jpeg'],
    github: 'https://github.com/Donchaminade/akontaa_v2',
  },
  {
    title: 'RachCargo', accent: 'Rach', rest: 'Cargo', type: 'Web',
    description: 'Plateforme d’expédition premium de colis par voie aérienne.',
    tags: ['Next.js', 'Tailwind'],
    images: ['/img/rachcar.png', '/img/rachcaar.png'],
    link: 'https://rachcargo.vercel.app/',
  },
  {
    title: 'Nutripack', accent: 'Nutri', rest: 'pack', type: 'Web',
    description: 'Plateforme e-Commerce de vente de produits alimentaires bio.',
    tags: ['Next.js', 'Tailwind', 'Supabase'],
    images: ['/img/nutri.png', '/img/nutrii.png'],
    link: 'https://nutripack.vercel.app/',
    github: 'https://github.com/Donchaminade/nutripack/',
  },
];

// Écrans d'apps mobiles réelles : Picon (Google Play), Akontaa, Ratoufa, Locafrica.
export const phoneScreens = [
  { src: '/img/picon-play-1.jpg', label: 'Picon — Accueil' },
  { src: '/img/picon-play-3.jpg', label: 'Picon — Paiement' },
  { src: '/img/picon-play-4.jpg', label: 'Picon — Récapitulatif' },
  { src: '/img/ak2.jpeg', label: 'Akontaa' },
  { src: '/img/rtf.jpeg', label: 'Ratoufa' },
  { src: '/img/rtf1.jpeg', label: 'Ratoufa — Tickets' },
  { src: '/img/ak3.jpeg', label: 'Akontaa — Suivi' },
  { src: '/img/picon-play-7.jpg', label: 'Picon — Souvenirs' },
];

export const nav = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'services', label: 'Services' },
  { id: 'projets', label: 'Projets' },
  { id: 'composants', label: 'Composants' },
  { id: 'contact', label: 'Contact' },
];
