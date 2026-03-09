-- Migration: Fix Lingkungan Unique Constraint
-- Purpose: Change unique constraint from `no` only to `no + wilayah`
-- Issue: Duplicate entry error when creating Lingkungan 1 in different wilayah
-- Date: 2026-03-05

-- Drop the old unique index on `no` column only
ALTER TABLE `lingkungan` DROP INDEX `idx_no`;

-- Create composite unique index for no + wilayah_id
-- This allows same lingkungan numbers across different wilayah
-- Note: wilayah_id CAN be NULL, so we need to handle both cases
ALTER TABLE `lingkungan` ADD UNIQUE INDEX `idx_no_wilayah` (`no`, `wilayah_id`);

-- For records with wilayah_text instead of wilayah_id, 
-- the unique constraint on (no, wilayah_id) with wilayah_id=NULL will allow only one per number
-- This is acceptable since wilayah_text is a fallback and should ideally migrate to wilayah_id

-- Add non-unique index for queries filtering by wilayah_text
ALTER TABLE `lingkungan` ADD INDEX `idx_wilayah_text` (`wilayah_text`);
