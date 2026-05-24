<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();

$showForm = isset($_GET['new']) || isset($_GET['edit']);
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$editRow = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();

    if (($_POST['action'] ?? '') === 'delete') {
        $db->prepare('DELETE FROM awards WHERE id = ?')->execute([(int) ($_POST['id'] ?? 0)]);
        adminSetFlash('Distinction supprimée.');
        redirect('awards.php');
    }

    if (($_POST['action'] ?? '') === 'save') {
        $title = trim((string) ($_POST['title'] ?? ''));
        $issuer = trim((string) ($_POST['issuer'] ?? ''));
        $year = trim((string) ($_POST['year'] ?? ''));
        $description = trim((string) ($_POST['description'] ?? ''));
        $editIdPost = (int) ($_POST['id'] ?? 0);

        if ($title === '' || $year === '') {
            adminSetFlash('Titre et année obligatoires.');
            redirect('awards.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        if ($editIdPost > 0) {
            $db->prepare('UPDATE awards SET title=?, issuer=?, year=?, description=? WHERE id=?')
                ->execute([$title, $issuer, $year, $description, $editIdPost]);
        } else {
            $maxOrder = (int) $db->query('SELECT COALESCE(MAX(sort_order),0) FROM awards')->fetchColumn();
            $db->prepare('INSERT INTO awards (title, issuer, year, description, sort_order) VALUES (?,?,?,?,?)')
                ->execute([$title, $issuer, $year, $description, $maxOrder + 1]);
        }
        adminSetFlash('Distinction enregistrée.');
        redirect('awards.php');
    }
}

if ($editId > 0) {
    $s = $db->prepare('SELECT * FROM awards WHERE id = ?');
    $s->execute([$editId]);
    $editRow = $s->fetch() ?: null;
    if (!$editRow) {
        redirect('awards.php');
    }
    $showForm = true;
}

$rows = $db->query('SELECT id, title, issuer, year, description FROM awards ORDER BY sort_order ASC, year DESC, id DESC')->fetchAll();
$ia = adminInputAttrs();

ob_start();
?>
<div class="flex flex-wrap gap-3 mb-6">
    <?= adminBtn('+ Nouvelle distinction', 'awards.php?new=1') ?>
    <?php if ($showForm): ?>
        <?= adminBtn('Annuler', 'awards.php', 'outline') ?>
    <?php endif; ?>
</div>

<?php if ($showForm): ?>
<?php adminPanelStart('max-w-2xl mb-8'); ?>
    <h2 class="text-lg font-bold text-white mb-4"><?= $editRow ? 'Modifier la distinction' : 'Nouvelle distinction' ?></h2>
    <form method="post">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int) ($editRow['id'] ?? 0) ?>">
        <?= adminLabel('Titre *') ?>
        <input name="title" <?= $ia ?> value="<?= e($editRow['title'] ?? '') ?>" required placeholder="Ex. 1er Prix Hackathon Ecole IA">
        <?= adminLabel('Organisme / événement') ?>
        <input name="issuer" <?= $ia ?> value="<?= e($editRow['issuer'] ?? '') ?>" placeholder="Ex. ACAN, MLH Togo…">
        <?= adminLabel('Année *') ?>
        <input name="year" <?= $ia ?> value="<?= e($editRow['year'] ?? date('Y')) ?>" required maxlength="20" class="max-w-[120px]">
        <?= adminLabel('Description') ?>
        <textarea name="description" rows="4" <?= $ia ?> placeholder="Courte description affichée sur le site…"><?= e($editRow['description'] ?? '') ?></textarea>
        <p class="pt-4"><?= adminSubmitBtn() ?></p>
    </form>
<?php adminPanelEnd(); ?>
<?php endif; ?>

<?php adminTableStart(); adminTableHead(['', 'Titre', 'Organisme', 'Actions']); ?>
<?php foreach ($rows as $r): ?>
<tr class="hover:bg-white/[0.02] align-middle">
    <td class="p-4 w-14">
        <span class="inline-flex min-w-[2.5rem] justify-center text-xs font-black px-2 py-1 rounded-md bg-blue-500/20 text-blue-300"><?= e($r['year']) ?></span>
    </td>
    <td class="p-4 text-white font-medium"><?= e($r['title']) ?></td>
    <td class="p-4 text-slate-300"><?= e($r['issuer'] ?: '—') ?></td>
    <td class="p-4 flex flex-wrap gap-2">
        <?= adminBtn('Modifier', 'awards.php?edit=' . (int) $r['id'], 'secondary') ?>
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
<p class="text-slate-500 mt-4">Aucune distinction. Cliquez sur « Nouvelle distinction ».</p>
<?php endif; ?>

<?php
adminLayout('Distinctions', ob_get_clean(), 'awards.php', 'Prix, hackathons et récompenses affichés sur la page À propos');
