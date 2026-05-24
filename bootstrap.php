<?php

declare(strict_types=1);

$root = __DIR__;

require_once $root . '/config/env.php';
loadEnv($root);

require_once $root . '/includes/GeoIp.php';
require_once $root . '/includes/helpers.php';
require_once $root . '/includes/FileUploader.php';
require_once $root . '/includes/Database.php';
require_once $root . '/includes/Response.php';
require_once $root . '/includes/Auth.php';
require_once $root . '/includes/Csrf.php';
require_once $root . '/includes/repositories/PortfolioRepository.php';
require_once $root . '/includes/repositories/BlogRepository.php';
require_once $root . '/includes/repositories/TechnologyRepository.php';
require_once $root . '/includes/repositories/ContactRepository.php';
require_once $root . '/includes/repositories/RecommendationRepository.php';
require_once $root . '/includes/repositories/TestimonialRepository.php';
require_once $root . '/includes/repositories/CommentAuditRepository.php';
require_once $root . '/includes/blog_categories.php';
require_once $root . '/includes/AdminNotifications.php';
require_once $root . '/includes/PushNotifier.php';

$vendorAutoload = $root . '/vendor/autoload.php';
if (is_file($vendorAutoload)) {
    require_once $vendorAutoload;
}
