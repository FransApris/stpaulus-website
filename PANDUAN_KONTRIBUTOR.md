# Panduan Penggunaan Portal Kontributor Berita

Dokumen ini berisi panduan lengkap untuk menggunakan Portal Kontributor Berita Paroki St. Paulus Juanda, baik dari sisi Admin Komsos maupun Kontributor.

---

## 1. Untuk Admin Komsos: Cara Membuat Akun Kontributor

Sebelum seorang umat/kontributor dapat mulai menulis berita, Admin Komsos atau Sekretariat harus membuatkan akun khusus untuk mereka.

1. **Login sebagai Admin:**
   Buka URL `https://stpaulusjuanda.org/admin/login` (atau `localhost:3000/admin/login` jika di lokal) dan masuk menggunakan akun Admin Komsos atau Super Admin.

2. **Buka Menu Kelola Pengguna:**
   Di sidebar sebelah kiri, cari grup **"Pengaturan Sistem & Akses"**, lalu klik menu **"Kelola Pengguna (User)"**.

3. **Tambah Pengguna Baru:**
   Klik tombol **"+ Tambah Pengguna"** (biasanya di pojok kanan atas halaman).

4. **Isi Data Kontributor:**
   Isi formulir dengan data kontributor yang bersangkutan:
   - **Username:** (contoh: `budiono`)
   - **Email:** (contoh: `budiono@gmail.com`)
   - **Nama Lengkap:** (contoh: `Budiono Santoso`)
   - **Password:** Buat password sementara (contoh: `ParokiPaulus2024!`)
   - **Role:** ⚠️ **PENTING: Pilih "Kontributor Berita"**

5. **Simpan dan Bagikan:**
   Klik **Simpan**. Bagikan URL Portal Kontributor, Username, dan Password sementara kepada kontributor tersebut.

---

## 2. Untuk Kontributor: Cara Menulis Berita

Bagian ini ditujukan untuk umat/kontributor yang telah mendapatkan akun.

1. **Buka Portal Kontributor:**
   Buka URL khusus untuk kontributor: `https://stpaulusjuanda.org/kontributor/login` (atau `localhost:3000/kontributor/login` jika di lokal).
   *Catatan: Kontributor tidak akan bisa login melalui halaman admin.*

2. **Login ke Portal:**
   Masukkan **Username** dan **Password** yang telah diberikan oleh Admin.

3. **Dashboard Utama:**
   Setelah masuk, Anda akan berada di halaman "Berita Saya". Di sini Anda dapat melihat statistik tulisan Anda dan daftar berita yang pernah Anda kirim beserta statusnya (apakah masih "Menunggu Review" atau sudah "Terbit").

4. **Tulis Berita Baru:**
   - Klik tombol **"Tulis Berita Baru"**.
   - Isi form yang disediakan: **Judul**, **Tanggal**, **Lokasi**, **Isi Cerita** (gunakan editor teks untuk mengatur format), dan masukkan **URL Gambar** (jika ada).
   - Pastikan judul tidak melebihi 500 karakter.
   - Setelah selesai, klik **Kirim Berita (Draft)**.

5. **Menunggu Review:**
   Berita Anda akan tersimpan sebagai "Draft" dan statusnya menjadi "Menunggu Review". Berita belum akan tampil di website publik sampai disetujui oleh Admin Komsos.

---

## 3. Untuk Admin Komsos: Cara Review dan Publikasi

Setelah kontributor mengirimkan tulisan, Admin Komsos bertugas untuk memeriksa dan menerbitkannya.

1. **Buka Kelola Berita:**
   Login ke Admin CMS (`/admin/login`), lalu buka menu **"Berita"** di bawah grup "Publikasi & Konten Media".

2. **Cari Berita Masuk:**
   Berita dari kontributor akan otomatis muncul di urutan atas dengan status **Draft** (label abu-abu/kuning). Anda juga dapat melihat nama kontributor di bagian "Penulis".

3. **Tinjau dan Edit:**
   - Jika tulisan perlu dirapikan (misalnya memperbaiki *typo*, format, atau gambar), klik tombol **Edit** (ikon pensil biru).
   - Lakukan perbaikan yang diperlukan, lalu simpan perubahan.

4. **Terbitkan (Publish):**
   - Jika tulisan sudah layak tayang, klik **Tombol Publish** (ikon pesawat kertas/centang hijau) pada baris berita tersebut.
   - Status akan berubah menjadi **Published** dan berita akan langsung tayang di website publik paroki.

---

## Catatan Keamanan & Arsitektur
- **Isolasi Portal:** Sistem Portal Kontributor sepenuhnya terisolasi dari Admin CMS.
- Akun Kontributor tidak bisa mengakses rute `/admin/dashboard` dan akan selalu ditolak oleh `/api/admin/login`.
- Sebaliknya, akun Admin tidak disarankan menggunakan `/api/kontributor/login`.
- Migration database terkait fitur ini (`035_add_kontributor_role.sql`) dirancang agar aman untuk dijalankan ulang (*idempotent*).
