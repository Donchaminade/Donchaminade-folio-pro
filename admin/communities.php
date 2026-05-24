<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();
$appUrl = rtrim(env('APP_URL', ''), '/');

$showForm = isset($_GET['new']) || isset($_GET['edit']);
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$editRow = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();

    if (($_POST['action'] ?? '') === 'delete') {
        $id = (int) ($_POST['id'] ?? 0);
        $s = $db->prepare('SELECT logo FROM communities WHERE id = ?');
        $s->execute([$id]);
        $old = $s->fetchColumn();
        if (is_string($old) && $old !== '' && !str_starts_with($old, 'http')) {
            FileUploader::deleteIfLocal($old);
        }
        $db->prepare('DELETE FROM communities WHERE id = ?')->execute([$id]);
        adminSetFlash('Communauté supprimée.');
        redirect('communities.php');
    }

    if (($_POST['action'] ?? '') === 'save') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $role = trim((string) ($_POST['role'] ?? ''));
        $description = trim((string) ($_POST['description'] ?? ''));
        $websiteUrl = trim((string) ($_POST['website_url'] ?? ''));
        $linkedinUrl = trim((string) ($_POST['linkedin_url'] ?? ''));
        $editIdPost = (int) ($_POST['id'] ?? 0);
        $logoPath = trim((string) ($_POST['logo_current'] ?? ''));
        $logoUrl = trim((string) ($_POST['logo_url'] ?? ''));

        if ($name === '' || $role === '' || $description === '') {
            adminSetFlash('Nom, rôle et description obligatoires.');
            redirect('communities.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        try {
            if (!empty($_FILES['logo_file']['name'])) {
                if ($logoPath !== '' && !str_starts_with($logoPath, 'http') && str_contains($logoPath, '/uploads/')) {
                    FileUploader::deleteIfLocal($logoPath);
                }
                $logoPath = FileUploader::upload($_FILES['logo_file'], 'communities');
            } elseif ($logoUrl !== '') {
                if ($logoPath !== '' && !str_starts_with($logoPath, 'http') && str_contains($logoPath, '/uploads/')) {
                    FileUploader::deleteIfLocal($logoPath);
                }
                $logoPath = $logoUrl;
            }
        } catch (RuntimeException $e) {
            adminSetFlash($e->getMessage());
            redirect('communities.php?' . ($editIdPost ? 'edit=' . $editIdPost : 'new=1'));
        }

        if ($logoPath === '') {
            $logoPath = '👥';
        }

        if ($editIdPost > 0) {
            $db->prepare('UPDATE communities SET name=?, logo=?, role=?, description=?, website_url=?, linkedin_url=? WHERE id=?')
                ->execute([$name, $logoPath, $role, $description, $websiteUrl ?: null, $linkedinUrl ?: null, $editIdPost]);
        } else {
            $maxOrder = (int) $db->query('SELECT COALESCE(MAX(sort_order),0) FROM communities')->fetchColumn();
            $db->prepare('INSERT INTO communities (name, logo, role, description, website_url, linkedin_url, sort_order) VALUES (?,?,?,?,?,?,?)')
                ->execute([$name, $logoPath, $role, $description, $websiteUrl ?: null, $linkedinUrl ?: null, $maxOrder + 1]);
        }
        adminSetFlash('Communauté enregistrée.');
        redirect('communities.php');
    }
}

if ($editId > 0) {
    $s = $db->prepare('SELECT * FROM communities WHERE id = ?');
    $s->execute([$editId]);
    $editRow = $s->fetch() ?: null;
    if (!$editRow) {
        redirect('communities.php');
    }
    $showForm = true;
}

$rows = $db->query('SELECT id, name, logo, role FROM communities ORDER BY sort_order ASC, id ASC')->fetchAll();
$ia = adminInputAttrs();

/** URL affichable pour un logo (fichier local, URL distante ou emoji). */
$communityLogoUrl = static function (string $logo) use ($appUrl): ?string {
    if ($logo === '') {
        return null;
    }
    if (str_starts_with($logo, 'http://') || str_starts_with($logo, 'https://')) {
        return $logo;
    }
    if (str_starts_with($logo, '/')) {
        return $appUrl . $logo;
    }
    if (preg_match('/\.(jpe?g|png|gif|webp|svg)$/i', $logo)) {
        return $appUrl . '/' . ltrim($logo, '/');
    }
    return null;
};

ob_start();
?>
<div class="flex flex-wrap gap-3 mb-6">
    <?= adminBtn('+ Nouvelle communauté', 'communities.php?new=1') ?>
    <?php if ($showForm): ?>
        <?= adminBtn('Annuler', 'communities.php', 'outline') ?>
    <?php endif; ?>
</div>

<?php if ($showForm):
    $logo = (string) ($editRow['logo'] ?? '');
    $logoPreview = $communityLogoUrl($logo);
    $logoUrlField = ($logo !== '' && (str_starts_with($logo, 'http://') || str_starts_with($logo, 'https://'))) ? $logo : '';
?>
<?php adminPanelStart('max-w-3xl mb-8'); ?>
    <h2 class="text-lg font-bold text-white mb-4"><?= $editRow ? 'Modifier la communauté' : 'Nouvelle communauté' ?></h2>
    <form method="post" enctype="multipart/form-data">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int) ($editRow['id'] ?? 0) ?>">
        <input type="hidden" name="logo_current" value="<?= e($logo) ?>">

        <div class="flex flex-wrap gap-6 mb-6 items-start">
            <div class="shrink-0">
                <?php if ($logoPreview): ?>
                    <img src="<?= e($logoPreview) ?>" alt="" class="w-24 h-24 rounded-2xl object-contain border-2 border-blue-500/50 bg-slate-900 p-2">
                <?php else: ?>
                    <div class="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-dashed border-white/20 flex items-center justify-center text-4xl" title="Emoji ou image"><?= e($logo !== '' ? mb_substr($logo, 0, 2) : '👥') ?></div>
                <?php endif; ?>
            </div>
            <div class="flex-1 min-w-[220px] space-y-4">
                <div>
                    <?= adminLabel('Logo — fichier local (optionnel)') ?>
                    <input type="file" name="logo_file" accept="image/jpeg,image/png,image/webp,image/gif"
                        class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold file:text-xs">
                    <p class="text-xs text-slate-500 mt-2">JPG, PNG, WebP ou GIF — max 5 Mo. Prioritaire sur l’URL si les deux sont remplis.</p>
                </div>
                <div>
                    <?= adminLabel('Logo — lien URL (optionnel)') ?>
                    <input name="logo_url" <?= $ia ?> value="<?= e($logoUrlField) ?>" placeholder="https://…/logo.png">
                    <p class="text-xs text-slate-500 mt-2">Utilisez un lien si le logo est déjà hébergé en ligne. Sinon, laissez vide et gardez l’emoji par défaut (👥).</p>
                </div>
            </div>
        </div>

        <?= adminLabel('Nom *') ?>
        <input name="name" <?= $ia ?> value="<?= e($editRow['name'] ?? '') ?>" required>
        <?= adminLabel('Votre rôle *') ?>
        <input name="role" <?= $ia ?> value="<?= e($editRow['role'] ?? '') ?>" required placeholder="Speaker, Mentor…">
        <?= adminLabel('Description *') ?>
        <textarea name="description" rows="5" <?= $ia ?> required><?= e($editRow['description'] ?? '') ?></textarea>
        <?= adminLabel('Site web (optionnel)') ?>
        <input name="website_url" <?= $ia ?> value="<?= e($editRow['website_url'] ?? '') ?>" placeholder="https://…">
        <?= adminLabel('LinkedIn (optionnel)') ?>
        <input name="linkedin_url" <?= $ia ?> value="<?= e($editRow['linkedin_url'] ?? '') ?>" placeholder="https://linkedin.com/…">
        <p class="pt-4"><?= adminSubmitBtn() ?></p>
    </form>
<?php adminPanelEnd(); ?>
<?php endif; ?>

<?php adminTableStart(); adminTableHead(['', 'Nom', 'Rôle', 'Actions']); ?>
<?php foreach ($rows as $r):
    $thumb = (string) ($r['logo'] ?? '');
    $thumbUrl = $communityLogoUrl($thumb);
?>
<tr class="hover:bg-white/[0.02] align-middle">
    <td class="p-4 w-14">
        <?php if ($thumbUrl): ?>
            <img src="<?= e($thumbUrl) ?>" alt="" class="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-white/10 p-1">
        <?php else: ?>
            <span class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg"><?= e(mb_substr($thumb, 0, 2) ?: '👥') ?></span>
        <?php endif; ?>
    </td>
    <td class="p-4 text-white font-medium"><?= e($r['name']) ?></td>
    <td class="p-4 text-slate-300"><?= e($r['role']) ?></td>
    <td class="p-4 flex flex-wrap gap-2">
        <?= adminBtn('Modifier', 'communities.php?edit=' . (int) $r['id'], 'secondary') ?>
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
<p class="text-slate-500 mt-4">Aucune communauté. Cliquez sur « Nouvelle communauté ».</p>
<?php endif; ?>

<?php
adminLayout('Communautés', ob_get_clean(), 'communities.php', 'Engagements WTM, GDG, associations tech…');
