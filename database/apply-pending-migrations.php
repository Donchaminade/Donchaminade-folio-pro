<?php

declare(strict_types=1);

/**
 * Applique les migrations SQL en attente (sans réinstaller tout).
 * CLI : php database/apply-pending-migrations.php
 * Web : http://localhost/.../database/apply-pending-migrations.php (à supprimer en prod)
 */

$root = dirname(__DIR__);
require_once $root . '/config/env.php';
loadEnv($root);

$pdo = new PDO(
    sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', env('DB_HOST'), env('DB_PORT'), env('DB_NAME')),
    env('DB_USER'),
    env('DB_PASS', ''),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$files = glob($root . '/database/migrations/*.sql') ?: [];
sort($files);
$log = [];

foreach ($files as $file) {
    $sql = file_get_contents($file);
    if ($sql === false) {
        continue;
    }
    $sql = preg_replace('/USE\s+[\w`]+;/i', '', $sql);
    $sql = preg_replace('/--[^\n]*\n/', "\n", $sql);
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        if ($statement === '') {
            continue;
        }
        try {
            $pdo->exec($statement);
            $log[] = '[OK] ' . basename($file) . ' : ' . substr($statement, 0, 60) . '…';
        } catch (PDOException $e) {
            if (preg_match('/Duplicate column|Duplicate key name|already exists|Duplicate foreign key/i', $e->getMessage())) {
                $log[] = '[SKIP] ' . basename($file) . ' (déjà appliqué)';
            } else {
                $log[] = '[ERR] ' . basename($file) . ' : ' . $e->getMessage();
            }
        }
    }
}

if (PHP_SAPI === 'cli') {
    echo implode(PHP_EOL, $log) . PHP_EOL;
} else {
    header('Content-Type: text/plain; charset=utf-8');
    echo implode("\n", $log);
}
