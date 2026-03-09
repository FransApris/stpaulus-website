-- ✅ FASE 2: Search Analytics Migration
-- Create search_logs table to track search queries and usage patterns

CREATE TABLE IF NOT EXISTS search_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  results_count INT DEFAULT 0,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query (query),
  INDEX idx_searched_at (searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment
ALTER TABLE search_logs COMMENT = 'Search analytics - tracks user search queries and results';

-- Verify table created
SHOW CREATE TABLE search_logs;

-- Sample query to get popular searches (for future analytics)
-- SELECT query, COUNT(*) as search_count, AVG(results_count) as avg_results
-- FROM search_logs
-- WHERE searched_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
-- GROUP BY query
-- ORDER BY search_count DESC
-- LIMIT 10;
