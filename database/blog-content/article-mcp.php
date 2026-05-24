<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Pendant des années, l’intelligence artificielle pour les développeurs a vécu dans un onglet de navigateur à côté de l’IDE. <strong>Cursor</strong> a changé la donne en intégrant l’IA dans l’éditeur. Les <strong>MCP (Model Context Protocol)</strong> vont encore plus loin : ils branchent l’assistant sur vos fichiers, bases de données, APIs et outils métier. Cet article explique le fonctionnement, les avantages réels, les risques — et comment démarrer sans vous noyer.</p>
HTML;

$content .= blog_split(
    '<h2>Le problème que MCP résout</h2>
<p>Sans contexte fiable, un modèle de langage <strong>invente</strong> des noms de fichiers, des signatures de fonctions ou des versions de dépendances. Vous perdez du temps à corriger des suggestions plausibles mais fausses. MCP formalise un contrat : le client (Cursor) demande à un serveur MCP d’exécuter une action ou de lire une ressource, et le modèle reçoit une réponse <em>vérifiable</em>.</p>
<p>C’est la différence entre « devine mon architecture » et « lis le fichier <code>api/blog.php</code> puis propose un patch ».</p>',
    'photo-1517694712207-0088dd9f477c',
    'Développeur concentré dans son environnement de travail'
);

$content .= blog_callout('🔌', '<p><strong>Définition courte :</strong> MCP = protocole ouvert pour connecter des assistants IA à des sources de données et des outils externes de manière standardisée.</p>');

$content .= <<<'HTML'
<h2>Architecture en trois couches</h2>
<h3>1. Le client</h3>
<p>Cursor, ou tout IDE compatible, joue le rôle de client MCP. Il affiche les outils disponibles, demande votre accord avant une action sensible, et injecte les résultats dans le contexte de la conversation.</p>
<h3>2. Le serveur MCP</h3>
<p>Petit programme (souvent Node.js ou Python) qui traduit les requêtes du protocole vers une API concrète : système de fichiers, GitHub, PostgreSQL, Linear, Slack, etc.</p>
<h3>3. Les outils et ressources</h3>
<ul>
<li><strong>Tools</strong> — actions : créer un fichier, exécuter une requête, ouvrir une issue</li>
<li><strong>Resources</strong> — lectures : documentation, schéma SQL, logs filtrés</li>
</ul>
HTML;

$content .= blog_figure('photo-1555066931-4365d14bab8c', 'Écran de code — le terrain de jeu du développeur augmenté', 'L’IA ne remplace pas l’IDE : elle l’enrichit lorsque le contexte est branché correctement.');

$content .= blog_split(
    '<h2>Avantages concrets pour un développeur web</h2>
<h3>Moins d’hallucinations</h3>
<p>Sur un projet PHP + React comme ce portfolio, l’assistant peut suivre le flux réel : <code>api/blog.php</code> → <code>BlogRepository</code> → <code>pages/BlogPostPage.tsx</code>. Il cite ce qui existe au lieu d’inventer un dossier <code>src/blog/</code> fantôme.</p>
<h3>Automatisation maîtrisée</h3>
<p>Exemples de tâches déléguées avec validation humaine :</p>
<ol>
<li>Générer une migration SQL cohérente avec le schéma existant</li>
<li>Rédiger des tests d’intégration pour un endpoint documenté</li>
<li>Résumer les fichiers modifiés d’une branche Git</li>
<li>Vérifier les variables d’environnement requises par <code>install.php</code></li>
</ol>',
    'photo-1498050108023-c5249f4df085',
    'Poste de travail avec plusieurs fenêtres de code',
    true
);

$content .= <<<'HTML'
<h3>Contexte persistant</h3>
<p>Vous n’avez plus à répéter à chaque session : « on utilise Tailwind », « l’API est sous <code>/api</code> », « les uploads sont dans <code>public/uploads</code> ». Les serveurs MCP et les règles du projet portent cette mémoire.</p>
<blockquote>« MCP, c’est un peu les prises USB-C de l’IA : un format, plusieurs périphériques — à condition de savoir ce que vous branchez. »</blockquote>
HTML;

$content .= blog_callout('⚙️', '<p>Exemple de configuration conceptuelle (fichier MCP Cursor) :</p>
<pre><code>{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/chemin/du/projet"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}" }
    }
  }
}</code></pre>
<p><em>Ne commitez jamais de tokens en clair. Utilisez des variables d’environnement ou les entrées sécurisées de Cursor.</em></p>');

$content .= blog_split(
    '<h2>MCP vs autres approches</h2>
<ul>
<li><strong>Copier-coller manuel</strong> — lent, erreurs de version, oublis de fichiers</li>
<li><strong>Plugins IDE classiques</strong> — puissants mais peu pensés pour les LLM</li>
<li><strong>RAG maison non standard</strong> — chaque équipe réinvente le connecteur</li>
<li><strong>MCP</strong> — outils déclarés, auditables, réutilisables entre projets</li>
</ul>
<h2>Cas d’usage par profil</h2>
<p><strong>Junior</strong> — explorer une codebase inconnue avec un serveur filesystem. <strong>Confirmé</strong> — enchaîner refactors multi-fichiers avec revue de diff. <strong>Lead</strong> — connecter GitHub + issue tracker pour préparer des releases.</p>',
    'photo-1522071820081-009f0129c71c',
    'Travail collaboratif autour d’un ordinateur'
);

$content .= blog_divider();

$content .= blog_split(
    '<h2>Sécurité : ce qu’il faut absolument respecter</h2>
<ul>
<li>N’activez que les serveurs dont vous comprenez les permissions (lecture seule quand possible).</li>
<li>Refusez les commandes shell ambiguës sans les lire.</li>
<li>Séparez les tokens production / développement.</li>
<li>Documentez dans le README quels MCP l’équipe utilise.</li>
<li>Relisez chaque diff avant commit — l’IA propose, vous signez.</li>
</ul>
<p>Un serveur MCP mal configuré avec accès shell complet équivaut à donner votre clavier à un inconnu motivé.</p>',
    'photo-1563986768609-322da13575f3',
    'Sécurité numérique et protection des accès',
    true
);

$content .= blog_split(
    '<h2>Workflow type d’une session MCP</h2>
<p><strong>1.</strong> Ouvrez une issue ou un ticket clair (« corriger l’affichage des images blog »). <strong>2.</strong> Demandez à l’agent de lister les fichiers concernés via MCP filesystem. <strong>3.</strong> Validez chaque modification fichier par fichier. <strong>4.</strong> Lancez les tests ou la preview locale vous-même. <strong>5.</strong> Commit avec message explicite. Ce rituel évite les PR géantes incompréhensibles.</p>
<p>Les équipes qui réussissent traitent l’IA comme un <strong>junior très rapide</strong> : potentiel énorme, supervision nécessaire. Les équipes qui échouent attendent magie sans revue — puis blâment l’outil.</p>',
    'photo-1504639725599-34d0984388bd',
    'Planification sur tableau blanc',
    false
);

$content .= <<<'HTML'
<h2>Limites honnêtes</h2>
<p>MCP ne choisit pas votre stack, ne négocie pas avec le client et ne garantit pas un SLA en production. Les modèles peuvent sur-interpréter un résultat d’outil ou enchaîner des actions inutiles. Gardez un œil critique : l’objectif est <strong>vélocité avec qualité</strong>, pas délégation aveugle.</p>
<h2>Par où commencer aujourd’hui ?</h2>
<ol>
<li>Installez Cursor et ouvrez votre dépôt principal.</li>
<li>Ajoutez un serveur <strong>filesystem</strong> pointant vers la racine du projet.</li>
<li>Ajoutez <strong>GitHub</strong> si vous travaillez en équipe.</li>
<li>Posez une question précise : « Explique le flux de publication d’un article de blog dans ce repo. »</li>
<li>Itérez : un outil de plus seulement quand le précédent est maîtrisé.</li>
</ol>
<h2>Conclusion</h2>
<p>Cursor sans MCP, c’est déjà utile. Cursor <em>avec</em> MCP, c’est l’IA qui travaille sur <strong>votre</strong> projet — pas sur un projet imaginaire. Si vous développez en full-stack PHP/React, commencez petit, sécurisez vos tokens, et mesurez le temps gagné sur une tâche réelle cette semaine. Le reste suivra.</p>
HTML;

return [
    'slug' => 'mcp-cursor-avantages-fonctionnement',
    'title' => 'MCP et Cursor : comprendre les super-pouvoirs de l’IA dans votre IDE',
    'excerpt' => 'Model Context Protocol, architecture, sécurité et cas concrets : tout ce qu’un développeur doit savoir pour connecter Cursor à sa vraie codebase.',
    'category' => 'tech',
    'cover_image' => blog_unsplash('photo-1517694712207-0088dd9f477c', 1600),
    'reading_time' => 38,
    'content' => $content,
];
