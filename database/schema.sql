-- Portfolio Donchaminade — Schéma MySQL
-- Charset: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS portfolio_donchaminade
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_donchaminade;

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Profil & paramètres globaux (1 ligne active)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_profile (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL DEFAULT 'ADJOLOU Dondah Chaminade',
  hero_title VARCHAR(255) NOT NULL DEFAULT 'Développeur Web & Mobile.',
  hero_subtitle VARCHAR(500) DEFAULT '',
  bio TEXT,
  availability_text VARCHAR(255) DEFAULT 'Disponible pour de nouveaux défis',
  experience_badge VARCHAR(50) DEFAULT '3+ ans',
  experience_badge_label VARCHAR(100) DEFAULT 'Expérience Solide',
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  github_url VARCHAR(500),
  cv_path VARCHAR(500) DEFAULT '/CV_ADJOLOU_DONDAH_CHAMINADE.pdf',
  photo_path VARCHAR(500) DEFAULT '/pypicture.png',
  footer_year VARCHAR(10) DEFAULT '2024',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Stats (bandeau chiffres)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(120) NOT NULL,
  value VARCHAR(20) NOT NULL,
  suffix VARCHAR(20) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Technologies (référentiel icônes)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technologies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  icon_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Expériences
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  period VARCHAR(120) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS experience_descriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  experience_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS experience_tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  experience_id INT UNSIGNED NOT NULL,
  tag VARCHAR(80) NOT NULL,
  FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
  UNIQUE KEY uk_exp_tag (experience_id, tag)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Projets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  image VARCHAR(500) DEFAULT '',
  link VARCHAR(500) DEFAULT '#',
  github VARCHAR(500) DEFAULT '#',
  type ENUM('Web', 'Mobile', 'Design') NOT NULL DEFAULT 'Web',
  sort_order INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  url VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  tag VARCHAR(80) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY uk_project_tag (project_id, tag)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Compétences (blocs → catégories → items)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_blocks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Server',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skill_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (block_id) REFERENCES skill_blocks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skill_category_icons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  icon_url VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skill_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Soft skills, formation, distinctions, témoignages, communautés
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS soft_skills (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  impact TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS soft_skill_contexts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  soft_skill_id INT UNSIGNED NOT NULL,
  context VARCHAR(120) NOT NULL,
  FOREIGN KEY (soft_skill_id) REFERENCES soft_skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS education (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  degree VARCHAR(255) NOT NULL,
  field VARCHAR(255) NOT NULL,
  school VARCHAR(255) NOT NULL,
  year VARCHAR(20) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS awards (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  year VARCHAR(20) NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) NOT NULL DEFAULT '',
  company VARCHAR(120) NOT NULL DEFAULT '',
  image VARCHAR(500),
  email VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_approved TINYINT(1) NOT NULL DEFAULT 1,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  endpoint TEXT NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  content_encoding VARCHAR(20) NOT NULL DEFAULT 'aesgcm',
  user_agent VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_endpoint (endpoint(500)),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comment_audit_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  comment_id INT UNSIGNED NOT NULL,
  post_id INT UNSIGNED NOT NULL,
  post_title VARCHAR(255) NOT NULL DEFAULT '',
  post_slug VARCHAR(255) NOT NULL DEFAULT '',
  author_name VARCHAR(120) NOT NULL,
  author_email VARCHAR(255) NULL,
  author_role VARCHAR(20) NOT NULL DEFAULT 'visitor',
  content TEXT NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  visitor_hash VARCHAR(64) NULL,
  referrer VARCHAR(500) NULL,
  geo_country VARCHAR(100) NULL,
  geo_region VARCHAR(100) NULL,
  geo_city VARCHAR(100) NULL,
  is_hidden TINYINT(1) NOT NULL DEFAULT 0,
  comment_created_at DATETIME NULL,
  deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recommendations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NULL,
  role VARCHAR(120) NULL,
  company VARCHAR(120) NULL,
  body TEXT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_hidden TINYINT(1) NOT NULL DEFAULT 0,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  referrer VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visible (is_active, is_hidden, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS communities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  logo VARCHAR(500) NOT NULL DEFAULT '👥',
  role VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  website_url VARCHAR(500) NULL,
  linkedin_url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS managed_pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  logo VARCHAR(500) NOT NULL,
  link VARCHAR(500) NOT NULL DEFAULT '#',
  followers VARCHAR(50),
  category VARCHAR(120) NOT NULL,
  border_color VARCHAR(120),
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_type ENUM('contact', 'collaboration') NOT NULL DEFAULT 'contact',
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NULL,
  company VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  message TEXT NOT NULL,
  collaboration_brief TEXT NULL,
  has_documents TINYINT(1) NOT NULL DEFAULT 0,
  documents_details TEXT NULL,
  meeting_platform VARCHAR(80) NULL,
  meeting_slots TEXT NULL,
  meeting_notes TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  visitor_hash VARCHAR(64) NULL,
  referrer VARCHAR(500) NULL,
  geo_country VARCHAR(100) NULL,
  geo_region VARCHAR(100) NULL,
  geo_city VARCHAR(100) NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_message_type (message_type, is_read)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_message_attachments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id INT UNSIGNED NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
  INDEX idx_message (message_id)
) ENGINE=InnoDB;

-- Blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  category VARCHAR(48) NOT NULL DEFAULT 'tech',
  content LONGTEXT NOT NULL,
  cover_image VARCHAR(500) DEFAULT '',
  reading_time INT UNSIGNED DEFAULT 5,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  views_count INT UNSIGNED NOT NULL DEFAULT 0,
  likes_count INT UNSIGNED NOT NULL DEFAULT 0,
  shares_count INT UNSIGNED NOT NULL DEFAULT 0,
  comments_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_published (is_published, published_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_category_labels (
  slug VARCHAR(48) PRIMARY KEY,
  label VARCHAR(80) NOT NULL,
  emoji VARCHAR(12) NOT NULL DEFAULT '📝',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED NULL COMMENT 'Réponse à un commentaire',
  author_name VARCHAR(120) NOT NULL,
  author_email VARCHAR(255) DEFAULT NULL,
  author_role ENUM('visitor', 'admin') NOT NULL DEFAULT 'visitor',
  content TEXT NOT NULL,
  is_approved TINYINT(1) NOT NULL DEFAULT 1,
  is_hidden TINYINT(1) NOT NULL DEFAULT 0,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  visitor_hash VARCHAR(64) NULL,
  referrer VARCHAR(500) NULL,
  geo_country VARCHAR(100) NULL,
  geo_region VARCHAR(100) NULL,
  geo_city VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
  INDEX idx_post_visible (post_id, is_approved, is_hidden),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_likes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id INT UNSIGNED NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  UNIQUE KEY uk_post_visitor (post_id, visitor_hash)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_shares (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id INT UNSIGNED NOT NULL,
  platform VARCHAR(40) NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  caption VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  logo VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
