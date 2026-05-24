<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Notifications, deadlines, déploiements à minuit, comparaison sur les réseaux : notre métier pousse à la <strong>réactivité permanente</strong>. Le <strong>lâcher-prise</strong> n’est ni de l’indifférence ni de la paresse. C’est la capacité à donner le meilleur sur ce qui dépend de vous, puis à accepter que le reste n’est pas entièrement maîtrisable. Cet article long explore les fondements, les pratiques quotidiennes et les pièges — pour durer dans la tech sans vous perdre.</p>
HTML;

$content .= blog_split(
    '<h2>Le mal silencieux des « always on »</h2>
<p>Slack qui vibre, mail client, alerte de prod, pull request en attente : le cerveau reste en mode alerte même allongé sur l’oreiller. La fatigue n’est pas seulement physique — elle est <strong>cognitive</strong>. Vous croyez « vous reposer » en scrollant, mais l’attention reste fragmentée.</p>
<p>Le lâcher-prise, dans cette acceptation moderne, signifie : <em>arrêter de confondre préparation et contrôle du résultat</em>. Vous pouvez écrire des tests, documenter, communiquer — vous ne pouvez pas forcer un recruteur à dire oui, un algorithme à vous favoriser, ou un utilisateur à ne jamais râler.</p>',
    'photo-1506126613408-eca07ce68773',
    'Yoga et respiration — métaphore du calme intérieur'
);

$content .= blog_callout('🧘', '<p>« Souffrir, c’est vouloir que la réalité soit autre qu’elle est. » — Idée stoïcienne reprise par de nombreux auteurs modernes ; à nuancer, mais utile comme boussole.</p>');

$content .= <<<'HTML'
<h2>Cercle de contrôle : cartographier vos soucis</h2>
<p>Divisez une feuille en trois colonnes :</p>
<ul>
<li><strong>Je contrôle</strong> — qualité du code, heures de sommeil, préparation d’entretien</li>
<li><strong>J’influence</strong> — relation client, documentation, pédagogie en équipe</li>
<li><strong>Je lâche</strong> — décision finale d’un tiers, météo du trafic, passé irréversible</li>
</ul>
<p>Chaque soir, classez trois soucis du jour. Vous verrez que beaucoup d’angoisses vivent dans la mauvaise colonne.</p>
HTML;

$content .= blog_split(
    '<h2>Ce que vous ne contrôlez pas (liste libératrice)</h2>
<ul>
<li>La décision finale d’un recruteur ou d’un client</li>
<li>Un algorithme de réseau social qui enterre votre publication</li>
<li>Le pic de trafic le jour d’un lancement</li>
<li>L’humeur d’un collègue sous pression</li>
<li>Un bug déjà en production hier — seul le présent se corrige</li>
</ul>
<h2>Ce qui reste entre vos mains</h2>
<ol>
<li>La qualité de votre préparation (checklists, revues)</li>
<li>La clarté de votre communication écrite et orale</li>
<li>Vos limites : horaires, charge maximale, droit de dire non</li>
<li>Votre réaction face à l’imprévu (rollback, post-mortem sans blame)</li>
<li>Le soin au corps : hydratation, mouvement, sommeil</li>
</ol>',
    'photo-1499203537929-0d4ca7a70485',
    'Moment de calme face à la ville',
    true
);

$content .= blog_figure('photo-1432888498266-38ffec3eaf0a', 'Nature et perspective', 'Se reconnecter à quelque chose de plus grand que la todo list aide à relativiser les urgences artificielles.');

$content .= <<<'HTML'
<h2>Pratiques quotidiennes (10 à 20 minutes)</h2>
<h3>Respiration 4-7-8</h3>
<p>Inspirez 4 secondes, retenez 7, expirez 8. Cinq cycles avant une réunion tendue ou après une alerte. Le système nerveux parasympathique prend le relais — pas magie, physiologie.</p>
<h3>Micro-pauses sans écran</h3>
<p>Après chaque bloc de 90 minutes de concentration, marchez cinq minutes sans téléphone. Le cerveau consolide ; les idées de debug arrivent souvent dans ces intervalles.</p>
<h3>Journal de gratitude technique</h3>
<p>« Aujourd’hui le build est passé, un utilisateur a dit merci, j’ai appris une commande Git. Le reste attendra demain. » Trois lignes suffisent.</p>
HTML;

$content .= blog_split(
    '<h2>Lâcher-prise et spiritualité</h2>
<p>Quelle que soit votre tradition — prière, méditation, lecture inspirante — l’idée commune est de <strong>replacer votre identité</strong> au-delà de votre dernier sprint. Ce n’est pas incompatible avec l’exigence technique : c’est ce qui évite d’en faire une idole.</p>
<p>Beaucoup de développeurs athées ou agnostiques trouvent dans la marche, la musique ou le service aux autres le même effet de recul : sortir de la tête, revenir au corps et aux relations.</p>',
    'photo-1507003211169-0a1dd7228f2d',
    'Personne en réflexion tranquille'
);

$content .= blog_callout('⚡', '<p><strong>Attention :</strong> lâcher-prise ≠ évitement. Ne pas répondre aux incidents critiques, ne pas écrire de tests « parce que l’univers décidera » — c’est de la négligence. On lâche l’<em>issue</em>, pas l’<em>effort</em>.</p>');

$content .= <<<'HTML'
<h2>Scénario concret : déploiement stressant</h2>
<pre><code>Avant (rumination) :
« Si ça casse, je suis nul, ma carrière est finie. »

Après (lâcher-prise actif) :
« J'ai suivi la checklist. Si incident : rollback,
post-mortem, apprentissage. Mon identité ne tient pas
dans un seul déploiement. »</code></pre>
<h2>Quand demander de l’aide</h2>
<p>Si l’anxiété empêche de dormir plusieurs nuits, si la colère est permanente, si l’alcool ou l’évitement prennent le relais — le lâcher-prise seul ne suffit pas. Parlez à un professionnel de santé, un médecin, un psychologue. Ce n’est pas une faiblesse ; c’est de la maintenance humaine.</p>
HTML;

$content .= blog_split(
    '<h2>Construire une culture d’équipe plus saine</h2>
<ul>
<li>Post-mortems sans chasse aux coupables</li>
<li>Respect des horaires hors astreinte rémunérée</li>
<li>Documentation pour réduire la peur du bus factor</li>
<li>Célébration des petites victoires, pas seulement des gros releases</li>
</ul>
<p>Le lâcher-prise individuel prospère mieux dans un environnement qui ne glorifie pas le burnout.</p>',
    'photo-1543269865-cbf427effbad',
    'Équipe sereine en réunion',
    true
);

$content .= blog_split(
    '<h2>Comparer moins, créer plus</h2>
<p>Les réseaux sociaux exposent la réussite filtrée des autres développeurs : promotions, projets open source stars, lifestyle nomade. Comparer votre coulisse à leur vitrine alimente l’anxiété. Limitez la consommation passive ; augmentez la production alignée sur <em>vos</em> objectifs (un commit utile, un article, une sortie avec un ami).</p>
<p>Le lâcher-prise inclut parfois de <strong>se désabonner</strong> mentalement de ces flux — pas par déni, mais par protection de l’attention, ressource finie.</p>',
    'photo-1516326001380-fb6c0c2c5b1e',
    'Pause café loin de l\'écran',
    false
);

$content .= blog_divider();

$content .= <<<'HTML'
<h2>Plan sur 30 jours</h2>
<ol>
<li><strong>Semaine 1</strong> — tenir le journal cercle de contrôle chaque soir</li>
<li><strong>Semaine 2</strong> — une micro-pause sans écran par demi-journée de code</li>
<li><strong>Semaine 3</strong> — une frontière claire (ex. pas de Slack après 20h)</li>
<li><strong>Semaine 4</strong> — bilan : qu’est-ce qui a réellement changé ?</li>
</ol>
<h2>Conclusion</h2>
<p>Le lâcher-prise est un muscle. Plus vous l’entraînez avec honnêteté, plus vous codez avec clarté, dormez mieux et restez disponible pour ce qui compte — projets, proches, vous-même. Ce soir, choisissez une chose à classer dans « Je lâche », fermez l’onglet qui ne sert plus, et respirez une fois profondément. C’est déjà un début.</p>
HTML;

return [
    'slug' => 'lacher-prise-developpeur-equilibre',
    'title' => 'Lâcher prise : retrouver l’équilibre quand tout va vite',
    'excerpt' => 'Guide approfondi sur le lâcher-prise pour développeurs et créatifs : cercle de contrôle, pratiques quotidiennes, spiritualité, pièges et plan sur 30 jours.',
    'category' => 'spiritualite',
    'cover_image' => blog_unsplash('photo-1506126613408-eca07ce68773', 1600),
    'reading_time' => 34,
    'content' => $content,
];
