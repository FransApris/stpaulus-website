-- Migration: Add author_origin column to news table
-- This allows tracking the origin (Lingkungan/Wilayah/Seksi) of the contributor directly

ALTER TABLE news ADD COLUMN IF NOT EXISTS author_origin VARCHAR(255) NULL;
