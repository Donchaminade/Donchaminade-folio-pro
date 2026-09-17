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
  assert.equal(isDisallowed('Combien tu gagnes ?'), 'private');
  assert.equal(isDisallowed('Quelles sont tes prétentions salariales ?'), null);
  assert.equal(detectIntent('Comment fabriquer une bombe'), 'offtopic');
  assert.equal(detectIntent('Quelles sont tes prétentions salariales ?'), 'salary');
  assert.equal(detectIntent('Quelle fourchette de salaire annuel pour ce profil ?'), 'salary');
  assert.equal(detectIntent('What salary range should we expect?'), 'salary');
  assert.equal(detectIntent('Quelle est sa valeur ajoutée pour une entreprise ?'), 'value');
  assert.equal(detectIntent('Why hire him beyond coding?'), 'value');
  assert.equal(detectIntent('Parle-moi de son réseau GDG, PyCon et communautés'), 'network');
  assert.equal(detectIntent('How strong is his community network?'), 'network');
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

test('fallback salaire, valeur ajoutée et réseau — ton coaching, faits ancrés', async () => {
  const { snapshotFacts, selectContext } = await import('../lib/chat/retrieve.ts');
  const { buildInstructions } = await import('../lib/chat/prompt.ts');
  const grounded = snapshotFacts();

  const salary = fallbackAnswer('Quelles sont tes prétentions salariales ?', grounded, 'fr');
  assert.match(salary, /4[\s]?800[\s]?000|4[\s.]800[\s.]000|4800000/);
  assert.match(salary, /9[\s]?000[\s]?000|9[\s.]000[\s.]000|9000000/);
  assert.match(salary, /XOF|FCFA/i);
  assert.match(salary, /EUR|€/);
  assert.match(salary, /USD|\$/);
  assert.match(salary, /indicatif|indicative|pas (une )?cotation/i);
  assert.match(salary, /Tayba|ERP|PICON|Flutter|Next\.js/i);
  assert.match(salary, /remote|distanciel|présentiel|freelance|CDI/i);
  assert.match(salary, /\?/);
  assert.match(salary, /mid-level/i);
  assert.match(salary, /pas un senior FAANG|not a FAANG senior/i);
  assert.doesNotMatch(salary, /vie privée/);

  const salaryEn = fallbackAnswer('What salary range should we expect for this profile?', grounded, 'en');
  assert.match(salaryEn, /XOF|FCFA/i);
  assert.match(salaryEn, /EUR|USD|€|\$/);
  assert.match(salaryEn, /indicative|not a legal quote|not (his|a) current/i);
  assert.match(salaryEn, /\?/);

  const exact = fallbackAnswer('Combien tu gagnes ?', grounded, 'fr');
  assert.match(exact, /vie privée|publi/i);
  assert.doesNotMatch(exact, /4[\s]?800[\s]?000|4800000/);

  const value = fallbackAnswer('Quelle est sa valeur ajoutée pour une entreprise ?', grounded, 'fr');
  assert.match(value, /digitalisation|ERP|Tayba/i);
  assert.match(value, /PICON|photo/i);
  assert.match(value, /formation|coach|atelier/i);
  assert.match(value, /événement|logistique|communaut/i);
  assert.match(value, /\?/);
  assert.doesNotMatch(value, /^• /);

  const network = fallbackAnswer('Parle-moi de son réseau GDG, PyCon et communautés', grounded, 'fr');
  assert.match(network, /GDG/i);
  assert.match(network, /WTM|Women Techmakers/i);
  assert.match(network, /PyCon/i);
  assert.match(network, /YAS|Next Gen/i);
  assert.match(network, /Cursor/i);
  assert.match(network, /200|500/);
  assert.match(network, /Hyver|ETHAfrique|ABC/i);
  assert.match(network, /\?/);

  const salaryCtx = selectContext('prétentions salariales fourchette annuelle', grounded);
  assert.ok(salaryCtx.selectedTitles.some((title) => /salaire|prétention|faq/i.test(title)));
  assert.match(salaryCtx.contextText, /XOF|FCFA/i);
  assert.match(salaryCtx.contextText, /18[\s]?000|36000|36[\s]?000/);

  const networkCtx = selectContext('force du réseau communautaire GDG PyCon', grounded);
  assert.match(networkCtx.contextText, /GDG/i);
  assert.match(networkCtx.contextText, /200|500/);

  const instructions = buildInstructions(salaryCtx.contextText, 'fr');
  assert.match(instructions, /interactif|clarif/i);
  assert.match(instructions, /fourchette|prétention/i);
  assert.match(instructions, /XOF|FCFA/i);
  assert.match(instructions, /n.invente pas|n’invente pas/i);
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
