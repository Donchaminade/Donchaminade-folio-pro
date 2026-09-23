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
    <meta name="theme-color" content="#121417">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="manifest" href="manifest.json">
    <title><?= e($title) ?> — Admin Donchaminade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-body min-h-full antialiased overflow-x-hidden">
    <div id="adminSidebarOverlay" class="hidden fixed inset-0 z-40 bg-black/55 lg:hidden" aria-hidden="true"></div>

    <aside id="adminSidebar" class="admin-sidebar fixed left-0 top-0 flex h-full flex-col">
        <div class="p-4 border-b border-[var(--a-border)] shrink-0 flex items-center gap-2">
            <a href="index.php" class="admin-brand-wrap flex flex-1 items-center gap-2 min-w-0 group">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(61,110,168,0.2)] text-[var(--a-accent)] font-bold text-xs">DC</span>
                <span class="admin-brand-sub min-w-0">
                    <span class="admin-brand-title block truncate">Donchaminade</span>
                    <span class="flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-[var(--a-muted)]">Admin</span>
                </span>
            </a>
            <button type="button" id="adminSidebarToggle" class="hidden lg:flex p-2 rounded-lg hover:bg-[var(--a-elevated)] text-[var(--a-muted)] shrink-0" aria-label="Réduire le menu" title="Réduire le menu">
                <?= adminIcon('panel-left-close', 'w-4 h-4') ?>
            </button>
        </div>
        <p class="admin-user-email text-xs text-[var(--a-muted)] px-4 pb-2 truncate"><?= e($user['email'] ?? '') ?></p>

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

        <div class="p-3 border-t border-[var(--a-border)] shrink-0 space-y-2">
            <a href="<?= e(frontendUrl()) ?>/" target="_blank" rel="noopener noreferrer"
               class="admin-footer-text flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-[rgba(61,110,168,0.15)] border border-[rgba(61,110,168,0.3)] text-[var(--a-accent)] hover:bg-[rgba(61,110,168,0.25)] text-xs font-semibold">
                <?= adminIcon('external-link', 'w-4 h-4 shrink-0') ?> <span class="admin-nav-label">Site public</span>
            </a>
            <a href="logout.php" class="admin-footer-text flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl border border-[rgba(196,92,92,0.35)] text-[var(--a-danger)] hover:bg-[rgba(196,92,92,0.1)] text-xs font-semibold">
                <?= adminIcon('log-out', 'w-4 h-4 shrink-0') ?> <span class="admin-nav-label">Déconnexion</span>
            </a>
        </div>
    </aside>

    <main id="adminMain" class="admin-main min-h-full">
        <header class="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:px-8 border-b border-[var(--a-border)] bg-[rgba(18,20,23,0.92)] backdrop-blur-md">
            <button type="button" id="adminMobileMenuBtn" class="lg:hidden p-2 rounded-xl bg-[var(--a-elevated)] text-[var(--a-muted)]" aria-label="Menu">
                <?= adminIcon('menu', 'w-5 h-5') ?>
            </button>
            <div class="flex-1 min-w-0">
                <h1 class="text-lg sm:text-xl font-semibold tracking-tight text-[var(--a-ink)] truncate" style="font-family:var(--a-display)"><?= e($title) ?></h1>
                <?php if ($subtitle): ?>
                    <p class="text-[var(--a-muted)] text-xs truncate hidden sm:block"><?= e($subtitle) ?></p>
                <?php endif; ?>
            </div>
            <div class="relative shrink-0">
                <button type="button" id="adminNotifBell" class="relative p-2.5 rounded-xl bg-[var(--a-elevated)] hover:bg-[var(--a-surface)] text-[var(--a-muted)] hover:text-[var(--a-ink)] transition-colors" aria-label="Notifications">
                    <?= adminIcon('bell', 'w-5 h-5') ?>
                    <?php if ($notif['total'] > 0): ?>
                        <span id="adminNotifTotal" class="admin-nav-badge absolute -top-0.5 -right-0.5"><?= $notif['total'] > 99 ? '99+' : (int) $notif['total'] ?></span>
                    <?php else: ?>
                        <span id="adminNotifTotal" class="admin-nav-badge absolute -top-0.5 -right-0.5 hidden">0</span>
                    <?php endif; ?>
                </button>
                <div id="adminNotifPanel" class="hidden absolute right-0 top-full mt-2 z-50 rounded-2xl border border-[var(--a-border)] bg-[var(--a-surface)] shadow-[var(--a-shadow)] overflow-hidden">
                    <div class="px-4 py-3 border-b border-[var(--a-border)] flex items-center justify-between gap-2">
                        <span class="text-sm font-bold text-[var(--a-ink)]">Notifications</span>
                        <?= adminIcon('bell', 'w-4 h-4 text-[var(--a-accent)]') ?>
                    </div>
                    <div id="adminNotifList" class="max-h-64 overflow-y-auto admin-scroll">
                        <?php if ($notifItems === []): ?>
                            <p class="text-[var(--a-muted)] text-xs p-4 text-center">Aucune alerte</p>
                        <?php else:
                            foreach ($notifItems as $ni): ?>
                            <a href="<?= e($ni['href']) ?>" class="flex items-center justify-between gap-2 px-4 py-3 hover:bg-[var(--a-elevated)] border-b border-[var(--a-border)] text-sm">
                                <span class="text-[var(--a-ink)]"><?= e($ni['label']) ?></span>
                                <span class="admin-nav-badge"><?= (int) $ni['count'] ?></span>
                            </a>
                            <?php endforeach;
                        endif; ?>
                    </div>
                    <div class="p-3 border-t border-[var(--a-border)] bg-[var(--a-bg)] space-y-2">
                        <p id="adminPushStatus" class="text-[10px] text-[var(--a-muted)] leading-snug">Activez les notifications sur votre téléphone.</p>
                        <button type="button" id="adminPushEnableBtn" class="w-full py-2 rounded-xl bg-[var(--a-accent-strong)] hover:bg-[var(--a-accent)] text-white text-[10px] font-bold uppercase tracking-[0.12em]">
                            Activer les notifications push
                        </button>
                        <button type="button" id="adminPushTestBtn" class="hidden w-full py-2 rounded-xl border border-[var(--a-border)] text-[var(--a-muted)] hover:bg-[var(--a-elevated)] text-[10px] font-bold uppercase tracking-[0.12em]">
                            Envoyer un test
                        </button>
                        <p id="adminEmailStatus" class="text-[10px] text-[var(--a-muted)] leading-snug pt-1">Email : configuration en cours de lecture…</p>
                        <button type="button" id="adminEmailTestBtn" class="w-full py-2 rounded-xl border border-[var(--a-border)] text-[var(--a-muted)] hover:bg-[var(--a-elevated)] text-[10px] font-bold uppercase tracking-[0.12em]">
                            Tester l'email
                        </button>
                    </div>
                </div>
            </div>
            <?php if (!$isDashboard): ?>
                <a href="<?= e(frontendUrl()) ?>/" target="_blank" rel="noopener noreferrer"
                   class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--a-border)] text-[var(--a-muted)] hover:text-[var(--a-accent)] text-xs">
                    <?= adminIcon('eye', 'w-4 h-4') ?>
                </a>
            <?php endif; ?>
        </header>

        <div class="p-4 sm:p-6 lg:p-8 w-full max-w-[90rem] mx-auto">
            <?php if (!$isDashboard): ?>
                <a href="index.php" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-accent)] mb-4 transition-colors">
                    <?= adminIcon('arrow-left', 'w-3.5 h-3.5') ?> Tableau de bord
                </a>
            <?php endif; ?>

            <?php if ($flash): ?>
                <div class="mb-6 px-4 py-3 rounded-xl bg-[rgba(77,154,114,0.12)] border border-[rgba(77,154,114,0.35)] text-[#9dd4b4] text-sm font-medium flex items-center gap-2">
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
        ? $base . 'bg-[rgba(61,110,168,0.18)] text-[var(--a-accent)] border border-[rgba(61,110,168,0.3)]'
        : $base . 'text-[var(--a-muted)] hover:bg-[var(--a-elevated)] hover:text-[var(--a-ink)] border border-transparent';
}

function adminBtn(string $label, string $href = '', string $type = 'primary'): string
{
    $classes = match ($type) {
        'danger' => 'bg-[var(--a-danger)] hover:opacity-90 text-white',
        'secondary' => 'bg-[var(--a-elevated)] hover:bg-[var(--a-surface)] text-[var(--a-ink)] border border-[var(--a-border)]',
        'outline' => 'bg-transparent border border-[rgba(61,110,168,0.4)] text-[var(--a-accent)] hover:bg-[rgba(61,110,168,0.1)]',
        default => 'bg-[var(--a-accent-strong)] hover:bg-[var(--a-accent)] text-white',
    };
    if ($href) {
        $external = str_starts_with($href, 'http');
        $target = ($type === 'outline' && $external) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a href="' . e($href) . '"' . $target . ' class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold ' . $classes . ' transition-all">' . e($label) . '</a>';
    }
    return '';
}

function adminSubmitBtn(string $label = 'Enregistrer'): string
{
    return '<button type="submit" class="px-6 py-2.5 rounded-xl bg-[var(--a-accent-strong)] hover:bg-[var(--a-accent)] font-bold text-sm text-white transition-all">' . e($label) . '</button>';
}

function adminDangerSubmit(string $label = 'Supprimer'): string
{
    return '<button type="submit" class="px-4 py-2 rounded-xl bg-[var(--a-danger)] hover:opacity-90 text-xs font-bold text-white transition-all">' . e($label) . '</button>';
}

function adminPanelStart(string $class = ''): void
{
    echo '<div class="admin-panel ' . $class . '">';
}

function adminPanelEnd(): void
{
    echo '</div>';
}

function adminTableStart(): void
{
    echo '<div class="admin-table-wrap"><table class="w-full text-sm min-w-[640px]">';
}

function adminTableHead(array $cols): void
{
    echo '<thead><tr>';
    foreach ($cols as $col) {
        echo '<th class="text-left p-3 sm:p-4 whitespace-nowrap">' . e($col) . '</th>';
    }
    echo '</tr></thead><tbody>';
}

function adminTableEnd(): void
{
    echo '</tbody></table></div>';
}

function adminLabel(string $text): string
{
    return '<label class="block text-sm font-semibold text-[var(--a-muted)] mt-4 mb-1">' . e($text) . '</label>';
}

function adminInputAttrs(): string
{
    return 'class="w-full max-w-xl mt-1 px-4 py-2.5 rounded-xl bg-[var(--a-bg)] border border-[var(--a-border)] text-[var(--a-ink)] placeholder-[var(--a-muted)] focus:outline-none focus:border-[var(--a-accent)] focus:ring-2 focus:ring-[rgba(61,110,168,0.2)] transition-all"';
}
