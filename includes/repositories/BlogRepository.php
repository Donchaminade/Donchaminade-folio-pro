<?php

declare(strict_types=1);

final class BlogRepository
{
    private const MAX_COMMENT_DEPTH = 8;

    public function __construct(private readonly PDO $db) {}

    public static function visitorHash(): string
    {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        if (str_contains($ip, ',')) {
            $ip = trim(explode(',', $ip)[0]);
        }
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        return hash('sha256', $ip . '|' . $ua);
    }

    public function listPublished(int $limit = 50, int $offset = 0, ?string $category = null): array
    {
        $sql = 'SELECT id, slug, title, excerpt, category, cover_image, reading_time, published_at,
                       views_count, likes_count, shares_count, comments_count
                FROM blog_posts
                WHERE is_published = 1 AND published_at IS NOT NULL AND published_at <= NOW()';
        $params = [];
        if ($category !== null && $category !== '') {
            $sql .= ' AND category = ?';
            $params[] = blogNormalizeCategory($category, $this->db);
        }
        $sql .= ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
        $stmt = $this->db->prepare($sql);
        $i = 1;
        foreach ($params as $p) {
            $stmt->bindValue($i++, $p);
        }
        $stmt->bindValue($i++, $limit, PDO::PARAM_INT);
        $stmt->bindValue($i, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countPublished(?string $category = null): int
    {
        $sql = 'SELECT COUNT(*) FROM blog_posts
                WHERE is_published = 1 AND published_at IS NOT NULL AND published_at <= NOW()';
        $params = [];
        if ($category !== null && $category !== '') {
            $sql .= ' AND category = ?';
            $params[] = blogNormalizeCategory($category, $this->db);
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function getBySlug(string $slug, bool $publicOnly = true): ?array
    {
        $sql = 'SELECT * FROM blog_posts WHERE slug = ?';
        if ($publicOnly) {
            $sql .= ' AND is_published = 1 AND published_at IS NOT NULL AND published_at <= NOW()';
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        return $post ?: null;
    }

    public function incrementViews(int $postId): void
    {
        $this->db->prepare('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?')->execute([$postId]);
    }

    /** Commentaires visibles sur le site (publiés, non masqués) */
    public function getPublicCommentsTree(int $postId): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, parent_id, author_name, author_role, content, created_at
             FROM blog_comments
             WHERE post_id = ? AND is_approved = 1 AND is_hidden = 0
             ORDER BY created_at ASC'
        );
        $stmt->execute([$postId]);
        $flat = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return self::buildCommentTree($flat);
    }

    /** @deprecated alias */
    public function getApprovedCommentsTree(int $postId): array
    {
        return $this->getPublicCommentsTree($postId);
    }

    /**
     * @param list<array<string, mixed>> $flat
     * @return list<array<string, mixed>>
     */
    public static function buildCommentTree(array $flat, ?int $parentId = null): array
    {
        $branch = [];
        foreach ($flat as $row) {
            $rowParent = isset($row['parent_id']) && $row['parent_id'] !== null
                ? (int) $row['parent_id']
                : null;
            if ($rowParent !== $parentId) {
                continue;
            }
            $id = (int) $row['id'];
            $branch[] = [
                'id' => $id,
                'parent_id' => $rowParent,
                'author_name' => $row['author_name'],
                'author_role' => $row['author_role'] ?? 'visitor',
                'is_admin' => ($row['author_role'] ?? 'visitor') === 'admin',
                'content' => $row['content'],
                'created_at' => $row['created_at'],
                'replies' => self::buildCommentTree($flat, $id),
            ];
        }

        return $branch;
    }

    public function countPublicComments(int $postId): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM blog_comments WHERE post_id = ? AND is_approved = 1 AND is_hidden = 0'
        );
        $stmt->execute([$postId]);

        return (int) $stmt->fetchColumn();
    }

    public function syncCommentsCount(int $postId): void
    {
        $count = $this->countPublicComments($postId);
        $this->db->prepare('UPDATE blog_posts SET comments_count = ? WHERE id = ?')
            ->execute([$count, $postId]);
    }

    public function addComment(
        int $postId,
        string $name,
        string $content,
        ?string $email = null,
        ?int $parentId = null,
        bool $autoApprove = true,
        string $authorRole = 'visitor',
        ?array $audit = null
    ): int {
        if ($parentId !== null) {
            $this->assertValidParent($postId, $parentId, $autoApprove);
        }

        if (!in_array($authorRole, ['visitor', 'admin'], true)) {
            $authorRole = 'visitor';
        }

        $audit ??= captureVisitorMeta();
        $approved = $autoApprove ? 1 : 0;

        $stmt = $this->db->prepare(
            'INSERT INTO blog_comments (
                post_id, parent_id, author_name, author_email, author_role, content,
                is_approved, is_hidden,
                ip_address, user_agent, visitor_hash, referrer,
                geo_country, geo_region, geo_city
             ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $postId,
            $parentId,
            $name,
            $email,
            $authorRole,
            $content,
            $approved,
            $audit['ip_address'] ?? null,
            $audit['user_agent'] ?? null,
            $audit['visitor_hash'] ?? null,
            $audit['referrer'] ?? null,
            $audit['geo_country'] ?? null,
            $audit['geo_region'] ?? null,
            $audit['geo_city'] ?? null,
        ]);
        $id = (int) $this->db->lastInsertId();

        if ($approved) {
            $this->syncCommentsCount($postId);
        }

        return $id;
    }

    public function setCommentHidden(int $commentId, bool $hidden): void
    {
        $comment = $this->getCommentById($commentId);
        if (!$comment) {
            return;
        }
        $this->db->prepare('UPDATE blog_comments SET is_hidden = ? WHERE id = ?')
            ->execute([$hidden ? 1 : 0, $commentId]);
        $this->syncCommentsCount((int) $comment['post_id']);
    }

    public function deleteComment(int $commentId): void
    {
        $comment = $this->getCommentById($commentId);
        if (!$comment) {
            return;
        }
        $postId = (int) $comment['post_id'];
        $postStmt = $this->db->prepare('SELECT title, slug FROM blog_posts WHERE id = ?');
        $postStmt->execute([$postId]);
        $post = $postStmt->fetch(PDO::FETCH_ASSOC) ?: ['title' => '', 'slug' => ''];

        (new CommentAuditRepository($this->db))->archiveDeletedComment(
            $comment,
            (string) ($post['title'] ?? ''),
            (string) ($post['slug'] ?? '')
        );

        $this->db->prepare('DELETE FROM blog_comments WHERE id = ?')->execute([$commentId]);
        $this->syncCommentsCount($postId);
    }

    public function getCommentById(int $commentId): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM blog_comments WHERE id = ?');
        $stmt->execute([$commentId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function formatAuditLocation(array $comment): string
    {
        $parts = array_filter([
            $comment['geo_city'] ?? '',
            $comment['geo_region'] ?? '',
            $comment['geo_country'] ?? '',
        ]);

        return $parts !== [] ? implode(', ', $parts) : '—';
    }

    public function getAdminDisplayName(): string
    {
        $name = $this->db->query('SELECT full_name FROM site_profile WHERE is_active = 1 LIMIT 1')->fetchColumn();
        if (is_string($name) && trim($name) !== '') {
            return trim($name);
        }

        return 'Donchaminade';
    }

    private function assertValidParent(int $postId, int $parentId, bool $isAdminContext): void
    {
        $stmt = $this->db->prepare(
            'SELECT id, post_id, is_approved, is_hidden FROM blog_comments WHERE id = ?'
        );
        $stmt->execute([$parentId]);
        $parent = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$parent || (int) $parent['post_id'] !== $postId) {
            throw new InvalidArgumentException('Commentaire parent invalide.');
        }

        if (!$isAdminContext) {
            if (!(int) $parent['is_approved'] || (int) $parent['is_hidden']) {
                throw new InvalidArgumentException('Impossible de répondre à ce commentaire.');
            }
        }

        $depth = $this->commentDepth($parentId);
        if ($depth >= self::MAX_COMMENT_DEPTH) {
            throw new InvalidArgumentException('Profondeur maximale de réponses atteinte.');
        }
    }

    private function commentDepth(int $commentId): int
    {
        $depth = 0;
        $current = $commentId;

        while ($current > 0 && $depth < self::MAX_COMMENT_DEPTH + 2) {
            $stmt = $this->db->prepare('SELECT parent_id FROM blog_comments WHERE id = ?');
            $stmt->execute([$current]);
            $parentId = $stmt->fetchColumn();
            if ($parentId === false || $parentId === null) {
                break;
            }
            $depth++;
            $current = (int) $parentId;
        }

        return $depth;
    }

    public function toggleLike(int $postId, string $visitorHash): array
    {
        $check = $this->db->prepare('SELECT id FROM blog_likes WHERE post_id = ? AND visitor_hash = ?');
        $check->execute([$postId, $visitorHash]);
        $existing = $check->fetch();

        if ($existing) {
            $this->db->prepare('DELETE FROM blog_likes WHERE id = ?')->execute([(int) $existing['id']]);
            $this->db->prepare('UPDATE blog_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?')->execute([$postId]);
            $liked = false;
        } else {
            $this->db->prepare('INSERT INTO blog_likes (post_id, visitor_hash) VALUES (?, ?)')->execute([$postId, $visitorHash]);
            $this->db->prepare('UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ?')->execute([$postId]);
            $liked = true;
        }

        $count = (int) $this->db->query("SELECT likes_count FROM blog_posts WHERE id = {$postId}")->fetchColumn();
        return ['liked' => $liked, 'likes_count' => $count];
    }

    public function hasLiked(int $postId, string $visitorHash): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM blog_likes WHERE post_id = ? AND visitor_hash = ?');
        $stmt->execute([$postId, $visitorHash]);
        return (bool) $stmt->fetch();
    }

    public function recordShare(int $postId, string $platform, string $visitorHash): int
    {
        $this->db->prepare('INSERT INTO blog_shares (post_id, platform, visitor_hash) VALUES (?, ?, ?)')
            ->execute([$postId, $platform, $visitorHash]);
        $this->db->prepare('UPDATE blog_posts SET shares_count = shares_count + 1 WHERE id = ?')->execute([$postId]);
        return (int) $this->db->query("SELECT shares_count FROM blog_posts WHERE id = {$postId}")->fetchColumn();
    }

    public function slugify(string $title): string
    {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');
        return $slug !== '' ? $slug : 'article-' . time();
    }

    public function ensureUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $base = $slug;
        $i = 0;
        while (true) {
            $candidate = $i === 0 ? $base : "{$base}-{$i}";
            $sql = 'SELECT id FROM blog_posts WHERE slug = ?';
            $params = [$candidate];
            if ($excludeId) {
                $sql .= ' AND id != ?';
                $params[] = $excludeId;
            }
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            if (!$stmt->fetch()) {
                return $candidate;
            }
            $i++;
        }
    }
}
