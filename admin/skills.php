<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/includes/layout.php';

Auth::requireAdmin();

ob_start();
adminPanelStart('max-w-2xl');
?>
    <p class="text-slate-300 leading-relaxed">La gestion complète des blocs de compétences arrive bientôt. En attendant, modifiez le profil, les projets et les expériences.</p>
<?php
adminPanelEnd();
adminLayout('Compétences', ob_get_clean(), 'skills.php');
