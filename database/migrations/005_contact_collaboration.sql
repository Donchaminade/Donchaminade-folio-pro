-- Messages contact + demandes de collaboration

ALTER TABLE contact_messages
  ADD COLUMN message_type ENUM('contact', 'collaboration') NOT NULL DEFAULT 'contact' AFTER id;

ALTER TABLE contact_messages
  ADD COLUMN subject VARCHAR(255) NULL AFTER email;

ALTER TABLE contact_messages
  ADD COLUMN company VARCHAR(255) NULL AFTER subject;

ALTER TABLE contact_messages
  ADD COLUMN phone VARCHAR(50) NULL AFTER company;

ALTER TABLE contact_messages
  ADD COLUMN collaboration_brief TEXT NULL AFTER message;

ALTER TABLE contact_messages
  ADD COLUMN has_documents TINYINT(1) NOT NULL DEFAULT 0 AFTER collaboration_brief;

ALTER TABLE contact_messages
  ADD COLUMN documents_details TEXT NULL AFTER has_documents;

ALTER TABLE contact_messages
  ADD COLUMN meeting_platform VARCHAR(80) NULL AFTER documents_details;

ALTER TABLE contact_messages
  ADD COLUMN meeting_slots TEXT NULL AFTER meeting_platform;

ALTER TABLE contact_messages
  ADD COLUMN meeting_notes TEXT NULL AFTER meeting_slots;

ALTER TABLE contact_messages
  ADD COLUMN ip_address VARCHAR(45) NULL AFTER meeting_notes;

ALTER TABLE contact_messages
  ADD COLUMN user_agent VARCHAR(512) NULL AFTER ip_address;

ALTER TABLE contact_messages
  ADD COLUMN visitor_hash VARCHAR(64) NULL AFTER user_agent;

ALTER TABLE contact_messages
  ADD COLUMN referrer VARCHAR(500) NULL AFTER visitor_hash;

ALTER TABLE contact_messages
  ADD COLUMN geo_country VARCHAR(100) NULL AFTER referrer;

ALTER TABLE contact_messages
  ADD COLUMN geo_region VARCHAR(100) NULL AFTER geo_country;

ALTER TABLE contact_messages
  ADD COLUMN geo_city VARCHAR(100) NULL AFTER geo_region;

ALTER TABLE contact_messages
  ADD INDEX idx_message_type (message_type, is_read);
