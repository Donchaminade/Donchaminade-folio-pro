<?php
/** @var array $r @var bool $isCollab @var string $loc @var array $atts @var string $appUrl @var array $platformLabels */
?>
<div class="space-y-4">
    <div class="flex flex-wrap gap-2 items-center">
        <?php if ($isCollab): ?>
            <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">Collaboration</span>
        <?php else: ?>
            <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-600 text-slate-300 font-bold">Contact</span>
        <?php endif; ?>
        <span class="text-xs text-slate-500"><?= e($r['created_at']) ?></span>
    </div>

    <div>
        <span class="font-bold text-white text-lg"><?= e($r['name']) ?></span>
        <a href="mailto:<?= e($r['email']) ?>" class="text-blue-400 text-sm ml-2"><?= e($r['email']) ?></a>
        <?php if (!empty($r['phone'])): ?>
            <span class="text-slate-400 text-sm ml-2"><?= e($r['phone']) ?></span>
        <?php endif; ?>
    </div>

    <?php if ($isCollab): ?>
        <?php if (!empty($r['subject']) || !empty($r['company'])): ?>
        <div class="grid sm:grid-cols-2 gap-3 text-sm">
            <?php if (!empty($r['subject'])): ?>
                <div><span class="text-slate-500 text-xs uppercase">Objet</span><p class="text-white"><?= e($r['subject']) ?></p></div>
            <?php endif; ?>
            <?php if (!empty($r['company'])): ?>
                <div><span class="text-slate-500 text-xs uppercase">Entreprise</span><p class="text-white"><?= e($r['company']) ?></p></div>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        <div class="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20">
            <p class="text-xs text-violet-300 uppercase font-bold mb-2">Projet / besoin</p>
            <p class="text-slate-200 whitespace-pre-wrap leading-relaxed"><?= e($r['collaboration_brief'] ?? $r['message']) ?></p>
        </div>
        <?php if ($atts !== []): ?>
        <div>
            <p class="text-xs text-slate-500 uppercase mb-2">Fichiers joints</p>
            <ul class="space-y-2">
            <?php foreach ($atts as $att): ?>
                <li>
                    <a href="<?= e($appUrl) ?><?= e($att['stored_path']) ?>" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-300 text-sm font-semibold">
                        <?= adminIcon('paperclip', 'w-3.5 h-3.5') ?>
                        <?= e($att['original_name']) ?> (<?= e(formatBytes((int) $att['size_bytes'])) ?>)
                    </a>
                </li>
            <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>
        <?php if (!empty($r['documents_details'])): ?>
            <p class="text-sm text-slate-400 whitespace-pre-wrap"><?= e($r['documents_details']) ?></p>
        <?php endif; ?>
        <div class="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-sm">
            <p class="text-xs text-slate-500 uppercase mb-1">Visio</p>
            <p class="text-white"><?= e($platformLabels[$r['meeting_platform'] ?? ''] ?? ($r['meeting_platform'] ?: '—')) ?></p>
            <?php if (!empty($r['meeting_slots'])): ?>
                <p class="text-slate-400 text-xs mt-2 whitespace-pre-wrap"><?= nl2br(e($r['meeting_slots'])) ?></p>
            <?php endif; ?>
            <?php if (!empty($r['meeting_notes'])): ?>
                <p class="text-slate-400 text-xs mt-2"><?= nl2br(e($r['meeting_notes'])) ?></p>
            <?php endif; ?>
        </div>
    <?php else: ?>
        <p class="text-slate-200 whitespace-pre-wrap leading-relaxed"><?= e($r['message']) ?></p>
    <?php endif; ?>

    <div class="rounded-xl bg-slate-950/80 border border-white/5 p-3 text-[11px] text-slate-500 font-mono space-y-1">
        <div>IP <?= e($r['ip_address'] ?? '—') ?> · <?= e($loc) ?></div>
        <?php if (!empty($r['user_agent'])): ?>
            <div class="break-all"><?= e($r['user_agent']) ?></div>
        <?php endif; ?>
    </div>
</div>
