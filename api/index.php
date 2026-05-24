<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Response::cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'GET') {
    Response::error('Méthode non autorisée', 405);
}

try {
    $repo = new PortfolioRepository(Database::connection());
} catch (PDOException $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error(
        $debug ? 'Erreur base de données : ' . $e->getMessage() : 'Service temporairement indisponible',
        503
    );
}

$resource = $_GET['resource'] ?? 'portfolio';

try {
    $data = match ($resource) {
        'portfolio' => $repo->getPortfolioBundle(),
        'profile' => $repo->getProfile(),
        'stats' => $repo->getStats(),
        'experiences' => $repo->getExperiences(),
        'projects' => $repo->getProjects(),
        'projects-featured' => $repo->getProjects(true),
        'skills' => [
            'skillBlocks' => $repo->getSkillBlocks(),
            'softSkills' => $repo->getSoftSkills(),
        ],
        'education' => $repo->getEducation(),
        'awards' => $repo->getAwards(),
        'communities' => $repo->getCommunities(),
        'testimonials' => $repo->getTestimonials(),
        'recommendations' => $repo->getRecommendations(),
        'managed-pages' => $repo->getManagedPages(),
        'gallery' => $repo->getGalleryImages(),
        'clients' => $repo->getClients(),
        'technologies' => $repo->getTechnologies(),
        default => null,
    };
} catch (Throwable $e) {
    $debug = env('APP_DEBUG', 'false') === 'true';
    Response::error($debug ? $e->getMessage() : 'Erreur serveur', 500);
}

if ($data === null) {
    Response::error('Ressource inconnue. Utilisez ?resource=portfolio', 404);
}

Response::json([
    'success' => true,
    'resource' => $resource,
    'data' => $data,
]);
