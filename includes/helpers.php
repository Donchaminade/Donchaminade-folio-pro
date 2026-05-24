<?php

declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function rootPath(): string
{
    return dirname(__DIR__);
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

/** URL du portfolio public (Vercel ou local Vite) */
function frontendUrl(): string
{
    $url = env('FRONTEND_URL', '');
    if ($url !== '') {
        return rtrim($url, '/');
    }
    return rtrim(env('APP_URL', 'http://localhost'), '/');
}

/** URL de partage avec aperçu Open Graph (WhatsApp, LinkedIn, etc.) */
function blogShareUrl(string $slug): string
{
    return rtrim(env('APP_URL', ''), '/') . '/blog/share.php?slug=' . rawurlencode($slug);
}

/** URL absolue d'un média (image de couverture blog pour OG, admin) */
function absoluteMediaUrl(?string $path): string
{
    if ($path === null || trim($path) === '') {
        return rtrim(env('APP_URL', ''), '/') . '/pypicture.png';
    }

    return uploadDisplayUrl($path);
}

/** URL d'affichage d'un fichier uploadé (XAMPP : /public/uploads/…) */
function uploadDisplayUrl(?string $path): string
{
    if ($path === null || trim($path) === '') {
        return '';
    }
    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return $path;
    }

    $p = '/' . ltrim($path, '/');
    if (str_starts_with($p, '/uploads/') && !str_starts_with($p, '/public/')) {
        $p = '/public' . $p;
    }

    return rtrim(env('APP_URL', ''), '/') . $p;
}

/** Normalise une URL d'image vers /uploads/… pour stockage portable en BDD */
function uploadStoragePath(?string $urlOrPath): string
{
    if ($urlOrPath === null || trim($urlOrPath) === '') {
        return '';
    }

    $p = trim($urlOrPath);
    $base = rtrim(env('APP_URL', ''), '/');
    if ($base !== '' && str_starts_with($p, $base)) {
        $p = substr($p, strlen($base));
    }

    $p = '/' . ltrim($p, '/');
    if (str_starts_with($p, '/public/uploads/')) {
        $p = substr($p, strlen('/public'));
    }

    return $p;
}

/** Métadonnées visiteur pour audit commentaires */
function captureVisitorMeta(): array
{
    $ip = GeoIp::clientIp();
    $geo = GeoIp::lookup($ip);

    return [
        'ip_address' => $ip,
        'user_agent' => mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512),
        'visitor_hash' => BlogRepository::visitorHash(),
        'referrer' => mb_substr($_SERVER['HTTP_REFERER'] ?? '', 0, 500),
        'geo_country' => $geo['country'],
        'geo_region' => $geo['region'],
        'geo_city' => $geo['city'],
    ];
}

/**
 * Normalise $_FILES['key'] simple ou multiple.
 *
 * @return list<array{name: string, type: string, tmp_name: string, error: int, size: int}>
 */
function normalizeUploadedFiles(string $field): array
{
    if (!isset($_FILES[$field])) {
        return [];
    }

    $f = $_FILES[$field];
    if (!is_array($f['name'] ?? null)) {
        if (($f['name'] ?? '') === '') {
            return [];
        }

        return [[
            'name' => (string) $f['name'],
            'type' => (string) ($f['type'] ?? ''),
            'tmp_name' => (string) ($f['tmp_name'] ?? ''),
            'error' => (int) ($f['error'] ?? UPLOAD_ERR_NO_FILE),
            'size' => (int) ($f['size'] ?? 0),
        ]];
    }

    $out = [];
    foreach ($f['name'] as $i => $name) {
        if ($name === '' || $name === null) {
            continue;
        }
        $out[] = [
            'name' => (string) $name,
            'type' => (string) ($f['type'][$i] ?? ''),
            'tmp_name' => (string) ($f['tmp_name'][$i] ?? ''),
            'error' => (int) ($f['error'][$i] ?? UPLOAD_ERR_NO_FILE),
            'size' => (int) ($f['size'][$i] ?? 0),
        ];
    }

    return $out;
}

function formatBytes(int $bytes): string
{
    if ($bytes < 1024) {
        return $bytes . ' o';
    }
    if ($bytes < 1_048_576) {
        return round($bytes / 1024, 1) . ' Ko';
    }

    return round($bytes / 1_048_576, 1) . ' Mo';
}
