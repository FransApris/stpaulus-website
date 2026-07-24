# BUKU PANDUAN PENGGUNA (USER MANUAL)
## MODUL: CMS ADMIN LOGIN

* **Nama Menu:** CMS Admin Login
* **URL Endpoint:** `https://stpaulusjuanda.org/admin/login`
* **Sistem:** Content Management System (CMS) Gereja Katolik St. Paulus — Juanda

---

### 1. DESKRIPSI & FUNGSI UTAMA

#### Deskripsi Fitur
Menu **CMS Admin Login** merupakan gerbang utama (*gatekeeper*) otentikasi dan keamanan sistem manajemen konten website Paroki St. Paulus Juanda. Modul ini bertugas memastikan bahwa seluruh akses terhadap data sensitif paroki—seperti pendaftaran misa, reservasi ruangan/ruang rapat, pengelolaan berita/kronik paroki, dokumen sekretariat, dan statistik umat—hanya dapat dilakukan oleh personel yang terverifikasi dan berwenang.

Sistem otentikasi ini dilengkapi dengan enkripsi kata sandi berbasis standar keamanan tinggi serta mendukung lapisan verifikasi **Autentikasi Dua-Langkah (Two-Factor Authentication / 2FA)** berbasis TOTP (*Time-based One-Time Password*) dan *Backup Recovery Code* untuk perlindungan tingkat lanjut terhadap potensi peretasan.

#### Peran & Hak Akses Pengguna (Role Specifications)
Idealnya, pengguna yang diberikan kredensial untuk mengakses menu login ini dikelompokkan ke dalam beberapa peran (*role*):

| Peran (Role) | Keterangan & Hak Akses dalam Operasional Paroki |
| :--- | :--- |
| **Superadmin (Pastor Paroki / Tim IT Utama)** | Memiliki hak akses penuh (*Full Control*) ke seluruh fitur CMS, manajemen akun pengurus/admin lain, konfigurasi sistem, audit log, serta backup data. |
| **Admin Sekretariat (Staf Kantor Sekretariat)** | Mengelola jadwal Misa, pelayanan Sakramen, pengumuman gereja, verifikasi formulir permohonan umat, serta laporan statistik paroki. |
| **Admin Fasilitas / Sarpras** | Khusus mengelola persetujuan booking ruangan/ruang rapat, pengolahan kalender penggunaan fasilitas paroki, dan ketersediaan sarana. |
| **Editor / Kontributor (Tim Kominfo / Kronik)** | Mengelola penulisan artikel berita, warta paroki, galeri foto kegiatan, serta materi publikasi digital gereja. |

---

### 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)

Formulir login CMS terbagi ke dalam 2 tahap proses otentikasi (*Two-Step Authentication Flow*):

#### A. Formulir Tahap 1: Kredensial Utama (Username & Password)

| Nama Field | Tipe Field | Sifat | Keterangan & Ketentuan Pengisian |
| :--- | :--- | :--- | :--- |
| **Username** | Teks (`text`) | **Wajib** (*Required*) | Nama pengguna unik yang terdaftar resmi di basis data admin paroki. *Case-sensitive* (sensitif huruf besar/kecil). |
| **Password** | Karakter Tersembunyi (`password`) | **Wajib** (*Required*) | Kata sandi rahasia akun. Karakter akan disamarkan demi keamanan visual. |

#### B. Formulir Tahap 2: Autentikasi Dua-Langkah / 2FA (Khusus Akun 2FA Aktif)

| Nama Field | Tipe Field | Sifat | Keterangan & Ketentuan Pengisian |
| :--- | :--- | :--- | :--- |
| **Kode 6-Digit Authenticator** | Angka Numerik (`text`, max 6 digit) | **Wajib** (*Required* jika moda TOTP aktif) | Kode angka dinamis 6-digit yang dihasilkan oleh aplikasi Authenticator (seperti Google Authenticator atau Authy) di ponsel admin. Berubah setiap 30 detik. |
| **Recovery Backup Code** | Teks Kode (`text`, format `xxxx-xxxx`) | **Wajib** (*Required* jika memilih moda Backup Code) | Kode darurat pemulihan sekali pakai yang digunakan apabila ponsel/aplikasi Authenticator admin hilang atau tidak dapat diakses. |

---

### 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

#### A. Membuka Halaman Login CMS
1. Buka peramban web (*web browser*) seperti Google Chrome, Mozilla Firefox, atau Microsoft Edge.
2. Ketikkan alamat URL `https://stpaulusjuanda.org/admin/login` pada *address bar* peramban lalu tekan tombol **Enter**.
3. Sistem akan menampilkan antarmuka halaman login bersih dengan logo/judul **CMS Admin St. Paulus — Juanda**.

`[MASUKKAN SCREENSHOT DI SINI]`

---

#### B. Melakukan Login Standar (Username & Password)
1. Pada field **Username**, masukkan nama pengguna akun admin Anda.
2. Pada field **Password**, masukkan kata sandi akun Anda secara teliti.
3. Klik tombol **Lanjut Login** atau tekan tombol **Enter** pada keyboard.
4. Jika akun Anda **tidak mengaktifkan 2FA**:
   - Sistem akan langsung memverifikasi kredensial.
   - Apabila valid, sistem akan menyimpan token sesi dan secara otomatis mengarahkan (*redirect*) Anda ke halaman **Dashboard Admin** (`/admin/dashboard`).

`[MASUKKAN SCREENSHOT DI SINI]`

---

#### C. Melakukan Verifikasi 2FA (Jika Akun Mengaktifkan 2FA)
Jika akun Anda memiliki perlindungan 2FA yang aktif, setelah menekan **Lanjut Login**, sistem tidak langsung masuk ke dashboard melainkan menampilkan form tahap kedua:

##### Skenario C.1: Menggunakan Aplikasi Authenticator (Moda Standar)
1. Buka aplikasi **Google Authenticator** atau **Authy** pada peranti pintar (smartphone) Anda.
2. Cari token angka 6-digit untuk akun **St. Paulus Juanda CMS**.
3. Masukkan 6-digit angka tersebut pada field **Kode 6-Digit Authenticator**.
4. Klik tombol **Verifikasi & Masuk**.
5. Setelah berhasil, Anda akan dialihkan ke **Dashboard Admin**.

`[MASUKKAN SCREENSHOT DI SINI]`

##### Skenario C.2: Menggunakan Kode Pemulihan / Backup Code (Moda Darurat)
1. Pada halaman verifikasi 2FA, klik tautan **Gunakan Kode Pemulihan (Backup Code)** di bagian bawah tombol.
2. Tampilan input akan berubah menjadi field **Recovery Backup Code**.
3. Masukkan salah satu kode cadangan darurat milik Anda (contoh: `a1b2-c3d4`).
4. Klik tombol **Verifikasi & Masuk**.

`[MASUKKAN SCREENSHOT DI SINI]`

---

#### D. Keluar Sesi (*Logout*) & Penanganan Sesi Berakhir
1. Untuk mengakhiri sesi kerja demi keamanan, klik tombol atau ikon **Logout** yang berada di bagian sudut navigasi kanan atas pada halaman panel admin.
2. Sistem akan menghapus token otentikasi dari *storage* peramban (*sessionStorage* dan *localStorage*) dan mengembalikan Anda ke halaman **CMS Admin Login**.
3. Apabila Anda meninggalkan halaman admin tanpa beraktivitas dalam kurun waktu tertentu, sesi dapat kadaluarsa (*expired*). Saat Anda mencoba mengklik menu lain, sistem akan mengarahkan Anda kembali ke halaman login disertai pesan peringatan warna merah: *"Sesi Anda telah berakhir. Silakan login kembali."*

`[MASUKKAN SCREENSHOT DI SINI]`

---

### 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)

Untuk menjaga integritas dan keamanan data gereja, sistem memberlakukan batasan dan aturan validasi berikut:

1. **Mandatory Input (Wajib Isi):** Field **Username** dan **Password** tidak boleh kosong. Tombol kirim tidak akan dapat diproses jika salah satu field kosong.
2. **Keamanan Sesi Lokal (Storage Token):**
   - *Access Token* disimpan secara aman di `sessionStorage` (hanya berlaku selama tab peramban aktif).
   - *Refresh Token* disimpan di `localStorage` untuk memperbarui sesi login tanpa perlu mengetik ulang password secara konstan selama durasi aktif.
3. **Validasi Format 2FA TOTP:** Kode Authenticator wajib berupa 6 digit angka numerik. Pengisian selain angka atau kurang dari 6 digit akan ditolak oleh validasi antarmuka.
4. **Pembatasan Percobaan Login (Rate Limiting Security):**
   - Sistem dilengkapi dengan proteksi *Rate Limiter* API untuk mencegah serangan uji coba kata sandi secara beruntun (*Brute Force Attack*).
   - Jika terdapat percobaan login gagal berkali-kali dalam waktu singkat dari alamat IP yang sama, sistem akan memblokir sementara percobaan login berikutnya selama durasi tertentu.
5. **Autoredirect Pengguna Terverifikasi:** Jika staf admin yang sudah terotentikasi membuka kembali URL `/admin/login`, sistem akan secara otomatis mendeteksi sesi aktif dan mengalihkan antarmuka langsung ke `/admin/dashboard`.

---

### 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

Berikut adalah skenario kendala umum yang sering dihadapi oleh staf sekretariat operasional beserta langkah solusi cepatnya:

#### Skenario 1: Pesan Error "Username atau password salah"
* **Penyebab:** Kesalahan pengetikan (*typo*), tombol Caps Lock di keyboard aktif tanpa disadari, atau terdapat spasi tambahan pada awal/akhir username atau password.
* **Solusi Langkah Cepat:**
  1. Periksa lampu indikator **Caps Lock** pada keyboard Anda. Pastikan huruf besar/kecil diisi dengan tepat.
  2. Hapus seluruh isi field **Username** dan **Password**, lalu ketik ulang secara manual (hindari *copy-paste* berlebih yang berpotensi membawa spasi ghaib).
  3. Apabila staf tetap tidak bisa masuk, hubungi **Superadmin / Tim IT Paroki** untuk melakukan *reset password* melalui database/panel pengelolaan user.

#### Skenario 2: Kode 2FA / Authenticator Selalu Ditolak ("Kode Verifikasi Tidak Valid")
* **Penyebab:** Waktu (*clock/time zone*) pada smartphone staf tidak sinkron dengan waktu server standar (selisih detik menyebabkan kode TOTP kadaluarsa).
* **Solusi Langkah Cepat:**
  1. Masuk ke menu **Pengaturan Jam/Waktu** pada smartphone Anda, aktifkan pilihan **"Waktu Otomatis / Automatic Date & Time"** yang disinkronkan dari jaringan seluler.
  2. Buka kembali aplikasi Authenticator dan tunggu hingga kode 6-digit berganti baru, lalu masukkan kode terbaru tersebut.
  3. Jika perangkat smartphone hilang/rusak, klik opsi **Gunakan Kode Pemulihan (Backup Code)** lalu masukkan salah satu kode cadangan cetak yang pernah disimpan saat aktivasi 2FA.

#### Skenario 3: Terlempar Kembali ke Halaman Login Saat Sedang Bekerja
* **Penyebab:** Masa berlaku *Access Token* keamanan telah habis (sesi berakhir demi mencegah penyalahgunaan komputer yang ditinggalkan tanpa diawasi).
* **Solusi Langkah Cepat:**
  1. Jangan panik. Halaman login akan menampilkan petunjuk berwarna merah: *"Sesi Anda telah berakhir. Silakan login kembali."*
  2. Masukkan kembali **Username** & **Password** Anda untuk mendapatkan token sesi baru.
  3. Setelah login berhasil, Anda dapat melanjutkan pekerjaan mengolah data paroki dari halaman sebelumnya.

---

### RINGKASAN TINDAKAN PENTING STAF OPERASIONAL
* ⚠️ **JANGAN PERNAH** membagikan *Username*, *Password*, maupun *Backup Code* 2FA kepada pihak luar paroki.
* 🔒 Selalu klik tombol **Logout** saat selesai bertugas di komputer sekretariat bersama.
