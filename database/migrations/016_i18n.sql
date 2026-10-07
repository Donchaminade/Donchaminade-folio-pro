-- Champs anglais optionnels. Un ALTER par colonne : le runner ignore « Duplicate column ».

ALTER TABLE site_profile ADD COLUMN hero_title_en VARCHAR(255) NULL;
ALTER TABLE site_profile ADD COLUMN hero_subtitle_en VARCHAR(255) NULL;
ALTER TABLE site_profile ADD COLUMN bio_en TEXT NULL;
ALTER TABLE site_profile ADD COLUMN availability_text_en VARCHAR(255) NULL;
ALTER TABLE site_profile ADD COLUMN experience_badge_label_en VARCHAR(120) NULL;

ALTER TABLE stats ADD COLUMN label_en VARCHAR(160) NULL;
ALTER TABLE stats ADD COLUMN suffix_en VARCHAR(40) NULL;

ALTER TABLE experiences ADD COLUMN role_en VARCHAR(255) NULL;
ALTER TABLE experiences ADD COLUMN period_en VARCHAR(120) NULL;
ALTER TABLE experiences ADD COLUMN tags_en VARCHAR(500) NULL;
ALTER TABLE experience_descriptions ADD COLUMN content_en TEXT NULL;

ALTER TABLE projects ADD COLUMN title_en VARCHAR(255) NULL;
ALTER TABLE projects ADD COLUMN description_en TEXT NULL;
ALTER TABLE projects ADD COLUMN detailed_description_en TEXT NULL;
ALTER TABLE projects ADD COLUMN tags_en VARCHAR(500) NULL;

ALTER TABLE skill_blocks ADD COLUMN title_en VARCHAR(160) NULL;
ALTER TABLE skill_categories ADD COLUMN name_en VARCHAR(160) NULL;
ALTER TABLE skill_items ADD COLUMN name_en VARCHAR(160) NULL;

ALTER TABLE testimonials ADD COLUMN quote_en TEXT NULL;
ALTER TABLE testimonials ADD COLUMN role_en VARCHAR(160) NULL;

ALTER TABLE recommendations ADD COLUMN body_en TEXT NULL;
ALTER TABLE recommendations ADD COLUMN role_en VARCHAR(160) NULL;

ALTER TABLE communities ADD COLUMN role_en VARCHAR(160) NULL;
ALTER TABLE communities ADD COLUMN description_en TEXT NULL;

ALTER TABLE awards ADD COLUMN title_en VARCHAR(255) NULL;
ALTER TABLE awards ADD COLUMN description_en TEXT NULL;

ALTER TABLE education ADD COLUMN degree_en VARCHAR(255) NULL;
ALTER TABLE education ADD COLUMN field_en VARCHAR(255) NULL;

ALTER TABLE soft_skills ADD COLUMN title_en VARCHAR(160) NULL;
ALTER TABLE soft_skills ADD COLUMN impact_en TEXT NULL;
ALTER TABLE soft_skill_contexts ADD COLUMN context_en VARCHAR(255) NULL;

ALTER TABLE managed_pages ADD COLUMN category_en VARCHAR(120) NULL;

ALTER TABLE blog_posts ADD COLUMN title_en VARCHAR(255) NULL;
ALTER TABLE blog_posts ADD COLUMN excerpt_en TEXT NULL;
ALTER TABLE blog_posts ADD COLUMN content_en MEDIUMTEXT NULL;

ALTER TABLE blog_category_labels ADD COLUMN label_en VARCHAR(160) NULL;
