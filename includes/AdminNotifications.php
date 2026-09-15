<?php

declare(strict_types=1);

/**
 * Compteurs admin / PWA + notifications (push + email) pour les événements publics.
 */
final class AdminNotifications
{
    private const SESSION_KEY = 'admin_seen_at';

    public function __construct(private readonly PDO $db) {}

    public function markSeen(string $type): void
    {
        Auth::startSession();
        $_SESSION[self::SESSION_KEY] ??= [];
        $_SESSION[self::SESSION_KEY][$type] = time();
    }

    /** @return array{comments:int,testimonials:int,recommendations:int,messages:int,total:int} */
    public function getCounts(): array
    {
        Auth::startSession();
        $seen = $_SESSION[self::SESSION_KEY] ?? [];

        $comments = $this->countSince(
            "SELECT COUNT(*) FROM blog_comments WHERE author_role = 'visitor' AND created_at > FROM_UNIXTIME(?)",
            (int) ($seen['comments'] ?? 0)
        );

        $testimonials = (int) $this->db->query(
            'SELECT COUNT(*) FROM testimonials WHERE is_approved = 0'
        )->fetchColumn();

        $recommendations = $this->countSince(
            'SELECT COUNT(*) FROM recommendations WHERE is_hidden = 0 AND created_at > FROM_UNIXTIME(?)',
            (int) ($seen['recommendations'] ?? 0)
        );

        $messages = (int) $this->db->query(
            'SELECT COUNT(*) FROM contact_messages WHERE is_read = 0'
        )->fetchColumn();

        return [
            'comments' => $comments,
            'testimonials' => $testimonials,
            'recommendations' => $recommendations,
            'messages' => $messages,
            'total' => $comments + $testimonials + $recommendations + $messages,
        ];
    }

    private function countSince(string $sql, int $sinceUnix): int
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$sinceUnix]);

        return (int) $stmt->fetchColumn();
    }

    /** @return list<array{type:string,label:string,href:string,count:int}> */
    public function getItems(): array
    {
        $counts = $this->getCounts();
        $items = [];

        if ($counts['comments'] > 0) {
            $items[] = ['type' => 'comments', 'label' => 'Commentaires blog', 'href' => 'blog-comments.php', 'count' => $counts['comments']];
        }
        if ($counts['testimonials'] > 0) {
            $items[] = ['type' => 'testimonials', 'label' => 'Témoignages à valider', 'href' => 'testimonials.php?filter=pending', 'count' => $counts['testimonials']];
        }
        if ($counts['recommendations'] > 0) {
            $items[] = ['type' => 'recommendations', 'label' => 'Nouvelles recommandations', 'href' => 'recommendations.php', 'count' => $counts['recommendations']];
        }
        if ($counts['messages'] > 0) {
            $items[] = ['type' => 'messages', 'label' => 'Messages non lus', 'href' => 'messages.php', 'count' => $counts['messages']];
        }

        return $items;
    }

    public static function markSeenForPage(string $activeFile): void
    {
        $map = [
            'blog-comments.php' => 'comments',
            'testimonials.php' => 'testimonials',
            'recommendations.php' => 'recommendations',
            'messages.php' => 'messages',
        ];
        if (!isset($map[$activeFile])) {
            return;
        }
        try {
            (new self(Database::connection()))->markSeen($map[$activeFile]);
        } catch (Throwable) {
            // ignore
        }
    }

    public static function adminUrl(string $adminPath = 'index.php'): string
    {
        $base = rtrim((string) env('APP_URL', ''), '/');

        return $base . '/admin/' . ltrim($adminPath, '/');
    }

    public static function isValidEmail(?string $email): bool
    {
        $email = trim((string) $email);

        return $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Destinataire : NOTIFY_EMAIL → ADMIN_EMAIL → users.email → site_profile.email
     */
    public function resolveRecipient(): ?string
    {
        foreach ([env('NOTIFY_EMAIL'), env('ADMIN_EMAIL')] as $candidate) {
            if (self::isValidEmail($candidate)) {
                return trim((string) $candidate);
            }
        }

        try {
            $admin = $this->db->query('SELECT email FROM users ORDER BY id ASC LIMIT 1')->fetchColumn();
            if (self::isValidEmail(is_string($admin) ? $admin : null)) {
                return trim((string) $admin);
            }
        } catch (Throwable) {
            // table absente
        }

        try {
            $profile = $this->db->query(
                'SELECT email FROM site_profile WHERE is_active = 1 ORDER BY id DESC LIMIT 1'
            )->fetchColumn();
            if (self::isValidEmail(is_string($profile) ? $profile : null)) {
                return trim((string) $profile);
            }
        } catch (Throwable) {
            // table absente
        }

        return null;
    }

    /**
     * @param array<string, string> $fields
     * @return array{subject:string, text:string, html:string}
     */
    public static function buildEmailContent(
        string $title,
        string $body,
        string $adminPath,
        array $fields = []
    ): array {
        $subject = '[Portfolio] ' . trim($title);
        $adminUrl = self::adminUrl($adminPath);
        $safeFields = [];
        foreach ($fields as $label => $value) {
            $trimmed = trim((string) $value);
            if ($trimmed === '') {
                continue;
            }
            $safeFields[(string) $label] = $trimmed;
        }

        $textLines = [
            $title,
            '',
            $body,
            '',
        ];
        foreach ($safeFields as $label => $value) {
            $textLines[] = $label . ' : ' . $value;
        }
        $textLines[] = '';
        $textLines[] = 'Ouvrir l’admin : ' . $adminUrl;
        $textLines[] = '';
        $textLines[] = '— Notification automatique du portfolio';

        $rowsHtml = '';
        foreach ($safeFields as $label => $value) {
            $rowsHtml .= '<tr>'
                . '<td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:140px;vertical-align:top;">'
                . htmlspecialchars((string) $label, ENT_QUOTES, 'UTF-8')
                . '</td>'
                . '<td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;white-space:pre-wrap;">'
                . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'))
                . '</td></tr>';
        }

        $html = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>'
            . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8')
            . '</title></head><body style="margin:0;padding:24px;background:#f8fafc;font-family:Inter,system-ui,sans-serif;color:#0f172a;">'
            . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">'
            . '<tr><td style="padding:20px 24px;background:#0f172a;color:#fff;">'
            . '<div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.7;">Portfolio</div>'
            . '<h1 style="margin:8px 0 0;font-size:20px;line-height:1.3;">'
            . htmlspecialchars($title, ENT_QUOTES, 'UTF-8')
            . '</h1></td></tr>'
            . '<tr><td style="padding:24px;">'
            . '<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">'
            . nl2br(htmlspecialchars($body, ENT_QUOTES, 'UTF-8'))
            . '</p>'
            . ($rowsHtml !== ''
                ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:collapse;">'
                    . $rowsHtml . '</table>'
                : '')
            . '<p style="margin:24px 0 0;"><a href="'
            . htmlspecialchars($adminUrl, ENT_QUOTES, 'UTF-8')
            . '" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700;">Ouvrir l’admin</a></p>'
            . '<p style="margin:16px 0 0;font-size:12px;color:#64748b;word-break:break-all;">'
            . htmlspecialchars($adminUrl, ENT_QUOTES, 'UTF-8')
            . '</p>'
            . '</td></tr></table></body></html>';

        return [
            'subject' => $subject,
            'text' => implode("\n", $textLines),
            'html' => $html,
        ];
    }

    /**
     * Push (immédiat) + email (après la réponse HTTP si possible).
     * Ne fait jamais échouer l’API publique.
     *
     * @param array{
     *   event: string,
     *   title: string,
     *   body: string,
     *   adminPath?: string,
     *   entityKey?: string,
     *   fields?: array<string, string>,
     *   replyTo?: string|null
     * } $payload
     */
    public static function notifyAdmins(array $payload): void
    {
        $title = trim((string) ($payload['title'] ?? 'Notification'));
        $body = trim((string) ($payload['body'] ?? ''));
        $adminPath = (string) ($payload['adminPath'] ?? 'index.php');

        try {
            PushNotifier::notifyAdmins($title, $body, $adminPath);
        } catch (Throwable) {
            // push optionnel
        }

        $send = static function () use ($payload, $title, $body, $adminPath): void {
            try {
                (new self(Database::connection()))->dispatchEmail($payload, $title, $body, $adminPath);
            } catch (Throwable $e) {
                error_log('[notify-email] ' . $e->getMessage());
            }
        };

        register_shutdown_function($send);
    }

    /**
     * Envoi synchrone (tests CLI / bouton admin).
     *
     * @param array{
     *   event?: string,
     *   title: string,
     *   body: string,
     *   adminPath?: string,
     *   entityKey?: string,
     *   fields?: array<string, string>,
     *   replyTo?: string|null
     * } $payload
     * @return array{ok:bool, message:string, recipient:?string, skipped:bool}
     */
    public function sendNow(array $payload): array
    {
        $title = trim((string) ($payload['title'] ?? 'Notification'));
        $body = trim((string) ($payload['body'] ?? ''));
        $adminPath = (string) ($payload['adminPath'] ?? 'index.php');

        return $this->dispatchEmail($payload, $title, $body, $adminPath);
    }

    /**
     * @param array<string, mixed> $payload
     * @return array{ok:bool, message:string, recipient:?string, skipped:bool}
     */
    private function dispatchEmail(array $payload, string $title, string $body, string $adminPath): array
    {
        if (!Mailer::isEnabled()) {
            return [
                'ok' => false,
                'skipped' => true,
                'recipient' => null,
                'message' => 'Emails désactivés ou aucun transport (SMTP / mail) configuré.',
            ];
        }

        $recipient = $this->resolveRecipient();
        if ($recipient === null) {
            error_log('[notify-email] aucun destinataire (NOTIFY_EMAIL / ADMIN_EMAIL / profil)');
            return [
                'ok' => false,
                'skipped' => true,
                'recipient' => null,
                'message' => 'Aucun destinataire : définissez NOTIFY_EMAIL ou ADMIN_EMAIL.',
            ];
        }

        $event = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($payload['event'] ?? 'event')) ?: 'event';
        $entityKey = trim((string) ($payload['entityKey'] ?? ''));
        if ($entityKey !== '' && !$this->claimSend($event, $entityKey, $recipient, $title)) {
            return [
                'ok' => true,
                'skipped' => true,
                'recipient' => $recipient,
                'message' => 'Déjà notifié pour cet événement.',
            ];
        }

        $fields = [];
        if (isset($payload['fields']) && is_array($payload['fields'])) {
            foreach ($payload['fields'] as $label => $value) {
                $fields[(string) $label] = mb_substr(trim((string) $value), 0, 4000);
            }
        }

        $content = self::buildEmailContent($title, $body, $adminPath, $fields);
        $replyTo = isset($payload['replyTo']) ? (string) $payload['replyTo'] : null;
        if ($replyTo !== null && !self::isValidEmail($replyTo)) {
            $replyTo = null;
        }

        $ok = Mailer::send($recipient, $content['subject'], $content['text'], $content['html'], $replyTo);
        if (!$ok) {
            $this->releaseClaim($event, $entityKey);
            error_log('[notify-email] envoi échoué event=' . $event);
            return [
                'ok' => false,
                'skipped' => false,
                'recipient' => $recipient,
                'message' => 'Échec d’envoi (voir logs PHP). L’API publique n’est pas impactée.',
            ];
        }

        if ($entityKey !== '') {
            $this->storeSubject($event, $entityKey, $content['subject']);
        }

        return [
            'ok' => true,
            'skipped' => false,
            'recipient' => $recipient,
            'message' => 'Email envoyé à ' . Mailer::maskEmail($recipient) . '.',
        ];
    }

    private function claimSend(string $event, string $entityKey, string $recipient, string $title): bool
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO admin_email_log (event_type, entity_key, recipient, subject) VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([$event, $entityKey, $recipient, mb_substr($title, 0, 255)]);

            return true;
        } catch (PDOException $e) {
            if (stripos($e->getMessage(), 'Duplicate') !== false) {
                return false;
            }
            // table absente : on envoie quand même
            error_log('[notify-email] journal indisponible (appliquez la migration 015)');
            return true;
        }
    }

    private function releaseClaim(string $event, string $entityKey): void
    {
        if ($entityKey === '') {
            return;
        }
        try {
            $this->db->prepare('DELETE FROM admin_email_log WHERE event_type = ? AND entity_key = ?')
                ->execute([$event, $entityKey]);
        } catch (Throwable) {
            // ignore
        }
    }

    private function storeSubject(string $event, string $entityKey, string $subject): void
    {
        try {
            $this->db->prepare(
                'UPDATE admin_email_log SET subject = ? WHERE event_type = ? AND entity_key = ?'
            )->execute([mb_substr($subject, 0, 255), $event, $entityKey]);
        } catch (Throwable) {
            // ignore
        }
    }
}
