-- Migration 035: Add kontributor_berita role and author_id to news
-- Safe to re-run: uses IF NOT EXISTS and INSERT IGNORE

-- 1. Insert new role (INSERT IGNORE: safe if already exists)
INSERT IGNORE INTO roles (name, display_name, description) 
VALUES ('kontributor_berita', 'Kontributor Berita', 'Bisa membuat draft berita tapi tidak bisa mempublikasikannya langsung');

-- 2. Add author_id to news table to link news to specific users (contributors)
-- Safe: column is only added if it does not already exist (handled by the migration runner)
ALTER TABLE news ADD COLUMN IF NOT EXISTS author_id INT NULL AFTER author;

-- 3. Add FK only if it doesn't already exist (MySQL 8.0+)
SET @fk_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND CONSTRAINT_NAME = 'fk_news_author'
  AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @sql = IF(@fk_exists = 0,
  'ALTER TABLE news ADD CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
