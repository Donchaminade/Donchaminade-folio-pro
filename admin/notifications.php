<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non authentifié']);
    exit;
}

$counts = ['comments' => 0, 'testimonials' => 0, 'recommendations' => 0, 'messages' => 0, 'total' => 0];
$items = [];
try {
    (new CommentAuditRepository(Database::connection()))->purgeExpired();
    $notif = new AdminNotifications(Database::connection());
    $counts = $notif->getCounts();
    $items = $notif->getItems();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur serveur']);
    exit;
}

echo json_encode([
    'success' => true,
    'data' => array_merge($counts, [
        'items' => $items,
        'pushEnabled' => PushNotifier::isConfigured(),
    ]),
], JSON_UNESCAPED_UNICODE);
