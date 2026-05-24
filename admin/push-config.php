<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non authentifié']);
    exit;
}

echo json_encode([
    'success' => true,
    'data' => [
        'enabled' => PushNotifier::isConfigured(),
        'publicKey' => env('VAPID_PUBLIC_KEY', ''),
    ],
], JSON_UNESCAPED_UNICODE);
