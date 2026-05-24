<?php

declare(strict_types=1);

/** @return array<string, string> slug => label (thèmes intégrés) */
function blogBuiltinCategories(): array
{
    return [
        'tech' => 'Tech & Dev',
        'energie' => 'Énergie',
        'motivation' => 'Motivation',
        'spiritualite' => 'Spiritualité',
        'carriere' => 'Carrière',
        'lifestyle' => 'Lifestyle',
        'sante' => 'Santé mentale',
    ];
}

/** @deprecated use blogBuiltinCategories */
function blogCategories(): array
{
    return blogBuiltinCategories() + ['autre' => 'Autre'];
}

/** @return array<string, string> slug => label (intégrés + personnalisés) */
function blogAllCategories(?PDO $db = null): array
{
    $cats = blogBuiltinCategories();
    if ($db === null) {
        return $cats;
    }
    try {
        $rows = $db->query('SELECT slug, label FROM blog_category_labels ORDER BY label ASC')->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $cats[(string) $row['slug']] = (string) $row['label'];
        }
    } catch (PDOException) {
    }
    return $cats;
}

/** @return list<array{slug:string,label:string,emoji:string}> */
function blogCategoriesForApi(?PDO $db = null): array
{
    $out = [];
    $emojis = [
        'tech' => '⚡',
        'energie' => '🔥',
        'motivation' => '🚀',
        'spiritualite' => '✨',
        'carriere' => '💼',
        'lifestyle' => '🌿',
        'sante' => '🧠',
    ];
    foreach (blogBuiltinCategories() as $slug => $label) {
        $out[] = ['slug' => $slug, 'label' => $label, 'emoji' => $emojis[$slug] ?? '📝'];
    }
    if ($db !== null) {
        try {
            $rows = $db->query('SELECT slug, label, emoji FROM blog_category_labels ORDER BY label ASC')->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $row) {
                $out[] = [
                    'slug' => (string) $row['slug'],
                    'label' => (string) $row['label'],
                    'emoji' => (string) ($row['emoji'] ?: '📝'),
                ];
            }
        } catch (PDOException) {
        }
    }
    return $out;
}

function blogSlugifyCategory(string $label): string
{
    $slug = strtolower(trim($label));
    if (function_exists('transliterator_transliterate')) {
        $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug) ?: $slug;
    } else {
        $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug) ?: $slug;
    }
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');
    if ($slug === '') {
        $slug = 'theme-' . time();
    }
    return substr($slug, 0, 48);
}

/** Enregistre un thème personnalisé et retourne son slug. */
function blogRegisterCategory(PDO $db, string $label, string $emoji = '📝'): string
{
    $label = trim($label);
    if ($label === '') {
        throw new InvalidArgumentException('Nom de thème requis.');
    }
    $slug = blogSlugifyCategory($label);
    if (array_key_exists($slug, blogBuiltinCategories())) {
        return $slug;
    }
    $stmt = $db->prepare(
        'INSERT INTO blog_category_labels (slug, label, emoji) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE label = VALUES(label), emoji = VALUES(emoji)'
    );
    $stmt->execute([$slug, $label, mb_substr($emoji, 0, 12)]);
    return $slug;
}

function blogCategoryLabel(string $slug, ?PDO $db = null): string
{
    $all = blogAllCategories($db);
    return $all[$slug] ?? ucfirst(str_replace('-', ' ', $slug));
}

function blogNormalizeCategory(?string $raw, ?PDO $db = null): string
{
    $slug = blogSlugifyCategory((string) $raw);
    if (array_key_exists($slug, blogBuiltinCategories())) {
        return $slug;
    }
    if ($db !== null) {
        try {
            $stmt = $db->prepare('SELECT slug FROM blog_category_labels WHERE slug = ?');
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn()) {
                return $slug;
            }
        } catch (PDOException) {
        }
    }
    return $slug !== '' ? $slug : 'tech';
}

/** Résout la catégorie à enregistrer depuis le formulaire admin. */
function blogResolveCategoryFromPost(PDO $db, string $selected, ?string $customLabel): string
{
    $selected = trim($selected);
    if ($selected !== 'autre') {
        return blogNormalizeCategory($selected, $db);
    }
    $customLabel = trim((string) $customLabel);
    if ($customLabel === '') {
        throw new InvalidArgumentException('Indiquez le nom du nouveau thème.');
    }
    return blogRegisterCategory($db, $customLabel);
}

function blogIsBuiltinCategory(string $slug): bool
{
    return array_key_exists($slug, blogBuiltinCategories());
}
