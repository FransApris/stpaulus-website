# MANUAL BOOK: Prosedur Kondisi Darurat Keamanan Siber
**Paroki St. Paulus Juanda - Dokumen Rahasia Super Admin**

Buku Panduan (*Manual Book*) ini adalah pedoman operasional praktis yang secara spesifik dirancang untuk dieksekusi oleh Super Admin/Tim IT Pusat jika terdeteksi adanya insiden peretasan aktif, serangan siber, atau kebocoran data pada website atau database Paroki.

Jangan panik. Ikuti langkah 1, 2, dan 3 di bawah ini secara berurutan.

---

## TAHAP 1: CONTAINMENT (LOCKDOWN DARURAT)
**Kondisi:** Anda melihat ada data yang berubah dengan sendirinya, mendeteksi lalu lintas asing di server, atau mendapat laporan bahwa akun admin seksi tertentu telah dibajak.
**Tujuan:** Memutuskan akses peretas secara instan, mengusir semua pengguna yang sedang *login*, dan mengamankan rekaman forensik (*database* terakhir) tanpa mematikan mesin server.

### Eksekusi:
1. Buka terminal (CMD/PowerShell) atau konsol *cloud hosting* server Anda (seperti Railway / VPS).
2. Arahkan direktori (path) ke folder utama aplikasi Anda (tempat `package.json` berada).
3. Ketik perintah berikut dan tekan ENTER:
   ```bash
   npm run lockdown
   ```
4. **Apa yang terjadi secara otomatis?**
   - Skrip ini akan membuat satu file *Backup SQL* khusus di server Anda dengan stempel waktu saat itu juga.
   - Skrip ini merubah pengaturan Database untuk memaksa 23 halaman utama website berubah menjadi mode *Maintenance* (Pengunjung akan melihat layar perbaikan, bukan halaman asli).
   - Skrip ini masuk ke file `.env` dan merusak/mengacak sandi `JWT_SECRET`. Ini akan memutus koneksi peretas secara paksa.

5. **Langkah Wajib Lanjutan:**
   Segera **Restart** aplikasi Nuxt/Node.js Anda (via panel PM2 atau *dashboard hosting* Anda) agar *password secret* yang baru tersebut dibaca oleh sistem. Mulai saat ini, tidak ada satu orang pun yang bisa mengakses panel admin menggunakan sesi (*cookies/token*) yang lama.

---

## TAHAP 2: INVESTIGASI & PEMULIHAN (CLEANUP)
**Kondisi:** Sistem sudah di-*lockdown*. Tim IT sedang menginvestigasi kerusakan, menambal celah (*patching*), dan memastikan server bersih dari kode jahat (*malware/webshell*).
**Tujuan:** Menghentikan penyebaran insiden dan memeriksa apa yang diretas berdasarkan file *backup* forensik yang dibuat pada Tahap 1.

### Eksekusi:
1. Periksa riwayat *commit* di GitHub untuk memastikan tidak ada kode asing yang disisipkan peretas.
2. Jika perlu, buat server *Instance* baru dari GitHub (bukan server lama) untuk memastikan tidak ada *backdoor* (pintu belakang) yang tertinggal.
3. Kirimkan "Pemberitahuan Pemeliharaan Darurat" kepada umat sesuai *SOP Komunikasi Krisis* Anda. Jangan sebutkan detail teknis kebocoran.

---

## TAHAP 3: RESOLUSI & CLEAN SLATE (MEMBUKA KEMBALI AKSES)
**Kondisi:** Anda telah menambal lubang keamanan dan server dipastikan sudah 100% aman (steril). Anda ingin menghidupkan kembali layanan publik.
**Tujuan:** Membuka layanan untuk publik kembali, TAPI memastikan peretas yang mungkin mencuri *database password* kemarin tidak bisa menggunakannya kembali. Kita akan memaksa semua admin mengatur ulang *password* mereka.

### Eksekusi:
1. Di terminal server yang sama (pada *root folder* proyek), jalankan:
   ```bash
   npm run clean-slate
   ```
2. Anda akan diminta konfirmasi `YES`. Ketik `YES` lalu tekan ENTER.
3. **Apa yang terjadi secara otomatis?**
   - Sistem akan menandai semua akun pengurus (Admin Wilayah, BGKP, Komsos, dll - kecuali Anda) sebagai **Wajib Reset**.
   - Ketika mereka mencoba *login* menggunakan *username* dan *password* lama mereka (meskipun benar), sistem API akan menolak dan memunculkan *pop-up*:
     *"Demi keamanan paska-insiden, akun Anda diwajibkan untuk melakukan reset password. Silakan hubungi Super Admin Sekretariat."*

4. Buka kembali halaman **Manajemen Maintenance** (`/admin/maintenance`) menggunakan hak akses Super Admin Anda, lalu matikan mode *Maintenance* agar umat bisa kembali membuka jadwal misa dan memesan ruangan.

5. **Penanganan Pengurus:**
   Satu per satu pengurus Paroki akan menghubungi Anda karena tidak bisa masuk. Buka menu **Kelola Pengguna** (`/admin/users`) dan berikan mereka *password* baru secara manual (satu per satu). Ini memastikan Anda dapat memverifikasi identitas mereka secara langsung dan memastikan 100% keamanan organisasi pulih tanpa kompromi.

---
*(Dokumen ini bersifat sangat konfidensial dan hanya boleh diakses oleh Pastor Kepala, Ketua BGKP, dan Super Administrator Web Sekretariat.)*
