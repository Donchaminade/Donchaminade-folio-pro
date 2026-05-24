<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::json(['error' => 'Méthode non autorisée'], 405);
}

if (!Csrf::validate($_POST['_csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null)) {
    Response::json(['success' => false, 'error' => 'Session expirée — rechargez la page.'], 403);
}

$category = trim((string) ($_POST['category'] ?? 'blog'));
$fileKey = $_POST['file_key'] ?? 'file';

if (!isset($_FILES[$fileKey])) {
    Response::json(['error' => 'Aucun fichier'], 422);
}

try {
    $path = FileUploader::upload($_FILES[$fileKey], $category);
    Response::json([
        'success' => true,
        'path' => $path,
        'url' => uploadDisplayUrl($path),
    ]);
} catch (Throwable $e) {
    Response::json(['error' => $e->getMessage()], 422);
}
