<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/database/sync-projects.php';
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

    if ($postAction === 'sync_catalog') {
        try {
            $r = syncProjectsFromCatalog($db);
            adminSetFlash("Catalogue synchronisé : {$r['created']} ajouté(s), {$r['updated']} mis à jour — {$r['total']} projets au total.");
        } catch (Throwable $e) {
            adminSetFlash('Erreur sync : ' . $e->getMessage());
        }
        redirect('projects.php');
    }

    if ($postAction === 'delete' && !empty($_POST['id'])) {
        $pid = (int) $_POST['id'];
        $row = $db->prepare('SELECT image FROM projects WHERE id = ?');
        $row->execute([$pid]);
        if ($main = $row->fetchColumn()) {
            FileUploader::deleteIfLocal((string) $main);
        }
        $imgs = $db->prepare('SELECT url FROM project_images WHERE project_id = ?');
        $imgs->execute([$pid]);
        foreach ($imgs->fetchAll() as $img) {
            FileUploader::deleteIfLocal((string) ($img['url'] ?? ''));
        }
        $db->prepare('DELETE FROM projects WHERE id = ?')->execute([$pid]);
        adminSetFlash('Projet supprimé.');
        redirect('projects.php');
    }

    if ($postAction === 'save') {
        $title = trim((string) ($_POST['title'] ?? ''));
        $description = trim((string) ($_POST['description'] ?? ''));
        $detailed = trim((string) ($_POST['detailed_description'] ?? ''));
        $editId = (int) ($_POST['id'] ?? 0);
        try {
            $image = adminResolveUploadedFile('image_file', 'projects', $_POST['image_file_current'] ?? '');
        } catch (Throwable $e) {
            adminSetFlash($e->getMessage());
            redirect('projects.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }
        $link = trim((string) ($_POST['link'] ?? '#'));
        $github = trim((string) ($_POST['github'] ?? '#'));
        $type = in_array($_POST['type'] ?? '', ['Web', 'Mobile', 'Design'], true) ? $_POST['type'] : 'Web';
        $sortOrder = (int) ($_POST['sort_order'] ?? 0);
        $isFeatured = isset($_POST['is_featured']) ? 1 : 0;
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $tags = [];
        if (!empty($_POST['technologies']) && is_array($_POST['technologies'])) {
            $tags = array_filter(array_map('trim', $_POST['technologies']));
        } else {
            $tags = array_filter(array_map('trim', explode(',', (string) ($_POST['tags'] ?? ''))));
        }

        if ($title === '' || $description === '') {
            adminSetFlash('Titre et description obligatoires.');
            redirect('projects.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($editId > 0) {
            $stmt = $db->prepare('UPDATE projects SET title=?, description=?, detailed_description=?, image=?, link=?, github=?, type=?, sort_order=?, is_featured=?, is_active=? WHERE id=?');
            $stmt->execute([$title, $description, $detailed ?: null, $image, $link, $github, $type, $sortOrder, $isFeatured, $isActive, $editId]);
            $projectId = $editId;
            adminSetFlash('Projet mis à jour.');
        } else {
            $stmt = $db->prepare('INSERT INTO projects (title, description, detailed_description, image, link, github, type, sort_order, is_featured, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)');
            $stmt->execute([$title, $description, $detailed ?: null, $image, $link, $github, $type, $sortOrder, $isFeatured, $isActive]);
            $projectId = (int) $db->lastInsertId();
            adminSetFlash('Projet créé.');
        }

        $db->prepare('DELETE FROM project_tags WHERE project_id = ?')->execute([$projectId]);
        $tagStmt = $db->prepare('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)');
        foreach ($tags as $tag) {
            $tagStmt->execute([$projectId, $tag]);
        }

        $keepDetail = [];
        if (!empty($_POST['detail_images_keep']) && is_array($_POST['detail_images_keep'])) {
            $keepDetail = array_values(array_filter(array_map('trim', $_POST['detail_images_keep'])));
        }
        $newDetail = adminResolveMultipleUploadedFiles('detail_images', 'projects');
        adminSaveProjectDetailImages($db, $projectId, $keepDetail, $newDetail);

        redirect('projects.php');
    }
}

ob_start();

if ($action === 'create' || $action === 'edit') {
    $project = ['title' => '', 'description' => '', 'detailed_description' => '', 'image' => '', 'link' => '#', 'github' => '#', 'type' => 'Web', 'sort_order' => 0, 'is_featured' => 0, 'is_active' => 1, 'selectedTechs' => [], 'detailImages' => []];
    if ($action === 'edit' && $id > 0) {
        $stmt = $db->prepare('SELECT * FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            $project = $row;
            $t = $db->prepare('SELECT tag FROM project_tags WHERE project_id = ?');
            $t->execute([$id]);
            $project['selectedTechs'] = array_column($t->fetchAll(), 'tag');
            $im = $db->prepare('SELECT url, sort_order FROM project_images WHERE project_id = ? ORDER BY sort_order ASC');
            $im->execute([$id]);
            $project['detailImages'] = $im->fetchAll();
        }
    }
    ?>
    <?php $ia = adminInputAttrs(); ?>
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6 max-w-3xl shadow-xl">
        <form method="post" enctype="multipart/form-data" class="space-y-3">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="<?= (int) ($project['id'] ?? 0) ?>">
            <label class="block text-sm font-semibold text-slate-400">Titre *</label>
            <input name="title" <?= $ia ?> value="<?= e($project['title']) ?>" required>
            <label class="block text-sm font-semibold text-slate-400">Description courte *</label>
            <textarea name="description" <?= $ia ?> required><?= e($project['description']) ?></textarea>
            <label class="block text-sm font-semibold text-slate-400">Description détaillée</label>
            <textarea name="detailed_description" rows="4" <?= $ia ?>><?= e($project['detailed_description'] ?? '') ?></textarea>
            <?php adminFileField('image_file', 'Image principale (vignette)', 'image/*', $project['image'] ?? null); ?>
            <?php adminProjectDetailImagesField($project['detailImages'] ?? []); ?>
            <label class="block text-sm font-semibold text-slate-400 mt-6">Lien démo (URL du site)</label>
            <input name="link" <?= $ia ?> value="<?= e($project['link'] ?? '#') ?>" placeholder="https://...">
            <label class="block text-sm font-semibold text-slate-400">GitHub (URL)</label>
            <input name="github" <?= $ia ?> value="<?= e($project['github'] ?? '#') ?>">
            <label class="block text-sm font-semibold text-slate-400">Type</label>
            <select name="type" class="mt-1 w-full max-w-xl px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white">
                <?php foreach (['Web', 'Mobile', 'Design'] as $t): ?>
                    <option value="<?= $t ?>" <?= ($project['type'] ?? '') === $t ? 'selected' : '' ?>><?= $t ?></option>
                <?php endforeach; ?>
            </select>
            <?= adminLabel('Stack / technologies') ?>
            <?php adminTechPicker($db, $project['selectedTechs'] ?? []); ?>
            <label class="block text-sm font-semibold text-slate-400">Ordre</label>
            <input type="number" name="sort_order" <?= $ia ?> value="<?= (int) ($project['sort_order'] ?? 0) ?>">
            <label class="flex items-center gap-2 mt-2"><input type="checkbox" name="is_featured" <?= !empty($project['is_featured']) ? 'checked' : '' ?>> Mis en avant</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="is_active" <?= ($project['is_active'] ?? 1) ? 'checked' : '' ?>> Actif</label>
            <p class="pt-4 flex gap-3">
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white">Enregistrer</button>
                <?= adminBtn('Annuler', 'projects.php', 'secondary') ?>
            </p>
        </form>
    </div>
    <?php
} else {
    $rows = $db->query('SELECT id, title, type, sort_order, is_featured, is_active FROM projects ORDER BY sort_order ASC, id DESC')->fetchAll();
    $detailCounts = [];
    foreach ($db->query('SELECT project_id, COUNT(*) AS c FROM project_images GROUP BY project_id')->fetchAll() as $dc) {
        $detailCounts[(int) $dc['project_id']] = (int) $dc['c'];
    }
    ?>
    <div class="mb-6 flex flex-wrap gap-3 items-center">
        <?= adminBtn('+ Nouveau projet', 'projects.php?action=create') ?>
        <form method="post" class="inline" onsubmit="return confirm('Importer / mettre à jour tous les projets du catalogue ?');">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="sync_catalog">
            <button type="submit" class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-transparent border border-blue-500/40 text-blue-400 hover:bg-blue-500/10">Synchroniser le catalogue</button>
        </form>
    </div>
    <?php adminTableStart();
    adminTableHead(['Titre', 'Type', 'Ordre', 'Accueil', 'Actif', 'Actions']);
    foreach ($rows as $r): ?>
        <tr class="hover:bg-white/[0.02]">
            <td class="p-4 font-medium text-white">
                <?= e($r['title']) ?>
                <?php
                $imgCount = $detailCounts[(int) $r['id']] ?? 0;
                if ($imgCount > 0): ?>
                    <span class="ml-2 text-[10px] font-bold uppercase tracking-widest text-violet-400"><?= $imgCount ?> capture<?= $imgCount > 1 ? 's' : '' ?></span>
                <?php endif; ?>
            </td>
            <td class="p-4 text-slate-400"><?= e($r['type']) ?></td>
            <td class="p-4 text-slate-400"><?= (int) $r['sort_order'] ?></td>
            <td class="p-4 text-slate-400"><?= $r['is_featured'] ? 'Oui' : '—' ?></td>
            <td class="p-4 text-slate-400"><?= $r['is_active'] ? 'Oui' : 'Non' ?></td>
            <td class="p-4 flex flex-wrap gap-2">
                <?= adminBtn('Modifier', 'projects.php?action=edit&id=' . (int) $r['id'], 'secondary') ?>
                <form method="post" class="inline" onsubmit="return confirm('Supprimer ce projet ?');">
                    <?= Csrf::field() ?>
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                    <?= adminDangerSubmit() ?>
                </form>
            </td>
        </tr>
    <?php
    endforeach;
    adminTableEnd();
}

adminLayout('Projets', ob_get_clean(), 'projects.php');
