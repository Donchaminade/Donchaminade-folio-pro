<?php

declare(strict_types=1);

/**
 * Insère ou met à jour les articles de blog (source : blog-articles-data.php).
 */
function seedBlogPosts(PDO $db): int
{
    $posts = require __DIR__ . '/blog-articles-data.php';

    $db->exec("DELETE FROM blog_posts WHERE slug = 'bienvenue-sur-mon-blog-tech'");

    $stmt = $db->prepare(
        'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at)
         VALUES (?,?,?,?,?,?,?,1,?)
         ON DUPLICATE KEY UPDATE
           title=VALUES(title), excerpt=VALUES(excerpt), category=VALUES(category),
           content=VALUES(content), cover_image=VALUES(cover_image),
           reading_time=VALUES(reading_time), is_published=1, published_at=VALUES(published_at)'
    );

    $count = 0;
    foreach ($posts as $p) {
        $publishedAt = $p['published_at'] ?? date('Y-m-d H:i:s', strtotime('-' . ((count($posts) - 1 - $count) * 3) . ' days'));
        $stmt->execute([
            $p['slug'],
            $p['title'],
            $p['excerpt'],
            $p['category'],
            $p['content'],
            $p['cover_image'],
            (int) $p['reading_time'],
            $publishedAt,
        ]);
        $count++;
    }

    return $count;
}
