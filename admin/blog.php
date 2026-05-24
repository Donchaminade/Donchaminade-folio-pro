<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';
require_once __DIR__ . '/includes/editor.php';

Auth::requireAdmin();
$db = Database::connection();
$blogRepo = new BlogRepository($db);

$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $postAction = $_POST['action'] ?? '';

    if ($postAction === 'delete' && !empty($_POST['id'])) {
        $stmt = $db->prepare('SELECT cover_image FROM blog_posts WHERE id = ?');
        $stmt->execute([(int) $_POST['id']]);
        if ($row = $stmt->fetch()) {
            FileUploader::deleteIfLocal($row['cover_image'] ?? null);
        }
        $db->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([(int) $_POST['id']]);
        adminSetFlash('Article supprimé.');
        redirect('blog.php');
    }

    if ($postAction === 'save') {
        $title = trim((string) ($_POST['title'] ?? ''));
        $slug = trim((string) ($_POST['slug'] ?? ''));
        $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
        $content = trim((string) ($_POST['content'] ?? ''));
        $readingTime = max(1, (int) ($_POST['reading_time'] ?? 5));
        $editId = (int) ($_POST['id'] ?? 0);
        try {
            $category = blogResolveCategoryFromPost($db, (string) ($_POST['category'] ?? 'tech'), $_POST['category_custom'] ?? null);
        } catch (InvalidArgumentException $e) {
            adminSetFlash($e->getMessage());
            redirect('blog.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }
        $isPublished = isset($_POST['is_published']) ? 1 : 0;
        $publishedAt = trim((string) ($_POST['published_at'] ?? ''));

        try {
            $cover = adminResolveUploadedFile('cover_file', 'blog', $_POST['cover_file_current'] ?? '');
        } catch (Throwable $e) {
            adminSetFlash($e->getMessage());
            redirect('blog.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($title === '' || $content === '' || $content === '<p><br></p>') {
            adminSetFlash('Titre et contenu obligatoires.');
            redirect('blog.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        if ($slug === '') {
            $slug = $blogRepo->slugify($title);
        }
        $slug = $blogRepo->ensureUniqueSlug($slug, $editId ?: null);

        if ($isPublished && $publishedAt === '') {
            $publishedAt = date('Y-m-d H:i:s');
        }
        if (!$isPublished) {
            $publishedAt = $publishedAt !== '' ? $publishedAt : null;
        }

        if ($editId > 0) {
            $db->prepare(
                'UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, content=?, cover_image=?, reading_time=?, is_published=?, published_at=? WHERE id=?'
            )->execute([$slug, $title, $excerpt ?: null, $category, $content, $cover, $readingTime, $isPublished, $publishedAt ?: null, $editId]);
            $flashMsg = 'Article mis à jour.';
        } else {
            $db->prepare(
                'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at) VALUES (?,?,?,?,?,?,?,?,?)'
            )->execute([$slug, $title, $excerpt ?: null, $category, $content, $cover, $readingTime, $isPublished, $publishedAt ?: null]);
            $flashMsg = 'Article enregistré.';
        }
        if (!blogIsBuiltinCategory($category) && ($_POST['category'] ?? '') === 'autre') {
            $flashMsg .= ' Thème « ' . blogCategoryLabel($category, $db) . ' » enregistré.';
        }
        adminSetFlash($flashMsg);
        redirect('blog.php');
    }
}

ob_start();

if ($action === 'create' || $action === 'edit') {
    $post = [
        'title' => '', 'slug' => '', 'excerpt' => '', 'content' => '', 'cover_image' => '',
        'category' => 'tech', 'reading_time' => 5, 'is_published' => 0, 'published_at' => date('Y-m-d\TH:i'),
    ];
    if ($action === 'edit' && $id > 0) {
        $stmt = $db->prepare('SELECT * FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        if ($row = $stmt->fetch()) {
            $post = $row;
            if ($post['published_at']) {
                $post['published_at'] = date('Y-m-d\TH:i', strtotime($post['published_at']));
            }
        }
    }
    $allCategories = blogAllCategories($db);
    $currentCategory = (string) ($post['category'] ?? 'tech');
    $ia = adminInputAttrs();
    ?>
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-6 max-w-3xl shadow-xl">
        <form method="post" enctype="multipart/form-data" class="space-y-4">
            <?= Csrf::field() ?>
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="<?= (int) ($post['id'] ?? 0) ?>">
            <label class="block text-sm font-semibold text-slate-400">Titre *</label>
            <input name="title" <?= $ia ?> value="<?= e($post['title']) ?>" required>
            <label class="block text-sm font-semibold text-slate-400">Slug (URL — optionnel)</label>
            <input name="slug" <?= $ia ?> value="<?= e($post['slug'] ?? '') ?>" placeholder="Généré automatiquement depuis le titre">
            <label class="block text-sm font-semibold text-slate-400">Résumé court</label>
            <textarea name="excerpt" rows="2" <?= $ia ?> placeholder="Quelques lignes pour la carte de l'article"><?= e($post['excerpt'] ?? '') ?></textarea>

            <label class="block text-sm font-semibold text-slate-400">Thème / catégorie</label>
            <select name="category" id="blogCategorySelect" <?= $ia ?>>
                <?php foreach ($allCategories as $slug => $label): ?>
                    <option value="<?= e($slug) ?>" <?= $currentCategory === $slug ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
                <option value="autre" <?= $currentCategory === 'autre' ? 'selected' : '' ?>>+ Autre (nouveau thème)</option>
            </select>
            <div id="blogCategoryCustomWrap" class="mt-3 <?= $currentCategory === 'autre' ? '' : 'hidden' ?>">
                <label class="block text-xs font-semibold text-slate-500 mb-1">Nom du nouveau thème *</label>
                <input type="text" name="category_custom" id="blogCategoryCustom" <?= $ia ?>
                    placeholder="Ex. Finance, Parentalité, Musique…"
                    value="">
                <p class="text-[10px] text-slate-500 mt-1.5">Enregistré automatiquement et proposé dans la liste pour vos prochains articles.</p>
            </div>
            <script>
            (function () {
                const sel = document.getElementById('blogCategorySelect');
                const wrap = document.getElementById('blogCategoryCustomWrap');
                const input = document.getElementById('blogCategoryCustom');
                if (!sel || !wrap) return;
                const toggle = () => {
                    const isAutre = sel.value === 'autre';
                    wrap.classList.toggle('hidden', !isAutre);
                    if (input) {
                        input.required = isAutre;
                        if (!isAutre) input.value = '';
                    }
                };
                sel.addEventListener('change', toggle);
                toggle();
            })();
            </script>

            <label class="block text-sm font-semibold text-slate-400">Contenu de l'article *</label>
            <?php adminEditor('content', $post['content'] ?? ''); ?>

            <?php adminFileField('cover_file', 'Image de couverture (téléverser)', 'image/*', $post['cover_image'] ?? null); ?>

            <label class="block text-sm font-semibold text-slate-400 mt-4">Temps de lecture (minutes)</label>
            <input type="number" name="reading_time" <?= $ia ?> value="<?= (int) ($post['reading_time'] ?? 5) ?>" min="1">
            <label class="block text-sm font-semibold text-slate-400">Date de publication</label>
            <input type="datetime-local" name="published_at" <?= $ia ?> value="<?= e($post['published_at'] ?? '') ?>">
            <label class="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" name="is_published" class="rounded border-white/20" <?= !empty($post['is_published']) ? 'checked' : '' ?>>
                <span class="text-sm font-medium">Publier sur le site</span>
            </label>
            <div class="flex gap-3 pt-4">
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]">Enregistrer</button>
                <?= adminBtn('Annuler', 'blog.php', 'secondary') ?>
            </div>
        </form>
    </div>
    <?php
} else {
    $rows = $db->query(
        'SELECT id, title, slug, category, is_published, published_at, views_count, likes_count, comments_count, shares_count FROM blog_posts ORDER BY created_at DESC'
    )->fetchAll();
    ?>
    <div class="mb-6"><?= adminBtn('+ Nouvel article', 'blog.php?action=create') ?></div>
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
        <table class="w-full text-sm">
            <thead class="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-widest">
                <tr>
                    <th class="text-left p-4">Article</th>
                    <th class="p-4">Stats</th>
                    <th class="p-4">Statut</th>
                    <th class="p-4"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
            <?php foreach ($rows as $r): ?>
                <tr class="hover:bg-white/[0.02] transition-colors">
                    <td class="p-4">
                        <div class="font-bold text-white"><?= e($r['title']) ?></div>
                        <div class="text-xs text-slate-500 mt-1">/blog/<?= e($r['slug']) ?> · <?= e(blogCategoryLabel($r['category'] ?? 'tech', $db)) ?></div>
                    </td>
                    <td class="p-4 text-center text-slate-400 text-xs">
                        👁 <?= (int) $r['views_count'] ?> · ❤ <?= (int) $r['likes_count'] ?> · 💬 <?= (int) $r['comments_count'] ?>
                    </td>
                    <td class="p-4 text-center">
                        <?php if ($r['is_published']): ?>
                            <span class="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Publié</span>
                        <?php else: ?>
                            <span class="px-2 py-1 rounded-full bg-slate-500/20 text-slate-400 text-xs font-bold">Brouillon</span>
                        <?php endif; ?>
                    </td>
                    <td class="p-4">
                        <div class="flex flex-wrap justify-end gap-2">
                        <?php if ($r['is_published']): ?>
                            <?= adminBtn('Voir détails', frontendUrl() . '/blog/' . rawurlencode($r['slug']), 'outline') ?>
                        <?php endif; ?>
                        <?= adminBtn('Modifier', 'blog.php?action=edit&id=' . (int) $r['id'], 'secondary') ?>
                        <form method="post" class="inline" onsubmit="return confirm('Supprimer ?');">
                            <?= Csrf::field() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                            <?= adminDangerSubmit('Supprimer') ?>
                        </form>
                        </div>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

adminLayout('Blog', ob_get_clean(), 'blog.php', 'Rédigez visuellement — téléversez vos images');
