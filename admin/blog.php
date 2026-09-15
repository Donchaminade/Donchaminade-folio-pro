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

function adminBlogHasPreviewColumns(PDO $db): bool
{
    static $ok = null;
    if ($ok !== null) {
        return $ok;
    }
    try {
        $db->query('SELECT preview_token, share_facebook, share_x FROM blog_posts LIMIT 1');
        $ok = true;
    } catch (PDOException) {
        $ok = false;
    }
    return $ok;
}

function adminBlogPreviewUrl(array $post): string
{
    $token = (string) ($post['preview_token'] ?? '');
    if ($token === '') {
        return '';
    }
    return rtrim(frontendUrl(), '/') . '/blog/preview/' . rawurlencode($token);
}

function adminBlogSavePost(PDO $db, BlogRepository $blogRepo, array $fields, int $editId): int
{
    $hasExtra = adminBlogHasPreviewColumns($db);
    $token = $hasExtra
        ? ((string) ($fields['preview_token'] ?? '') ?: BlogShareCopy::newPreviewToken())
        : '';

    if ($editId > 0) {
        if ($hasExtra) {
            $db->prepare(
                'UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, content=?, cover_image=?, reading_time=?, preview_token=? WHERE id=?'
            )->execute([
                $fields['slug'], $fields['title'], $fields['excerpt'], $fields['category'],
                $fields['content'], $fields['cover'], $fields['reading_time'], $token, $editId,
            ]);
        } else {
            $db->prepare(
                'UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, content=?, cover_image=?, reading_time=? WHERE id=?'
            )->execute([
                $fields['slug'], $fields['title'], $fields['excerpt'], $fields['category'],
                $fields['content'], $fields['cover'], $fields['reading_time'], $editId,
            ]);
        }
        return $editId;
    }

    if ($hasExtra) {
        $db->prepare(
            'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at, preview_token)
             VALUES (?,?,?,?,?,?,?,0,NULL,?)'
        )->execute([
            $fields['slug'], $fields['title'], $fields['excerpt'], $fields['category'],
            $fields['content'], $fields['cover'], $fields['reading_time'], $token,
        ]);
    } else {
        $db->prepare(
            'INSERT INTO blog_posts (slug, title, excerpt, category, content, cover_image, reading_time, is_published, published_at)
             VALUES (?,?,?,?,?,?,?,0,NULL)'
        )->execute([
            $fields['slug'], $fields['title'], $fields['excerpt'], $fields['category'],
            $fields['content'], $fields['cover'], $fields['reading_time'],
        ]);
    }

    return (int) $db->lastInsertId();
}

function adminCollectBlogFields(PDO $db, BlogRepository $blogRepo, int $editId): array
{
    $title = trim((string) ($_POST['title'] ?? ''));
    $slug = trim((string) ($_POST['slug'] ?? ''));
    $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
    $content = trim((string) ($_POST['content'] ?? ''));
    $readingTime = max(1, (int) ($_POST['reading_time'] ?? 5));
    $category = blogResolveCategoryFromPost($db, (string) ($_POST['category'] ?? 'tech'), $_POST['category_custom'] ?? null);
    $cover = adminResolveUploadedFile('cover_file', 'blog', $_POST['cover_file_current'] ?? '');

    if ($title === '' || $content === '' || $content === '<p><br></p>') {
        throw new InvalidArgumentException('Titre et contenu obligatoires.');
    }
    if ($slug === '') {
        $slug = $blogRepo->slugify($title);
    }
    $slug = $blogRepo->ensureUniqueSlug($slug, $editId ?: null);

    $token = '';
    if ($editId > 0 && adminBlogHasPreviewColumns($db)) {
        $stmt = $db->prepare('SELECT preview_token FROM blog_posts WHERE id = ?');
        $stmt->execute([$editId]);
        $token = (string) ($stmt->fetchColumn() ?: '');
    }

    return [
        'title' => $title,
        'slug' => $slug,
        'excerpt' => $excerpt ?: null,
        'category' => $category,
        'content' => $content,
        'cover' => $cover,
        'reading_time' => $readingTime,
        'preview_token' => $token,
    ];
}

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

    if ($postAction === 'unpublish' && !empty($_POST['id'])) {
        $db->prepare('UPDATE blog_posts SET is_published = 0 WHERE id = ?')->execute([(int) $_POST['id']]);
        adminSetFlash('Article retiré du site public. L’aperçu brouillon reste disponible.');
        redirect('blog.php?action=edit&id=' . (int) $_POST['id']);
    }

    if ($postAction === 'save' || $postAction === 'publish') {
        $editId = (int) ($_POST['id'] ?? 0);
        try {
            $fields = adminCollectBlogFields($db, $blogRepo, $editId);
        } catch (InvalidArgumentException $e) {
            adminSetFlash($e->getMessage());
            redirect('blog.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        } catch (Throwable $e) {
            adminSetFlash($e->getMessage());
            redirect('blog.php?action=' . ($editId ? "edit&id={$editId}" : 'create'));
        }

        $postId = adminBlogSavePost($db, $blogRepo, $fields, $editId);

        if ($postAction === 'publish') {
            $share = BlogShareCopy::build($fields['title'], (string) ($fields['excerpt'] ?? ''), $fields['slug']);
            $publishedAt = date('Y-m-d H:i:s');
            if (adminBlogHasPreviewColumns($db)) {
                $db->prepare(
                    'UPDATE blog_posts SET is_published=1, published_at=?, share_facebook=?, share_x=? WHERE id=?'
                )->execute([$publishedAt, $share['facebook'], $share['x'], $postId]);
            } else {
                $db->prepare('UPDATE blog_posts SET is_published=1, published_at=? WHERE id=?')
                    ->execute([$publishedAt, $postId]);
            }
            adminSetFlash('Article validé et publié. Préparez les posts Facebook et X ci-dessous.');
            redirect('blog.php?action=share&id=' . $postId);
        }

        $flashMsg = $editId > 0 ? 'Brouillon enregistré. Prévisualisez avant de publier.' : 'Brouillon créé. Prévisualisez le rendu, puis validez pour publier.';
        if (!blogIsBuiltinCategory($fields['category']) && ($_POST['category'] ?? '') === 'autre') {
            $flashMsg .= ' Thème « ' . blogCategoryLabel($fields['category'], $db) . ' » enregistré.';
        }
        adminSetFlash($flashMsg);
        redirect('blog.php?action=edit&id=' . $postId);
    }
}

ob_start();

if ($action === 'share' && $id > 0) {
    $stmt = $db->prepare('SELECT * FROM blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    $post = $stmt->fetch() ?: null;
    if (!$post) {
        adminSetFlash('Article introuvable.');
        redirect('blog.php');
    }
    $share = [
        'url' => rtrim(frontendUrl(), '/') . '/blog/' . rawurlencode((string) $post['slug']),
        'facebook' => (string) ($post['share_facebook'] ?? ''),
        'x' => (string) ($post['share_x'] ?? ''),
    ];
    if ($share['facebook'] === '' || $share['x'] === '') {
        $share = BlogShareCopy::build((string) $post['title'], (string) ($post['excerpt'] ?? ''), (string) $post['slug']);
    }
    $fbIntent = 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode($share['url']);
    $xIntent = 'https://twitter.com/intent/tweet?text=' . rawurlencode($share['x']);
    ?>
    <div class="max-w-3xl space-y-6">
        <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <p class="text-emerald-300 text-xs font-black uppercase tracking-widest mb-2">Publié</p>
            <h2 class="text-2xl font-black text-white"><?= e($post['title']) ?></h2>
            <p class="text-slate-400 text-sm mt-2">L’article est en ligne. Les connecteurs Facebook / X pourront poster plus tard ; le kit de copie est prêt maintenant.</p>
            <a href="<?= e($share['url']) ?>" target="_blank" rel="noopener" class="inline-block mt-4 text-blue-400 text-sm font-bold">Ouvrir l’article public →</a>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-3">
            <h3 class="font-bold text-white">Facebook</h3>
            <textarea readonly rows="7" class="w-full rounded-xl bg-slate-950 border border-white/10 text-slate-200 text-sm p-3"><?= e($share['facebook']) ?></textarea>
            <div class="flex flex-wrap gap-2">
                <?= adminBtn('Ouvrir le partage Facebook', $fbIntent, 'outline') ?>
            </div>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-3">
            <h3 class="font-bold text-white">X (Twitter)</h3>
            <textarea readonly rows="5" class="w-full rounded-xl bg-slate-950 border border-white/10 text-slate-200 text-sm p-3"><?= e($share['x']) ?></textarea>
            <div class="flex flex-wrap gap-2">
                <?= adminBtn('Ouvrir le composeur X', $xIntent, 'outline') ?>
            </div>
        </div>
        <div class="flex gap-3">
            <?= adminBtn('Modifier l’article', 'blog.php?action=edit&id=' . (int) $post['id'], 'secondary') ?>
            <?= adminBtn('Retour à la liste', 'blog.php', 'outline') ?>
        </div>
    </div>
    <?php
} elseif ($action === 'create' || $action === 'edit') {
    $post = [
        'title' => '', 'slug' => '', 'excerpt' => '', 'content' => '', 'cover_image' => '',
        'category' => 'tech', 'reading_time' => 5, 'is_published' => 0, 'preview_token' => '',
    ];
    if ($action === 'edit' && $id > 0) {
        $stmt = $db->prepare('SELECT * FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        if ($row = $stmt->fetch()) {
            $post = $row;
            if (empty($post['preview_token']) && !empty($post['id']) && adminBlogHasPreviewColumns($db)) {
                $post['preview_token'] = $blogRepo->ensurePreviewToken((int) $post['id']);
            }
        }
    }
    $allCategories = blogAllCategories($db);
    $currentCategory = (string) ($post['category'] ?? 'tech');
    $ia = adminInputAttrs();
    $previewUrl = adminBlogPreviewUrl($post);
    $isPublished = !empty($post['is_published']);
    ?>
    <div class="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-6 max-w-3xl shadow-xl">
        <?php if ($isPublished): ?>
            <div class="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                En ligne sur le portfolio. « Enregistrer » met à jour le contenu sans le retirer. « Dépublier » le ramène en brouillon.
            </div>
        <?php else: ?>
            <div class="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Brouillon : invisible sur le site tant que vous n’avez pas prévisualisé puis cliqué <strong>Valider et publier</strong>.
            </div>
        <?php endif; ?>

        <form method="post" enctype="multipart/form-data" class="space-y-4">
            <?= Csrf::field() ?>
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

            <div class="flex flex-wrap gap-3 pt-4">
                <button type="submit" name="action" value="save" class="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm transition-all">Enregistrer le brouillon</button>
                <?php if (!empty($post['id'])): ?>
                    <button type="submit" name="action" value="publish" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
                        onclick="return confirm('Confirmez-vous avoir prévisualisé cet article ? Il sera visible sur le portfolio.');">
                        Valider et publier
                    </button>
                <?php endif; ?>
                <?= adminBtn('Annuler', 'blog.php', 'secondary') ?>
            </div>
        </form>

        <?php if (!empty($post['id'])): ?>
        <div class="mt-8 pt-6 border-t border-white/10 space-y-4">
            <?php if ($previewUrl): ?>
                <a href="<?= e($previewUrl) ?>" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/40 text-amber-200 text-sm font-bold hover:bg-amber-500/10">
                    Prévisualiser le rendu public
                </a>
                <p class="text-xs text-slate-500">Lien d’aperçu (non listé, noindex) : <code class="text-slate-400 break-all"><?= e($previewUrl) ?></code></p>
            <?php else: ?>
                <p class="text-xs text-slate-500">Enregistrez une première fois pour générer le lien d’aperçu (nécessite la migration 015 sur Hostinger).</p>
            <?php endif; ?>

            <?php if ($isPublished): ?>
                <div class="flex flex-wrap gap-2">
                    <?= adminBtn('Kit Facebook + X', 'blog.php?action=share&id=' . (int) $post['id'], 'outline') ?>
                    <form method="post" class="inline" onsubmit="return confirm('Retirer l’article du site public ?');">
                        <?= Csrf::field() ?>
                        <input type="hidden" name="action" value="unpublish">
                        <input type="hidden" name="id" value="<?= (int) $post['id'] ?>">
                        <?= adminDangerSubmit('Dépublier') ?>
                    </form>
                </div>
            <?php else: ?>
                <p class="text-xs text-slate-500">La publication n’est possible qu’après enregistrement. Relisez l’aperçu avant de valider.</p>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php
} else {
    $cols = 'id, title, slug, category, is_published, published_at, views_count, likes_count, comments_count, shares_count';
    if (adminBlogHasPreviewColumns($db)) {
        $cols .= ', preview_token';
    }
    $rows = $db->query("SELECT {$cols} FROM blog_posts ORDER BY created_at DESC")->fetchAll();
    ?>
    <div class="mb-6 flex flex-wrap gap-3">
        <?= adminBtn('+ Nouvel article', 'blog.php?action=create') ?>
    </div>
    <p class="text-slate-500 text-sm mb-4">Les brouillons restent invisibles sur le portfolio. Prévisualisez, puis validez pour publier. Les textes Facebook / X sont générés après publication.</p>
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
                <?php $preview = adminBlogPreviewUrl($r); ?>
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
                            <span class="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">Brouillon</span>
                        <?php endif; ?>
                    </td>
                    <td class="p-4">
                        <div class="flex flex-wrap justify-end gap-2">
                        <?php if ($preview): ?>
                            <?= adminBtn('Aperçu', $preview, 'outline') ?>
                        <?php endif; ?>
                        <?php if ($r['is_published']): ?>
                            <?= adminBtn('Voir en ligne', frontendUrl() . '/blog/' . rawurlencode($r['slug']), 'outline') ?>
                            <?= adminBtn('Partage', 'blog.php?action=share&id=' . (int) $r['id'], 'outline') ?>
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

adminLayout('Blog', ob_get_clean(), 'blog.php', 'Brouillon → aperçu → validation. Jamais de mise en ligne automatique.');
