<?php

declare(strict_types=1);

/** Compteurs et « vu » pour badges admin / PWA */
final class AdminNotifications
{
    private const SESSION_KEY = 'admin_seen_at';

    public function __construct(private readonly PDO $db) {}

    public function markSeen(string $type): void
    {
        Auth::startSession();
        $_SESSION[self::SESSION_KEY] ??= [];
        $_SESSION[self::SESSION_KEY][$type] = time();
    }

    /** @return array{comments:int,testimonials:int,recommendations:int,messages:int,total:int} */
    public function getCounts(): array
    {
        Auth::startSession();
        $seen = $_SESSION[self::SESSION_KEY] ?? [];

        $comments = $this->countSince(
            "SELECT COUNT(*) FROM blog_comments WHERE author_role = 'visitor' AND created_at > FROM_UNIXTIME(?)",
            (int) ($seen['comments'] ?? 0)
        );

        $testimonials = (int) $this->db->query(
            'SELECT COUNT(*) FROM testimonials WHERE is_approved = 0'
        )->fetchColumn();

        $recommendations = $this->countSince(
            'SELECT COUNT(*) FROM recommendations WHERE is_hidden = 0 AND created_at > FROM_UNIXTIME(?)',
            (int) ($seen['recommendations'] ?? 0)
        );

        $messages = (int) $this->db->query(
            'SELECT COUNT(*) FROM contact_messages WHERE is_read = 0'
        )->fetchColumn();

        return [
            'comments' => $comments,
            'testimonials' => $testimonials,
            'recommendations' => $recommendations,
            'messages' => $messages,
            'total' => $comments + $testimonials + $recommendations + $messages,
        ];
    }

    private function countSince(string $sql, int $sinceUnix): int
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$sinceUnix]);

        return (int) $stmt->fetchColumn();
    }

    /** @return list<array{type:string,label:string,href:string,count:int}> */
    public function getItems(): array
    {
        $counts = $this->getCounts();
        $items = [];

        if ($counts['comments'] > 0) {
            $items[] = ['type' => 'comments', 'label' => 'Commentaires blog', 'href' => 'blog-comments.php', 'count' => $counts['comments']];
        }
        if ($counts['testimonials'] > 0) {
            $items[] = ['type' => 'testimonials', 'label' => 'Témoignages à valider', 'href' => 'testimonials.php?filter=pending', 'count' => $counts['testimonials']];
        }
        if ($counts['recommendations'] > 0) {
            $items[] = ['type' => 'recommendations', 'label' => 'Nouvelles recommandations', 'href' => 'recommendations.php', 'count' => $counts['recommendations']];
        }
        if ($counts['messages'] > 0) {
            $items[] = ['type' => 'messages', 'label' => 'Messages non lus', 'href' => 'messages.php', 'count' => $counts['messages']];
        }

        return $items;
    }

    public static function markSeenForPage(string $activeFile): void
    {
        $map = [
            'blog-comments.php' => 'comments',
            'testimonials.php' => 'testimonials',
            'recommendations.php' => 'recommendations',
            'messages.php' => 'messages',
        ];
        if (!isset($map[$activeFile])) {
            return;
        }
        try {
            (new self(Database::connection()))->markSeen($map[$activeFile]);
        } catch (Throwable) {
            // ignore
        }
    }
}
