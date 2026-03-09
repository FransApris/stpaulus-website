-- Migration: Add no_hp_pengurus field to lingkungan table
-- Purpose: Allow managing separate contact number for lingkungan staff/pengurus
-- Date: 2026-03-05

-- Add no_hp_pengurus column to lingkungan table
ALTER TABLE `lingkungan`
ADD COLUMN `no_hp_pengurus` VARCHAR(20) NULL COMMENT 'Contact phone for lingkungan staff/pengurus' AFTER `telp`;