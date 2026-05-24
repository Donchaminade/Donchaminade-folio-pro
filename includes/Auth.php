<?php

declare(strict_types=1);

final class Auth
{
    public static function startSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $name = env('SESSION_NAME', 'portfolio_admin_session');
        session_name($name);
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function check(): bool
    {
        self::startSession();
        return !empty($_SESSION['admin_user_id']);
    }

    public static function requireAdmin(): void
    {
        if (!self::check()) {
            header('Location: login.php');
            exit;
        }
    }

    public static function login(int $userId, string $email, string $name): void
    {
        self::startSession();
        session_regenerate_id(true);
        $_SESSION['admin_user_id'] = $userId;
        $_SESSION['admin_email'] = $email;
        $_SESSION['admin_name'] = $name;
    }

    public static function logout(): void
    {
        self::startSession();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }

    public static function user(): ?array
    {
        if (!self::check()) {
            return null;
        }

        return [
            'id' => (int) $_SESSION['admin_user_id'],
            'email' => (string) $_SESSION['admin_email'],
            'name' => (string) $_SESSION['admin_name'],
        ];
    }
}
