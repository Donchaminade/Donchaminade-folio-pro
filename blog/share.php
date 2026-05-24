<?php

declare(strict_types=1);

/**
 * Page de partage avec balises Open Graph (aperçu WhatsApp, Facebook, LinkedIn…).
 * Les visiteurs sont redirigés vers le portfolio React ; les robots lisent les meta OG.
 */

require_once dirname(__DIR__) . '/bootstrap.php';

$slug = trim((string) ($_GET['slug'] ?? ''));
if ($slug === '') {
    http_response_code(404);
    echo 'Article introuvable';
    exit;
}

try {
    $repo = new BlogRepository(Database::connection());
    $post = $repo->getBySlug($slug);
} catch (Throwable) {
    $post = null;
}

if (!$post) {
    http_response_code(404);
    echo 'Article introuvable';
    exit;
}

$title = (string) $post['title'];
$description = trim((string) ($post['excerpt'] ?? ''));
if ($description === '') {
    $description = mb_substr(strip_tags((string) $post['content']), 0, 200);
}

$frontendUrl = frontendUrl() . '/blog/' . rawurlencode($slug);
$shareUrl = blogShareUrl($slug);
$imageUrl = absoluteMediaUrl((string) ($post['cover_image'] ?? ''));
$siteName = 'Donchaminade';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?> — <?= e($siteName) ?></title>
    <meta name="description" content="<?= e($description) ?>">
    <link rel="canonical" href="<?= e($frontendUrl) ?>">

    <meta property="og:type" content="article">
    <meta property="og:site_name" content="<?= e($siteName) ?>">
    <meta property="og:url" content="<?= e($shareUrl) ?>">
    <meta property="og:title" content="<?= e($title) ?>">
    <meta property="og:description" content="<?= e($description) ?>">
    <meta property="og:image" content="<?= e($imageUrl) ?>">
    <meta property="og:image:secure_url" content="<?= e($imageUrl) ?>">
    <meta property="og:locale" content="fr_FR">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($title) ?>">
    <meta name="twitter:description" content="<?= e($description) ?>">
    <meta name="twitter:image" content="<?= e($imageUrl) ?>">

    <meta http-equiv="refresh" content="0;url=<?= e($frontendUrl) ?>">
    <script>window.location.replace(<?= json_encode($frontendUrl, JSON_UNESCAPED_UNICODE) ?>);</script>
</head>
<body>
    <p>Redirection vers l'article… <a href="<?= e($frontendUrl) ?>"><?= e($title) ?></a></p>
</body>
</html>
