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

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'JSON invalide']);
    exit;
}

$action = (string) ($input['action'] ?? 'subscribe');
$user = Auth::user();

try {
    $notifier = new PushNotifier(Database::connection());
    if ($action === 'unsubscribe') {
        $endpoint = (string) ($input['endpoint'] ?? '');
        if ($endpoint !== '') {
            $notifier->removeSubscription($endpoint);
        }
        echo json_encode(['success' => true, 'message' => 'Notifications désactivées.']);
        exit;
    }

    if (!PushNotifier::isConfigured()) {
        http_response_code(503);
        echo json_encode(['success' => false, 'error' => 'Push non configuré sur le serveur (clés VAPID manquantes).']);
        exit;
    }

    $notifier->saveSubscription($input, $user['id'] ?? null);
    echo json_encode(['success' => true, 'message' => 'Notifications push activées sur cet appareil.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
