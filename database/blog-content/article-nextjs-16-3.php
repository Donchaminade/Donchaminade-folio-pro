<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Next.js 16.3, publié le 3 août 2026, n’est pas seulement une version plus rapide. C’est la première fois que le framework assume clairement qu’<strong>un agent IA fait partie de la boucle de développement</strong> — et qu’il écrit aussi pour lui : docs versionnées, skills, erreurs actionnables, MCP de compilation. En parallèle, <strong>Instant Navigations</strong> rend enfin les clics aussi snappy qu’une SPA, sans abandonner le modèle serveur. Voici ce qui change vraiment, et comment le relire depuis Lomé ou Cotonou.</p>
HTML;

$content .= blog_split(
    '<h2>Ce que 16.3 change pour tout le monde</h2>
<p>Même sans toucher à la config, l’upgrade apporte des gains mesurés par Vercel :</p>
<ul>
<li><strong>Jusqu’à 90&nbsp;% de RAM en moins</strong> sur <code>next dev</code> (cache disque + éviction mémoire Turbopack, activés par défaut).</li>
<li><strong>Builds plus rapides</strong> : le FileSystem Cache de Turbopack s’applique aussi à <code>next build</code> (jusqu’à 5,5× sur certains projets CI).</li>
<li><strong>TypeScript 7</strong> : port natif, typage beaucoup plus rapide pendant le build.</li>
<li><strong>Rendu serveur</strong> : streams Node.js natifs à la place des web streams — jusqu’à 22&nbsp;% de requêtes en plus sous charge.</li>
<li>Moins de requêtes de prefetch (petits payloads regroupés), assets immuables réutilisables entre déploiements, <code>catchError</code> pour des error boundaries qui ne cassent plus <code>notFound</code> / <code>redirect</code>, <code>import.meta.glob</code>, et les <strong>root params</strong> (ex. <code>[lang]</code>) accessibles depuis n’importe quel Server Component.</li>
</ul>
<p>Sources officielles : <a href="https://nextjs.org/blog/next-16-3" target="_blank" rel="noopener">Next.js 16.3</a> et <a href="https://github.com/vercel/next.js/releases/tag/v16.3.0" target="_blank" rel="noopener">v16.3.0</a>.</p>',
    'photo-1555066931-4365d14bab8c',
    'Écran de code — le terrain où les agents et les humains se croisent'
);

$content .= blog_callout('📌', '<p><strong>À retenir :</strong> les navigations instantanées sont <em>opt-in</em> aujourd’hui (<code>cacheComponents</code> + <code>partialPrefetching</code>). Elles deviendront le défaut dans une prochaine majeure. Les docs agents, elles, s’activent dès <code>next dev</code>.</p>');

$content .= <<<'HTML'
<h2>Le framework s’écrit aussi pour les agents</h2>
<p>La question posée par l’équipe Next.js est simple : <em>à quoi ressemblerait Next.js s’il était conçu d’abord pour un développement piloté par des agents</em> (Cursor, Claude Code, Codex) ? La 16.3 n’y répond pas à 100&nbsp;%, mais elle pose des rails concrets — documentés dans <a href="https://nextjs.org/blog/next-16-3-ai-improvements" target="_blank" rel="noopener">Next.js 16.3: AI Improvements</a>.</p>
<h3>AGENTS.md versionné, sans setup</h3>
<p>Au <code>next dev</code>, si un agent est détecté, Next.js écrit (et maintient) un bloc balisé dans <code>AGENTS.md</code>. Ce bloc pointe vers la doc <strong>bundlée dans <code>node_modules/next/dist/docs/</code></strong> — celle de <em>votre</em> version, pas celle que le modèle a mémorisée en 2024. Les anciens Skills « connaissance » (conventions App Router, cache) sont retirés : la doc locale les remplace. Pour désactiver : <code>agentRules: false</code> dans <code>next.config.ts</code>.</p>
<h3>Skills first-party (workflows, pas de la doc)</h3>
<ul>
<li><code>next-dev-loop</code> — l’agent relit la page, la console, le réseau et l’arbre React via <code>/_next/mcp</code> + <code>agent-browser</code> (≥ 0.27).</li>
<li><code>next-cache-components-adoption</code> — active Cache Components, route par route, avec validation humaine aux frontières.</li>
<li><code>next-cache-components-optimizer</code> — transforme l’UI « visible au clic » en test <code>instant()</code> qui doit passer au vert.</li>
<li><code>next-partial-prefetching-adoption</code> — (stable 16.3) active le Partial Prefetching jusqu’à ce que chaque lien réutilise un shell commun.</li>
</ul>
<pre><code>npx skills add vercel/next.js --skill next-dev-loop</code></pre>
HTML;

$content .= blog_figure(
    'photo-1677442136019-21780ecad995',
    'Illustration abstraite d’un réseau neuronal',
    'L’agent lit la doc de VOTRE next, pas un souvenir de formation. La publication, elle, reste humaine.'
);

$content .= blog_split(
    '<h2>Erreurs actionnables, docs en Markdown, MCP utile</h2>
<p>Avec Cache Components, un <code>await</code> côté serveur est un <strong>choix produit</strong>. Instant Insights le présente comme une erreur à trois issues :</p>
<ol>
<li><strong>Stream</strong> — envelopper dans <code>&lt;Suspense&gt;</code></li>
<li><strong>Cache</strong> — <code>\'use cache\'</code></li>
<li><strong>Block</strong> — <code>export const instant = false</code></li>
</ol>
<p>Chaque insight a un bouton <em>Copy prompt</em> : un prompt prêt à coller, qui impose de lire la page <code>/docs/messages/…</code> (écrite pour les agents : Patterns, Trade-offs, Gotchas) puis de <strong>vérifier dans le navigateur</strong>. Le même menu apparaît dans le terminal et dans <code>next build</code>.</p>
<p>Le serveur MCP DevTools se recentre : plus de base de connaissance interne. À la place, <code>get_compilation_issues</code> et <code>compile_route</code> — pour ne plus lancer un <code>next build</code> entier juste pour savoir si une route compile.</p>
<p>Et partout sur <a href="https://nextjs.org/docs" target="_blank" rel="noopener">nextjs.org/docs</a> : ajoutez <code>.md</code> à l’URL, ou envoyez <code>Accept: text/markdown</code>. Index : <code>/docs/llms.txt</code>.</p>',
    'photo-1518770660439-4636190af475',
    'Circuit imprimé — la matière des systèmes que l’on demande maintenant aux agents de piloter',
    true
);

$content .= <<<'HTML'
<h2>Instant Navigations : le feeling SPA, le modèle serveur</h2>
<p>Les Server Components ont réduit le JS et les waterfalls — au prix de clics qui « attendaient le serveur ». 16.3 inverse la donne <em>si</em> vous l’activez :</p>
<pre><code>const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};
export default nextConfig;</code></pre>
<ul>
<li>Soit vous streamez derrière <code>&lt;Suspense&gt;</code>, soit vous marquez une partie de l’UI avec <code>\'use cache\'</code> — Next extraie un <strong>shell</strong> et le précharge avant le clic.</li>
<li><strong>Partial Prefetching</strong> : un shell réutilisable par route (pas une page entière par lien). <code>prefetch={true}</code> reste possible pour aller plus loin.</li>
<li><strong>ISR + shell</strong> : une URL absente de <code>generateStaticParams</code> sert d’abord le shell, puis se prerend en arrière-plan.</li>
<li><strong>Instant Insights</strong> + <strong>Navigation Inspector</strong> (devtools) : une nav lente devient une erreur ; vous pouvez figer le shell pour le voir.</li>
<li>Helper Playwright <code>instant()</code> (<code>@next/playwright</code>) : assert ce qui doit être visible <em>sans attendre le réseau</em>.</li>
</ul>
<p>Détail : <a href="https://nextjs.org/blog/next-16-3-instant-navigations" target="_blank" rel="noopener">Instant Navigations</a>.</p>
HTML;

$content .= blog_callout('⚡', '<p>Une nav « instantanée » n’est pas magique : c’est un contrat. Si un <code>cookies()</code> remonte dans un layout partagé, le shell disparaît. Le test <code>instant()</code> existe pour que le prochain refactor ne le casse pas en silence.</p>');

$content .= blog_split(
    '<h2>Ce que ça change pour un studio en Afrique de l’Ouest</h2>
<p>On n’a pas toujours un DevRel ni un budget CI infini. 16.3 est utile précisément <em>parce que</em> :</p>
<ol>
<li>L’agent arrête d’inventer l’API de Next 13 — il lit <code>node_modules/next/dist/docs/</code>.</li>
<li><code>compile_route</code> coûte moins cher qu’un build complet sur un laptop 8 Go.</li>
<li>Le prompt « Copy prompt » + la page <code>/docs/messages</code> réduisent le ping-pong « ça compile mais la nav est lente ».</li>
<li>Le rituel reste le même que sur ce portfolio : <strong>brouillon → aperçu → validation humaine</strong>. Un agent n’a pas le droit de publier.</li>
</ol>
<p>Ce site est React + PHP. Next n’est pas la stack du front public — mais c’est celle de beaucoup de projets clients (RachCargo, Nutripack, AI228). Comprendre 16.3, c’est pouvoir cadrer un agent sur <em>ces</em> dépôts sans halluciner un dossier <code>pages/</code> fantôme.</p>',
    'photo-1522071820081-009f0129c71c',
    'Équipe autour d’un écran — la revue reste humaine'
);

$content .= <<<'HTML'
<h2>Expérimental, à tester sans en faire une promesse client</h2>
<ul>
<li><strong>React Compiler Rust</strong> dans Turbopack : <code>reactCompiler: true</code> + <code>experimental.turbopackRustReactCompiler</code>. Gains mesurés surtout si vous n’avez plus Babel.</li>
<li><strong>Réseau offline</strong> : <code>experimental.useOffline</code> — une nav / fetch / Server Action reste en attente et réessaie. Hook <code>useOffline()</code> pour bannière. Utile quand la 4G coupe — cas réel à Lomé.</li>
</ul>
<h2>Checklist d’upgrade (sans se noyer)</h2>
<ol>
<li><code>npm install next@latest</code> — lisez le changelog, pas un résumé de modèle.</li>
<li>Lancez <code>next dev</code>, commitez le bloc <code>AGENTS.md</code> s’il apparaît.</li>
<li>N’activez <code>cacheComponents</code> que sur une branche, avec le Skill d’adoption <em>ou</em> route par route.</li>
<li>Interdisez à l’agent de merger / déployer. Relisez le shell (Navigation Inspector) sur mobile.</li>
<li>Gardez un test <code>instant()</code> sur les 2–3 liens les plus cliqués.</li>
</ol>
<blockquote>« Le framework accélère le premier jet et le premier clic. La confiance, elle, se gagne à la relecture — humaine. »</blockquote>
<h2>Conclusion</h2>
<p>Next.js 16.3 dit deux choses à la fois : <strong>les clics doivent être instantanés</strong>, et <strong>les agents doivent lire la doc de <em>cette</em> version</strong>. Ce n’est pas de la science-fiction. C’est un contrat d’outillage. Sur un produit, le dernier clic — publier, merger, facturer — reste le vôtre.</p>
HTML;

return [
    'slug' => 'nextjs-16-3-agents-ia-navigations-instantanees',
    'title' => 'Next.js 16.3 : quand le framework s’écrit aussi pour les agents IA',
    'excerpt' => 'Docs versionnées pour les agents, skills, MCP de compilation, Instant Navigations : ce que Next.js 16.3 change vraiment — et pourquoi la publication reste humaine.',
    'category' => 'tech',
    'cover_image' => blog_unsplash('photo-1633356122544-f134324a6cee', 1600),
    'reading_time' => 12,
    'published_at' => '2026-09-15 10:00:00',
    'content' => $content,
];
