-- Safe Migration: Add only missing 5W1H fields to news table
-- Date: 2026-02-16

USE stpaulus_cms_db;

-- Add when_date if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'when_date'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN when_date DATE NULL COMMENT "Tanggal kejadian" AFTER content', 
  'SELECT "Column when_date already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add when_time if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'when_time'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN when_time VARCHAR(50) NULL COMMENT "Waktu kejadian" AFTER when_date', 
  'SELECT "Column when_time already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add where_location if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'where_location'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN where_location TEXT NULL COMMENT "Lokasi kejadian" AFTER when_time', 
  'SELECT "Column where_location already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add who_participants if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'who_participants'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN who_participants TEXT NULL COMMENT "Siapa yang terlibat" AFTER where_location', 
  'SELECT "Column who_participants already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add why_purpose if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'why_purpose'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN why_purpose TEXT NULL COMMENT "Tujuan/alasan kegiatan" AFTER who_participants', 
  'SELECT "Column why_purpose already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add how_process if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'how_process'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN how_process TEXT NULL COMMENT "Bagaimana prosesnya" AFTER why_purpose', 
  'SELECT "Column how_process already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add gallery_images if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'gallery_images'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN gallery_images JSON NULL COMMENT "Array path gambar gallery" AFTER image', 
  'SELECT "Column gallery_images already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add ai_generated if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'ai_generated'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE COMMENT "Apakah content di-generate AI" AFTER content', 
  'SELECT "Column ai_generated already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add ai_prompt if not exists
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'ai_prompt'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE news ADD COLUMN ai_prompt TEXT NULL COMMENT "Prompt yang digunakan untuk AI" AFTER ai_generated', 
  'SELECT "Column ai_prompt already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes if they don't exist
SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND INDEX_NAME = 'idx_when_date'
);

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE news ADD INDEX idx_when_date (when_date)', 
  'SELECT "Index idx_when_date already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND INDEX_NAME = 'idx_where_location'
);

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE news ADD INDEX idx_where_location (where_location (100))', 
  'SELECT "Index idx_where_location already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
  AND TABLE_NAME = 'news' 
  AND INDEX_NAME = 'idx_ai_generated'
);

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE news ADD INDEX idx_ai_generated (ai_generated)', 
  'SELECT "Index idx_ai_generated already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify all columns
SELECT 'Migration completed! Checking columns...' as status;

SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'stpaulus_cms_db' 
AND TABLE_NAME = 'news'
AND COLUMN_NAME IN ('when_date', 'when_time', 'where_location', 'who_participants', 'why_purpose', 'how_process', 'gallery_images', 'ai_generated', 'ai_prompt')
ORDER BY ORDINAL_POSITION;
