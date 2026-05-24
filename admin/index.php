<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();

$pdo = Database::connection();
$repo = new PortfolioRepository($pdo);

$counts = [];
$blogStats = ['total' => 0, 'published' => 0, 'draft' => 0, 'views' => 0, 'likes' => 0];
$hiddenComments = 0;
$collabUnread = 0;
$techCount = 0;
$recentPosts = [];
$recentMessages = [];
$pendingCommentsList = [];

try {
    $counts = $repo->getCounts();
    $blogStats['total'] = (int) $pdo->query('SELECT COUNT(*) FROM blog_posts')->fetchColumn();
    $blogStats['published'] = (int) $pdo->query('SELECT COUNT(*) FROM blog_posts WHERE is_published = 1')->fetchColumn();
    $blogStats['draft'] = $blogStats['total'] - $blogStats['published'];
    $engagement = $pdo->query('SELECT COALESCE(SUM(views_count),0), COALESCE(SUM(likes_count),0) FROM blog_posts')->fetch(PDO::FETCH_NUM);
    $blogStats['views'] = (int) ($engagement[0] ?? 0);
    $blogStats['likes'] = (int) ($engagement[1] ?? 0);
    $hiddenComments = (int) $pdo->query('SELECT COUNT(*) FROM blog_comments WHERE is_hidden = 1')->fetchColumn();
    $collabUnread = (int) $pdo->query(
        "SELECT COUNT(*) FROM contact_messages WHERE message_type = 'collaboration' AND is_read = 0"
    )->fetchColumn();
    $techCount = (int) $pdo->query('SELECT COUNT(*) FROM technologies')->fetchColumn();
    $recentPosts = $pdo->query(
        'SELECT id, title, slug, is_published, published_at, views_count, comments_count
         FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC LIMIT 5'
    )->fetchAll();
    $recentMessages = $pdo->query(
        'SELECT id, name, email, message, created_at, is_read FROM contact_messages ORDER BY created_at DESC LIMIT 5'
    )->fetchAll();
    $pendingCommentsList = $pdo->query(
        'SELECT c.id, c.author_name, c.content, c.created_at, p.title AS post_title
         FROM blog_comments c
         JOIN blog_posts p ON p.id = c.post_id
         WHERE c.is_hidden = 1 ORDER BY c.created_at DESC LIMIT 5'
    )->fetchAll();
} catch (PDOException) {
    // BDD non installée ou tables manquantes
}

$chartLabels = json_encode(
    ['Projets', 'Blog', 'Expériences', 'Témoignages', 'Recommandations', 'Communautés', 'Distinctions', 'Technologies'],
    JSON_UNESCAPED_UNICODE
);
$chartData = json_encode([
    (int) ($counts['projects'] ?? 0),
    $blogStats['total'],
    (int) ($counts['experiences'] ?? 0),
    (int) ($counts['testimonials'] ?? 0),
    (int) ($counts['recommendations'] ?? 0),
    (int) ($counts['communities'] ?? 0),
    (int) ($counts['awards'] ?? 0),
    $techCount,
]);
$blogPie = json_encode([$blogStats['published'], $blogStats['draft']], JSON_UNESCAPED_UNICODE);

ob_start();
?>
<!-- Cartes KPI — alignées sur le menu latéral -->
<div class="mb-3">
    <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Contenu du portfolio</h2>
</div>
<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
    <?php
    $contentCards = [
        ['Projets', (int) ($counts['projects'] ?? 0), 'projects.php', 'folder-kanban', 'from-blue-600/20 to-blue-900/10', (int) ($counts['projects_active'] ?? 0) . ' actifs'],
        ['Expériences', (int) ($counts['experiences'] ?? 0), 'experiences.php', 'briefcase', 'from-cyan-600/20 to-cyan-900/10', (int) ($counts['experiences_active'] ?? 0) . ' actives'],
        ['Articles blog', $blogStats['total'], 'blog.php', 'newspaper', 'from-violet-600/20 to-violet-900/10', (int) $blogStats['published'] . ' publiés'],
        ['Technologies', $techCount, 'technologies.php', 'cpu', 'from-emerald-600/20 to-emerald-900/10', 'Stack & icônes'],
        ['Statistiques', (int) ($counts['stats'] ?? 0), 'stats.php', 'bar-chart-3', 'from-indigo-600/20 to-indigo-900/10', 'Chiffres du hero'],
        ['Témoignages', (int) ($counts['testimonials'] ?? 0), 'testimonials.php', 'star', 'from-amber-600/20 to-amber-900/10', (int) ($counts['testimonials_published'] ?? 0) . ' en ligne'],
        ['Recommandations', (int) ($counts['recommendations'] ?? 0), 'recommendations.php', 'thumbs-up', 'from-pink-600/20 to-pink-900/10', (int) ($counts['recommendations_visible'] ?? 0) . ' visibles'],
        ['Communautés', (int) ($counts['communities'] ?? 0), 'communities.php', 'users', 'from-teal-600/20 to-teal-900/10', 'Logos & liens'],
        ['Distinctions', (int) ($counts['awards'] ?? 0), 'awards.php', 'trophy', 'from-yellow-600/20 to-yellow-900/10', 'Prix & awards'],
    ];
    foreach ($contentCards as [$label, $val, $link, $icon, $grad, $hint]):
        $pending = ($label === 'Témoignages') ? (int) ($counts['testimonials_pending'] ?? 0) : 0;
    ?>
    <a href="<?= e($link) ?>" class="group relative block p-5 rounded-2xl border border-white/10 bg-gradient-to-br <?= $grad ?> hover:border-blue-500/40 hover:scale-[1.02] transition-all">
        <?php if ($pending > 0): ?>
            <span class="absolute top-3 right-3 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-900"><?= $pending > 99 ? '99+' : $pending ?></span>
        <?php endif; ?>
        <div class="flex items-center justify-between mb-3">
            <?= adminIcon($icon, 'w-5 h-5 text-slate-400 group-hover:text-blue-400') ?>
            <?= adminIcon('chevron-right', 'w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity') ?>
        </div>
        <div class="text-3xl font-black text-white"><?= $val ?></div>
        <div class="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider"><?= e($label) ?></div>
        <?php if ($hint): ?>
            <div class="text-[10px] text-slate-500 mt-1.5"><?= e($hint) ?></div>
        <?php endif; ?>
    </a>
    <?php endforeach; ?>
</div>

<div class="mb-3">
    <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Modération & messages</h2>
</div>
<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
    <?php
    $modCards = [
        ['Messages non lus', (int) ($counts['unread_messages'] ?? 0), 'messages.php', 'mail', 'from-amber-600/20 to-amber-900/10', null],
        ['Collab. en attente', (int) $collabUnread, 'messages.php?type=collaboration', 'handshake', 'from-violet-600/20 to-violet-900/10', 'Demandes partenariat'],
        ['Commentaires masqués', (int) $hiddenComments, 'blog-comments.php', 'message-circle', 'from-rose-600/20 to-rose-900/10', 'À réviser'],
        ['Vues blog', (int) $blogStats['views'], 'blog.php', 'eye', 'from-slate-600/20 to-slate-900/10', 'Engagement total'],
        ['Likes blog', (int) $blogStats['likes'], 'blog.php', 'heart', 'from-red-600/20 to-red-900/10', 'Sur tous les articles'],
        ['Journal d\'audit', null, 'audit-logs.php', 'shield', 'from-slate-600/20 to-slate-800/10', 'Supprimés & archivés'],
    ];
    foreach ($modCards as [$label, $val, $link, $icon, $grad, $hint]):
    ?>
    <a href="<?= e($link) ?>" class="group block p-5 rounded-2xl border border-white/10 bg-gradient-to-br <?= $grad ?> hover:border-blue-500/40 transition-all">
        <div class="flex items-center justify-between mb-3">
            <?= adminIcon($icon, 'w-5 h-5 text-slate-400 group-hover:text-blue-400') ?>
            <?= adminIcon('chevron-right', 'w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity') ?>
        </div>
        <?php if ($val !== null): ?>
            <div class="text-3xl font-black text-white"><?= (int) $val ?></div>
        <?php else: ?>
            <div class="text-lg font-bold text-blue-400 group-hover:text-blue-300">Ouvrir →</div>
        <?php endif; ?>
        <div class="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider"><?= e($label) ?></div>
        <?php if ($hint): ?>
            <div class="text-[10px] text-slate-500 mt-1.5"><?= e($hint) ?></div>
        <?php endif; ?>
    </a>
    <?php endforeach; ?>
</div>

<!-- Graphiques -->
<div class="grid lg:grid-cols-3 gap-6 mb-8">
    <div class="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <?= adminIcon('bar-chart-3', 'w-4 h-4 text-blue-400') ?> Répartition du contenu
        </h2>
        <div class="h-56">
            <canvas id="chartContent"></canvas>
        </div>
    </div>
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <?= adminIcon('pie-chart', 'w-4 h-4 text-violet-400') ?> Blog — publié / brouillon
        </h2>
        <div class="h-56 flex items-center justify-center">
            <canvas id="chartBlog"></canvas>
        </div>
        <p class="text-center text-xs text-slate-500 mt-2">
            <?= (int) $blogStats['published'] ?> publié · <?= (int) $blogStats['draft'] ?> brouillon
        </p>
    </div>
</div>

<!-- Tableaux rapides -->
<div class="grid lg:grid-cols-2 gap-6 mb-8">
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <?= adminIcon('newspaper', 'w-4 h-4') ?> Derniers articles
            </h2>
            <?= adminBtn('Tout voir', 'blog.php', 'outline') ?>
        </div>
        <?php if ($recentPosts): ?>
        <table class="w-full text-sm">
            <tbody class="divide-y divide-white/5">
            <?php foreach ($recentPosts as $post): ?>
                <tr class="hover:bg-white/[0.02]">
                    <td class="p-4">
                        <a href="blog.php?action=edit&id=<?= (int) $post['id'] ?>" class="font-medium text-white hover:text-blue-400 line-clamp-1"><?= e($post['title']) ?></a>
                        <span class="text-[10px] text-slate-500"><?= (int) $post['views_count'] ?> vues · <?= (int) $post['comments_count'] ?> com.</span>
                    </td>
                    <td class="p-4 text-right shrink-0">
                        <?php if ($post['is_published']): ?>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Publié</span>
                        <?php else: ?>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-600/40 text-slate-400">Brouillon</span>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <p class="p-6 text-slate-500 text-sm">Aucun article pour le moment.</p>
        <?php endif; ?>
    </div>

    <div class="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <?= adminIcon('mail', 'w-4 h-4') ?> Messages récents
            </h2>
            <?= adminBtn('Boîte', 'messages.php', 'outline') ?>
        </div>
        <?php if ($recentMessages): ?>
        <table class="w-full text-sm">
            <tbody class="divide-y divide-white/5">
            <?php foreach ($recentMessages as $msg): ?>
                <tr class="hover:bg-white/[0.02]">
                    <td class="p-4">
                        <span class="font-medium text-white"><?= e($msg['name']) ?></span>
                        <span class="block text-xs text-slate-500 truncate max-w-[200px]"><?= e(mb_substr($msg['message'] ?? '', 0, 60)) ?></span>
                    </td>
                    <td class="p-4 text-right text-xs text-slate-500 whitespace-nowrap">
                        <?php if (!$msg['is_read']): ?><span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span><?php endif; ?>
                        <?= e(date('d/m', strtotime($msg['created_at']))) ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <p class="p-6 text-slate-500 text-sm">Aucun message reçu.</p>
        <?php endif; ?>
    </div>
</div>

<?php if ($pendingCommentsList): ?>
<div class="rounded-2xl border border-amber-500/20 bg-amber-950/20 overflow-hidden mb-8">
    <div class="flex items-center justify-between px-6 py-4 border-b border-amber-500/10">
        <h2 class="text-sm font-bold text-amber-300 flex items-center gap-2">
            <?= adminIcon('eye-off', 'w-4 h-4') ?> Commentaires masqués récemment
        </h2>
        <?= adminBtn('Gérer', 'blog-comments.php', 'outline') ?>
    </div>
    <table class="w-full text-sm">
        <tbody class="divide-y divide-white/5">
        <?php foreach ($pendingCommentsList as $c): ?>
            <tr>
                <td class="p-4">
                    <span class="font-medium text-white"><?= e($c['author_name']) ?></span>
                    <span class="text-xs text-slate-500"> sur « <?= e($c['post_title']) ?> »</span>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2"><?= e(mb_substr($c['content'], 0, 120)) ?></p>
                </td>
                <td class="p-4 text-xs text-slate-500 whitespace-nowrap"><?= e(date('d/m H:i', strtotime($c['created_at']))) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>

<!-- Actions rapides + info admin -->
<div class="grid lg:grid-cols-2 gap-6">
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 class="text-sm font-bold text-white mb-4">Actions rapides</h2>
        <div class="flex flex-wrap gap-2">
            <?= adminBtn('+ Article', 'blog.php?action=create') ?>
            <?= adminBtn('Projets', 'projects.php', 'secondary') ?>
            <?= adminBtn('Témoignages', 'testimonials.php', 'secondary') ?>
            <?= adminBtn('Recommandations', 'recommendations.php', 'secondary') ?>
            <?= adminBtn('Communautés', 'communities.php', 'secondary') ?>
            <?= adminBtn('Distinctions', 'awards.php', 'secondary') ?>
            <?= adminBtn('Profil', 'profile.php', 'secondary') ?>
        </div>
    </div>
    <div class="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-6">
        <h2 class="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
            <?= adminIcon('info', 'w-4 h-4') ?> À propos de « Voir le site »
        </h2>
        <p class="text-sm text-slate-400 leading-relaxed">
            Ce lien ouvre votre <strong class="text-slate-300">portfolio public</strong> (React sur <?= e(parse_url(frontendUrl(), PHP_URL_HOST) ?: 'localhost:3000') ?>).
            Il est réservé à l’espace admin : vos visiteurs n’ont pas de tableau de bord, ils voient uniquement le site publié.
        </p>
        <p class="text-xs text-slate-500 mt-3 break-all">API : <?= e(env('APP_URL', '')) ?>/api/index.php</p>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const gridColor = 'rgba(148, 163, 184, 0.15)';
    const textColor = '#94a3b8';
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    new Chart(document.getElementById('chartContent'), {
        type: 'bar',
        data: {
            labels: <?= $chartLabels ?>,
            datasets: [{
                label: 'Éléments',
                data: <?= $chartData ?>,
                backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#14b8a6', '#eab308', '#10b981'],
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            }
        }
    });

    new Chart(document.getElementById('chartBlog'), {
        type: 'doughnut',
        data: {
            labels: ['Publiés', 'Brouillons'],
            datasets: [{
                data: <?= $blogPie ?>,
                backgroundColor: ['#34d399', '#475569'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } } }
        }
    });

    if (window.lucide) lucide.createIcons();
});
</script>
<?php
adminLayout('Tableau de bord', ob_get_clean(), 'index.php', 'Vue d\'ensemble de votre portfolio');
