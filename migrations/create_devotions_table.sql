-- Create devotions table
CREATE TABLE IF NOT EXISTS devotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT 'Judul devosi, contoh: Jalan Salib Jumat Sore',
  type ENUM('jalan_salib', 'doa_novena', 'doa_rosario', 'adorasi') NOT NULL COMMENT 'Jenis devosi',
  day_of_week ENUM('Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL COMMENT 'Hari pelaksanaan',
  time TIME NOT NULL COMMENT 'Waktu pelaksanaan',
  location VARCHAR(255) DEFAULT 'Gereja Utama' COMMENT 'Lokasi pelaksanaan',
  description TEXT COMMENT 'Deskripsi tambahan',
  is_active TINYINT(1) DEFAULT 1 COMMENT '1 = aktif, 0 = nonaktif',
  display_order INT DEFAULT 0 COMMENT 'Urutan tampilan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_day_of_week (day_of_week),
  INDEX idx_type (type),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Jadwal devosi rutin paroki';

-- Insert sample devotions data
INSERT INTO devotions (title, type, day_of_week, time, location, description, is_active, display_order) VALUES
('Jalan Salib', 'jalan_salib', 'Jumat', '15:00:00', 'Gereja Utama', 'Jalan Salib setiap hari Jumat', 1, 1),
('Doa Novena', 'doa_novena', 'Rabu', '18:00:00', 'Gereja Utama', 'Novena kepada Bunda Maria', 1, 2),
('Doa Rosario', 'doa_rosario', 'Senin', '17:30:00', 'Gereja Utama', 'Doa Rosario bersama', 1, 3),
('Doa Rosario', 'doa_rosario', 'Kamis', '17:30:00', 'Gereja Utama', 'Doa Rosario bersama', 1, 4),
('Adorasi Sakramen Mahakudus', 'adorasi', 'Kamis', '19:00:00', 'Gereja Utama', 'Adorasi dan Doa Malam', 1, 5);

-- Create devotion_types reference table (optional, for future expansion)
CREATE TABLE IF NOT EXISTS devotion_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🙏',
  color VARCHAR(20) DEFAULT '#8B5CF6',
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert devotion types
INSERT INTO devotion_types (slug, name, description, icon, color, display_order) VALUES
('jalan_salib', 'Jalan Salib', 'Jalan Salib 14 Stasi', '✝️', '#8B4513', 1),
('doa_novena', 'Doa Novena', 'Novena kepada Bunda Maria dan Para Kudus', '📿', '#4169E1', 2),
('doa_rosario', 'Doa Rosario', 'Doa Rosario Kudus', '📿', '#DC143C', 3),
('adorasi', 'Adorasi (Sakramen Mahakudus)', 'Adorasi dan Doa di hadapan Sakramen Mahakudus', '🕯️', '#FFD700', 4);
