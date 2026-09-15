-- Journal d’envoi des emails admin (idempotence par événement + entité)
CREATE TABLE IF NOT EXISTS admin_email_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(64) NOT NULL,
  entity_key VARCHAR(128) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL DEFAULT '',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_event_entity (event_type, entity_key)
) ENGINE=InnoDB;
