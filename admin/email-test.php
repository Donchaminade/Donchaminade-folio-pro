<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non authentifié']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

try {
    $notif = new AdminNotifications(Database::connection());
    $result = $notif->sendNow([
        'event' => 'email_test',
        'title' => 'Test email admin',
        'body' => 'Si vous lisez ceci, le transport email du portfolio fonctionne.',
        'adminPath' => 'index.php',
        'entityKey' => 'email-test-' . date('YmdHis'),
        'fields' => [
            'Transport' => Mailer::transportLabel(),
            'Date' => date('c'),
        ],
    ]);

    echo json_encode([
        'success' => $result['ok'],
        'message' => $result['message'],
        'skipped' => $result['skipped'],
        'recipient' => $result['recipient'] !== null ? Mailer::maskEmail($result['recipient']) : null,
        'transport' => Mailer::transportLabel(),
        'enabled' => Mailer::isEnabled(),
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
