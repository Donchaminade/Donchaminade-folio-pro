<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::startSession();

if (Auth::check()) {
    redirect('index.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Csrf::requireValid();
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    try {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            Auth::login((int) $user['id'], $user['email'], $user['name']);
            redirect('index.php');
        }
        $error = 'Identifiants incorrects.';
    } catch (PDOException) {
        $error = 'Base de données inaccessible. Exécutez install.php.';
    }
}
?>
<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — Admin Donchaminade</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-full bg-slate-950 flex items-center justify-center p-6">
    <div class="fixed inset-0 -z-10">
        <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
    </div>
    <div class="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">DONCHAMINADE</h1>
            <p class="text-slate-500 text-sm mt-2 uppercase tracking-widest">Espace administration</p>
        </div>
        <?php if ($error): ?>
            <div class="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm"><?= e($error) ?></div>
        <?php endif; ?>
        <form method="post" class="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl space-y-5">
            <?= Csrf::field() ?>
            <div>
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
                <input type="email" name="email" required autocomplete="username"
                    class="mt-2 w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
            </div>
            <div>
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Mot de passe</label>
                <input type="password" name="password" required autocomplete="current-password"
                    class="mt-2 w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
            </div>
            <button type="submit" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95">
                Connexion
            </button>
        </form>
    </div>
</body>
</html>
