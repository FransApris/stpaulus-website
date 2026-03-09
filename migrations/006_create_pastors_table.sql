-- Migration: Create pastors table for managing Romo Bertugas
-- Created: 2026-01-26
-- Purpose: Store pastor information with full profile data

CREATE TABLE IF NOT EXISTS pastors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL COMMENT 'Full name with title (e.g., Romo Andreas Budi Prasetyo, Pr)',
  full_name VARCHAR(255) DEFAULT NULL COMMENT 'Complete name without abbreviations',
  title VARCHAR(100) DEFAULT NULL COMMENT 'Religious title (e.g., Pr, MSC, SJ)',
  
  -- Service Period
  start_year VARCHAR(10) NOT NULL COMMENT 'Year started serving',
  end_year VARCHAR(10) DEFAULT NULL COMMENT 'Year ended serving or "Sekarang" for current',
  status ENUM('active', 'alumni') DEFAULT 'alumni' COMMENT 'Current serving status',
  
  -- Profile Information
  photo_url VARCHAR(500) DEFAULT NULL COMMENT 'Profile photo path',
  bio TEXT DEFAULT NULL COMMENT 'Biography or description',
  quote TEXT DEFAULT NULL COMMENT 'Favorite quote or motto',
  achievements TEXT DEFAULT NULL COMMENT 'Notable achievements or responsibilities',
  
  -- Contact & Additional
  email VARCHAR(255) DEFAULT NULL COMMENT 'Contact email',
  phone VARCHAR(50) DEFAULT NULL COMMENT 'Contact phone',
  
  -- Display Order & Visibility
  display_order INT DEFAULT 0 COMMENT 'Order for displaying (lower number = higher priority)',
  is_visible BOOLEAN DEFAULT TRUE COMMENT 'Show/hide from public page',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT DEFAULT NULL COMMENT 'User ID who created this record',
  updated_by INT DEFAULT NULL COMMENT 'User ID who last updated this record',
  
  INDEX idx_status (status),
  INDEX idx_visible (is_visible),
  INDEX idx_display_order (display_order),
  INDEX idx_start_year (start_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data from current hardcoded values
INSERT INTO pastors (name, full_name, title, start_year, end_year, status, photo_url, display_order, is_visible) VALUES
('Romo Andreas Budi Prasetyo, Pr', 'Andreas Budi Prasetyo', 'Pr', '2024', 'Sekarang', 'active', '/images/pastor 4.jpg', 1, TRUE),
('Romo Yohanes Hariyanto, Pr', 'Yohanes Hariyanto', 'Pr', '2020', '2024', 'alumni', '/images/pastor 3.jpg', 2, TRUE),
('Romo Tri Kuncoro Yekti, Pr', 'Tri Kuncoro Yekti', 'Pr', '2014', '2020', 'alumni', '/images/pastor 2.jpg', 3, TRUE),
('Romo Sony Kristyanto, Pr', 'Sony Kristyanto', 'Pr', '2008', '2014', 'alumni', '/images/pastor 1.jpg', 4, TRUE),
('Romo Fransiskus Xavier, Pr', 'Fransiskus Xavier', 'Pr', '2005', '2008', 'alumni', '/images/pastor 5.jpg', 5, TRUE);

-- Add comments for documentation
ALTER TABLE pastors 
  COMMENT = 'Stores information about pastors who have served or are serving at the parish';
