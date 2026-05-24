-- Communautés / engagements (WTM, GDG, Python Togo…)
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
