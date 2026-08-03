# BAB PANDUAN: PENDAFTARAN MANDIRI (REGISTRASI AKUN UMAT)

### 1. DESKRIPSI & FUNGSI UTAMA

Menu Pendaftaran Mandiri (Registrasi User) adalah pintu gerbang awal bagi umat, pengurus lingkungan, atau kelompok kategorial untuk mendapatkan hak akses ke dalam sistem website Paroki St. Paulus Juanda.

Fungsi utama dari menu ini adalah memungkinkan perwakilan umat untuk mendaftarkan data diri mereka secara mandiri. Setelah mendaftar dan disetujui (di-approve) oleh Sekretariat Paroki, umat dapat menggunakan akun tersebut untuk masuk (login) ke dalam sistem dan melakukan pemesanan (booking) ruangan atau fasilitas gereja.

**Hak Akses (Role/Aktor):**
Menu pendaftaran ini bersifat publik dan diperuntukkan bagi **Umat (Ketua Lingkungan, Koordinator Wilayah, Ketua Seksi/Kelompok Kategorial, atau perwakilan umat lainnya)** yang membutuhkan akses operasional di website paroki.

---

### 2. DAFTAR PARAMETER / FIELD FORM _(Form Fields Specification)_

Berikut adalah rincian kolom isian (form) yang harus dilengkapi oleh umat saat melakukan pendaftaran:

- **Nama Lengkap:**
  - _Jenis:_ Teks
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Diisi dengan nama Anda.
- **Username:**
  - _Jenis:_ Teks (tanpa spasi)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Nama pengguna yang akan digunakan untuk login (contoh: `budisantoso`).
- **Email:**
  - _Jenis:_ Teks (Format Email)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Alamat email aktif Anda. Info persetujuan akun akan dikirim ke email ini.
- **Password:**
  - _Jenis:_ Teks Rahasia
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Kata sandi untuk login. Harus terdiri dari minimal 6 karakter.
- **Konfirmasi Password:**
  - _Jenis:_ Teks Rahasia
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Ketik ulang kata sandi yang sama persis dengan kolom sebelumnya untuk mencegah salah ketik.
- **Nomor Telepon / HP:**
  - _Jenis:_ Angka/Teks
  - _Sifat:_ **Opsional (Namun sangat disarankan)**
  - _Keterangan:_ Nomor WhatsApp/Telepon yang bisa dihubungi oleh sekretariat paroki.
- **Kategori:**
  - _Jenis:_ Dropdown Pilihan
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Pilih kategori Anda (contoh: DPP, Wilayah, Lingkungan, Kategorial).
- **Nama Unit / Kelompok / Lingkungan:**
  - _Jenis:_ Teks
  - _Sifat:_ **Opsional (Optional)**
  - _Keterangan:_ Tuliskan secara spesifik asal kelompok Anda (contoh: "Lingkungan St. Yohanes", "OMK", dll).

---

### 3. PANDUAN LANGKAH DEMI LANGKAH _(Step-by-Step Tutorial)_

_(Catatan: Karena panduan ini ditujukan bagi pengguna akhir (Umat) pada halaman pendaftaran publik, fungsi seperti Mengubah (Update) dan Menghapus (Delete) hanya tersedia di profil akun setelah login. Berikut adalah alur kerja pengguna dari mendaftar hingga akun bisa digunakan)._

#### a. Cara Mengakses Halaman Pendaftaran

1. Buka aplikasi browser (Google Chrome, Safari, atau Firefox) di komputer/HP Anda.
2. Ketik alamat website paroki: `stpaulusjuanda.org` lalu tekan Enter.
3. Pada halaman utama, klik tombol/menu **Daftar** atau langsung akses alamat URL: `https://stpaulusjuanda.org/daftar`.
4. Anda akan melihat halaman bertuliskan **"Daftar Akun Pemesanan"**.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan awal halaman form pendaftaran]`

#### b. Cara Mendaftar dan Mengisi Data (Create)

1. Siapkan data diri Anda yang valid.
2. Mulai ketikkan **Nama Lengkap**, **Username**, dan **Email** di masing-masing kolom yang tersedia.
3. Buatlah **Password** (kata sandi) yang mudah diingat dan ulangi ketikan tersebut di kolom **Konfirmasi Password**.
4. Isi **Nomor Telepon/HP** untuk memudahkan koordinasi dengan sekretariat.
5. Klik kolom **Kategori** (akan muncul pilihan ke bawah), lalu pilih jenis kategori kelompok Anda. Jika diperlukan, perjelas dengan mengisi **Nama Unit / Kelompok**.
6. Periksa kembali seluruh ketikan Anda. Jika sudah benar, klik tombol berwarna hijau bertuliskan **Daftar Sekarang**.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan saat formulir sudah diisi lengkap dan tombol Daftar Sekarang siap ditekan]`

#### c. Cara Mengecek Status Persetujuan Akun

1. Setelah mengklik "Daftar Sekarang", Anda akan melihat layar sukses bertanda centang hijau ✅ dengan pesan **"Pendaftaran Berhasil!"**.
2. **Penting:** Akun Anda _belum_ bisa digunakan untuk login karena harus menunggu verifikasi (persetujuan) dari Admin Sekretariat.
3. Anda akan menerima email konfirmasi.
4. Anda dapat menekan tombol putih **Cek Status Akun** di layar sukses tersebut untuk mengecek apakah akun Anda sudah disetujui.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan halaman notifikasi sukses mendaftar (Success State)]`

#### d. Cara Login dan Mengubah Profil (Update/Delete)

1. Apabila akun sudah disetujui oleh admin, Anda akan mendapat notifikasi atau dapat langsung menuju ke menu Login.
2. Masukkan Username dan Password yang telah Anda buat.
3. Setelah masuk, di halaman **Dasbor/Profil Anda**, Anda dapat mengubah (Update) kata sandi atau data kontak Anda jika diperlukan, dengan menekan tombol **Edit Profil**.
4. Untuk penonaktifan akun (Delete), pengguna harus menginformasikan hal tersebut ke pihak Sekretariat Paroki karena hal ini berhubungan dengan hak pemesanan inventaris gereja.

---

### 4. VALIDASI ATURAN & BATASAN SISTEM _(Business Rules & Constraints)_

Sistem memiliki beberapa aturan yang mengamankan pendaftaran umat, antara lain:

- **Batas Minimal Password:** Kata sandi harus terdiri dari minimal **6 karakter**. Jika kurang dari itu, sistem tidak akan memproses pendaftaran.
- **Pencocokan Kata Sandi:** Kolom _Password_ dan _Konfirmasi Password_ tidak boleh berbeda (huruf besar/kecil berpengaruh).
- **Ketersediaan Email dan Username:** Anda tidak dapat mendaftar menggunakan Email atau Username yang sudah pernah digunakan oleh pengguna lain di sistem.
- **Sistem Verifikasi (Approval):** Pendaftaran yang sukses tidak otomatis membuat Anda bisa login. Sistem akan menahan akses masuk sampai Sekretariat Paroki memvalidasi bahwa Anda adalah perwakilan kelompok yang sah.

---

### 5. PANDUAN TROUBLESHOOTING _(Penyelesaian Masalah)_

Berikut adalah beberapa kendala yang mungkin Anda alami saat mendaftar, beserta solusinya:

- **Skenario 1: Muncul peringatan "Password dan konfirmasi password tidak cocok" atau teks merah di bawah kolom password.**
  - _Penyebab:_ Terdapat perbedaan ketikan (mungkin ada spasi lebih, atau salah huruf besar) antara sandi pertama dan kedua.
  - _Solusi Cepat:_ Hapus seluruh isi di kolom Password dan Konfirmasi Password, lalu ketik ulang keduanya dengan hati-hati.

- **Skenario 2: Saat ditekan Daftar Sekarang, muncul pesan "Gagal mendaftar" atau "Email sudah terdaftar".**
  - _Penyebab:_ Alamat email yang Anda masukkan sudah pernah digunakan mendaftar.
  - _Solusi Cepat:_ Jika Anda merasa sudah pernah mendaftar, klik teks **Login di sini** pada halaman yang sama, lalu gunakan menu **Lupa Password** untuk mengatur ulang kata sandi Anda. Anda juga bisa mencoba email lain.

- **Skenario 3: Muncul tulisan ⚠️ "Gagal memuat daftar kategori" di bawah dropdown kategori.**
  - _Penyebab:_ Terjadi gangguan jaringan internet di perangkat Anda, atau sistem website sedang dipelihara.
  - _Solusi Cepat:_ Segarkan (Refresh) halaman browser Anda (tekan F5). Jika masih muncul peringatan yang sama, silakan coba lagi beberapa saat kemudian.
