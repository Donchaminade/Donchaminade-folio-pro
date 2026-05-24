-- Fil de discussion : réponses imbriquées aux commentaires blog
-- Exécuter si blog_comments existe déjà sans parent_id

ALTER TABLE blog_comments
  ADD COLUMN parent_id INT UNSIGNED NULL COMMENT 'Commentaire parent' AFTER post_id;

ALTER TABLE blog_comments
  ADD COLUMN author_role ENUM('visitor', 'admin') NOT NULL DEFAULT 'visitor' AFTER author_email;

ALTER TABLE blog_comments
  ADD INDEX idx_blog_comments_parent (parent_id);

ALTER TABLE blog_comments
  ADD CONSTRAINT fk_blog_comment_parent
  FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE;
