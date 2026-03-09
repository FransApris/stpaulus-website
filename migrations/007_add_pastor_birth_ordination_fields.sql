-- Migration: Add birth and ordination fields to pastors table
-- Date: 2026-02-12
-- Description: Menambahkan field tempat lahir, tanggal lahir, dan tanggal imamat

ALTER TABLE `pastors` 
ADD COLUMN `birth_place` VARCHAR(255) NULL AFTER `phone`,
ADD COLUMN `birth_date` DATE NULL AFTER `birth_place`,
ADD COLUMN `ordination_date` DATE NULL AFTER `birth_date`;

-- Add index for searching by dates
ALTER TABLE `pastors`
ADD INDEX `idx_birth_date` (`birth_date`),
ADD INDEX `idx_ordination_date` (`ordination_date`);
