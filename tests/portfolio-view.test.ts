import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withKnowledge } from '../lib/chat/knowledge.ts';
import type { PortfolioFacts } from '../lib/chat/types.ts';
import { buildPortfolioView, HERO_LEAD } from '../lib/portfolioView.ts';

test('sans API, le contenu codé en dur sert de secours', () => {
  const view = buildPortfolioView(null);
  assert.equal(view.lead, HERO_LEAD);
  assert.equal(view.stacks.length, 0);
  assert.ok(view.projects.some((project) => /picon/i.test(project.title)));
  assert.ok(view.facts.some((fact) => fact.strong.includes('4+')));
  assert.ok(view.roles.some((role) => /grosbit/i.test(role.company)));
});

test('une réponse API remplace projets, parcours, stacks, profil, compteurs et témoignages', () => {
  const view = buildPortfolioView({
    profile: {
      full_name: 'Nom Admin',
      hero_title: 'Titre admin',
      hero_subtitle: 'Badge admin',
      bio: 'Bio admin exacte, solutions numérique',
      experience_badge: '7 ans',
      availability_text: 'Occupé',
    },
    stats: [{ label: 'Compteur admin', value: '9', suffix: 'x' }],
    projects: [
      {
        title: 'Projet Admin Unique',
        description: 'Description admin',
        detailedDescription: 'Détail admin',
        tags: ['Kotlin'],
        image: '',
        link: 'https://exemple.test',
        type: 'Web',
        is_featured: 1,
      },
      {
        title: 'Second projet',
        description: 'Pas en avant',
        tags: [],
        image: '',
        link: '#',
        type: 'Web',
        is_featured: 0,
      },
    ],
    experiences: [
      {
        company: 'Société Admin',
        role: 'Rôle admin',
        period: 'mars 2024',
        description: ['Fait admin'],
        tags: ['Remote'],
      },
    ],
    communities: [{ name: 'Communauté Admin', logo: '', role: 'Membre', description: '' }],
    testimonials: [
      { quote: 'Vrai retour', name: 'Awa Mensah', role: 'CTO', company: 'X' },
      { quote: 'Faux', name: 'Koffi Mensah', role: '', company: '' },
    ],
    skillBlocks: [
      {
        title: 'Bloc admin',
        icon: 'Server',
        categories: [{ name: 'Langage', skills: ['Kotlin admin'] }],
      },
    ],
  });

  assert.equal(view.name, 'Nom Admin');
  assert.equal(view.roleLine, 'Titre admin');
  assert.equal(view.lead, 'Bio admin exacte, solutions numérique');
  assert.deepEqual(view.badges, ['Badge admin']);
  assert.equal(view.availability, 'Occupé');
  assert.equal(view.projects.length, 2);
  assert.equal(view.projects[0].title, 'Projet Admin Unique');
  assert.equal(view.projects[0].description, 'Description admin');
  assert.equal(view.projects[0].detail, 'Détail admin');
  assert.equal(view.featured.length, 1);
  assert.equal(view.featured[0].title, 'Projet Admin Unique');
  assert.equal(view.roles.length, 1);
  assert.equal(view.roles[0].period, 'mars 2024');
  assert.equal(view.roles[0].summary, 'Fait admin');
  assert.equal(view.roles[0].meta, 'Remote');
  assert.equal(view.communities.length, 1);
  assert.equal(view.testimonials.length, 1);
  assert.equal(view.testimonials[0].name, 'Awa Mensah');
  assert.deepEqual(view.facts, [{ strong: '9 x', label: 'Compteur admin' }]);
  assert.equal(view.stacks[0].chips[0].label, 'Kotlin admin');
  assert.equal(view.playCaption, null);
  assert.ok(!view.projects.some((project) => /ezoa|copyto|k7/i.test(project.title)));
});

test('listes API vides : secours du catalogue, texte de profil conservé', () => {
  const view = buildPortfolioView({
    profile: { bio: 'Bio seule' },
    projects: [],
    experiences: [],
    stats: [],
    skillBlocks: [],
  });
  assert.equal(view.lead, 'Bio seule');
  assert.ok(view.projects.length > 1);
  assert.ok(view.roles.length > 1);
  assert.equal(view.stacks.length, 0);
});

test('en anglais, une disponibilité française sans champ EN devient une phrase de secours', () => {
  const view = buildPortfolioView({
    profile: {
      availability_text: 'Disponible pour de nouveaux défis',
    },
  }, 'en');
  assert.equal(view.availability, 'Available for new challenges');
});

test('le chatbot ne réécrit pas les fiches déjà fournies par l’API', () => {
  const facts: PortfolioFacts = {
    profile: {
      full_name: 'Nom Admin',
      hero_title: 'Titre admin',
      bio: 'Bio courte admin',
      experience_badge: '9 ans',
    },
    projects: [
      {
        title: 'PICON',
        description: 'Texte admin',
        tags: ['Dart'],
        link: 'https://photopicon.vercel.app',
      },
    ],
    experiences: [
      { company: 'GROSBIT SARLU', role: 'Support', period: 'Période admin', description: [] },
    ],
    blogs: [],
    testimonials: [],
    communities: [{ name: 'Communauté Admin', role: 'Membre', description: '' }],
    awards: [],
    skills: ['Kotlin'],
    education: [],
    source: 'live',
  };
  const next = withKnowledge(facts);
  assert.equal(next.profile.experience_badge, '9 ans');
  assert.equal(next.profile.bio, 'Bio courte admin');
  assert.equal(next.projects.length, 1);
  assert.equal(next.projects[0].title, 'PICON');
  assert.equal(next.projects[0].description, 'Texte admin');
  assert.equal(next.projects[0].link, 'https://photopicon.vercel.app');
  assert.equal(next.experiences[0].period, 'Période admin');
  assert.deepEqual(next.skills, ['Kotlin']);
  assert.equal(next.communities.length, 1);
});
