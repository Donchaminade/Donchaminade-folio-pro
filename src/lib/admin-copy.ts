import type { Lang } from './dictionary';

export const adminSectionIds = [
  'tableau',
  'blog',
  'commentaires',
  'audit',
  'technologies',
  'projets',
  'experiences',
  'profil',
  'statistiques',
  'temoignages',
  'recommandations',
  'communautes',
  'distinctions',
  'messages',
  'competences',
] as const;

export type AdminSectionId = (typeof adminSectionIds)[number];

type Copy = {
  loginKicker: string;
  loginTitle: string;
  loginAccent: string;
  welcome: string;
  welcomeHint: string;
  email: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  forgot: string;
  forgotNote: string;
  reserved: string;
  emailInvalid: string;
  passwordRequired: string;
  steps: [string, string, string];
  shield: string;
  dashboard: string;
  logout: string;
  site: string;
  menu: string;
  close: string;
  greetingMorning: string;
  greetingDay: string;
  greetingEvening: string;
  greetingHint: string;
  overview: string;
  activity: string;
  empty: string;
  emptyHint: string;
  save: string;
  publish: string;
  upload: string;
  remove: string;
  saved: string;
  published: string;
  uploaded: string;
  removed: string;
  needFields: string;
  needFile: string;
  title: string;
  detail: string;
  status: string;
  draft: string;
  live: string;
  add: string;
  search: string;
  nav: Record<AdminSectionId, string>;
  hints: Record<AdminSectionId, string>;
};

const fr: Copy = {
  loginKicker: 'Administration',
  loginTitle: 'Connexion',
  loginAccent: 'sécurisée',
  welcome: 'Bon retour',
  welcomeHint: 'Identifiez-vous pour continuer.',
  email: 'Email',
  password: 'Mot de passe',
  showPassword: 'Afficher le mot de passe',
  hidePassword: 'Masquer le mot de passe',
  submit: 'Connexion',
  forgot: 'Mot de passe oublié ?',
  forgotNote: 'Le renouvellement reste sur le serveur d’administration.',
  reserved: 'Accès réservé.',
  emailInvalid: 'Email invalide.',
  passwordRequired: 'Mot de passe requis.',
  steps: ['Identifiants', 'Contrôle', 'Authentification'],
  shield: 'Contrôle de session',
  dashboard: 'Tableau de bord',
  logout: 'Déconnexion',
  site: 'Site public',
  menu: 'Ouvrir le menu',
  close: 'Fermer le menu',
  greetingMorning: 'Bonjour',
  greetingDay: 'Bon après-midi',
  greetingEvening: 'Bonsoir',
  greetingHint: 'Le contenu publié, les retours et les brouillons de cette visite.',
  overview: 'Aperçu',
  activity: 'Activité',
  empty: 'Rien à afficher',
  emptyHint: 'Les écritures restent sur l’admin du serveur. Ici, la liste suit cette visite.',
  save: 'Enregistrer',
  publish: 'Publier',
  upload: 'Envoyer le fichier',
  remove: 'Supprimer',
  saved: 'Enregistré',
  published: 'Publié',
  uploaded: 'Fichier prêt',
  removed: 'Retiré de la liste',
  needFields: 'Le titre est requis.',
  needFile: 'Choisissez un fichier.',
  title: 'Titre',
  detail: 'Détail',
  status: 'Statut',
  draft: 'Brouillon',
  live: 'Publié',
  add: 'Ajouter',
  search: 'Filtrer',
  nav: {
    tableau: 'Tableau de bord',
    blog: 'Blog',
    commentaires: 'Commentaires',
    audit: 'Journal d’audit',
    technologies: 'Technologies',
    projets: 'Projets',
    experiences: 'Expériences',
    profil: 'Profil',
    statistiques: 'Statistiques',
    temoignages: 'Témoignages',
    recommandations: 'Recommandations',
    communautes: 'Communautés',
    distinctions: 'Distinctions',
    messages: 'Messages',
    competences: 'Compétences',
  },
  hints: {
    tableau: 'Vue d’ensemble du portfolio.',
    blog: 'Articles déjà publiés par l’API.',
    commentaires: 'Volume de commentaires par article.',
    audit: 'Journal des actions de cette visite.',
    technologies: 'Outils affichés sur le site.',
    projets: 'Fiches projet, locales puis celles de l’API.',
    experiences: 'Parcours professionnel.',
    profil: 'Identité affichée sur le portfolio.',
    statistiques: 'Chiffres du hero et du catalogue.',
    temoignages: 'Retours publiés.',
    recommandations: 'Recommandations publiées.',
    communautes: 'Communautés et rôles.',
    distinctions: 'Prix et reconnaissances.',
    messages: 'La boîte de réception reste servie par le serveur.',
    competences: 'Savoir-être et impacts.',
  },
};

const en: Copy = {
  loginKicker: 'Administration',
  loginTitle: 'Secure',
  loginAccent: 'sign-in',
  welcome: 'Welcome back',
  welcomeHint: 'Sign in to continue.',
  email: 'Email',
  password: 'Password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  submit: 'Login',
  forgot: 'Forgot password?',
  forgotNote: 'Reset stays on the administration server.',
  reserved: 'Restricted access.',
  emailInvalid: 'Invalid email.',
  passwordRequired: 'Password required.',
  steps: ['Credentials', 'Security check', 'Authentication'],
  shield: 'Session check',
  dashboard: 'Dashboard',
  logout: 'Log out',
  site: 'Public site',
  menu: 'Open menu',
  close: 'Close menu',
  greetingMorning: 'Good morning',
  greetingDay: 'Good afternoon',
  greetingEvening: 'Good evening',
  greetingHint: 'Published content, replies, and drafts from this visit.',
  overview: 'Overview',
  activity: 'Activity',
  empty: 'Nothing to show',
  emptyHint: 'Writes stay on the server admin. This list follows the current visit.',
  save: 'Save',
  publish: 'Publish',
  upload: 'Upload file',
  remove: 'Delete',
  saved: 'Saved',
  published: 'Published',
  uploaded: 'File ready',
  removed: 'Removed from the list',
  needFields: 'Title is required.',
  needFile: 'Choose a file.',
  title: 'Title',
  detail: 'Detail',
  status: 'Status',
  draft: 'Draft',
  live: 'Published',
  add: 'Add',
  search: 'Filter',
  nav: {
    tableau: 'Dashboard',
    blog: 'Blog',
    commentaires: 'Comments',
    audit: 'Audit log',
    technologies: 'Technologies',
    projets: 'Projects',
    experiences: 'Experience',
    profil: 'Profile',
    statistiques: 'Statistics',
    temoignages: 'Testimonials',
    recommandations: 'Recommendations',
    communautes: 'Communities',
    distinctions: 'Awards',
    messages: 'Messages',
    competences: 'Skills',
  },
  hints: {
    tableau: 'Portfolio overview.',
    blog: 'Posts already published by the API.',
    commentaires: 'Comment volume per post.',
    audit: 'Actions from this visit.',
    technologies: 'Tools shown on the site.',
    projets: 'Project cards, local first, then the API.',
    experiences: 'Career timeline.',
    profil: 'Identity shown on the portfolio.',
    statistiques: 'Hero and catalog figures.',
    temoignages: 'Published testimonials.',
    recommandations: 'Published recommendations.',
    communautes: 'Communities and roles.',
    distinctions: 'Awards and recognition.',
    messages: 'The inbox stays served by the server.',
    competences: 'Soft skills and impact.',
  },
};

export const adminCopy: Record<Lang, Copy> = { fr, en };
export type AdminCopy = Copy;
