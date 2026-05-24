<?php

declare(strict_types=1);

/**
 * Métadonnées + contenu des 6 articles de démonstration (long format).
 * @return list<array{slug:string,title:string,excerpt:string,category:string,cover_image:string,reading_time:int,published_at?:string,content:string}>
 */

return [
    require __DIR__ . '/blog-content/article-quill.php',
    require __DIR__ . '/blog-content/article-mcp.php',
    require __DIR__ . '/blog-content/article-benevolat.php',
    require __DIR__ . '/blog-content/article-lacher-prise.php',
    require __DIR__ . '/blog-content/article-react-php.php',
    require __DIR__ . '/blog-content/article-sante-mentale.php',
];
