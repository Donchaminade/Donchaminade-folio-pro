<?php

declare(strict_types=1);

final class TechnologyRepository
{
    public function __construct(private readonly PDO $db) {}

    /** @return array<string, string> name => icon_url */
    public function getIconMap(): array
    {
        $map = [];
        foreach ($this->db->query('SELECT name, icon_url FROM technologies')->fetchAll() as $row) {
            $map[$row['name']] = $row['icon_url'];
        }
        return $map;
    }

    public function getAll(): array
    {
        return $this->db->query('SELECT id, name, icon_url FROM technologies ORDER BY name ASC')->fetchAll();
    }

    /** @param list<string> $tagNames */
    public function resolveTags(array $tagNames): array
    {
        $map = $this->getIconMap();
        $result = [];
        foreach ($tagNames as $name) {
            $name = trim($name);
            if ($name === '') {
                continue;
            }
            $result[] = [
                'name' => $name,
                'icon' => $map[$name] ?? null,
            ];
        }
        return $result;
    }
}
