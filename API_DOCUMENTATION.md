# 📚 API Documentation - St. Paulus CMS

**Generated:** February 12, 2026  
**Project:** St. Paulus Church Management System  
**Framework:** Nuxt 3 + H3 Server  
**Database:** MySQL 8.4.8

---

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication System](#authentication-system)
3. [Public APIs](#public-apis)
4. [Admin APIs](#admin-apis)
5. [Permission Matrix](#permission-matrix)
6. [Error Handling](#error-handling)
7. [Security Features](#security-features)

---

## 🌐 API Overview

### Architecture
- **Framework:** Nuxt 3 H3 Server Handlers
- **Authentication:** JWT (Access Token: 1h, Refresh Token: 7d)
- **Authorization:** Role-Based Access Control (RBAC)
- **Database:** MySQL with prepared statements

### Base URLs
- **Public API:** `/api/*`
- **Admin API:** `/api/admin/*`
- **Auth API:** `/api/auth/*` (public users) & `/api/admin/login` (admin users)

### Response Format
```json
{
  "data": {},
  "message": "Success",
  "statusCode": 200
}
```

### Error Format
```json
{
  "statusCode": 400,
  "statusMessage": "Error description"
}
```

---

## 🔐 Authentication System

### 1. User Login (Public Booking System)
**Endpoint:** `POST /api/auth/login`

**Purpose:** Login untuk user biasa (booking ruangan)

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "role_id": null,
    "permissions": []
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Security Rules:**
- ✅ Users dengan `role_id = NULL` atau `role_id = 0`
- ❌ Admin users (`role_id > 0`) **tidak dapat login** via endpoint ini
- 🔒 Rate limiting: 5 attempts per IP per 15 minutes

**File:** [server/api/auth/login.post.ts](server/api/auth/login.post.ts)

---

### 2. Admin Login
**Endpoint:** `POST /api/admin/login`

**Purpose:** Login untuk admin (RBAC users)

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin123",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "super_admin",
    "role_id": 1,
    "permissions": ["manage_users", "manage_articles", ...]
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Security Rules:**
- ✅ Users dengan `role_id > 0` (assigned to roles table)
- ❌ Regular users (`role_id = NULL`) **tidak dapat login** via endpoint ini
- 🔒 Rate limiting: 5 attempts per IP per 15 minutes
- 📝 Audit logging: Login attempts dicatat ke database

**File:** [server/api/admin/login.post.ts](server/api/admin/login.post.ts)

---

### 3. Token Refresh
**Endpoint:** `POST /api/auth/refresh`

**Purpose:** Refresh expired access token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**File:** [server/api/auth/refresh.post.ts](server/api/auth/refresh.post.ts)

---

### 4. Authentication Middleware

#### Public API Middleware
- **Path:** [server/middleware/admin-auth.ts](server/middleware/admin-auth.ts)
- **Scope:** Semua `/api/admin/*` routes (kecuali `/api/admin/login`)
- **Actions:**
  1. Verify JWT token dari header `Authorization: Bearer <token>`
  2. Extract user info: `userId`, `role`
  3. Load user permissions dari database
  4. Simpan ke `event.context.auth`

#### Rate Limiting Middleware
- **Path:** [server/middleware/rateLimit.ts](server/middleware/rateLimit.ts)
- **Scope:** Login endpoints
- **Limits:** 5 attempts per IP per 15 minutes
- **Action:** Block IP dengan 429 status jika exceeded

---

## 🌍 Public APIs

> **No authentication required** untuk endpoints berikut

### 1. Articles (Artikel)

#### Get All Published Articles
```
GET /api/artikel
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Artikel Title",
    "slug": "artikel-title",
    "excerpt": "Short description",
    "content": "Full HTML content",
    "author": "Author Name",
    "image": "/uploads/article.jpg",
    "status": "published",
    "published_at": "2026-01-15 10:00:00",
    "created_at": "2026-01-15 10:00:00",
    "updated_at": "2026-01-15 10:00:00",
    "categories": [
      { "id": 1, "name": "Renungan", "slug": "renungan" }
    ],
    "views": 150,
    "likes_count": 25,
    "liked_by_user": false
  }
]
```

**Features:**
- ✅ Cache-Control: `no-store` (always fresh)
- ✅ Status filter: `published` only
- ✅ Categories via JOIN
- ✅ Social metrics: views, likes

**File:** [server/api/artikel.get.ts](server/api/artikel.get.ts)

---

#### Get Article by ID
```
GET /api/articles/[id]
```

**Features:**
- ✅ View counter increment
- ✅ Related articles (same categories)
- ✅ User like status (if authenticated)

**File:** [server/api/articles/[id]/index.get.ts](server/api/articles/%5Bid%5D/index.get.ts)

---

#### Like/Unlike Article
```
POST /api/articles/[id]/like
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "success": true,
  "action": "liked",
  "likes_count": 26
}
```

**File:** [server/api/articles/[id]/like.post.ts](server/api/articles/%5Bid%5D/like.post.ts)

---

### 2. News (Berita)

#### Get All Published News
```
GET /api/berita
```

**Response:** Similar structure to articles

**Features:**
- ✅ Published only
- ✅ Categories support
- ✅ Social features: views, likes

**File:** [server/api/berita.get.ts](server/api/berita.get.ts)

---

#### Get News by ID
```
GET /api/news/[id]
```

**Features:** Same as articles (view counter, related news, likes)

**File:** [server/api/news/[id]/index.get.ts](server/api/news/%5Bid%5D/index.get.ts)

---

### 3. Agenda

#### Get All Agendas
```
GET /api/agenda
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Misa Minggu",
    "description": "Misa Minggu Biasa",
    "start_date": "2026-02-16",
    "end_date": "2026-02-16",
    "location": "Gereja St. Paulus",
    "color": "#FF5733",
    "created_at": "2026-01-15 10:00:00"
  }
]
```

**File:** [server/api/agenda.get.ts](server/api/agenda.get.ts)

---

### 4. Gallery (Galeri)

#### Get All Gallery Albums
```
GET /api/galeri
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Paskah 2026",
    "description": "Perayaan Paskah",
    "thumbnail": "/uploads/gallery/thumb.jpg",
    "category_id": 1,
    "category_name": "Perayaan",
    "photo_count": 25,
    "created_at": "2026-01-15 10:00:00"
  }
]
```

**File:** [server/api/galeri.get.ts](server/api/galeri.get.ts)

---

### 5. Pastors

#### Get All Pastors
```
GET /api/pastors
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Rm. John Doe",
    "title": "Pastor Paroki",
    "bio": "Biography text",
    "photo": "/uploads/pastors/pastor.jpg",
    "order_position": 1,
    "is_active": true
  }
]
```

**File:** [server/api/pastors.get.ts](server/api/pastors.get.ts)

---

### 6. Bookings (Public)

#### Create Booking
```
POST /api/bookings
```

**Authentication:** Required (JWT - regular users only)

**Request Body:**
```json
{
  "room_id": 1,
  "event_name": "Pertemuan RT",
  "start_time": "2026-02-20T14:00:00",
  "end_time": "2026-02-20T16:00:00"
}
```

**Response:**
```json
{
  "id": 123,
  "message": "Booking berhasil dibuat"
}
```

**Security Rules:**
- ✅ Regular users only (`role_id = NULL`)
- ❌ Admin users **cannot book** via public endpoint
- ✅ Room availability check
- ✅ User category validation (sesuai `allowed_categories` ruangan)
- ✅ Time validation (tidak boleh masa lalu)
- ✅ Conflict detection

**File:** [server/api/bookings.post.ts](server/api/bookings.post.ts)

---

### 7. Rooms

#### Get Available Rooms
```
GET /api/rooms
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Aula Besar",
    "description": "Untuk acara besar",
    "capacity": 200,
    "facilities": ["projector", "ac", "sound_system"],
    "allowed_categories": ["lingkungan", "wilayah"],
    "is_active": true,
    "image": "/uploads/rooms/aula.jpg"
  }
]
```

**File:** [server/api/rooms.get.ts](server/api/rooms.get.ts)

---

#### Check Room Availability
```
GET /api/rooms-availability?room_id=1&start_time=2026-02-20T14:00:00&end_time=2026-02-20T16:00:00
```

**Response:**
```json
{
  "available": true,
  "conflicting_bookings": []
}
```

**File:** [server/api/rooms-availability.get.ts](server/api/rooms-availability.get.ts)

---

### 8. Documents

#### Get All Documents
```
GET /api/documents
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Bulletin Januari 2026",
    "description": "Bulletin bulanan",
    "file_path": "/uploads/documents/bulletin.pdf",
    "file_size": 2048576,
    "category_id": 1,
    "category_name": "Bulletin",
    "upload_date": "2026-01-15 10:00:00"
  }
]
```

**File:** [server/api/documents.get.ts](server/api/documents.get.ts)

---

### 9. Search

#### Global Search
```
GET /api/search?q=keyword
```

**Search Scope:**
- Articles (title, excerpt, content)
- News (title, excerpt)
- Agendas (title, description)
- Gallery albums (title, description)

**Response:**
```json
{
  "query": "keyword",
  "results": {
    "articles": [...],
    "news": [...],
    "agendas": [...],
    "gallery": [...]
  },
  "total": 15
}
```

**Features:**
- ✅ Full-text search
- ✅ Search logging untuk analytics

**File:** [server/api/search.get.ts](server/api/search.get.ts)

---

### 10. Other Public APIs

| Endpoint | Method | Description | File |
|----------|--------|-------------|------|
| `/api/church-announcements` | GET | Pengumuman gereja | [church-announcements.get.ts](server/api/church-announcements.get.ts) |
| `/api/devotions` | GET | Renungan harian | [devotions.get.ts](server/api/devotions.get.ts) |
| `/api/liturgy-schedules` | GET | Jadwal liturgi | [liturgy-schedules.get.ts](server/api/liturgy-schedules.get.ts) |
| `/api/regular-mass-schedules` | GET | Jadwal misa rutin | [regular-mass-schedules.get.ts](server/api/regular-mass-schedules.get.ts) |
| `/api/parish-statistics` | GET | Statistik umat | [parish-statistics.get.ts](server/api/parish-statistics.get.ts) |
| `/api/lingkungan` | GET | Data lingkungan | [lingkungan.get.ts](server/api/lingkungan.get.ts) |
| `/api/kronik` | GET | Kronik paroki | [kronik.get.ts](server/api/kronik.get.ts) |
| `/api/chatbot/chat` | POST | Chatbot interaction | [chatbot/chat.post.ts](server/api/chatbot/chat.post.ts) |
| `/api/contact` | POST | Contact form | [contact.post.ts](server/api/contact.post.ts) |

---

## 🔐 Admin APIs

> **Authentication Required:** JWT token di header `Authorization: Bearer <token>`  
> **Authorization:** RBAC permissions checked

### Admin API Structure

```
/api/admin/
├── login.post.ts                 # Admin login
├── me.get.ts                     # Get current admin user
├── stats.get.ts                  # Dashboard statistics
├── articles/                     # Article management (CRUD)
├── news/                         # News management (CRUD)
├── agenda/                       # Agenda management (CRUD)
├── gallery/                      # Gallery management (CRUD)
├── gallery-albums/               # Album management (CRUD)
├── bookings/                     # Booking management (CRUD)
├── rooms/                        # Room management (CRUD)
├── users/                        # User management (CRUD)
├── roles/                        # Role management (Read)
├── pastors/                      # Pastor management (CRUD)
├── documents/                    # Document management (CRUD)
├── liturgy/                      # Liturgy management (CRUD)
├── announcements/                # Announcements management (CRUD)
├── chatbot-faqs/                 # Chatbot FAQ management (CRUD)
├── parish-statistics/            # Parish stats management
└── uploads/                      # File upload handlers
```

---

### CRUD Pattern Example: Articles

#### 1. Get All Articles (Admin)
```
GET /api/admin/articles
```

**Permission:** `manage_articles`

**Response:** All articles (including drafts)

**File:** [server/api/admin/articles/index.get.ts](server/api/admin/articles/index.get.ts)

---

#### 2. Create Article
```
POST /api/admin/articles
```

**Permission:** `manage_articles`

**Request Body:**
```json
{
  "title": "New Article",
  "slug": "new-article",
  "excerpt": "Short description",
  "content": "Full HTML content",
  "author": "Admin Name",
  "status": "published",
  "category_ids": [1, 2],
  "image": "/uploads/article.jpg"
}
```

**Response:**
```json
{
  "id": 10,
  "message": "Article created successfully"
}
```

**Features:**
- ✅ Auto-generate slug if not provided
- ✅ Validate categories exist
- ✅ Set `published_at` if status = published
- ✅ Handle category relations

**File:** [server/api/admin/articles/index.post.ts](server/api/admin/articles/index.post.ts)

---

#### 3. Update Article
```
PUT /api/admin/articles/[id]
```

**Permission:** `manage_articles`

**Request Body:** Same as create (partial updates supported)

**File:** [server/api/admin/articles/[id].put.ts](server/api/admin/articles/%5Bid%5D.put.ts)

---

#### 4. Delete Article
```
DELETE /api/admin/articles/[id]
```

**Permission:** `manage_articles`

**Features:**
- ✅ Cascade delete: category relations, interactions (likes), comments

**File:** [server/api/admin/articles/[id].delete.ts](server/api/admin/articles/%5Bid%5D.delete.ts)

---

### User Management APIs

#### 1. Get All Users
```
GET /api/admin/users
```

**Permission:** `manage_users`

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "full_name": "John Doe",
      "contact_phone": "081234567890",
      "user_category": "lingkungan_A",
      "unit_name": "Lingkungan A",
      "role": "user",
      "role_id": null,
      "role_name": null,
      "role_display_name": null,
      "created_at": "2026-01-15 10:00:00"
    }
  ],
  "total": 31
}
```

**Role-Based Filtering:**
- **Super Admin:** See all users
- **Admin Sekretariat:** See users + admin_komsos
- **Admin Komsos:** See users only (no other admins)

**File:** [server/api/admin/users/index.get.ts](server/api/admin/users/index.get.ts)

---

#### 2. Create User
```
POST /api/admin/users
```

**Permission:** `manage_users`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "full_name": "New User",
  "contact_phone": "081234567890",
  "user_category": "lingkungan_A",
  "unit_name": "Lingkungan A",
  "role_id": null
}
```

**Response:**
```json
{
  "id": 32,
  "message": "User created successfully"
}
```

**Security:**
- ✅ Password hashing dengan bcrypt (10 rounds)
- ✅ Validate role_id exists (if provided)
- ✅ Email uniqueness check

**File:** [server/api/admin/users/index.post.ts](server/api/admin/users/index.post.ts)

---

#### 3. Update User
```
PUT /api/admin/users/[id]
```

**Permission:** `manage_users`

**Request Body:** Same as create (password optional for updates)

**File:** [server/api/admin/users/[id].put.ts](server/api/admin/users/%5Bid%5D.put.ts)

---

#### 4. Delete User
```
DELETE /api/admin/users/[id]
```

**Permission:** `manage_users`

**Security:**
- ❌ Cannot delete yourself
- ✅ Cascade delete: bookings, interactions, comments

**File:** [server/api/admin/users/[id].delete.ts](server/api/admin/users/%5Bid%5D.delete.ts)

---

#### 5. Reset User Password
```
PUT /api/admin/users/[id]/reset-password
```

**Permission:** `manage_users`

**Request Body:**
```json
{
  "new_password": "newSecurePassword123"
}
```

**File:** [server/api/admin/users/[id]/reset-password.put.ts](server/api/admin/users/%5Bid%5D/reset-password.put.ts)

---

### Booking Management APIs

#### 1. Get All Bookings
```
GET /api/admin/bookings
```

**Permission:** `manage_bookings`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 5,
    "username": "user123",
    "user_email": "user@example.com",
    "room_id": 1,
    "room_name": "Aula Besar",
    "event_name": "Pertemuan RT",
    "start_time": "2026-02-20T14:00:00",
    "end_time": "2026-02-20T16:00:00",
    "status": "pending",
    "created_at": "2026-02-15 10:00:00"
  }
]
```

**Status Options:**
- `pending` - Menunggu approval
- `approved` - Disetujui
- `rejected` - Ditolak
- `cancelled` - Dibatalkan user

**File:** [server/api/admin/bookings/index.get.ts](server/api/admin/bookings/index.get.ts)

---

#### 2. Update Booking Status
```
PATCH /api/admin/bookings/[id]
```

**Permission:** `manage_bookings`

**Request Body:**
```json
{
  "status": "approved",
  "reject_reason": "Optional rejection reason"
}
```

**File:** [server/api/admin/bookings/[id].patch.ts](server/api/admin/bookings/%5Bid%5D.patch.ts)

---

#### 3. Get Deleted Bookings
```
GET /api/admin/deleted-bookings
```

**Permission:** `manage_bookings`

**Purpose:** View soft-deleted bookings (audit trail)

**File:** [server/api/admin/deleted-bookings.get.ts](server/api/admin/deleted-bookings.get.ts)

---

### Dashboard Statistics API

```
GET /api/admin/stats
```

**Permission:** ANY of: `manage_articles`, `manage_news`, `manage_gallery`, `manage_agenda`, `manage_users`, `manage_rooms`, `manage_bookings`

**Response:**
```json
{
  "articles": {
    "total": 15,
    "published": 12,
    "draft": 3
  },
  "news": {
    "total": 25,
    "published": 20,
    "draft": 5
  },
  "agendas": {
    "total": 50,
    "upcoming": 20
  },
  "bookings": {
    "total": 100,
    "pending": 5,
    "approved": 80,
    "rejected": 10,
    "cancelled": 5
  },
  "users": {
    "total": 31,
    "admins": 3,
    "regular": 28
  },
  "gallery": {
    "albums": 10,
    "photos": 250
  },
  "storage": {
    "used_mb": 450.5,
    "documents_count": 15
  }
}
```

**File:** [server/api/admin/stats.get.ts](server/api/admin/stats.get.ts)

---

### File Upload API

```
POST /api/admin/uploads/image
```

**Authentication:** Required (JWT)

**Request:** Multipart form-data with `file` field

**Response:**
```json
{
  "url": "/uploads/2026/02/image-123456.jpg",
  "filename": "image-123456.jpg",
  "size": 245678
}
```

**Validation:**
- ✅ Max size: 5MB
- ✅ Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- ✅ File sanitization (remove special chars)
- ✅ Unique filename generation

**File:** [server/api/admin/uploads/image.post.ts](server/api/admin/uploads/image.post.ts)

---

## 🔑 Permission Matrix

### Roles & Permissions

| Permission | Super Admin | Admin Komsos | Admin Sekretariat |
|-----------|-------------|--------------|-------------------|
| `manage_articles` | ✅ | ✅ | ❌ |
| `manage_news` | ✅ | ✅ | ❌ |
| `manage_gallery` | ✅ | ✅ | ❌ |
| `manage_agenda` | ✅ | ❌ | ✅ |
| `manage_users` | ✅ | ❌ | ✅ |
| `manage_roles` | ✅ | ❌ | ❌ |
| `manage_rooms` | ✅ | ❌ | ✅ |
| `manage_bookings` | ✅ | ❌ | ✅ |
| `manage_documents` | ✅ | ✅ | ✅ |
| `manage_pastors` | ✅ | ❌ | ✅ |
| `manage_liturgy` | ✅ | ✅ | ❌ |
| `manage_announcements` | ✅ | ✅ | ❌ |
| `manage_chatbot` | ✅ | ✅ | ❌ |
| `manage_footer_settings` | ✅ | ❌ | ✅ |
| `manage_hero_theme` | ✅ | ✅ | ❌ |
| `manage_parish_statistics` | ✅ | ❌ | ✅ |
| `view_audit_logs` | ✅ | ❌ | ❌ |
| `manage_backup` | ✅ | ❌ | ❌ |
| `manage_article_categories` | ✅ | ✅ | ❌ |
| `manage_gallery_categories` | ✅ | ✅ | ❌ |
| `manage_document_categories` | ✅ | ❌ | ✅ |
| `manage_user_categories` | ✅ | ❌ | ✅ |
| `manage_liturgy_schedules` | ✅ | ✅ | ❌ |
| `manage_liturgy_types` | ✅ | ✅ | ❌ |
| `manage_mass_schedules` | ✅ | ❌ | ✅ |
| `manage_devotions` | ✅ | ✅ | ❌ |
| `manage_contact_messages` | ✅ | ❌ | ✅ |
| `manage_pages` | ✅ | ✅ | ✅ |
| `manage_wilayah` | ✅ | ❌ | ✅ |
| `manage_lingkungan` | ✅ | ❌ | ✅ |

**Total Permissions:** 29

**Permission Check Implementation:**
```typescript
// Method 1: Using requirePermission helper
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requirePermission('manage_articles')(event)
  // ... your code
})

// Method 2: Manual check
export default defineEventHandler(async (event) => {
  const authContext = event.context.auth
  if (!authContext?.permissions?.includes('manage_articles')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }
  // ... your code
})
```

**File:** [server/utils/auth.ts](server/utils/auth.ts)

---

## ⚠️ Error Handling

### Standard Error Responses

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "statusMessage": "Validation error: Title is required"
}
```

**Common Causes:**
- Missing required fields
- Invalid data format
- Business logic validation failed

---

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "statusMessage": "Unauthorized"
}
```

**Common Causes:**
- Missing Authorization header
- Invalid JWT token
- Expired access token (use refresh token)

---

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden: Insufficient permissions"
}
```

**Common Causes:**
- User lacks required permission
- Regular user trying to access admin endpoint
- Admin user trying to access public booking endpoint

---

#### 404 Not Found
```json
{
  "statusCode": 404,
  "statusMessage": "Resource not found"
}
```

**Common Causes:**
- Invalid ID in URL parameter
- Resource deleted or never existed

---

#### 409 Conflict
```json
{
  "statusCode": 409,
  "statusMessage": "Booking conflict: Room already booked for this time"
}
```

**Common Causes:**
- Duplicate slug
- Room booking conflict
- Unique constraint violation

---

#### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "statusMessage": "Too many attempts. Please try again later."
}
```

**Common Causes:**
- Rate limit exceeded (login attempts)

---

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "statusMessage": "Internal server error"
}
```

**Common Causes:**
- Database connection failed
- Unhandled exceptions
- Server configuration issues

---

## 🛡️ Security Features

### 1. Authentication
- ✅ JWT tokens (Access: 1h, Refresh: 7d)
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Token expiry validation
- ✅ Refresh token rotation

**Implementation:** [server/utils/auth.ts](server/utils/auth.ts)

---

### 2. Authorization (RBAC)
- ✅ Role-based permissions (29 permissions)
- ✅ Middleware permission checking
- ✅ Granular access control
- ✅ Role hierarchy enforcement

**Implementation:** 
- [server/middleware/admin-auth.ts](server/middleware/admin-auth.ts)
- [server/utils/auth.ts](server/utils/auth.ts) (getUserPermissions)

---

### 3. Rate Limiting
- ✅ Login endpoints: 5 attempts / 15 minutes per IP
- ✅ IP-based tracking
- ✅ Automatic cleanup after time window

**Implementation:** [server/middleware/rateLimit.ts](server/middleware/rateLimit.ts)

---

### 4. Input Validation
- ✅ Required fields validation
- ✅ Data type checking
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention (content sanitization)
- ✅ File upload validation (size, type)

**Pattern:**
```typescript
// Example validation
const { title, content } = body
if (!title || !content) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Title and content are required'
  })
}
```

---

### 5. Database Security
- ✅ Prepared statements (parameterized queries)
- ✅ Connection pooling
- ✅ Error message sanitization (no sensitive info exposure)

**Example:**
```typescript
await runQuery(
  'INSERT INTO articles (title, content) VALUES (?, ?)',
  [title, content]
)
```

**Implementation:** [server/database/db.ts](server/database/db.ts)

---

### 6. Audit Logging
- ✅ Login attempts logged
- ✅ Failed authentication tracked
- ✅ Unauthorized access logged
- ✅ IP address capture

**Implementation:** [server/utils/logger.ts](server/utils/logger.ts)

---

### 7. CORS & Headers
- ✅ CORS configuration
- ✅ Security headers
- ✅ Cache control
- ✅ Content-Type validation

---

### 8. User Separation
- ✅ Regular users (booking system) ≠ Admin users (CMS)
- ✅ Separate login endpoints
- ✅ Cross-login prevention
- ✅ Role enforcement

**Logic:**
```typescript
// Regular users: role_id = NULL
// Admin users: role_id > 0

// In auth/login.post.ts:
if (userDetails && userDetails.role_id && userDetails.role_id > 0) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Akses ditolak. Akun admin tidak dapat digunakan untuk pemesanan ruangan.'
  })
}

// In admin/login.post.ts:
if (!userDetails || !userDetails.role_id || userDetails.role_id === 0) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Akses ditolak. Anda tidak memiliki akses ke panel admin.'
  })
}
```

---

## 📊 API Statistics

### Total Endpoints: ~150+

**Breakdown:**
- Public APIs: ~25
- Admin CRUD APIs: ~120
- Authentication: 3
- Utilities: ~10

### Most Used Endpoints:
1. `GET /api/artikel` - Articles list
2. `GET /api/berita` - News list
3. `GET /api/agenda` - Agendas list
4. `POST /api/bookings` - Create booking
5. `GET /api/admin/stats` - Dashboard stats
6. `POST /api/admin/login` - Admin login

### Database Tables: 40+

**Core Tables:**
- `articles`, `news`, `agendas`
- `users`, `roles`, `permissions`
- `bookings`, `rooms`
- `gallery_albums`, `gallery_photos`
- `documents`, `pastors`

---

## 🔍 Testing Recommendations

### 1. Authentication Testing
- ✅ Test login with valid credentials
- ✅ Test login with invalid credentials
- ✅ Test token expiry
- ✅ Test refresh token flow
- ✅ Test rate limiting (5+ attempts)

### 2. Authorization Testing
- ✅ Test each role's permissions
- ✅ Test cross-role access (should fail)
- ✅ Test regular user accessing admin (should fail)
- ✅ Test admin using public booking (should fail)

### 3. CRUD Testing
- ✅ Create with valid data
- ✅ Create with missing required fields (should fail)
- ✅ Update existing record
- ✅ Update non-existent record (should fail)
- ✅ Delete with cascade (check relations deleted)
- ✅ Delete self-user (should fail for users)

### 4. Booking Testing
- ✅ Book available room
- ✅ Book conflicting time slot (should fail)
- ✅ Book past date (should fail)
- ✅ Book with wrong category (should fail)
- ✅ Admin booking via public API (should fail)

### 5. Security Testing
- ✅ SQL injection attempts
- ✅ XSS injection attempts
- ✅ File upload with invalid types
- ✅ File upload exceeding size limit
- ✅ CSRF token validation

---

## 📝 API Development Guidelines

### 1. Naming Conventions
- **Endpoints:** kebab-case (`/api/user-categories`)
- **Query params:** snake_case (`?user_id=1`)
- **Response keys:** snake_case (`{ user_id: 1 }`)

### 2. Response Structure
```typescript
// Success
return {
  data: result,
  message: 'Operation successful' // optional
}

// Error
throw createError({
  statusCode: 400,
  statusMessage: 'Clear error message'
})
```

### 3. Permission Checking Pattern
```typescript
export default defineEventHandler(async (event) => {
  // 1. Check authentication
  const decoded = requireAuth(event)
  
  // 2. Check permission
  requirePermission('manage_xxx')(event)
  
  // 3. Your logic here
  const body = await readBody(event)
  // ...
})
```

### 4. Database Query Pattern
```typescript
// Use prepared statements ALWAYS
const result = await runQuery(
  'SELECT * FROM table WHERE id = ?',
  [id]
)

// For multiple rows
const rows = await allQuery(
  'SELECT * FROM table WHERE status = ?',
  ['active']
)

// For single row
const row = await getQuery(
  'SELECT * FROM table WHERE id = ?',
  [id]
)
```

### 5. Error Handling Pattern
```typescript
export default defineEventHandler(async (event) => {
  try {
    // Your logic here
    return { success: true }
  } catch (error: any) {
    console.error('[API NAME] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
```

---

## 🚀 Quick Start for API Consumers

### 1. User Login & Booking Flow

```javascript
// Step 1: Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user123',
    password: 'password'
  })
})
const { accessToken, user } = await loginResponse.json()

// Step 2: Get available rooms
const roomsResponse = await fetch('/api/rooms')
const rooms = await roomsResponse.json()

// Step 3: Check availability
const checkResponse = await fetch(
  '/api/rooms-availability?room_id=1&start_time=2026-02-20T14:00:00&end_time=2026-02-20T16:00:00'
)
const { available } = await checkResponse.json()

// Step 4: Create booking if available
if (available) {
  const bookingResponse = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      room_id: 1,
      event_name: 'Pertemuan RT',
      start_time: '2026-02-20T14:00:00',
      end_time: '2026-02-20T16:00:00'
    })
  })
  const booking = await bookingResponse.json()
  console.log('Booking created:', booking.id)
}
```

---

### 2. Admin Login & Article Management Flow

```javascript
// Step 1: Admin Login
const loginResponse = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'adminpass'
  })
})
const { accessToken, user } = await loginResponse.json()

// Step 2: Get dashboard stats
const statsResponse = await fetch('/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
const stats = await statsResponse.json()
console.log('Total articles:', stats.articles.total)

// Step 3: Create article
const articleResponse = await fetch('/api/admin/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'New Article',
    content: '<p>Article content</p>',
    author: user.full_name,
    status: 'published',
    category_ids: [1]
  })
})
const article = await articleResponse.json()
console.log('Article created:', article.id)

// Step 4: Get all articles
const articlesResponse = await fetch('/api/admin/articles', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
const articles = await articlesResponse.json()
```

---

## 📞 Support & Contact

For API issues or questions:
- **Database:** MySQL 8.4.8
- **Framework:** Nuxt 3 with H3 Server
- **Authentication:** JWT
- **Backup Location:** `backup DB/` folder

---

**Last Updated:** February 12, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
