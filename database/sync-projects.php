<?php

declare(strict_types=1);

/**
 * Importe / met à jour tous les projets du catalogue en base.
 * CLI : php database/sync-projects.php
 */

require_once dirname(__DIR__) . '/bootstrap.php';

/** @return array{created:int, updated:int, total:int} */
function syncProjectsFromCatalog(PDO $db): array
{
    $catalog = require __DIR__ . '/projects-catalog.php';
    $root = dirname(__DIR__);

    $find = $db->prepare('SELECT id FROM projects WHERE title = ? LIMIT 1');
    $insert = $db->prepare(
        'INSERT INTO projects (title, description, detailed_description, image, link, github, type, sort_order, is_featured, is_active)
         VALUES (?,?,?,?,?,?,?,?,?,1)'
    );
    $update = $db->prepare(
        'UPDATE projects SET description=?, detailed_description=?, image=?, link=?, github=?, type=?, sort_order=?, is_featured=?, is_active=1 WHERE id=?'
    );
    $delTags = $db->prepare('DELETE FROM project_tags WHERE project_id = ?');
    $delImgs = $db->prepare('DELETE FROM project_images WHERE project_id = ?');
    $insTag = $db->prepare('INSERT INTO project_tags (project_id, tag) VALUES (?,?)');
    $insImg = $db->prepare('INSERT INTO project_images (project_id, url, sort_order) VALUES (?,?,?)');

    $created = 0;
    $updated = 0;

    $db->beginTransaction();
    try {
        foreach ($catalog as $p) {
            $title = $p['title'];
            $image = projectImagePath((string) ($p['image'] ?? ''), $root);
            $link = normalizeProjectLink((string) ($p['link'] ?? '#'));
            $github = trim((string) ($p['github'] ?? '#')) ?: '#';

            $find->execute([$title]);
            $existingId = $find->fetchColumn();

            if ($existingId) {
                $projectId = (int) $existingId;
                $update->execute([
                    $p['description'],
                    $p['detailed_description'] ?? null,
                    $image,
                    $link,
                    $github,
                    $p['type'],
                    (int) $p['sort_order'],
                    (int) ($p['is_featured'] ?? 0),
                    $projectId,
                ]);
                $updated++;
            } else {
                $insert->execute([
                    $title,
                    $p['description'],
                    $p['detailed_description'] ?? null,
                    $image,
                    $link,
                    $github,
                    $p['type'],
                    (int) $p['sort_order'],
                    (int) ($p['is_featured'] ?? 0),
                ]);
                $projectId = (int) $db->lastInsertId();
                $created++;
            }

            $delTags->execute([$projectId]);
            foreach ($p['tags'] ?? [] as $tag) {
                $insTag->execute([$projectId, $tag]);
            }

            $delImgs->execute([$projectId]);
            foreach ($p['additional_images'] ?? [] as $i => $imgUrl) {
                $imgUrl = projectImagePath((string) $imgUrl, $root);
                if ($imgUrl !== '' && $imgUrl !== $image) {
                    $insImg->execute([$projectId, $imgUrl, $i]);
                }
            }
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        throw $e;
    }

    $total = (int) $db->query('SELECT COUNT(*) FROM projects')->fetchColumn();

    return ['created' => $created, 'updated' => $updated, 'total' => $total];
}

function projectImagePath(string $path, string $root): string
{
    if ($path === '' || str_starts_with($path, 'http')) {
        return $path;
    }
    $rel = ltrim($path, '/');
    $basename = basename($rel);
    $candidates = [
        "{$root}/public/{$rel}",
        "{$root}/public/gallerie/{$basename}",
        "{$root}/public/{$basename}",
        "{$root}/{$rel}",
    ];
    foreach ($candidates as $full) {
        if (is_file($full)) {
            if (str_contains($full, DIRECTORY_SEPARATOR . 'gallerie' . DIRECTORY_SEPARATOR)) {
                return '/gallerie/' . $basename;
            }
            if (str_contains($full, DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR)) {
                return '/' . $basename;
            }
            return '/' . $rel;
        }
    }
    return '/' . $rel;
}

function normalizeProjectLink(string $link): string
{
    $link = trim($link);
    if ($link === '' || $link === '#') {
        return '#';
    }
    if (!str_starts_with($link, 'http://') && !str_starts_with($link, 'https://')) {
        return 'https://' . ltrim($link, '/');
    }
    return $link;
}

if (PHP_SAPI === 'cli' && realpath($_SERVER['argv'][0] ?? '') === realpath(__FILE__)) {
    try {
        $result = syncProjectsFromCatalog(Database::connection());
        echo "Sync terminé : {$result['created']} créé(s), {$result['updated']} mis à jour(s). Total : {$result['total']}.\n";
    } catch (Throwable $e) {
        fwrite(STDERR, 'Erreur : ' . $e->getMessage() . PHP_EOL);
        exit(1);
    }
}
