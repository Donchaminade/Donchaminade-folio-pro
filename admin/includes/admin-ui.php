<?php

declare(strict_types=1);

/** @return array{page: int, perPage: int, offset: int} */
function adminPaginationState(int $perPage = 25): array
{
    $page = max(1, (int) ($_GET['page'] ?? 1));

    return [
        'page' => $page,
        'perPage' => $perPage,
        'offset' => ($page - 1) * $perPage,
    ];
}

function adminPaginationRender(int $total, int $page, int $perPage, array $query = []): void
{
    $totalPages = max(1, (int) ceil($total / $perPage));
    $page = max(1, min($page, $totalPages));
    $from = $total === 0 ? 0 : ($page - 1) * $perPage + 1;
    $to = min($total, $page * $perPage);

    $buildUrl = static function (int $p) use ($query): string {
        $q = array_merge($query, ['page' => $p]);
        return '?' . http_build_query($q);
    };
    ?>
    <div class="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm">
        <p class="text-slate-500">
            <?= (int) $from ?>–<?= (int) $to ?> sur <strong class="text-slate-300"><?= (int) $total ?></strong>
        </p>
        <?php if ($totalPages > 1): ?>
        <nav class="flex flex-wrap items-center gap-1">
            <?php if ($page > 1): ?>
                <a href="<?= e($buildUrl(1)) ?>" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold">«</a>
                <a href="<?= e($buildUrl($page - 1)) ?>" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold">‹</a>
            <?php endif; ?>
            <?php
            $start = max(1, $page - 2);
            $end = min($totalPages, $page + 2);
            for ($p = $start; $p <= $end; $p++):
            ?>
                <a href="<?= e($buildUrl($p)) ?>"
                   class="min-w-[2rem] text-center px-3 py-1.5 rounded-lg text-xs font-bold <?= $p === $page ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white' ?>">
                    <?= $p ?>
                </a>
            <?php endfor; ?>
            <?php if ($page < $totalPages): ?>
                <a href="<?= e($buildUrl($page + 1)) ?>" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold">›</a>
                <a href="<?= e($buildUrl($totalPages)) ?>" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-bold">»</a>
            <?php endif; ?>
        </nav>
        <?php endif; ?>
    </div>
    <?php
}

function adminModalOpen(string $id = 'adminModal'): void
{
    echo '<div id="' . e($id) . '" class="admin-modal hidden fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">';
    echo '<div class="admin-modal-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto admin-scroll rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">';
    echo '<div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/95 backdrop-blur">';
    echo '<h2 id="' . e($id) . '-title" class="text-lg font-bold text-white"></h2>';
    echo '<button type="button" class="admin-modal-close p-2 rounded-lg hover:bg-white/10 text-slate-400" aria-label="Fermer">' . adminIcon('x', 'w-5 h-5') . '</button>';
    echo '</div><div id="' . e($id) . '-body" class="p-6 text-sm text-slate-300"></div></div></div>';
}

function adminModalScripts(): void
{
    ?>
    <script>
    (function () {
        function closeModal(el) {
            if (!el) return;
            el.classList.add('hidden');
            document.body.style.overflow = '';
        }
        function openModal(id, title, html) {
            const el = document.getElementById(id);
            if (!el) return;
            const t = document.getElementById(id + '-title');
            const b = document.getElementById(id + '-body');
            if (t) t.textContent = title || '';
            if (b) b.innerHTML = html || '';
            el.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (window.lucide) lucide.createIcons();
        }
        window.adminOpenModal = openModal;
        window.adminCloseModal = function (id) { closeModal(document.getElementById(id || 'adminModal')); };
        document.querySelectorAll('.admin-modal-close').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.closest('.admin-modal')));
        });
        document.querySelectorAll('.admin-modal').forEach(modal => {
            modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') document.querySelectorAll('.admin-modal:not(.hidden)').forEach(closeModal);
        });
    })();
    </script>
    <?php
}

function adminRowClickable(string $attrs = ''): string
{
    return 'cursor-pointer hover:bg-blue-500/5 transition-colors ' . $attrs;
}
