<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$repo = new TestimonialRepository($db);
$appUrl = rtrim(env('APP_URL', ''), '/');
$filter = $_GET['filter'] ?? 'all';

$showForm = isset($_GET['new']) || isset($_GET['edit']);
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$editRow = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $action = $_POST['action'] ?? '';

    if ($action === 'delete') {
        $id = (int) ($_POST['id'] ?? 0);
        $s = $db->prepare('SELECT image FROM testimonials WHERE id = ?');
        $s->execute([$id]);
        $old = $s->fetchColumn();
        if (is_string($old) && $old !== '') {
            FileUploader::deleteIfLocal($old);
        }
        $db->prepare('DELETE FROM testimonials WHERE id = ?')->execute([$id]);
        adminSetFlash('Témoignage supprimé.');
        redirect('testimonials.php?' . ($filter !== 'all' ? 'filter=' . $filter : ''));
    }

    if ($action === 'approve') {
        $id = (int) ($_POST['id'] ?? 0);
        if ($id > 0) {
            $repo->approve($id);
            adminSetFlash('Témoignage approuvé — visible sur le site.');
        }
        redirect('testimonials.php?filter=pending');
    }

    if ($action === 'reject') {
        $id = (int) ($_POST['id'] ?? 0);
        if ($id > 0) {
            $repo->reject($id);
            adminSetFlash('Témoignage refusé et supprimé.');
        }
        redirect('testimonials.php?filter=pending');
    }

    if ($action === 'save') {
        $quote = trim((string) ($_POST['quote'] ?? ''));
        $name = trim((string) ($_POST['name'] ?? ''));
        $role = trim((string) ($_POST['role'] ?? ''));
        $company = trim((string) ($_POST['company'] ?? ''));
        $editIdPost = (int) ($_POST['id'] ?? 0);
        $imagePath = trim((string) ($_POST['image_current'] ?? ''));

        if ($quote === '' || $name === '') {
            adminSetFlash('Citation et nom obligatoires.');
            redirect('testimonials.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        try {
            if (!empty($_FILES['image_file']['name'])) {
                $imagePath = FileUploader::upload($_FILES['image_file'], 'testimonials');
            }
        } catch (RuntimeException $e) {
            adminSetFlash($e->getMessage());
            redirect('testimonials.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        if ($editIdPost > 0) {
            $db->prepare('UPDATE testimonials SET quote=?, name=?, role=?, company=?, image=? WHERE id=?')
                ->execute([$quote, $name, $role, $company, $imagePath ?: null, $editIdPost]);
        } else {
            $maxOrder = (int) $db->query('SELECT COALESCE(MAX(sort_order),0) FROM testimonials')->fetchColumn();
            $db->prepare(
                'INSERT INTO testimonials (quote, name, role, company, image, sort_order, is_active, is_approved) VALUES (?,?,?,?,?,?,1,1)'
            )->execute([$quote, $name, $role, $company, $imagePath ?: null, $maxOrder + 1]);
        }
        adminSetFlash('Témoignage enregistré.');
        redirect('testimonials.php');
    }
}

if ($editId > 0) {
    $s = $db->prepare('SELECT * FROM testimonials WHERE id = ?');
    $s->execute([$editId]);
    $editRow = $s->fetch() ?: null;
    if (!$editRow) {
        redirect('testimonials.php');
    }
    $showForm = true;
}

$where = '1=1';
if ($filter === 'pending') {
    $where .= ' AND is_approved = 0';
} elseif ($filter === 'approved') {
    $where .= ' AND is_approved = 1';
}

$rows = $db->query(
    "SELECT id, name, role, company, image, quote, is_approved, email, created_at
     FROM testimonials WHERE {$where} ORDER BY is_approved ASC, sort_order ASC, id DESC"
)->fetchAll();
$pendingCount = $repo->countPending();
$ia = adminInputAttrs();

ob_start();
?>
<?php if ($pendingCount > 0): ?>
<div class="mb-4 px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-sm">
    <strong><?= (int) $pendingCount ?></strong> témoignage<?= $pendingCount > 1 ? 's' : '' ?> en attente de validation.
    <a href="?filter=pending" class="underline font-bold ml-1">Voir la file</a>
</div>
<?php endif; ?>

<div class="flex flex-wrap gap-3 mb-4">
    <?= adminBtn('+ Nouveau témoignage', 'testimonials.php?new=1') ?>
    <?php if ($showForm): ?>
        <?= adminBtn('Annuler', 'testimonials.php', 'outline') ?>
    <?php endif; ?>
</div>

<div class="flex flex-wrap gap-2 mb-6">
    <a href="?filter=all" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Tous</a>
    <a href="?filter=pending" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">
        En attente<?= $pendingCount > 0 ? " ({$pendingCount})" : '' ?>
    </a>
    <a href="?filter=approved" class="px-4 py-2 rounded-xl text-xs font-bold <?= $filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' ?>">Approuvés</a>
</div>

<?php if ($showForm):
    $img = $editRow['image'] ?? '';
    $imgUrl = $img ? (str_starts_with($img, 'http') ? $img : $appUrl . $img) : '';
?>
<?php adminPanelStart('max-w-3xl mb-8'); ?>
    <h2 class="text-lg font-bold text-white mb-4"><?= $editRow ? 'Modifier le témoignage' : 'Nouveau témoignage (admin)' ?></h2>
    <p class="text-xs text-slate-500 mb-4">Les témoignages créés ici sont publiés directement sur le site.</p>
    <form method="post" enctype="multipart/form-data">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int) ($editRow['id'] ?? 0) ?>">
        <input type="hidden" name="image_current" value="<?= e($img) ?>">

        <div class="flex flex-wrap gap-6 mb-6 items-start">
            <div class="shrink-0">
                <?php if ($imgUrl): ?>
                    <img src="<?= e($imgUrl) ?>" alt="" class="w-24 h-24 rounded-full object-cover border-2 border-blue-500/50">
                <?php else: ?>
                    <div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-white/20 flex items-center justify-center text-4xl">👤</div>
                <?php endif; ?>
            </div>
            <div class="flex-1 min-w-[200px]">
                <?= adminLabel('Photo (optionnel)') ?>
                <input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif"
                    class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold file:text-xs">
            </div>
        </div>

        <?= adminLabel('Citation *') ?><textarea name="quote" rows="3" <?= $ia ?> required><?= e($editRow['quote'] ?? '') ?></textarea>
        <?= adminLabel('Nom *') ?><input name="name" <?= $ia ?> value="<?= e($editRow['name'] ?? '') ?>" required>
        <?= adminLabel('Rôle') ?><input name="role" <?= $ia ?> value="<?= e($editRow['role'] ?? '') ?>">
        <?= adminLabel('Entreprise') ?><input name="company" <?= $ia ?> value="<?= e($editRow['company'] ?? '') ?>">
        <p class="pt-4"><?= adminSubmitBtn() ?></p>
    </form>
<?php adminPanelEnd(); ?>
<?php endif; ?>

<?php adminTableStart(); adminTableHead(['', 'Nom', 'Rôle', 'Extrait', 'État', 'Actions']); ?>
<?php foreach ($rows as $r):
    $thumb = $r['image'] ?? '';
    $thumbUrl = $thumb ? (str_starts_with($thumb, 'http') ? $thumb : $appUrl . $thumb) : '';
    $pending = (int) ($r['is_approved'] ?? 1) === 0;
?>
<tr class="hover:bg-white/[0.02] align-middle <?= $pending ? 'bg-amber-500/5' : '' ?>">
    <td class="p-4 w-14">
        <?php if ($thumbUrl): ?>
            <img src="<?= e($thumbUrl) ?>" alt="" class="w-10 h-10 rounded-full object-cover">
        <?php else: ?>
            <span class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">👤</span>
        <?php endif; ?>
    </td>
    <td class="p-4">
        <div class="text-white font-medium"><?= e($r['name']) ?></div>
        <?php if (!empty($r['email'])): ?>
            <div class="text-slate-500 text-xs"><?= e($r['email']) ?></div>
        <?php endif; ?>
    </td>
    <td class="p-4 text-slate-300 text-sm"><?= e($r['role'] ?: '—') ?></td>
    <td class="p-4 text-slate-400 text-xs max-w-xs line-clamp-2"><?= e($r['quote']) ?></td>
    <td class="p-4">
        <?php if ($pending): ?>
            <span class="text-xs font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300">En attente</span>
        <?php else: ?>
            <span class="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300">Publié</span>
        <?php endif; ?>
    </td>
    <td class="p-4 flex flex-wrap gap-2">
        <?php if ($pending): ?>
            <form method="post" class="inline">
                <?= Csrf::field() ?>
                <input type="hidden" name="action" value="approve">
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">Approuver</button>
            </form>
            <form method="post" class="inline" onsubmit="return confirm('Refuser et supprimer ce témoignage ?');">
                <?= Csrf::field() ?>
                <input type="hidden" name="action" value="reject">
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold">Refuser</button>
            </form>
        <?php else: ?>
            <?= adminBtn('Modifier', 'testimonials.php?edit=' . (int) $r['id'], 'secondary') ?>
        <?php endif; ?>
        <form method="post" class="inline" onsubmit="return confirm('Supprimer ?');">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
            <?= adminDangerSubmit() ?>
        </form>
    </td>
</tr>
<?php endforeach; ?>
<?php adminTableEnd(); ?>

<?php if ($rows === [] && !$showForm): ?>
<p class="text-slate-500 mt-4">Aucun témoignage pour ce filtre.</p>
<?php endif; ?>

<?php
adminLayout('Témoignages', ob_get_clean(), 'testimonials.php', 'Validez les témoignages visiteurs avant publication');
