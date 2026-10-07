<?php

declare(strict_types=1);

function adminLangOpen(): void
{
    echo '<div class="lang-tabs" data-lang-tabs>';
    echo '<div class="lang-tabbar" role="tablist">';
    echo '<button type="button" class="is-on" data-lang-tab="fr" role="tab" aria-selected="true">FR</button>';
    echo '<button type="button" data-lang-tab="en" role="tab" aria-selected="false">EN</button>';
    echo '<button type="button" class="lang-translate" data-lang-translate>' . adminIcon('languages', 'ico') . ' Traduire vers l’anglais</button>';
    echo '</div>';
    echo '<div data-lang-pane="fr">';
}

function adminLangSwitch(): void
{
    echo '</div><div data-lang-pane="en" hidden>';
}

function adminLangClose(): void
{
    echo '</div></div>';
}

function adminField(
    string $name,
    string $label,
    string $value = '',
    string $kind = 'text',
    bool $required = false,
    string $mirror = ''
): void {
    $ia = adminInputAttrs();
    // Pas d’attribut required : un champ masqué dans l’autre onglet bloque l’envoi HTML.
    $req = '';
    unset($required);
    $src = $mirror !== '' ? ' data-i18n-src="' . e($mirror) . '"' : '';
    echo adminLabel($label);
    if ($kind === 'textarea') {
        echo '<textarea name="' . e($name) . '" rows="4" ' . $ia . $req . $src . '>' . e($value) . '</textarea>';
        return;
    }
    echo '<input name="' . e($name) . '" ' . $ia . ' value="' . e($value) . '"' . $req . $src . '>';
}
