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
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — Admin Donchaminade</title>
    <script>
      try { if (localStorage.getItem('admin-theme') === 'light') document.documentElement.classList.add('admin-light'); } catch (e) {}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-body">
    <main class="login-shell">
        <div>
            <div style="text-align:center;margin-bottom:1.4rem">
                <p class="login-kicker">Administration</p>
                <h1>Donchaminade</h1>
                <p style="color:var(--a-muted);margin:0">Connexion à l’espace admin</p>
            </div>
            <?php if ($error): ?>
                <div class="login-error" role="alert"><?= e($error) ?></div>
            <?php endif; ?>
            <form method="post" class="login-card">
                <?= Csrf::field() ?>
                <label for="email">Email</label>
                <input id="email" type="email" name="email" required autocomplete="username">
                <label for="password">Mot de passe</label>
                <input id="password" type="password" name="password" required autocomplete="current-password">
                <button type="submit">Connexion</button>
            </form>
        </div>
    </main>
</body>
</html>
