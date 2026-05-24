<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">« C’est rien. » « Tu exagères. » « Reprends-toi. » Combien de fois avons-nous entendu — ou dit — ces phrases face à une souffrance intérieure ? La <strong>santé mentale</strong> n’est pas une mode, ni une faiblesse, ni un caprice. C’est une part essentielle de la vie. Et quand elle est ignorée, minimisée ou moquée, les conséquences peuvent aller jusqu’à la <strong>perte de vie</strong>. Cet article est un appel à regarder la réalité en face — avec compassion, sans tabou.</p>
HTML;

$content .= blog_split(
    '<h2>Quand « ce n’est rien » devient tout</h2>
<p>Beaucoup de personnes souffrent en silence parce que l’entourage — parfois la société entière — leur a appris que la douleur psychique compte moins que la douleur physique. On va voir un médecin pour une fracture ; pour l’anxiété qui paralyse, la dépression qui vide, on se débrouille « seul ».</p>
<p>Résultat : des gens compétents, aimés, souriants en public, qui s’effondrent sans que personne n’ait vu venir le poids qu’ils portaient. Ce n’est pas de la faiblesse : c’est souvent des années de <strong>sur-adaptation</strong>, de l’honneur de « tenir », jusqu’au rupture.</p>',
    'photo-1516534770408-6d3688c1a1a1',
    'Deux personnes en conversation — écouter compte autant que parler'
);

$content .= blog_callout('⚠️', '<p><strong>Ce texte peut heurter.</strong> Il évoque la dépression, le suicide et la perte de proches. Si vous êtes en détresse, vous n’êtes pas seul·e : appelez le <strong>3114</strong> (France, 24h/24) ou un service d’urgence de votre pays. Votre vie a de la valeur.</p>');

$content .= <<<'HTML'
<h2>« Ils avaient l’air d’aller bien »</h2>
<p>Les histoires se ressemblent tragiquement : un collègue qui plaisantait encore la veille. Un ami qui annulait parfois des sorties « par fatigue ». Un parent qui disait « je gère ». Puis plus de nouvelles. Ou un message d’adieu. Ou une tentative qui, une fois, ne laisse plus de seconde chance.</p>
<blockquote>« On ne perd pas quelqu’un parce qu’il était faible. On le perd parfois parce que personne — lui y compris — n’a su nommer à temps ce qu’il traversait. »</blockquote>
<p>Le suicide n’est pas un acte de lâcheté. C’est souvent la fin d’une souffrance que la personne croyait insupportable et sans issue — surtout quand la honte l’empêchait de demander de l’aide.</p>
HTML;

$content .= blog_figure(
    'photo-1507003211169-0a1dd7228f2d',
    'Regard pensif — derrière le calme apparent, une tempête possible',
    'La santé mentale ne se voit pas toujours. L’écoute bienveillante est un premier secours.'
);

$content .= blog_split(
    '<h2>Pourquoi on minimise</h2>
<ul>
<li><strong>Manque de vocabulaire</strong> — on ne sait pas comment parler de dépression, de burn-out, de TSPT</li>
<li><strong>Culture de la performance</strong> — « réussir coûte que coûte », même au prix du corps et de l’esprit</li>
<li><strong>Peur du jugement</strong> — crainte d’être étiqueté « fou », « paresseux » ou « ingrat »</li>
<li><strong>Fausse croyance</strong> — « la prière / la volonté / le sport suffisent » sans accompagnement professionnel quand c’est grave</li>
<li><strong>Isolement numérique</strong> — des milliers de « amis » en ligne, personne à qui confier la nuit noire</li>
</ul>
<p>Minimiser, ce n’est pas toujours de la méchanceté. Souvent c’est de l’<em>inconfort</em> : face à la souffrance d’autrui, on voudrait une solution simple. Mais « ce n’est rien » peut être la goutte qui pousse quelqu’un à ne plus parler du tout.</p>',
    'photo-1573497019940-1f8500a695d8',
    'Femme en réflexion — la souffrance intérieure mérite autant d’attention que la physique',
    true
);

$content .= blog_divider();

$content .= <<<'HTML'
<h2>Signaux à ne plus ignorer (chez soi ou chez un proche)</h2>
<p>Aucun signe n’est une preuve absolue — mais leur accumulation mérite attention :</p>
<ol>
<li>Retrait social progressif, réponses de plus en plus courtes</li>
<li>Changements de sommeil ou d’appétit marqués</li>
<li>Perte d’intérêt pour ce qui faisait du bien avant</li>
<li>Paroles sur le « fardeau », la « fatigue de vivre », « ils iraient mieux sans moi »</li>
<li>Consommation accrue d’alcool, de drogues ou comportements à risque</li>
<li>Donner des objets importants, « régler des comptes » émotionnels, adieux indirects</li>
</ol>
<p>Si quelqu’un parle de se faire du mal : <strong>prenez-le au sérieux</strong>. Demandez calmement, écoutez sans juger, restez présent·e, orientez vers un professionnel ou les urgences.</p>
HTML;

$content .= blog_split(
    '<h2>Quand la tech n’est pas le sujet — mais peut aggraver</h2>
<p>Cet article n’est pas un billet « développeur ». La santé mentale concerne tout le monde : étudiants, parents, artisans, retraités. Parfois, un métier exigeant (y compris le numérique) ajoute une couche de stress — notifications, deadlines, comparaison — sans en être la cause unique.</p>
<p>Confondre un burn-out professionnel avec une simple « période difficile » retarde l’aide. Et retarder l’aide, dans les cas graves, peut coûter une vie.</p>',
    'photo-1499203537929-0d4ca7a70485',
    'Pause nécessaire — s’arrêter n’est pas abandonner'
);

$content .= blog_callout('💚', '<p><strong>Que faire concrètement ?</strong></p>
<ul>
<li><strong>Pour soi</strong> : parler à un médecin, un psychologue, un centre de santé mentale ; ne pas attendre d’« aller très mal »</li>
<li><strong>Pour un proche</strong> : « Je suis là. Tu n’as pas à traverser ça seul·e. » Proposer d’accompagner à un rendez-vous</li>
<li><strong>En urgence</strong> : services d’urgence locaux, 3114 (France), lignes d’écoute de votre pays</li>
<li><strong>Après un deuil par suicide</strong> : groupes de parole, thérapie — les proches survivants souffrent aussi</li>
</ul>');

$content .= <<<'HTML'
<h2>Rompre le silence après une perte</h2>
<p>Quand quelqu’un meurt par suicide, les familles affrontent souvent un double choc : la douleur de la perte, et la culpabilité (« j’aurais dû voir »), parfois le silence gêné des autres. Parler honnêtement — sans idéaliser ni accuser — aide les vivants à reconstruire.</p>
<p>Honorer une mémoire, c’est aussi <strong>changer notre regard</strong> sur la santé mentale : cesser de dire « ce n’est rien » quand quelqu’un souffre, apprendre à écouter, normaliser le soin psychologique comme le soin dentaire.</p>
HTML;

$content .= blog_figure(
    'photo-1529156069898-49953e39b3ac',
    'Main tendue, groupe solidaire',
    'La guérison est rarement solitaire. La communauté compte.'
);

$content .= <<<'HTML'
<h2>Conclusion : ce n’est pas rien — jamais</h2>
<p>La santé mentale mérite le même respect que la santé physique. Ceux et celles qui sont partis en croyant ne pas peser lourd ont laissé un vide immense. Ceux qui souffrent aujourd’hui méritent qu’on les croie <em>avant</em> qu’il soit trop tard.</p>
<p>Si vous lisez ces lignes et que vous traversez une période sombre : votre douleur est réelle, votre vie compte, et demander de l’aide est un acte de courage — pas de faiblesse. Un pas suffit ce soir : un appel, un message à une personne de confiance, une consultation.</p>
<p><em>Prenez soin de vous. Prenez soin les uns des autres.</em></p>
HTML;

return [
    'slug' => 'sante-mentale-ce-n-est-pas-rien',
    'title' => 'Santé mentale : quand « ce n’est rien » coûte des vies',
    'excerpt' => 'Dépression, silence, suicide : pourquoi tant de souffrances sont minimisées, comment repérer les signaux, et pourquoi demander de l’aide n’est jamais une faiblesse.',
    'category' => 'sante',
    'cover_image' => blog_unsplash('photo-1516534770408-6d3688c1a1a1', 1600),
    'reading_time' => 22,
    'content' => $content,
];
