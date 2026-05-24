<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead"><strong>Quill</strong> est l’éditeur visuel intégré à l’administration de ce blog. Si vous avez déjà passé des heures à corriger des balises <code>&lt;p&gt;</code> mal fermées ou à chercher pourquoi une image ne s’affiche pas, cet article est fait pour vous. Nous allons voir <em>pourquoi</em> adopter un éditeur WYSIWYG, <em>comment</em> le prendre en main pas à pas, et <em>quoi</em> publier pour que vos lecteurs restent jusqu’au dernier paragraphe.</p>
HTML;

$content .= blog_split(
    '<h2>Pourquoi ne plus écrire le HTML à la main ?</h2>
<p>Le HTML est formidable pour structurer le web — mais peu adapté à la <strong>rédaction créative</strong>. Chaque interruption (« je dois fermer cette balise », « cette image est trop large ») casse le flux d’écriture. Les études sur la charge cognitive montrent qu’un changement de contexte peut coûter plusieurs minutes avant de retrouver le fil de ses idées.</p>
<p>Quill, développé par une équipe qui visait la simplicité, produit du HTML <em>propre</em> tout en vous laissant l’illusion d’un traitement de texte : gras, italique, titres, listes, liens, images, citations et blocs de code.</p>',
    'photo-1455390582261-644cdee1ba85',
    'Plume et carnet — métaphore de l’écriture'
);

$content .= blog_callout('💡', '<p><strong>À retenir :</strong> l’objectif n’est pas de « ne plus jamais voir de HTML », mais de ne le toucher que lorsque vous en avez besoin (intégration avancée, correctifs ponctuels).</p>');

$content .= <<<'HTML'
<h2>Qu’est-ce que Quill, concrètement ?</h2>
<p>Quill est une bibliothèque JavaScript open source. Elle représente le contenu sous forme de <strong>Delta</strong> (un format JSON décrivant les insertions et suppressions de texte) et peut exporter en HTML pour stockage en base de données — exactement ce que fait l’admin Donchaminade.</p>
<h3>Les modules que vous utilisez déjà</h3>
<ul>
<li><strong>Toolbar</strong> — barre d’outils personnalisable (titres, formatage, listes, alignement)</li>
<li><strong>Clipboard</strong> — collage depuis Word ou Google Docs avec nettoyage automatique</li>
<li><strong>Image</strong> — téléversement vers le serveur via l’API sécurisée</li>
<li><strong>Syntax</strong> — coloration des blocs de code (selon configuration)</li>
</ul>
HTML;

$content .= blog_split(
    '<h3>Où le trouver dans l’admin ?</h3>
<p>Connectez-vous à l’espace d’administration, menu <strong>Blog</strong>, puis <strong>Nouvel article</strong> ou modification d’un article existant. Le champ « Contenu de l’article » occupe la majeure partie de l’écran : zone de rédaction sombre, barre d’outils en haut, compteur de caractères en bas.</p>
<p>Les champs autour de l’éditeur — titre, extrait, catégorie, image de couverture, temps de lecture — forment la <strong>couche éditoriale</strong> qui apparaît sur la liste du blog et en en-tête d’article. Ne les négligez pas : un bon texte mal présenté est souvent ignoré.</p>',
    'photo-1486312338219-ce68d2c6f44d',
    'Rédaction sur ordinateur portable',
    true
);

$content .= blog_figure('photo-1531482615713-2afd69097998', 'Équipe collaborant autour d’un écran', 'Un éditeur partagé évite que chaque rédacteur invente sa propre syntaxe HTML.');

$content .= <<<'HTML'
<h2>Guide pas à pas : votre premier article en 20 minutes</h2>
<h3>Étape 1 — Le titre et l’extrait</h3>
<p>Le <strong>titre</strong> doit promettre un bénéfice clair : « Comment… », « Pourquoi… », « Guide complet… ». L’<strong>extrait</strong> (2 à 3 phrases) s’affiche sur la carte article et dans l’encadré d’introduction sur la page de lecture. Rédigez-le <em>après</em> le corps si vous bloquez : il résume ce que le lecteur va réellement apprendre.</p>
<h3>Étape 2 — Structurer avec H2 et H3</h3>
<p>Dans le menu déroulant de la barre Quill, choisissez <strong>Titre 2</strong> pour les grandes parties (chapitres) et <strong>Titre 3</strong> pour les sous-parties. Sur le site public, ces titres alimentent le <strong>sommaire automatique</strong> à droite (sur grand écran) : plus vous structurez, plus la navigation est fluide pour les articles longs comme celui-ci.</p>
HTML;

$content .= blog_split(
    '<h3>Étape 3 — Insérer une image dans le corps</h3>
<ol>
<li>Placez le curseur à l’endroit souhaité.</li>
<li>Cliquez sur l’icône <strong>image</strong> dans la barre d’outils.</li>
<li>Sélectionnez un fichier JPEG, PNG ou WebP (taille raisonnable, idéalement &lt; 1 Mo).</li>
<li>Attendez la fin du téléversement : l’URL est enregistrée sous <code>/uploads/blog/…</code>.</li>
</ol>
<p>L’image s’affiche dans l’éditeur et, une fois publié, sur le site avec coins arrondis et ombre légère. Si elle ne s’affiche pas, vérifiez que le chemin commence bien par <code>/uploads/</code> et non par un chemin Windows local.</p>',
    'photo-1516321318423-f06f85e504b3',
    'Insertion de média depuis l’interface'
);

$content .= <<<'HTML'
<h3>Étape 4 — Citations et blocs de code</h3>
<p>Les <strong>citations</strong> servent à mettre en avant une phrase forte, une définition ou un témoignage. Les <strong>blocs de code</strong> sont indispensables pour les tutoriels techniques : utilisez-les pour les commandes, extraits JSON, requêtes SQL ou fetch JavaScript.</p>
HTML;

$content .= blog_callout('⌨️', '<p>Exemple de code publié tel quel sur le blog :</p>
<pre><code>// Récupérer un article via l\'API publique
const slug = "quill-editeur-visuel-blog";
const res = await fetch(`/api/blog.php?action=post&slug=${slug}`);
if (!res.ok) throw new Error("Article introuvable");
const { data } = await res.json();
document.title = data.title;</code></pre>');

$content .= blog_split(
    '<h2>Barre d’outils : chaque bouton expliqué</h2>
<table class="blog-table">
<thead><tr><th>Outil</th><th>Usage recommandé</th></tr></thead>
<tbody>
<tr><td><strong>Gras / Italique / Souligné</strong></td><td>Insister sur un mot-clé, pas sur des paragraphes entiers</td></tr>
<tr><td><strong>Listes</strong></td><td>Étapes, inventaires, checklists</td></tr>
<tr><td><strong>Alignement</strong></td><td>Centrer une citation courte ou une signature</td></tr>
<tr><td><strong>Lien</strong></td><td>Ressources externes, documentation officielle Quill</td></tr>
<tr><td><strong>Image</strong></td><td>Illustrations, schémas, captures d’écran</td></tr>
<tr><td><strong>Code</strong></td><td>Extraits techniques courts ou longs</td></tr>
</tbody>
</table>',
    'photo-1498050108023-c5249f4df085',
    'Environnement de développement et rédaction technique',
    true
);

$content .= blog_divider();

$content .= <<<'HTML'
<h2>Bonnes pratiques pour des articles « magazine »</h2>
<h3>Rythme et longueur</h3>
<p>Un article de fond dépasse souvent <strong>1 500 mots</strong>. Ce n’est pas une obligation SEO — c’est une promesse au lecteur qui cherche de la profondeur. Alternez : paragraphe explicatif → liste ou tableau → image ou mise en page côte à côte → citation → nouveau chapitre.</p>
<h3>Images : couverture vs corps</h3>
<p>La <strong>couverture</strong> (champ dédié dans l’admin) s’affiche en bandeau hero en haut de l’article. Les images <strong>dans le corps</strong> illustrent un point précis. Utilisez des visuels libres de droits (Unsplash, vos propres photos) et renseignez toujours l’attribut <code>alt</code> pour l’accessibilité.</p>
<blockquote>« Un article sans image est une conférence sans diapositive : le message peut être excellent, mais la fatigue visuelle arrive deux fois plus vite. »</blockquote>
HTML;

$content .= blog_split(
    '<h3>Catégories et thèmes personnalisés</h3>
<p>Choisissez une catégorie existante (Tech, Motivation, Spiritualité…) pour le filtrage sur <code>/blog</code>. L’option <strong>Autre</strong> permet de créer un libellé personnalisé : il est enregistré automatiquement pour les prochains articles. Pensez à la cohérence : trop de micro-catégories diluent l’expérience de navigation.</p>
<p>Le temps de lecture est calculé ou saisi manuellement : visez la sincérité. Un texte dense à 2 500 mots correspond environ à <strong>12–15 minutes</strong> de lecture active.</p>',
    'photo-1542744173-8e7e53415bb0',
    'Réunion éditoriale et planification de contenu'
);

$content .= <<<'HTML'
<h2>Ce qui se passe quand vous cliquez sur Enregistrer</h2>
<p>Quill sérialise le contenu en HTML et l’envoie au serveur PHP. Le contrôleur valide les champs, enregistre en base MySQL dans la colonne <code>content</code> (LONGTEXT), met à jour le slug si besoin, et gère la date de publication.</p>
<ul>
<li><strong>Images intégrées</strong> : fichiers sur disque dans <code>public/uploads/blog/</code>, chemin relatif en BDD.</li>
<li><strong>Couverture</strong> : même mécanisme, souvent image plus large (16:9).</li>
<li><strong>Sécurité</strong> : jeton CSRF, types MIME vérifiés, taille maximale configurée.</li>
</ul>
<p>Le front React récupère le HTML via l’API et l’injecte dans un composant <code>BlogContent</code> qui normalise les URLs des images locales et laisse passer les URLs externes (CDN) sans les casser.</p>
<h3>Relire avant publication</h3>
<ol>
<li>Prévisualisez sur mobile (défilement continu, barre de progression).</li>
<li>Vérifiez le sommaire : tous les H2/H3 sont-ils pertinents ?</li>
<li>Testez un lien et une image.</li>
<li>Publiez — ou programmez si cette option est activée.</li>
</ol>
HTML;

$content .= blog_figure('photo-1432888498266-38ffec3eaf0a', 'Pause et perspective après publication', 'Prenez le temps de partager votre article : engagement et commentaires modérés enrichissent la suite.');

$content .= blog_callout('✅', '<p><strong>Checklist publication :</strong> titre accrocheur · extrait rédigé · couverture 16:9 · au moins 3 H2 · 2 images minimum · catégorie choisie · relecture orthographe · temps de lecture cohérent.</p>');

$content .= blog_split(
    '<h2>Accessibilité et SEO éditorial</h2>
<p>Les lecteurs d’écran parcourent vos titres comme une table des matières : respectez la hiérarchie H2 puis H3, sans sauter de niveau. Chaque image doit avoir un <strong>texte alternatif</strong> descriptif (« graphique de croissance des vues en 2025 » plutôt que « image1 »).</p>
<p>Pour le référencement, le titre de la page est porté par le champ titre admin ; le contenu doit répondre à l’intention de recherche avec des mots-clés naturels, pas du bourrage. Les liens internes vers vos autres articles prolongent le temps passé sur le site — ajoutez-en un ou deux en conclusion lorsque c’est pertinent.</p>
<p>Les articles longs (plus de 2 000 mots) sont favorisés par les lecteurs humains ; les moteurs suivent surtout la satisfaction : temps de lecture, partages, commentaires. Proposez donc de la profondeur, pas du remplissage.</p>',
    'photo-1504868584819-f8e8b4b99a5f',
    'Analytics et suivi de lecture sur écran',
    true
);

$content .= <<<'HTML'
<h2>Scénario complet : de l’idée à la publication</h2>
<p><strong>Jour 1 —</strong> Notez trois idées d’accroche et un plan en cinq H2. <strong>Jour 2 —</strong> Rédigez le corps sans vous soucier des images. <strong>Jour 3 —</strong> Ajoutez visuels, code et citations ; rédigez l’extrait. <strong>Jour 4 —</strong> Relecture à voix haute, correction, publication. Ce rythme évite la page blanche et la fatigue décisionnelle du « tout en une session ».</p>
<h2>Erreurs fréquentes et comment les éviter</h2>
<ul>
<li><strong>Coller depuis Word avec mise en forme excessive</strong> — utilisez « coller sans formatage » ou nettoyez les styles inline.</li>
<li><strong>Titres H1 dans le corps</strong> — le H1 est le titre de l’article ; restez en H2/H3 dans Quill.</li>
<li><strong>Images géantes non compressées</strong> — ralentissent le chargement ; compressez avant upload.</li>
<li><strong>Paragraphes de 15 lignes</strong> — aérez : la lecture sur écran exige des respirations visuelles.</li>
</ul>
<h2>Aller plus loin</h2>
<p>Documentation officielle : <a href="https://quilljs.com/docs/" target="_blank" rel="noopener">quilljs.com/docs</a>. Pour personnaliser la barre d’outils côté admin, le fichier <code>admin/includes/editor.php</code> centralise la configuration. Vous pouvez y ajouter des formats supplémentaires (couleurs, polices) tant que le rendu public reste lisible.</p>
<h2>Conclusion</h2>
<p>Quill n’est pas un gadget de plus dans votre stack : c’est le pont entre l’idée et l’article publié. La prochaine fois que vous repoussez un billet parce que « le HTML fait peur », ouvrez l’admin, choisissez un titre, structurez en H2 — et laissez l’éditeur porter la mise en forme pendant que vous portez le message.</p>
HTML;

return [
    'slug' => 'quill-editeur-visuel-blog',
    'title' => 'Quill : rédiger un blog professionnel sans écrire de HTML',
    'excerpt' => 'Guide complet pour maîtriser l’éditeur Quill de l’admin : structure, images, code, bonnes pratiques et checklist de publication pour des articles longs et impeccables.',
    'category' => 'tech',
    'cover_image' => blog_unsplash('photo-1455390582261-644cdee1ba85', 1600),
    'reading_time' => 35,
    'content' => $content,
];
