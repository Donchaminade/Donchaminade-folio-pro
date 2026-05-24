<?php

declare(strict_types=1);

/** Éditeur visuel Quill — pas besoin de connaître le HTML */
function adminEditor(string $fieldName, string $content = ''): void
{
    $safeContent = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
    $uploadUrl = 'api/upload.php';
    $appBase = rtrim(env('APP_URL', ''), '/');
    ?>
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
    <div class="rounded-xl border border-white/10 bg-slate-950 overflow-hidden">
        <div id="quill-toolbar" class="border-b border-white/10 bg-slate-900 flex flex-wrap gap-0.5 px-1 py-1">
            <span class="ql-formats">
                <select class="ql-header">
                    <option selected></option>
                    <option value="2">Titre H2</option>
                    <option value="3">Titre H3</option>
                </select>
            </span>
            <span class="ql-formats">
                <button type="button" class="ql-bold" title="Gras"></button>
                <button type="button" class="ql-italic" title="Italique"></button>
                <button type="button" class="ql-underline" title="Souligné"></button>
                <button type="button" class="ql-strike" title="Barré"></button>
            </span>
            <span class="ql-formats">
                <button type="button" class="ql-list" value="ordered" title="Liste numérotée"></button>
                <button type="button" class="ql-list" value="bullet" title="Liste à puces"></button>
                <button type="button" class="ql-indent" value="-1" title="Diminuer retrait"></button>
                <button type="button" class="ql-indent" value="+1" title="Augmenter retrait"></button>
            </span>
            <span class="ql-formats">
                <select class="ql-align" title="Alignement">
                    <option selected></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>
            </span>
            <span class="ql-formats">
                <button type="button" class="ql-link" title="Lien"></button>
                <button type="button" class="ql-image" title="Insérer une image"></button>
                <button type="button" class="ql-blockquote" title="Citation"></button>
                <button type="button" class="ql-code-block" title="Bloc de code"></button>
            </span>
            <span class="ql-formats">
                <button type="button" class="ql-clean" title="Effacer la mise en forme"></button>
            </span>
        </div>
        <div id="quill-editor" class="min-h-[280px] text-slate-100"></div>
    </div>
    <textarea name="<?= e($fieldName) ?>" id="quill-content" class="hidden" required><?= $safeContent ?></textarea>
    <p class="text-xs text-slate-500 mt-2">Rédigez normalement : titres, listes, images (icône image), citations, code…</p>

    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
    <script>
    (function () {
        const APP_BASE = <?= json_encode($appBase, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
        const UPLOAD_URL = <?= json_encode($uploadUrl, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;

        function displayUrl(pathOrUrl) {
            if (!pathOrUrl) return '';
            if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
            let p = pathOrUrl.startsWith('/') ? pathOrUrl : '/' + pathOrUrl;
            if (p.startsWith('/uploads/') && !p.startsWith('/public/')) p = '/public' + p;
            return APP_BASE + p;
        }

        function storagePath(urlOrPath) {
            if (!urlOrPath) return '';
            let p = urlOrPath;
            if (APP_BASE && p.startsWith(APP_BASE)) p = p.slice(APP_BASE.length);
            p = p.startsWith('/') ? p : '/' + p;
            if (p.startsWith('/public/uploads/')) p = p.slice('/public'.length);
            return p;
        }

        function rewriteImagesForDisplay(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            div.querySelectorAll('img').forEach((img) => {
                const src = img.getAttribute('src');
                if (src) img.setAttribute('src', displayUrl(storagePath(src)));
            });
            return div.innerHTML;
        }

        function rewriteImagesForStorage(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            div.querySelectorAll('img').forEach((img) => {
                const src = img.getAttribute('src');
                if (src) img.setAttribute('src', storagePath(src));
            });
            return div.innerHTML;
        }

        const quill = new Quill('#quill-editor', {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: '#quill-toolbar',
                    handlers: {
                        image: function () {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/jpeg,image/png,image/webp,image/gif';
                            input.onchange = async () => {
                                const file = input.files && input.files[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('category', 'blog');
                                const csrf = document.querySelector('input[name="_csrf"]');
                                if (csrf) fd.append('_csrf', csrf.value);
                                try {
                                    const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd, credentials: 'same-origin' });
                                    const json = await res.json();
                                    if (!res.ok || !json.success) {
                                        alert(json.error || 'Erreur lors du téléversement');
                                        return;
                                    }
                                    const showUrl = json.url || displayUrl(json.path);
                                    const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
                                    quill.insertEmbed(range.index, 'image', showUrl, 'user');
                                    quill.setSelection(range.index + 1, 0);
                                } catch (err) {
                                    alert('Impossible d\'envoyer l\'image. Vérifiez votre connexion.');
                                }
                            };
                            input.click();
                        }
                    }
                }
            }
        });

        const initial = document.getElementById('quill-content').value;
        if (initial) {
            quill.root.innerHTML = rewriteImagesForDisplay(initial);
        }

        const form = document.querySelector('form');
        form?.addEventListener('submit', () => {
            let html = quill.root.innerHTML.trim();
            html = rewriteImagesForStorage(html);
            const empty = html === '' || html === '<p><br></p>';
            document.getElementById('quill-content').value = empty ? '' : html;
        });
    })();
    </script>
    <style>
        .ql-toolbar.ql-snow, .ql-container.ql-snow { border: none; }
        .ql-editor { min-height: 260px; font-size: 15px; line-height: 1.7; color: #e2e8f0; }
        .ql-editor img { max-width: 100%; height: auto; border-radius: 12px; margin: 12px 0; display: block; }
        .ql-snow .ql-stroke { stroke: #94a3b8; }
        .ql-snow .ql-fill { fill: #94a3b8; }
        .ql-snow .ql-picker { color: #94a3b8; }
        .ql-snow .ql-picker-options { background: #0f172a; border-color: rgba(255,255,255,0.1); }
    </style>
    <?php
}

function adminMediaPreviewUrl(?string $path): string
{
    return uploadDisplayUrl($path);
}

function adminFileField(string $name, string $label, string $accept, ?string $currentPath = null): void
{
    $preview = adminMediaPreviewUrl($currentPath);
    ?>
    <label class="block text-sm font-semibold text-slate-400 mt-4"><?= e($label) ?></label>
    <?php if ($currentPath): ?>
        <div class="mt-2 mb-2 flex items-center gap-4">
            <?php if (str_ends_with(strtolower($currentPath), '.pdf')): ?>
                <a href="<?= e($preview) ?>" target="_blank" class="text-blue-400 text-sm font-semibold">📄 Document actuel (PDF)</a>
            <?php else: ?>
                <img src="<?= e($preview) ?>" alt="" class="h-20 w-20 object-cover rounded-xl border border-white/10">
            <?php endif; ?>
            <input type="hidden" name="<?= e($name) ?>_current" value="<?= e($currentPath) ?>">
        </div>
    <?php endif; ?>
    <input type="file" name="<?= e($name) ?>" accept="<?= e($accept) ?>"
        class="mt-1 block w-full max-w-xl text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-500 file:cursor-pointer">
    <?php
}

function adminResolveUploadedFile(string $fieldName, string $category, ?string $current = null): string
{
    $keep = trim((string) ($_POST[$fieldName . '_current'] ?? $current ?? ''));

    if (!empty($_FILES[$fieldName]['name']) && ($_FILES[$fieldName]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
        if ($keep && !str_starts_with($keep, 'http')) {
            FileUploader::deleteIfLocal($keep);
        }
        return FileUploader::upload($_FILES[$fieldName], $category);
    }

    return $keep;
}

/** @return list<string> chemins publics uploadés */
function adminResolveMultipleUploadedFiles(string $fieldName, string $category): array
{
    if (empty($_FILES[$fieldName]['name'])) {
        return [];
    }

    $names = $_FILES[$fieldName]['name'];
    if (!is_array($names)) {
        if (($_FILES[$fieldName]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
            return [FileUploader::upload($_FILES[$fieldName], $category)];
        }
        return [];
    }

    $uploaded = [];
    $count = count($names);
    for ($i = 0; $i < $count; $i++) {
        if (($_FILES[$fieldName]['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            continue;
        }
        $file = [
            'name' => $_FILES[$fieldName]['name'][$i],
            'type' => $_FILES[$fieldName]['type'][$i],
            'tmp_name' => $_FILES[$fieldName]['tmp_name'][$i],
            'error' => $_FILES[$fieldName]['error'][$i],
            'size' => $_FILES[$fieldName]['size'][$i],
        ];
        try {
            $uploaded[] = FileUploader::upload($file, $category);
        } catch (Throwable) {
            continue;
        }
    }

    return $uploaded;
}

/** @param list<array{url: string, sort_order?: int}> $images */
function adminProjectDetailImagesField(array $images): void
{
    ?>
    <div class="mt-6 pt-6 border-t border-white/10">
        <label class="block text-sm font-semibold text-slate-300">Images de détail (galerie)</label>
        <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
            Affichées dans le carrousel de la fiche projet sur le site. L&apos;image principale ci-dessus sert de vignette sur la grille.
        </p>
        <div id="projectDetailImagesList" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <?php foreach ($images as $img):
                $url = (string) ($img['url'] ?? '');
                if ($url === '') {
                    continue;
                }
                $preview = adminMediaPreviewUrl($url);
                ?>
            <div class="project-detail-img-item relative group rounded-xl border border-white/10 bg-slate-950/50 overflow-hidden" data-url="<?= e($url) ?>">
                <img src="<?= e($preview) ?>" alt="" class="w-full aspect-video object-cover">
                <input type="hidden" name="detail_images_keep[]" value="<?= e($url) ?>">
                <button type="button"
                    class="project-detail-img-remove absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Retirer cette image">
                    <?= adminIcon('x', 'w-4 h-4') ?>
                </button>
            </div>
            <?php endforeach; ?>
        </div>
        <label class="block text-xs font-semibold text-slate-500 mb-2">Ajouter des captures (plusieurs fichiers possibles)</label>
        <input type="file" name="detail_images[]" accept="image/*" multiple
            class="block w-full max-w-xl text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-violet-600 file:text-white file:font-semibold hover:file:bg-violet-500 file:cursor-pointer">
    </div>
    <script>
    (function () {
        document.querySelectorAll('.project-detail-img-remove').forEach((btn) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.project-detail-img-item');
                if (item) item.remove();
            });
        });
    })();
    </script>
    <?php
}

function adminSaveProjectDetailImages(PDO $db, int $projectId, array $keepUrls, array $newUrls): void
{
    $stmt = $db->prepare('SELECT url FROM project_images WHERE project_id = ?');
    $stmt->execute([$projectId]);
    $oldUrls = array_column($stmt->fetchAll(), 'url');

    $final = [];
    foreach (array_merge($keepUrls, $newUrls) as $url) {
        $url = trim((string) $url);
        if ($url !== '' && !in_array($url, $final, true)) {
            $final[] = $url;
        }
    }

    foreach ($oldUrls as $url) {
        if (!in_array($url, $final, true) && !str_starts_with($url, 'http')) {
            FileUploader::deleteIfLocal($url);
        }
    }

    $db->prepare('DELETE FROM project_images WHERE project_id = ?')->execute([$projectId]);
    $ins = $db->prepare('INSERT INTO project_images (project_id, url, sort_order) VALUES (?,?,?)');
    foreach ($final as $i => $url) {
        $ins->execute([$projectId, $url, $i]);
    }
}
