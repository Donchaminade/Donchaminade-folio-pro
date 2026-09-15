<?php

declare(strict_types=1);

/**
 * Test CLI de l’email admin.
 * Usage : php scripts/test-notify-email.php
 *         php scripts/test-notify-email.php --dry-run
 */

$root = dirname(__DIR__);
require_once $root . '/bootstrap.php';

if (in_array('--dry-run', $argv ?? [], true)) {
    putenv('NOTIFY_EMAIL_DRY_RUN=true');
    $_ENV['NOTIFY_EMAIL_DRY_RUN'] = 'true';
}

echo "Transport : " . Mailer::transportLabel() . PHP_EOL;
echo "Activé    : " . (Mailer::isEnabled() ? 'oui' : 'non') . PHP_EOL;

try {
    $notif = new AdminNotifications(Database::connection());
    $to = $notif->resolveRecipient();
    echo "Destinataire : " . ($to !== null ? Mailer::maskEmail($to) : '(aucun)') . PHP_EOL;

    $result = $notif->sendNow([
        'event' => 'email_test',
        'title' => 'Test CLI email admin',
        'body' => 'Test depuis scripts/test-notify-email.php',
        'adminPath' => 'index.php',
        'entityKey' => 'email-cli-' . date('YmdHis'),
        'fields' => [
            'Hôte' => gethostname() ?: 'local',
            'Transport' => Mailer::transportLabel(),
        ],
    ]);

    echo ($result['ok'] ? '[OK] ' : '[KO] ') . $result['message'] . PHP_EOL;
    exit($result['ok'] ? 0 : 1);
} catch (Throwable $e) {
    echo '[ERR] ' . $e->getMessage() . PHP_EOL;
    exit(1);
}
