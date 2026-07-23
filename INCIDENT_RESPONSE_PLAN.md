# Incident Response & Disaster Recovery Plan (IR/DRP)
**Paroki St. Paulus Juanda - Website & Sistem Informasi**

Dokumen ini merupakan panduan teknis langkah demi langkah (Blueprint) yang harus dieksekusi secara berurutan apabila terjadi insiden peretasan, kebocoran data, atau kerusakan sistem secara total.

---

## 1. Strategi Isolasi & Sanitasi (Containment)
**Tujuan:** Menghentikan pergerakan peretas dan mencegah eksfiltrasi data lebih lanjut tanpa merusak jejak digital (bukti forensik).

### Langkah Teknis:
1. **Aktifkan Maintenance Mode Global (Level Database/DNS):**
   - Jangan sekadar mematikan fitur di UI. Arahkan DNS (misal via Cloudflare) ke halaman statis `503 Service Unavailable`, atau putuskan koneksi _routing_ di level web server/proxy (seperti Nginx atau Railway).
2. **Isolasi Jaringan (Disconnect, DO NOT Power Off):**
   - Jika menggunakan VPS/VM, putuskan koneksi jaringan eksternal (Disable Network Interface), tetapi **jangan matikan (shutdown) server**. Mematikan server akan menghapus data berharga di memori volatil (RAM) yang mungkin menyimpan _payload_ malware, _active network connections_, atau _decryption keys_.
3. **Bekukan Snapshot & Log (Forensic Preservation):**
   - Ambil _Snapshot_ server/database segera setelah jaringan diputus.
   - Amankan log sistem (`/var/log/*`), log akses web server, dan log error aplikasi sebelum tertimpa (log rotasi).
4. **Cabut Semua Akses Sementara:**
   - Hapus/bekukan akses SSH, token API, dan paksa _logout_ semua sesi pengguna (jika memungkinkan dengan menghapus/merotasi JWT Secret).

---

## 2. Skenario Pemulihan Data & Sistem (Restoration)
**Tujuan:** Mengembalikan layanan ke kondisi operasional dengan data yang dipastikan bersih.

### Pemahaman RPO dan RTO:
- **RPO (Recovery Point Objective):** Toleransi kehilangan data (misalnya: jika _backup_ dilakukan setiap hari jam 00:00, maka insiden jam 15:00 akan mengakibatkan RPO 15 jam data hilang). Memulihkan 100% data hingga detik insiden nyaris mustahil tanpa sistem replikasi *Real-Time* (Hot Backup).
- **RTO (Recovery Time Objective):** Waktu yang dibutuhkan dari sistem mati hingga kembali menyala penuh (misal: target 4 jam).

### Langkah Pemulihan:
1. **Identifikasi Titik Infeksi Terakhir (Last Known Good Configuration):**
   - Tentukan kapan kompromi pertama kali terjadi melalui analisis log.
2. **Pilih Backup yang Tepat:**
   - Jangan gunakan _backup_ yang diambil **setelah** titik infeksi. Gunakan _Cold Backup_ (terpisah dari jaringan utama) yang diambil **sebelum** insiden.
3. **Verifikasi Integritas Backup (Sanitasi):**
   - _Restore backup_ tersebut di **Environment Terisolasi (Sandbox/Staging)** terlebih dahulu.
   - Lakukan pemindaian _malware_, periksa adanya penambahan _user_ admin siluman (_Rogue Admin_), dan cek apakah ada kode sisipan (backdoor/webshell) di direktori publik (seperti `/public` atau `uploads`).
4. **Migrasi Data Bersih:**
   - Setelah sistem staging dinyatakan bersih, ekspor ulang data bersih tersebut untuk disiapkan ke server _production_ yang baru.

---

## 3. Hardening Pasca-Insiden (Re-building Environment)
**Tujuan:** Memastikan infrastruktur baru benar-benar steril dan kerentanan sebelumnya telah ditutup.

### Langkah Teknis:
1. **Re-Provisioning Server dari Nol (Zero-Trust):**
   - Jangan pernah menggunakan ulang server lama (bahkan jika sudah dibersihkan). Buat instans server yang benar-benar baru dari _image_ sistem operasi bawaan pabrik (Fresh Install).
2. **Rotasi Total Semua Kredensial (The Great Key Rotation):**
   - **Database:** Buat _username_ dan _password_ database yang baru (jangan gunakan kredensial lama).
   - **Environment Variables (.env):** Ganti JWT Secret, API Keys (Cloudinary, Google API, dll), dan SMTP Passwords. Kredensial lama anggap sudah bocor.
   - **SSL/TLS:** Revoke sertifikat SSL yang lama dan *generate* ulang sertifikat SSL/HTTPS yang baru, khawatir *private key* lama telah diekstrak peretas.
3. **Terapkan Patch dan Fix:**
   - Segera tutup celah kerentanan (Patching) yang menjadi vektor serangan awal (hasil dari analisis sementara).
4. **Deploy Ulang via CI/CD:**
   - Lakukan deployment aplikasi langsung dari *Source Code Repository* (GitHub) utama yang sudah diverifikasi, bukan dari *copy-paste* folder server lama.

---

## 4. Audit & Post-Mortem Analysis
**Tujuan:** Menganalisis bagaimana peretasan bisa terjadi dan belajar dari insiden untuk mencegah kejadian berulang (Root Cause Analysis).

### Langkah Analisis:
1. **Analisis Log Komprehensif:**
   - Gunakan snapshot server lama yang diisolasi (pada Tahap 1) untuk menganalisis jejak peretas: alamat IP mana yang menyerang, URL apa yang ditembak, dan *payload* apa yang dimasukkan.
2. **Root Cause Analysis (RCA):**
   - Temukan vektor masuk utama: Apakah dari *SQL Injection*, *Phishing* ke akun admin, kerentanan pustaka *third-party* (Supply Chain Attack), atau *Brute Force*?
3. **Penyusunan Laporan Pasca-Insiden:**
   - Dokumentasikan kronologi (Timeline), dampak, dan langkah teknis apa yang efektif dan gagal.
4. **Review Kebijakan dan Peningkatan (Continuous Improvement):**
   - Berdasarkan akar masalah, tambahkan lapisan proteksi baru (misal: aktifkan 2FA, tambahkan Web Application Firewall (WAF), atur *Rate Limiting* yang lebih ketat, atau perbaiki jadwal *backup* untuk memperkecil RPO).
