<?php

declare(strict_types=1);

/**
 * Crée ou met à jour le compte admin depuis ADMIN_EMAIL / ADMIN_PASSWORD (.env).
 * Aucun mot de passe n'est écrit dans le dépôt.
 */
final class AdminProvisioner
{
    public static function ensureFromEnv(): void
    {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;

        $email = trim((string) env('ADMIN_EMAIL', ''));
        $password = (string) env('ADMIN_PASSWORD', '');
        $name = trim((string) env('ADMIN_NAME', 'Administrateur'));

        if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return;
        }
        if (strlen($password) < 12) {
            return;
        }

        try {
            $db = Database::connection();
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $id = $stmt->fetchColumn();
            if ($id) {
                $db->prepare('UPDATE users SET password_hash = ?, name = ? WHERE id = ?')
                    ->execute([$hash, $name !== '' ? $name : 'Administrateur', (int) $id]);
                return;
            }
            $db->prepare('INSERT INTO users (email, password_hash, name) VALUES (?,?,?)')
                ->execute([$email, $hash, $name !== '' ? $name : 'Administrateur']);
        } catch (Throwable) {
            // BDD absente ou table users manquante — l'install.php reste le chemin initial
        }
    }
}
