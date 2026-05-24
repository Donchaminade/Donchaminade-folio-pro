<?php

declare(strict_types=1);

/**
 * Génère une paire de clés VAPID pour les notifications push.
 * CLI : php database/generate-vapid-keys.php
 *
 * Si la librairie PHP échoue (OpenSSL EC sur certains XAMPP Windows),
 * utilisez : npx web-push generate-vapid-keys
 */

$autoload = dirname(__DIR__) . '/vendor/autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
    try {
        $keys = Minishlink\WebPush\VAPID::createVapidKeys();
        printKeys($keys['publicKey'], $keys['privateKey']);
        exit(0);
    } catch (Throwable $e) {
        fwrite(STDERR, "PHP VAPID: " . $e->getMessage() . "\n");
    }
}

$npx = stripos(PHP_OS_FAMILY, 'Windows') === 0 ? 'npx.cmd' : 'npx';
$cmd = escapeshellarg($npx) . ' --yes web-push generate-vapid-keys 2>&1';
$output = shell_exec($cmd);
if (is_string($output) && preg_match('/Public Key:\s*(\S+)/', $output, $pub)
    && preg_match('/Private Key:\s*(\S+)/', $output, $priv)) {
    printKeys($pub[1], $priv[1]);
    exit(0);
}

fwrite(STDERR, "Impossible de générer les clés.\n");
fwrite(STDERR, "1) composer install\n");
fwrite(STDERR, "2) npx web-push generate-vapid-keys\n");
exit(1);

function printKeys(string $public, string $private): void
{
    echo "Ajoutez ces lignes dans votre fichier .env :\n\n";
    echo 'VAPID_PUBLIC_KEY=' . $public . "\n";
    echo 'VAPID_PRIVATE_KEY=' . $private . "\n";
    echo 'VAPID_SUBJECT=mailto:chaminade.dondah.adjolou@gmail.com' . "\n";
}
