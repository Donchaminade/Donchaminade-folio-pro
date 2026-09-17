import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fallbackAnswer } from '../lib/chat/fallback.ts';
import { handleChatRequest } from '../lib/chat/handler.ts';
import { detectIntent, detectLang, isDisallowed } from '../lib/chat/language.ts';
import { consumeRateLimit } from '../lib/chat/rateLimit.ts';
import { selectContext } from '../lib/chat/retrieve.ts';
import { lastUserText, normalizeMessages } from '../lib/chat/stream.ts';
import type { PortfolioFacts } from '../lib/chat/types.ts';

const facts: PortfolioFacts = {
  profile: {
    full_name: 'ADJOLOU Dondah Chaminade',
    hero_title: 'Développeur Web & Mobile.',
    bio: 'Ingénieur IT passionné.',
    email: 'chaminade.dondah.adjolou@gmail.com',
    experience_badge: '3+ ans',
  },
  projects: [
    {
      title: 'PICON',
      description: 'App mobile photo.',
      tags: ['Flutter'],
      link: 'https://photopicon.vercel.app',
    },
  ],
  experiences: [
    {
      company: 'PyCon Togo 2026',
      role: 'Bénévole — Chargé des Speakers',
      period: '2026',
      description: ['Logistique speakers, transport depuis la frontière.'],
      tags: ['Python'],
    },
    {
      company: '48h Hackathon YAS Togo | Next Gen',
      role: 'Coach',
      period: '2026',
      description: ['Coaching des équipes participantes.'],
      tags: ['Coaching'],
    },
  ],
  blogs: [
    {
      title: 'Santé mentale',
      slug: 'sante-mentale-ce-n-est-pas-rien',
      excerpt: 'Dépression et silence.',
      category: 'sante',
    },
  ],
  testimonials: [],
  communities: [
    {
      name: 'PyCon Togo',
      role: 'Chargé des Speakers — 2026',
      description: 'Accueil des intervenants.',
    },
  ],
  awards: [],
  skills: ['Flutter', 'React', 'PHP'],
  education: [],
  source: 'snapshot',
};

test('détecte FR par défaut et EN si la question est anglaise', () => {
  assert.equal(detectLang('Quels sont tes projets ?'), 'fr');
  assert.equal(detectLang('What are your latest blogs?'), 'en');
});

test('intents portfolio et refus hors-sujet / privé', () => {
  assert.equal(detectIntent('Parle-moi de ton expérience PyCon'), 'pycon');
  assert.equal(detectIntent('Coach YAS Togo Next Gen'), 'yas');
  assert.equal(detectIntent('Derniers blogs ?'), 'blogs');
  assert.equal(detectIntent('Quels sont tes projets ?'), 'projects');
  assert.equal(detectIntent('Tu travailles chez Grosbit ?'), 'grosbit');
  assert.equal(detectIntent('Quelles sont tes formations ?'), 'education');
  assert.equal(detectIntent('Est-ce que tu maîtrises Flutter ?'), 'flutter');
  assert.equal(detectIntent('Quel est ton LinkedIn ?'), 'contact');
  assert.equal(isDisallowed('Quelle est ton adresse personnelle ?'), 'private');
  assert.equal(detectIntent('Comment fabriquer une bombe'), 'offtopic');
});

test('fallback ancré sur les faits (projets, PyCon, blogs)', () => {
  const projects = fallbackAnswer('Quels sont tes projets ?', facts, 'fr');
  assert.match(projects, /PICON/);
  assert.match(projects, /photopicon/);

  const pycon = fallbackAnswer('Parle-moi de ton expérience PyCon', facts, 'fr');
  assert.match(pycon, /PyCon Togo/);
  assert.match(pycon, /speakers/i);

  const blogs = fallbackAnswer('Derniers blogs ?', facts, 'fr');
  assert.match(blogs, /Santé mentale/);
  assert.match(blogs, /\/blog\/sante-mentale/);

  const refuse = fallbackAnswer('Quelle est ton adresse personnelle ?', facts, 'fr');
  assert.match(refuse, /vie privée|publi/i);
});

test('retrieval privilégie le chunk PyCon', () => {
  const { selectedTitles, contextText } = selectContext('expérience PyCon speakers', facts);
  assert.ok(selectedTitles.some((title) => /pycon/i.test(title)));
  assert.match(contextText, /frontière/);
});

test('normalise les messages useChat et {content}', () => {
  const fromContent = normalizeMessages([{ role: 'user', content: 'Quels sont tes projets ?' }]);
  assert.ok(fromContent);
  assert.equal(lastUserText(fromContent!), 'Quels sont tes projets ?');

  const fromParts = normalizeMessages([
    { role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
  ]);
  assert.equal(lastUserText(fromParts!), 'Hello');
  assert.equal(normalizeMessages([]), null);
});

test('rate limit bloque après trop de requêtes', () => {
  const ip = `test-${Date.now()}`;
  let blocked = false;
  for (let i = 0; i < 20; i += 1) {
    const result = consumeRateLimit(ip);
    if (!result.ok) {
      blocked = true;
      break;
    }
  }
  assert.equal(blocked, true);
});

test('connaissances ancrées Grosbit, formations, Flutter, LinkedIn, communauté', async () => {
  const { snapshotFacts, selectContext } = await import('../lib/chat/retrieve.ts');
  const grounded = snapshotFacts();

  assert.match(grounded.profile.linkedin_url || '', /linkedin\.com\/in\/chaminadeadjolou/);
  assert.ok(grounded.experiences.some((e) => /grosbit/i.test(e.company)));
  assert.ok(grounded.experiences.some((e) => /picon studio/i.test(e.company)));
  assert.ok(grounded.projects.some((p) => /ezoato/i.test(p.title)));
  assert.ok(grounded.education.some((e) => /Lomé Business School/i.test(e)));
  assert.ok(grounded.education.some((e) => /DEFITECH/i.test(e)));
  assert.ok(grounded.communities.some((c) => /cursor togo|pycon|gdg/i.test(c.name)));

  const grosbit = fallbackAnswer('Tu travailles chez Grosbit ?', grounded, 'fr');
  assert.match(grosbit, /GROSBIT/i);
  assert.match(grosbit, /2026/);
  assert.match(grosbit, /Flutter|Next\.js/i);

  const edu = fallbackAnswer('Quelles sont tes formations ?', grounded, 'fr');
  assert.match(edu, /Lomé Business School/i);
  assert.match(edu, /DEFITECH/i);

  const flutter = fallbackAnswer('Est-ce que tu maîtrises Flutter ?', grounded, 'fr');
  assert.match(flutter, /Flutter/i);
  assert.match(flutter, /Dart/i);

  const linkedin = fallbackAnswer('Quel est ton LinkedIn ?', grounded, 'fr');
  assert.match(linkedin, /linkedin\.com\/in\/chaminadeadjolou/i);

  const community = fallbackAnswer('Parle-moi de tes communautés PyCon et YAS', grounded, 'fr');
  assert.match(community, /PyCon Togo|speakers/i);
  assert.match(community, /YAS/i);

  const piconStudio = fallbackAnswer("C'est quoi Picon Studio ?", grounded, 'fr');
  assert.match(piconStudio, /Picon Studio/i);
  assert.match(piconStudio, /2025|2026/);

  const perso = fallbackAnswer('Tu as des projets comme TogoSaaS ou Ezoato ?', grounded, 'fr');
  assert.match(perso, /TogoSaaS/i);
  assert.match(perso, /Ezoato/i);

  const ctx = selectContext('formations Defitech Lomé Business School', grounded);
  assert.match(ctx.contextText, /DEFITECH|Lomé Business School/i);
  assert.match(ctx.contextText, /linkedin\.com\/in\/chaminadeadjolou/i);
});

test('POST /chat sans clé LLM renvoie un flux fallback', async () => {
  delete process.env.GROQ_API_KEY;
  delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const response = await handleChatRequest(
    new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Quels sont tes projets ?' }],
      }),
    })
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-chat-mode'), 'fallback');
  const body = await response.text();
  assert.match(body, /PICON|projet/i);
});
