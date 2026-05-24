<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$blogRepo = new BlogRepository($db);
$auditRepo = new CommentAuditRepository($db);
$auditRepo->purgeExpired();

$filter = $_GET['filter'] ?? 'all';
$q = trim((string) ($_GET['q'] ?? ''));
$pager = adminPaginationState(40);
$page = $pager['page'];
$perPage = $pager['perPage'];
$offset = $pager['offset'];
$queryBase = array_filter(['filter' => $filter !== 'all' ? $filter : null, 'q' => $q !== '' ? $q : null]);

$liveSql = 'SELECT c.id, c.id AS comment_id, c.post_id, p.title AS post_title, p.slug AS post_slug,
        c.author_name, c.author_email, c.author_role, c.content,
        c.ip_address, c.user_agent, c.visitor_hash, c.referrer,
        c.geo_country, c.geo_region, c.geo_city, c.is_hidden,
        c.created_at, NULL AS deleted_at, NULL AS expires_at, 0 AS is_deleted
        FROM blog_comments c
        JOIN blog_posts p ON p.id = c.post_id
        WHERE 1=1';
$params = [];

if ($filter === 'hidden') {
    $liveSql .= ' AND c.is_hidden = 1';
} elseif ($filter === 'admin') {
    $liveSql .= " AND c.author_role = 'admin'";
} elseif ($filter === 'visitor') {
    $liveSql .= " AND c.author_role = 'visitor'";
} elseif ($filter === 'deleted') {
    $liveSql .= ' AND 1=0';
}

if ($q !== '') {
    $liveSql .= ' AND (c.author_name LIKE ? OR c.ip_address LIKE ? OR c.geo_city LIKE ? OR c.geo_country LIKE ? OR c.content LIKE ?)';
    $like = '%' . $q . '%';
    $params = array_merge($params, [$like, $like, $like, $like, $like]);
}

$archivedSql = 'SELECT comment_id AS id, comment_id, post_id, post_title, post_slug,
        author_name, author_email, author_role, content,
        ip_address, user_agent, visitor_hash, referrer,
        geo_country, geo_region, geo_city, is_hidden,
        comment_created_at AS created_at, deleted_at, expires_at, 1 AS is_deleted
        FROM comment_audit_logs WHERE expires_at >= NOW()';
$archParams = [];

if ($filter === 'deleted' || $filter === 'all') {
    if ($q !== '') {
        $archivedSql .= ' AND (author_name LIKE ? OR ip_address LIKE ? OR geo_city LIKE ? OR geo_country LIKE ? OR content LIKE ?)';
        $archParams = [$like ?? '%' . $q . '%', $like, $like, $like, $like];
    }
} else {
    $archivedSql .= ' AND 1=0';
}

$unionSql = "SELECT * FROM (($liveSql) UNION ALL ($archivedSql)) combined";
$allParams = array_merge($params, $archParams);

$countStmt = $db->prepare("SELECT COUNT(*) FROM ($unionSql) cnt");
$countStmt->execute($allParams);
$total = (int) $countStmt->fetchColumn();

$unionSql .= ' ORDER BY COALESCE(deleted_at, created_at) DESC LIMIT ? OFFSET ?';
$stmt = $db->prepare($unionSql);
$i = 1;
foreach ($allParams as $p) {
    $stmt->bindValue($i++, $p);
}
$stmt->bindValue($i++, $perPage, PDO::PARAM_INT);
$stmt->bindValue($i, $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

ob_start();
?>
<div class="flex flex-wrap gap-2 mb-4">
    <a href="?<?= e(http_build_query(array_merge($queryBase, ['filter' => 'all', 'page' => 1]))) ?>" class="px-3 py-2 rounded-xl text-xs font-bold <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Tous</a>
    <a href="?filter=visitor" class="px-3 py-2 rounded-xl text-xs font-bold <?= $filter === 'visitor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Visiteurs</a>
    <a href="?filter=admin" class="px-3 py-2 rounded-xl text-xs font-bold <?= $filter === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Auteur</a>
    <a href="?filter=hidden" class="px-3 py-2 rounded-xl text-xs font-bold <?= $filter === 'hidden' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Masqués</a>
    <a href="?filter=deleted" class="px-3 py-2 rounded-xl text-xs font-bold <?= $filter === 'deleted' ? 'bg-red-600/80 text-white' : 'bg-slate-800 text-slate-400' ?>">Supprimés (7 j)</a>
</div>

<form method="get" class="mb-4 flex flex-wrap gap-2">
    <?php if ($filter !== 'all'): ?><input type="hidden" name="filter" value="<?= e($filter) ?>"><?php endif; ?>
    <input type="search" name="q" value="<?= e($q) ?>" placeholder="Rechercher…" class="flex-1 min-w-[160px] px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white">
    <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white">Rechercher</button>
</form>

<p class="text-xs text-slate-500 mb-3">Les commentaires supprimés restent visibles ici pendant <strong class="text-slate-400">7 jours</strong>, puis sont effacés automatiquement.</p>

<?php adminTableStart(); adminTableHead(['Date', 'Auteur', 'Article', 'IP', 'Localisation', 'Statut']); ?>
<?php foreach ($rows as $r):
    $loc = $blogRepo->formatAuditLocation($r);
    $isDeleted = (int) ($r['is_deleted'] ?? 0) === 1;
    $payload = htmlspecialchars(json_encode([
        'id' => $r['comment_id'] ?? $r['id'],
        'date' => $r['created_at'],
        'deleted' => $r['deleted_at'] ?? null,
        'expires' => $r['expires_at'] ?? null,
        'author' => $r['author_name'],
        'email' => $r['author_email'] ?? '',
        'role' => $r['author_role'],
        'post' => $r['post_title'],
        'slug' => $r['post_slug'],
        'content' => $r['content'],
        'ip' => $r['ip_address'] ?? '',
        'location' => $loc,
        'user_agent' => $r['user_agent'] ?? '',
        'referrer' => $r['referrer'] ?? '',
        'visitor_hash' => $r['visitor_hash'] ?? '',
        'hidden' => (int) ($r['is_hidden'] ?? 0),
        'is_deleted' => $isDeleted,
    ], JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
?>
<tr class="<?= adminRowClickable() ?> audit-row" data-audit="<?= $payload ?>">
    <td class="p-3 text-xs text-slate-500 whitespace-nowrap"><?= e($isDeleted ? ($r['deleted_at'] ?? '') : ($r['created_at'] ?? '')) ?></td>
    <td class="p-3 text-sm text-white font-medium"><?= e($r['author_name']) ?></td>
    <td class="p-3 text-xs text-blue-400 max-w-[100px] truncate"><?= e($r['post_title']) ?></td>
    <td class="p-3 text-xs font-mono text-slate-400"><?= e($r['ip_address'] ?? '—') ?></td>
    <td class="p-3 text-xs text-slate-500"><?= e($loc) ?></td>
    <td class="p-3 text-xs whitespace-nowrap">
        <?php if ($isDeleted): ?>
            <span class="text-red-400">Supprimé</span>
        <?php elseif ((int) ($r['is_hidden'] ?? 0)): ?>
            <span class="text-amber-400">Masqué</span>
        <?php else: ?>
            <span class="text-emerald-400">Actif</span>
        <?php endif; ?>
    </td>
</tr>
<?php endforeach; ?>
<?php adminTableEnd(); ?>

<?php adminPaginationRender($total, $page, $perPage, $queryBase); ?>

<?php adminModalOpen('auditModal'); ?>
<?php adminModalScripts(); ?>
<script>
document.querySelectorAll('.audit-row').forEach(row => {
    row.addEventListener('click', () => {
        const d = JSON.parse(row.dataset.audit);
        const html = `
            <dl class="space-y-3 text-sm">
                <div><dt class="text-slate-500 text-xs uppercase">Date</dt><dd class="text-white">${d.date}</dd></div>
                ${d.deleted ? `<div><dt class="text-slate-500 text-xs uppercase">Supprimé le</dt><dd class="text-red-400">${d.deleted}</dd></div>` : ''}
                ${d.expires ? `<div><dt class="text-slate-500 text-xs uppercase">Conservé jusqu'au</dt><dd class="text-slate-300">${d.expires}</dd></div>` : ''}
                <div><dt class="text-slate-500 text-xs uppercase">Auteur</dt><dd class="text-white">${d.author} ${d.email ? '('+d.email+')' : ''} <span class="text-blue-400">[${d.role}]</span></dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">Article</dt><dd class="text-blue-400">${d.post}</dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">Commentaire</dt><dd class="text-slate-300 whitespace-pre-wrap">${d.content}</dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">IP</dt><dd class="font-mono text-white">${d.ip}</dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">Localisation</dt><dd>${d.location}</dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">Navigateur</dt><dd class="text-xs break-all text-slate-400">${d.user_agent || '—'}</dd></div>
                <div><dt class="text-slate-500 text-xs uppercase">Statut</dt><dd>${d.is_deleted ? '<span class="text-red-400">Supprimé (archive)</span>' : (d.hidden ? '<span class="text-amber-400">Masqué</span>' : '<span class="text-emerald-400">Actif</span>')}</dd></div>
            </dl>`;
        adminOpenModal('auditModal', 'Audit #' + d.id, html);
    });
});
</script>
<?php
adminLayout('Journal d\'audit', ob_get_clean(), 'audit-logs.php', 'Archive 7 jours après suppression');
