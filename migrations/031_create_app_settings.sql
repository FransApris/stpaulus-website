-- Migrasi: Pembuatan tabel app_settings untuk konfigurasi persisten
-- Menyelesaikan isu maintenance state yang reset saat deployment

CREATE TABLE IF NOT EXISTS app_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inisialisasi nilai awal (jika perlu)
-- Insert default maintenance state empty object {}
INSERT IGNORE INTO app_settings (setting_key, setting_value) 
VALUES ('maintenance_config', '{}');
