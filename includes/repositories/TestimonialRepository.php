<?php

declare(strict_types=1);

final class TestimonialRepository
{
    public function __construct(private readonly PDO $db) {}

    public function listPublic(): array
    {
        $stmt = $this->db->query(
            'SELECT quote, name, role, company, image
             FROM testimonials
             WHERE is_active = 1 AND is_approved = 1
             ORDER BY sort_order ASC, id DESC'
        );
        return $stmt->fetchAll();
    }

    public function createVisitor(array $data, array $audit): int
    {
        $maxOrder = (int) $this->db->query('SELECT COALESCE(MAX(sort_order),0) FROM testimonials')->fetchColumn();
        $stmt = $this->db->prepare(
            'INSERT INTO testimonials (quote, name, role, company, image, email, sort_order, is_active, is_approved, ip_address, user_agent)
             VALUES (?,?,?,?,?,?,?,1,0,?,?)'
        );
        $stmt->execute([
            $data['quote'],
            $data['name'],
            $data['role'] ?? '',
            $data['company'] ?? '',
            $data['image'] ?? null,
            $data['email'] ?? null,
            $maxOrder + 1,
            $audit['ip_address'] ?? null,
            $audit['user_agent'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function approve(int $id): void
    {
        $this->db->prepare('UPDATE testimonials SET is_approved = 1 WHERE id = ?')->execute([$id]);
    }

    public function reject(int $id): void
    {
        $s = $this->db->prepare('SELECT image FROM testimonials WHERE id = ? AND is_approved = 0');
        $s->execute([$id]);
        $img = $s->fetchColumn();
        if (is_string($img) && $img !== '' && !str_starts_with($img, 'http')) {
            FileUploader::deleteIfLocal($img);
        }
        $this->db->prepare('DELETE FROM testimonials WHERE id = ? AND is_approved = 0')->execute([$id]);
    }

    public function countPending(): int
    {
        return (int) $this->db->query(
            'SELECT COUNT(*) FROM testimonials WHERE is_approved = 0'
        )->fetchColumn();
    }
}
