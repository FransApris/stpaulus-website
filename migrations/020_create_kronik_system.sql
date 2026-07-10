-- Migration: Create Kronik System Tables
-- Date: 2026-02-13
-- Description: Create tables for church chronicle system with 5W1H structure

-- 1. Create kronik_categories table
CREATE TABLE IF NOT EXISTS kronik_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
);

-- Insert default categories
INSERT INTO
    kronik_categories (
        name,
        slug,
        icon,
        order_index,
        description
    )
VALUES (
        'Gereja',
        'gereja',
        'church',
        1,
        'Kronik kegiatan gereja secara umum'
    ),
    (
        'DPP',
        'dpp',
        'users',
        2,
        'Kronik Dewan Pastoral Paroki'
    ),
    (
        'BGKP',
        'bgkp',
        'user-group',
        3,
        'Kronik Badan Gereja Katolik Paroki'
    ),
    (
        'Wilayah',
        'wilayah',
        'map',
        4,
        'Kronik kegiatan per wilayah'
    ),
    (
        'Lingkungan',
        'lingkungan',
        'home',
        5,
        'Kronik kegiatan per lingkungan'
    );

-- 2. Create kronik_sections table (bagian-bagian dalam kategori)
CREATE TABLE IF NOT EXISTS kronik_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES kronik_categories (id) ON DELETE CASCADE,
    UNIQUE KEY unique_section (category_id, slug),
    INDEX idx_category (category_id),
    INDEX idx_active (is_active)
);

-- Insert example sections for DPP
INSERT INTO
    kronik_sections (
        category_id,
        name,
        slug,
        order_index
    )
VALUES (
        2,
        'Dewan Pastoral Paroki',
        'dewan-pastoral',
        1
    ),
    (
        2,
        'Tim Liturgi',
        'tim-liturgi',
        2
    ),
    (
        2,
        'Tim Sosial',
        'tim-sosial',
        3
    ),
    (
        2,
        'Tim Komunikasi',
        'tim-komunikasi',
        4
    );

-- Insert example sections for BGKP
INSERT INTO
    kronik_sections (
        category_id,
        name,
        slug,
        order_index
    )
VALUES (
        3,
        'Seksi Liturgi',
        'seksi-liturgi',
        1
    ),
    (
        3,
        'Seksi Pelayanan Kasih',
        'seksi-pelayanan-kasih',
        2
    ),
    (
        3,
        'Seksi Pendidikan',
        'seksi-pendidikan',
        3
    ),
    (
        3,
        'Seksi Dana',
        'seksi-dana',
        4
    );

-- 3. Create kronik_entries table (isi kronik dengan 5W1H)
CREATE TABLE IF NOT EXISTS kronik_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  section_id INT,

-- 5W1H Fields
what_title VARCHAR(500) NOT NULL,
what_description TEXT NOT NULL,
who_involved TEXT,
when_date DATETIME NOT NULL,
when_duration VARCHAR(100),
where_location VARCHAR(500),
where_address TEXT,
why_purpose TEXT,
how_process TEXT,

-- Media
featured_image VARCHAR(500), gallery JSON, documents JSON,

-- Status & Meta

status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
  views_count INT DEFAULT 0,
  author_id INT,
  approved_by INT,
  approved_at DATETIME,
  published_at DATETIME,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES kronik_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES kronik_sections(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_category (category_id),
  INDEX idx_section (section_id),
  INDEX idx_status (status),
  INDEX idx_date (when_date),
  INDEX idx_author (author_id),
  FULLTEXT INDEX idx_search (what_title, what_description)
);

-- 4. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_level (level)
);

-- Insert roles
INSERT INTO
    user_roles (
        name,
        slug,
        level,
        description
    )
VALUES (
        'Super Admin',
        'super-admin',
        1,
        'Full access ke semua fitur'
    ),
    (
        'Admin Paroki',
        'admin-paroki',
        2,
        'Administrator paroki'
    ),
    (
        'Ketua DPP',
        'ketua-dpp',
        3,
        'Ketua Dewan Pastoral Paroki'
    ),
    (
        'Pengurus DPP',
        'pengurus-dpp',
        4,
        'Pengurus DPP'
    ),
    (
        'Ketua BGKP',
        'ketua-bgkp',
        5,
        'Ketua BGKP'
    ),
    (
        'Pengurus BGKP',
        'pengurus-bgkp',
        6,
        'Pengurus BGKP'
    ),
    (
        'Ketua Wilayah',
        'ketua-wilayah',
        7,
        'Ketua Wilayah'
    ),
    (
        'Pengurus Wilayah',
        'pengurus-wilayah',
        8,
        'Pengurus Wilayah'
    ),
    (
        'Ketua Lingkungan',
        'ketua-lingkungan',
        9,
        'Ketua Lingkungan'
    ),
    (
        'Pengurus Lingkungan',
        'pengurus-lingkungan',
        10,
        'Pengurus Lingkungan'
    ),
    (
        'User Biasa',
        'user',
        11,
        'User biasa/umat'
    );

-- 5. Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category ENUM(
        'kronik',
        'ruang',
        'user',
        'content'
    ) DEFAULT 'kronik',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category)
);

-- Insert permissions untuk kronik
INSERT INTO
    permissions (
        name,
        slug,
        category,
        description
    )
VALUES
    -- Kronik Gereja
    (
        'View Kronik Gereja',
        'kronik.gereja.view',
        'kronik',
        'Melihat kronik gereja'
    ),
    (
        'Create Kronik Gereja',
        'kronik.gereja.create',
        'kronik',
        'Membuat kronik gereja'
    ),
    (
        'Edit Kronik Gereja',
        'kronik.gereja.edit',
        'kronik',
        'Mengedit kronik gereja'
    ),
    (
        'Delete Kronik Gereja',
        'kronik.gereja.delete',
        'kronik',
        'Menghapus kronik gereja'
    ),
    (
        'Publish Kronik Gereja',
        'kronik.gereja.publish',
        'kronik',
        'Mempublikasi kronik gereja'
    ),

-- Kronik DPP
(
    'View Kronik DPP',
    'kronik.dpp.view',
    'kronik',
    'Melihat kronik DPP'
),
(
    'Create Kronik DPP',
    'kronik.dpp.create',
    'kronik',
    'Membuat kronik DPP'
),
(
    'Edit Kronik DPP',
    'kronik.dpp.edit',
    'kronik',
    'Mengedit kronik DPP'
),
(
    'Delete Kronik DPP',
    'kronik.dpp.delete',
    'kronik',
    'Menghapus kronik DPP'
),
(
    'Publish Kronik DPP',
    'kronik.dpp.publish',
    'kronik',
    'Mempublikasi kronik DPP'
),

-- Kronik BGKP
(
    'View Kronik BGKP',
    'kronik.bgkp.view',
    'kronik',
    'Melihat kronik BGKP'
),
(
    'Create Kronik BGKP',
    'kronik.bgkp.create',
    'kronik',
    'Membuat kronik BGKP'
),
(
    'Edit Kronik BGKP',
    'kronik.bgkp.edit',
    'kronik',
    'Mengedit kronik BGKP'
),
(
    'Delete Kronik BGKP',
    'kronik.bgkp.delete',
    'kronik',
    'Menghapus kronik BGKP'
),
(
    'Publish Kronik BGKP',
    'kronik.bgkp.publish',
    'kronik',
    'Mempublikasi kronik BGKP'
),

-- Kronik Wilayah
(
    'View Kronik Wilayah',
    'kronik.wilayah.view',
    'kronik',
    'Melihat kronik wilayah'
),
(
    'Create Kronik Wilayah',
    'kronik.wilayah.create',
    'kronik',
    'Membuat kronik wilayah'
),
(
    'Edit Kronik Wilayah',
    'kronik.wilayah.edit',
    'kronik',
    'Mengedit kronik wilayah'
),
(
    'Delete Kronik Wilayah',
    'kronik.wilayah.delete',
    'kronik',
    'Menghapus kronik wilayah'
),
(
    'Publish Kronik Wilayah',
    'kronik.wilayah.publish',
    'kronik',
    'Mempublikasi kronik wilayah'
),

-- Kronik Lingkungan
(
    'View Kronik Lingkungan',
    'kronik.lingkungan.view',
    'kronik',
    'Melihat kronik lingkungan'
),
(
    'Create Kronik Lingkungan',
    'kronik.lingkungan.create',
    'kronik',
    'Membuat kronik lingkungan'
),
(
    'Edit Kronik Lingkungan',
    'kronik.lingkungan.edit',
    'kronik',
    'Mengedit kronik lingkungan'
),
(
    'Delete Kronik Lingkungan',
    'kronik.lingkungan.delete',
    'kronik',
    'Menghapus kronik lingkungan'
),
(
    'Publish Kronik Lingkungan',
    'kronik.lingkungan.publish',
    'kronik',
    'Mempublikasi kronik lingkungan'
);

-- 6. Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES user_roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- Assign permissions to Super Admin (all permissions)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 1, id
FROM permissions
WHERE
    category = 'kronik';

-- Assign permissions to Admin Paroki (all kronik permissions)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 2, id
FROM permissions
WHERE
    category = 'kronik';

-- Assign permissions to Ketua DPP
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 3, id
FROM permissions
WHERE
    slug LIKE 'kronik.dpp.%';

-- Assign permissions to Pengurus DPP (except publish)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 4, id
FROM permissions
WHERE
    slug LIKE 'kronik.dpp.%'
    AND slug NOT LIKE '%publish';

-- Assign permissions to Ketua BGKP
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 5, id
FROM permissions
WHERE
    slug LIKE 'kronik.bgkp.%';

-- Assign permissions to Pengurus BGKP (except publish)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 6, id
FROM permissions
WHERE
    slug LIKE 'kronik.bgkp.%'
    AND slug NOT LIKE '%publish';

-- Assign permissions to Ketua Wilayah
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 7, id
FROM permissions
WHERE
    slug LIKE 'kronik.wilayah.%';

-- Assign permissions to Pengurus Wilayah (except publish)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 8, id
FROM permissions
WHERE
    slug LIKE 'kronik.wilayah.%'
    AND slug NOT LIKE '%publish';

-- Assign permissions to Ketua Lingkungan
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 9, id
FROM permissions
WHERE
    slug LIKE 'kronik.lingkungan.%';

-- Assign permissions to Pengurus Lingkungan (except publish)
INSERT INTO
    role_permissions (role_id, permission_id)
SELECT 10, id
FROM permissions
WHERE
    slug LIKE 'kronik.lingkungan.%'
    AND slug NOT LIKE '%publish';

-- 7. Update users table (check if columns exist, add if not)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_id INT,
ADD COLUMN IF NOT EXISTS organization_type ENUM(
    'gereja',
    'dpp',
    'bgkp',
    'wilayah',
    'lingkungan'
),
ADD COLUMN IF NOT EXISTS organization_id INT;

-- Add foreign key if not exists
SET
    @exist := (
        SELECT COUNT(*)
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE
            CONSTRAINT_SCHEMA = DATABASE()
            AND TABLE_NAME = 'users'
            AND CONSTRAINT_NAME = 'users_role_id_foreign'
            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    );

SET
    @sqlstmt := IF(
        @exist = 0,
        'ALTER TABLE users ADD CONSTRAINT users_role_id_foreign FOREIGN KEY (role_id) REFERENCES user_roles(id)',
        'SELECT ''Foreign key already exists'''
    );

PREPARE stmt FROM @sqlstmt;

EXECUTE stmt;

-- 8. Create kronik_views table (untuk tracking views)
CREATE TABLE IF NOT EXISTS kronik_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kronik_id INT NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kronik_id) REFERENCES kronik_entries (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_kronik (kronik_id),
    INDEX idx_user (user_id),
    INDEX idx_date (viewed_at)
);

-- 9. Create kronik_comments table (optional - untuk komentar di kronik)
CREATE TABLE IF NOT EXISTS kronik_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kronik_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kronik_id) REFERENCES kronik_entries (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES kronik_comments (id) ON DELETE CASCADE,
    INDEX idx_kronik (kronik_id),
    INDEX idx_user (user_id),
    INDEX idx_approved (is_approved)
);