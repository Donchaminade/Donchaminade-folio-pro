<?php

declare(strict_types=1);

require_once __DIR__ . '/icons.php';
require_once __DIR__ . '/admin-ui.php';

function adminLayout(string $title, string $content, string $active = '', ?string $subtitle = null): void
{
    $user = Auth::user();
    AdminNotifications::markSeenForPage($active);

    try {
        (new CommentAuditRepository(Database::connection()))->purgeExpired();
    } catch (Throwable) {
        // table peut être absente avant migration
    }

    $notif = ['comments' => 0, 'testimonials' => 0, 'recommendations' => 0, 'messages' => 0, 'total' => 0];
    $notifItems = [];
    try {
        $notifService = new AdminNotifications(Database::connection());
        $notif = $notifService->getCounts();
        $notifItems = $notifService->getItems();
    } catch (Throwable) {
    }

    $nav = [
        'index.php' => ['label' => 'Tableau de bord', 'notif' => null],
        'blog.php' => ['label' => 'Blog', 'notif' => null],
        'blog-comments.php' => ['label' => 'Commentaires', 'notif' => 'comments'],
        'audit-logs.php' => ['label' => 'Journal d\'audit', 'notif' => null],
        'technologies.php' => ['label' => 'Technologies', 'notif' => null],
        'projects.php' => ['label' => 'Projets', 'notif' => null],
        'experiences.php' => ['label' => 'Expériences', 'notif' => null],
        'profile.php' => ['label' => 'Profil', 'notif' => null],
        'stats.php' => ['label' => 'Statistiques', 'notif' => null],
        'testimonials.php' => ['label' => 'Témoignages', 'notif' => 'testimonials'],
        'recommendations.php' => ['label' => 'Recommandations', 'notif' => 'recommendations'],
        'communities.php' => ['label' => 'Communautés', 'notif' => null],
        'awards.php' => ['label' => 'Distinctions', 'notif' => null],
        'messages.php' => ['label' => 'Messages', 'notif' => 'messages'],
    ];
    $icons = adminNavIcons();
    $flash = adminFlash();
    $isDashboard = $active === 'index.php';
    ?>
<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#2563eb">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="manifest" href="manifest.json">
    <title><?= e($title) ?> — Admin Donchaminade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: Inter, system-ui, sans-serif; }
        :root { --admin-sidebar-w: 16rem; --admin-sidebar-collapsed: 4.75rem; }
        .admin-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .admin-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        #adminSidebar { width: var(--admin-sidebar-w); transition: width 0.2s ease, transform 0.25s ease; }
        #adminMain { margin-left: var(--admin-sidebar-w); transition: margin-left 0.2s ease; }
        body.admin-sidebar-collapsed #adminSidebar { width: var(--admin-sidebar-collapsed); }
        body.admin-sidebar-collapsed #adminMain { margin-left: var(--admin-sidebar-collapsed); }
        body.admin-sidebar-collapsed .admin-nav-label,
        body.admin-sidebar-collapsed .admin-brand-sub,
        body.admin-sidebar-collapsed .admin-user-email,
        body.admin-sidebar-collapsed .admin-footer-text { display: none; }
        body.admin-sidebar-collapsed .admin-nav-link { justify-content: center; padding-left: 0.75rem; padding-right: 0.75rem; }
        body.admin-sidebar-collapsed .admin-brand-wrap { justify-content: center; }
        .admin-nav-badge { min-width: 1.125rem; height: 1.125rem; padding: 0 0.35rem; font-size: 10px; font-weight: 800; line-height: 1.125rem; text-align: center; border-radius: 9999px; background: #ef4444; color: #fff; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        #adminNotifPanel { min-width: 280px; max-width: min(100vw - 2rem, 320px); }
        @media (max-width: 1023px) {
            #adminSidebar { transform: translateX(-100%); z-index: 50; }
            body.admin-sidebar-open #adminSidebar { transform: translateX(0); }
            #adminMain { margin-left: 0 !important; }
            body.admin-sidebar-collapsed #adminSidebar { width: var(--admin-sidebar-w); }
        }
    </style>
</head>
<body class="min-h-full bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
    <div class="fixed inset-0 -z-10 pointer-events-none">
        <div class="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>

    <div id="adminSidebarOverlay" class="hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" aria-hidden="true"></div>

    <aside id="adminSidebar" class="admin-sidebar fixed left-0 top-0 flex h-full flex-col border-r border-white/5 bg-slate-900/98 backdrop-blur-xl">
        <div class="p-4 border-b border-white/5 shrink-0 flex items-center gap-2">
            <a href="index.php" class="admin-brand-wrap flex flex-1 items-center gap-2 min-w-0 group">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 font-black text-xs">DC</span>
                <span class="admin-brand-sub min-w-0">
                    <span class="block text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 truncate">DONCHAMINADE</span>
                    <span class="flex items-center gap-1 text-[9px] uppercase tracking-widest text-slate-500">Admin</span>
                </span>
            </a>
            <button type="button" id="adminSidebarToggle" class="hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-slate-400 shrink-0" aria-label="Réduire le menu" title="Réduire le menu">
                <?= adminIcon('panel-left-close', 'w-4 h-4') ?>
            </button>
        </div>
        <p class="admin-user-email text-xs text-slate-500 px-4 pb-2 truncate"><?= e($user['email'] ?? '') ?></p>

        <nav class="flex-1 overflow-y-auto admin-scroll p-3 space-y-0.5">
            <?php foreach ($nav as $href => $item):
                $label = $item['label'];
                $notifKey = $item['notif'];
                $icon = $icons[$href] ?? 'circle';
                $activeCls = adminNavClasses($active === $href);
                $badgeCount = $notifKey ? (int) ($notif[$notifKey] ?? 0) : 0;
            ?>
                <a href="<?= e($href) ?>" class="admin-nav-link <?= $activeCls ?> relative" title="<?= e($label) ?>">
                    <?= adminIcon($icon) ?>
                    <span class="admin-nav-label font-semibold text-sm truncate flex-1"><?= e($label) ?></span>
                    <?php if ($notifKey): ?>
                        <span data-notif-key="<?= e($notifKey) ?>" class="admin-nav-badge <?= $badgeCount > 0 ? '' : 'hidden' ?>"><?= $badgeCount > 99 ? '99+' : $badgeCount ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </nav>

        <div class="p-3 border-t border-white/5 shrink-0 space-y-2">
            <a href="<?= e(frontendUrl()) ?>/" target="_blank" rel="noopener noreferrer"
               class="admin-footer-text flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold">
                <?= adminIcon('external-link', 'w-4 h-4 shrink-0') ?> <span class="admin-nav-label">Site public</span>
            </a>
            <a href="logout.php" class="admin-footer-text flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold">
                <?= adminIcon('log-out', 'w-4 h-4 shrink-0') ?> <span class="admin-nav-label">Déconnexion</span>
            </a>
        </div>
    </aside>

    <main id="adminMain" class="admin-main min-h-full">
        <header class="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:px-8 border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
            <button type="button" id="adminMobileMenuBtn" class="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300" aria-label="Menu">
                <?= adminIcon('menu', 'w-5 h-5') ?>
            </button>
            <div class="flex-1 min-w-0">
                <h1 class="text-lg sm:text-xl font-black text-white truncate"><?= e($title) ?></h1>
                <?php if ($subtitle): ?>
                    <p class="text-slate-500 text-xs truncate hidden sm:block"><?= e($subtitle) ?></p>
                <?php endif; ?>
            </div>
            <div class="relative shrink-0">
                <button type="button" id="adminNotifBell" class="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" aria-label="Notifications">
                    <?= adminIcon('bell', 'w-5 h-5') ?>
                    <?php if ($notif['total'] > 0): ?>
                        <span id="adminNotifTotal" class="admin-nav-badge absolute -top-0.5 -right-0.5"><?= $notif['total'] > 99 ? '99+' : (int) $notif['total'] ?></span>
                    <?php else: ?>
                        <span id="adminNotifTotal" class="admin-nav-badge absolute -top-0.5 -right-0.5 hidden">0</span>
                    <?php endif; ?>
                </button>
                <div id="adminNotifPanel" class="hidden absolute right-0 top-full mt-2 z-50 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
                    <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                        <span class="text-sm font-bold text-white">Notifications</span>
                        <?= adminIcon('bell', 'w-4 h-4 text-blue-400') ?>
                    </div>
                    <div id="adminNotifList" class="max-h-64 overflow-y-auto admin-scroll">
                        <?php if ($notifItems === []): ?>
                            <p class="text-slate-500 text-xs p-4 text-center">Aucune alerte</p>
                        <?php else:
                            foreach ($notifItems as $ni): ?>
                            <a href="<?= e($ni['href']) ?>" class="flex items-center justify-between gap-2 px-4 py-3 hover:bg-white/5 border-b border-white/5 text-sm">
                                <span class="text-slate-200"><?= e($ni['label']) ?></span>
                                <span class="admin-nav-badge"><?= (int) $ni['count'] ?></span>
                            </a>
                            <?php endforeach;
                        endif; ?>
                    </div>
                    <div class="p-3 border-t border-white/10 bg-slate-950/80 space-y-2">
                        <p id="adminPushStatus" class="text-[10px] text-slate-500 leading-snug">Activez les notifications sur votre téléphone.</p>
                        <button type="button" id="adminPushEnableBtn" class="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest">
                            Activer les notifications push
                        </button>
                    </div>
                </div>
            </div>
            <?php if (!$isDashboard): ?>
                <a href="<?= e(frontendUrl()) ?>/" target="_blank" rel="noopener noreferrer"
                   class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 text-xs">
                    <?= adminIcon('eye', 'w-4 h-4') ?>
                </a>
            <?php endif; ?>
        </header>

        <div class="p-4 sm:p-6 lg:p-8 max-w-6xl">
            <?php if (!$isDashboard): ?>
                <a href="index.php" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-400 mb-4 transition-colors">
                    <?= adminIcon('arrow-left', 'w-3.5 h-3.5') ?> Tableau de bord
                </a>
            <?php endif; ?>

            <?php if ($flash): ?>
                <div class="mb-6 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center gap-2">
                    <?= adminIcon('check-circle', 'w-4 h-4 shrink-0') ?> <?= e($flash) ?>
                </div>
            <?php endif; ?>

            <?= $content ?>
        </div>
    </main>

    <script src="assets/admin-shell.js"></script>
    <script>document.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); });</script>
</body>
</html>
    <?php
}

function adminFlash(): ?string
{
    Auth::startSession();
    if (!empty($_SESSION['flash'])) {
        $msg = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $msg;
    }
    return null;
}

function adminSetFlash(string $message): void
{
    Auth::startSession();
    $_SESSION['flash'] = $message;
}

function adminNavClasses(bool $active): string
{
    $base = 'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ';
    return $active
        ? $base . 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
        : $base . 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent';
}

function adminBtn(string $label, string $href = '', string $type = 'primary'): string
{
    $classes = match ($type) {
        'danger' => 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20',
        'secondary' => 'bg-slate-700 hover:bg-slate-600 text-white',
        'outline' => 'bg-transparent border border-blue-500/40 text-blue-400 hover:bg-blue-500/10',
        default => 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
    };
    if ($href) {
        $external = str_starts_with($href, 'http');
        $target = ($type === 'outline' && $external) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a href="' . e($href) . '"' . $target . ' class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold ' . $classes . ' shadow-lg transition-all">' . e($label) . '</a>';
    }
    return '';
}

function adminSubmitBtn(string $label = 'Enregistrer'): string
{
    return '<button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all">' . e($label) . '</button>';
}

function adminDangerSubmit(string $label = 'Supprimer'): string
{
    return '<button type="submit" class="px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-xs font-bold text-white transition-all">' . e($label) . '</button>';
}

function adminPanelStart(string $class = ''): void
{
    echo '<div class="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 shadow-xl ' . $class . '">';
}

function adminPanelEnd(): void
{
    echo '</div>';
}

function adminTableStart(): void
{
    echo '<div class="admin-table-wrap rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm"><table class="w-full text-sm min-w-[640px]">';
}

function adminTableHead(array $cols): void
{
    echo '<thead class="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-widest"><tr>';
    foreach ($cols as $col) {
        echo '<th class="text-left p-3 sm:p-4 whitespace-nowrap">' . e($col) . '</th>';
    }
    echo '</tr></thead><tbody class="divide-y divide-white/5">';
}

function adminTableEnd(): void
{
    echo '</tbody></table></div>';
}

function adminLabel(string $text): string
{
    return '<label class="block text-sm font-semibold text-slate-400 mt-4 mb-1">' . e($text) . '</label>';
}

function adminInputAttrs(): string
{
    return 'class="w-full max-w-xl mt-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"';
}
