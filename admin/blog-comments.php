<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$blogRepo = new BlogRepository($db);

$filter = $_GET['filter'] ?? 'all';
$pager = adminPaginationState(30);
$page = $pager['page'];
$perPage = $pager['perPage'];
$offset = $pager['offset'];
$queryBase = $filter !== 'all' ? ['filter' => $filter] : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $commentId = (int) ($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    $returnPage = (int) ($_POST['page'] ?? $page);

    if ($action === 'hide' && $commentId > 0) {
        $blogRepo->setCommentHidden($commentId, true);
        adminSetFlash('Commentaire masqué.');
    }
    if ($action === 'unhide' && $commentId > 0) {
        $blogRepo->setCommentHidden($commentId, false);
        adminSetFlash('Commentaire réaffiché.');
    }
    if ($action === 'delete' && $commentId > 0) {
        $blogRepo->deleteComment($commentId);
        adminSetFlash('Commentaire supprimé. Conservé dans le journal d\'audit pendant 7 jours.');
    }
    if ($action === 'reply' && $commentId > 0) {
        $content = trim((string) ($_POST['content'] ?? ''));
        $parent = $blogRepo->getCommentById($commentId);
        if ($parent && $content !== '') {
            $blogRepo->addComment(
                (int) $parent['post_id'],
                $blogRepo->getAdminDisplayName(),
                $content,
                null,
                $commentId,
                true,
                'admin',
                captureVisitorMeta()
            );
            adminSetFlash('Réponse publiée.');
        }
    }
    redirect('blog-comments.php?' . http_build_query(array_merge($queryBase, ['page' => $returnPage])));
}

$where = '1=1';
if ($filter === 'hidden') {
    $where .= ' AND c.is_hidden = 1';
} elseif ($filter === 'admin') {
    $where .= " AND c.author_role = 'admin'";
} elseif ($filter === 'visitor') {
    $where .= " AND c.author_role = 'visitor'";
}

$total = (int) $db->query("SELECT COUNT(*) FROM blog_comments c WHERE {$where}")->fetchColumn();

$sql = "SELECT c.*, p.title AS post_title, p.slug AS post_slug, parent.author_name AS parent_author
        FROM blog_comments c
        JOIN blog_posts p ON p.id = c.post_id
        LEFT JOIN blog_comments parent ON parent.id = c.parent_id
        WHERE {$where}
        ORDER BY c.created_at DESC LIMIT {$perPage} OFFSET {$offset}";
$rows = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

ob_start();
?>
<div class="flex flex-wrap gap-2 mb-4">
    <a href="?filter=all" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Tous</a>
    <a href="?filter=visitor" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'visitor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Visiteurs</a>
    <a href="?filter=admin" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Auteur</a>
    <a href="?filter=hidden" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'hidden' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Masqués</a>
    <a href="audit-logs.php" class="ml-auto inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 text-blue-400 text-xs font-bold">Audit</a>
</div>

<?php adminTableStart(); adminTableHead(['Date', 'Auteur', 'Article', 'Commentaire', 'Statut', 'Actions']); ?>
<?php foreach ($rows as $c):
    $hidden = (int) ($c['is_hidden'] ?? 0);
    $cid = (int) $c['id'];
?>
<tr class="align-top hover:bg-white/[0.02]">
    <td class="p-3 text-xs text-slate-500 whitespace-nowrap"><?= e($c['created_at']) ?></td>
    <td class="p-3">
        <div class="font-semibold text-white text-sm"><?= e($c['author_name']) ?></div>
        <?php if (!empty($c['parent_author'])): ?>
            <div class="text-[10px] text-slate-500">↳ <?= e($c['parent_author']) ?></div>
        <?php endif; ?>
        <?php if (($c['author_role'] ?? '') === 'admin'): ?>
            <span class="text-[9px] text-blue-400 font-bold">AUTEUR</span>
        <?php endif; ?>
    </td>
    <td class="p-3 text-xs max-w-[140px]">
        <a href="<?= e(frontendUrl()) ?>/blog/<?= e($c['post_slug']) ?>" target="_blank" class="text-blue-400 hover:underline"><?= e(mb_substr($c['post_title'], 0, 40)) ?></a>
    </td>
    <td class="p-3 text-xs text-slate-400 max-w-xs"><p class="line-clamp-3"><?= e($c['content']) ?></p></td>
    <td class="p-3 text-xs"><?= $hidden ? '<span class="text-amber-400 font-bold">Masqué</span>' : '<span class="text-emerald-400">Visible</span>' ?></td>
    <td class="p-3">
        <div class="flex flex-wrap gap-1">
            <?php if ($hidden): ?>
            <form method="post" class="inline"><?= Csrf::field() ?><input type="hidden" name="action" value="unhide"><input type="hidden" name="id" value="<?= $cid ?>"><input type="hidden" name="page" value="<?= $page ?>">
                <button type="submit" class="px-2 py-1 rounded-lg bg-emerald-600/80 text-[10px] font-bold text-white">Afficher</button></form>
            <?php else: ?>
            <form method="post" class="inline"><?= Csrf::field() ?><input type="hidden" name="action" value="hide"><input type="hidden" name="id" value="<?= $cid ?>"><input type="hidden" name="page" value="<?= $page ?>">
                <button type="submit" class="px-2 py-1 rounded-lg bg-amber-600/80 text-[10px] font-bold text-white">Masquer</button></form>
            <?php endif; ?>
            <form method="post" class="inline" onsubmit="return confirm('Supprimer ?');"><?= Csrf::field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= $cid ?>"><input type="hidden" name="page" value="<?= $page ?>">
                <button type="submit" class="px-2 py-1 rounded-lg bg-red-600/80 text-[10px] font-bold text-white">Suppr.</button></form>
            <button type="button" class="px-2 py-1 rounded-lg bg-blue-600/80 text-[10px] font-bold text-white btn-reply"
                    data-id="<?= $cid ?>" data-author="<?= e($c['author_name']) ?>">Répondre</button>
            <a href="audit-logs.php?q=<?= urlencode($c['ip_address'] ?? '') ?>" class="px-2 py-1 rounded-lg border border-white/10 text-[10px] text-slate-400">Audit</a>
        </div>
    </td>
</tr>
<?php endforeach; ?>
<?php adminTableEnd(); ?>

<?php adminPaginationRender($total, $page, $perPage, $queryBase); ?>

<div id="replyModal" class="admin-modal hidden fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 class="text-white font-bold">Répondre à <span id="replyAuthorName"></span></h2>
            <button type="button" class="admin-modal-close p-2 text-slate-400"><?= adminIcon('x', 'w-5 h-5') ?></button>
        </div>
        <form method="post" class="p-6 space-y-3">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="reply">
            <input type="hidden" name="id" id="replyCommentId" value="">
            <input type="hidden" name="page" value="<?= $page ?>">
            <textarea name="content" rows="4" required class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm" placeholder="Votre réponse…"></textarea>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold">Publier</button>
        </form>
    </div>
</div>

<?php adminModalScripts(); ?>
<script>
document.querySelectorAll('.btn-reply').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('replyCommentId').value = btn.dataset.id;
        document.getElementById('replyAuthorName').textContent = btn.dataset.author;
        document.getElementById('replyModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});
</script>
<?php
adminLayout('Commentaires', ob_get_clean(), 'blog-comments.php', 'Modération en tableau paginé');
