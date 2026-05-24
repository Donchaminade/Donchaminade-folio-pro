<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$repo = new RecommendationRepository($db);

$pager = adminPaginationState(25);
$page = $pager['page'];
$perPage = $pager['perPage'];
$offset = $pager['offset'];
$filter = $_GET['filter'] ?? 'all';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $id = (int) ($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    $returnPage = (int) ($_POST['page'] ?? $page);

    if ($id > 0) {
        if ($action === 'hide') {
            $repo->setHidden($id, true);
            adminSetFlash('Recommandation masquée (invisible sur le site).');
        }
        if ($action === 'unhide') {
            $repo->setHidden($id, false);
            adminSetFlash('Recommandation réaffichée sur le site.');
        }
        if ($action === 'delete') {
            $repo->delete($id);
            adminSetFlash('Recommandation supprimée.');
        }
    }
    redirect('recommendations.php?' . http_build_query(array_filter([
        'filter' => $filter !== 'all' ? $filter : null,
        'page' => $returnPage > 1 ? $returnPage : null,
    ])));
}

$where = '1=1';
if ($filter === 'hidden') {
    $where .= ' AND is_hidden = 1';
} elseif ($filter === 'visible') {
    $where .= ' AND is_hidden = 0';
}

$total = (int) $db->query("SELECT COUNT(*) FROM recommendations WHERE {$where}")->fetchColumn();
$rows = $db->query(
    "SELECT * FROM recommendations WHERE {$where} ORDER BY created_at DESC LIMIT {$perPage} OFFSET {$offset}"
)->fetchAll();

ob_start();
?>
<div class="flex flex-wrap gap-2 mb-4">
    <a href="?filter=all" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Toutes</a>
    <a href="?filter=visible" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'visible' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Visibles</a>
    <a href="?filter=hidden" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'hidden' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Masquées</a>
</div>

<?php adminTableStart(); adminTableHead(['Date', 'Auteur', 'Note', 'Extrait', 'État', 'Actions']); ?>
<?php foreach ($rows as $r): ?>
<tr class="hover:bg-white/[0.02] align-top">
    <td class="p-4 text-slate-400 text-xs whitespace-nowrap"><?= e(date('d/m/Y H:i', strtotime($r['created_at']))) ?></td>
    <td class="p-4">
        <div class="text-white font-medium"><?= e($r['name']) ?></div>
        <?php if ($r['role'] || $r['company']): ?>
            <div class="text-slate-500 text-xs mt-1"><?= e(trim($r['role'] . ($r['company'] ? ' — ' . $r['company'] : ''))) ?></div>
        <?php endif; ?>
        <?php if ($r['email']): ?>
            <div class="text-slate-600 text-xs"><?= e($r['email']) ?></div>
        <?php endif; ?>
    </td>
    <td class="p-4 text-amber-400 font-bold whitespace-nowrap"><?= (int) $r['rating'] ?>/5 ★</td>
    <td class="p-4 text-slate-400 text-xs max-w-xs line-clamp-3"><?= e($r['body']) ?></td>
    <td class="p-4">
        <?php if ((int) $r['is_hidden'] === 1): ?>
            <span class="text-xs font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300">Masquée</span>
        <?php else: ?>
            <span class="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300">Visible</span>
        <?php endif; ?>
    </td>
    <td class="p-4 flex flex-wrap gap-2">
        <?php if ((int) $r['is_hidden'] === 1): ?>
            <form method="post" class="inline">
                <?= Csrf::field() ?>
                <input type="hidden" name="action" value="unhide">
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                <input type="hidden" name="page" value="<?= $page ?>">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold">Afficher</button>
            </form>
        <?php else: ?>
            <form method="post" class="inline">
                <?= Csrf::field() ?>
                <input type="hidden" name="action" value="hide">
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                <input type="hidden" name="page" value="<?= $page ?>">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold">Masquer</button>
            </form>
        <?php endif; ?>
        <form method="post" class="inline" onsubmit="return confirm('Supprimer définitivement ?');">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
            <input type="hidden" name="page" value="<?= $page ?>">
            <?= adminDangerSubmit('Supprimer') ?>
        </form>
    </td>
</tr>
<?php endforeach; ?>
<?php adminTableEnd(); ?>

<?php if ($rows === []): ?>
<p class="text-slate-500 mt-4">Aucune recommandation pour ce filtre.</p>
<?php endif; ?>

<?php
$queryBase = $filter !== 'all' ? ['filter' => $filter] : [];
adminPaginationRender($total, $page, $perPage, $queryBase);
adminLayout('Recommandations', ob_get_clean(), 'recommendations.php', 'Avis laissés par les visiteurs — masquer ou supprimer');
