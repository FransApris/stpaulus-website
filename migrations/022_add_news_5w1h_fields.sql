-- Migration: Add 5W1H fields and gallery to news table
-- Date: 2026-02-16
-- Purpose: Enable news management with structured 5W1H data and AI generation support

USE stpaulus_cms_db;

-- Add 5W1H fields to news table (same structure as kronik_entries)
ALTER TABLE news
ADD COLUMN when_date DATE NULL COMMENT 'Tanggal kejadian' AFTER content,
ADD COLUMN when_time VARCHAR(50) NULL COMMENT 'Waktu kejadian (format bebas)' AFTER when_date,
ADD COLUMN where_location TEXT NULL COMMENT 'Lokasi kejadian' AFTER when_time,
ADD COLUMN who_participants TEXT NULL COMMENT 'Siapa yang terlibat' AFTER where_location,
ADD COLUMN why_purpose TEXT NULL COMMENT 'Tujuan/alasan kegiatan' AFTER who_participants,
ADD COLUMN how_process TEXT NULL COMMENT 'Bagaimana prosesnya' AFTER why_purpose;

-- Add gallery images support (JSON array)
ALTER TABLE news
ADD COLUMN gallery_images JSON NULL COMMENT 'Array path gambar gallery' AFTER image;

-- Add AI generation tracking
ALTER TABLE news
ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE COMMENT 'Apakah content di-generate AI' AFTER content,
ADD COLUMN ai_prompt TEXT NULL COMMENT 'Prompt yang digunakan untuk AI' AFTER ai_generated;

-- Add indexes for better query performance
ALTER TABLE news
ADD INDEX idx_when_date (when_date),
ADD INDEX idx_where_location (where_location (100)),
ADD INDEX idx_ai_generated (ai_generated);

-- Verify columns were added successfully
SHOW COLUMNS FROM news LIKE '%when%';

SHOW COLUMNS FROM news LIKE '%where%';

SHOW COLUMNS FROM news LIKE '%who%';

SHOW COLUMNS FROM news LIKE '%why%';

SHOW COLUMNS FROM news LIKE '%how%';

SHOW COLUMNS FROM news LIKE 'gallery_images';

SHOW COLUMNS FROM news LIKE 'ai_generated';

SHOW COLUMNS FROM news LIKE 'ai_prompt';

SELECT 'Migration 022 completed successfully! News table now supports 5W1H and AI generation.' as status;