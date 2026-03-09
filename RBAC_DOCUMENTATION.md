# 📋 Dokumentasi RBAC (Role-Based Access Control)
**Project: St. Paulus CMS**  
**Tanggal: 12 Februari 2026**

---

## 📑 Daftar Isi
1. [Arsitektur RBAC](#arsitektur-rbac)
2. [Database Schema](#database-schema)
3. [Roles & Permissions](#roles--permissions)
4. [Implementasi Backend](#implementasi-backend)
5. [Implementasi Frontend](#implementasi-frontend)
6. [Security Flow](#security-flow)
7. [Masalah & Rekomendasi](#masalah--rekomendasi)

---

## 🏗️ Arsitektur RBAC

### Komponen Utama
Project ini menggunakan **3-layer RBAC system**:

```
┌─────────────────┐
│   Frontend UI   │ → Conditional rendering berdasarkan permissions
├─────────────────┤
│   Middleware    │ → Route protection (client & server)
├─────────────────┤
│   Server API    │ → Permission validation di setiap endpoint
└─────────────────┘
```

### Stack Teknologi
- **Backend**: Nuxt 3 + H3 Event Handlers
- **Database**: MySQL 
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Role-Permission mapping

---

## 🗄️ Database Schema

### 1. **Tabel `roles`**
Menyimpan role yang tersedia dalam sistem.

```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,          -- 'super_admin', 'admin_komsos', 'admin_sekretariat'
  display_name VARCHAR(255) NOT NULL,         -- 'Super Admin', 'Admin Komsos', 'Admin Sekretariat'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Current Roles:**
- `id=1`: `super_admin` - Full access
- `id=2`: `admin_komsos` - Communications admin
- `id=3`: `admin_sekretariat` - Secretariat admin

### 2. **Tabel `permissions`**
Menyimpan semua permission yang dapat diberikan.

```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,          -- 'manage_articles', 'manage_gallery', etc.
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Available Permissions:**
- `dashboard` - View dashboard
- `manage_users` - Full user management (Super Admin only)
- `manage_users_komsos_sekretariat` - Limited user management
- `manage_articles` - Article CRUD
- `manage_article_categories` - Article category management
- `manage_news` - News CRUD
- `manage_gallery` - Gallery management
- `manage_gallery_categories` - Gallery category management
- `manage_agenda` - Event/agenda management
- `manage_agenda_categories` - Agenda category management
- `manage_bookings` - Room booking management
- `manage_rooms` - Room management
- `manage_documents` - Document management
- `manage_document_categories` - Document category management
- `manage_chatbot_faqs` - Chatbot FAQ management
- `manage_chatbot_faq_categories` - FAQ category management
- `manage_contact_messages` - Contact form messages
- `manage_footer_settings` - Footer configuration
- `manage_hero_themes` - Hero image themes
- `manage_liturgy_types` - Liturgy type management
- `manage_mass_schedules` - Mass schedule management
- `manage_regular_mass_schedules` - Regular mass schedule
- `manage_pages` - Static pages management
- `manage_content` - General content management
- `manage_roles` - Role management
- `view_stats` - View statistics
- `view_articles` - View articles
- `view_bookings` - View bookings
- `view_agenda` - View agendas
- `view_gallery` - View gallery

### 3. **Tabel `role_permissions`** (Many-to-Many)
Mapping antara roles dan permissions.

```sql
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);
```

### 4. **Tabel `users`**
User table dengan foreign key ke `roles`.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',            -- Legacy field
  role_id INT,                                 -- Foreign key to roles
  full_name VARCHAR(255),
  contact_phone VARCHAR(50),
  user_category VARCHAR(100),
  unit_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles (id)
);
```

---

## 👥 Roles & Permissions

### Permission Matrix

| Permission | Super Admin | Admin Komsos | Admin Sekretariat |
|-----------|-------------|--------------|-------------------|
| **User Management** |
| manage_users | ✅ | ❌ | ❌ |
| manage_users_komsos_sekretariat | ✅ | ✅ | ✅ |
| **Content Management** |
| manage_articles | ✅ | ✅ | ❌ |
| manage_news | ✅ | ✅ | ❌ |
| manage_gallery | ✅ | ✅ | ❌ |
| **Booking & Room** |
| manage_bookings | ✅ | ❌ | ✅ |
| manage_rooms | ✅ | ❌ | ✅ |
| **Documents** |
| manage_documents | ✅ | ❌ | ✅ |
| **Contact & Messages** |
| manage_contact_messages | ✅ | ❌ | ✅ |
| **System Settings** |
| manage_roles | ✅ | ❌ | ❌ |
| manage_pages | ✅ | ❌ | ❌ |
| manage_footer_settings | ✅ | ❌ | ❌ |

### Special Rules

#### Super Admin (`role_id = 1`)
- **All permissions** automatically granted via fallback logic
- Can manage ANY user type
- Hardcoded fallback in `getUserPermissions()` untuk safety

#### Admin Sekretariat (`role_id = 3`)
- Can manage `admin_komsos` and `admin_sekretariat` users only
- Cannot manage `super_admin` users
- Implemented via `requireUserManagementPermission()`

#### Admin Komsos (`role_id = 2`)
- Can manage `admin_komsos` and `admin_sekretariat` users only
- Focus on content & communications

---

## 🔧 Implementasi Backend

### File Structure
```
server/
├── utils/
│   └── auth.ts                      # Core auth & RBAC functions
├── middleware/
│   └── admin-auth.ts                # Global API middleware
└── api/
    └── admin/
        ├── [resource]/              # Protected endpoints
        │   ├── index.get.ts
        │   ├── index.post.ts
        │   └── [id].put.ts
        └── me.get.ts                # Get current user & permissions
```

### Core Functions (`server/utils/auth.ts`)

#### 1. **Token Generation & Verification**
```typescript
// Generate JWT dengan role info
generateAccessToken(userId: number, role: string, username?: string): string
generateRefreshToken(userId: number, role: string, username?: string): string
verifyToken(token: string): any

// Access token: 1 hour
// Refresh token: 7 days
```

#### 2. **Authentication**
```typescript
// Verify JWT dari Authorization header
requireAuth(event: any): decoded_token

// Authenticate user dengan username/password
authenticateUser(username: string, password: string): Promise<AuthResult | null>
```

#### 3. **Permission Retrieval**
```typescript
// Get permissions untuk user berdasarkan role_id
getUserPermissions(user: any): Promise<string[]>

// Super Admin (role_id = 1) → ALL permissions
// Other roles → Query dari role_permissions table
// Fallback: Hardcoded permissions jika DB kosong
```

#### 4. **Authorization Guards**
```typescript
// Check single permission
requirePermission(permission: string): (event: any) => AuthContext

// Special: User management permission check
requireUserManagementPermission(event: any): Promise<AuthContext>
```

### Middleware (`server/middleware/admin-auth.ts`)

**Automatic execution** untuk semua `/api/admin/*` routes (kecuali `/api/admin/login`).

**Flow:**
1. Extract JWT dari Authorization header
2. Verify & decode token
3. Determine `role_id` dari role name
4. Fetch permissions via `getUserPermissions()`
5. Store di `event.context.auth`:
   ```typescript
   event.context.auth = {
     userId: number,
     role: string,
     permissions: string[]
   }
   ```

**Error Handling:**
- 401 jika token invalid/expired
- Continue dengan empty permissions jika permission fetch fails

### API Endpoint Protection

#### Pattern 1: Using `requirePermission()`
```typescript
// server/api/admin/articles/index.post.ts
export default defineEventHandler(async (event) => {
  requireAuth(event)  // Ensure authenticated
  
  // Additional permission check akan dihandle di endpoint logic
  const authContext = event.context.auth
  if (!authContext.permissions.includes('manage_articles')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
  
  // ... handle request
})
```

#### Pattern 2: Manual Permission Check
```typescript
// server/api/admin/user-categories/index.get.ts
export default defineEventHandler(async (event) => {
  const user = event.context.auth
  
  if (!user || !user.permissions?.includes('manage_users')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
  
  // ... handle request
})
```

#### Pattern 3: Special User Management
```typescript
// server/api/admin/users/[id].delete.ts
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  await requireUserManagementPermission(event)  // Special check
  
  // Now safe to proceed with user deletion
  // Admin Sekretariat can only delete admin_komsos/admin_sekretariat
})
```

---

## 💻 Implementasi Frontend

### File Structure
```
composables/
└── useAuth.ts                       # Reactive auth state & helpers

middleware/
└── auth.ts                          # Route protection

pages/
└── admin/
    ├── dashboard.vue                # Permission-based rendering
    ├── users.vue                    # Role-based UI
    └── [resource].vue               # Protected pages
```

### Composable (`composables/useAuth.ts`)

**Global reactive state** using Nuxt's `useState`:

```typescript
const auth = useAuth()

// State
auth.user            // Current user object
auth.permissions     // Array of permission strings
auth.loading         // Loading state
auth.isSuperAdmin    // Computed: role === 'super_admin'
auth.isAdminKomsos   // Computed: role === 'admin_komsos'
auth.isAdminSekretariat // Computed: role === 'admin_sekretariat'

// Methods
auth.fetchUserData(forceRefresh?)  // Fetch user & permissions from API
auth.hasPermission(permission)     // Check single permission
auth.hasAnyPermission([...])       // Check if has ANY of permissions
auth.hasAllPermissions([...])      // Check if has ALL permissions
auth.logout()                      // Clear tokens & state
```

**Usage Example:**
```vue
<script setup>
const auth = useAuth()

onMounted(async () => {
  await auth.fetchUserData()
})

const canManageArticles = computed(() => 
  auth.hasPermission('manage_articles')
)
</script>

<template>
  <div v-if="canManageArticles">
    <button>Create Article</button>
  </div>
</template>
```

### Route Middleware (`middleware/auth.ts`)

**Automatic route protection** with caching mechanism.

**Features:**
1. **Token Validation**: Check `admin_access_token` existence
2. **User Data Caching**: 5-second cache untuk menghindari repeated API calls
3. **Permission Mapping**: Route → Required permissions
4. **Access Control**: Auto-redirect ke dashboard jika no access

**Route Permission Map:**
```typescript
const routePermissions: Record<string, string[]> = {
  '/admin/dashboard': [],                          // Any authenticated admin
  '/admin/articles': ['manage_articles'],
  '/admin/news': ['manage_news'],
  '/admin/gallery': ['manage_gallery'],
  '/admin/users': ['manage_users'],
  '/admin/bookings': ['manage_bookings'],
  // ... etc
}
```

**Access Logic:**
```typescript
const hasAccess = 
  requiredPermissions.length === 0 ||                    // No permission required
  requiredPermissions.some(p => userPermissions.includes(p))  // Has at least one
```

### UI Components

#### Dashboard Permission-Based Sections
```vue
<!-- pages/admin/dashboard.vue -->
<template>
  <!-- Super Admin Only Section -->
  <div v-if="auth.isSuperAdmin.value" class="bg-gray-50 p-4 rounded-lg">
    <h3>System Settings</h3>
    <!-- Only visible to Super Admin -->
  </div>

  <!-- Articles Section -->
  <div v-if="canViewArticles">
    <h3>Recent Articles</h3>
    <!-- Visible if has view_articles OR manage_content -->
  </div>
</template>

<script setup>
const auth = useAuth()

const canViewArticles = computed(() => 
  auth.hasPermission('view_articles') || 
  auth.hasPermission('manage_content')
)
</script>
```

#### User Management UI
```vue
<!-- pages/admin/users.vue -->
<template>
  <!-- Create Super Admin (Super Admin only) -->
  <button v-if="isSuperAdmin" @click="createSuperAdmin">
    Create Super Admin
  </button>

  <!-- Create Other Admins (Admin Sekretariat can create) -->
  <button v-if="!isSuperAdmin" @click="createRegularAdmin">
    Create Admin
  </button>
</template>

<script setup>
const auth = useAuth()
const isSuperAdmin = computed(() => auth.isSuperAdmin.value)
</script>
```

---

## 🔒 Security Flow

### 1. Login Flow
```
User enters credentials
     ↓
POST /api/admin/login
     ↓
authenticateUser(username, password)
     ↓
Generate JWT tokens (access + refresh)
     ↓
Return: { user, accessToken, refreshToken }
     ↓
Store tokens in localStorage
```

### 2. Protected Request Flow
```
Frontend: fetch('/api/admin/resource')
  + Authorization: Bearer {token}
     ↓
Server Middleware: admin-auth.ts
     ↓
requireAuth(event) → Verify JWT
     ↓
getUserPermissions(user)
     ↓
Store in event.context.auth
     ↓
API Handler: Check permissions
     ↓
- ✅ Has permission → Process request
- ❌ No permission → 403 Forbidden
```

### 3. Route Navigation Flow
```
Navigate to /admin/articles
     ↓
Middleware: auth.ts
     ↓
Check token existence
     ↓
Fetch user permissions (with cache)
     ↓
Check route requirements
     ↓
- ✅ Has access → Allow navigation
- ❌ No access → Redirect to dashboard
- 🔴 No token → Redirect to login
```

---

## ⚠️ Masalah & Rekomendasi

### 🔴 Critical Issues

#### 1. **Hardcoded Role ID Mapping**
**Lokasi:** `server/middleware/admin-auth.ts` line 23-29

```typescript
// PROBLEM: Hardcoded mapping
if (decoded.role === 'super_admin') {
  user.role_id = 1
} else if (decoded.role === 'admin_komsos') {
  user.role_id = 2
} else if (decoded.role === 'admin_sekretariat') {
  user.role_id = 3
}
```

**Risiko:**
- Jika role_id di database berubah, code akan break
- Tidak scalable untuk role baru

**Rekomendasi:**
```typescript
// Store role_id directly in JWT payload
const payload = { 
  userId, 
  role,
  role_id  // Add this
}

// Or query from database
const roleData = await getQuery(
  'SELECT id FROM roles WHERE name = ?', 
  [decoded.role]
)
user.role_id = roleData?.id
```

#### 2. **Inconsistent Permission Checking**
**Problem:** 3 different patterns digunakan di berbagai endpoints:
- `requirePermission()` function
- `event.context.auth` manual check
- `requireUserManagementPermission()` special case

**Rekomendasi:**
Standardize ke satu pattern:
```typescript
// Create unified helper
export const checkPermission = (event: any, permission: string) => {
  const auth = event.context.auth
  if (!auth?.permissions?.includes(permission)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return auth
}

// Usage
export default defineEventHandler(async (event) => {
  checkPermission(event, 'manage_articles')
  // ... continue
})
```

#### 3. **Missing Database Seeder**
**Problem:** Tidak ada script untuk populate initial roles & permissions

**Rekomendasi:**
Buat seeder script:
```typescript
// server/database/seeders/rbac-seeder.ts
export async function seedRBAC() {
  // 1. Insert roles
  await insertQuery('INSERT INTO roles (name, display_name) VALUES (?, ?)', [
    'super_admin', 'Super Admin'
  ])
  
  // 2. Insert permissions
  const permissions = [
    'manage_articles',
    'manage_news',
    // ... all permissions
  ]
  
  // 3. Map role_permissions
  // Super Admin gets all
}
```

### 🟡 Medium Issues

#### 4. **No Audit Logging**
- Tidak ada tracking siapa melakukan action apa
- Sulit untuk security investigation

**Rekomendasi:**
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100),          -- 'create', 'update', 'delete'
  resource_type VARCHAR(100),   -- 'article', 'user', etc
  resource_id INT,
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **Token Refresh Not Implemented**
- Access token expires in 1 hour
- No automatic refresh mechanism
- User harus login ulang

**Rekomendasi:**
Implement refresh token flow:
```typescript
// composables/useAuth.ts
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('admin_refresh_token')
  const response = await $fetch('/api/admin/refresh', {
    method: 'POST',
    body: { refreshToken }
  })
  localStorage.setItem('admin_access_token', response.accessToken)
}
```

#### 6. **Permission Cache Stale Risk**
- Frontend cache 5 seconds
- Jika permissions berubah, user tidak langsung tahu

**Rekomendasi:**
- Add version/timestamp ke JWT payload
- Implement permission change notification
- Force refresh on critical actions

### 🟢 Minor Issues

#### 7. **Console Logs di Production**
Banyak `console.log` untuk debugging di middleware & auth

**Rekomendasi:**
```typescript
const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  console.log('[Auth] Token decoded:', decoded)
}
```

#### 8. **Error Messages Too Generic**
User tidak tahu kenapa forbidden

**Rekomendasi:**
```typescript
throw createError({
  statusCode: 403,
  statusMessage: `Forbidden: Requires '${permission}' permission`
})
```

---

## 📊 Permission Coverage Analysis

### Endpoints with Protection ✅
- `/api/admin/articles/*` - requireAuth
- `/api/admin/users/*` - requireAuth + special user management
- `/api/admin/pages/*` - requirePermission('manage_pages')
- `/api/admin/bookings/*` - requireAuth + permission check
- `/api/admin/documents/*` - requireAuth

### Endpoints WITHOUT Explicit Protection ⚠️
Perlu diverifikasi apakah ini intentional:
- `/api/admin/stats.get.ts` - Mungkin perlu `view_stats` check
- Public API routes (`/api/articles`, `/api/news`, etc.) - OK, meant to be public

---

## 🔍 Testing Checklist

### Backend Tests
- [ ] Super Admin has all permissions
- [ ] Admin Komsos cannot access booking management
- [ ] Admin Sekretariat cannot create articles
- [ ] Admin Sekretariat cannot delete Super Admin users
- [ ] Invalid token returns 401
- [ ] Missing permission returns 403
- [ ] Token expiry triggers re-login

### Frontend Tests
- [ ] Route middleware redirects correctly
- [ ] UI hides buttons without permissions
- [ ] Permission cache works (5-second window)
- [ ] Logout clears all state
- [ ] Role-based dashboard sections visible/hidden

### Integration Tests
- [ ] Login → Dashboard → Protected page flow
- [ ] Permission change reflects after cache expires
- [ ] Multiple tabs share auth state
- [ ] Token refresh (if implemented)

---

## 📚 Related Files Reference

### Backend
- `server/utils/auth.ts` - Core RBAC logic
- `server/middleware/admin-auth.ts` - Global API protection
- `server/database/schema-mysql.sql` - Database schema
- `server/api/admin/me.get.ts` - Get current user permissions

### Frontend
- `composables/useAuth.ts` - Auth state management
- `middleware/auth.ts` - Route protection
- `pages/admin/dashboard.vue` - Permission-based UI example
- `pages/admin/users.vue` - Role-based management

### Config
- `.env` - JWT_SECRET configuration
- `nuxt.config.ts` - Runtime config for JWT

---

## 🎯 Best Practices Summary

### ✅ DO
- Always use `requireAuth()` untuk protected endpoints
- Check permissions di server-side, tidak cukup di client
- Use `event.context.auth` untuk akses user & permissions
- Cache user permissions dengan reasonable TTL
- Log auth failures untuk security monitoring

### ❌ DON'T
- Trust role dari JWT tanpa verification
- Skip permission check karena "user sudah authenticated"
- Hardcode role IDs atau permission names
- Return detailed error messages yang expose internal logic
- Store sensitive data di JWT payload

---

## 📝 Changelog

### Version 1.0 (Current)
- ✅ Basic RBAC with 3 roles
- ✅ 25+ permissions defined
- ✅ Server-side protection via middleware
- ✅ Client-side route guards
- ✅ Composable for permission checks
- ✅ JWT authentication

### Planned Improvements
- [ ] Token refresh mechanism
- [ ] Audit logging
- [ ] Permission seeder
- [ ] Standardized permission checking
- [ ] Admin UI for role/permission management
- [ ] Unit tests for RBAC logic

---

**Dokumentasi ini dibuat berdasarkan analisis code pada 12 Februari 2026.**  
**Untuk pertanyaan atau update, hubungi development team.**
