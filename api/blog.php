<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $repo = new BlogRepository(Database::connection());
} catch (PDOException $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Service indisponible', 503);
}

$input = [];
if ($method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        $input = $_POST;
    }
}

$action = $_GET['action'] ?? ($input['action'] ?? 'list');
$visitorHash = BlogRepository::visitorHash();

if ($method === 'GET') {
    if ($action === 'list') {
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = min(50, max(1, (int) ($_GET['limit'] ?? 12)));
        $offset = ($page - 1) * $limit;
        $category = trim((string) ($_GET['category'] ?? ''));
        $pdo = Database::connection();
        $catFilter = $category !== '' ? blogNormalizeCategory($category, $pdo) : null;
        $total = $repo->countPublished($catFilter);
        $rows = $repo->listPublished($limit, $offset, $catFilter);
        Response::json([
            'success' => true,
            'data' => $rows,
            'page' => $page,
            'total' => $total,
            'hasMore' => $offset + count($rows) < $total,
            'categories' => blogCategoriesForApi($pdo),
        ]);
    }

    if ($action === 'categories') {
        Response::json([
            'success' => true,
            'data' => blogCategoriesForApi(Database::connection()),
        ]);
    }

    if ($action === 'post') {
        $slug = trim((string) ($_GET['slug'] ?? ''));
        if ($slug === '') {
            Response::error('Slug requis', 422);
        }

        $post = $repo->getBySlug($slug);
        if (!$post) {
            Response::error('Article introuvable', 404);
        }

        $repo->incrementViews((int) $post['id']);
        $post['views_count'] = (int) $post['views_count'] + 1;
        $post['liked'] = $repo->hasLiked((int) $post['id'], $visitorHash);
        $postId = (int) $post['id'];
        $post['share_url'] = blogShareUrl($slug);
        $post['og_image_url'] = absoluteMediaUrl((string) ($post['cover_image'] ?? ''));
        $post['comments'] = $repo->getPublicCommentsTree($postId);
        $post['comments_count'] = $repo->countPublicComments($postId);

        Response::json(['success' => true, 'data' => $post]);
    }

    Response::error('Action GET inconnue', 404);
}

if ($method === 'POST') {
    $slug = trim((string) ($input['slug'] ?? ''));
    if ($slug === '') {
        Response::error('Slug requis', 422);
    }

    $post = $repo->getBySlug($slug);
    if (!$post) {
        Response::error('Article introuvable', 404);
    }
    $postId = (int) $post['id'];

    if ($action === 'like') {
        $result = $repo->toggleLike($postId, $visitorHash);
        Response::json(['success' => true, 'data' => $result]);
    }

    if ($action === 'share') {
        $platform = trim((string) ($input['platform'] ?? 'copy'));
        $allowed = ['linkedin', 'twitter', 'facebook', 'whatsapp', 'copy', 'email'];
        if (!in_array($platform, $allowed, true)) {
            Response::error('Plateforme invalide', 422);
        }
        $shares = $repo->recordShare($postId, $platform, $visitorHash);
        Response::json(['success' => true, 'data' => ['shares_count' => $shares]]);
    }

    if ($action === 'comment') {
        $name = trim((string) ($input['name'] ?? ''));
        $content = trim((string) ($input['content'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));

        if ($name === '' || $content === '') {
            Response::error('Nom et message obligatoires', 422);
        }
        if (strlen($name) > 120 || strlen($content) > 2000) {
            Response::error('Données trop longues', 422);
        }
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email invalide', 422);
        }

        $parentId = isset($input['parent_id']) ? (int) $input['parent_id'] : null;
        if ($parentId !== null && $parentId <= 0) {
            $parentId = null;
        }

        try {
            $commentId = $repo->addComment(
                $postId,
                $name,
                $content,
                $email ?: null,
                $parentId,
                true,
                'visitor',
                captureVisitorMeta()
            );
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), 422);
        }

        PushNotifier::notifyAdmins(
            $parentId ? 'Réponse sur le blog' : 'Nouveau commentaire blog',
            $name . ' a commenté un article.',
            'blog-comments.php'
        );

        Response::json([
            'success' => true,
            'message' => $parentId ? 'Réponse publiée.' : 'Commentaire publié.',
            'data' => [
                'id' => $commentId,
                'parent_id' => $parentId,
                'comments' => $repo->getPublicCommentsTree($postId),
                'comments_count' => $repo->countPublicComments($postId),
            ],
        ], 201);
    }

    Response::error('Action POST inconnue', 404);
}

Response::error('Méthode non autorisée', 405);
