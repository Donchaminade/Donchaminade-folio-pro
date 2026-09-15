<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Les assistants de code ne sont plus un onglet à côté de l’IDE : ce sont des <strong>agents</strong> qui lisent le dépôt, ouvrent une pull request et proposent un plan. En 2026, la question n’est plus « faut-il utiliser l’IA ? » mais <strong>comment la brancher sur un vrai produit sans perdre le contrôle</strong>. Cet article pose un cadre concret — pour une équipe web en Afrique de l’Ouest autant que pour un studio solo.</p>
HTML;

$content .= blog_split(
    '<h2>Ce qui a réellement changé</h2>
<p>Trois bascules se sont imposées en même temps :</p>
<ul>
<li><strong>Le contexte fichier</strong> — l’agent voit le dépôt, pas seulement le prompt.</li>
<li><strong>Les outils (MCP et équivalents)</strong> — il peut lire une API, une base, un ticket, au lieu d’inventer.</li>
<li><strong>Le cycle PR</strong> — le livrable n’est plus un paragraphe, c’est un diff à relire.</li>
</ul>
<p>Résultat : la productivité explose <em>si</em> quelqu’un valide. Sinon, on accumule des patches plausibles et faux — le même piège qu’un stagiaire trop confiant, en plus rapide.</p>',
    'photo-1518770660439-4636190af475',
    'Circuit imprimé — la matière première des systèmes que l’IA prétend maintenant piloter'
);

$content .= blog_callout('🧭', '<p><strong>Règle d’or :</strong> un agent n’a pas le droit de publier. Il prépare. Un humain relit, prévisualise, puis décide. C’est le même principe qu’un brouillon de blog : visible en interne, invisible tant que vous n’avez pas validé.</p>');

$content .= <<<'HTML'
<h2>Un pipeline sain : brouillon, aperçu, publication</h2>
<p>Que ce soit un article, une feature ou un déploiement Hostinger, le schéma tient en trois étapes.</p>
<h3>1. Brouillon</h3>
<p>L’agent (ou le rédacteur) produit une version complète : titre, extrait, contenu long, images, stack. Rien n’atteint le site public. Le statut reste <code>draft</code>.</p>
<h3>2. Aperçu</h3>
<p>Un lien signé permet de relire <em>exactement</em> le rendu final — typographie, images, mobile. Pas une capture d’admin : la vraie page.</p>
<h3>3. Validation humaine</h3>
<p>Vous cliquez « Publier » seulement après relecture. À ce moment-là, on prépare les textes Facebook et X (lien + accroche). Poster sur les réseaux peut attendre les connecteurs ; le kit de partage, lui, est déjà prêt.</p>
HTML;

$content .= blog_figure(
    'photo-1451187580459-43490279c0fa',
    'Vue satellite de la Terre la nuit — réseaux, villes, connexions',
    'L’IA scale le brouillon. La publication reste un acte éditorial.'
);

$content .= blog_split(
    '<h2>Ce que ça change pour une équipe produit</h2>
<p>Dans un studio à Lomé ou Cotonou, on n’a pas toujours un rédacteur dédié ni un DevRel. Un pipeline d’agents bien cadré permet de :</p>
<ol>
<li>Suivre une actualité tech (nouveau runtime, faille, changement d’API) le jour même</li>
<li>Rédiger un article long, sourcé, dans le ton du site — pas un communiqué générique</li>
<li>Garder la voix de la marque : français professionnel, exemples locaux, zéro URL inventée</li>
<li>Ne jamais « pousser en prod » un texte non relu</li>
</ol>
<p>Le goulot d’étranglement n’est plus « écrire ». C’est <strong>décider</strong>.</p>',
    'photo-1522071820081-009f0129c71c',
    'Équipe autour d’un écran — la revue reste humaine',
    true
);

$content .= <<<'HTML'
<h2>Risques à nommer clairement</h2>
<ul>
<li><strong>Hallucinations factuelles</strong> — dates, versions, URLs live. Si ce n’est pas vérifié, on omet ou on marque « en cours ».</li>
<li><strong>Fuite de secrets</strong> — un agent qui commit un <code>.env</code> n’est pas « efficace », il est dangereux.</li>
<li><strong>Uniformisation du style</strong> — sans brief (catégories, rythme, callouts), tous les blogs se ressemblent.</li>
<li><strong>Publication accidentelle</strong> — une case « publier » cochée par défaut suffit à brûler un brouillon.</li>
</ul>
<blockquote>« L’agent accélère le premier jet. La confiance, elle, se gagne à la relecture. »</blockquote>
HTML;

$content .= blog_callout('⚙️', '<p>Sur ce portfolio, le flux est volontairement strict : <strong>Enregistrer</strong> ne met jamais en ligne. <strong>Prévisualiser</strong> ouvre le rendu public. <strong>Valider et publier</strong> est une action séparée, après laquelle les textes Facebook et X sont générés.</p>');

$content .= <<<'HTML'
<h2>Comment démarrer sans se noyer</h2>
<ol>
<li>Choisissez <em>un</em> thème (ici : Tech &amp; Dev) et tenez-vous-y pour trois articles.</li>
<li>Fixez une structure : chapô, deux ou trois H2, un encadré, une image de couverture.</li>
<li>Interdisez la publication automatique dans les consignes de l’agent.</li>
<li>Relisez sur téléphone avant de valider.</li>
<li>Le jour J, copiez le kit de partage — ou branchez plus tard un connecteur Facebook / X.</li>
</ol>
<p>Ce n’est pas de la science-fiction. C’est un rituel éditorial, assisté par des machines, tenu par une personne qui assume la voix du site.</p>
HTML;

return [
    'slug' => 'agents-ia-brouillon-avant-publication',
    'title' => 'Agents IA en 2026 : écrire plus vite, publier seulement après validation',
    'excerpt' => 'Les agents lisent le dépôt et préparent des PR. La publication, elle, reste humaine. Comment cadrer un pipeline éditorial (brouillon, aperçu, validation) pour un site produit — sans URL inventée ni mise en ligne accidentelle.',
    'category' => 'tech',
    'cover_image' => blog_unsplash('photo-1677442136019-21780ecad995', 1400),
    'reading_time' => 8,
    'content' => $content,
];
