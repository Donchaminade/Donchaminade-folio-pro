<?php

declare(strict_types=1);

/**
 * Données initiales — catalogues dans database/catalog/
 * Exécuté par install.php (retourne une closure).
 * CLI direct : php database/apply-all-seeds.php
 */

return function (PDO $db): void {
    require_once __DIR__ . '/seed-portfolio.php';
    seedPortfolio($db);
};
