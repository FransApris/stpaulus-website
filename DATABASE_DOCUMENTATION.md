# 📊 Database Documentation - St. Paulus CMS

## 📌 Database Information

| Property | Value |
|----------|-------|
| **Database Name** | `stpaulus_cms_db` |
| **Type** | MySQL |
| **Package** | `mysql2` |
| **Character Set** | UTF8MB4 |
| **Collation** | utf8mb4_unicode_ci |
| **Engine** | InnoDB |
| **Schema File** | `server/database/schema-mysql.sql` |

---

## 📁 Database Structure Overview

Database terdiri dari **40+ tables** yang dikelompokkan berdasarkan fungsi:

### 🔐 Authentication & Authorization (5 tables)
- `users` - User accounts (admin & regular users)
- `roles` - RBAC roles (super_admin, admin_komsos, admin_sekretariat)
- `permissions` - Permission definitions
- `role_permissions` - Role-permission mappings (many-to-many)
- `sessions` - Session management

### 📝 Content Management (8 tables)
- `articles` - Article content with categories
- `article_categories` - Hierarchical article categories
- `article_category_relations` - Article-category mapping
- `news` - News articles
- `news_category_relations` - News-category mapping
- `pages` - Static pages (About Us, Contact, etc.)
- `documents` - Document management
- `document_categories` - Document categorization

### 📅 Events & Scheduling (8 tables)
- `agendas` - Parish events and schedules
- `agenda_categories` - Event categories
- `liturgy_types` - Types of liturgy (Misa, Sakramen, Adorasi)
- `liturgy_schedules` - Dynamic liturgy schedules
- `regular_mass_schedules` - Recurring mass schedules
- `church_announcements` - Church announcements/pengumuman
- `devotions` - Daily devotions/renungan
- `devotion_types` - Devotion categorization

### 🖼️ Gallery & Media (3 tables)
- `gallery_categories` - Gallery categories
- `gallery_albums` - Photo albums
- `gallery_photos` - Individual photos

### 🏢 Parish Organization (5 tables)
- `pastors` - Pastor profiles (Romo Bertugas)
- `wilayah` - Territorial areas/regions
- `lingkungan` - Neighborhoods/communities
- `parish_statistics` - Statistical data
- `parish_statistics_log` - Statistics history

### 📞 Communication (3 tables)
- `contact_messages` - Contact form submissions
- `chatbot_faqs` - Chatbot knowledge base
- `chatbot_faq_categories` - FAQ categorization

### 🏛️ Facility Management (3 tables)
- `rooms` - Room/facility information
- `bookings` - Room booking reservations
- `user_categories` - User category definitions

### 🎨 UI & Configuration (2 tables)
- `hero_themes` - Hero section themes
- `liturgy_types` - Liturgy type definitions (with icons)

### 📊 Analytics & Logging (3 tables)
- `search_logs` - Search activity tracking
- `news_interactions` - News engagement (likes, views, shares)
- `article_interactions` - Article engagement

---

## 🗂️ Detailed Table Specifications

### 1. Authentication & Authorization

#### 📋 Table: `roles`
**Purpose**: Role-Based Access Control (RBAC) roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Unique role ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | System name (super_admin, admin_komsos) |
| display_name | VARCHAR(255) | NOT NULL | Display name (Super Admin, Admin Komsos) |
| description | TEXT | NULL | Role description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | ON UPDATE | Last update timestamp |

**Indexes**: 
- PRIMARY KEY (id)
- UNIQUE KEY (name)

**Sample Data**:
```sql
('super_admin', 'Super Admin', 'Full system access')
('admin_komsos', 'Admin Komsos', 'Content management access')
('admin_sekretariat', 'Admin Sekretariat', 'Booking & document management')
```

---

#### 📋 Table: `users`
**Purpose**: User accounts for authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Unique user ID |
| username | VARCHAR(255) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | TEXT | NOT NULL | Hashed password |
| role | VARCHAR(50) | DEFAULT 'user' | Legacy role field |
| role_id | INT | FK → roles(id) | RBAC role reference |
| full_name | VARCHAR(255) | NULL | Full name |
| contact_phone | VARCHAR(50) | NULL | Contact phone |
| user_category | VARCHAR(100) | NULL | User category |
| unit_name | VARCHAR(255) | NULL | Unit/organization name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (username, email)
- FOREIGN KEY (role_id) → roles(id)

**Security**:
- Passwords stored as bcrypt hash
- JWT token used for authentication
- Token stored in localStorage (`admin_access_token`)

---

#### 📋 Table: `permissions`
**Purpose**: Permission definitions for RBAC

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Permission ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | System name |
| display_name | VARCHAR(255) | NOT NULL | Display name |
| description | TEXT | NULL | Permission description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Sample Permissions**:
```sql
manage_articles, manage_news, manage_gallery, manage_agenda,
manage_documents, manage_bookings, manage_users, manage_roles,
manage_church_announcements, manage_pastors, manage_chatbot,
manage_statistics, manage_content, backup
```

---

#### 📋 Table: `role_permissions`
**Purpose**: Many-to-many mapping between roles and permissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| role_id | INT | PK, FK → roles(id) | Role reference |
| permission_id | INT | PK, FK → permissions(id) | Permission reference |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Assignment date |

**Constraints**:
- PRIMARY KEY (role_id, permission_id)
- ON DELETE CASCADE (both FKs)

---

#### 📋 Table: `sessions`
**Purpose**: Session management for authenticated users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | Session token |
| user_id | INT | FK → users(id), NOT NULL | User reference |
| expires_at | TIMESTAMP | NOT NULL | Expiration time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Session start |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (expires_at)

---

### 2. Content Management

#### 📋 Table: `articles`
**Purpose**: Article content management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Article ID |
| title | VARCHAR(500) | NOT NULL | Article title |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL-friendly slug |
| content | LONGTEXT | NOT NULL | Full article content (HTML) |
| excerpt | TEXT | NULL | Short excerpt/summary |
| author | VARCHAR(255) | NULL | Author name |
| status | VARCHAR(50) | DEFAULT 'draft' | draft, published, archived |
| thumbnail | VARCHAR(500) | NULL | Thumbnail image path |
| published_at | TIMESTAMP | NULL | Publication date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (slug)
- INDEX (status)
- FULLTEXT INDEX (title, excerpt, content)

**Features**:
- Social interactions (likes, views, shares)
- Category relationships
- Fulltext search capability

---

#### 📋 Table: `article_categories`
**Purpose**: Hierarchical article categorization

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| parent_id | INT | FK → article_categories(id) | Parent category (NULL = root) |
| description | TEXT | NULL | Category description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (name, slug)
- INDEX (parent_id)

**Hierarchy Support**:
- Self-referencing foreign key for tree structure
- NULL parent_id indicates root category

---

#### 📋 Table: `article_category_relations`
**Purpose**: Many-to-many mapping (articles ↔ categories)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| article_id | INT | PK, FK → articles(id) | Article reference |
| category_id | INT | PK, FK → article_categories(id) | Category reference |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Assignment date |

**Constraints**:
- PRIMARY KEY (article_id, category_id)
- ON DELETE CASCADE (both FKs)

---

#### 📋 Table: `news`
**Purpose**: News articles management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | News ID |
| title | VARCHAR(500) | NOT NULL | News title |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL slug |
| content | LONGTEXT | NOT NULL | Full content (HTML) |
| excerpt | TEXT | NULL | Summary |
| author | VARCHAR(255) | NULL | Author name |
| status | VARCHAR(50) | DEFAULT 'draft' | draft, published, archived |
| thumbnail | VARCHAR(500) | NULL | Thumbnail path |
| published_at | TIMESTAMP | NULL | Publication date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (slug)
- INDEX (status)
- FULLTEXT INDEX (title, excerpt, content)

**Features**:
- Similar to articles but separate entity
- Social interactions tracking
- Category support

---

#### 📋 Table: `pages`
**Purpose**: Static page content management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Page ID |
| title | VARCHAR(500) | NOT NULL | Page title |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL slug |
| content | LONGTEXT | NULL | Page content (HTML) |
| is_published | BOOLEAN | DEFAULT FALSE | Visibility status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (slug)
- INDEX (is_published)

**Use Cases**:
- About Us page
- Privacy Policy
- Terms & Conditions
- Contact page content

---

#### 📋 Table: `documents`
**Purpose**: Document file management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Document ID |
| title | VARCHAR(500) | NOT NULL | Document title |
| description | TEXT | NULL | Description |
| category_id | INT | FK → document_categories(id) | Category reference |
| filename | VARCHAR(255) | NOT NULL | Stored filename |
| original_filename | VARCHAR(500) | NOT NULL | Original uploaded filename |
| file_path | VARCHAR(500) | NOT NULL | Storage path |
| file_size | BIGINT | NOT NULL | File size (bytes) |
| mime_type | VARCHAR(100) | NOT NULL | MIME type |
| uploaded_by | INT | FK → users(id) | Uploader reference |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category_id, uploaded_by, filename)
- FULLTEXT INDEX (title, description)

---

#### 📋 Table: `document_categories`
**Purpose**: Document categorization

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| description | TEXT | NULL | Description |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Display color (hex) |
| display_order | INT | DEFAULT 0 | Sort order |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

---

### 3. Events & Scheduling

#### 📋 Table: `church_announcements`
**Purpose**: Church announcements/pengumuman gereja

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Announcement ID |
| title | VARCHAR(255) | NOT NULL | Announcement title |
| description | TEXT | NULL | Full description |
| activity_type | VARCHAR(100) | NULL | Activity category |
| thumbnail | VARCHAR(500) | NULL | Image thumbnail |
| event_date | DATE | NOT NULL | Event date |
| event_time | TIME | NULL | Event time |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility status |
| display_order | INT | DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (event_date, is_active, created_at)

**Features**:
- Homepage display section
- Admin CRUD management
- Permission: `manage_church_announcements`

**Sample Data**:
```sql
'Misa Syukur HUT Paroki' - 2026-02-15 10:00
'Retret Keluarga' - 2026-02-20 08:00
'Bakti Sosial' - 2026-02-25 07:00
```

---

#### 📋 Table: `agendas`
**Purpose**: Parish events and schedules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Agenda ID |
| title | VARCHAR(500) | NOT NULL | Event title |
| description | TEXT | NULL | Event description |
| start_date | TIMESTAMP | NOT NULL | Start date/time |
| end_date | TIMESTAMP | NULL | End date/time |
| location | VARCHAR(255) | NOT NULL | Event location |
| category_id | INT | FK → agenda_categories(id) | Category reference |
| contact_person | VARCHAR(255) | NULL | Contact person |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category_id, start_date)
- FULLTEXT INDEX (title, description)

---

#### 📋 Table: `agenda_categories`
**Purpose**: Event categorization

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| description | TEXT | NULL | Description |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Display color |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

---

#### 📋 Table: `liturgy_types`
**Purpose**: Types of liturgical services

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Type ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Type name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| icon | VARCHAR(100) | NULL | Icon identifier |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Display color |
| description | TEXT | NULL | Description |
| display_order | INT | DEFAULT 0 | Sort order |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (name, slug)
- INDEX (is_active)

**Sample Data**:
```sql
'Misa' - Regular mass services
'Sakramen Tobat' - Confession
'Adorasi' - Eucharistic adoration
'Doa Rosario' - Rosary prayer
```

---

#### 📋 Table: `liturgy_schedules`
**Purpose**: Dynamic liturgy schedules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Schedule ID |
| liturgy_type_id | INT | FK → liturgy_types(id) | Type reference |
| title | VARCHAR(500) | NOT NULL | Schedule title |
| date | DATE | NULL | Specific date (NULL if recurring) |
| time | VARCHAR(10) | NOT NULL | Time (HH:MM format) |
| language | VARCHAR(50) | DEFAULT 'Indonesia' | Service language |
| priest_name | VARCHAR(255) | NULL | Presiding priest |
| location | VARCHAR(255) | DEFAULT 'Gereja Utama' | Location |
| notes | TEXT | NULL | Additional notes |
| is_recurring | BOOLEAN | DEFAULT FALSE | Recurring schedule |
| recurrence_pattern | VARCHAR(100) | NULL | Recurrence rule |
| recurrence_end_date | DATE | NULL | End date for recurrence |
| status | VARCHAR(50) | DEFAULT 'active' | Status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (liturgy_type_id, date, status, is_recurring)

---

#### 📋 Table: `regular_mass_schedules`
**Purpose**: Recurring weekly mass schedules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Schedule ID |
| day_of_week | VARCHAR(20) | NOT NULL | Day name (Senin, Minggu) |
| time | VARCHAR(10) | NOT NULL | Time (HH:MM) |
| mass_type | VARCHAR(100) | NOT NULL | Type (Misa Pagi, Misa Sore) |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Sample Data**:
```sql
'Senin', '05:30', 'Misa Pagi'
'Minggu', '06:00', 'Misa Pagi'
'Minggu', '17:00', 'Misa Sore'
```

---

#### 📋 Table: `devotions`
**Purpose**: Daily devotions/renungan harian

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Devotion ID |
| title | VARCHAR(255) | NOT NULL | Devotion title |
| content | TEXT | NOT NULL | Devotion content |
| scripture_reference | VARCHAR(255) | NULL | Bible reference |
| devotion_date | DATE | NOT NULL | Date for devotion |
| devotion_type_id | INT | FK → devotion_types(id) | Type reference |
| author | VARCHAR(255) | NULL | Author name |
| is_published | BOOLEAN | DEFAULT FALSE | Publication status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

---

#### 📋 Table: `devotion_types`
**Purpose**: Devotion categorization

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Type ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

---

### 4. Gallery & Media

#### 📋 Table: `gallery_categories`
**Purpose**: Gallery photo categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| nama_kategori | VARCHAR(255) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| description | TEXT | NULL | Description |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Display color |
| display_order | INT | DEFAULT 0 | Sort order |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (nama_kategori, slug)
- INDEX (is_active, display_order)

---

#### 📋 Table: `gallery_albums`
**Purpose**: Photo albums

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Album ID |
| title | VARCHAR(500) | NOT NULL | Album title |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL slug |
| description | TEXT | NULL | Album description |
| tanggal_peristiwa | DATE | NULL | Event date |
| category_id | INT | FK → gallery_categories(id) | Category reference |
| cover_image | VARCHAR(500) | NULL | Cover image path |
| status | VARCHAR(50) | DEFAULT 'published' | Publication status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (slug)
- INDEX (category_id, tanggal_peristiwa)

---

#### 📋 Table: `gallery_photos`
**Purpose**: Individual photos in albums

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Photo ID |
| album_id | INT | FK → gallery_albums(id) | Album reference |
| filename | VARCHAR(255) | NOT NULL | Stored filename |
| original_filename | VARCHAR(255) | NULL | Original filename |
| path | VARCHAR(500) | NOT NULL | Storage path |
| size | BIGINT | NULL | File size (bytes) |
| mime_type | VARCHAR(100) | NULL | MIME type |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload date |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (album_id)
- ON DELETE CASCADE (album deletion deletes photos)

---

### 5. Parish Organization

#### 📋 Table: `pastors`
**Purpose**: Pastor profiles (Romo Bertugas)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Pastor ID |
| name | VARCHAR(255) | NOT NULL | Full name with title |
| full_name | VARCHAR(255) | NULL | Name without abbreviations |
| title | VARCHAR(100) | NULL | Religious title (Pr, MSC, SJ) |
| start_year | VARCHAR(10) | NOT NULL | Year started serving |
| end_year | VARCHAR(10) | NULL | Year ended or "Sekarang" |
| status | ENUM('active', 'alumni') | DEFAULT 'alumni' | Service status |
| position_type | VARCHAR(50) | NULL | Pastor, Associate, etc. |
| photo_url | VARCHAR(500) | NULL | Profile photo path |
| bio | TEXT | NULL | Biography |
| quote | TEXT | NULL | Favorite quote |
| achievements | TEXT | NULL | Notable achievements |
| email | VARCHAR(255) | NULL | Contact email |
| phone | VARCHAR(50) | NULL | Contact phone |
| display_order | INT | DEFAULT 0 | Sort order |
| is_visible | BOOLEAN | DEFAULT TRUE | Visibility |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |
| created_by | INT | NULL | Creator user ID |
| updated_by | INT | NULL | Last updater user ID |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (status, is_visible, display_order, start_year)

**Sample Data**:
```sql
'Romo Andreas Budi Prasetyo, Pr' - 2024-Sekarang (active)
'Romo Yohanes Hariyanto, Pr' - 2020-2024 (alumni)
'Romo Tri Kuncoro Yekti, Pr' - 2014-2020 (alumni)
```

---

#### 📋 Table: `wilayah`
**Purpose**: Territorial areas/regions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PK, AUTO_INCREMENT | Area ID |
| nama | VARCHAR(100) | NOT NULL | Area name |
| keterangan | TEXT | NULL | Description |
| display_order | INT | DEFAULT 0 | Sort order |
| is_visible | TINYINT(1) | DEFAULT 1 | Visibility |
| created_by | INT | NULL | Creator user ID |
| updated_by | INT | NULL | Last updater |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (display_order, is_visible)

**Sample Data** (12 wilayah):
```sql
'Juanda & Waru', 'Semolowaru & Sukolilo', 'Sidoarjo Kota',
'Gedangan', 'Buduran', 'Candi', 'Porong', 'Tanggulangin',
'Sukodono', 'Krian', 'Taman', 'Sepanjang'
```

---

#### 📋 Table: `lingkungan`
**Purpose**: Neighborhoods/communities within wilayah

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PK, AUTO_INCREMENT | Lingkungan ID |
| no | INT | UNIQUE, NOT NULL | Lingkungan number |
| nama | VARCHAR(100) | NOT NULL | Name (e.g., St. Petrus) |
| wilayah_id | INT UNSIGNED | FK → wilayah(id) | Wilayah reference |
| wilayah_text | VARCHAR(200) | NULL | Freeform wilayah text |
| ketua | VARCHAR(100) | NULL | Chairman name |
| telp | VARCHAR(20) | NULL | Contact phone |
| email | VARCHAR(100) | NULL | Contact email |
| alamat | TEXT | NULL | Address |
| jumlah_kk | INT | DEFAULT 0 | Number of families |
| jumlah_jiwa | INT | DEFAULT 0 | Number of people |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Display color |
| keterangan | TEXT | NULL | Additional notes |
| display_order | INT | DEFAULT 0 | Sort order |
| is_visible | TINYINT(1) | DEFAULT 1 | Visibility |
| created_by | INT | NULL | Creator user ID |
| updated_by | INT | NULL | Last updater |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (no)
- INDEX (wilayah_id, display_order, is_visible)
- FOREIGN KEY (wilayah_id) → wilayah(id) ON DELETE SET NULL

**Sample Data** (12 lingkungan):
```sql
1. St. Petrus (75 KK, 225 jiwa) - Juanda, Waru
2. St. Paulus (82 KK, 246 jiwa) - Semolowaru, Sukolilo
3. St. Yohanes (68 KK, 204 jiwa) - Sidoarjo Kota
... (12 total)
```

---

#### 📋 Table: `parish_statistics`
**Purpose**: Current parish statistical data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Statistic ID |
| year | INT | NOT NULL | Year of data |
| category | VARCHAR(100) | NOT NULL | Data category |
| label | VARCHAR(255) | NOT NULL | Data label |
| value | INT | NOT NULL | Numeric value |
| description | TEXT | NULL | Description |
| display_order | INT | DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Categories**:
- Perkembangan Umat (Population growth)
- Jenis Kelamin (Gender distribution)
- Usia (Age distribution)
- Sakramen (Sacraments administered)

---

#### 📋 Table: `parish_statistics_log`
**Purpose**: Historical statistical data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Log ID |
| statistic_id | INT | FK → parish_statistics(id) | Reference to current stat |
| old_value | INT | NOT NULL | Previous value |
| new_value | INT | NOT NULL | Updated value |
| changed_by | INT | FK → users(id) | User who made change |
| changed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Change timestamp |
| notes | TEXT | NULL | Change notes |

**Purpose**: Audit trail for statistical changes

---

### 6. Communication

#### 📋 Table: `contact_messages`
**Purpose**: Contact form submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Message ID |
| name | VARCHAR(255) | NOT NULL | Sender name |
| email | VARCHAR(255) | NOT NULL | Sender email |
| phone | VARCHAR(50) | NOT NULL | Contact phone |
| message | TEXT | NOT NULL | Message content |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (is_read, created_at)

---

#### 📋 Table: `chatbot_faqs`
**Purpose**: Chatbot knowledge base

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | FAQ ID |
| question | TEXT | NOT NULL | Question text |
| answer | TEXT | NOT NULL | Answer text |
| category | VARCHAR(100) | NULL | Category (mass, sacraments) |
| keywords | JSON | NULL | Keywords array for matching |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| usage_count | INT | DEFAULT 0 | Usage counter |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category, is_active, usage_count)

**Features**:
- JSON keywords for intelligent matching
- Usage tracking for analytics
- Category-based organization

---

#### 📋 Table: `chatbot_faq_categories`
**Purpose**: FAQ categorization

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| description | TEXT | NULL | Description |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Display color |
| display_order | INT | DEFAULT 0 | Sort order |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

---

### 7. Facility Management

#### 📋 Table: `rooms`
**Purpose**: Room/facility information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Room ID |
| name | VARCHAR(255) | NOT NULL | Room name |
| capacity | INT | NOT NULL | Maximum capacity |
| location | VARCHAR(255) | NOT NULL | Location description |
| facilities | JSON | NULL | Facilities array |
| photo_url | VARCHAR(500) | NULL | Room photo |
| requires_approval | BOOLEAN | DEFAULT TRUE | Approval needed |
| allowed_categories | JSON | NULL | Allowed user categories |
| is_active | BOOLEAN | DEFAULT TRUE | Availability |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (is_active)

**JSON Fields**:
- `facilities`: ["Proyektor", "AC", "Sound System", "WiFi"]
- `allowed_categories`: ["PARISH_COUNCIL", "CATEGORICAL_GROUP"]

---

#### 📋 Table: `bookings`
**Purpose**: Room reservation system

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Booking ID |
| room_id | INT | FK → rooms(id) | Room reference |
| user_id | INT | FK → users(id) | User making booking |
| event_name | VARCHAR(500) | NOT NULL | Event name |
| start_time | TIMESTAMP | NOT NULL | Start date/time |
| end_time | TIMESTAMP | NOT NULL | End date/time |
| status | VARCHAR(50) | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED, CANCELLED |
| rejection_reason | TEXT | NULL | Rejection explanation |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (room_id, user_id, status, start_time, end_time)

**Workflow**:
1. User submits booking → PENDING
2. Admin reviews → APPROVED or REJECTED
3. User can CANCEL approved bookings

---

#### 📋 Table: `user_categories`
**Purpose**: User category definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Category ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | System name |
| display_name | VARCHAR(255) | NOT NULL | Display name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| display_order | INT | DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Sample Categories**:
```sql
'PARISH_COUNCIL' - Dewan Paroki
'CATEGORICAL_GROUP' - Kelompok Kategorial
'REGION' - Wilayah
'COMMUNITY' - Lingkungan
```

---

### 8. UI & Configuration

#### 📋 Table: `hero_themes`
**Purpose**: Homepage hero section themes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Theme ID |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Theme name |
| image_path | VARCHAR(500) | NOT NULL | Image file path |
| is_active | BOOLEAN | DEFAULT FALSE | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Business Rule**: Only one theme can be active at a time

---

### 9. Analytics & Logging

#### 📋 Table: `search_logs`
**Purpose**: Search activity tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Log ID |
| query | VARCHAR(500) | NOT NULL | Search query |
| results_count | INT | DEFAULT 0 | Number of results |
| user_id | INT | NULL | User ID (if logged in) |
| ip_address | VARCHAR(45) | NULL | Client IP |
| user_agent | TEXT | NULL | Browser user agent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Search timestamp |

**Analytics Use**:
- Popular search terms
- Search performance metrics
- User behavior analysis

---

#### 📋 Table: `news_interactions`
**Purpose**: News engagement tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Interaction ID |
| news_id | INT | FK → news(id) | News reference |
| user_id | INT | NULL | User ID (if logged in) |
| interaction_type | VARCHAR(50) | NOT NULL | like, view, share |
| ip_address | VARCHAR(45) | NULL | Client IP |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Interaction timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (news_id, interaction_type)
- UNIQUE (news_id, user_id, interaction_type) - Prevent duplicate likes

---

#### 📋 Table: `article_interactions`
**Purpose**: Article engagement tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Interaction ID |
| article_id | INT | FK → articles(id) | Article reference |
| user_id | INT | NULL | User ID (if logged in) |
| interaction_type | VARCHAR(50) | NOT NULL | like, view, share |
| ip_address | VARCHAR(45) | NULL | Client IP |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Interaction timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (article_id, interaction_type)
- UNIQUE (article_id, user_id, interaction_type)

---

## 🔍 Full-Text Search Indexes

Full-text search enabled on content-heavy tables:

### Articles
```sql
ALTER TABLE articles ADD FULLTEXT INDEX ft_articles_search (title, excerpt, content);
```

### News
```sql
ALTER TABLE news ADD FULLTEXT INDEX ft_news_search (title, excerpt, content);
```

### Agendas
```sql
ALTER TABLE agendas ADD FULLTEXT INDEX ft_agendas_search (title, description);
```

### Documents
```sql
ALTER TABLE documents ADD FULLTEXT INDEX ft_documents_search (title, description);
```

**Usage**:
```sql
SELECT * FROM articles 
WHERE MATCH(title, excerpt, content) AGAINST('pencarian' IN NATURAL LANGUAGE MODE);
```

---

## 🔗 Entity Relationships Diagram (ERD)

### Key Relationships:

```
users ──┬─→ roles (role_id)
        ├─→ bookings (user_id)
        ├─→ documents (uploaded_by)
        └─→ sessions (user_id)

roles ──→ role_permissions ──→ permissions

articles ──┬─→ article_category_relations ──→ article_categories
           └─→ article_interactions

news ──┬─→ news_category_relations ──→ article_categories
       └─→ news_interactions

gallery_albums ──┬─→ gallery_categories (category_id)
                 └─→ gallery_photos (album_id)

agendas ──→ agenda_categories (category_id)

liturgy_schedules ──→ liturgy_types (liturgy_type_id)

lingkungan ──→ wilayah (wilayah_id)

bookings ──┬─→ rooms (room_id)
           └─→ users (user_id)

documents ──→ document_categories (category_id)

chatbot_faqs ──→ chatbot_faq_categories (category_id)

devotions ──→ devotion_types (devotion_type_id)

parish_statistics_log ──┬─→ parish_statistics (statistic_id)
                        └─→ users (changed_by)
```

---

## 🛠️ Database Migrations

Migrations stored in two locations:

### `/migrations/` (Root level)
- `002_create_search_logs.sql`
- `003_add_news_social_features.sql`
- `004_add_articles_social_features.sql`
- `005_add_thumbnails_to_news_articles.sql`
- `006_create_pastors_table.sql`
- `010_create_pastors_table.sql`
- `011_add_position_type_to_pastors.sql`
- `012_create_wilayah_lingkungan_tables.sql`
- `create_devotions_table.sql`

### `/server/database/migrations/`
- `001_add_fulltext_search.sql`
- `002_add_fulltext_documents.sql`
- `006_create_parish_statistics.sql`
- `006_create_church_announcements.sql`

**Migration Strategy**: Incremental migrations with rollback capability

---

## 🔐 Security & Best Practices

### Authentication
- ✅ Bcrypt password hashing
- ✅ JWT token-based auth
- ✅ Session management with expiration
- ✅ RBAC with granular permissions

### Data Validation
- ✅ NOT NULL constraints on required fields
- ✅ UNIQUE constraints on identifiers (email, username, slug)
- ✅ FOREIGN KEY constraints with CASCADE rules
- ✅ ENUM types for status fields

### Performance
- ✅ Strategic indexes on frequently queried columns
- ✅ Composite indexes for multi-column queries
- ✅ Full-text indexes for search functionality
- ✅ ON UPDATE CURRENT_TIMESTAMP for audit trails

### Backup & Recovery
- ✅ Database backup API: `/api/admin/backup/database`
- ✅ SQL dump format with CREATE TABLE + INSERT statements
- ✅ Timestamp-based backup filenames
- ✅ Admin UI for one-click backup

---

## 📊 Database Statistics

### Total Tables: 40+
- Authentication: 5 tables
- Content: 8 tables
- Events: 8 tables
- Gallery: 3 tables
- Organization: 5 tables
- Communication: 3 tables
- Facilities: 3 tables
- UI/Config: 2 tables
- Analytics: 3 tables

### Storage Estimates
- Small tables (< 1000 rows): user_categories, roles, permissions
- Medium tables (1000-10000 rows): articles, news, agendas, pastors
- Large tables (> 10000 rows): search_logs, article_interactions, sessions
- Media-heavy: gallery_photos, documents

---

## 🔧 Database Connection

### Configuration
```javascript
// server/database/db.ts (inferred)
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'stpaulus_cms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
```

### Usage Pattern
```javascript
// Using mysql2 ResultSetHeader
const [result] = await pool.execute(sql, params)
const insertId = result.insertId  // NOT lastInsertRowid
```

---

## 📝 Maintenance Tasks

### Regular Maintenance
- **Daily**: Backup database (automated recommended)
- **Weekly**: Review search_logs and clean old data
- **Monthly**: Optimize tables with high write activity
- **Quarterly**: Review and archive old interactions/logs

### Monitoring
- Monitor connection pool usage
- Track slow queries (enable slow query log)
- Review table sizes and growth trends
- Monitor index effectiveness

### Optimization
```sql
-- Analyze tables
ANALYZE TABLE articles, news, agendas;

-- Optimize tables
OPTIMIZE TABLE search_logs, article_interactions;

-- Check index usage
SHOW INDEX FROM articles;
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: `lastInsertRowid` error
- **Cause**: SQLite syntax used instead of MySQL
- **Fix**: Use `result.insertId` for mysql2 package

**Issue**: Connection pool exhausted
- **Cause**: Too many concurrent connections
- **Fix**: Increase `connectionLimit` or review query efficiency

**Issue**: Slow full-text search
- **Cause**: Missing or ineffective FULLTEXT index
- **Fix**: Rebuild FULLTEXT indexes

**Issue**: Duplicate key errors on interactions
- **Cause**: User attempting multiple likes
- **Fix**: Enforce UNIQUE constraint on (entity_id, user_id, type)

---

## 🚀 Future Enhancements

### Planned Features
1. **Scheduled Backups**: Cron job with cloud storage
2. **Analytics Dashboard**: Real-time statistics
3. **Media Optimization**: Image compression and CDN
4. **Multi-language**: i18n support in content tables
5. **Versioning**: Content version history
6. **Notifications**: Push notifications table
7. **Comments**: User commenting system
8. **Tags**: Tagging system for articles/news

### Scalability Considerations
- Read replicas for high-traffic queries
- Redis cache for frequently accessed data
- CDN for media files
- Elasticsearch for advanced search

---

## 📚 Related Documentation

- **DATABASE_BACKUP_DOCUMENTATION.md** - Backup system specs
- **schema-mysql.sql** - Complete schema definition
- **migrations/** - Migration history
- **API Documentation** - API endpoints reference

---

## 📞 Support & Contact

**Database Administrator**: [Contact Info]
**Last Updated**: February 11, 2026
**Schema Version**: 3.0
**Database Status**: ✅ Production Ready

---

**IMPORTANT**: Always backup database before running migrations or making schema changes!
