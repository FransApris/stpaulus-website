-- Migration: Add Social Features to News
-- Date: 2026-01-18
-- Description: Add likes_count, shares_count, and create news_interactions table

-- Step 1: Add columns to news table
ALTER TABLE news 
ADD COLUMN likes_count INT DEFAULT 0 NOT NULL AFTER updated_at,
ADD COLUMN shares_count INT DEFAULT 0 NOT NULL AFTER likes_count,
ADD COLUMN views_count INT DEFAULT 0 NOT NULL AFTER shares_count;

-- Step 2: Create news_interactions table to track individual user interactions
CREATE TABLE IF NOT EXISTS news_interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  interaction_type ENUM('like', 'share', 'view') NOT NULL,
  user_ip VARCHAR(45),
  user_agent TEXT,
  user_session VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
  INDEX idx_news_type (news_id, interaction_type),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_like (news_id, user_session, interaction_type, user_ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Add indexes for performance
CREATE INDEX idx_news_likes ON news(likes_count);
CREATE INDEX idx_news_shares ON news(shares_count);
CREATE INDEX idx_news_views ON news(views_count);
CREATE INDEX idx_news_status_published ON news(status, published_at);
