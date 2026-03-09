-- Migration: Add news-kronik sync fields
-- Purpose: Enable automatic synchronization between news and kronik entries

-- Add tracking column to kronik_entries to link with news
ALTER TABLE kronik_entries
ADD COLUMN source_news_id INT NULL AFTER author_id,
ADD COLUMN is_auto_synced BOOLEAN DEFAULT FALSE AFTER source_news_id,
ADD COLUMN sync_updated_at TIMESTAMP NULL AFTER is_auto_synced,
ADD INDEX idx_kronik_source_news (source_news_id);

-- Add foreign key constraint (optional - allows null for manual entries)
-- ALTER TABLE kronik_entries
-- ADD CONSTRAINT fk_kronik_source_news 
-- FOREIGN KEY (source_news_id) REFERENCES news(id) ON DELETE SET NULL;

-- Add mapping field to article_categories to indicate which should sync to kronik
ALTER TABLE article_categories
ADD COLUMN sync_to_kronik BOOLEAN DEFAULT FALSE AFTER description,
ADD COLUMN kronik_category_id INT NULL AFTER sync_to_kronik,
ADD INDEX idx_sync_to_kronik (sync_to_kronik);

-- Update specific category to enable sync (example: "Peristiwa Paroki")
-- This will be set via admin panel or manually
-- UPDATE article_categories SET sync_to_kronik = TRUE, kronik_category_id = 1 
-- WHERE name = 'Peristiwa Paroki' OR slug = 'peristiwa-paroki';

-- Comments:
-- 1. source_news_id: Links kronik entry back to originating news article
-- 2. is_auto_synced: Flag to identify auto-generated entries vs manual entries
-- 3. sync_updated_at: Track when last sync occurred
-- 4. sync_to_kronik: Boolean flag on article_categories to enable auto-sync
-- 5. kronik_category_id: Maps article category to kronik category
