-- Simple migration: Add missing columns one by one
USE stpaulus_cms_db;

-- Add columns (skip if already exists from error)
ALTER TABLE news ADD COLUMN when_time VARCHAR(50) NULL COMMENT 'Waktu kejadian';
ALTER TABLE news ADD COLUMN where_location TEXT NULL COMMENT 'Lokasi kejadian';
ALTER TABLE news ADD COLUMN who_participants TEXT NULL COMMENT 'Siapa yang terlibat';
ALTER TABLE news ADD COLUMN why_purpose TEXT NULL COMMENT 'Tujuan/alasan kegiatan';
ALTER TABLE news ADD COLUMN how_process TEXT NULL COMMENT 'Bagaimana prosesnya';
ALTER TABLE news ADD COLUMN gallery_images JSON NULL COMMENT 'Array path gambar gallery';
ALTER TABLE news ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE COMMENT 'Apakah content di-generate AI';
ALTER TABLE news ADD COLUMN ai_prompt TEXT NULL COMMENT 'Prompt yang digunakan untuk AI';

SELECT 'Migration completed!' as status;
