<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';
require_once __DIR__ . '/includes/editor.php';

Auth::requireAdmin();
$db = Database::connection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();

    try {
        $photoPath = adminResolveUploadedFile('photo_file', 'profile', $_POST['photo_file_current'] ?? '');
        $cvPath = adminResolveUploadedFile('cv_file', 'documents', $_POST['cv_file_current'] ?? '');
    } catch (Throwable $e) {
        adminSetFlash($e->getMessage());
        redirect('profile.php');
    }

    $fields = [
        'full_name', 'hero_title', 'hero_subtitle', 'bio', 'availability_text',
        'experience_badge', 'experience_badge_label', 'email', 'phone', 'whatsapp',
        'linkedin_url', 'twitter_url', 'github_url', 'footer_year',
    ];

    $data = [];
    foreach ($fields as $f) {
        $data[$f] = trim((string) ($_POST[$f] ?? ''));
    }
    $data['photo_path'] = $photoPath;
    $data['cv_path'] = $cvPath;

    $allFields = [...$fields, 'photo_path', 'cv_path'];
    $existing = $db->query('SELECT id FROM site_profile LIMIT 1')->fetch();

    if ($existing) {
        $sets = implode(', ', array_map(fn ($f) => "{$f} = ?", $allFields));
        $stmt = $db->prepare("UPDATE site_profile SET {$sets} WHERE id = ?");
        $stmt->execute([...array_values($data), (int) $existing['id']]);
    } else {
        $cols = implode(', ', $allFields);
        $placeholders = implode(', ', array_fill(0, count($allFields), '?'));
        $stmt = $db->prepare("INSERT INTO site_profile ({$cols}) VALUES ({$placeholders})");
        $stmt->execute(array_values($data));
    }

    adminSetFlash('Profil enregistré.');
    redirect('profile.php');
}

$profile = $db->query('SELECT * FROM site_profile ORDER BY id DESC LIMIT 1')->fetch() ?: [];
$ia = adminInputAttrs();
$base = rtrim(env('APP_URL', ''), '/');

ob_start();
?>
<div class="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-6 max-w-3xl shadow-xl">
    <form method="post" enctype="multipart/form-data" class="space-y-1">
        <?= Csrf::field() ?>
        <?php
        $textFields = [
            'full_name' => 'Nom complet',
            'hero_title' => 'Titre principal',
            'hero_subtitle' => 'Sous-titre',
            'availability_text' => 'Badge disponibilité',
            'experience_badge' => 'Chiffre expérience (ex: 3+)',
            'experience_badge_label' => 'Label expérience',
            'email' => 'Email',
            'phone' => 'Téléphone',
            'whatsapp' => 'WhatsApp',
            'linkedin_url' => 'URL LinkedIn',
            'twitter_url' => 'URL X / Twitter',
            'github_url' => 'URL GitHub',
            'footer_year' => 'Année (footer)',
        ];
        foreach ($textFields as $name => $label): ?>
            <label class="block text-sm font-semibold text-slate-400 mt-3"><?= e($label) ?></label>
            <input name="<?= e($name) ?>" <?= $ia ?> value="<?= e($profile[$name] ?? '') ?>">
        <?php endforeach; ?>

        <label class="block text-sm font-semibold text-slate-400 mt-3">Biographie</label>
        <textarea name="bio" rows="4" <?= $ia ?>><?= e($profile['bio'] ?? '') ?></textarea>

        <?php adminFileField('photo_file', 'Photo de profil', 'image/*', $profile['photo_path'] ?? null); ?>
        <?php adminFileField('cv_file', 'CV (PDF)', 'application/pdf', $profile['cv_path'] ?? null); ?>

        <p class="pt-6">
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg transition-all hover:scale-[1.02]">Enregistrer</button>
        </p>
    </form>
</div>
<?php
adminLayout('Profil', ob_get_clean(), 'profile.php', 'Téléversez photo et CV — pas de liens à copier');
