-- Migration: Create Wilayah and Lingkungan Tables
-- Purpose: Manage territorial areas (wilayah) and neighborhoods (lingkungan) for the parish
-- Date: 2026-01-26

-- Table: wilayah (Areas/Regions)
CREATE TABLE IF NOT EXISTS `wilayah` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL COMMENT 'Area name (e.g., Juanda, Waru)',
  `keterangan` TEXT NULL COMMENT 'Area description',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Display order',
  `is_visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Visibility status',
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_display_order` (`display_order`),
  INDEX `idx_is_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Parish territorial areas';

-- Table: lingkungan (Neighborhoods/Communities)
CREATE TABLE IF NOT EXISTS `lingkungan` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no` INT NOT NULL COMMENT 'Lingkungan number',
  `nama` VARCHAR(100) NOT NULL COMMENT 'Lingkungan name (e.g., St. Petrus)',
  `wilayah_id` INT UNSIGNED NULL COMMENT 'Reference to wilayah table',
  `wilayah_text` VARCHAR(200) NULL COMMENT 'Freeform wilayah text (fallback if not using wilayah_id)',
  `ketua` VARCHAR(100) NULL COMMENT 'Chairman name',
  `telp` VARCHAR(20) NULL COMMENT 'Contact phone',
  `email` VARCHAR(100) NULL COMMENT 'Contact email',
  `alamat` TEXT NULL COMMENT 'Address',
  `jumlah_kk` INT NOT NULL DEFAULT 0 COMMENT 'Number of families (Kepala Keluarga)',
  `jumlah_jiwa` INT NOT NULL DEFAULT 0 COMMENT 'Number of souls/people',
  `color` VARCHAR(7) NOT NULL DEFAULT '#3B82F6' COMMENT 'Display color (hex)',
  `keterangan` TEXT NULL COMMENT 'Additional notes',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Display order',
  `is_visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Visibility status',
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_no` (`no`),
  INDEX `idx_wilayah_id` (`wilayah_id`),
  INDEX `idx_display_order` (`display_order`),
  INDEX `idx_is_visible` (`is_visible`),
  FOREIGN KEY (`wilayah_id`) REFERENCES `wilayah`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Parish neighborhoods/communities';

-- Insert sample wilayah data
INSERT INTO `wilayah` (`nama`, `keterangan`, `display_order`, `is_visible`) VALUES
('Juanda & Waru', 'Wilayah Juanda dan Waru', 1, 1),
('Semolowaru & Sukolilo', 'Wilayah Semolowaru dan Sukolilo', 2, 1),
('Sidoarjo Kota', 'Wilayah pusat kota Sidoarjo', 3, 1),
('Gedangan', 'Wilayah Gedangan', 4, 1),
('Buduran', 'Wilayah Buduran', 5, 1),
('Candi', 'Wilayah Candi', 6, 1),
('Porong', 'Wilayah Porong', 7, 1),
('Tanggulangin', 'Wilayah Tanggulangin', 8, 1),
('Sukodono', 'Wilayah Sukodono', 9, 1),
('Krian', 'Wilayah Krian', 10, 1),
('Taman', 'Wilayah Taman', 11, 1),
('Sepanjang', 'Wilayah Sepanjang', 12, 1);

-- Insert sample lingkungan data (migrating from hardcoded data)
INSERT INTO `lingkungan` (`no`, `nama`, `wilayah_id`, `wilayah_text`, `ketua`, `telp`, `jumlah_kk`, `jumlah_jiwa`, `color`, `display_order`, `is_visible`) VALUES
(1, 'St. Petrus', 1, 'Juanda, Waru', 'Bapak Andreas', '081234567890', 75, 225, '#3B82F6', 1, 1),
(2, 'St. Paulus', 2, 'Semolowaru, Sukolilo', 'Bapak Yohanes', '081234567891', 82, 246, '#10B981', 2, 1),
(3, 'St. Yohanes', 3, 'Sidoarjo Kota', 'Ibu Maria', '081234567892', 68, 204, '#8B5CF6', 3, 1),
(4, 'St. Matius', 4, 'Gedangan', 'Bapak Thomas', '081234567893', 71, 213, '#F59E0B', 4, 1),
(5, 'St. Markus', 5, 'Buduran', 'Bapak Simon', '081234567894', 65, 195, '#EF4444', 5, 1),
(6, 'St. Lukas', 6, 'Candi', 'Ibu Anna', '081234567895', 73, 219, '#06B6D4', 6, 1),
(7, 'St. Maria', 7, 'Porong', 'Bapak Stefanus', '081234567896', 58, 174, '#EC4899', 7, 1),
(8, 'St. Yosep', 8, 'Tanggulangin', 'Bapak Bartolomeus', '081234567897', 69, 207, '#14B8A6', 8, 1),
(9, 'St. Fransiskus', 9, 'Sukodono', 'Ibu Elisabet', '081234567898', 77, 231, '#F97316', 9, 1),
(10, 'St. Antonius', 10, 'Krian', 'Bapak Filipus', '081234567899', 64, 192, '#6366F1', 10, 1),
(11, 'St. Theresia', 11, 'Taman', 'Ibu Martha', '081234567800', 72, 216, '#A855F7', 11, 1),
(12, 'St. Mikael', 12, 'Sepanjang', 'Bapak Gabriel', '081234567801', 66, 198, '#84CC16', 12, 1);
