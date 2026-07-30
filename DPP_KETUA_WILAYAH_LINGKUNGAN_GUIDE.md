# Panduan Input Data Ketua Wilayah & Ketua Lingkungan - DPP Paroki

## 📋 Ringkasan
Fitur ini memungkinkan admin untuk mengelola data **Ketua Wilayah** dan **Ketua Lingkungan** di sistem DPP Paroki. Data akan ditampilkan di:
- **Halaman Publik**: `/dpp-paroki` (untuk umat)
- **Halaman Admin**: `/admin/dpp` (untuk pengelolaan data)

---

## 🗄️ Langkah 1: Import Data dari SQL Script

### A. Menggunakan MySQL Workbench
1. Buka **MySQL Workbench**
2. Koneksi ke database `stpaulus`
3. Buka file: `insert-dpp-wilayah-lingkungan.sql` (di root project)
4. Klik **Execute** (⚡ icon) atau tekan `Ctrl+Shift+Enter`
5. Verifikasi: Cek output window, pastikan muncul "38 row(s) affected"

### B. Menggunakan Command Line
```bash
# Dari project root directory
mysql -u root -p stpaulus < insert-dpp-wilayah-lingkungan.sql

# Atau dengan path lengkap
mysql -u root -p stpaulus < "D:\APRIS FILE\WEBSITE PROJECT\StPaulus 3 2\StPaulus 3\insert-dpp-wilayah-lingkungan.sql"
```

### C. Menggunakan phpMyAdmin
1. Login ke phpMyAdmin
2. Pilih database `stpaulus`
3. Klik tab **SQL**
4. Copy-paste seluruh isi file `insert-dpp-wilayah-lingkungan.sql`
5. Klik **Go**

---

## ✅ Langkah 2: Verifikasi Import

### Query Verifikasi
```sql
-- Cek jumlah Ketua Wilayah (harus ada 8)
SELECT COUNT(*) as total_ketua_wilayah 
FROM dpp_members 
WHERE position_category = 'ketua_wilayah' 
AND is_active = TRUE;

-- Cek jumlah Ketua Lingkungan (harus ada 30+)
SELECT COUNT(*) as total_ketua_lingkungan 
FROM dpp_members 
WHERE position_category = 'ketua_lingkungan' 
AND is_active = TRUE;

-- Lihat data per wilayah
SELECT 
    wilayah_name,
    position_category,
    COUNT(*) as jumlah
FROM dpp_members
WHERE position_category IN ('ketua_wilayah', 'ketua_lingkungan')
GROUP BY wilayah_name, position_category
ORDER BY wilayah_name, position_category;
```

### Expected Results:
- **8 Ketua Wilayah**: Petrus, Paulus, Yeseph, Bartholomeus, Yakobus, Maria Regina, Fransiskus Asisi, Vincentius a Paulo
- **30+ Ketua Lingkungan**: Tersebar di 8 wilayah (3-5 lingkungan per wilayah)

---

## 🌐 Langkah 3: Verifikasi Tampilan Public

1. Buka browser: `http://localhost:3000/dpp-paroki`
2. Scroll ke bagian **"Ketua Wilayah & Lingkungan"**
3. Periksa:
   - ✅ 8 kartu wilayah ditampilkan
   - ✅ Setiap kartu menampilkan **Ketua Wilayah** (bold, border tebal)
   - ✅ Di bawahnya ada daftar **Ketua Lingkungan** (standard font, border tipis)
   - ✅ Urutan benar: Ketua Wilayah → Lingkungan 1, 2, 3...

### Contoh Tampilan:
```
┌─────────────────────────────┐
│ WILAYAH PETRUS              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ▐ Yulina Yilsum Sitman      │  ← Bold, border indigo tebal
│   Ketua Wilayah             │
│                             │
│ │ Petrus Tri Danny Yunanto  │  ← Standard, border gray tipis
│   Ketua Lingkungan Petrus 1 │
│ │ Andreas Andrijono         │
│   Ketua Lingkungan Petrus 2 │
│ ... (3 more)                │
└─────────────────────────────┘
```

---

## 🔧 Langkah 4: Mengelola Data via Admin

### A. Akses Halaman Admin
1. Login sebagai admin: `http://localhost:3000/admin/login`
2. Navigate ke: **Menu → DPP → Kelola DPP**
3. Pilih view mode: **"Per Bidang"**
4. Scroll ke bagian **"Ketua Wilayah & Lingkungan"** (background teal)

### B. Menambah Data Baru

#### Tambah Ketua Wilayah:
1. Klik **"Tambah Anggota"**
2. Isi form:
   - **Nama Lengkap**: (contoh: Yohanes Baptista)
   - **Jabatan Lengkap**: Ketua Wilayah Petrus
   - **Kategori Jabatan**: **Ketua Wilayah** ⚠️
   - **Nama Wilayah**: Pilih dari dropdown (Petrus, Paulus, dll)
   - **Tipe Jabatan**: Ketua Wilayah
   - **Urutan Tampil**: 1-8 (untuk wilayah)
   - **Status Aktif**: ✅ Centang
3. Klik **"Tambah"**

#### Tambah Ketua Lingkungan:
1. Klik **"Tambah Anggota"**
2. Isi form:
   - **Nama Lengkap**: (contoh: Andreas Sutanto)
   - **Jabatan Lengkap**: Ketua Lingkungan Petrus 6
   - **Kategori Jabatan**: **Ketua Lingkungan** ⚠️
   - **Nama Wilayah**: Petrus
   - **Nomor Lingkungan**: 6 ⚠️
   - **Tipe Jabatan**: Ketua Lingkungan
   - **Urutan Tampil**: 106 (format: XYY dimana X = wilayah ke-1, YY = lingkungan ke-06)
   - **Status Aktif**: ✅ Centang
3. Klik **"Tambah"**

### C. Edit Data Existing
1. Cari member di list
2. Klik icon **Edit** (pensil biru)
3. Ubah field yang perlu (pastikan kategori tetap konsisten)
4. Klik **"Simpan"**

### D. Hapus Data
1. Cari member di list
2. Klik icon **Hapus** (trash merah)
3. Konfirmasi penghapusan

---

## 📊 Struktur Display Order

### Rekomendasi Numbering System:
```
Ketua Wilayah:
  - Petrus:          1
  - Paulus:          2
  - Yeseph:          3
  - Bartholomeus:    4
  - Yakobus:         5
  - Maria Regina:    6
  - Fransiskus:      7
  - Vincentius:      8

Ketua Lingkungan:
  - Petrus L1:      101  (format: wilayah ke-1, lingkungan 01)
  - Petrus L2:      102
  - Petrus L3:      103
  - ...
  - Paulus L1:      201  (wilayah ke-2, lingkungan 01)
  - Paulus L2:      202
  - ...
  - Yeseph L1:      301  (wilayah ke-3, lingkungan 01)
```

---

## 🎨 Perbedaan Visual

### Di Halaman Public (`/dpp-paroki`):
| Kategori         | Style                                    |
|------------------|------------------------------------------|
| Ketua Wilayah    | Bold, Indigo 900, Border Left 4px Indigo |
| Ketua Lingkungan | Semibold, Gray 900, Border Left 2px Gray |

### Di Halaman Admin (`/admin/dpp`):
| Kategori         | Informasi Tambahan                          |
|------------------|---------------------------------------------|
| Ketua Wilayah    | Badge: "Wilayah {nama}" (teal)              |
| Ketua Lingkungan | Badge: "Lingkungan {no} - Wilayah {nama}"   |

---

## 🔍 Filter & Search

### Filter yang Tersedia:
1. **Bidang**: Pilih "Semua Bidang" atau filter spesifik
2. **Kategori**: 
   - Pengurus Inti
   - Ketua Bidang
   - Ketua Seksi
   - Anggota
   - **Ketua Wilayah** ⭐
   - **Ketua Lingkungan** ⭐
3. **Status**: Aktif / Tidak Aktif
4. **Search**: Cari nama anggota

### Tips Filtering:
- Untuk melihat semua Ketua Wilayah: Filter Kategori → "Ketua Wilayah"
- Untuk melihat Ketua Lingkungan tertentu: Search nama atau wilayah
- Untuk melihat struktur lengkap: Gunakan view "Per Bidang" → Scroll ke section "Ketua Wilayah & Lingkungan"

---

## 📝 Field Wajib vs Optional

### ✅ Field Wajib:
- Nama Lengkap
- Jabatan Lengkap
- Kategori Jabatan (ketua_wilayah / ketua_lingkungan)
- Nama Wilayah (pilih dari dropdown)
- Nomor Lingkungan (hanya untuk Ketua Lingkungan)
- Tipe Jabatan
- Urutan Tampil
- Status Aktif

### ⚡ Field Optional:
- Position Level (I, II, III)
- Ex Officio (checkbox)
- Tanggal Mulai / Selesai
- Nomor SK
- Tanggal SK
- Catatan

---

## 🚨 Troubleshooting

### ❌ Data tidak muncul di public page
**Solusi:**
1. Pastikan `is_active = TRUE` di database
2. Clear browser cache (Ctrl+Shift+R)
3. Cek console browser untuk error
4. Restart Nuxt dev server

### ❌ Duplicate entry error saat import SQL
**Solusi:**
```sql
-- Hapus data existing terlebih dahulu
DELETE FROM dpp_members WHERE position_category IN ('ketua_wilayah', 'ketua_lingkungan');

-- Kemudian re-run SQL script
```

### ❌ Urutan tampil tidak sesuai
**Solusi:**
1. Edit member di admin page
2. Update field "Urutan Tampil" mengikuti sistem numbering (1-8 untuk wilayah, 101-803 untuk lingkungan)
3. Simpan perubahan

### ❌ Modal form terlalu panjang (scroll tidak smooth)
**Normal behavior.** Form dirancang dengan max-height 90vh dan overflow-y auto untuk mendukung berbagai ukuran layar.

---

## 📊 Data Summary

### Total Data:
- **8 Ketua Wilayah**
- **30 Ketua Lingkungan**
- **38 Total Records** dalam SQL script

### Wilayah Coverage:
| Wilayah              | Jumlah Lingkungan |
|----------------------|-------------------|
| Petrus               | 5                 |
| Paulus               | 5                 |
| Yeseph               | 3                 |
| Bartholomeus         | 3                 |
| Yakobus              | 3                 |
| Maria Regina         | 3                 |
| Fransiskus Asisi     | 3                 |
| Vincentius a Paulo   | 3                 |

---

## 🎯 Best Practices

1. **Konsistensi Nama Wilayah**: Gunakan nama persis dari dropdown (bukan "St. Petrus" tapi "Petrus")
2. **Display Order**: Ikuti sistem numbering yang sudah ditentukan
3. **Jabatan Lengkap**: Sebutkan lengkap, contoh: "Ketua Lingkungan Petrus 3" bukan hanya "Ketua"
4. **Status Aktif**: Tandai inactive jika masa jabatan sudah berakhir, jangan hapus data
5. **Backup Data**: Sebelum import/update massal, backup database terlebih dahulu

---

## 📞 Support

Jika ada kendala teknis:
1. Cek error di browser console (F12)
2. Cek error di terminal Nuxt dev server
3. Review dokumentasi API di `API_DOCUMENTATION.md`
4. Cek struktur database di `DATABASE_DOCUMENTATION.md`

---

## ✨ Features Summary

### ✅ Yang Sudah Bisa Dilakukan:
- ✅ Import data bulk via SQL script
- ✅ CRUD lengkap via admin interface
- ✅ Visual hierarchy di public page (bold vs standard)
- ✅ Filtering by category (ketua_wilayah, ketua_lingkungan)
- ✅ Sorting otomatis (Ketua Wilayah first, then by lingkungan_number)
- ✅ Search by name/wilayah
- ✅ Conditional form fields (show wilayah fields only for relevant categories)

### 🔮 Future Enhancements:
- [ ] Group by wilayah di admin page (nested view)
- [ ] Mass update display_order
- [ ] Export to Excel
- [ ] Auto-calculate display_order based on input
- [ ] Foto profile integration

---

## 📅 Changelog

### 2026-02-11
- ✅ Added `position_category`, `wilayah_name`, `lingkungan_number` fields to form
- ✅ Conditional form rendering based on position_category
- ✅ Added "Ketua Wilayah & Lingkungan" section in admin grouped view
- ✅ Updated filter options to include ketua_wilayah and ketua_lingkungan
- ✅ Enhanced public page display with visual hierarchy
- ✅ Created SQL insert script with 38 records
- ✅ Documentation completed

---

**Happy Managing! 🎉**
