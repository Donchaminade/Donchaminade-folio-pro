<?php

declare(strict_types=1);

final class ContactRepository
{
    public function __construct(private readonly PDO $db) {}

    public function createContact(string $name, string $email, string $message, array $audit): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO contact_messages (
                message_type, name, email, message,
                ip_address, user_agent, visitor_hash, referrer,
                geo_country, geo_region, geo_city
             ) VALUES (\'contact\', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $name,
            $email,
            $message,
            $audit['ip_address'] ?? null,
            $audit['user_agent'] ?? null,
            $audit['visitor_hash'] ?? null,
            $audit['referrer'] ?? null,
            $audit['geo_country'] ?? null,
            $audit['geo_region'] ?? null,
            $audit['geo_city'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

  /**
     * @param array{
     *   name: string,
     *   email: string,
     *   phone?: string,
     *   company?: string,
     *   subject?: string,
     *   collaboration_brief: string,
     *   has_documents: bool,
     *   documents_details?: string,
     *   meeting_platform?: string,
     *   meeting_slots?: string,
     *   meeting_notes?: string,
     * } $data
     */
    public function createCollaboration(array $data, array $audit): int
    {
        $summary = $this->buildCollaborationSummary($data);

        $stmt = $this->db->prepare(
            'INSERT INTO contact_messages (
                message_type, name, email, subject, company, phone, message,
                collaboration_brief, has_documents, documents_details,
                meeting_platform, meeting_slots, meeting_notes,
                ip_address, user_agent, visitor_hash, referrer,
                geo_country, geo_region, geo_city
             ) VALUES (
                \'collaboration\', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
             )'
        );
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['subject'] ?? null,
            $data['company'] ?? null,
            $data['phone'] ?? null,
            $summary,
            $data['collaboration_brief'],
            $data['has_documents'] ? 1 : 0,
            $data['documents_details'] ?? null,
            $data['meeting_platform'] ?? null,
            $data['meeting_slots'] ?? null,
            $data['meeting_notes'] ?? null,
            $audit['ip_address'] ?? null,
            $audit['user_agent'] ?? null,
            $audit['visitor_hash'] ?? null,
            $audit['referrer'] ?? null,
            $audit['geo_country'] ?? null,
            $audit['geo_region'] ?? null,
            $audit['geo_city'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    private function buildCollaborationSummary(array $data): string
    {
        $lines = [
            '=== Demande de collaboration ===',
            'Objet : ' . ($data['subject'] ?? '—'),
            'Entreprise : ' . ($data['company'] ?? '—'),
            'Téléphone : ' . ($data['phone'] ?? '—'),
            '',
            'Projet / besoin :',
            $data['collaboration_brief'],
            '',
            'Documents à fournir : ' . ($data['has_documents'] ? 'Oui' : 'Non'),
        ];
        if (!empty($data['documents_details'])) {
            $lines[] = 'Détail documents : ' . $data['documents_details'];
        }
        $lines[] = '';
        $lines[] = 'Appel proposé : ' . ($data['meeting_platform'] ?? '—');
        if (!empty($data['meeting_slots'])) {
            $lines[] = 'Créneaux : ' . $data['meeting_slots'];
        }
        if (!empty($data['meeting_notes'])) {
            $lines[] = 'Notes : ' . $data['meeting_notes'];
        }

        return implode("\n", $lines);
    }

    /**
     * @param list<array{path: string, original_name: string, mime: string, size: int}> $files
     */
    public function attachFiles(int $messageId, array $files): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO contact_message_attachments (message_id, original_name, stored_path, mime_type, size_bytes)
             VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($files as $file) {
            $stmt->execute([
                $messageId,
                $file['original_name'],
                $file['path'],
                $file['mime'],
                $file['size'],
            ]);
        }
    }

    /** @return array<int, list<array<string, mixed>>> */
    public function getAttachmentsGrouped(array $messageIds): array
    {
        if ($messageIds === []) {
            return [];
        }
        $placeholders = implode(',', array_fill(0, count($messageIds), '?'));
        $stmt = $this->db->prepare(
            "SELECT * FROM contact_message_attachments WHERE message_id IN ({$placeholders}) ORDER BY id ASC"
        );
        $stmt->execute($messageIds);
        $grouped = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $mid = (int) $row['message_id'];
            $grouped[$mid][] = $row;
        }

        return $grouped;
    }

    public static function formatLocation(array $row): string
    {
        $parts = array_filter([
            $row['geo_city'] ?? '',
            $row['geo_region'] ?? '',
            $row['geo_country'] ?? '',
        ]);

        return $parts !== [] ? implode(', ', $parts) : '—';
    }
}
