<?php

declare(strict_types=1);

/**
 * Aperçu Open Graph du portfolio (WhatsApp, Facebook, LinkedIn…).
 * Les robots lisent ces balises ; les visiteurs sont redirigés vers le front Vercel.
 */

require_once dirname(__DIR__) . '/bootstrap.php';

$siteName = 'Donchaminade';
$frontendBase = rtrim(frontendUrl(), '/');
$frontendUrl = $frontendBase . '/';

$title = 'Donchaminade | Développeur Web & Mobile Full-Stack';
$description = 'Portfolio de ADJOLOU Dondah Chaminade — développeur web & mobile. Solutions digitales sur mesure, React, PHP, Flutter.';
// Image unique : public/image.png sur le front Vercel
$imageUrl = $frontendBase . '/image.png';

try {
    $repo = new PortfolioRepository(Database::connection());
    $profile = $repo->getProfile();
    if ($profile) {
        if (!empty($profile['full_name'])) {
            $title = (string) $profile['full_name'] . ' — Développeur Web & Mobile';
        }
        if (!empty($profile['bio'])) {
            $description = mb_substr(trim(strip_tags((string) $profile['bio'])), 0, 300);
        }
    }
} catch (Throwable) {
    // valeurs par défaut ci-dessus
}

$pageUrl = trim((string) ($_GET['from'] ?? ''));
if ($pageUrl === '' || !str_starts_with($pageUrl, 'http')) {
    $pageUrl = $frontendUrl;
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?></title>
    <meta name="description" content="<?= e($description) ?>">
    <link rel="canonical" href="<?= e($pageUrl) ?>">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= e($siteName) ?>">
    <meta property="og:url" content="<?= e($pageUrl) ?>">
    <meta property="og:title" content="<?= e($title) ?>">
    <meta property="og:description" content="<?= e($description) ?>">
    <meta property="og:image" content="<?= e($imageUrl) ?>">
    <meta property="og:image:secure_url" content="<?= e($imageUrl) ?>">
    <meta property="og:image:alt" content="Portrait — <?= e($siteName) ?>">
    <meta property="og:locale" content="fr_FR">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($title) ?>">
    <meta name="twitter:description" content="<?= e($description) ?>">
    <meta name="twitter:image" content="<?= e($imageUrl) ?>">

    <meta http-equiv="refresh" content="0;url=<?= e($pageUrl) ?>">
    <script>window.location.replace(<?= json_encode($pageUrl, JSON_UNESCAPED_UNICODE) ?>);</script>
</head>
<body>
    <p>Redirection vers le portfolio… <a href="<?= e($pageUrl) ?>"><?= e($title) ?></a></p>
</body>
</html>
