# 📖 Panduan Sistem Kronik Paroki

## 🔐 Sistem Hak Akses Kronik

### **Perbedaan Admin vs User:**

#### **Admin (Super Admin, Admin Sekretariat, Admin Komsos)**

- ✅ Login melalui **Panel Admin** di `/admin/login`
- ✅ Akses penuh ke semua fitur administrasi
- ✅ Kelola semua kronik, user, settings
- ❌ **TIDAK bisa** login via web publik (modal login di navbar)

#### **User (Ketua & Pengurus)**

- ✅ Login melalui **Web Publik** (modal login di navbar)
- ✅ Akses sesuai kategori masing-masing
- ✅ Isi kronik sesuai bagian mereka
- ✅ Booking pemesanan ruang

---

### **Kategori User & Hak Akses:**

### 1. **Ketua** (Ketua DPP, BGKP, Wilayah, Lingkungan)

✅ Dapat melihat kronik di bagian mereka
✅ Dapat membuat kronik di bagian mereka
✅ Dapat mengedit semua kronik di bagian mereka
✅ Dapat mempublikasikan kronik di bagian mereka
✅ Dapat menghapus kronik di bagian mereka
✅ Dapat booking ruang paroki

**Kategori Database:**

- `user_category`: PARISH_COUNCIL, CATEGORICAL_GROUP, REGION, atau COMMUNITY
- `unit_name`: "Ketua DPP", "Ketua BGKP", "Ketua Wilayah I", dll

### 2. **Pengurus** (Pengurus DPP, BGKP, Wilayah, Lingkungan)

✅ Dapat melihat kronik di bagian mereka
✅ Dapat membuat kronik di bagian mereka
✅ Hanya dapat mengedit kronik mereka sendiri
⚠️ Perlu approval Ketua/Admin untuk publish
⚠️ Hanya dapat menghapus kronik mereka sendiri yang masih Draft/Pending
✅ Dapat booking ruang paroki

**Kategori Database:**

- `user_category`: PARISH_COUNCIL, CATEGORICAL_GROUP, REGION, atau COMMUNITY
- `unit_name`: "Pengurus DPP", "Pengurus BGKP", "Pengurus Wilayah I", dll

### 3. **User Biasa** (Tanpa Kategori)

✅ Dapat melihat konten website publik
✅ Dapat booking pemesanan ruang
❌ **TIDAK dapat** akses kronik (tidak punya kategori organisasi)

---

## 📝 Cara Menambahkan Kronik

### **Langkah 1: Login ke Sistem**

1. Klik tombol **"Login"** di Navbar (pojok kanan atas)
2. Masukkan **username** dan **password** Anda
3. Setelah login, Anda akan melihat nama dan role Anda

### **Langkah 2: Akses Halaman Kronik**

**Opsi A: Dari Login Modal**

- Setelah login, klik **"Kelola Kronik"** di quick access (untuk Admin & Pengurus)

**Opsi B: Manual**

- Akses URL: `http://localhost:3000/admin/kronik`

### **Langkah 3: Buat Kronik Baru**

1. Di halaman Kronik, klik tombol **"+ Tambah Kronik Baru"** (pojok kanan atas)
2. Anda akan diarahkan ke form pembuatan kronik

### **Langkah 4: Isi Form Kronik**

#### **A. Informasi Dasar**

**1. Kategori** (Wajib)

```
Pilih kategori kronik:
- Kegiatan Paroki
- Kegiatan DPP
- Kegiatan BGKP
- Kegiatan Wilayah
- Kegiatan Lingkungan
- Sakramen
- Berita Duka
- dll.
```

**2. Bagian/Section** (Opsional)

```
Pilih bagian jika kronik untuk section tertentu:
- DPP St. Paulus
- BGKP St. Paulus
- Wilayah I
- Wilayah II
- Lingkungan A
- dll.

Catatan:
- Ketua: Otomatis hanya bisa pilih bagian mereka
- Pengurus: Otomatis hanya bisa pilih bagian mereka
- Admin: Bisa pilih semua bagian
```

#### **B. Detail Kronik (5W1H)**

**WHAT - Apa yang Terjadi?**

- **Judul**: Judul singkat kegiatan (wajib)
  ```
  Contoh: "Perayaan Ekaristi Pemberkatan Keluarga"
  ```
- **Deskripsi**: Penjelasan lengkap kegiatan (wajib)
  ```
  Contoh: "Kegiatan pemberkatan keluarga dihadiri oleh 50 KK..."
  ```

**WHO - Siapa yang Terlibat?**

- **Yang Terlibat**: Nama-nama orang/kelompok yang terlibat
  ```
  Contoh: "Romo Paroki, Ketua DPP, Seluruh umat Lingkungan A"
  ```

**WHEN - Kapan?**

- **Tanggal & Waktu**: Waktu pelaksanaan (wajib)
- **Durasi**: Lama kegiatan
  ```
  Contoh: "2 jam" atau "Pukul 08.00 - 10.00"
  ```

**WHERE - Dimana?**

- **Lokasi**: Tempat kegiatan
  ```
  Contoh: "Gereja St. Paulus"
  ```
- **Alamat**: Alamat lengkap
  ```
  Contoh: "Jl. Juanda No. 123, Sidoarjo"
  ```

**WHY - Mengapa?**

- **Tujuan**: Alasan/tujuan kegiatan
  ```
  Contoh: "Dalam rangka menyambut HUT Paroki ke-50"
  ```

**HOW - Bagaimana?**

- **Cara Pelaksanaan**: Metode/cara pelaksanaan
  ```
  Contoh: "Kegiatan dilaksanakan dengan protokol kesehatan ketat"
  ```

#### **C. Data Tambahan**

**Jumlah Peserta**

```
Contoh: 150 orang
```

**Hasil/Outcome**

```
Contoh: "Berhasil memberkati 45 keluarga"
```

**Dokumentasi**

- Upload foto-foto kegiatan
- Format: JPG, PNG (max 5MB per file)
- Minimal 1 foto, maksimal 10 foto

**Tags/Kata Kunci**

```
Contoh: pemberkatan, keluarga, lingkungan
```

#### **D. Status Publikasi**

**Untuk Pengurus:**

- **Draft**: Simpan sementara, belum submit
- **Pending**: Submit untuk direview oleh Ketua/Admin

**Untuk Ketua/Admin:**

- **Draft**: Simpan sementara
- **Pending**: Tunggu review
- **Published**: Langsung publish ke website publik
- **Archived**: Arsipkan kronik lama

### **Langkah 5: Submit Kronik**

1. Setelah semua terisi, klik tombol:
   - **"Simpan sebagai Draft"**: Jika ingin melanjutkan nanti
   - **"Submit untuk Review"**: (Pengurus) Submit ke Ketua/Admin
   - **"Publish"**: (Ketua/Admin) Langsung publish

---

## 🎯 Workflow Kronik Berdasarkan Role

### **A. Workflow Pengurus**

```
1. Login → 2. Buat Kronik → 3. Isi Form → 4. Submit untuk Review
                                                    ↓
                                          Ketua/Admin Review
                                                    ↓
                                          Approve / Reject
                                                    ↓
                                    Published / Kembali ke Draft
```

### **B. Workflow Ketua**

```
1. Login → 2. Buat Kronik → 3. Isi Form → 4. Publish Langsung
         ↓
   atau Review Kronik dari Pengurus → Approve/Reject
```

### **C. Workflow Admin**

```
1. Login → 2. Akses Semua Kronik
         ↓
   - Buat kronik baru (semua kategori)
   - Edit kronik manapun
   - Publish/Reject kronik pending
   - Hapus kronik
   - Kelola sections & categories
```

---

## 📊 Fitur Tambahan

### **1. Filter & Pencarian**

Di halaman utama kronik, Anda bisa filter berdasarkan:

- Status (Draft, Pending, Published, Archived)
- Kategori
- Bagian/Section
- Kata kunci (search)

### **2. Lihat Statistik**

- **Views Count**: Berapa kali kronik dilihat publik
- **Status**: Status kronik saat ini

### **3. Edit Kronik**

- **Pengurus**: Hanya bisa edit kronik mereka sendiri yang belum published
- **Ketua**: Bisa edit semua kronik di bagian mereka
- **Admin**: Bisa edit semua kronik

### **4. Hapus Kronik**

- **Pengurus**: Hanya bisa hapus kronik Draft/Pending milik sendiri
- **Ketua**: Bisa hapus kronik di bagian mereka
- **Admin**: Bisa hapus semua kronik

---

## 💡 Tips & Best Practices

### **1. Menulis Judul yang Baik**

✅ **Baik**: "Perayaan Ekaristi Hut Ke-50 Paroki St. Paulus"
❌ **Buruk**: "Acara hari minggu"

### **2. Deskripsi Lengkap**

✅ Jelaskan dengan detail (minimal 100 kata)
✅ Gunakan paragraf untuk mudah dibaca
✅ Sertakan angka/data jika ada

### **3. Dokumentasi Foto**

✅ Upload foto berkualitas baik
✅ Minimal 3-5 foto per kegiatan
✅ Beri caption/keterangan foto jika perlu

### **4. Submit Tepat Waktu**

✅ Kronik sebaiknya disubmit maksimal 7 hari setelah kegiatan
✅ Untuk pengurus, submit segera agar Ketua punya waktu review

### **5. Gunakan Tags**

✅ Minimal 3 tags per kronik
✅ Gunakan kata kunci yang relevan

```
Contoh tags yang baik:
- pemberkatan-keluarga
- lingkungan-a
- wilayah-1
- sakramen
```

---

## ❓ FAQ (Frequently Asked Questions)

### **Q: Saya pengurus, tapi tidak bisa publish kronik?**

A: Pengurus perlu submit untuk review dulu. Ketua atau Admin yang akan mempublikasikannya.

### **Q: Kronik saya ditolak, kenapa?**

A: Hubungi Ketua/Admin Anda. Biasanya karena:

- Informasi kurang lengkap
- Foto kurang jelas
- Perlu revisi deskripsi

### **Q: Bagaimana cara edit kronik yang sudah published?**

A:

- **Pengurus**: Tidak bisa edit. Hubungi Ketua/Admin
- **Ketua/Admin**: Langsung edit di halaman kronik

### **Q: Saya lupa password, bagaimana?**

A: Hubungi Admin Paroki untuk reset password.

### **Q: Apakah bisa upload video?**

A: Saat ini hanya foto. Untuk video, bisa sertakan link YouTube di deskripsi.

---

## 📞 Kontak Support

Jika ada masalah atau pertanyaan:

- **Email**: admin@stpaulusjuanda.org
- **WhatsApp**: +62 xxx-xxxx-xxxx
- **Atau**: Hubungi Admin Paroki langsung

---

## 🔄 Update Log

**v1.0 - 14 Februari 2026**

- Sistem kronik dengan role-based access control
- Workflow approval untuk pengurus
- Direct publish untuk ketua & admin
- Upload multiple photos
- Filter & search functionality

---

**Selamat menggunakan sistem Kronik Paroki St. Paulus! 🙏**
