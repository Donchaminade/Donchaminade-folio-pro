<?php

declare(strict_types=1);

/**
 * Applique tous les seeds sur une BDD existante (déploiement / resync).
 * CLI : php database/apply-all-seeds.php
 */

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/seed-portfolio.php';

$db = Database::connection();
$counts = seedPortfolio($db);

echo "=== Seeds appliqués ===\n";
foreach ($counts as $key => $value) {
    echo "{$key}: {$value}\n";
}

echo "\nPrêt pour le déploiement.\n";
