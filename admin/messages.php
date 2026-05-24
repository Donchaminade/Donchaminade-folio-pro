<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$contactRepo = new ContactRepository($db);
$appUrl = rtrim(env('APP_URL', ''), '/');

$platformLabels = [
    'google_meet' => 'Google Meet', 'zoom' => 'Zoom', 'teams' => 'Microsoft Teams',
    'phone' => 'Téléphone', 'whatsapp' => 'WhatsApp', 'other' => 'Autre',
];

$filter = $_GET['type'] ?? 'all';
$pager = adminPaginationState(25);
$page = $pager['page'];
$perPage = $pager['perPage'];
$offset = $pager['offset'];

$queryBase = $filter !== 'all' ? ['type' => $filter] : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'read') {
    Csrf::requireValid();
    $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([(int) $_POST['id']]);
    adminSetFlash('Message marqué comme lu.');
    $redir = ['type' => $filter, 'page' => (int) ($_POST['page'] ?? $page)];
    redirect('messages.php?' . http_build_query($redir));
}

$where = '1=1';
if ($filter === 'contact') {
    $where .= " AND message_type = 'contact'";
} elseif ($filter === 'collaboration') {
    $where .= " AND message_type = 'collaboration'";
}

$total = (int) $db->query("SELECT COUNT(*) FROM contact_messages WHERE {$where}")->fetchColumn();

$stmt = $db->prepare("SELECT id, message_type, name, email, message, is_read, created_at
    FROM contact_messages WHERE {$where} ORDER BY created_at DESC LIMIT ? OFFSET ?");
$stmt->bindValue(1, $perPage, PDO::PARAM_INT);
$stmt->bindValue(2, $offset, PDO::PARAM_INT);
$stmt->execute();
$listRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$viewId = (int) ($_GET['id'] ?? 0);
$viewRow = null;
$viewAttachments = [];
$detailHtml = '';
$modalTitle = '';

if ($viewId > 0) {
    $s = $db->prepare('SELECT * FROM contact_messages WHERE id = ?');
    $s->execute([$viewId]);
    $viewRow = $s->fetch(PDO::FETCH_ASSOC) ?: null;
    if ($viewRow) {
        $viewAttachments = $contactRepo->getAttachmentsGrouped([$viewId])[$viewId] ?? [];
        $modalTitle = ($viewRow['message_type'] === 'collaboration' ? 'Collaboration' : 'Contact')
            . ' — ' . $viewRow['name'];
        ob_start();
        $r = $viewRow;
        $isCollab = ($r['message_type'] ?? 'contact') === 'collaboration';
        $loc = ContactRepository::formatLocation($r);
        $atts = $viewAttachments;
        include __DIR__ . '/includes/message-detail.php';
        $detailHtml = ob_get_clean();
    }
}

ob_start();
?>
<div class="flex flex-wrap gap-2 mb-6">
    <a href="?type=all" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Tous</a>
    <a href="?type=collaboration" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'collaboration' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Collaborations</a>
    <a href="?type=contact" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'contact' ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Messages simples</a>
</div>

<?php adminTableStart(); adminTableHead(['', 'Date', 'Type', 'Expéditeur', 'Aperçu', '']); ?>
<?php foreach ($listRows as $r):
    $isUnread = !(int) $r['is_read'];
    $linkQ = array_merge($queryBase, ['page' => $page, 'id' => (int) $r['id']]);
    $preview = mb_substr(strip_tags($r['message']), 0, 80);
?>
<tr class="<?= adminRowClickable() ?>" onclick="window.location='messages.php?<?= e(http_build_query($linkQ)) ?>'">
    <td class="p-4 w-8"><?php if ($isUnread): ?><span class="w-2 h-2 rounded-full bg-blue-500 block" title="Non lu"></span><?php endif; ?></td>
    <td class="p-4 text-xs text-slate-500 whitespace-nowrap"><?= e($r['created_at']) ?></td>
    <td class="p-4">
        <?php if ($r['message_type'] === 'collaboration'): ?>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">Collab.</span>
        <?php else: ?>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-600 text-slate-300 font-bold">Contact</span>
        <?php endif; ?>
    </td>
    <td class="p-4">
        <div class="font-semibold text-white"><?= e($r['name']) ?></div>
        <div class="text-xs text-blue-400"><?= e($r['email']) ?></div>
    </td>
    <td class="p-4 text-slate-400 text-xs max-w-md truncate"><?= e($preview) ?>…</td>
    <td class="p-4 text-right">
        <span class="text-xs text-blue-400 font-semibold">Voir →</span>
    </td>
</tr>
<?php endforeach; ?>
<?php adminTableEnd(); ?>

<?php if ($listRows === []): ?>
<p class="text-slate-500 mt-4">Aucun message.</p>
<?php endif; ?>

<?php adminPaginationRender($total, $page, $perPage, $queryBase); ?>

<?php adminModalOpen('messageModal'); ?>
<div id="messageModal-actions" class="hidden"></div>

<?php if ($viewRow):
    ob_start();
    ?>
    <div class="sticky bottom-0 flex flex-wrap gap-3 px-6 py-4 border-t border-white/10 bg-slate-900/95 -mx-6 -mb-6 mt-4">
        <?php if (!(int) $viewRow['is_read']): ?>
        <form method="post" class="inline">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="read">
            <input type="hidden" name="id" value="<?= (int) $viewRow['id'] ?>">
            <input type="hidden" name="page" value="<?= $page ?>">
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white">Marquer comme lu</button>
        </form>
        <?php else: ?>
        <span class="text-emerald-400 text-sm font-semibold self-center">✓ Déjà lu</span>
        <?php endif; ?>
        <a href="messages.php?<?= e(http_build_query(array_merge($queryBase, ['page' => $page]))) ?>"
           class="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-slate-300 hover:bg-white/5">Fermer sans marquer lu</a>
    </div>
    <?php
    $detailHtml .= ob_get_clean();
?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    adminOpenModal('messageModal', <?= json_encode($modalTitle, JSON_UNESCAPED_UNICODE) ?>, <?= json_encode($detailHtml, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE) ?>);
});
</script>
<?php endif; ?>

<?php adminModalScripts(); ?>
<?php
$content = ob_get_clean();
adminLayout('Messages', $content, 'messages.php', 'Contact & demandes de collaboration — cliquez sur une ligne pour ouvrir');
