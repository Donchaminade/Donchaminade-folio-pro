<?php

declare(strict_types=1);

/**
 * Resynchronise catalogues + migrations.
 * Auth : session admin OU en-tête X-Catalog-Sync-Token = CATALOG_SYNC_TOKEN.
 */

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

$authorized = Auth::check();
$expected = trim((string) env('CATALOG_SYNC_TOKEN', ''));
$provided = trim((string) ($_SERVER['HTTP_X_CATALOG_SYNC_TOKEN'] ?? ($_GET['token'] ?? '')));
if (!$authorized && $expected !== '' && hash_equals($expected, $provided)) {
    $authorized = true;
}

if (!$authorized) {
    Response::error('Non autorisé', 401);
}

try {
    $root = dirname(__DIR__);
    require_once $root . '/database/seed-portfolio.php';

    $migrationLog = [];
    $files = glob($root . '/database/migrations/*.sql') ?: [];
    sort($files);
    $pdo = Database::connection();
    foreach ($files as $file) {
        $sql = file_get_contents($file);
        if ($sql === false) {
            continue;
        }
        $sql = preg_replace('/USE\s+[\w`]+;/i', '', $sql);
        $sql = preg_replace('/--[^\n]*\n/', "\n", $sql);
        foreach (array_filter(array_map('trim', explode(';', (string) $sql))) as $statement) {
            if ($statement === '') {
                continue;
            }
            try {
                $pdo->exec($statement);
                $migrationLog[] = basename($file);
            } catch (PDOException $e) {
                if (!preg_match('/Duplicate column|Duplicate key name|already exists|Duplicate foreign key/i', $e->getMessage())) {
                    throw $e;
                }
            }
        }
    }

    AdminProvisioner::ensureFromEnv();
    $counts = seedPortfolio($pdo);

    Response::json([
        'success' => true,
        'message' => 'Catalogues et migrations appliqués.',
        'data' => [
            'seeds' => $counts,
            'migrations' => array_values(array_unique($migrationLog)),
        ],
    ]);
} catch (Throwable $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Échec de la synchronisation', 500);
}
