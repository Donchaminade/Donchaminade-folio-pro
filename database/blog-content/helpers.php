<?php

declare(strict_types=1);

/**
 * Helpers HTML pour articles de blog (mise en page riche).
 */

function blog_unsplash(string $photoId, int $w = 1000, int $h = 0): string
{
    $id = ltrim($photoId, '/');
    if (!str_starts_with($id, 'photo-')) {
        $id = 'photo-' . $id;
    }
    $params = "auto=format&fit=crop&w={$w}&q=85&fm=jpg";
    if ($h > 0) {
        $params .= "&h={$h}";
    }

    return "https://images.unsplash.com/{$id}?{$params}";
}

function blog_img(string $photoId, string $alt, int $w = 1000): string
{
    $url = htmlspecialchars(blog_unsplash($photoId, $w), ENT_QUOTES, 'UTF-8');
    $altEsc = htmlspecialchars($alt, ENT_QUOTES, 'UTF-8');

    return '<img src="' . $url . '" alt="' . $altEsc . '" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="' . $w . '" />';
}

/** Texte à gauche, image à droite (mobile : empilé). */
function blog_split(string $htmlText, string $photoId, string $alt, bool $reverse = false): string
{
    $class = 'blog-split' . ($reverse ? ' blog-split--reverse' : '');

    return '<div class="' . $class . '">'
        . '<div class="blog-split__text">' . $htmlText . '</div>'
        . '<div class="blog-split__media">' . blog_img($photoId, $alt) . '</div>'
        . '</div>';
}

/** Image pleine largeur avec légende. */
function blog_figure(string $photoId, string $alt, string $caption = '', int $w = 1400): string
{
    $cap = $caption !== ''
        ? '<figcaption>' . htmlspecialchars($caption, ENT_QUOTES, 'UTF-8') . '</figcaption>'
        : '';

    return '<figure class="blog-figure">'
        . blog_img($photoId, $alt, $w)
        . $cap
        . '</figure>';
}

/** Encadré type Notion. */
function blog_callout(string $emoji, string $htmlBody): string
{
    return '<div class="blog-callout"><span class="blog-callout__icon" aria-hidden="true">'
        . htmlspecialchars($emoji, ENT_QUOTES, 'UTF-8')
        . '</span><div class="blog-callout__body">' . $htmlBody . '</div></div>';
}

/** Séparateur visuel entre grandes parties. */
function blog_divider(): string
{
    return '<hr class="blog-divider" />';
}
