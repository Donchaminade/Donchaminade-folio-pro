<?php

declare(strict_types=1);

/**
 * Envoi d’emails transactionnels : SMTP Hostinger en priorité, sinon mail().
 * Aucun secret n’est journalisé.
 */
final class Mailer
{
    public static function envFlag(string $key, bool $default): bool
    {
        $raw = env($key, null);
        if ($raw === null || $raw === '') {
            return $default;
        }

        $value = strtolower(trim($raw));

        if (in_array($value, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }
        if (in_array($value, ['0', 'false', 'no', 'off'], true)) {
            return false;
        }

        return $default;
    }

    public static function isSmtpConfigured(): bool
    {
        return trim((string) env('SMTP_HOST', '')) !== ''
            && trim((string) env('SMTP_USER', '')) !== ''
            && (string) env('SMTP_PASS', '') !== '';
    }

    public static function isMailFallbackEnabled(): bool
    {
        return self::envFlag('MAIL_FALLBACK', true);
    }

    public static function isConfigured(): bool
    {
        return self::isSmtpConfigured() || self::isMailFallbackEnabled();
    }

    /**
     * Activé par défaut dès qu’un transport (SMTP ou mail()) est disponible.
     * NOTIFY_EMAIL_ENABLED=false désactive tout envoi.
     */
    public static function isEnabled(): bool
    {
        if (!self::envFlag('NOTIFY_EMAIL_ENABLED', true)) {
            return false;
        }

        return self::isConfigured();
    }

    public static function isDryRun(): bool
    {
        return self::envFlag('NOTIFY_EMAIL_DRY_RUN', false);
    }

    public static function transportLabel(): string
    {
        if (!self::isEnabled()) {
            return 'off';
        }
        if (self::isDryRun()) {
            return 'dry-run';
        }
        if (self::isSmtpConfigured()) {
            return 'smtp';
        }
        if (self::isMailFallbackEnabled()) {
            return 'mail';
        }

        return 'none';
    }

    public static function fromAddress(): string
    {
        $from = trim((string) env('SMTP_FROM', ''));
        if (filter_var($from, FILTER_VALIDATE_EMAIL)) {
            return $from;
        }
        $user = trim((string) env('SMTP_USER', ''));
        if (filter_var($user, FILTER_VALIDATE_EMAIL)) {
            return $user;
        }

        $host = parse_url((string) env('APP_URL', ''), PHP_URL_HOST);
        if (is_string($host) && $host !== '') {
            return 'noreply@' . $host;
        }

        return 'noreply@localhost';
    }

    public static function fromName(): string
    {
        $name = trim((string) env('SMTP_FROM_NAME', ''));

        return $name !== '' ? $name : 'Portfolio Donchaminade';
    }

    /**
     * @return array{headers:string, body:string, raw:string}
     */
    public static function buildMimeMessage(
        string $to,
        string $subject,
        string $text,
        string $html,
        ?string $replyTo = null
    ): array {
        $from = self::fromAddress();
        $fromName = self::fromName();
        $boundary = 'b1_' . bin2hex(random_bytes(12));
        $encodedSubject = self::encodeHeader($subject);
        $date = date('r');
        $messageId = sprintf('<%s@%s>', bin2hex(random_bytes(8)), self::messageIdHost());

        $headers = [
            'Date: ' . $date,
            'From: ' . self::formatAddress($from, $fromName),
            'To: ' . $to,
            'Subject: ' . $encodedSubject,
            'Message-ID: ' . $messageId,
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
            'X-Mailer: Donchaminade-folio',
        ];
        if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $headers[] = 'Reply-To: ' . $replyTo;
        }

        $headerBlock = implode("\r\n", $headers);
        $body = implode("\r\n", [
            '--' . $boundary,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($text), 76, "\r\n"),
            '--' . $boundary,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($html), 76, "\r\n"),
            '--' . $boundary . '--',
            '',
        ]);

        return [
            'headers' => $headerBlock,
            'body' => $body,
            'raw' => $headerBlock . "\r\n\r\n" . $body,
        ];
    }

    /**
     * Envoie un email. Ne lève pas : retourne false et journalise.
     */
    public static function send(
        string $to,
        string $subject,
        string $text,
        string $html,
        ?string $replyTo = null
    ): bool {
        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            error_log('[notify-email] destinataire invalide');
            return false;
        }

        $mime = self::buildMimeMessage($to, $subject, $text, $html, $replyTo);

        if (self::isDryRun()) {
            error_log('[notify-email] dry-run to=' . self::maskEmail($to) . ' subject=' . $subject);
            return true;
        }

        try {
            if (self::isSmtpConfigured()) {
                return self::sendSmtp($to, $mime['raw']);
            }
            if (self::isMailFallbackEnabled()) {
                return self::sendPhpMail($to, $subject, $mime);
            }
        } catch (Throwable $e) {
            error_log('[notify-email] échec envoi : ' . $e->getMessage());
            return false;
        }

        error_log('[notify-email] aucun transport configuré');
        return false;
    }

    public static function maskEmail(string $email): string
    {
        if (!str_contains($email, '@')) {
            return '***';
        }
        [$local, $domain] = explode('@', $email, 2);
        $keep = max(1, (int) floor(strlen($local) / 3));

        return substr($local, 0, $keep) . '***@' . $domain;
    }

    public static function encodeHeader(string $value): string
    {
        if ($value === '' || preg_match('/^[\x20-\x7E]*$/', $value) === 1) {
            return $value;
        }

        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    private static function formatAddress(string $email, string $name): string
    {
        if ($name === '') {
            return $email;
        }

        return self::encodeHeader($name) . ' <' . $email . '>';
    }

    private static function messageIdHost(): string
    {
        $host = parse_url((string) env('APP_URL', ''), PHP_URL_HOST);

        return is_string($host) && $host !== '' ? $host : 'localhost';
    }

    /**
     * @param array{headers:string, body:string, raw:string} $mime
     */
    private static function sendPhpMail(string $to, string $subject, array $mime): bool
    {
        $extra = preg_replace('/^To:.*\r\n/m', '', $mime['headers']) ?? $mime['headers'];
        $extra = preg_replace('/^Subject:.*\r\n/m', '', $extra) ?? $extra;
        $ok = @mail($to, self::encodeHeader($subject), $mime['body'], $extra);
        if (!$ok) {
            error_log('[notify-email] mail() a échoué');
        }

        return (bool) $ok;
    }

    private static function sendSmtp(string $to, string $rawMessage): bool
    {
        $host = trim((string) env('SMTP_HOST', ''));
        $port = (int) env('SMTP_PORT', '587');
        if ($port <= 0) {
            $port = 587;
        }
        $user = (string) env('SMTP_USER', '');
        $pass = (string) env('SMTP_PASS', '');
        $secure = strtolower(trim((string) env('SMTP_SECURE', '')));
        if ($secure === '') {
            $secure = $port === 465 ? 'ssl' : ($port === 587 ? 'tls' : 'none');
        }
        $timeout = max(3, (int) env('SMTP_TIMEOUT', '12'));
        $from = self::fromAddress();

        $remote = $host . ':' . $port;
        if ($secure === 'ssl') {
            $remote = 'ssl://' . $host . ':' . $port;
        }

        $errno = 0;
        $errstr = '';
        $fp = @stream_socket_client(
            $remote,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT
        );
        if ($fp === false) {
            throw new RuntimeException('Connexion SMTP impossible (' . $errno . ')');
        }

        stream_set_timeout($fp, $timeout);

        try {
            self::expect($fp, [220]);
            self::command($fp, 'EHLO ' . self::smtpEhloHost(), [250]);

            if ($secure === 'tls' || $secure === 'starttls') {
                self::command($fp, 'STARTTLS', [220]);
                if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    throw new RuntimeException('STARTTLS a échoué');
                }
                self::command($fp, 'EHLO ' . self::smtpEhloHost(), [250]);
            }

            self::command($fp, 'AUTH LOGIN', [334]);
            self::command($fp, base64_encode($user), [334]);
            self::command($fp, base64_encode($pass), [235]);
            self::command($fp, 'MAIL FROM:<' . $from . '>', [250]);
            self::command($fp, 'RCPT TO:<' . $to . '>', [250, 251]);
            self::command($fp, 'DATA', [354]);

            $normalized = preg_replace("/\r\n|\n|\r/", "\r\n", $rawMessage) ?? $rawMessage;
            $normalized = preg_replace("/^\./m", '..', $normalized) ?? $normalized;
            fwrite($fp, $normalized);
            if (!str_ends_with($normalized, "\r\n")) {
                fwrite($fp, "\r\n");
            }
            self::command($fp, '.', [250]);
            self::command($fp, 'QUIT', [221, 250]);
        } finally {
            fclose($fp);
        }

        return true;
    }

    private static function smtpEhloHost(): string
    {
        $host = parse_url((string) env('APP_URL', ''), PHP_URL_HOST);

        return is_string($host) && $host !== '' ? $host : 'localhost';
    }

    /** @param list<int> $ok */
    private static function command($fp, string $line, array $ok): void
    {
        fwrite($fp, $line . "\r\n");
        self::expect($fp, $ok);
    }

    /** @param list<int> $ok */
    private static function expect($fp, array $ok): void
    {
        $response = '';
        while (($line = fgets($fp, 515)) !== false) {
            $response .= $line;
            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $ok, true)) {
            throw new RuntimeException('Réponse SMTP inattendue (' . $code . ')');
        }
    }
}
