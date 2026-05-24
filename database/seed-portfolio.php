<?php

declare(strict_types=1);

require_once __DIR__ . '/sync-projects.php';

function seedResolveIconUrl(string $key): string
{
    static $map = null;
    if ($map === null) {
        $tech = require __DIR__ . '/technologies-catalog.php';
        $extra = [
            'Intelligence Artificielle' => 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg',
            'Marketing Digital' => 'https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg',
            'Creation Visuelle' => 'https://www.vectorlogo.zone/logos/adobe_illustrator/adobe_illustrator-icon.svg',
            'Word' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftword/microsoftword-original.svg',
            'Tailwind' => $tech['Tailwind CSS'] ?? $tech['Tailwind'] ?? '',
            'VS Code' => $tech['VS Code'] ?? $tech['VScode'] ?? '',
        ];
        $map = array_merge($tech, $extra);
    }

    return $map[$key] ?? '';
}

function seedEnsureGalleryClientsTables(PDO $db): void
{
    $migration = file_get_contents(__DIR__ . '/migrations/014_gallery_clients.sql');
    if ($migration === false) {
        return;
    }
    $migration = preg_replace('/--[^\n]*\n/', "\n", $migration);
    foreach (array_filter(array_map('trim', explode(';', $migration))) as $statement) {
        if ($statement !== '') {
            try {
                $db->exec($statement);
            } catch (PDOException) {
                // table may already exist
            }
        }
    }
}

function seedAdminUser(PDO $db): void
{
    $adminEmail = 'chaminade.dondah.adjolou@gmail.com';
    $adminHash = '$2y$10$AkKU8NeqNpLS2BUBJzXT3OwHqitqZDzftEE4tJkOH6nLixE.9XnHG';
    $adminName = 'Chaminade Adjolou';

    $stmt = $db->prepare(
        'INSERT INTO users (id, email, password_hash, name) VALUES (1, ?, ?, ?)
         ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash), name=VALUES(name)'
    );
    $stmt->execute([$adminEmail, $adminHash, $adminName]);
}

function seedProfile(PDO $db): void
{
    $p = require __DIR__ . '/catalog/profile-catalog.php';
    $count = (int) $db->query('SELECT COUNT(*) FROM site_profile')->fetchColumn();

    if ($count === 0) {
        $db->prepare(
            'INSERT INTO site_profile (full_name, hero_title, hero_subtitle, bio, availability_text, experience_badge, experience_badge_label, email, phone, whatsapp, linkedin_url, twitter_url, github_url, cv_path, photo_path, footer_year)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        )->execute([
            $p['full_name'], $p['hero_title'], $p['hero_subtitle'], $p['bio'],
            $p['availability_text'], $p['experience_badge'], $p['experience_badge_label'],
            $p['email'], $p['phone'], $p['whatsapp'], $p['linkedin_url'], $p['twitter_url'],
            $p['github_url'], $p['cv_path'], $p['photo_path'], $p['footer_year'],
        ]);
        return;
    }

    $id = $db->query('SELECT id FROM site_profile ORDER BY id ASC LIMIT 1')->fetchColumn();
    if (!$id) {
        return;
    }

    $db->prepare(
        'UPDATE site_profile SET full_name=?, hero_title=?, hero_subtitle=?, bio=?, availability_text=?, experience_badge=?, experience_badge_label=?, email=?, phone=?, whatsapp=?, linkedin_url=?, twitter_url=?, github_url=?, cv_path=?, photo_path=?, footer_year=? WHERE id=?'
    )->execute([
        $p['full_name'], $p['hero_title'], $p['hero_subtitle'], $p['bio'],
        $p['availability_text'], $p['experience_badge'], $p['experience_badge_label'],
        $p['email'], $p['phone'], $p['whatsapp'], $p['linkedin_url'], $p['twitter_url'],
        $p['github_url'], $p['cv_path'], $p['photo_path'], $p['footer_year'], (int) $id,
    ]);
}

function seedStats(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/stats-catalog.php';
    $find = $db->prepare('SELECT id FROM stats WHERE label = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO stats (label, value, suffix, sort_order) VALUES (?,?,?,?)');
    $update = $db->prepare('UPDATE stats SET value=?, suffix=?, sort_order=?, is_active=1 WHERE id=?');
    $count = 0;

    foreach ($rows as [$label, $value, $suffix, $sortOrder]) {
        $find->execute([$label]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$value, $suffix, $sortOrder, (int) $id]);
        } else {
            $insert->execute([$label, $value, $suffix, $sortOrder]);
        }
        $count++;
    }

    return $count;
}

function seedExperiences(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/experiences-catalog.php';
    $find = $db->prepare('SELECT id FROM experiences WHERE company = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO experiences (company, role, period, sort_order) VALUES (?,?,?,?)');
    $update = $db->prepare('UPDATE experiences SET role=?, period=?, sort_order=?, is_active=1 WHERE id=?');
    $delDesc = $db->prepare('DELETE FROM experience_descriptions WHERE experience_id = ?');
    $delTags = $db->prepare('DELETE FROM experience_tags WHERE experience_id = ?');
    $insDesc = $db->prepare('INSERT INTO experience_descriptions (experience_id, content, sort_order) VALUES (?,?,?)');
    $insTag = $db->prepare('INSERT INTO experience_tags (experience_id, tag) VALUES (?,?)');
    $count = 0;

    foreach ($rows as $exp) {
        $find->execute([$exp['company']]);
        $id = $find->fetchColumn();
        if ($id) {
            $expId = (int) $id;
            $update->execute([$exp['role'], $exp['period'], $exp['sort_order'], $expId]);
        } else {
            $insert->execute([$exp['company'], $exp['role'], $exp['period'], $exp['sort_order']]);
            $expId = (int) $db->lastInsertId();
        }

        $delDesc->execute([$expId]);
        $delTags->execute([$expId]);
        foreach ($exp['description'] as $i => $content) {
            $insDesc->execute([$expId, $content, $i]);
        }
        foreach ($exp['tags'] as $tag) {
            $insTag->execute([$expId, $tag]);
        }
        $count++;
    }

    return $count;
}

function seedSkills(PDO $db): int
{
    $blocks = require __DIR__ . '/catalog/skills-catalog.php';
    $findBlock = $db->prepare('SELECT id FROM skill_blocks WHERE title = ? LIMIT 1');
    $insertBlock = $db->prepare('INSERT INTO skill_blocks (title, icon, sort_order) VALUES (?,?,?)');
    $updateBlock = $db->prepare('UPDATE skill_blocks SET icon=?, sort_order=?, is_active=1 WHERE id=?');
    $findCat = $db->prepare('SELECT id FROM skill_categories WHERE block_id = ? AND name = ? LIMIT 1');
    $insertCat = $db->prepare('INSERT INTO skill_categories (block_id, name, sort_order) VALUES (?,?,?)');
    $updateCat = $db->prepare('UPDATE skill_categories SET sort_order=? WHERE id=?');
    $delIcons = $db->prepare('DELETE FROM skill_category_icons WHERE category_id = ?');
    $delItems = $db->prepare('DELETE FROM skill_items WHERE category_id = ?');
    $insIcon = $db->prepare('INSERT INTO skill_category_icons (category_id, icon_url, sort_order) VALUES (?,?,?)');
    $insItem = $db->prepare('INSERT INTO skill_items (category_id, name, sort_order) VALUES (?,?,?)');
    $count = 0;

    foreach ($blocks as $block) {
        $findBlock->execute([$block['title']]);
        $blockId = $findBlock->fetchColumn();
        if ($blockId) {
            $updateBlock->execute([$block['icon'], $block['sort_order'], (int) $blockId]);
            $blockId = (int) $blockId;
        } else {
            $insertBlock->execute([$block['title'], $block['icon'], $block['sort_order']]);
            $blockId = (int) $db->lastInsertId();
        }

        foreach ($block['categories'] as $catOrder => $cat) {
            $findCat->execute([$blockId, $cat['name']]);
            $catId = $findCat->fetchColumn();
            if ($catId) {
                $updateCat->execute([$catOrder, (int) $catId]);
                $catId = (int) $catId;
            } else {
                $insertCat->execute([$blockId, $cat['name'], $catOrder]);
                $catId = (int) $db->lastInsertId();
            }

            $delIcons->execute([$catId]);
            $delItems->execute([$catId]);
            foreach ($cat['icons'] ?? [] as $i => $iconKey) {
                $url = seedResolveIconUrl($iconKey);
                if ($url !== '') {
                    $insIcon->execute([$catId, $url, $i]);
                }
            }
            foreach ($cat['skills'] as $i => $skill) {
                $insItem->execute([$catId, $skill, $i]);
            }
            $count++;
        }
    }

    return $count;
}

function seedSoftSkills(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/soft-skills-catalog.php';
    $find = $db->prepare('SELECT id FROM soft_skills WHERE title = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO soft_skills (title, impact, sort_order) VALUES (?,?,?)');
    $update = $db->prepare('UPDATE soft_skills SET impact=?, sort_order=?, is_active=1 WHERE id=?');
    $delCtx = $db->prepare('DELETE FROM soft_skill_contexts WHERE soft_skill_id = ?');
    $insCtx = $db->prepare('INSERT INTO soft_skill_contexts (soft_skill_id, context) VALUES (?,?)');
    $count = 0;

    foreach ($rows as $row) {
        $find->execute([$row['title']]);
        $id = $find->fetchColumn();
        if ($id) {
            $skillId = (int) $id;
            $update->execute([$row['impact'], $row['sort_order'], $skillId]);
        } else {
            $insert->execute([$row['title'], $row['impact'], $row['sort_order']]);
            $skillId = (int) $db->lastInsertId();
        }
        $delCtx->execute([$skillId]);
        foreach ($row['context'] as $ctx) {
            $insCtx->execute([$skillId, $ctx]);
        }
        $count++;
    }

    return $count;
}

function seedEducation(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/education-catalog.php';
    $find = $db->prepare('SELECT id FROM education WHERE degree = ? AND school = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO education (degree, field, school, year, sort_order) VALUES (?,?,?,?,?)');
    $update = $db->prepare('UPDATE education SET field=?, year=?, sort_order=?, is_active=1 WHERE id=?');
    $count = 0;

    foreach ($rows as $row) {
        $find->execute([$row['degree'], $row['school']]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$row['field'], $row['year'], $row['sort_order'], (int) $id]);
        } else {
            $insert->execute([$row['degree'], $row['field'], $row['school'], $row['year'], $row['sort_order']]);
        }
        $count++;
    }

    return $count;
}

function seedAwards(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/awards-catalog.php';
    $find = $db->prepare('SELECT id FROM awards WHERE title = ? AND year = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO awards (title, issuer, year, description, sort_order) VALUES (?,?,?,?,?)');
    $update = $db->prepare('UPDATE awards SET issuer=?, description=?, sort_order=?, is_active=1 WHERE id=?');
    $count = 0;

    foreach ($rows as [$title, $issuer, $year, $description, $sortOrder]) {
        $find->execute([$title, $year]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$issuer, $description, $sortOrder, (int) $id]);
        } else {
            $insert->execute([$title, $issuer, $year, $description, $sortOrder]);
        }
        $count++;
    }

    return $count;
}

function seedTestimonials(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/testimonials-catalog.php';
    $find = $db->prepare('SELECT id FROM testimonials WHERE name = ? AND company = ? LIMIT 1');
    $insert = $db->prepare(
        'INSERT INTO testimonials (quote, name, role, company, image, sort_order, is_active, is_approved) VALUES (?,?,?,?,?,?,1,1)'
    );
    $update = $db->prepare(
        'UPDATE testimonials SET quote=?, role=?, image=?, sort_order=?, is_active=1, is_approved=1 WHERE id=?'
    );
    $count = 0;

    foreach ($rows as $row) {
        $find->execute([$row['name'], $row['company']]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$row['quote'], $row['role'], $row['image'], $row['sort_order'], (int) $id]);
        } else {
            $insert->execute([$row['quote'], $row['name'], $row['role'], $row['company'], $row['image'], $row['sort_order']]);
        }
        $count++;
    }

    return $count;
}

function seedCommunities(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/communities-catalog.php';
    $find = $db->prepare('SELECT id FROM communities WHERE name = ? LIMIT 1');
    $insert = $db->prepare(
        'INSERT INTO communities (name, logo, role, description, website_url, linkedin_url, sort_order) VALUES (?,?,?,?,?,?,?)'
    );
    $update = $db->prepare(
        'UPDATE communities SET logo=?, role=?, description=?, website_url=?, linkedin_url=?, sort_order=?, is_active=1 WHERE id=?'
    );
    $count = 0;

    foreach ($rows as $row) {
        $find->execute([$row['name']]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([
                $row['logo'], $row['role'], $row['description'],
                $row['website_url'], $row['linkedin_url'], $row['sort_order'], (int) $id,
            ]);
        } else {
            $insert->execute([
                $row['name'], $row['logo'], $row['role'], $row['description'],
                $row['website_url'], $row['linkedin_url'], $row['sort_order'],
            ]);
        }
        $count++;
    }

    return $count;
}

function seedManagedPages(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/managed-pages-catalog.php';
    $find = $db->prepare('SELECT id FROM managed_pages WHERE name = ? LIMIT 1');
    $insert = $db->prepare(
        'INSERT INTO managed_pages (name, logo, link, followers, category, border_color, sort_order) VALUES (?,?,?,?,?,?,?)'
    );
    $update = $db->prepare(
        'UPDATE managed_pages SET logo=?, link=?, followers=?, category=?, border_color=?, sort_order=?, is_active=1 WHERE id=?'
    );
    $count = 0;

    foreach ($rows as $row) {
        $find->execute([$row['name']]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([
                $row['logo'], $row['link'], $row['followers'], $row['category'],
                $row['border_color'], $row['sort_order'], (int) $id,
            ]);
        } else {
            $insert->execute([
                $row['name'], $row['logo'], $row['link'], $row['followers'],
                $row['category'], $row['border_color'], $row['sort_order'],
            ]);
        }
        $count++;
    }

    return $count;
}

function seedClients(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/clients-catalog.php';
    $find = $db->prepare('SELECT id FROM clients WHERE name = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO clients (name, logo, sort_order) VALUES (?,?,?)');
    $update = $db->prepare('UPDATE clients SET logo=?, sort_order=?, is_active=1 WHERE id=?');
    $count = 0;

    foreach ($rows as [$name, $logo, $sortOrder]) {
        $find->execute([$name]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$logo, $sortOrder, (int) $id]);
        } else {
            $insert->execute([$name, $logo, $sortOrder]);
        }
        $count++;
    }

    return $count;
}

function seedGallery(PDO $db): int
{
    $rows = require __DIR__ . '/catalog/gallery-catalog.php';
    $find = $db->prepare('SELECT id FROM gallery_images WHERE url = ? LIMIT 1');
    $insert = $db->prepare('INSERT INTO gallery_images (url, caption, sort_order) VALUES (?,?,?)');
    $update = $db->prepare('UPDATE gallery_images SET caption=?, sort_order=?, is_active=1 WHERE id=?');
    $count = 0;

    foreach ($rows as [$url, $caption, $sortOrder]) {
        $find->execute([$url]);
        $id = $find->fetchColumn();
        if ($id) {
            $update->execute([$caption, $sortOrder, (int) $id]);
        } else {
            $insert->execute([$url, $caption, $sortOrder]);
        }
        $count++;
    }

    return $count;
}

function seedTechnologies(PDO $db): int
{
    $techCatalog = require __DIR__ . '/technologies-catalog.php';
    $techStmt = $db->prepare('INSERT INTO technologies (name, icon_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE icon_url = VALUES(icon_url)');
    $count = 0;
    foreach ($techCatalog as $name => $url) {
        $techStmt->execute([$name, $url]);
        $count++;
    }

    return $count;
}

/** @return array<string, int> */
function seedPortfolio(PDO $db): array
{
    seedEnsureGalleryClientsTables($db);
    seedAdminUser($db);
    seedProfile($db);

    $projects = syncProjectsFromCatalog($db);

    require_once __DIR__ . '/seed-blog-posts.php';

    return [
        'stats' => seedStats($db),
        'technologies' => seedTechnologies($db),
        'experiences' => seedExperiences($db),
        'projects' => (int) ($projects['total'] ?? 0),
        'skill_categories' => seedSkills($db),
        'soft_skills' => seedSoftSkills($db),
        'education' => seedEducation($db),
        'awards' => seedAwards($db),
        'testimonials' => seedTestimonials($db),
        'communities' => seedCommunities($db),
        'managed_pages' => seedManagedPages($db),
        'clients' => seedClients($db),
        'gallery' => seedGallery($db),
        'blog_posts' => seedBlogPosts($db),
    ];
}
