-- Aperçu brouillon + textes de partage Facebook / X
ALTER TABLE blog_posts
  ADD COLUMN preview_token VARCHAR(64) NULL,
  ADD COLUMN share_facebook TEXT NULL,
  ADD COLUMN share_x TEXT NULL;

CREATE UNIQUE INDEX idx_blog_preview_token ON blog_posts (preview_token);
