# Database Restore Feature

## 📋 Overview

Fitur Database Restore memungkinkan Super Admin untuk mengembalikan database dari file backup SQL yang telah dibuat sebelumnya.

## 🎯 Fitur Utama

### 1. Upload File SQL Backup

- Drag & drop atau klik untuk memilih file
- Validasi format file (.sql)
- Validasi ukuran file (maksimal 50MB)
- Preview informasi file yang dipilih

### 2. Restore Database

- Restore database dari file backup
- Progress indicator saat proses restore
- Statistik hasil restore (success/error count)
- Error handling yang detail

### 3. Keamanan

- Hanya Super Admin yang dapat mengakses
- Validasi token authentication
- Warning sebelum melakukan restore
- Error handling untuk mencegah data corruption

## 📁 File Structure

```
server/
└── api/
    └── admin/
        └── restore/
            └── database.post.ts    # API endpoint untuk restore database

pages/
└── admin/
    └── restore.vue                # Halaman UI restore database

layouts/
└── admin.vue                      # Menu navigasi (ditambah menu Restore)
```

## 🔧 Cara Penggunaan

### Untuk User (Admin Panel)

1. **Login sebagai Super Admin**
   - Hanya Super Admin yang memiliki akses ke fitur ini

2. **Buka Menu Database Restore**
   - Navigasi ke Admin Panel → Database Restore

3. **Warning**
   - Baca peringatan dengan seksama
   - Restore akan menghapus semua data yang ada
   - Disarankan backup database saat ini terlebih dahulu

4. **Upload File Backup**
   - Klik kotak upload atau drag & drop file SQL
   - File harus berformat .sql
   - Maksimal ukuran: 50MB

5. **Klik Tombol "Restore Database"**
   - Tunggu hingga proses selesai
   - Jangan tutup browser saat proses berlangsung

6. **Lihat Hasil**
   - Success message dengan statistik
   - Total statements yang dieksekusi
   - Jumlah success dan error (jika ada)

### Untuk Developer

#### API Endpoint

**POST** `/api/admin/restore/database`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Body (multipart/form-data):**

```
sqlFile: <file.sql>
```

**Response Success:**

```json
{
  "success": true,
  "message": "Database restored successfully",
  "stats": {
    "totalStatements": 150,
    "successCount": 148,
    "errorCount": 2,
    "errors": [
      "Statement 45: Duplicate entry for key 'PRIMARY'",
      "Statement 89: Table already exists"
    ]
  }
}
```

**Response Error:**

```json
{
  "statusCode": 403,
  "statusMessage": "Unauthorized: Super Admin access required"
}
```

## ⚠️ Catatan Penting

1. **Backup Terlebih Dahulu**
   - Selalu backup database sebelum restore
   - Gunakan menu "Database Backup" untuk membuat backup

2. **Format File**
   - File harus dalam format SQL standar
   - File harus dari database yang sama (stpaulus_cms_db)
   - Gunakan file backup yang dibuat dari menu "Database Backup"

3. **Ukuran File**
   - Maksimal 50MB
   - Untuk file lebih besar, gunakan command line

4. **Proses Restore**
   - Restore berjalan statement per statement
   - Error pada satu statement tidak menghentikan proses
   - Critical error (akses, database tidak ada) akan menghentikan proses

5. **Error Handling**
   - Beberapa error mungkin muncul (duplicate keys, dll)
   - Error tersebut tidak selalu berarti restore gagal
   - Cek statistik untuk melihat berapa banyak yang berhasil

## 🚀 Command Line Alternative

Untuk file backup yang sangat besar (>50MB), gunakan command line:

### Windows (PowerShell)

```powershell
Get-Content backup.sql | mysql -u root -p stpaulus_cms_db
```

### Windows (CMD)

```cmd
mysql -u root -p stpaulus_cms_db < backup.sql
```

### Linux/Mac

```bash
mysql -u root -p stpaulus_cms_db < backup.sql
```

## 🔒 Security

1. **Authentication**
   - Endpoint memerlukan token JWT valid
   - Hanya Super Admin yang boleh akses

2. **Validation**
   - Validasi format file
   - Validasi ukuran file
   - Validasi konten SQL

3. **Error Protection**
   - Try-catch untuk setiap statement
   - Critical error detection
   - Clean connection closure

## 📊 Flow Diagram

```
User Upload SQL File
        ↓
Validate File Format & Size
        ↓
Send to API Endpoint
        ↓
Verify Super Admin Auth
        ↓
Parse SQL Content
        ↓
Split into Statements
        ↓
Execute Statement by Statement
        ↓
Track Success/Error Count
        ↓
Return Results with Stats
        ↓
Display to User
```

## 🛠️ Troubleshooting

### Error: "Token tidak ditemukan"

- **Solusi**: Login ulang sebagai Super Admin

### Error: "File harus berformat .sql"

- **Solusi**: Pastikan file memiliki extension .sql

### Error: "File terlalu besar"

- **Solusi**: Gunakan command line untuk file >50MB

### Error: "Critical database error"

- **Solusi**:
  - Cek koneksi database
  - Cek credentials di .env
  - Pastikan database service berjalan

### Warning: "Beberapa error yang terjadi"

- **Catatan**:
  - Ini normal jika ada duplicate keys atau constraint violations
  - Cek jumlah success vs error
  - Jika sebagian besar berhasil, restore kemungkinan besar OK

## 📝 TODO / Future Improvements

- [ ] Compress file support (.sql.gz)
- [ ] Scheduled restore
- [ ] Backup versioning
- [ ] Partial restore (selected tables only)
- [ ] Restore preview/validation before actual restore
- [ ] Email notification after restore completed

## 🔗 Related Features

- [Database Backup](../backup.vue) - Membuat backup database
- [Database Management](../../../scripts/backup-database.js) - Script CLI backup

## 📞 Support

Jika mengalami masalah, hubungi:

- Developer: [Email/Contact]
- Documentation: Check API_DOCUMENTATION.md

---

**Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Author**: StPaulus Dev Team
