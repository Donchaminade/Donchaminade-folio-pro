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
        'hero_title_en', 'hero_subtitle_en', 'bio_en', 'availability_text_en', 'experience_badge_label_en',
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
        dbUpdatePresentColumns($db, 'site_profile', (int) $existing['id'], $data);
    } else {
        $insert = [];
        foreach ($data as $column => $value) {
            if (dbHasColumn($db, 'site_profile', $column)) {
                $insert[$column] = $value;
            }
        }
        if ($insert !== []) {
            $cols = implode(', ', array_map(fn ($c) => '`' . $c . '`', array_keys($insert)));
            $placeholders = implode(', ', array_fill(0, count($insert), '?'));
            $db->prepare("INSERT INTO site_profile ({$cols}) VALUES ({$placeholders})")->execute(array_values($insert));
        }
    }

    adminSetFlash('Profil enregistré.');
    redirect('profile.php');
}

$profile = $db->query('SELECT * FROM site_profile ORDER BY id DESC LIMIT 1')->fetch() ?: [];
$ia = adminInputAttrs();
$base = rtrim(env('APP_URL', ''), '/');

ob_start();
?>
<div class="admin-panel max-w-3xl">
    <form method="post" enctype="multipart/form-data" class="space-y-1">
        <?= Csrf::field() ?>
        <?php adminField('full_name', 'Nom complet', (string) ($profile['full_name'] ?? '')); ?>
        <?php adminLangOpen(); ?>
            <?php adminField('hero_title', 'Titre principal', (string) ($profile['hero_title'] ?? ''), 'text', false, 'hero_title_en'); ?>
            <?php adminField('hero_subtitle', 'Sous-titre', (string) ($profile['hero_subtitle'] ?? ''), 'text', false, 'hero_subtitle_en'); ?>
            <?php adminField('availability_text', 'Badge disponibilité', (string) ($profile['availability_text'] ?? ''), 'text', false, 'availability_text_en'); ?>
            <?php adminField('experience_badge_label', 'Label expérience', (string) ($profile['experience_badge_label'] ?? ''), 'text', false, 'experience_badge_label_en'); ?>
            <?php adminField('bio', 'Biographie', (string) ($profile['bio'] ?? ''), 'textarea', false, 'bio_en'); ?>
        <?php adminLangSwitch(); ?>
            <?php adminField('hero_title_en', 'Main title', (string) ($profile['hero_title_en'] ?? '')); ?>
            <?php adminField('hero_subtitle_en', 'Subtitle', (string) ($profile['hero_subtitle_en'] ?? '')); ?>
            <?php adminField('availability_text_en', 'Availability', (string) ($profile['availability_text_en'] ?? '')); ?>
            <?php adminField('experience_badge_label_en', 'Experience label', (string) ($profile['experience_badge_label_en'] ?? '')); ?>
            <?php adminField('bio_en', 'Biography', (string) ($profile['bio_en'] ?? ''), 'textarea'); ?>
        <?php adminLangClose(); ?>
        <?php adminField('experience_badge', 'Chiffre expérience (ex: 4+)', (string) ($profile['experience_badge'] ?? '')); ?>
        <?php
        foreach ([
            'email' => 'Email',
            'phone' => 'Téléphone',
            'whatsapp' => 'WhatsApp',
            'linkedin_url' => 'URL LinkedIn',
            'twitter_url' => 'URL X / Twitter',
            'github_url' => 'URL GitHub',
            'footer_year' => 'Année (footer)',
        ] as $name => $label) {
            adminField($name, $label, (string) ($profile[$name] ?? ''));
        }
        ?>

        <?php adminFileField('photo_file', 'Photo de profil', 'image/*', $profile['photo_path'] ?? null); ?>
        <?php adminFileField('cv_file', 'CV (PDF)', 'application/pdf', $profile['cv_path'] ?? null); ?>

        <p class="pt-6">
            <?= adminSubmitBtn('Enregistrer') ?>
        </p>
    </form>
</div>
<?php
adminLayout('Profil', ob_get_clean(), 'profile.php', 'Téléversez photo et CV — pas de liens à copier');
