<?php

declare(strict_types=1);

/** Icônes Lucide (SVG inline via data-lucide) */
function adminNavIcons(): array
{
    return [
        'index.php' => 'layout-dashboard',
        'blog.php' => 'newspaper',
        'blog-comments.php' => 'message-circle',
        'audit-logs.php' => 'shield',
        'technologies.php' => 'cpu',
        'projects.php' => 'folder-kanban',
        'experiences.php' => 'briefcase',
        'profile.php' => 'user-circle',
        'stats.php' => 'bar-chart-3',
        'testimonials.php' => 'star',
        'recommendations.php' => 'thumbs-up',
        'communities.php' => 'users',
        'awards.php' => 'trophy',
        'messages.php' => 'mail',
    ];
}

function adminIcon(string $name, string $class = 'w-5 h-5'): string
{
    return '<i data-lucide="' . e($name) . '" class="' . e($class) . ' shrink-0"></i>';
}
