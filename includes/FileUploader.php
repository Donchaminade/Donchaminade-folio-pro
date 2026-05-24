<?php

declare(strict_types=1);

final class FileUploader
{
    private const MAX_IMAGE_BYTES = 5_242_880; // 5 Mo
    private const MAX_PDF_BYTES = 10_485_760; // 10 Mo
    private const MAX_COLLAB_BYTES = 12_582_912; // 12 Mo
    private const MAX_COLLAB_FILES = 8;

    /** @var array<string, list<string>> */
    private const MIME_BY_CATEGORY = [
        'blog' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'projects' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'profile' => ['image/jpeg', 'image/png', 'image/webp'],
        'documents' => ['application/pdf'],
        'gallery' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'technologies' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        'testimonials' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'communities' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'collaboration' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ],
    ];

    /** @var array<string, string> extension autorisée par MIME */
    private const EXT_BY_MIME = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
        'image/svg+xml' => 'svg',
        'application/pdf' => 'pdf',
        'application/msword' => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/vnd.ms-powerpoint' => 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
        'application/vnd.ms-excel' => 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
    ];

    public static function upload(array $file, string $category): string
    {
        return self::processUpload($file, $category);
    }

    /**
     * @return list<array{path: string, original_name: string, mime: string, size: int}>
     */
    public static function uploadCollaborationBatch(array $files): array
    {
        if (count($files) > self::MAX_COLLAB_FILES) {
            throw new RuntimeException('Maximum ' . self::MAX_COLLAB_FILES . ' fichiers.');
        }

        $saved = [];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        foreach ($files as $file) {
            $path = self::processUpload($file, 'collaboration');
            $full = rootPath() . '/public' . $path;
            $mime = is_file($full) ? ($finfo->file($full) ?: 'application/octet-stream') : 'application/octet-stream';
            $saved[] = [
                'path' => $path,
                'original_name' => self::sanitizeFilename((string) ($file['name'] ?? 'fichier')),
                'mime' => $mime,
                'size' => (int) ($file['size'] ?? 0),
            ];
        }

        return $saved;
    }

    private static function processUpload(array $file, string $category): string
    {
        if (!isset(self::MIME_BY_CATEGORY[$category])) {
            throw new InvalidArgumentException('Catégorie invalide.');
        }

        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new RuntimeException(self::uploadErrorMessage((int) ($file['error'] ?? 0)));
        }

        $tmp = $file['tmp_name'] ?? '';
        if ($tmp === '' || !is_uploaded_file($tmp)) {
            throw new RuntimeException('Fichier invalide.');
        }

        $originalName = (string) ($file['name'] ?? '');
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmp) ?: '';
        $allowed = self::MIME_BY_CATEGORY[$category];

        if (!in_array($mime, $allowed, true)) {
            $mime = self::guessMimeFromExtension($originalName) ?? $mime;
        }

        if (!in_array($mime, $allowed, true)) {
            throw new RuntimeException('Type de fichier non autorisé : ' . self::sanitizeFilename($originalName));
        }

        $maxSize = match ($category) {
            'documents' => self::MAX_PDF_BYTES,
            'collaboration' => self::MAX_COLLAB_BYTES,
            default => self::MAX_IMAGE_BYTES,
        };
        if (($file['size'] ?? 0) > $maxSize) {
            throw new RuntimeException('Fichier trop volumineux (max ' . (int) ($maxSize / 1_048_576) . ' Mo).');
        }

        $ext = self::EXT_BY_MIME[$mime] ?? self::safeExtensionFromName($originalName) ?? 'bin';

        $dir = rootPath() . '/public/uploads/' . $category;
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            throw new RuntimeException('Impossible de créer le dossier uploads.');
        }

        $name = bin2hex(random_bytes(8)) . '_' . time() . '.' . $ext;
        $dest = $dir . '/' . $name;

        if (!move_uploaded_file($tmp, $dest)) {
            throw new RuntimeException('Échec de l\'enregistrement du fichier.');
        }

        return '/uploads/' . $category . '/' . $name;
    }

    public static function deleteIfLocal(?string $path): void
    {
        if ($path === null || $path === '' || str_starts_with($path, 'http')) {
            return;
        }

        $full = rootPath() . '/public' . (str_starts_with($path, '/') ? $path : '/' . $path);
        if (is_file($full)) {
            unlink($full);
        }
    }

    public static function sanitizeFilename(string $name): string
    {
        $name = basename($name);
        $name = preg_replace('/[^\w.\- ()\[\]]+/u', '_', $name) ?? 'fichier';

        return $name !== '' ? $name : 'fichier';
    }

    private static function guessMimeFromExtension(string $filename): ?string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return match ($ext) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => null,
        };
    }

    private static function safeExtensionFromName(string $filename): ?string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp', 'gif'];

        return in_array($ext, $allowed, true) ? ($ext === 'jpeg' ? 'jpg' : $ext) : null;
    }

    private static function uploadErrorMessage(int $code): string
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux.',
            UPLOAD_ERR_PARTIAL => 'Téléversement incomplet.',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier sélectionné.',
            default => 'Erreur lors du téléversement.',
        };
    }
}
