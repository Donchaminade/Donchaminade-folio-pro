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

if (!PushNotifier::isConfigured()) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error' => 'Clés VAPID manquantes dans .env (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).',
    ]);
    exit;
}

try {
    $db = Database::connection();
    $count = (int) $db->query('SELECT COUNT(*) FROM push_subscriptions')->fetchColumn();

    PushNotifier::notifyAdmins(
        'Test Donchaminade',
        'Les notifications push fonctionnent sur cet appareil.',
        'index.php'
    );

    echo json_encode([
        'success' => true,
        'message' => $count > 0
            ? "Notification de test envoyée à {$count} appareil(s)."
            : 'Aucun appareil abonné : activez les notifications push sur votre téléphone d\'abord.',
        'subscriptions' => $count,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
