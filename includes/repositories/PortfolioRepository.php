<?php

declare(strict_types=1);

final class PortfolioRepository
{
    public function __construct(private readonly PDO $db) {}

    public function getProfile(): ?array
    {
        $stmt = $this->db->query('SELECT * FROM site_profile WHERE is_active = 1 ORDER BY id DESC LIMIT 1');
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function getStats(): array
    {
        $stmt = $this->db->query('SELECT label, value, suffix FROM stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
        return $stmt->fetchAll();
    }

    public function getExperiences(): array
    {
        $stmt = $this->db->query('SELECT * FROM experiences WHERE is_active = 1 ORDER BY sort_order ASC, id DESC');
        $experiences = $stmt->fetchAll();

        foreach ($experiences as &$exp) {
            $id = (int) $exp['id'];

            $desc = $this->db->prepare('SELECT content FROM experience_descriptions WHERE experience_id = ? ORDER BY sort_order ASC');
            $desc->execute([$id]);
            $exp['description'] = array_column($desc->fetchAll(), 'content');

            $tags = $this->db->prepare('SELECT tag FROM experience_tags WHERE experience_id = ?');
            $tags->execute([$id]);
            $tagNames = array_column($tags->fetchAll(), 'tag');
            $exp['tags'] = $tagNames;
            $exp['tagDetails'] = (new TechnologyRepository($this->db))->resolveTags($tagNames);

            unset($exp['is_active'], $exp['created_at'], $exp['updated_at']);
        }

        return $experiences;
    }

    public function getProjects(bool $featuredOnly = false): array
    {
        $sql = 'SELECT * FROM projects WHERE is_active = 1';
        if ($featuredOnly) {
            $sql .= ' AND is_featured = 1';
        }
        $sql .= ' ORDER BY sort_order ASC, id DESC';

        $stmt = $this->db->query($sql);
        $projects = $stmt->fetchAll();

        foreach ($projects as &$project) {
            $id = (int) $project['id'];

            $imgs = $this->db->prepare('SELECT url FROM project_images WHERE project_id = ? ORDER BY sort_order ASC');
            $imgs->execute([$id]);
            $additional = array_column($imgs->fetchAll(), 'url');
            if ($additional !== []) {
                $project['additionalImages'] = $additional;
            }

            $tags = $this->db->prepare('SELECT tag FROM project_tags WHERE project_id = ?');
            $tags->execute([$id]);
            $tagNames = array_column($tags->fetchAll(), 'tag');
            $project['tags'] = $tagNames;
            $project['tagDetails'] = (new TechnologyRepository($this->db))->resolveTags($tagNames);

            $project['detailedDescription'] = $project['detailed_description'] ?? null;
            unset($project['detailed_description'], $project['is_active'], $project['is_featured'], $project['created_at'], $project['updated_at']);
        }

        return $projects;
    }

    public function getSkillBlocks(): array
    {
        $blocks = $this->db->query('SELECT id, title, icon FROM skill_blocks WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        $result = [];

        foreach ($blocks as $block) {
            $blockId = (int) $block['id'];
            $cats = $this->db->prepare('SELECT id, name FROM skill_categories WHERE block_id = ? ORDER BY sort_order ASC');
            $cats->execute([$blockId]);
            $categories = [];

            foreach ($cats->fetchAll() as $cat) {
                $catId = (int) $cat['id'];

                $icons = $this->db->prepare('SELECT icon_url FROM skill_category_icons WHERE category_id = ? ORDER BY sort_order ASC');
                $icons->execute([$catId]);
                $iconUrls = array_column($icons->fetchAll(), 'icon_url');

                $items = $this->db->prepare('SELECT name FROM skill_items WHERE category_id = ? ORDER BY sort_order ASC');
                $items->execute([$catId]);
                $skills = array_column($items->fetchAll(), 'name');

                $categories[] = [
                    'name' => $cat['name'],
                    'icons' => $iconUrls ?: null,
                    'skills' => $skills,
                ];
            }

            $result[] = [
                'title' => $block['title'],
                'icon' => $block['icon'],
                'categories' => $categories,
            ];
        }

        return $result;
    }

    public function getSoftSkills(): array
    {
        $skills = $this->db->query('SELECT id, title, impact FROM soft_skills WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        $result = [];

        foreach ($skills as $skill) {
            $ctx = $this->db->prepare('SELECT context FROM soft_skill_contexts WHERE soft_skill_id = ?');
            $ctx->execute([(int) $skill['id']]);
            $result[] = [
                'title' => $skill['title'],
                'impact' => $skill['impact'],
                'context' => array_column($ctx->fetchAll(), 'context'),
            ];
        }

        return $result;
    }

    public function getEducation(): array
    {
        $stmt = $this->db->query('SELECT degree, field, school, year FROM education WHERE is_active = 1 ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public function getAwards(): array
    {
        $stmt = $this->db->query('SELECT title, issuer, year, description FROM awards WHERE is_active = 1 ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public function getTestimonials(): array
    {
        return (new TestimonialRepository($this->db))->listPublic();
    }

    public function getRecommendations(): array
    {
        return (new RecommendationRepository($this->db))->listPublic();
    }

    public function getCommunities(): array
    {
        $stmt = $this->db->query(
            'SELECT name, logo, role, description, website_url AS websiteUrl, linkedin_url AS linkedinUrl
             FROM communities WHERE is_active = 1 ORDER BY sort_order ASC'
        );
        return $stmt->fetchAll();
    }

    public function getManagedPages(): array
    {
        $stmt = $this->db->query('SELECT name, logo, link, followers, category, border_color AS borderColor FROM managed_pages WHERE is_active = 1 ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public function getGalleryImages(): array
    {
        $stmt = $this->db->query('SELECT url, caption FROM gallery_images WHERE is_active = 1 ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public function getClients(): array
    {
        $stmt = $this->db->query('SELECT name, logo FROM clients WHERE is_active = 1 ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public function getTechnologies(): array
    {
        $stmt = $this->db->query('SELECT name, icon_url FROM technologies ORDER BY name ASC');
        $map = [];
        foreach ($stmt->fetchAll() as $row) {
            $map[$row['name']] = $row['icon_url'];
        }
        return $map;
    }

    public function getPortfolioBundle(): array
    {
        return [
            'profile' => $this->getProfile(),
            'stats' => $this->getStats(),
            'experiences' => $this->getExperiences(),
            'projects' => $this->getProjects(),
            'skillBlocks' => $this->getSkillBlocks(),
            'softSkills' => $this->getSoftSkills(),
            'education' => $this->getEducation(),
            'awards' => $this->getAwards(),
            'testimonials' => $this->getTestimonials(),
            'recommendations' => $this->getRecommendations(),
            'communities' => $this->getCommunities(),
            'managedPages' => $this->getManagedPages(),
            'galleryImages' => $this->getGalleryImages(),
            'clients' => $this->getClients(),
            'techIcons' => $this->getTechnologies(),
        ];
    }

    /** Compteurs pour le dashboard admin */
    public function getCounts(): array
    {
        $tables = [
            'projects',
            'experiences',
            'stats',
            'testimonials',
            'recommendations',
            'communities',
            'awards',
            'technologies',
            'contact_messages',
        ];
        $counts = [];

        foreach ($tables as $table) {
            try {
                $counts[$table] = (int) $this->db->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
            } catch (PDOException) {
                $counts[$table] = 0;
            }
        }

        try {
            $counts['unread_messages'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM contact_messages WHERE is_read = 0'
            )->fetchColumn();
            $counts['testimonials_pending'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM testimonials WHERE is_approved = 0'
            )->fetchColumn();
            $counts['testimonials_published'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM testimonials WHERE is_approved = 1 AND is_active = 1'
            )->fetchColumn();
            $counts['recommendations_visible'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM recommendations WHERE is_active = 1 AND is_hidden = 0'
            )->fetchColumn();
            $counts['blog_posts'] = (int) $this->db->query('SELECT COUNT(*) FROM blog_posts')->fetchColumn();
            $counts['blog_published'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM blog_posts WHERE is_published = 1'
            )->fetchColumn();
            $counts['projects_active'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM projects WHERE is_active = 1'
            )->fetchColumn();
            $counts['experiences_active'] = (int) $this->db->query(
                'SELECT COUNT(*) FROM experiences WHERE is_active = 1'
            )->fetchColumn();
        } catch (PDOException) {
            $counts['unread_messages'] = 0;
            $counts['testimonials_pending'] = 0;
            $counts['testimonials_published'] = 0;
            $counts['recommendations_visible'] = 0;
            $counts['blog_posts'] = 0;
            $counts['blog_published'] = 0;
            $counts['projects_active'] = $counts['projects'] ?? 0;
            $counts['experiences_active'] = $counts['experiences'] ?? 0;
        }

        return $counts;
    }
}
