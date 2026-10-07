import phrases from '../database/en-phrases.json';

const PHRASES: Record<string, string> = phrases;

function norm(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bjanvier\b/gi, 'January'],
  [/\bf[ée]vrier\b/gi, 'February'],
  [/\bmars\b/gi, 'March'],
  [/\bavril\b/gi, 'April'],
  [/\bmai\b/gi, 'May'],
  [/\bjuin\b/gi, 'June'],
  [/\bjuillet\b/gi, 'July'],
  [/\bao[ûu]t\b/gi, 'August'],
  [/\bseptembre\b/gi, 'September'],
  [/\boctobre\b/gi, 'October'],
  [/\bnovembre\b/gi, 'November'],
  [/\bd[ée]cembre\b/gi, 'December'],
  [/\bjanv\./gi, 'Jan'],
  [/\bf[ée]vr\./gi, 'Feb'],
  [/\bavr\./gi, 'Apr'],
  [/\bjuil\./gi, 'Jul'],
  [/\bsept\./gi, 'Sep'],
  [/\boct\./gi, 'Oct'],
  [/\bnov\./gi, 'Nov'],
  [/\bd[ée]c\./gi, 'Dec'],
  [/\bpr[ée]sent\b/gi, 'Present'],
  [/\bdepuis\b/gi, 'Since'],
  [/\bsaisonnier\b/gi, 'seasonal'],
  [/\bb[ée]n[ée]volat\b/gi, 'Volunteering'],
  [/\bstage\b/gi, 'Internship'],
  [/\bdigitalisation\b/gi, 'Digitization'],
  [/\bintelligence artificielle\b/gi, 'Artificial intelligence'],
  [/\bmarketing digital\b/gi, 'Digital marketing'],
  [/\bcr[ée]ation visuelle\b/gi, 'Visual design'],
  [/\bcommunaut[ée] tech\b/gi, 'Tech community'],
  [/\bans\b/gi, 'years'],
  [/\blicence professionnelle\b/gi, "professional bachelor's degree"],
  [/\bambassadeur\b/gi, 'Ambassador'],
  [/\bco-?organisateur\b/gi, 'co-organizer'],
  [/\borganisateur\b/gi, 'organizer'],
  [/\blogistique\b/gi, 'logistics'],
  [/\binformatique de gestion\b/gi, 'business computing'],
  [/\b1er\s+prix\b/gi, '1st prize'],
  [/\b2e\s+prix\b/gi, '2nd prize'],
  [/\bcoup de c(?:oe|œ)eur\b/gi, 'favourite'],
  [/\bprojets impactants\b/gi, 'impact projects'],
  [/\bprojet\b/gi, 'project'],
];

export function looksFrench(value: string): boolean {
  if (/[àâäéèêëïîôùûüçœ]/i.test(value)) return true;
  return /\b(je|j'ai|j’ai|nous|vous|pour|dans|avec|une|des|est|sont|qui|pas|cette|cet|développ|conçu|conçue|application|plateforme|gestion|publiée|publié|écrans|témoignage|bénévol|développeur|disponible|parcours|réalisations|expérience|ambassadeur|organisateur|licence|professionnelle|logistique)\b/i.test(
    value
  ) || /\b(produit|digitale|communication|apprentissage|ambition|engagement|excellence|orientation|claire|constante|lors|coup|coeur|prix|du|et|projets|impactants)\b/i.test(value);
}

function rewriteBits(value: string): string {
  let next = value;
  for (const [pattern, replacement] of REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }
  return next.replace(/\s{2,}/g, ' ').trim();
}

/** English copy for a French source. Never returns the French sentence. */
export function enText(french: string | undefined | null, english?: string | null): string {
  const provided = (english || '').trim();
  if (provided) return rewriteBits(provided);
  const source = norm(french || '');
  if (!source) return '';
  const mapped = PHRASES[source];
  if (mapped) return mapped;
  const rewritten = rewriteBits(source);
  if (!looksFrench(rewritten)) return rewritten;
  return '';
}

export function enList(items: string[] | undefined, english?: string[] | null): string[] {
  const en = english?.map((item) => item.trim()).filter(Boolean);
  if (en && en.length > 0) return en.map((item) => enText(item, item)).filter(Boolean);
  return (items || []).map((item) => enText(item)).filter(Boolean);
}
