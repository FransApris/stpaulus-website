-- Migration: Add Social Features to Articles
-- Date: 2026-01-19
-- Description: Add likes_count, shares_count, views_count and create article_interactions table

-- Step 1: Add columns to articles table
ALTER TABLE articles 
ADD COLUMN likes_count INT DEFAULT 0 NOT NULL AFTER updated_at,
ADD COLUMN shares_count INT DEFAULT 0 NOT NULL AFTER likes_count,
ADD COLUMN views_count INT DEFAULT 0 NOT NULL AFTER shares_count;

-- Step 2: Create article_interactions table to track individual user interactions
CREATE TABLE IF NOT EXISTS article_interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  interaction_type ENUM('like', 'share', 'view') NOT NULL,
  user_ip VARCHAR(45),
  user_agent TEXT,
  user_session VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  INDEX idx_article_type (article_id, interaction_type),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_like (article_id, user_session, interaction_type, user_ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Add indexes for performance
CREATE INDEX idx_articles_likes ON articles(likes_count);
CREATE INDEX idx_articles_shares ON articles(shares_count);
CREATE INDEX idx_articles_views ON articles(views_count);
CREATE INDEX idx_articles_status_published ON articles(status, published_at);
