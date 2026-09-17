import type { ChatIntent, ChatLang } from './types';

const EN_HINT =
  /\b(what|who|your|you|are|is|the|latest|tell|about|please|hello|hi|thanks|speaker|volunteer|which)\b/gi;
const FR_HINT =
  /\b(quel|quels|quelles|tes|ton|ta|vos|votre|mes|parle|derniers?|bonjour|salut|merci|bénévol|compétences?|expérience)\b/gi;

export function detectLang(text: string): ChatLang {
  const sample = text.trim();
  if (!sample) return 'fr';
  const en = sample.match(EN_HINT)?.length ?? 0;
  const fr = sample.match(FR_HINT)?.length ?? 0;
  if (en > fr) return 'en';
  return 'fr';
}

const HARM =
  /\b(bombe|explosif|arme|weapon|malware|ransomware|keylogger|carding|doxx|suicide assist|comment tuer|how to kill|child porn|csam)\b/i;

const PRIVATE =
  /\b(salaire exact|combien tu gagnes|adresse personnelle|où tu habites|petite amie|copine|numéro de carte|mot de passe admin|vie privée|exact salary|home address|girlfriend|admin password)\b/i;

export function isDisallowed(text: string): 'harm' | 'private' | null {
  if (HARM.test(text)) return 'harm';
  if (PRIVATE.test(text)) return 'private';
  return null;
}

export function detectIntent(text: string): ChatIntent {
  const q = text.toLowerCase();
  if (isDisallowed(text)) return 'offtopic';

  if (/\b(pycon|speakers?|intervenants?|logistique speakers?)\b/i.test(q)) return 'pycon';
  if (/\b(yas|next gen|hackathon|coach(?:ing)?)\b/i.test(q)) return 'yas';
  if (/\b(grosbit|gros bit|cisco|photopicon|photo picon)\b/i.test(q)) return 'grosbit';
  if (/\b(flutter|dart)\b/i.test(q)) return 'flutter';
  if (
    /\b(formations?|diplômes?|éducation|education|lbs|defitech|défitech|licence|bts|école|ecole|lomé business)\b/i.test(
      q
    )
  ) {
    return 'education';
  }
  if (/\b(blogs?|articles?|écrits?|posts?)\b/i.test(q)) return 'blogs';
  if (/\b(projets?|réalisations?|portfolio apps?|github|ezoato|togosaas|akontaa|meneur)\b/i.test(q)) {
    return 'projects';
  }
  if (/\b(témoignages?|testimonials?|recommandations?|avis)\b/i.test(q)) return 'testimonials';
  if (/\b(compétences?|skills?|stack|techno)\b/i.test(q)) return 'skills';
  if (/\b(contact|email|mail|whatsapp|téléphone|phone|linkedin|cv|réserv)\b/i.test(q)) {
    return 'contact';
  }
  if (
    /\b(communautés?|communities|gdg|wtm|python togo|bénévolat|cursor togo|ethafrique|hyver|mlh)\b/i.test(
      q
    )
  ) {
    return 'community';
  }
  if (/\b(prix|awards?|distinctions?|hackathon mlh|récompens)\b/i.test(q)) return 'awards';
  if (
    /\b(expérience|experiences?|parcours|carrière|job|poste|travail|picon studio|axone|efficorpe)\b/i.test(
      q
    )
  ) {
    return 'experience';
  }
  if (/\b(qui es[- ]tu|who are you|à propos|about you|bio|présentation|profil)\b/i.test(q)) {
    return 'about';
  }

  const portfolioish =
    /\b(donchaminade|chaminade|adjolou|togo|flutter|react|php|lomé|lomé|développeur|developer)\b/i.test(
      q
    );
  if (!portfolioish && q.split(/\s+/).length > 8) return 'offtopic';
  return portfolioish ? 'generic' : 'generic';
}
