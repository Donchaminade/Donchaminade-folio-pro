<?php

declare(strict_types=1);

/** Géolocalisation légère via ip-api.com (usage non commercial, limite ~45 req/min). */
final class GeoIp
{
    public static function lookup(string $ip): array
    {
        if (!self::isPublicIp($ip)) {
            return [
                'country' => 'Réseau local',
                'region' => '',
                'city' => '',
            ];
        }

        $url = 'http://ip-api.com/json/' . rawurlencode($ip)
            . '?fields=status,country,regionName,city,message';

        $ctx = stream_context_create([
            'http' => [
                'timeout' => 2,
                'header' => "User-Agent: DonchaminadePortfolio/1.0\r\n",
            ],
        ]);

        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            return ['country' => '', 'region' => '', 'city' => ''];
        }

        $data = json_decode($raw, true);
        if (!is_array($data) || ($data['status'] ?? '') !== 'success') {
            return ['country' => '', 'region' => '', 'city' => ''];
        }

        return [
            'country' => (string) ($data['country'] ?? ''),
            'region' => (string) ($data['regionName'] ?? ''),
            'city' => (string) ($data['city'] ?? ''),
        ];
    }

    public static function clientIp(): string
    {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        if (str_contains($ip, ',')) {
            $ip = trim(explode(',', $ip)[0]);
        }

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
    }

    public static function isPublicIp(string $ip): bool
    {
        return (bool) filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );
    }
}
