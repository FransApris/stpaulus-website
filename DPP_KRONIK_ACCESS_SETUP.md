# DPP Kronik Access Setup - Dokumentasi Lengkap

## ✅ Status Implementasi: SELESAI

Tanggal: 9 Maret 2026  
Migration: `025_add_dpp_sections_kronik.sql`

---

## 📋 Apa yang Telah Dilakukan

### 1. **Menambahkan 22 Seksi DPP ke Sistem Kronik**

Semua seksi/sub-seksi DPP kini memiliki akses untuk menulis kronik di kategori **DPP (Dewan Pastoral Paroki)**:

#### Bidang Pembinaan (6 Seksi)
- ✅ Seksi Keluarga
- ✅ Seksi BIAK (Bina Iman Anak & Keluarga)
- ✅ Seksi REKAT (Remaja Katolik)
- ✅ Seksi OMK (Orang Muda Katolik)
- ✅ Seksi Lansia
- ✅ Seksi Katekese

#### Bidang Liturgi (5 Sub-Seksi)
- ✅ Seksi Liturgi (Koordinator)
- ✅ Sub Seksi Lektor
- ✅ Sub Seksi Pemazrnur
- ✅ Sub Seksi Koor & Dirigen
- ✅ Sub Seksi Prodiakon

#### Bidang Sumber (2 Seksi)
- ✅ Seksi Dana
- ✅ Seksi Sarana Prasarana

#### Bidang Kerasulan (6 Seksi)
- ✅ Seksi Karya Sosial
- ✅ Seksi Kesehatan
- ✅ Seksi Komunikasi & Informasi
- ✅ Seksi Humas
- ✅ Seksi Dokumentasi

### 2. **Membuat 15 Demo Users dengan Akses Kronik**

Users berikut sudah dibuat dan siap digunakan:

| Username | Email | Jabatan | Section | Password |
|----------|-------|---------|---------|----------|
| `ketua.biak` | ketua.biak@stpaulusjuanda.org | Ketua Seksi BIAK | seksi-biak | admin123 |
| `pengurus.biak` | pengurus.biak@stpaulusjuanda.org | Pengurus Seksi BIAK | seksi-biak | admin123 |
| `ketua.keluarga` | ketua.keluarga@stpaulusjuanda.org | Ketua Seksi Keluarga | seksi-keluarga | admin123 |
| `ketua.rekat` | ketua.rekat@stpaulusjuanda.org | Ketua Seksi REKAT | seksi-rekat | admin123 |
| `ketua.omk` | ketua.omk@stpaulusjuanda.org | Ketua Seksi OMK | seksi-omk | admin123 |
| `ketua.lansia` | ketua.lansia@stpaulusjuanda.org | Ketua Seksi Lansia | seksi-lansia | admin123 |
| `ketua.katekese` | ketua.katekese@stpaulusjuanda.org | Ketua Seksi Katekese | seksi-katekese | admin123 |
| `ketua.liturgi` | ketua.liturgi@stpaulusjuanda.org | Ketua Bidang Liturgi | seksi-liturgi | admin123 |
| `ketua.lektor` | ketua.lektor@stpaulusjuanda.org | Ketua Sub Seksi Lektor | subseksi-lektor | admin123 |
| `ketua.pemazrnur` | ketua.pemazrnur@stpaulusjuanda.org | Ketua Sub Seksi Pemazrnur | subseksi-pemazrnur | admin123 |
| `ketua.koor` | ketua.koor@stpaulusjuanda.org | Ketua Sub Seksi Koor | subseksi-koor | admin123 |
| `ketua.prodiakon` | ketua.prodiakon@stpaulusjuanda.org | Ketua Sub Seksi Prodiakon | subseksi-prodiakon | admin123 |
| `ketua.dana` | ketua.dana@stpaulusjuanda.org | Ketua Seksi Dana | seksi-dana | admin123 |
| `ketua.saraspras` | ketua.saraspras@stpaulusjuanda.org | Ketua Seksi Sarana Prasarana | seksi-sarana-prasarana | admin123 |
| `ketua.karsos` | ketua.karsos@stpaulusjuanda.org | Ketua Seksi Karya Sosial | seksi-karya-sosial | admin123 |

**⚠️ PENTING:** Semua user menggunakan password default `admin123`. **WAJIB DIGANTI** setelah login pertama!

---

## 🎯 Cara Menggunakan

### **Login sebagai Ketua Seksi**

1. Buka website St. Paulus
2. Login dengan salah satu akun di atas (misal: `ketua.biak` / `admin123`)
3. Akses menu **Kronik** → **Tulis Kronik**
4. Pilih kategori **DPP**
5. Pilih section sesuai seksi Anda (misal: **Seksi BIAK**)
6. Tulis kronik dengan format 5W1H
7. Simpan sebagai **Draft** atau langsung **Publish** (khusus Ketua)

### **Perbedaan Hak Akses**

| Role | Hak Akses |
|------|-----------|
| **Ketua Seksi** (`ketua-dpp`) | ✅ Menulis kronik<br>✅ Edit semua kronik di seksinya<br>✅ Publish kronik langsung<br>✅ Hapus kronik di seksinya |
| **Pengurus Seksi** (`pengurus-dpp`) | ✅ Menulis kronik (status: Draft/Pending)<br>✅ Edit kronik miliknya sendiri<br>❌ Tidak bisa publish (perlu approval Ketua)<br>✅ Hapus kronik draft miliknya |

---

## 🔧 Menambah User DPP Baru

Jika ada anggota baru yang perlu akses kronik:

```sql
-- Get section ID (contoh: Seksi BIAK)
SET @section_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-biak');

-- Tambah user baru
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    full_name, 
    role, 
    user_category, 
    unit_name, 
    organization_type, 
    organization_id
) VALUES (
    'nama.user',  -- username
    'email@stpaulusjuanda.org',  -- email
    '$2b$10$UclgMfc3PxkkmuCl01UQeeMUt21kN47XiXDCedfRidyh0/m0kpqkq',  -- password hash (admin123)
    'Nama Lengkap User',  -- full name
    'pengurus-dpp',  -- role: 'ketua-dpp' atau 'pengurus-dpp'
    'CATEGORICAL_GROUP',  -- user_category (WAJIB!)
    'Pengurus Seksi BIAK',  -- unit_name (untuk display)
    'dpp',  -- organization_type (WAJIB!)
    @section_id  -- organization_id (link ke section)
);
```

---

## 📊 Verifikasi Data

### Cek Semua Seksi DPP
```sql
SELECT id, name, slug, order_index
FROM kronik_sections 
WHERE category_id = 2
ORDER BY order_index;
```

### Cek Users dengan Akses Kronik
```sql
SELECT 
    u.username,
    u.email,
    u.full_name,
    u.role,
    ks.name as section_name,
    CASE 
        WHEN u.role = 'ketua-dpp' THEN 'Ketua (Full Access)'
        WHEN u.role = 'pengurus-dpp' THEN 'Pengurus (Draft Only)'
        ELSE 'Unknown'
    END as access_level
FROM users u
JOIN kronik_sections ks ON u.organization_id = ks.id
WHERE u.organization_type = 'dpp'
ORDER BY ks.order_index, u.role;
```

### Cek Kronik yang Sudah Ditulis
```sql
SELECT 
    ke.id,
    ke.what_title,
    ke.when_date,
    ks.name as section_name,
    u.full_name as author,
    ke.status
FROM kronik_entries ke
JOIN kronik_sections ks ON ke.section_id = ks.id
JOIN users u ON ke.author_id = u.id
WHERE ks.category_id = 2  -- DPP category
ORDER BY ke.when_date DESC
LIMIT 10;
```

---

## 🔐 Keamanan

### Ganti Password Default

**WAJIB dilakukan untuk semua user:**

1. Login dengan akun baru
2. Pergi ke **Profile** / **Pengaturan**
3. Ganti password dari `admin123` ke password yang kuat

Atau via SQL:
```sql
-- Ganti password (hash ini untuk "password_baru_123")
UPDATE users 
SET password_hash = '$2b$10$[HASH_BARU_DARI_BCRYPT]'
WHERE username = 'ketua.biak';
```

### Nonaktifkan User (Jika Diperlukan)

```sql
-- Hapus akses kronik tanpa menghapus user
UPDATE users 
SET organization_id = NULL,
    organization_type = NULL
WHERE username = 'ketua.biak';

-- Atau hapus user sepenuhnya
DELETE FROM users WHERE username = 'ketua.biak';
```

---

## 📁 File Migration

Semua perubahan tersimpan di:
- `migrations/025_step1_add_sections.sql` - Menambah sections
- `migrations/025_step2_check_users.sql` - Verifikasi users
- `migrations/025_step3_link_users.sql` - Link users ke sections
- `migrations/025_step4_create_dpp_users.sql` - Buat demo users
- `migrations/025_add_dpp_sections_kronik.sql` - Full migration (complete)

---

## ✅ Checklist Testing

- [ ] Login sebagai `ketua.biak` / `admin123`
- [ ] Akses menu **Kronik** → **Tulis Kronik**
- [ ] Pilih kategori **DPP**
- [ ] Pilih section **Seksi BIAK (Bina Iman Anak & Keluarga)**
- [ ] Isi form kronik (What, When, Where, Who, Why, How)
- [ ] Simpan dengan status **Published**
- [ ] Verifikasi kronik muncul di halaman kronik DPP
- [ ] Logout dan login sebagai `pengurus.biak`
- [ ] Coba tulis kronik (hanya bisa Draft/Pending)
- [ ] Verifikasi tidak bisa langsung publish

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek tabel `kronik_sections` untuk memastikan section_id sudah benar
2. Cek tabel `users` untuk memastikan `organization_id` terisi
3. Pastikan `user_category = 'CATEGORICAL_GROUP'` dan `organization_type = 'dpp'`
4. Cek file `composables/useKronikPermissions.ts` untuk logika permission

---

**🎉 Setup Selesai! Semua seksi DPP kini bisa menulis kronik!**
