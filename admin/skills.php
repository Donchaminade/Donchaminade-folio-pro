<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();
$db = Database::connection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    foreach (['skill_blocks' => 'title', 'skill_categories' => 'name', 'skill_items' => 'name'] as $table => $column) {
        $rows = $_POST[$table] ?? [];
        if (!is_array($rows)) {
            continue;
        }
        foreach ($rows as $id => $fields) {
            if (!is_array($fields)) {
                continue;
            }
            $id = (int) $id;
            if ($id <= 0) {
                continue;
            }
            $data = [];
            if (isset($fields[$column])) {
                $data[$column] = trim((string) $fields[$column]);
            }
            $en = $column . '_en';
            if (isset($fields[$en])) {
                $data[$en] = trim((string) $fields[$en]);
            }
            dbUpdatePresentColumns($db, $table, $id, $data);
        }
    }
    adminSetFlash('Compétences enregistrées.');
    redirect('skills.php');
}

$blocks = $db->query('SELECT * FROM skill_blocks ORDER BY sort_order ASC, id ASC')->fetchAll();

ob_start();
?>
<form method="post" class="space-y-6 max-w-4xl">
    <?= Csrf::field() ?>
    <?php if ($blocks === []): ?>
        <?= adminEmptyState('Aucune compétence', 'Les blocs apparaîtront ici après le chargement du catalogue.') ?>
    <?php endif; ?>
    <?php foreach ($blocks as $block):
        $bid = (int) $block['id'];
        $cats = $db->prepare('SELECT * FROM skill_categories WHERE block_id = ? ORDER BY sort_order ASC, id ASC');
        $cats->execute([$bid]);
        $categories = $cats->fetchAll();
    ?>
        <?php adminPanelStart('mb-4'); ?>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--a-muted)] mb-3">Bloc</p>
            <?php adminLangOpen(); ?>
            <?php adminField("skill_blocks[{$bid}][title]", 'Titre', (string) $block['title'], 'text', false, "skill_blocks[{$bid}][title_en]"); ?>
            <?php adminLangSwitch(); ?>
            <?php adminField("skill_blocks[{$bid}][title_en]", 'Title', (string) ($block['title_en'] ?? '')); ?>
            <?php adminLangClose(); ?>
            <?php foreach ($categories as $cat):
                $cid = (int) $cat['id'];
                $items = $db->prepare('SELECT * FROM skill_items WHERE category_id = ? ORDER BY sort_order ASC, id ASC');
                $items->execute([$cid]);
            ?>
                <div class="mt-5 pl-4 border-l border-[var(--a-border)]">
                    <?php adminLangOpen(); ?>
                    <?php adminField("skill_categories[{$cid}][name]", 'Catégorie', (string) $cat['name'], 'text', false, "skill_categories[{$cid}][name_en]"); ?>
                    <?php adminLangSwitch(); ?>
                    <?php adminField("skill_categories[{$cid}][name_en]", 'Category', (string) ($cat['name_en'] ?? '')); ?>
                    <?php adminLangClose(); ?>
                    <?php foreach ($items->fetchAll() as $item):
                        $iid = (int) $item['id'];
                    ?>
                        <?php adminLangOpen(); ?>
                        <?php adminField("skill_items[{$iid}][name]", 'Élément', (string) $item['name'], 'text', false, "skill_items[{$iid}][name_en]"); ?>
                        <?php adminLangSwitch(); ?>
                        <?php adminField("skill_items[{$iid}][name_en]", 'Item', (string) ($item['name_en'] ?? '')); ?>
                        <?php adminLangClose(); ?>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        <?php adminPanelEnd(); ?>
    <?php endforeach; ?>
    <?php if ($blocks !== []): ?>
        <p><?= adminSubmitBtn('Enregistrer les compétences') ?></p>
    <?php endif; ?>
</form>
<?php
adminLayout('Compétences', ob_get_clean(), 'skills.php', 'Titres et noms en français et en anglais');
