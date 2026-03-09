-- Migration: Add thumbnail/featured image support for News and Articles
-- Date: 2026-01-19
-- Description: Add image/thumbnail columns that can be managed from admin panel

-- Add image column to news table
ALTER TABLE news 
ADD COLUMN image VARCHAR(500) DEFAULT NULL COMMENT 'Custom thumbnail/featured image URL' AFTER content;

-- Add image column to articles table  
ALTER TABLE articles
ADD COLUMN image VARCHAR(500) DEFAULT NULL COMMENT 'Custom thumbnail/featured image URL' AFTER content;

-- Add indexes for better query performance
CREATE INDEX idx_news_image ON news(image);
CREATE INDEX idx_articles_image ON articles(image);
