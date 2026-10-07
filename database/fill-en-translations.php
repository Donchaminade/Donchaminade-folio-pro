<?php

declare(strict_types=1);

/**
 * Remplit les colonnes *_en vides à partir de database/en-phrases.json,
 * puis de MyMemory si la phrase n’est pas dans le dictionnaire.
 * CLI : php database/fill-en-translations.php
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$root = dirname(__DIR__);
require_once $root . '/bootstrap.php';

$phrases = [];
$file = __DIR__ . '/en-phrases.json';
if (is_file($file)) {
    $decoded = json_decode((string) file_get_contents($file), true);
    if (is_array($decoded)) {
        $phrases = $decoded;
    }
}

$pairs = [
    ['site_profile', 'id', ['hero_title' => 'hero_title_en', 'hero_subtitle' => 'hero_subtitle_en', 'bio' => 'bio_en', 'availability_text' => 'availability_text_en', 'experience_badge_label' => 'experience_badge_label_en']],
    ['stats', 'id', ['label' => 'label_en', 'suffix' => 'suffix_en']],
    ['experiences', 'id', ['role' => 'role_en', 'period' => 'period_en']],
    ['experience_descriptions', 'id', ['content' => 'content_en']],
    ['projects', 'id', ['title' => 'title_en', 'description' => 'description_en', 'detailed_description' => 'detailed_description_en']],
    ['skill_blocks', 'id', ['title' => 'title_en']],
    ['skill_categories', 'id', ['name' => 'name_en']],
    ['skill_items', 'id', ['name' => 'name_en']],
    ['testimonials', 'id', ['quote' => 'quote_en', 'role' => 'role_en']],
    ['recommendations', 'id', ['body' => 'body_en', 'role' => 'role_en']],
    ['communities', 'id', ['role' => 'role_en', 'description' => 'description_en']],
    ['awards', 'id', ['title' => 'title_en', 'description' => 'description_en']],
    ['education', 'id', ['degree' => 'degree_en', 'field' => 'field_en']],
    ['soft_skills', 'id', ['title' => 'title_en', 'impact' => 'impact_en']],
    ['blog_posts', 'id', ['title' => 'title_en', 'excerpt' => 'excerpt_en']],
];

$db = Database::connection();
$updated = 0;

foreach ($pairs as [$table, $idCol, $map]) {
    foreach ($map as $source => $target) {
        if (!dbHasColumn($db, $table, $source) || !dbHasColumn($db, $table, $target)) {
            continue;
        }
        $rows = $db->query("SELECT `{$idCol}` AS id, `{$source}` AS source, `{$target}` AS target FROM `{$table}`")->fetchAll();
        $stmt = $db->prepare("UPDATE `{$table}` SET `{$target}` = ? WHERE `{$idCol}` = ?");
        foreach ($rows as $row) {
            if (trim((string) ($row['target'] ?? '')) !== '' || trim((string) ($row['source'] ?? '')) === '') {
                continue;
            }
            $english = fillTranslate((string) $row['source'], $phrases);
            if ($english === '') {
                continue;
            }
            $stmt->execute([$english, $row['id']]);
            $updated++;
        }
    }
}

echo "Colonnes anglaises remplies : {$updated}\n";

function fillTranslate(string $french, array $phrases): string
{
    $plain = trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($french))) ?? '');
    if ($plain === '') {
        return '';
    }
    if (isset($phrases[$plain]) && is_string($phrases[$plain])) {
        return $phrases[$plain];
    }
    $url = 'https://api.mymemory.translated.net/get?langpair=fr|en&q=' . rawurlencode($plain);
    $raw = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 8]]));
    if ($raw === false) {
        return '';
    }
    $json = json_decode($raw, true);
    $value = $json['responseData']['translatedText'] ?? '';
    if (!is_string($value) || str_contains(strtoupper($value), 'MYMEMORY WARNING')) {
        return '';
    }

    return trim($value);
}
