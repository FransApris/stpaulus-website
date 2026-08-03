-- Database schema for St. Paulus CMS - MySQL Version

-- Roles table for RBAC
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL, -- 'super_admin', 'admin_komsos', 'admin_sekretariat', 'kontributor_berita'
  display_name VARCHAR(255) NOT NULL, -- 'Super Admin', 'Admin Komsos', 'Admin Sekretariat'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table for admin and booking user authentication
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user' (legacy, will be migrated to role_id)
  role_id INT, -- Foreign key to roles table
  full_name VARCHAR(255),
  contact_phone VARCHAR(50),
  user_category VARCHAR(100), -- 'PARISH_COUNCIL', 'CATEGORICAL_GROUP', 'REGION', 'COMMUNITY'
  unit_name VARCHAR(255),
  monthly_quota_override INT DEFAULT NULL, -- NULL = use category default. Set by Super Admin per user.
  quota_is_unlimited_override BOOLEAN DEFAULT NULL, -- NULL = use category default. Override unlimited status per user.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Permissions table for RBAC
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL, -- 'manage_articles', 'manage_gallery', etc.
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission relations table (many-to-many)
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- Articles table
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255),
  author_origin VARCHAR(255) NULL,
  author_id INT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Gallery categories table
CREATE TABLE gallery_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_kategori VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery albums table
CREATE TABLE gallery_albums (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  tanggal_peristiwa DATE,
  category_id INT,
  cover_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES gallery_categories (id) ON DELETE SET NULL
);

-- Gallery photos table
CREATE TABLE gallery_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  album_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  path VARCHAR(500) NOT NULL,
  size BIGINT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES gallery_albums (id) ON DELETE CASCADE
);

-- Categories table for agenda categories
CREATE TABLE agenda_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agendas table for parish events and schedules
CREATE TABLE agendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  contact_person VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES agenda_categories (id) ON DELETE RESTRICT
);

-- Article categories table for hierarchical categorization
CREATE TABLE article_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  parent_id INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES article_categories (id) ON DELETE SET NULL
);

-- Article-category relations table (many-to-many)
CREATE TABLE article_category_relations (
  article_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES article_categories (id) ON DELETE CASCADE
);

-- News-category relations table (many-to-many)
CREATE TABLE news_category_relations (
  news_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (news_id, category_id),
  FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES article_categories (id) ON DELETE CASCADE
);

-- Contact messages table for storing contact form submissions
CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Liturgy types table (Misa, Sakramen Tobat, Adorasi, dll)
CREATE TABLE liturgy_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  icon VARCHAR(100),
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Liturgy schedules table
CREATE TABLE liturgy_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  liturgy_type_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  date DATE,
  time VARCHAR(10) NOT NULL,
  language VARCHAR(50) DEFAULT 'Indonesia',
  priest_name VARCHAR(255),
  location VARCHAR(255) NOT NULL DEFAULT 'Gereja Utama',
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(100),
  recurrence_end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (liturgy_type_id) REFERENCES liturgy_types (id) ON DELETE RESTRICT
);

-- Regular mass schedules table (for recurring weekly/daily schedules)
CREATE TABLE regular_mass_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  day_of_week VARCHAR(20) NOT NULL, -- 'Senin', 'Selasa', 'Minggu', etc.
  time VARCHAR(10) NOT NULL, -- '05:30', '17:00', etc.
  mass_type VARCHAR(100) NOT NULL, -- 'Misa Pagi', 'Misa Sore', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rooms table for room booking system
CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  facilities JSON, -- JSON array of facilities
  photo_url VARCHAR(500),
  requires_approval BOOLEAN DEFAULT TRUE,
  allowed_categories JSON, -- JSON array of allowed user_categories
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table for room reservations
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  user_id INT NOT NULL,
  event_name VARCHAR(500) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Chatbot FAQs table for AI chatbot knowledge base
CREATE TABLE chatbot_faqs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100), -- 'mass', 'sacraments', 'parish_info', etc.
  keywords JSON, -- JSON array of keywords for matching
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User categories table for dynamic user categorization
CREATE TABLE user_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  is_unlimited BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE = no monthly booking limit (e.g. DPP / BGKP)
  monthly_quota INT NOT NULL DEFAULT 3, -- Max bookings per calendar month (ignored when is_unlimited = TRUE)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chatbot FAQ Categories table for dynamic category management
CREATE TABLE chatbot_faq_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Document Categories table for document categorization
CREATE TABLE document_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Documents table for parish document management
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by INT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES document_categories (id) ON DELETE RESTRICT,
  FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
);

-- Hero themes table for managing hero section themes
CREATE TABLE hero_themes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  image_path VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pages table for static content management
CREATE TABLE pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content LONGTEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
ALTER TABLE articles ADD INDEX idx_articles_status (status);
ALTER TABLE articles ADD INDEX idx_articles_slug (slug);
ALTER TABLE news ADD INDEX idx_news_status (status);
ALTER TABLE news ADD INDEX idx_news_slug (slug);
ALTER TABLE gallery_categories ADD INDEX idx_gallery_categories_slug (slug);
ALTER TABLE gallery_categories ADD INDEX idx_gallery_categories_is_active (is_active);
ALTER TABLE gallery_categories ADD INDEX idx_gallery_categories_display_order (display_order);
ALTER TABLE gallery_albums ADD INDEX idx_gallery_albums_slug (slug);
ALTER TABLE gallery_albums ADD INDEX idx_gallery_albums_category (category_id);
ALTER TABLE gallery_albums ADD INDEX idx_gallery_albums_tanggal_peristiwa (tanggal_peristiwa);
ALTER TABLE gallery_photos ADD INDEX idx_gallery_photos_album (album_id);
ALTER TABLE agenda_categories ADD INDEX idx_agenda_categories_slug (slug);
ALTER TABLE agendas ADD INDEX idx_agendas_category_id (category_id);
ALTER TABLE agendas ADD INDEX idx_agendas_start_date (start_date);
ALTER TABLE sessions ADD INDEX idx_sessions_user (user_id);
ALTER TABLE sessions ADD INDEX idx_sessions_expires (expires_at);
ALTER TABLE article_categories ADD INDEX idx_article_categories_slug (slug);
ALTER TABLE article_categories ADD INDEX idx_article_categories_parent (parent_id);
ALTER TABLE article_category_relations ADD INDEX idx_article_category_relations_article (article_id);
ALTER TABLE article_category_relations ADD INDEX idx_article_category_relations_category (category_id);
ALTER TABLE news_category_relations ADD INDEX idx_news_category_relations_news (news_id);
ALTER TABLE news_category_relations ADD INDEX idx_news_category_relations_category (category_id);
ALTER TABLE contact_messages ADD INDEX idx_contact_messages_is_read (is_read);
ALTER TABLE contact_messages ADD INDEX idx_contact_messages_created_at (created_at);
ALTER TABLE liturgy_types ADD INDEX idx_liturgy_types_slug (slug);
ALTER TABLE liturgy_types ADD INDEX idx_liturgy_types_is_active (is_active);
ALTER TABLE liturgy_schedules ADD INDEX idx_liturgy_schedules_type (liturgy_type_id);
ALTER TABLE liturgy_schedules ADD INDEX idx_liturgy_schedules_date (date);
ALTER TABLE liturgy_schedules ADD INDEX idx_liturgy_schedules_status (status);
ALTER TABLE liturgy_schedules ADD INDEX idx_liturgy_schedules_is_recurring (is_recurring);

-- Indexes for room booking system
ALTER TABLE rooms ADD INDEX idx_rooms_is_active (is_active);
ALTER TABLE bookings ADD INDEX idx_bookings_room_id (room_id);
ALTER TABLE bookings ADD INDEX idx_bookings_user_id (user_id);
ALTER TABLE bookings ADD INDEX idx_bookings_status (status);
ALTER TABLE bookings ADD INDEX idx_bookings_start_time (start_time);
ALTER TABLE bookings ADD INDEX idx_bookings_end_time (end_time);

-- Indexes for chatbot FAQs
ALTER TABLE chatbot_faqs ADD INDEX idx_chatbot_faqs_category (category);
ALTER TABLE chatbot_faqs ADD INDEX idx_chatbot_faqs_is_active (is_active);
ALTER TABLE chatbot_faqs ADD INDEX idx_chatbot_faqs_usage_count (usage_count);

-- Indexes for user categories
ALTER TABLE user_categories ADD INDEX idx_user_categories_name (name);
ALTER TABLE user_categories ADD INDEX idx_user_categories_is_active (is_active);
ALTER TABLE user_categories ADD INDEX idx_user_categories_display_order (display_order);

-- Indexes for chatbot FAQ categories
ALTER TABLE chatbot_faq_categories ADD INDEX idx_chatbot_faq_categories_slug (slug);
ALTER TABLE chatbot_faq_categories ADD INDEX idx_chatbot_faq_categories_is_active (is_active);
ALTER TABLE chatbot_faq_categories ADD INDEX idx_chatbot_faq_categories_display_order (display_order);

-- Indexes for document categories
ALTER TABLE document_categories ADD INDEX idx_document_categories_slug (slug);
ALTER TABLE document_categories ADD INDEX idx_document_categories_is_active (is_active);
ALTER TABLE document_categories ADD INDEX idx_document_categories_display_order (display_order);

-- Indexes for documents
ALTER TABLE documents ADD INDEX idx_documents_category_id (category_id);
ALTER TABLE documents ADD INDEX idx_documents_uploaded_by (uploaded_by);
ALTER TABLE documents ADD INDEX idx_documents_created_at (created_at);
ALTER TABLE documents ADD INDEX idx_documents_filename (filename);

-- Indexes for pages
ALTER TABLE pages ADD INDEX idx_pages_slug (slug);
ALTER TABLE pages ADD INDEX idx_pages_is_published (is_published);
ALTER TABLE pages ADD INDEX idx_pages_created_at (created_at);

-- Create unique index to ensure only one active theme
-- Note: MySQL doesn't support WHERE clause in unique indexes like this
-- We'll handle this constraint in application logic
