<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';
require_once __DIR__ . '/includes/editor.php';

Auth::requireAdmin();
$db = Database::connection();
$catalog = require dirname(__DIR__) . '/database/technologies-catalog.php';

if (isset($_GET['sync']) && $_GET['sync'] === '1') {
    $stmt = $db->prepare('INSERT INTO technologies (name, icon_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE icon_url = VALUES(icon_url)');
    foreach ($catalog as $name => $url) {
        $stmt->execute([$name, $url]);
    }
    adminSetFlash('Catalogue Devicon synchronisé (' . count($catalog) . ' technologies).');
    redirect('technologies.php');
}

$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $postAction = $_POST['action'] ?? '';

    if ($postAction === 'delete' && !empty($_POST['id'])) {
        $db->prepare('DELETE FROM technologies WHERE id = ?')->execute([(int) $_POST['id']]);
        adminSetFlash('Technologie supprimée.');
        redirect('technologies.php');
    }

    if ($postAction === 'save') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $iconUrl = trim((string) ($_POST['icon_url'] ?? ''));
        $editId = (int) ($_POST['id'] ?? 0);

        try {
            if (!empty($_FILES['icon_file']['name'])) {
                $iconUrl = FileUploader::upload($_FILES['icon_file'], 'technologies');
            }
        } catch (Throwable $e) {
            adminSetFlash($e->getMessage());
            redirect('technologies.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($name === '' || $iconUrl === '') {
            adminSetFlash('Nom et icône obligatoires.');
            redirect('technologies.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($editId > 0) {
            $db->prepare('UPDATE technologies SET name=?, icon_url=? WHERE id=?')->execute([$name, $iconUrl, $editId]);
            adminSetFlash('Technologie mise à jour.');
        } else {
            $db->prepare('INSERT INTO technologies (name, icon_url) VALUES (?, ?)')->execute([$name, $iconUrl]);
            adminSetFlash('Technologie ajoutée.');
        }
        redirect('technologies.php');
    }
}

ob_start();
$ia = adminInputAttrs();

if ($action === 'create' || $action === 'edit') {
    $tech = ['name' => '', 'icon_url' => ''];
    if ($action === 'edit' && $id > 0) {
        $stmt = $db->prepare('SELECT * FROM technologies WHERE id = ?');
        $stmt->execute([$id]);
        $tech = $stmt->fetch() ?: $tech;
    }
    adminPanelStart('max-w-3xl');
    ?>
    <form method="post" enctype="multipart/form-data">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int) ($tech['id'] ?? 0) ?>">
        <?= adminLabel('Nom (ex: React, PHP)') ?><input name="name" <?= $ia ?> value="<?= e($tech['name']) ?>" required>
        <?= adminLabel('URL de l\'icône (SVG/PNG)') ?><input name="icon_url" <?= $ia ?> value="<?= e($tech['icon_url'] ?? '') ?>" placeholder="https://cdn.jsdelivr.net/...">
        <p class="text-xs text-slate-500 mt-2 mb-3">Raccourcis populaires :</p>
        <div class="flex flex-wrap gap-2 mb-4">
            <?php foreach (['Java', 'Spring Boot', 'Kotlin', 'React', 'PHP', 'Flutter', 'Next.js', 'MySQL', 'Laravel', 'Docker', 'Tailwind CSS'] as $preset):
                if (!isset($catalog[$preset])) continue; ?>
                <button type="button" onclick="document.querySelector('[name=icon_url]').value='<?= e($catalog[$preset]) ?>'; document.querySelector('[name=name]').value='<?= e($preset) ?>'"
                    class="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-slate-300 hover:border-blue-500/50 flex items-center gap-2">
                    <img src="<?= e($catalog[$preset]) ?>" alt="" class="w-4 h-4"> <?= e($preset) ?>
                </button>
            <?php endforeach; ?>
        </div>
        <?php adminFileField('icon_file', 'Ou téléverser votre propre icône', 'image/*,.svg', $tech['icon_url'] ?? null); ?>
        <div class="flex gap-3 pt-4"><?= adminSubmitBtn() ?> <?= adminBtn('Annuler', 'technologies.php', 'secondary') ?></div>
    </form>
    <?php
    adminPanelEnd();
} else {
    $rows = $db->query('SELECT * FROM technologies ORDER BY name ASC')->fetchAll();
    ?>
    <div class="flex flex-wrap gap-3 mb-4">
        <?= adminBtn('+ Ajouter', 'technologies.php?action=create') ?>
        <?= adminBtn('Importer le catalogue', 'technologies.php?sync=1', 'secondary') ?>
    </div>
    <p class="text-slate-400 text-sm mb-4">Ces technologies apparaissent avec leur icône sur vos <strong class="text-slate-200">projets</strong> et <strong class="text-slate-200">expériences</strong> lors de la sélection dans l’admin.</p>

    <?php if ($rows !== []): ?>
    <div class="sticky top-[4.5rem] z-20 mb-6 p-4 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-md">
        <label class="sr-only" for="techAdminSearch">Rechercher</label>
        <div class="relative">
            <?= adminIcon('search', 'w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none') ?>
            <input type="search" id="techAdminSearch" autocomplete="off"
                placeholder="Rechercher (Java, Spring, React, Docker…)"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        </div>
        <p id="techSearchMeta" class="text-xs text-slate-500 mt-2"></p>
    </div>
    <?php endif; ?>

    <div id="techAdminGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <?php foreach ($rows as $r): ?>
            <div class="tech-admin-card rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center hover:border-blue-500/30 transition-all group"
                 data-tech-name="<?= e(mb_strtolower($r['name'])) ?>">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-950 flex items-center justify-center p-2">
                    <img src="<?= e(adminMediaPreviewUrl($r['icon_url'])) ?>" alt="" class="w-full h-full object-contain" loading="lazy">
                </div>
                <div class="font-bold text-white text-sm truncate" title="<?= e($r['name']) ?>"><?= e($r['name']) ?></div>
                <div class="flex justify-center gap-2 mt-3 opacity-80 group-hover:opacity-100">
                    <?= adminBtn('Edit', 'technologies.php?action=edit&id=' . (int) $r['id'], 'secondary') ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <p id="techSearchEmpty" class="hidden text-slate-500 text-sm mt-6 text-center">Aucune technologie ne correspond à votre recherche.</p>
    <?php if ($rows === []): ?>
        <p class="text-slate-500 mt-4">Aucune technologie. Cliquez sur « Importer le catalogue » pour ajouter Java, Spring, React, etc.</p>
    <?php else: ?>
    <script>
    (function () {
        const input = document.getElementById('techAdminSearch');
        const cards = document.querySelectorAll('.tech-admin-card');
        const meta = document.getElementById('techSearchMeta');
        const empty = document.getElementById('techSearchEmpty');
        if (!input || !cards.length) return;
        const total = cards.length;
        function filter() {
            const q = input.value.trim().toLowerCase();
            let visible = 0;
            cards.forEach((card) => {
                const name = card.getAttribute('data-tech-name') || '';
                const match = !q || name.includes(q);
                card.classList.toggle('hidden', !match);
                if (match) visible++;
            });
            if (meta) {
                meta.textContent = q
                    ? visible + ' résultat' + (visible > 1 ? 's' : '') + ' sur ' + total
                    : total + ' technologies';
            }
            if (empty) empty.classList.toggle('hidden', visible > 0 || !q);
        }
        input.addEventListener('input', filter);
        filter();
    })();
    </script>
    <?php endif;
}

adminLayout('Technologies & icônes', ob_get_clean(), 'technologies.php', 'React, PHP, Flutter… — utilisées sur les projets');
