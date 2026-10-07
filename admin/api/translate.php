<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

Auth::requireAdmin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$texts = $input['texts'] ?? [];
if (!is_array($texts)) {
    Response::error('Textes manquants', 422);
}

$phrases = [];
$phraseFile = dirname(__DIR__, 2) . '/database/en-phrases.json';
if (is_file($phraseFile)) {
    $decoded = json_decode((string) file_get_contents($phraseFile), true);
    if (is_array($decoded)) {
        $phrases = $decoded;
    }
}

$out = [];
foreach (array_slice($texts, 0, 40) as $text) {
    $out[] = adminTranslateToEnglish(is_string($text) ? $text : '', $phrases);
}

Response::json(['success' => true, 'translations' => $out]);

function adminTranslateToEnglish(string $text, array $phrases): string
{
    $source = trim($text);
    if ($source === '') {
        return '';
    }
    $hadHtml = $source !== trim(strip_tags($source));
    $plain = trim(html_entity_decode(strip_tags(str_replace(['</p>', '<br>', '<br/>', '<br />'], "\n", $source))));
    $key = preg_replace('/\s+/', ' ', $plain) ?? $plain;
    if (isset($phrases[$key]) && is_string($phrases[$key]) && trim($phrases[$key]) !== '') {
        $translated = trim($phrases[$key]);
    } else {
        $translated = adminMyMemory($key);
    }
    if ($translated === '') {
        return '';
    }
    if (!$hadHtml) {
        return $translated;
    }
    $safe = htmlspecialchars($translated, ENT_QUOTES, 'UTF-8');

    return '<p>' . nl2br($safe) . '</p>';
}

function adminMyMemory(string $text): string
{
    if ($text === '' || strlen($text) > 1800) {
        return '';
    }
    $url = 'https://api.mymemory.translated.net/get?langpair=fr|en&q=' . rawurlencode($text);
    $context = stream_context_create([
        'http' => ['timeout' => 8, 'header' => "User-Agent: DonchaminadeAdmin\r\n"],
    ]);
    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        return '';
    }
    $json = json_decode($raw, true);
    $value = $json['responseData']['translatedText'] ?? '';
    if (!is_string($value) || $value === '' || str_contains(strtoupper($value), 'MYMEMORY WARNING')) {
        return '';
    }

    return trim($value);
}
