<?php

declare(strict_types=1);

/**
 * Installation unique : schéma + seed
 * Accès : http://localhost/donchaminade-développeur-web/install.php
 * Supprimez ce fichier après installation en production.
 */

$root = __DIR__;

if (is_file($root . '/install.php.lock')) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Installation désactivée. Supprimez install.php.lock uniquement pour réinstaller.');
}

require_once $root . '/config/env.php';
loadEnv($root);

$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', '3306');
$user = env('DB_USER', 'root');
$pass = env('DB_PASS', '');
$dbName = env('DB_NAME', 'portfolio_donchaminade');

$messages = [];
$ok = true;

try {
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $schema = file_get_contents($root . '/database/schema.sql');
    if ($schema === false) {
        throw new RuntimeException('Impossible de lire schema.sql');
    }

    $schema = preg_replace('/CREATE DATABASE.*?;/is', '', $schema);
    $schema = preg_replace('/USE\s+[\w`]+;/i', '', $schema);
    $schema = preg_replace('/--[^\n]*\n/', "\n", $schema);

    $pdoDb = new PDO("mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    foreach (array_filter(array_map('trim', explode(';', $schema))) as $statement) {
        if ($statement === '') {
            continue;
        }
        $pdoDb->exec($statement);
    }

    $messages[] = 'Schéma SQL exécuté.';

    foreach (glob($root . '/database/migrations/*.sql') as $migrationFile) {
        $migration = file_get_contents($migrationFile);
        if ($migration === false) {
            continue;
        }
        $migration = preg_replace('/USE\s+[\w`]+;/i', '', $migration);
        $migration = preg_replace('/--[^\n]*\n/', "\n", $migration);
        foreach (array_filter(array_map('trim', explode(';', $migration))) as $statement) {
            if ($statement === '') {
                continue;
            }
            try {
                $pdoDb->exec($statement);
            } catch (PDOException $e) {
                $msg = $e->getMessage();
                if (preg_match('/Duplicate column|Duplicate key name|already exists|Duplicate foreign key/i', $msg)) {
                    continue;
                }
                throw $e;
            }
        }
    }
    $messages[] = 'Migrations appliquées.';

    $seed = require $root . '/database/seed.php';
    $seed($pdoDb);
    $messages[] = 'Données initiales insérées.';

    $messages[] = 'Admin : chaminade.dondah.adjolou@gmail.com (mot de passe défini dans database/seed.php).';

    if (@file_put_contents($root . '/install.php.lock', date('c') . " install OK\n") === false) {
        $messages[] = 'Attention : créez manuellement install.php.lock pour bloquer install.php.';
    } else {
        $messages[] = 'install.php.lock créé — install.php est désormais bloqué.';
    }
} catch (Throwable $e) {
    $ok = false;
    $messages[] = 'Erreur : ' . $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Installation Portfolio</title>
    <style>body{font-family:system-ui;max-width:640px;margin:3rem auto;padding:0 1rem;background:#0f172a;color:#e2e8f0} .ok{color:#4ade80}.err{color:#f87171} li{margin:.5rem 0}</style>
</head>
<body>
    <h1>Installation <?= $ok ? 'réussie' : 'échouée' ?></h1>
    <ul>
        <?php foreach ($messages as $m): ?>
            <li class="<?= $ok ? 'ok' : 'err' ?>"><?= htmlspecialchars($m) ?></li>
        <?php endforeach; ?>
    </ul>
    <?php if ($ok): ?>
        <p><a href="admin/login.php" style="color:#60a5fa">→ Connexion admin</a></p>
        <p><a href="api/index.php?resource=portfolio" style="color:#60a5fa">→ Tester l'API</a></p>
    <?php endif; ?>
</body>
</html>
