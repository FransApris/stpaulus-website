-- Migration: Create pastors table
-- Purpose: Store information about pastors who have served in the parish
-- Date: 2026-01-26

CREATE TABLE IF NOT EXISTS `pastors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Short name (e.g. Romo Cun)',
  `full_name` VARCHAR(255) NULL COMMENT 'Full name with titles',
  `title` VARCHAR(100) NULL COMMENT 'Title/Position (e.g. Kepala Paroki)',
  `start_year` INT NOT NULL COMMENT 'Year started serving',
  `end_year` INT NULL COMMENT 'Year ended serving (NULL if still active)',
  `status` ENUM('active', 'alumni') NOT NULL DEFAULT 'alumni' COMMENT 'Current status',
  `photo_url` VARCHAR(500) NULL COMMENT 'URL/path to pastor photo',
  `bio` TEXT NULL COMMENT 'Biography/description',
  `quote` TEXT NULL COMMENT 'Favorite quote or motto',
  `achievements` TEXT NULL COMMENT 'Notable achievements during service',
  `email` VARCHAR(100) NULL COMMENT 'Email address',
  `phone` VARCHAR(20) NULL COMMENT 'Phone number',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Order for display (lower = first)',
  `is_visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=visible, 0=hidden',
  `created_by` INT NULL COMMENT 'User ID who created this record',
  `updated_by` INT NULL COMMENT 'User ID who last updated this record',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_status` (`status`),
  INDEX `idx_visible` (`is_visible`),
  INDEX `idx_display_order` (`display_order`),
  INDEX `idx_years` (`start_year`, `end_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pastors who have served in the parish';

-- Insert sample data (historical pastors from documentation)
INSERT INTO `pastors` (`name`, `full_name`, `title`, `start_year`, `end_year`, `status`, `display_order`, `bio`) VALUES
('Romo Sony', 'RM. Sony Kristanto, Pr.', 'Kepala Paroki Pertama', 2008, 2014, 'alumni', 1, 'Romo kepala paroki pertama yang memimpin Paroki St. Paulus sejak resmi berdiri pada 1 Mei 2008 hingga tahun 2014.'),
('Romo Cun', 'RM. Tri Kuncoro Yekti, Pr.', 'Kepala Paroki', 2014, NULL, 'active', 2, 'Romo Cun menjabat sebagai Kepala Paroki sejak Agustus 2014. Fokus pastoral beliau mencakup integrasi komunitas warga, membangun sense of belonging, dan melanjutkan pembangunan organisasi paroki.');

SELECT 'Pastors table created and sample data inserted successfully!' AS message;
