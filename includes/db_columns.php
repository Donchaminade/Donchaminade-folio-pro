<?php

declare(strict_types=1);

function dbHasColumn(PDO $db, string $table, string $column): bool
{
    static $cache = [];
    if (!preg_match('/^[a-z_]+$/', $table) || !preg_match('/^[a-z0-9_]+$/', $column)) {
        return false;
    }
    $key = $table . '.' . $column;
    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }
    try {
        $db->query('SELECT `' . $column . '` FROM `' . $table . '` LIMIT 0');
        $cache[$key] = true;
    } catch (PDOException) {
        $cache[$key] = false;
    }

    return $cache[$key];
}

/** Met à jour uniquement les colonnes présentes (compatible avant migration). */
function dbUpdatePresentColumns(PDO $db, string $table, int $id, array $data): void
{
    if ($id <= 0 || !preg_match('/^[a-z_]+$/', $table)) {
        return;
    }
    $sets = [];
    $vals = [];
    foreach ($data as $column => $value) {
        if (!is_string($column) || !dbHasColumn($db, $table, $column)) {
            continue;
        }
        $sets[] = '`' . $column . '` = ?';
        $vals[] = $value;
    }
    if ($sets === []) {
        return;
    }
    $vals[] = $id;
    $db->prepare('UPDATE `' . $table . '` SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
}

/** Liste SQL des colonnes optionnelles réellement présentes. */
function dbOptionalColumns(PDO $db, string $table, array $columns): string
{
    $present = [];
    foreach ($columns as $column) {
        if (is_string($column) && dbHasColumn($db, $table, $column)) {
            $present[] = '`' . $column . '`';
        }
    }

    return $present === [] ? '' : ', ' . implode(', ', $present);
}
