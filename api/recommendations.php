<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $repo = new RecommendationRepository(Database::connection());
} catch (PDOException $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Service indisponible', 503);
}

if ($method === 'GET') {
    Response::json([
        'success' => true,
        'data' => $repo->listPublic(),
    ]);
}

if ($method !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    $input = $_POST;
}

$name = trim((string) ($input['name'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$role = trim((string) ($input['role'] ?? ''));
$company = trim((string) ($input['company'] ?? ''));
$body = trim((string) ($input['body'] ?? ''));
$rating = (int) ($input['rating'] ?? 0);

if ($name === '' || $body === '') {
    Response::error('Nom et message de recommandation sont obligatoires.', 422);
}
if (strlen($body) < 30) {
    Response::error('Votre recommandation doit contenir au moins 30 caractères.', 422);
}
if ($rating < 1 || $rating > 5) {
    Response::error('Veuillez choisir une note entre 1 et 5 étoiles.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Adresse email invalide.', 422);
}

// Anti-spam simple
$honeypot = trim((string) ($input['website'] ?? ''));
if ($honeypot !== '') {
    Response::json(['success' => true, 'message' => 'Merci pour votre recommandation !']);
}

try {
    $id = $repo->create(
        [
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'company' => $company,
            'body' => $body,
            'rating' => $rating,
        ],
        captureVisitorMeta()
    );
} catch (Throwable $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Impossible d\'enregistrer la recommandation.', 500);
}

PushNotifier::notifyAdmins(
    'Nouvelle recommandation',
    $name . ' vous a recommandé (' . $rating . '/5 ★).',
    'recommendations.php'
);

Response::json([
    'success' => true,
    'message' => 'Merci ! Votre recommandation a été publiée.',
    'data' => ['id' => $id],
]);
