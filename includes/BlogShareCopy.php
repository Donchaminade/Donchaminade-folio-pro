<?php

declare(strict_types=1);

final class BlogShareCopy
{
    /** @return array{url:string,facebook:string,x:string} */
    public static function build(string $title, string $excerpt, string $slug): array
    {
        $url = rtrim(frontendUrl(), '/') . '/blog/' . rawurlencode($slug);
        $excerpt = trim(preg_replace('/\s+/', ' ', strip_tags($excerpt)) ?? '');
        if ($excerpt === '') {
            $excerpt = 'Nouvel article sur le portfolio de Dondah Chaminade.';
        }

        $facebook = $title . "\n\n" . $excerpt . "\n\nLire l’article : " . $url;

        $xBudget = 280 - 24 - strlen($url);
        $xLead = $title;
        if ($xBudget > 40 && $excerpt !== '') {
            $snippet = mb_substr($excerpt, 0, max(0, $xBudget - mb_strlen($title) - 5));
            if (mb_strlen($excerpt) > mb_strlen($snippet)) {
                $snippet = rtrim($snippet, " \t.,;:") . '…';
            }
            $xLead = $title . "\n\n" . $snippet;
        }
        $x = mb_substr(trim($xLead), 0, max(1, 280 - strlen($url) - 1)) . "\n" . $url;

        return [
            'url' => $url,
            'facebook' => $facebook,
            'x' => $x,
        ];
    }

    public static function newPreviewToken(): string
    {
        return bin2hex(random_bytes(24));
    }
}
