-- Modération des témoignages visiteurs
ALTER TABLE testimonials
  ADD COLUMN is_approved TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active,
  ADD COLUMN email VARCHAR(255) NULL AFTER company,
  ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN ip_address VARCHAR(45) NULL,
  ADD COLUMN user_agent VARCHAR(512) NULL;

UPDATE testimonials SET is_approved = 1 WHERE is_approved = 0;
