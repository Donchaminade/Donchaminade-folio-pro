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
    $postAction = $_POST['action'] ?? '';

    if ($postAction === 'delete') {
        $db->prepare('DELETE FROM stats WHERE id = ?')->execute([(int) $_POST['id']]);
        adminSetFlash('Stat supprimée.');
        redirect('stats.php');
    }

    if ($postAction === 'save') {
        $label = trim((string) ($_POST['label'] ?? ''));
        $value = trim((string) ($_POST['value'] ?? ''));
        $suffix = trim((string) ($_POST['suffix'] ?? ''));
        $sortOrder = (int) ($_POST['sort_order'] ?? 0);
        $editIdPost = (int) ($_POST['id'] ?? 0);

        if ($label === '' || $value === '') {
            adminSetFlash('Label et valeur obligatoires.');
            redirect('stats.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        if ($editIdPost > 0) {
            $db->prepare('UPDATE stats SET label=?, value=?, suffix=?, sort_order=? WHERE id=?')
                ->execute([$label, $value, $suffix ?: null, $sortOrder, $editIdPost]);
        } else {
            $db->prepare('INSERT INTO stats (label, value, suffix, sort_order) VALUES (?,?,?,?)')
                ->execute([$label, $value, $suffix ?: null, $sortOrder]);
        }
        adminSetFlash('Stat enregistrée.');
        redirect('stats.php');
    }
}

if ($editId > 0) {
    $s = $db->prepare('SELECT * FROM stats WHERE id = ?');
    $s->execute([$editId]);
    $editRow = $s->fetch() ?: null;
    if (!$editRow) {
        redirect('stats.php');
    }
    $showForm = true;
}

$rows = $db->query('SELECT id, label, value, suffix, sort_order FROM stats ORDER BY sort_order ASC, id ASC')->fetchAll();
$ia = adminInputAttrs();

ob_start();
?>
<div class="flex flex-wrap gap-3 mb-6">
    <?= adminBtn('+ Nouvelle statistique', 'stats.php?new=1') ?>
    <?php if ($showForm): ?>
        <?= adminBtn('Annuler', 'stats.php', 'outline') ?>
    <?php endif; ?>
</div>

<?php if ($showForm): ?>
<?php adminPanelStart('max-w-xl mb-8'); ?>
    <h2 class="text-lg font-bold text-white mb-4"><?= $editRow ? 'Modifier la statistique' : 'Nouvelle statistique' ?></h2>
    <form method="post">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int) ($editRow['id'] ?? 0) ?>">
        <?= adminLabel('Label *') ?>
        <input name="label" <?= $ia ?> value="<?= e($editRow['label'] ?? '') ?>" required placeholder="Ex. Expérience Web">
        <?= adminLabel('Valeur *') ?>
        <input name="value" <?= $ia ?> value="<?= e($editRow['value'] ?? '') ?>" required placeholder="Ex. 3">
        <?= adminLabel('Suffixe (ans, +, etc.)') ?>
        <input name="suffix" <?= $ia ?> value="<?= e($editRow['suffix'] ?? '') ?>" placeholder="ans">
        <?= adminLabel('Ordre d\'affichage') ?>
        <input type="number" name="sort_order" <?= $ia ?> value="<?= (int) ($editRow['sort_order'] ?? 0) ?>" class="max-w-[120px]">
        <p class="pt-4"><?= adminSubmitBtn() ?></p>
    </form>
<?php adminPanelEnd(); ?>
<?php endif; ?>

<?php adminTableStart(); adminTableHead(['Label', 'Valeur', 'Actions']); ?>
<?php foreach ($rows as $r): ?>
<tr class="hover:bg-white/[0.02] align-middle">
    <td class="p-4 text-white font-medium"><?= e($r['label']) ?></td>
    <td class="p-4 text-slate-300">
        <span class="text-lg font-black text-blue-400"><?= e($r['value']) ?></span><?= $r['suffix'] ? ' <span class="text-slate-500 text-sm">' . e($r['suffix']) . '</span>' : '' ?>
    </td>
    <td class="p-4 flex flex-wrap gap-2">
        <?= adminBtn('Modifier', 'stats.php?edit=' . (int) $r['id'], 'secondary') ?>
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
<p class="text-slate-500 mt-4">Aucune statistique. Cliquez sur « Nouvelle statistique ».</p>
<?php endif; ?>

<?php
adminLayout('Statistiques', ob_get_clean(), 'stats.php', 'Chiffres affichés sous le hero du portfolio');
