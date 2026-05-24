<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$content = <<<'HTML'
<p class="blog-lead">Le <strong>bénévolat</strong>, ce n’est pas du travail gratuit imposé : c’est un choix de donner son temps et ses compétences au service d’autrui, sans rémunération, souvent avec une joie profonde que l’argent ne remplace pas. Que vous soyez développeur, designer, étudiant ou en reconversion, cet article répond aux quatre questions essentielles — <em>pourquoi</em>, <em>comment</em>, <em>quand</em> et <em>où</em> — avec des exemples concrets, y compris pour le numérique et l’Afrique de l’Ouest.</p>
HTML;

$content .= blog_split(
    '<h2>Pourquoi donner de son temps ?</h2>
<h3>Impact social</h3>
<p>Les associations manquent rarement de bonne volonté ; elles manquent de <strong>compétences spécialisées</strong> : sites web, comptabilité, traduction, logistique événementielle. Une heure de votre expertise peut débloquer des mois d’activité pour une structure qui aide des centaines de personnes.</p>
<ul>
<li>Lutte contre l’isolement (personnes âgées, réfugiés)</li>
<li>Éducation et orientation des jeunes</li>
<li>Accès au numérique pour les publics exclus</li>
<li>Urgence humanitaire et solidarité locale</li>
</ul>',
    'photo-1559027615-cd4628902174',
    'Mains qui s’entraident — symbole de solidarité'
);

$content .= blog_split(
    '<h3>Impact personnel</h3>
<ul>
<li><strong>Sens</strong> — contrebalancer une carrière centrée uniquement sur la livraison de features</li>
<li><strong>Réseau</strong> — rencontrer des profils hors de la bulle tech</li>
<li><strong>Soft skills</strong> — écoute, pédagogie, gestion de conflits</li>
<li><strong>Bien-être</strong> — l’effet « helper’s high » documenté en psychologie positive</li>
</ul>
<p>Beaucoup de bénévoles rapportent une meilleure confiance en eux et une vision élargie de ce qu’ils veulent faire professionnellement.</p>',
    'photo-1529156069898-49953e39b3ac',
    'Groupe de bénévoles unis pour une cause',
    true
);

$content .= blog_callout('💬', '<p>« On ne baisse pas les autres en les relevant : on monte avec eux. » — Cette phrase résume l’éthique d’un engagement horizontal, pas paternaliste.</p>');

$content .= blog_figure('photo-1523240795612-9a054b0db644', 'Échange humain et entraide', 'Le bénévolat commence par l’écoute des besoins réels du terrain, pas par l’imposition de solutions toutes faites.');

$content .= <<<'HTML'
<h2>Comment choisir sa mission (méthode en 5 étapes)</h2>
<ol>
<li><strong>Identifiez vos causes</strong> — jeunesse, santé, environnement, culture, inclusion numérique…</li>
<li><strong>Listez vos talents</strong> — dev web, design, animation, langues, organisation</li>
<li><strong>Fixez un créneau réaliste</strong> — 2 h/semaine tenues valent mieux que 30 h sur un mois puis l’abandon</li>
<li><strong>Rencontrez le référent</strong> — comprenez la charte, la confidentialité, la durée</li>
<li><strong>Évaluez après 3 mois</strong> — continuez, ajustez ou passez la main sans culpabilité</li>
</ol>
HTML;

$content .= blog_split(
    '<h3>Exemples pour un développeur web</h3>
<ul>
<li>Refonte accessible du site d’une ONG locale</li>
<li>Atelier « premiers pas sur internet » pour des seniors</li>
<li>Maintenance d’une base de données d’inventaire alimentaire</li>
<li>Mentorat via une association « tech for good »</li>
<li>Contribution open source à impact humanitaire</li>
</ul>
<p>Vous n’avez pas besoin d’être expert : vous devez être <strong>fiable</strong> et communiquer clairement sur ce que vous savez faire — et ce que vous apprenez encore.</p>',
    'photo-1573164713714-dbb11c2a933e',
    'Femme développeuse aidant une association',
    true
);

$content .= blog_divider();

$content .= <<<'HTML'
<h2>Quand s’engager ?</h2>
<p>Il n’existe pas de « bon moment universel ». Il existe un créneau <strong>honnête</strong> que vous tenez.</p>
<ul>
<li><strong>Études</strong> — vacances, weekends, projets associatifs encadrés par l’école</li>
<li><strong>Début de carrière</strong> — portfolio « avec impact » et récits d’expérience en entretien</li>
<li><strong>Mi-carrière</strong> — retrouver du sens face au burn-out ou à la routine</li>
<li><strong>Après 50 ans</strong> — transmission d’expérience très recherchée par les structures</li>
</ul>
<blockquote>« Commencez petit. Mieux vaut un samedi par mois pendant cinq ans qu’un été héroïque suivi de silence. »</blockquote>
HTML;

$content .= blog_split(
    '<h2>Où trouver des opportunités ?</h2>
<h3>En local (Togo, Afrique de l’Ouest, votre ville)</h3>
<ul>
<li>Mairies, centres communautaires, bibliothèques</li>
<li>Associations de quartier, clubs sportifs adaptés, écoles</li>
<li>ONG de santé, protection de l’enfance, inclusion</li>
<li>Lieux de culte <em>si</em> vous partagez leurs valeurs — sans prosélytisme imposé</li>
</ul>
<h3>En ligne (sans volontourisme)</h3>
<ul>
<li>Traduction Wikipédia, Humanitarian OpenStreetMap</li>
<li>Mentorat communautaire (associations tech, alumni)</li>
<li>Contributions open source à impact mesurable</li>
</ul>',
    'photo-1469571486292-0ba58a3f068b',
    'Carte et engagement — le local comme point de départ'
);

$content .= blog_callout('⚠️', '<p><strong>Éviter le volontourisme :</strong> méfiez-vous des missions courtes sans compétence locale, surtout à l’étranger, où la photo Instagram remplace l’écoute. Privilégiez les structures ancrées depuis des années et demandez comment votre aide sera <em>reprise</em> après votre départ.</p>');

$content .= blog_split(
    '<h2>Compétences numériques les plus demandées</h2>
<ul>
<li>Site vitrine responsive (association sans budget marketing)</li>
<li>Formulaires de contact et dons sécurisés (HTTPS, validation)</li>
<li>Formation « éviter les arnaques en ligne » pour publics fragiles</li>
<li>Automatisation légère (Google Sheets, exports CSV, petits scripts)</li>
<li>Accessibilité : contrastes, tailles de police, navigation clavier</li>
</ul>
<p>Avant de promettre une refonte complète, livrez une <strong>v1 utile</strong> : page d’accueil claire, coordonnées, appel à l’action. L’association itérera avec vous.</p>',
    'photo-1521737711867-e3b97375f902',
    'Équipe tech en session de travail',
    true
);

$content .= <<<'HTML'
<h2>Témoignage (réaliste, inspiré de terrain)</h2>
<p>« Un samedi par mois, j’ai remis à niveau le site d’un centre d’accueil à Lomé : formulaire de don, accessibilité, hébergement stable. En six mois, les dons en ligne ont doublé. J’ai appris plus sur le contraste des couleurs et les lecteurs d’écran que sur trois MOOC. » — Développeur bénévole</p>
<h2>Équilibre vie pro / engagement</h2>
<p>Le bénévolat ne doit pas devenir une deuxième boîte mail urgente 24h/24. Posez des limites : canal dédié, plages horaires, durée de mission définie. Si votre employeur encourage le mécénat de compétences, renseignez-vous sur les jours autorisés — certains groupes le formalisent.</p>
<h2>Conclusion</h2>
<p>Le bénévolat n’est pas une case « bonne conscience » à cocher une fois dans l’année. C’est une pratique, parfois exigeante, toujours volontaire, qui transforme des vies — y compris la vôtre. Choisissez une cause qui vous touche, un créneau que vous tiendrez, une association qui vous respecte. Le reste est de l’apprentissage partagé.</p>
HTML;

return [
    'slug' => 'bienfaits-benevolat-guide-complet',
    'title' => 'Le bénévolat : pourquoi, comment, quand et où s’engager',
    'excerpt' => 'Guide long et pratique pour choisir une mission de bénévolat, éviter les écueils, s’engager en local ou en ligne — avec une place centrale pour les compétences numériques.',
    'category' => 'motivation',
    'cover_image' => blog_unsplash('photo-1559027615-cd4628902174', 1600),
    'reading_time' => 36,
    'content' => $content,
];
