<?php

declare(strict_types=1);

/**
 * Insère ou publie uniquement l’article Next.js 16.3 validé.
 * N’applique PAS le seed catalogue (ne touche pas profil, projets, uploads).
 *
 * CLI :
 *   php database/publish-nextjs-16-3-article.php --draft
 *   php database/publish-nextjs-16-3-article.php --publish
 */

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "CLI uniquement.\n");
    exit(1);
}

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/blog-content/helpers.php';

$mode = 'draft';
foreach (array_slice($argv, 1) as $arg) {
    if ($arg === '--publish') {
        $mode = 'publish';
    } elseif ($arg === '--draft') {
        $mode = 'draft';
    }
}

$post = require __DIR__ . '/blog-content/article-nextjs-16-3.php';
$db = Database::connection();

$hasPreview = false;
try {
    $db->query('SELECT preview_token, share_facebook, share_x FROM blog_posts LIMIT 1');
    $hasPreview = true;
} catch (PDOException) {
    $hasPreview = false;
}

if (!$hasPreview) {
    fwrite(STDERR, "Colonnes preview/share absentes. Lancez d’abord :\n");
    fwrite(STDERR, "  php database/apply-pending-migrations.php\n");
    exit(2);
}

$find = $db->prepare('SELECT id, is_published, preview_token FROM blog_posts WHERE slug = ? LIMIT 1');
$find->execute([$post['slug']]);
$row = $find->fetch();

$token = BlogShareCopy::newPreviewToken();
if ($row && !empty($row['preview_token'])) {
    $token = (string) $row['preview_token'];
}

if (!$row) {
    $db->prepare(
        'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at, preview_token)
         VALUES (?,?,?,?,?,?,?,0,NULL,?)'
    )->execute([
        $post['slug'], $post['title'], $post['excerpt'], $post['category'],
        $post['content'], $post['cover_image'], (int) $post['reading_time'], $token,
    ]);
    $id = (int) $db->lastInsertId();
    echo "Brouillon créé (id={$id}).\n";
} else {
    $id = (int) $row['id'];
    $db->prepare(
        'UPDATE blog_posts SET title=?, excerpt=?, category=?, content=?, cover_image=?, reading_time=?, preview_token=?
         WHERE id=?'
    )->execute([
        $post['title'], $post['excerpt'], $post['category'], $post['content'],
        $post['cover_image'], (int) $post['reading_time'], $token, $id,
    ]);
    echo "Brouillon mis à jour (id={$id}).\n";
}

$frontend = rtrim(frontendUrl(), '/');
echo "Aperçu : {$frontend}/blog/preview/{$token}\n";

if ($mode !== 'publish') {
    echo "Relisez l’aperçu, puis relancez avec --publish.\n";
    exit(0);
}

$share = BlogShareCopy::build($post['title'], (string) $post['excerpt'], $post['slug']);
$publishedAt = $post['published_at'] ?? date('Y-m-d H:i:s');
$db->prepare(
    'UPDATE blog_posts SET is_published=1, published_at=?, share_facebook=?, share_x=? WHERE id=?'
)->execute([$publishedAt, $share['facebook'], $share['x'], $id]);

echo "Publié : {$share['url']}\n";
echo "--- Facebook ---\n{$share['facebook']}\n";
echo "--- X ---\n{$share['x']}\n";
