-- Migration: Create Regions (Wilayah) and Communities (Lingkungan) Tables
-- Purpose: Manage territorial structure of the parish
-- Date: 2026-01-26

-- ============================================
-- Table: regions (Wilayah)
-- ============================================
CREATE TABLE IF NOT EXISTS `regions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Nama wilayah (e.g., Juanda, Waru)',
  `description` TEXT NULL COMMENT 'Deskripsi wilayah',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Urutan tampilan',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Status aktif',
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_display_order` (`display_order`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel Wilayah Paroki';

-- ============================================
-- Table: communities (Lingkungan)
-- ============================================
CREATE TABLE IF NOT EXISTS `communities` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `region_id` INT UNSIGNED NOT NULL COMMENT 'ID Wilayah',
  `number` INT NOT NULL COMMENT 'Nomor lingkungan',
  `name` VARCHAR(100) NOT NULL COMMENT 'Nama lingkungan (e.g., St. Petrus)',
  `full_name` VARCHAR(255) NULL COMMENT 'Nama lengkap lingkungan',
  `leader_name` VARCHAR(100) NULL COMMENT 'Nama ketua lingkungan',
  `leader_phone` VARCHAR(20) NULL COMMENT 'No. telepon ketua',
  `leader_email` VARCHAR(100) NULL COMMENT 'Email ketua',
  `total_families` INT NOT NULL DEFAULT 0 COMMENT 'Jumlah kepala keluarga',
  `total_souls` INT NOT NULL DEFAULT 0 COMMENT 'Jumlah jiwa',
  `color` VARCHAR(7) NOT NULL DEFAULT '#3B82F6' COMMENT 'Warna identitas (hex)',
  `address` TEXT NULL COMMENT 'Alamat sekretariat/pertemuan',
  `meeting_schedule` VARCHAR(255) NULL COMMENT 'Jadwal pertemuan rutin',
  `description` TEXT NULL COMMENT 'Deskripsi lingkungan',
  `map_coordinates` VARCHAR(50) NULL COMMENT 'Koordinat GPS (lat,lng)',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Urutan tampilan',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Status aktif',
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE CASCADE,
  KEY `idx_region_id` (`region_id`),
  KEY `idx_number` (`number`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel Lingkungan Paroki';

-- ============================================
-- Insert Sample Regions (Wilayah)
-- ============================================
INSERT INTO `regions` (`name`, `description`, `display_order`, `is_active`) VALUES
('Juanda & Waru', 'Wilayah sekitar Bandara Juanda dan Kecamatan Waru', 1, 1),
('Sidoarjo Kota', 'Wilayah pusat kota Sidoarjo', 2, 1),
('Gedangan & Buduran', 'Wilayah Gedangan dan Buduran', 3, 1),
('Candi & Tanggulangin', 'Wilayah Candi dan Tanggulangin', 4, 1),
('Sukodono & Krian', 'Wilayah Sukodono dan Krian', 5, 1),
('Taman & Sepanjang', 'Wilayah Taman dan Sepanjang', 6, 1),
('Porong', 'Wilayah Porong', 7, 1);

-- ============================================
-- Insert Sample Communities (Lingkungan)
-- ============================================
-- Region 1: Juanda & Waru
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(1, 1, 'St. Petrus', 'Lingkungan St. Petrus', 'Bapak Andreas Santoso', '081234567890', 75, 225, '#3B82F6', 1, 1),
(1, 2, 'St. Paulus', 'Lingkungan St. Paulus', 'Bapak Yohanes Wijaya', '081234567891', 82, 246, '#10B981', 2, 1);

-- Region 2: Sidoarjo Kota
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(2, 3, 'St. Yohanes', 'Lingkungan St. Yohanes', 'Ibu Maria Magdalena', '081234567892', 68, 204, '#8B5CF6', 3, 1);

-- Region 3: Gedangan & Buduran
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(3, 4, 'St. Matius', 'Lingkungan St. Matius', 'Bapak Thomas Aquinas', '081234567893', 71, 213, '#F59E0B', 4, 1),
(3, 5, 'St. Markus', 'Lingkungan St. Markus', 'Bapak Simon Petrus', '081234567894', 65, 195, '#EF4444', 5, 1);

-- Region 4: Candi & Tanggulangin
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(4, 6, 'St. Lukas', 'Lingkungan St. Lukas', 'Ibu Anna Maria', '081234567895', 73, 219, '#06B6D4', 6, 1),
(4, 8, 'St. Yosep', 'Lingkungan St. Yosep', 'Bapak Bartolomeus', '081234567897', 69, 207, '#14B8A6', 8, 1);

-- Region 7: Porong
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(7, 7, 'St. Maria', 'Lingkungan St. Maria', 'Bapak Stefanus', '081234567896', 58, 174, '#EC4899', 7, 1);

-- Region 5: Sukodono & Krian
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(5, 9, 'St. Fransiskus', 'Lingkungan St. Fransiskus', 'Ibu Elisabet', '081234567898', 77, 231, '#F97316', 9, 1),
(5, 10, 'St. Antonius', 'Lingkungan St. Antonius', 'Bapak Filipus', '081234567899', 64, 192, '#6366F1', 10, 1);

-- Region 6: Taman & Sepanjang
INSERT INTO `communities` (`region_id`, `number`, `name`, `full_name`, `leader_name`, `leader_phone`, `total_families`, `total_souls`, `color`, `display_order`, `is_active`) VALUES
(6, 11, 'St. Theresia', 'Lingkungan St. Theresia', 'Ibu Martha', '081234567800', 72, 216, '#A855F7', 11, 1),
(6, 12, 'St. Mikael', 'Lingkungan St. Mikael', 'Bapak Gabriel', '081234567801', 66, 198, '#84CC16', 12, 1);

-- ============================================
-- Create View for Statistics
-- ============================================
CREATE OR REPLACE VIEW `v_territorial_stats` AS
SELECT 
    COUNT(DISTINCT r.id) as total_regions,
    COUNT(DISTINCT c.id) as total_communities,
    SUM(c.total_families) as total_families,
    SUM(c.total_souls) as total_souls
FROM regions r
LEFT JOIN communities c ON r.id = c.region_id AND c.is_active = 1
WHERE r.is_active = 1;

-- ============================================
-- Create View for Region Summary
-- ============================================
CREATE OR REPLACE VIEW `v_region_summary` AS
SELECT 
    r.id,
    r.name,
    r.description,
    r.display_order,
    r.is_active,
    COUNT(c.id) as total_communities,
    COALESCE(SUM(c.total_families), 0) as total_families,
    COALESCE(SUM(c.total_souls), 0) as total_souls
FROM regions r
LEFT JOIN communities c ON r.id = c.region_id AND c.is_active = 1
GROUP BY r.id, r.name, r.description, r.display_order, r.is_active
ORDER BY r.display_order ASC;
