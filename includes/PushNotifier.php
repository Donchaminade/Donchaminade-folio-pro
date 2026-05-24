<?php

declare(strict_types=1);

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

final class PushNotifier
{
    public function __construct(private readonly PDO $db) {}

    public static function isConfigured(): bool
    {
        return env('VAPID_PUBLIC_KEY', '') !== '' && env('VAPID_PRIVATE_KEY', '') !== '';
    }

    public function saveSubscription(array $payload, ?int $userId = null): void
    {
        $endpoint = (string) ($payload['endpoint'] ?? '');
        $keys = $payload['keys'] ?? [];
        $p256dh = (string) ($keys['p256dh'] ?? '');
        $auth = (string) ($keys['auth'] ?? '');

        if ($endpoint === '' || $p256dh === '' || $auth === '') {
            throw new InvalidArgumentException('Abonnement push invalide.');
        }

        $stmt = $this->db->prepare(
            'INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), p256dh = VALUES(p256dh), auth = VALUES(auth),
             user_agent = VALUES(user_agent), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([
            $userId,
            $endpoint,
            $p256dh,
            $auth,
            substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512),
        ]);
    }

    public function removeSubscription(string $endpoint): void
    {
        $this->db->prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')->execute([$endpoint]);
    }

    /** @return list<array{endpoint:string, p256dh:string, auth:string}> */
    public function listSubscriptions(): array
    {
        return $this->db->query('SELECT endpoint, p256dh, auth FROM push_subscriptions')->fetchAll(PDO::FETCH_ASSOC);
    }

    public function notify(string $title, string $body, string $adminPath = 'index.php'): void
    {
        if (!self::isConfigured() || !class_exists(WebPush::class)) {
            return;
        }

        $subs = $this->listSubscriptions();
        if ($subs === []) {
            return;
        }

        $base = rtrim(env('APP_URL', ''), '/');
        $url = $base . '/admin/' . ltrim($adminPath, '/');

        $auth = [
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT', 'mailto:chaminade.dondah.adjolou@gmail.com'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);
        $payload = json_encode([
            'title' => $title,
            'body' => $body,
            'url' => $url,
            'icon' => $base . '/public/favicon.png',
        ], JSON_UNESCAPED_UNICODE);

        foreach ($subs as $row) {
            try {
                $subscription = Subscription::create([
                    'endpoint' => $row['endpoint'],
                    'keys' => [
                        'p256dh' => $row['p256dh'],
                        'auth' => $row['auth'],
                    ],
                ]);
                $webPush->queueNotification($subscription, $payload);
            } catch (Throwable) {
                continue;
            }
        }

        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess() && $report->isSubscriptionExpired()) {
                $this->removeSubscription($report->getEndpoint());
            }
        }
    }

    public static function notifyAdmins(string $title, string $body, string $adminPath = 'index.php'): void
    {
        try {
            if (!self::isConfigured()) {
                return;
            }
            $autoload = dirname(__DIR__) . '/vendor/autoload.php';
            if (is_file($autoload)) {
                require_once $autoload;
            }
            (new self(Database::connection()))->notify($title, $body, $adminPath);
        } catch (Throwable) {
            // push optionnel
        }
    }
}
