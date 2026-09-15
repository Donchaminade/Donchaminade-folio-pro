<?php

declare(strict_types=1);

/**
 * Tests unitaires sans SMTP réel.
 * php tests/email-notifications-test.php
 */

$root = dirname(__DIR__);
require_once $root . '/config/env.php';
require_once $root . '/includes/Mailer.php';
require_once $root . '/includes/AdminNotifications.php';

$failed = 0;
$passed = 0;

function assertTrue(bool $cond, string $label): void
{
    global $failed, $passed;
    if ($cond) {
        $passed++;
        echo "  OK  {$label}\n";
        return;
    }
    $failed++;
    echo "  FAIL {$label}\n";
}

function setEnv(string $key, ?string $value): void
{
    if ($value === null) {
        putenv($key);
        unset($_ENV[$key]);
        return;
    }
    putenv("{$key}={$value}");
    $_ENV[$key] = $value;
}

echo "Mailer flags\n";
setEnv('NOTIFY_EMAIL_ENABLED', 'true');
setEnv('SMTP_HOST', '');
setEnv('SMTP_USER', '');
setEnv('SMTP_PASS', '');
setEnv('MAIL_FALLBACK', 'true');
assertTrue(Mailer::isEnabled(), 'enabled with mail fallback');
assertTrue(Mailer::transportLabel() === 'mail', 'transport=mail');

setEnv('MAIL_FALLBACK', 'false');
assertTrue(!Mailer::isEnabled(), 'disabled without SMTP and without fallback');

setEnv('SMTP_HOST', 'smtp.hostinger.com');
setEnv('SMTP_USER', 'user@example.com');
setEnv('SMTP_PASS', 'secret');
assertTrue(Mailer::isSmtpConfigured(), 'SMTP configured');
assertTrue(Mailer::isEnabled(), 'enabled with SMTP even if MAIL_FALLBACK=false');
assertTrue(Mailer::transportLabel() === 'smtp', 'transport=smtp');

setEnv('NOTIFY_EMAIL_ENABLED', 'false');
assertTrue(!Mailer::isEnabled(), 'explicitly disabled');

setEnv('NOTIFY_EMAIL_ENABLED', 'true');
setEnv('NOTIFY_EMAIL_DRY_RUN', 'true');
assertTrue(Mailer::transportLabel() === 'dry-run', 'dry-run label');

setEnv('SMTP_FROM', 'from@example.com');
assertTrue(Mailer::fromAddress() === 'from@example.com', 'SMTP_FROM wins');
setEnv('SMTP_FROM', '');
assertTrue(Mailer::fromAddress() === 'user@example.com', 'SMTP_USER as from');

echo "MIME + headers\n";
$mime = Mailer::buildMimeMessage(
    'owner@example.com',
    'Sujet accentué é',
    "Bonjour\nLigne 2",
    '<p>Bonjour</p>',
    'visitor@example.com'
);
assertTrue(str_contains($mime['raw'], 'Content-Type: multipart/alternative'), 'multipart');
assertTrue(str_contains($mime['raw'], 'Reply-To: visitor@example.com'), 'reply-to');
assertTrue(str_contains($mime['headers'], '=?UTF-8?B?'), 'encoded subject');
assertTrue(!str_contains($mime['raw'], 'secret'), 'no smtp password in mime');

echo "Recipient helpers\n";
assertTrue(AdminNotifications::isValidEmail('a@b.com'), 'valid email');
assertTrue(!AdminNotifications::isValidEmail('not-an-email'), 'invalid email');
assertTrue(Mailer::maskEmail('chaminade@example.com') === 'cha***@example.com', 'mask email');

echo "Email content\n";
setEnv('APP_URL', 'https://donchamfolio.grosbit.com');
$content = AdminNotifications::buildEmailContent(
    'Nouveau message de contact',
    'Jean vous a écrit.',
    'messages.php',
    ['Nom' => 'Jean <script>', 'Message' => "Salut\nligne 2"]
);
assertTrue(str_starts_with($content['subject'], '[Portfolio] '), 'subject prefix');
assertTrue(str_contains($content['text'], 'Ouvrir l’admin : https://donchamfolio.grosbit.com/admin/messages.php'), 'text admin link');
assertTrue(str_contains($content['html'], 'https://donchamfolio.grosbit.com/admin/messages.php'), 'html admin link');
assertTrue(!str_contains($content['html'], '<script>'), 'escaped html fields');
assertTrue(str_contains($content['html'], 'Jean &lt;script&gt;'), 'escaped name');

echo "Dry-run send\n";
setEnv('NOTIFY_EMAIL_DRY_RUN', 'true');
setEnv('NOTIFY_EMAIL_ENABLED', 'true');
setEnv('MAIL_FALLBACK', 'true');
$sent = Mailer::send('owner@example.com', 'Test', 'texte', '<p>html</p>');
assertTrue($sent, 'dry-run send returns true');

echo "\n{$passed} passed, {$failed} failed\n";
exit($failed === 0 ? 0 : 1);
