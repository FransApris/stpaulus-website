-- Migration: Add position_type to pastors table
-- Purpose: Distinguish between "Kepala Paroki" and "Rekan"
-- Date: 2026-01-26

ALTER TABLE `pastors` 
ADD COLUMN `position_type` ENUM('kepala_paroki', 'rekan') NOT NULL DEFAULT 'kepala_paroki' COMMENT 'Jabatan: Kepala Paroki atau Rekan'
AFTER `title`;

-- Update existing data
UPDATE `pastors` SET `position_type` = 'kepala_paroki' WHERE `title` LIKE '%Kepala Paroki%';
UPDATE `pastors` SET `position_type` = 'rekan' WHERE `title` NOT LIKE '%Kepala Paroki%' AND `id` != 1 AND `id` != 2;

-- Add index for filtering
ALTER TABLE `pastors` ADD INDEX `idx_position_type` (`position_type`);

SELECT 'Position type column added successfully!' AS message;
