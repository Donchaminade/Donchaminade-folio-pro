<?php

declare(strict_types=1);

/**
 * Prépare le dossier hostinger-upload/ prêt à zipper pour Hostinger.
 * CLI : php scripts/build-hostinger-package.php
 */

$root = dirname(__DIR__);
$out = $root . DIRECTORY_SEPARATOR . 'hostinger-upload';

$dirs = ['admin', 'api', 'blog', 'config', 'database', 'includes', 'uploads', 'vendor'];
$files = ['bootstrap.php', 'install.php', '.htaccess', 'composer.json', 'composer.lock'];

function rrmdir(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }
    $items = scandir($dir);
    if ($items === false) {
        return;
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            rrmdir($path);
        } else {
            unlink($path);
        }
    }
    rmdir($dir);
}

function copyDir(string $src, string $dst, array $skipDirNames = []): void
{
    if (!is_dir($src)) {
        return;
    }
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    $items = scandir($src);
    if ($items === false) {
        return;
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        if (in_array($item, $skipDirNames, true)) {
            continue;
        }
        $from = $src . DIRECTORY_SEPARATOR . $item;
        $to = $dst . DIRECTORY_SEPARATOR . $item;
        if (is_dir($from)) {
            copyDir($from, $to, $skipDirNames);
        } else {
            copy($from, $to);
        }
    }
}

echo "Préparation de hostinger-upload/ ...\n";

if (is_dir($out)) {
    rrmdir($out);
}
mkdir($out, 0755, true);

foreach ($dirs as $dir) {
    $src = $root . DIRECTORY_SEPARATOR . $dir;
    if (!is_dir($src)) {
        echo "[SKIP] {$dir}/ (absent)\n";
        continue;
    }
    copyDir($src, $out . DIRECTORY_SEPARATOR . $dir);
    echo "[OK] {$dir}/\n";
}

// public/ sans uploads/ (médias servis par l'API en prod)
$publicSrc = $root . DIRECTORY_SEPARATOR . 'public';
if (is_dir($publicSrc)) {
    copyDir($publicSrc, $out . DIRECTORY_SEPARATOR . 'public', ['uploads']);
    echo "[OK] public/ (sans uploads/)\n";
}

foreach ($files as $file) {
    $src = $root . DIRECTORY_SEPARATOR . $file;
    if (!is_file($src)) {
        echo "[SKIP] {$file}\n";
        continue;
    }
    copy($src, $out . DIRECTORY_SEPARATOR . $file);
    echo "[OK] {$file}\n";
}

// Modèle .env pour Hostinger
$envExample = $root . DIRECTORY_SEPARATOR . '.env.production.example';
if (is_file($envExample)) {
    copy($envExample, $out . DIRECTORY_SEPARATOR . '.env.exemple');
    echo "[OK] .env.exemple (renommer en .env sur le serveur)\n";
}

$readme = <<<'TXT'
DÉPLOIEMENT HOSTINGER — donchamfolio.grosbit.com
================================================

1. Uploadez hostinger-upload.zip (à la racine de donchamfolio/)
2. Extrayez le zip DANS donchamfolio/ (pas ailleurs)
3. VÉRIFIEZ : vous devez voir des DOSSIERS « admin », « api », « public »…
   PAS des fichiers nommés « admin\api\upload.php » (c’est incorrect)
4. Renommer .env.exemple → .env et remplir DB_NAME, DB_USER, DB_PASS
5. Supprimer install.php après installation
6. Droits 755 sur public/uploads/ et uploads/

Test API :
https://donchamfolio.grosbit.com/api/index.php?resource=portfolio

Admin :
https://donchamfolio.grosbit.com/admin/login.php

Front React = Vercel (pas dans ce zip).
TXT;

file_put_contents($out . DIRECTORY_SEPARATOR . 'LISEZMOI-DEPLOIEMENT.txt', $readme);
echo "[OK] LISEZMOI-DEPLOIEMENT.txt\n";

if (!is_dir($out . DIRECTORY_SEPARATOR . 'vendor')) {
    echo "\n[ATTENTION] vendor/ manquant — lancez : composer install --no-dev\n";
    exit(1);
}

$zipPath = $root . DIRECTORY_SEPARATOR . 'hostinger-upload.zip';
if (is_file($zipPath)) {
    unlink($zipPath);
}

if (!class_exists('ZipArchive')) {
    echo "\nPrêt. Zippez manuellement le dossier hostinger-upload/ (FileZilla recommandé).\n";
    echo "Chemin : {$out}\n";
    exit(0);
}

$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "\n[ERREUR] Impossible de créer hostinger-upload.zip\n";
    exit(1);
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($out, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $item) {
    $fullPath = $item->getPathname();
    $relative = substr($fullPath, strlen($out) + 1);
    $relative = str_replace('\\', '/', $relative);
    if ($item->isDir()) {
        $zip->addEmptyDir($relative);
    } else {
        $zip->addFile($fullPath, $relative);
    }
}

$zip->close();

$sizeMb = round(filesize($zipPath) / 1024 / 1024, 1);
echo "\nPrêt.\n";
echo "Dossier : {$out}\n";
echo "Zip     : {$zipPath} ({$sizeMb} Mo)\n";
echo "\nSur Hostinger : supprimez tout dans donchamfolio/, uploadez hostinger-upload.zip, extrayez.\n";
echo "Vous devez voir des DOSSIERS admin/ api/ (pas des noms avec \\\\).\n";
