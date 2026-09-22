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
        AdminProvisioner::ensureFromEnv();
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #121417;
            --surface: #1a1d22;
            --elevated: #22262d;
            --border: rgba(240, 238, 233, 0.1);
            --ink: #f0eee9;
            --muted: #9aa1ac;
            --accent: #3d6ea8;
            --accent-soft: #5b86b8;
        }
        body {
            font-family: Manrope, system-ui, sans-serif;
            background: var(--bg);
            color: var(--ink);
            -webkit-font-smoothing: antialiased;
        }
        .display { font-family: Fraunces, Georgia, serif; }
        .login-card {
            background: var(--surface);
            border: 1px solid var(--border);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
        }
        .field {
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--ink);
        }
        .field:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(61, 110, 168, 0.22);
        }
        .btn-login {
            background: var(--accent);
            transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-login:hover { background: var(--accent-soft); }
        .btn-login:active { transform: scale(0.98); }
        @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
        }
    </style>
</head>
<body class="min-h-full flex items-center justify-center p-5 sm:p-8">
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3">Administration</p>
            <h1 class="display text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">Donchaminade</h1>
            <p class="text-sm text-[var(--muted)] mt-2">Connexion à l’espace admin</p>
        </div>

        <?php if ($error): ?>
            <div class="mb-4 px-4 py-3 rounded-xl border border-[rgba(196,92,92,0.4)] bg-[rgba(196,92,92,0.12)] text-[#efb0b0] text-sm">
                <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form method="post" class="login-card rounded-2xl p-6 sm:p-8 space-y-5">
            <?= Csrf::field() ?>
            <div>
                <label class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Email</label>
                <input type="email" name="email" required autocomplete="username"
                    class="field mt-2 w-full px-4 py-3 rounded-xl text-sm transition-all">
            </div>
            <div>
                <label class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Mot de passe</label>
                <input type="password" name="password" required autocomplete="current-password"
                    class="field mt-2 w-full px-4 py-3 rounded-xl text-sm transition-all">
            </div>
            <button type="submit" class="btn-login w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-[0.12em] text-white">
                Connexion
            </button>
        </form>
    </div>
</body>
</html>
