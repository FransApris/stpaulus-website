# 🚀 Kronik System - Manual Database Setup

## ❌ Masalah yang Terjadi

Error 500 pada API kronik karena **tabel database belum dibuat**.

## ✅ Solusi: Import SQL Manual

### **Opsi 1: Menggunakan phpMyAdmin** ⭐ RECOMMENDED

1. **Buka phpMyAdmin** di browser

   ```
   http://localhost/phpmyadmin
   ```

2. **Login** dengan credentials database Anda

3. **Pilih Database**
   - Klik database `stpaulus_cms_db` di sidebar kiri

4. **Buka Tab SQL**
   - Klik tab "SQL" di menu atas

5. **Import SQL File**
   - Klik tombol **"Import"** atau **"Impor"**
   - Klik **"Browse"** / **"Pilih File"**
   - Navigate ke folder project: `StPaulus 3/migrations/`
   - Pilih file: **`020_create_kronik_system_fixed.sql`**
   - Klik **"Go"** atau **"Kirim"**

6. **Tunggu Proses**
   - Proses akan berjalan beberapa detik
   - Jika sukses, akan muncul pesan hijau: "X queries executed successfully"

7. **Verifikasi**
   - Klik tab "Structure" atau "Struktur"
   - Scroll dan cari tabel yang dimulai dengan `kronik_`:
     - `kronik_categories`
     - `kronik_sections`
     - `kronik_entries`
     - `kronik_views`
     - `kronik_comments`

### **Opsi 2: Menggunakan MySQL Workbench**

1. Buka MySQL Workbench
2. Connect ke MySQL Server
3. Pilih database `stpaulus_cms_db`
4. Klik **File → Open SQL Script**
5. Browse ke: `StPaulus 3\migrations\020_create_kronik_system_fixed.sql`
6. Klik **Execute** (icon petir ⚡)
7. Tunggu hingga selesai

### **Opsi 3: Menggunakan Command Line** (Advanced)

```bash
# Windows PowerShell
cd "D:\APRIS FILE\WEBSITE PROJECT\StPaulus 3 2\StPaulus 3"

# Jika menggunakan XAMPP
"C:\xampp\mysql\bin\mysql.exe" -u root -p stpaulus_cms_db < migrations/020_create_kronik_system_fixed.sql

# Jika MySQL di PATH
mysql -u root -p stpaulus_cms_db < migrations/020_create_kronik_system_fixed.sql
```

Saat diminta password, masukkan password MySQL root Anda (biasanya kosong untuk XAMPP).

## 📊 Apa yang Akan Dibuat?

Setelah menjalankan migrasi, sistem akan membuat:

### 1. **kronik_categories** (5 records)

- Gereja
- DPP (Dewan Pengurus Paroki)
- BGKP (Badan Gotong Royong Karya Paroki)
- Wilayah
- Lingkungan

### 2. **kronik_sections** (~8 records)

- Tim Liturgi, Tim Sosial, dll (untuk DPP)
- Seksi Liturgi, Seksi Pelayanan Kasih, dll (untuk BGKP)

### 3. **kronik_entries**

- Tabel utama untuk menyimpan kronik dengan format 5W1H
- Fields: What, Who, When, Where, Why, How

### 4. **kronik_views**

- Tracking views untuk setiap kronik

### 5. **kronik_comments**

- Sistem komentar (opsional, untuk future)

## ✅ Verifikasi Setelah Import

1. **Refresh browser** (tekan F5)
2. **Login sebagai user** (contoh: petrus1)
3. **Klik "Kelola Kronik"** di navbar
4. **Seharusnya tidak ada error lagi!**
5. Test membuat kronik baru:
   - Kategori otomatis terpilih: **Lingkungan**
   - Bagian: Kosong (belum ada bagian untuk Lingkungan)
   - Fill form 5W1H
   - Klik "Submit untuk Review"

## 🐛 Jika Masih Error

### Error: "Table already exists"

✅ **IGNORE** - ini normal jika table sudah dibuat sebelumnya

### Error: "Access denied"

❌ Check username & password MySQL Anda

- Default XAMPP: user=`root`, password=(kosong)
- Default dari config app: user=`new_cms_user`, password=`secure_app_password_2025`

### Error: "Unknown database"

❌ Database `stpaulus_cms_db` belum dibuat

1. Buka phpMyAdmin
2. Klik "New" / "Baru"
3. Nama database: `stpaulus_cms_db`
4. Collation: `utf8mb4_unicode_ci`
5. Klik "Create" / "Buat"
6. Lalu import SQL lagi

## 📝 Catatan Penting

- ✅ File SQL menggunakan **`INSERT IGNORE`** - aman dijalankan berulang kali
- ✅ Tidak akan menghapus data existing
- ✅ Akan skip jika table/data sudah ada
- ⚠️ **BACKUP database** sebelum import (good practice)

## 🎯 Next Steps Setelah Sukses

1. ✅ Kronik management akan berfungsi 100%
2. ✅ User bisa create/edit/delete kronik
3. ✅ Admin bisa review & publish kronik
4. ✅ Kategori auto-selected berdasarkan user role

---

**Need Help?** Beritahu saya jika ada error setelah mengikuti langkah di atas!
