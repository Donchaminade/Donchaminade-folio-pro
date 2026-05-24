<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';
require_once __DIR__ . '/includes/editor.php';
require_once __DIR__ . '/includes/tech-picker.php';

Auth::requireAdmin();
$db = Database::connection();

$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $postAction = $_POST['action'] ?? '';

    if ($postAction === 'delete' && !empty($_POST['id'])) {
        $db->prepare('DELETE FROM experiences WHERE id = ?')->execute([(int) $_POST['id']]);
        adminSetFlash('Expérience supprimée.');
        redirect('experiences.php');
    }

    if ($postAction === 'save') {
        $company = trim((string) ($_POST['company'] ?? ''));
        $role = trim((string) ($_POST['role'] ?? ''));
        $period = trim((string) ($_POST['period'] ?? ''));
        $sortOrder = (int) ($_POST['sort_order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $descriptions = array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) ($_POST['descriptions'] ?? ''))));
        $tags = [];
        if (!empty($_POST['technologies']) && is_array($_POST['technologies'])) {
            $tags = array_filter(array_map('trim', $_POST['technologies']));
        } else {
            $tags = array_filter(array_map('trim', explode(',', (string) ($_POST['tags'] ?? ''))));
        }
        $editId = (int) ($_POST['id'] ?? 0);

        if ($company === '' || $role === '' || $period === '') {
            adminSetFlash('Entreprise, rôle et période obligatoires.');
            redirect('experiences.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($editId > 0) {
            $db->prepare('UPDATE experiences SET company=?, role=?, period=?, sort_order=?, is_active=? WHERE id=?')
                ->execute([$company, $role, $period, $sortOrder, $isActive, $editId]);
            $expId = $editId;
            adminSetFlash('Expérience mise à jour.');
        } else {
            $db->prepare('INSERT INTO experiences (company, role, period, sort_order, is_active) VALUES (?,?,?,?,?)')
                ->execute([$company, $role, $period, $sortOrder, $isActive]);
            $expId = (int) $db->lastInsertId();
            adminSetFlash('Expérience créée.');
        }

        $db->prepare('DELETE FROM experience_descriptions WHERE experience_id = ?')->execute([$expId]);
        $descStmt = $db->prepare('INSERT INTO experience_descriptions (experience_id, content, sort_order) VALUES (?,?,?)');
        foreach ($descriptions as $i => $content) {
            $descStmt->execute([$expId, $content, $i]);
        }

        $db->prepare('DELETE FROM experience_tags WHERE experience_id = ?')->execute([$expId]);
        $tagStmt = $db->prepare('INSERT INTO experience_tags (experience_id, tag) VALUES (?,?)');
        foreach ($tags as $tag) {
            $tagStmt->execute([$expId, $tag]);
        }

        redirect('experiences.php');
    }
}

ob_start();
$ia = adminInputAttrs();

if ($action === 'create' || $action === 'edit') {
    $exp = ['company' => '', 'role' => '', 'period' => '', 'sort_order' => 0, 'is_active' => 1, 'descriptions' => '', 'selectedTechs' => []];
    if ($action === 'edit' && $id > 0) {
        $stmt = $db->prepare('SELECT * FROM experiences WHERE id = ?');
        $stmt->execute([$id]);
        if ($row = $stmt->fetch()) {
            $exp = $row;
            $d = $db->prepare('SELECT content FROM experience_descriptions WHERE experience_id = ? ORDER BY sort_order');
            $d->execute([$id]);
            $exp['descriptions'] = implode("\n", array_column($d->fetchAll(), 'content'));
            $t = $db->prepare('SELECT tag FROM experience_tags WHERE experience_id = ?');
            $t->execute([$id]);
            $exp['selectedTechs'] = array_column($t->fetchAll(), 'tag');
        }
    }
    adminPanelStart('max-w-3xl');
    ?>
        <form method="post" class="space-y-1">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="<?= (int) ($exp['id'] ?? 0) ?>">
            <?= adminLabel('Entreprise *') ?><input name="company" <?= $ia ?> value="<?= e($exp['company']) ?>" required>
            <?= adminLabel('Rôle *') ?><input name="role" <?= $ia ?> value="<?= e($exp['role']) ?>" required>
            <?= adminLabel('Période *') ?><input name="period" <?= $ia ?> value="<?= e($exp['period']) ?>" placeholder="Février 2026 - Présent" required>
            <?= adminLabel('Descriptions (une par ligne)') ?><textarea name="descriptions" rows="6" <?= $ia ?>><?= e($exp['descriptions'] ?? '') ?></textarea>
            <?= adminLabel('Technologies') ?>
            <?php adminTechPicker($db, $exp['selectedTechs'] ?? []); ?>
            <?= adminLabel('Ordre') ?><input type="number" name="sort_order" <?= $ia ?> value="<?= (int) ($exp['sort_order'] ?? 0) ?>">
            <label class="flex items-center gap-2 mt-4 text-sm text-slate-300"><input type="checkbox" name="is_active" class="rounded" <?= ($exp['is_active'] ?? 1) ? 'checked' : '' ?>> Actif</label>
            <div class="flex gap-3 pt-6"><?= adminSubmitBtn() ?> <?= adminBtn('Annuler', 'experiences.php', 'secondary') ?></div>
        </form>
    <?php
    adminPanelEnd();
} else {
    $rows = $db->query('SELECT id, company, role, period, sort_order, is_active FROM experiences ORDER BY sort_order ASC, id DESC')->fetchAll();
    ?>
    <div class="mb-6"><?= adminBtn('+ Nouvelle expérience', 'experiences.php?action=create') ?></div>
    <?php adminTableStart();
    adminTableHead(['Rôle', 'Entreprise', 'Période', 'Ordre', 'Actions']);
    foreach ($rows as $r): ?>
        <tr class="hover:bg-white/[0.02]">
            <td class="p-4 font-medium text-white"><?= e($r['role']) ?></td>
            <td class="p-4 text-slate-300"><?= e($r['company']) ?></td>
            <td class="p-4 text-slate-400"><?= e($r['period']) ?></td>
            <td class="p-4 text-slate-400"><?= (int) $r['sort_order'] ?></td>
            <td class="p-4 flex flex-wrap gap-2">
                <?= adminBtn('Modifier', 'experiences.php?action=edit&id=' . (int) $r['id'], 'secondary') ?>
                <form method="post" class="inline" onsubmit="return confirm('Supprimer ?');">
                    <?= Csrf::field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                    <?= adminDangerSubmit() ?>
                </form>
            </td>
        </tr>
    <?php endforeach;
    adminTableEnd();
}

adminLayout('Expériences', ob_get_clean(), 'experiences.php');
