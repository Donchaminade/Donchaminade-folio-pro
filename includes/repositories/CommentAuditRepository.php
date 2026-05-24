<?php

declare(strict_types=1);

final class CommentAuditRepository
{
    private const RETENTION_DAYS = 7;

    public function __construct(private readonly PDO $db) {}

    public function archiveDeletedComment(array $comment, string $postTitle, string $postSlug): void
    {
        $expires = (new DateTimeImmutable('+' . self::RETENTION_DAYS . ' days'))->format('Y-m-d H:i:s');
        $stmt = $this->db->prepare(
            'INSERT INTO comment_audit_logs (
                comment_id, post_id, post_title, post_slug, author_name, author_email, author_role,
                content, ip_address, user_agent, visitor_hash, referrer,
                geo_country, geo_region, geo_city, is_hidden, comment_created_at, expires_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            (int) $comment['id'],
            (int) $comment['post_id'],
            $postTitle,
            $postSlug,
            $comment['author_name'],
            $comment['author_email'] ?? null,
            $comment['author_role'] ?? 'visitor',
            $comment['content'],
            $comment['ip_address'] ?? null,
            $comment['user_agent'] ?? null,
            $comment['visitor_hash'] ?? null,
            $comment['referrer'] ?? null,
            $comment['geo_country'] ?? null,
            $comment['geo_region'] ?? null,
            $comment['geo_city'] ?? null,
            (int) ($comment['is_hidden'] ?? 0),
            $comment['created_at'] ?? null,
            $expires,
        ]);
    }

    public function purgeExpired(): int
    {
        return $this->db->exec('DELETE FROM comment_audit_logs WHERE expires_at < NOW()') ?: 0;
    }

    /** @return list<array<string, mixed>> */
    public function listArchivedForAudit(int $limit = 500): array
    {
        $stmt = $this->db->prepare(
            'SELECT archive_id, comment_id, post_id, post_title, post_slug,
                    author_name, author_email, author_role, content,
                    ip_address, user_agent, visitor_hash, referrer,
                    geo_country, geo_region, geo_city, is_hidden,
                    comment_created_at AS created_at, deleted_at, expires_at,
                    1 AS is_deleted
             FROM (
                SELECT id AS archive_id, comment_id, post_id, post_title, post_slug,
                       author_name, author_email, author_role, content,
                       ip_address, user_agent, visitor_hash, referrer,
                       geo_country, geo_region, geo_city, is_hidden,
                       comment_created_at, deleted_at, expires_at
                FROM comment_audit_logs
                WHERE expires_at >= NOW()
             ) archived
             ORDER BY deleted_at DESC
             LIMIT ?'
        );
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
