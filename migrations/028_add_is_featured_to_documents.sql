-- Migration 028: Add is_featured column to documents table
-- Run this on your Railway MySQL database if this column does not exist yet

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Optional: Mark a few recent documents as featured for the homepage
-- UPDATE documents SET is_featured = 1 ORDER BY created_at DESC LIMIT 6;
