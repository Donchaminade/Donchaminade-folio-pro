<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Ce portfolio et ce blog sont construits avec une architecture <strong>hybride</strong> : React + Vite pour l’expérience publique fluide, PHP 8 + MySQL pour les données et l’administration, Quill pour l’édition. Cet article long détaille les choix, le modèle de données, l’API, les médias, le SEO et les leçons tirées — pour que vous puissiez reproduire ou adapter cette stack sur votre prochain projet personnel.</p>
HTML;

$content .= blog_split(
    '<h2>Pourquoi séparer front et back ?</h2>
<p>Un blog monolithique PHP avec templates Twig ou Blade fonctionne très bien — et reste plus simple à déployer. Mais lorsque vous voulez une lecture <strong>type application</strong> (animations, barre de progression, sommaire dynamique, engagement temps réel), React apporte une UX difficile à égaler en templates serveur classiques.</p>
<ul>
<li><strong>Front</strong> — React, Vite, Tailwind, Framer Motion</li>
<li><strong>Back</strong> — PHP, API REST légère, repositories</li>
<li><strong>Admin</strong> — PHP custom, Quill, uploads, modération</li>
</ul>',
    'photo-1461743492567-9cc38ecc22aa',
    'Écran de développement web',
    false
);

$content .= blog_figure('photo-1555066931-4365d14bab8c', 'Code à l’écran', 'La séparation des responsabilités commence par des dossiers clairs : api/, pages/, admin/, includes/.');

$content .= <<<'HTML'
<h2>Modèle de données blog</h2>
<p>Table centrale <code>blog_posts</code> : slug unique (URL), titre, excerpt, contenu HTML long, catégorie, image de couverture, compteurs (vues, likes, partages), temps de lecture, publication.</p>
<p>Tables satellites : commentaires imbriqués (threads), likes par visiteur (hash), partages par plateforme, libellés de catégories personnalisées.</p>
HTML;

$content .= blog_callout('🗄️', '<pre><code>CREATE TABLE blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  category VARCHAR(48) NOT NULL DEFAULT \'tech\',
  content LONGTEXT NOT NULL,
  cover_image VARCHAR(500),
  reading_time INT UNSIGNED DEFAULT 5,
  is_published TINYINT(1) DEFAULT 0,
  published_at DATETIME NULL,
  views_count INT UNSIGNED DEFAULT 0
);</code></pre>');

$content .= blog_split(
    '<h2>API : un point d’entrée, plusieurs actions</h2>
<p><code>api/blog.php</code> centralise :</p>
<ol>
<li><code>GET ?action=list</code> — liste paginée + métadonnées catégories</li>
<li><code>GET ?action=post&slug=…</code> — article complet + commentaires approuvés</li>
<li><code>POST</code> — like, partage, nouveau commentaire (modération)</li>
</ol>
<p>En développement, le proxy Vite redirige <code>/api</code> vers XAMPP pour éviter les problèmes CORS.</p>',
    'photo-1498050108023-c5249f4df085',
    'Environnement de développement full-stack',
    true
);

$content .= <<<'HTML'
<pre><code>// Côté React — chargement d'un article
const res = await fetch(
  `${API_BASE}/blog.php?action=post&slug=${encodeURIComponent(slug)}`
);
const json = await res.json();
if (!json.success) throw new Error(json.message);
setPost(json.data);</code></pre>
<h2>Expérience lecteur « Notion-like »</h2>
<ul>
<li>Une URL = un article en <strong>défilement continu</strong> (pas de pagination interne)</li>
<li>Barre de progression de lecture en haut</li>
<li>Sommaire automatique depuis les H2/H3</li>
<li>Catégories colorées (bleu officiel du site)</li>
<li>Engagement : likes, partages, fil de commentaires modéré</li>
</ul>
HTML;

$content .= blog_split(
    '<h2>Images : le piège classique</h2>
<p>Les fichiers vivent dans <code>public/uploads/blog/</code>. La base stocke <code>/uploads/blog/fichier.jpg</code>. Le front doit résoudre l’URL complète via <code>mediaUrl()</code> sans casser les liens externes (Unsplash).</p>
<p>Erreur fréquente : réécrire toutes les URLs https contenant le mot « uploads » — corrigé en ne transformant que les chemins locaux. Ajoutez <code>referrerpolicy="no-referrer"</code> sur les images CDN si elles ne s’affichent pas.</p>
<h3>Mise en page riche dans le contenu</h3>
<p>Les classes <code>blog-split</code>, <code>blog-figure</code>, <code>blog-callout</code> permettent texte + image côte à côte dans le HTML stocké — comme dans les articles de démonstration seed.</p>',
    'photo-1531487895717-2fd7209f7b6b',
    'Collaboration autour d\'un produit web',
    false
);

$content .= blog_split(
    '<h2>Modération et confiance</h2>
<p>Les commentaires visiteurs passent par une file d’attente : seuls les messages approuvés apparaissent publiquement. Un journal d’audit trace les suppressions côté admin. Les notifications push (PWA) alertent lors d’un nouveau commentaire — utile pour réagir sans refresh obsessionnel.</p>
<p>Cette couche « humaine » protège votre réputation : un blog technique ouvert au public sans modération finit souvent par du spam ou des débats hors sujet épuisants.</p>',
    'photo-1552664730-d307ca884978',
    'Équipe en discussion sur un produit digital',
    true
);

$content .= blog_divider();

$content .= <<<'HTML'
<h2>Admin : éditeur Quill et workflow</h2>
<p>L’admin PHP gère CRUD, téléversement, prévisualisation implicite via sauvegarde. Quill produit le HTML ; vous n’éditez pas le code source sauf cas avancés. Notifications push (PWA) alertent l’admin des nouveaux commentaires en attente.</p>
<h2>Déploiement typique</h2>
<ul>
<li><strong>Front</strong> — <code>npm run build</code> → hébergement statique (Vercel, Netlify)</li>
<li><strong>API + admin</strong> — hébergement PHP avec HTTPS</li>
<li><strong>Variable</strong> <code>VITE_API_URL</code> pointant vers l’API en production</li>
<li><strong>Uploads</strong> — dossier writable, hors du build si possible</li>
</ul>
<h2>SEO et partage social</h2>
<p>Composant <code>BlogMeta</code> pour Open Graph ; route <code>blog/share.php</code> pour les crawlers ; images de couverture en URL absolue.</p>
<blockquote>Un blog n’est pas « juste du CRUD » : c’est produit éditorial + confiance (modération) + UX de lecture.</blockquote>
<h2>Leçons apprises</h2>
<ul>
<li>Ne pas sur-découper en microservices pour quelques articles par mois</li>
<li>Investir tôt dans l’éditeur et les uploads — friction = pas de contenu</li>
<li>Prévoir catégories flexibles et articles longs avec sommaire</li>
</ul>
<h2>Conclusion</h2>
<p>React + PHP est un duo pragmatique : modernité côté lecteur, simplicité et maîtrise côté serveur. Commencez par une API, une liste, un article bien mis en forme — puis itérez. Ce blog en est la preuve vivante.</p>
HTML;

return [
    'slug' => 'blog-react-php-architecture-moderne',
    'title' => 'Construire un blog moderne : React côté public, PHP côté données',
    'excerpt' => 'Architecture détaillée du blog Donchaminade : données MySQL, API PHP, React/Vite, Quill, images, déploiement et retours d’expérience pour un blog long format.',
    'category' => 'tech',
    'cover_image' => blog_unsplash('photo-1461743492567-9cc38ecc22aa', 1600),
    'reading_time' => 37,
    'content' => $content,
];
