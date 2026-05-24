<?php

declare(strict_types=1);

final class RecommendationRepository
{
    public function __construct(private readonly PDO $db) {}

    public function listPublic(): array
    {
        $stmt = $this->db->query(
            'SELECT name, role, company, body, rating, created_at AS createdAt
             FROM recommendations
             WHERE is_active = 1 AND is_hidden = 0
             ORDER BY created_at DESC'
        );
        return $stmt->fetchAll();
    }

    public function create(array $data, array $audit): int
    {
        $rating = max(1, min(5, (int) ($data['rating'] ?? 5)));

        $stmt = $this->db->prepare(
            'INSERT INTO recommendations (name, email, role, company, body, rating, ip_address, user_agent, referrer)
             VALUES (?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $data['name'],
            $data['email'] ?: null,
            $data['role'] ?: null,
            $data['company'] ?: null,
            $data['body'],
            $rating,
            $audit['ip_address'] ?? null,
            $audit['user_agent'] ?? null,
            $audit['referrer'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function setHidden(int $id, bool $hidden): void
    {
        $this->db->prepare('UPDATE recommendations SET is_hidden = ? WHERE id = ?')
            ->execute([$hidden ? 1 : 0, $id]);
    }

    public function delete(int $id): void
    {
        $this->db->prepare('DELETE FROM recommendations WHERE id = ?')->execute([$id]);
    }

    public function countVisible(): int
    {
        return (int) $this->db->query(
            'SELECT COUNT(*) FROM recommendations WHERE is_active = 1 AND is_hidden = 0'
        )->fetchColumn();
    }
}
