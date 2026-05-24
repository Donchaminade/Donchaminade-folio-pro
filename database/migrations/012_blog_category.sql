ALTER TABLE blog_posts
  ADD COLUMN category VARCHAR(32) NOT NULL DEFAULT 'tech' AFTER excerpt;

CREATE INDEX idx_blog_posts_category ON blog_posts (category, is_published, published_at);
