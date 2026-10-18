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

/**
 * Articles en brouillon uniquement — jamais forcés en ligne par le seed.
 */
function seedBlogDrafts(PDO $db): int
{
    $drafts = [
        require __DIR__ . '/blog-content/article-agents-ia-2026.php',
        require __DIR__ . '/blog-content/article-nextjs-16-3.php',
    ];

    try {
        $db->query('SELECT preview_token FROM blog_posts LIMIT 1');
    } catch (PDOException) {
        return 0;
    }

    $find = $db->prepare('SELECT id, is_published FROM blog_posts WHERE slug = ? LIMIT 1');
    $insert = $db->prepare(
        'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at, preview_token)
         VALUES (?,?,?,?,?,?,?,0,NULL,?)'
    );
    $updateDraft = $db->prepare(
        'UPDATE blog_posts SET title=?, excerpt=?, category=?, content=?, cover_image=?, reading_time=?
         WHERE id=? AND is_published = 0'
    );
    $count = 0;

    foreach ($drafts as $p) {
        $find->execute([$p['slug']]);
        $row = $find->fetch();
        if ($row) {
            if ((int) $row['is_published'] === 1) {
                continue;
            }
            $updateDraft->execute([
                $p['title'], $p['excerpt'], $p['category'], $p['content'],
                $p['cover_image'], (int) $p['reading_time'], (int) $row['id'],
            ]);
        } else {
            $insert->execute([
                $p['slug'], $p['title'], $p['excerpt'], $p['category'], $p['content'],
                $p['cover_image'], (int) $p['reading_time'], BlogShareCopy::newPreviewToken(),
            ]);
        }
        $count++;
    }

    return $count;
}
