<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

$isMultipart = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
$input = $isMultipart ? $_POST : (json_decode(file_get_contents('php://input') ?: '', true) ?: []);

$honeypot = trim((string) ($input['website'] ?? ''));
if ($honeypot !== '') {
    Response::json([
        'success' => true,
        'message' => 'Merci ! Votre témoignage sera publié après validation.',
    ]);
}

$quote = trim((string) ($input['quote'] ?? ''));
$name = trim((string) ($input['name'] ?? ''));
$role = trim((string) ($input['role'] ?? ''));
$company = trim((string) ($input['company'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));

if ($quote === '' || $name === '') {
    Response::error('Citation et nom sont obligatoires.', 422);
}
if (strlen($quote) < 30) {
    Response::error('Votre témoignage doit contenir au moins 30 caractères.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Adresse email invalide.', 422);
}

$imagePath = null;
if ($isMultipart && !empty($_FILES['image_file']['name'])) {
    try {
        $imagePath = FileUploader::upload($_FILES['image_file'], 'testimonials');
    } catch (RuntimeException $e) {
        Response::error($e->getMessage(), 422);
    }
}

try {
    $repo = new TestimonialRepository(Database::connection());
    $id = $repo->createVisitor(
        [
            'quote' => $quote,
            'name' => $name,
            'role' => $role,
            'company' => $company,
            'email' => $email,
            'image' => $imagePath,
        ],
        captureVisitorMeta()
    );
} catch (PDOException $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Service indisponible', 503);
}

PushNotifier::notifyAdmins(
    'Nouveau témoignage',
    $name . ' a laissé un témoignage à valider.',
    'testimonials.php?filter=pending'
);

Response::json([
    'success' => true,
    'message' => 'Merci ! Votre témoignage sera visible après validation par l\'administrateur.',
    'data' => ['id' => $id],
]);
