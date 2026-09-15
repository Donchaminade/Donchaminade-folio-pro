<?php

declare(strict_types=1);

final class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        } elseif (function_exists('litespeed_finish_request')) {
            litespeed_finish_request();
        } else {
            if (ob_get_level() > 0) {
                @ob_end_flush();
            }
            @flush();
        }
        exit;
    }

    public static function error(string $message, int $status = 400, array $extra = []): void
    {
        self::json(array_merge(['error' => $message], $extra), $status);
    }

    public static function cors(): void
    {
        $origins = env('CORS_ORIGINS', 'http://localhost:3000');
        $allowed = array_values(array_filter(array_map('trim', explode(',', $origins))));
        $frontend = rtrim((string) env('FRONTEND_URL', ''), '/');
        if ($frontend !== '' && !in_array($frontend, $allowed, true)) {
            $allowed[] = $frontend;
        }
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        $ok = $origin !== '' && (
            in_array($origin, $allowed, true)
            || self::isTrustedVercelOrigin($origin)
        );

        if ($ok) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    private static function isTrustedVercelOrigin(string $origin): bool
    {
        $host = parse_url($origin, PHP_URL_HOST);
        if (!is_string($host) || $host === '') {
            return false;
        }

        return (bool) preg_match(
            '/^(donchaminade(-[a-z0-9]+)*|donchaminade-git-[a-z0-9-]+)-chaminadegithubs-projects\.vercel\.app$/i',
            $host
        ) || strcasecmp($host, 'donchaminade-alpha.vercel.app') === 0;
    }
}
