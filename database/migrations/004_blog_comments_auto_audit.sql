-- Commentaires publiés directement + audit visiteur + masquage

ALTER TABLE blog_comments
  MODIFY COLUMN is_approved TINYINT(1) NOT NULL DEFAULT 1;

UPDATE blog_comments SET is_approved = 1 WHERE is_approved = 0;

ALTER TABLE blog_comments
  ADD COLUMN is_hidden TINYINT(1) NOT NULL DEFAULT 0 AFTER is_approved;

ALTER TABLE blog_comments
  ADD COLUMN ip_address VARCHAR(45) NULL AFTER content;

ALTER TABLE blog_comments
  ADD COLUMN user_agent VARCHAR(512) NULL AFTER ip_address;

ALTER TABLE blog_comments
  ADD COLUMN visitor_hash VARCHAR(64) NULL AFTER user_agent;

ALTER TABLE blog_comments
  ADD COLUMN referrer VARCHAR(500) NULL AFTER visitor_hash;

ALTER TABLE blog_comments
  ADD COLUMN geo_country VARCHAR(100) NULL AFTER referrer;

ALTER TABLE blog_comments
  ADD COLUMN geo_region VARCHAR(100) NULL AFTER geo_country;

ALTER TABLE blog_comments
  ADD COLUMN geo_city VARCHAR(100) NULL AFTER geo_region;

ALTER TABLE blog_comments
  ADD INDEX idx_hidden (post_id, is_hidden);
