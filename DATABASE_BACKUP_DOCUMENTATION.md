# Database Backup Feature - Documentation

## 📁 File Locations

### Backend (API)
- **Path**: `server/api/admin/backup/database.get.ts`
- **Purpose**: Generate SQL dump dari seluruh database
- **Auth**: Requires admin authentication + manage_content permission

### Frontend (Admin Page)
- **Path**: `pages/admin/backup.vue`
- **Route**: `/admin/backup`
- **Layout**: Admin layout dengan sidebar

### Menu Integration
- **File**: `layouts/admin.vue`
- **Section**: Pengaturan (Settings) group
- **Permissions**: `backup: true` untuk super_admin dan admin_sekretariat

---

## 🎨 UI Design Specification

### Color Scheme
- **Primary**: Blue (#3B82F6 - blue-600)
- **Primary Hover**: Dark Blue (#2563EB - blue-700)
- **Success**: Green (#10B981 - green-400/500)
- **Error**: Red (#EF4444 - red-400/500)
- **Background**: White/Gray (#F9FAFB - gray-50)
- **Border**: Gray (#E5E7EB - gray-200)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Database Backup                                 │
│  Subtitle text                                   │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │ [Icon]  Backup Database                  │   │
│  │         Description text                 │   │
│  │                                           │   │
│  │  ┌───────────┐  ┌───────────┐           │   │
│  │  │ Database  │  │ Last      │           │   │
│  │  │ Name      │  │ Backup    │           │   │
│  │  └───────────┘  └───────────┘           │   │
│  │                                           │   │
│  │  [Download Backup Button]                │   │
│  │                                           │   │
│  │  [Success/Error Message]                 │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ [Info Icon] Cara Restore Backup          │   │
│  │ Code snippet dengan command              │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Component Spacing
- **Container**: `p-6` (24px padding)
- **Card**: `p-6` (24px padding)
- **Elements Gap**: `mt-4`, `mt-6` (16px, 24px)
- **Button Size**: `px-4 py-2` (16px x 8px)
- **Max Width**: `max-w-2xl` (672px)

### Icons Used
- **Database Icon**: SVG dari Heroicons (outline)
- **Download Icon**: SVG dari Heroicons (outline)
- **Success Icon**: Check circle (solid)
- **Error Icon**: X circle (solid)
- **Info Icon**: Information circle (solid)

### Button States
1. **Normal**:
   - Background: `bg-blue-600`
   - Text: `text-white`
   - Border: `border-transparent`
   - Shadow: `shadow-sm`

2. **Hover**:
   - Background: `bg-blue-700`
   - Transform: None

3. **Disabled**:
   - Opacity: `opacity-50`
   - Cursor: `cursor-not-allowed`

4. **Loading**:
   - Icon: Spinning circle animation
   - Text: "Membuat Backup..."

### Message Cards
1. **Success Message**:
   - Background: `bg-green-50`
   - Border: None
   - Icon: Green check circle
   - Text: `text-green-800`
   - Auto-dismiss: 5 seconds

2. **Error Message**:
   - Background: `bg-red-50`
   - Border: None
   - Icon: Red X circle
   - Text: `text-red-800`
   - Auto-dismiss: 10 seconds

### Info Section
- Background: `bg-blue-50`
- Border: `rounded-lg`
- Padding: `p-4`
- Code block: `bg-blue-100` with `rounded px-3 py-2`

---

## 🔧 Technical Implementation

### Data Structure
```typescript
interface BackupData {
  dbName: string
  lastBackup: string
  isDownloading: boolean
  successMessage: string
  errorMessage: string
}
```

### Key Functions

#### `downloadBackup()`
```typescript
async downloadBackup() {
  // 1. Get token from localStorage
  // 2. Call API endpoint with Authorization header
  // 3. Convert response to Blob
  // 4. Create download link and trigger download
  // 5. Update lastBackup timestamp
  // 6. Show success message
  // 7. Handle errors
}
```

#### Lifecycle Hooks
```typescript
onMounted(() => {
  // Load last backup time from localStorage
  const saved = localStorage.getItem('lastBackupTime')
  if (saved) {
    lastBackup.value = new Date(saved).toLocaleString('id-ID')
  }
})

watch(lastBackup, (newValue) => {
  // Save backup time to localStorage
  if (newValue !== 'Belum ada') {
    localStorage.setItem('lastBackupTime', new Date().toISOString())
  }
})
```

---

## 📝 Text Content

### Page Title
```
Database Backup
```

### Subtitle
```
Backup seluruh database ke file SQL yang bisa di-restore kapan saja
```

### Card Title
```
Backup Database
```

### Card Description
```
Backup akan mencakup semua tabel, struktur, dan data dalam format SQL standar.
```

### Stats Labels
- Database: `dbName` (stpaulus_cms_db)
- Last Backup: `lastBackup` (Belum ada / timestamp)

### Button Text
- Normal: "Download Backup Sekarang"
- Loading: "Membuat Backup..."

### Success Message Format
```
✅ Backup berhasil diunduh: stpaulus_backup_TIMESTAMP.sql (XX.XX MB)
```

### Error Message Format
```
[Error message from API or "Terjadi kesalahan saat membuat backup"]
```

### Info Section
**Title**: "Cara Restore Backup"

**Description**: 
```
Untuk restore database dari file backup:
```

**Command**:
```bash
mysql -u root -p stpaulus_cms_db < stpaulus_backup_TIMESTAMP.sql
```

---

## 🔐 Security & Permissions

### Required Permissions
- Role: `super_admin` OR `admin_sekretariat`
- Permission: `manage_content`
- Auth: JWT token in localStorage (`admin_access_token`)

### API Security
- Requires authentication via `requireAuth(event)`
- Requires permission via `requirePermission('manage_content')(event)`
- Returns 401 if unauthorized

---

## 📊 File Output Specification

### Filename Format
```
stpaulus_backup_YYYY-MM-DDTHH-MM-SS.sql
```

Example:
```
stpaulus_backup_2026-02-11T11-30-45.sql
```

### File Content Structure
```sql
-- MySQL Database Backup
-- Database: stpaulus_cms_db
-- Date: 2026-02-11T11:30:45.000Z
-- Generated by: StPaulus Admin Panel
--
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Table structure for: [table_name]
DROP TABLE IF EXISTS `[table_name]`;
CREATE TABLE `[table_name]` (...);

-- Data for table: [table_name]
INSERT INTO `[table_name]` VALUES (...);

SET FOREIGN_KEY_CHECKS=1;
```

---

## 🧪 Testing Checklist

- [ ] Login sebagai super_admin
- [ ] Akses menu "Database Backup" di sidebar
- [ ] Check UI sesuai dengan design specification
- [ ] Klik "Download Backup Sekarang"
- [ ] Verify loading state muncul
- [ ] Verify file SQL ter-download
- [ ] Verify success message muncul dengan file size
- [ ] Verify last backup timestamp ter-update
- [ ] Test error handling (disconnect internet)
- [ ] Test dengan admin_sekretariat role
- [ ] Test dengan role lain (should not have access)

---

## 🐛 Known Issues & Solutions

### Issue 1: Token undefined
**Problem**: `useAuth()` tidak return token
**Solution**: Direct access via `localStorage.getItem('admin_access_token')`

### Issue 2: TypeScript error in Vue SFC
**Problem**: `catch (error: any)` not allowed
**Solution**: Use `catch (error)` without type annotation

### Issue 3: Blob handling
**Problem**: Response might already be Blob or need conversion
**Solution**: Check instance before creating new Blob

---

## 🔄 Future Enhancements

1. **Scheduled Backups**
   - Cron job untuk automatic backup
   - Email notification setelah backup

2. **Backup History**
   - List semua backup files
   - Delete old backups
   - Download previous backups

3. **Backup Compression**
   - Gzip compression untuk file size reduction
   - Format: `.sql.gz`

4. **Cloud Storage Integration**
   - Upload ke AWS S3
   - Upload ke Google Cloud Storage
   - Upload ke Dropbox

5. **Selective Backup**
   - Pilih tabel tertentu untuk backup
   - Exclude data, structure only option

6. **Restore via UI**
   - Upload SQL file
   - One-click restore
   - Preview before restore

---

## 📚 References

- Nuxt 3 Documentation: https://nuxt.com/docs
- MySQL Dump Format: https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html
- Heroicons: https://heroicons.com/
- Tailwind CSS: https://tailwindcss.com/docs

---

## 👥 Maintainers

- Created: February 11, 2026
- Last Updated: February 11, 2026
- Status: ✅ Production Ready

---

## 📄 License

Internal project - St. Paulus Parish Juanda
