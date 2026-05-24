<?php

declare(strict_types=1);

/** Grille de sélection des technologies avec icônes + recherche */
function adminTechPicker(PDO $db, array $selected = []): void
{
    $allTechnologies = $db->query('SELECT name, icon_url FROM technologies ORDER BY name ASC')->fetchAll();
    if ($allTechnologies === []) {
        echo '<p class="text-amber-400 text-sm">Aucune technologie. <a href="technologies.php?sync=1" class="underline text-blue-400">Importer le catalogue</a>.</p>';
        return;
    }
    $total = count($allTechnologies);
    ?>
    <div class="mt-2 rounded-xl border border-white/10 bg-slate-950/80 overflow-hidden">
        <div class="p-3 border-b border-white/10">
            <input type="search" id="techPickerSearch" autocomplete="off"
                placeholder="Filtrer les technologies…"
                class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none">
            <p id="techPickerMeta" class="text-[10px] text-slate-500 mt-1.5"><?= (int) $total ?> technologies</p>
        </div>
        <div id="techPickerGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 max-h-64 overflow-y-auto admin-scroll">
            <?php foreach ($allTechnologies as $tech):
                $checked = in_array($tech['name'], $selected, true);
                $border = $checked ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 hover:border-white/20';
                ?>
            <label class="tech-picker-item flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all <?= $border ?>"
                   data-tech-name="<?= e(mb_strtolower($tech['name'])) ?>">
                <input type="checkbox" name="technologies[]" value="<?= e($tech['name']) ?>"<?= $checked ? ' checked' : '' ?> class="rounded shrink-0">
                <img src="<?= e(adminMediaPreviewUrl($tech['icon_url'])) ?>" alt="" class="w-5 h-5 object-contain shrink-0">
                <span class="text-xs text-slate-300 truncate"><?= e($tech['name']) ?></span>
            </label>
            <?php endforeach; ?>
        </div>
        <p id="techPickerEmpty" class="hidden text-xs text-slate-500 p-4 text-center border-t border-white/5">Aucun résultat</p>
    </div>
    <script>
    (function () {
        const input = document.getElementById('techPickerSearch');
        const items = document.querySelectorAll('.tech-picker-item');
        const meta = document.getElementById('techPickerMeta');
        const empty = document.getElementById('techPickerEmpty');
        if (!input || !items.length) return;
        const total = items.length;
        function filter() {
            const q = input.value.trim().toLowerCase();
            let visible = 0;
            items.forEach((el) => {
                const match = !q || (el.getAttribute('data-tech-name') || '').includes(q);
                el.classList.toggle('hidden', !match);
                if (match) visible++;
            });
            if (meta) meta.textContent = q ? visible + ' / ' + total : total + ' technologies';
            if (empty) empty.classList.toggle('hidden', visible > 0 || !q);
        }
        input.addEventListener('input', filter);
    })();
    </script>
    <?php
}
