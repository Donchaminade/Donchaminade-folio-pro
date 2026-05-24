<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = str_contains($contentType, 'multipart/form-data');

if ($isMultipart) {
    $input = $_POST;
} else {
    $input = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($input)) {
        $input = $_POST;
    }
}

$type = trim((string) ($input['type'] ?? 'contact'));
$audit = captureVisitorMeta();

try {
    $repo = new ContactRepository(Database::connection());
} catch (PDOException $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Service indisponible', 503);
}

if ($type === 'collaboration') {
    $name = trim((string) ($input['name'] ?? ''));
    $email = trim((string) ($input['email'] ?? ''));
    $brief = trim((string) ($input['collaboration_brief'] ?? ''));
    $subject = trim((string) ($input['subject'] ?? ''));
    $phone = trim((string) ($input['phone'] ?? ''));
    $company = trim((string) ($input['company'] ?? ''));
    $hasDocuments = in_array($input['has_documents'] ?? false, [true, 1, '1', 'true', 'on'], true);
    $documentsDetails = trim((string) ($input['documents_details'] ?? ''));
    $meetingPlatform = trim((string) ($input['meeting_platform'] ?? ''));
    $meetingSlots = trim((string) ($input['meeting_slots'] ?? ''));
    $meetingNotes = trim((string) ($input['meeting_notes'] ?? ''));

    if ($name === '' || $email === '' || $brief === '') {
        Response::error('Nom, email et description du projet sont obligatoires.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error('Adresse email invalide.', 422);
    }
    if (strlen($brief) < 20) {
        Response::error('Décrivez un peu plus votre projet (min. 20 caractères).', 422);
    }

    $uploadedFiles = $isMultipart ? normalizeUploadedFiles('documents') : [];
    if ($hasDocuments && $uploadedFiles === [] && $documentsDetails === '') {
        Response::error('Ajoutez au moins un fichier ou précisez vos documents dans le champ texte.', 422);
    }

    $allowedPlatforms = ['google_meet', 'zoom', 'teams', 'phone', 'whatsapp', 'other', ''];
    if ($meetingPlatform !== '' && !in_array($meetingPlatform, $allowedPlatforms, true)) {
        Response::error('Plateforme de visio invalide.', 422);
    }

    try {
        $messageId = $repo->createCollaboration([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'company' => $company,
            'subject' => $subject,
            'collaboration_brief' => $brief,
            'has_documents' => $hasDocuments || $uploadedFiles !== [],
            'documents_details' => $documentsDetails,
            'meeting_platform' => $meetingPlatform,
            'meeting_slots' => $meetingSlots,
            'meeting_notes' => $meetingNotes,
        ], $audit);

        if ($uploadedFiles !== []) {
            $saved = FileUploader::uploadCollaborationBatch($uploadedFiles);
            $repo->attachFiles($messageId, $saved);
        }
    } catch (RuntimeException $e) {
        Response::error($e->getMessage(), 422);
    }

    PushNotifier::notifyAdmins(
        'Demande Collaborons',
        $name . ' a envoyé une demande de collaboration.',
        'messages.php'
    );

    Response::json([
        'success' => true,
        'message' => 'Merci ! Votre demande et vos fichiers ont bien été reçus. Je vous recontacte rapidement.',
    ]);
}

// Contact simple
$name = trim((string) ($input['name'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    Response::error('Tous les champs sont obligatoires.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Adresse email invalide.', 422);
}
if (strlen($message) < 10) {
    Response::error('Message trop court.', 422);
}

$repo->createContact($name, $email, $message, $audit);

PushNotifier::notifyAdmins(
    'Nouveau message',
    $name . ' vous a écrit via le formulaire contact.',
    'messages.php'
);

Response::json(['success' => true, 'message' => 'Message enregistré. Je vous réponds très bientôt.']);
