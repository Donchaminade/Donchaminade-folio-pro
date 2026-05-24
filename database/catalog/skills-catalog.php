<?php

declare(strict_types=1);

/**
 * Blocs de compétences — aligné sur constants.tsx (SKILL_BLOCKS).
 */
return [
    [
        'title' => 'Backend & API Engineering',
        'icon' => 'Server',
        'sort_order' => 1,
        'categories' => [
            [
                'name' => 'PHP (Architecture orientée production)',
                'icons' => ['PHP', 'MySQL'],
                'skills' => [
                    'PHP procédural et structuré',
                    'PDO (requêtes préparées, transactions, sécurité SQL)',
                    'Architecture MVC simplifiée',
                    'Gestion des rôles (RBAC)',
                    'Pagination, recherche, filtrage côté serveur',
                    'Génération PDF (factures)',
                    'Systèmes CRUD complets',
                    'Gestion d’authentification sécurisée',
                    'Système \'mot de passe oublié\' avec envoi d’email',
                ],
            ],
            [
                'name' => 'API Development & RESTful Services',
                'icons' => ['Node.js', 'FastAPI', 'PHP'],
                'skills' => [
                    'Conception d\'APIs RESTful performantes',
                    'Développement backend rapide avec FastAPI (Python)',
                    'Intégration frontend ↔ backend',
                    'JSON handling & documentation interactive (Swagger/OpenAPI)',
                    'Architecture modulaire (dossier admin/public)',
                    'Gestion de sous-domaines API',
                ],
            ],
            [
                'name' => 'Node.js',
                'icons' => ['Node.js', 'TypeScript'],
                'skills' => [
                    'Déploiement API Node',
                    'Intégration React + API backend',
                    'Configuration serveur production',
                ],
            ],
            [
                'name' => 'Base de Données (MySQL & Modélisation)',
                'icons' => ['MySQL', 'PostgreSQL'],
                'skills' => [
                    'Conception relationnelle, clés étrangères, contraintes',
                    'Optimisation requêtes & scripts SQL structurés',
                    'Schémas normalisés, relations 1-N / N-N',
                    'Base multi-modules (réparation, scolaire, etc.)',
                    'Gestion multi-tables complexes',
                ],
            ],
            [
                'name' => 'DevOps & Déploiement',
                'icons' => ['Git', 'GitHub'],
                'skills' => [
                    'Serveur Linux, configuration Nginx, SSL Let\'s Encrypt',
                    'Gestion erreurs 500 et sous-domaines (Hostinger)',
                    'Déploiement React + Node',
                    'Git / CLI, npm global installs, gestion dépendances',
                    'Debug erreurs environnement',
                ],
            ],
        ],
    ],
    [
        'title' => 'Fullstack Web Development',
        'icon' => 'Layout',
        'sort_order' => 2,
        'categories' => [
            [
                'name' => 'React (TypeScript)',
                'icons' => ['React', 'TypeScript', 'Next.js'],
                'skills' => [
                    'SPA (Single Page Application)',
                    'Configuration production',
                    'Intégration backend',
                    'Déploiement sur serveur (Hostinger + Nginx)',
                ],
            ],
            [
                'name' => 'HTML5 / CSS3 / JavaScript',
                'icons' => ['HTML', 'CSS', 'JavaScript'],
                'skills' => [
                    'Interfaces responsives et structuration de layouts',
                    'UI orientée expérience utilisateur',
                    'Manipulation DOM et interaction avec API',
                    'Gestion d\'états dynamiques complexes',
                ],
            ],
            [
                'name' => 'Bootstrap & Outils UI',
                'icons' => ['Bootstrap', 'Tailwind'],
                'skills' => [
                    'Dashboard admin',
                    'Modals dynamiques',
                    'Tables interactives',
                ],
            ],
            [
                'name' => 'Web Design & UI/UX',
                'icons' => ['Figma', 'Canva'],
                'skills' => [
                    'Conception d\'interfaces utilisateurs (UI)',
                    'Parcours utilisateurs (UX)',
                    'Design system & mockups',
                    'Prototypage interactif',
                ],
            ],
            [
                'name' => 'Architecture & Structuration',
                'icons' => ['VS Code', 'Git'],
                'skills' => [
                    'Organisation dossier admin/public',
                    'Séparation des responsabilités',
                    'Structuration modulaire',
                    'Architecture évolutive',
                ],
            ],
        ],
    ],
    [
        'title' => 'Mobile Development',
        'icon' => 'Smartphone',
        'sort_order' => 3,
        'categories' => [
            [
                'name' => 'Flutter',
                'icons' => ['Flutter', 'Dart', 'Supabase'],
                'skills' => [
                    'Interfaces animées',
                    'Exécution de scripts backend',
                    'Intégration Python',
                    'Gestion plugins Android',
                    'Debug mobile_scanner',
                    'Configuration Gradle',
                ],
            ],
        ],
    ],
    [
        'title' => 'AI & Data Solutions',
        'icon' => 'BrainCircuit',
        'sort_order' => 4,
        'categories' => [
            [
                'name' => 'Intégration IA',
                'icons' => ['Intelligence Artificielle', 'Python'],
                'skills' => [
                    'Intégration IA dans applications Flutter',
                    'Automatisation via scripts Python',
                    'Génération intelligente de contenu',
                    'Conception d’app SaaS (MailBlast)',
                ],
            ],
            [
                'name' => 'Data',
                'icons' => ['Python', 'MySQL'],
                'skills' => [
                    'Portails interactifs de données',
                    'Dashboard décisionnel',
                    'Visualisation de données',
                    'Logique métier orientée reporting',
                ],
            ],
            [
                'name' => 'Python',
                'icons' => ['Python'],
                'skills' => [
                    'Manipulation fichiers (.txt → matrice)',
                    'Interfaces simples de traitement',
                    'Automatisation',
                ],
            ],
        ],
    ],
    [
        'title' => 'Digital Marketing & Management',
        'icon' => 'Users',
        'sort_order' => 5,
        'categories' => [
            [
                'name' => 'Social Media & Community',
                'icons' => ['Marketing Digital', 'Creation Visuelle'],
                'skills' => [
                    'Gestion stratégique réseaux sociaux',
                    'Création de visuels et contenus',
                    'Animation de communautés tech',
                    'Suivi des performances',
                ],
            ],
            [
                'name' => 'Leadership & Team Management',
                'icons' => ['Agile', 'Word'],
                'skills' => [
                    'Gestion de projet Agile',
                    'Coordination d\'équipes techniques',
                    'Organisation d\'événements (Hackathons, Meetups)',
                    'Communication et vulgarisation technique',
                ],
            ],
        ],
    ],
];
