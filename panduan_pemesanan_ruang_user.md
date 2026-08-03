# BAB PANDUAN: PEMESANAN RUANGAN (ROOM BOOKING)

### 1. DESKRIPSI & FUNGSI UTAMA

Menu Pemesanan Ruangan (Booking) adalah sistem digital yang dirancang untuk mempermudah umat dalam memesan atau meminjam fasilitas gereja secara terorganisir. Sistem ini menggantikan pencatatan manual guna menghindari bentrok jadwal (double booking) antar kelompok.

Fungsi utama dari menu ini adalah menampilkan jadwal ruangan yang kosong secara aktual (*real-time*), mengotomatiskan pengecekan bentrok jadwal, dan mengelola jatah (kuota) pemesanan tiap kategori umat setiap bulannya.

**Hak Akses (Role/Aktor):**
Fitur pemesanan ruang ini ditujukan untuk **Umat (Ketua Lingkungan, Koordinator Wilayah, Pengurus Seksi/Kategorial)** yang telah mendaftarkan akun dan sudah disetujui (Approved) oleh admin sekretariat. Pengguna umum yang belum login (atau belum disetujui) hanya dapat melihat halaman peringatan.

---

### 2. DAFTAR PARAMETER / FIELD FORM _(Form Fields Specification)_

Saat Anda menekan tombol **Pesan** pada salah satu ruangan, Anda akan diminta mengisi formulir berikut:

- **Nama Acara:**
  - _Jenis:_ Teks
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Nama atau deskripsi kegiatan Anda (Contoh: "Rapat Pleno OMK", "Latihan Koor Lingkungan").
- **Tanggal Acara:**
  - _Jenis:_ Datepicker (Pemilih Tanggal)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Tanggal penggunaan ruangan. Anda tidak bisa memilih tanggal yang sudah lewat.
- **Waktu Mulai:**
  - _Jenis:_ Pilihan Jam (Timepicker)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Jam acara dimulai.
- **Waktu Selesai:**
  - _Jenis:_ Pilihan Jam (Timepicker)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Jam acara selesai. (Terdapat tombol *Preset Cepat* seperti +1 Jam, +2 Jam, Pagi, Siang, atau Malam).
- **Pemesanan Berulang / Rutin (Recurring):**
  - _Jenis:_ Kotak Centang (Checkbox)
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Centang jika kegiatan rutin dilakukan berkali-kali. Jika dicentang, akan memunculkan dua kolom tambahan:
    - **Frekuensi Pengulangan:** Dropdown pilihan (Mingguan, 2-Mingguan, atau Bulanan).
    - **Ulangi Sampai Tanggal:** Datepicker (Maksimal 90 hari ke depan).

---

### 3. PANDUAN LANGKAH DEMI LANGKAH _(Step-by-Step Tutorial)_

_(Catatan: Karena panduan ini ditujukan bagi pengguna akhir (Umat), fungsi seperti mengedit jadwal yang sudah disetujui atau menghapus riwayat adalah wewenang Admin. Umat hanya dapat membuat pesanan dan membatalkan pesanan yang statusnya masih PENDING)._

#### a. Cara Melihat Jadwal dan Ketersediaan Ruang
1. Pastikan Anda sudah **Login** menggunakan akun Anda.
2. Buka menu navigasi dan klik **Pemesanan Ruang** (atau akses URL `https://stpaulusjuanda.org/booking`).
3. Anda akan melihat dasbor informasi profil Anda beserta **Sisa Kuota Pemesanan Bulanan**.
4. Gulir ke bawah untuk melihat daftar ruangan yang tersedia. Anda juga dapat menggunakan bagian **📅 Jadwal Mingguan Ruangan** untuk melihat gambaran pemakaian ruang pada minggu ini atau minggu depan.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan Dasbor Kuota Umat dan Daftar Ruangan]`

#### b. Cara Menambah Pemesanan Baru (Create)
1. Pilih ruangan yang Anda butuhkan dengan mengklik tombol **Pesan** di bawah nama ruangan.
2. Jendela formulir (*Pop-up Modal*) akan muncul.
3. Masukkan **Nama Acara** dan pilih **Tanggal Acara**.
4. Tentukan **Waktu Mulai** dan **Waktu Selesai** (Gunakan tombol *Preset Cepat* jika ingin lebih praktis).
5. Sistem akan otomatis melakukan *loading* (Memeriksa ketersediaan ruangan...).
6. Jika ruangan kosong pada waktu tersebut, akan muncul notifikasi hijau. Jika ruangan bentrok (sudah dipesan orang lain), akan muncul notifikasi merah dan tombol konfirmasi akan dikunci.
7. Apabila diperlukan (untuk latihan mingguan, dll), centang kotak **Pemesanan Berulang** dan atur frekuensinya.
8. Setelah semua sesuai, klik tombol **Konfirmasi Pemesanan**.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan Pop-up Formulir Pemesanan dan Indikator Pengecekan Slot]`

#### c. Cara Mengecek dan Membatalkan Pesanan (View & Delete/Cancel)
1. Setelah memesan, periksa bagian **"Pemesanan Saya"** di bawah halaman.
2. Anda akan melihat pesanan baru Anda berstatus **MENUNGGU (PENDING)** (Berwarna Kuning). Ini berarti sekretariat sedang meninjau pesanan Anda.
3. Klik kotak pesanan tersebut untuk membuka jendela **Lihat Detail**, di mana Anda bisa membaca rincian lengkap pesanan Anda.
4. **Pembatalan:** Jika Anda berubah pikiran sebelum disetujui, Anda dapat menekan tombol merah **✕ Batalkan** pada daftar pesanan tersebut. Anda wajib mengetikkan *Alasan Pembatalan*.
5. Apabila disetujui oleh admin, status akan berubah menjadi hijau **DISETUJUI (APPROVED)**.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan Daftar Pemesanan Saya dengan Status Pending/Disetujui]`

---

### 4. VALIDASI ATURAN & BATASAN SISTEM _(Business Rules & Constraints)_

Sistem memiliki keamanan logika (*Business Logic*) yang secara otomatis memandu umat:

- **Sistem Kuota Bulanan:** Setiap kategori umat memiliki batas maksimal pemesanan dalam sebulan (misal: 3 kali/bulan). Jika "Sisa Kuota Anda: 0", tombol **Pesan** tidak akan bisa dikonfirmasi. (Pengecualian: Kategori DPP memiliki kuota tak terbatas).
- **Bentrok Jadwal (Hard Conflict):** Jika ada jadwal yang sudah berstatus **DISETUJUI** pada tanggal dan jam yang sama di ruang yang sama, sistem akan mengeluarkan peringatan merah dan memblokir pengajuan Anda.
- **Bentrok Menunggu (Soft Conflict):** Jika ada orang lain yang sudah mengajukan pada jam tersebut tapi masih berstatus **MENUNGGU**, Anda tetap bisa mengajukan pesanan. Admin sekretariat nantinya yang akan memutuskan siapa yang berhak memakai.
- **Batas Pemesanan Rutin (Recurring):** Fitur pemesanan berulang dibatasi **maksimal 90 hari** (3 bulan) dari tanggal acara pertama untuk mencegah orang memonopoli ruangan sepanjang tahun.
- **Ruangan Hak Pakai Permanen (Dedicated Room):** Beberapa ruangan ditandai sebagai hak pakai organisasi tertentu (Terdapat logo gembok 🔒). Anda tetap bisa memesan, namun dengan peringatan bahwa butuh izin khusus dari pihak terkait.

---

### 5. PANDUAN TROUBLESHOOTING _(Penyelesaian Masalah)_

Berikut adalah skenario kendala umum dan cara cepat mengatasinya:

- **Skenario 1: Muncul peringatan merah "Kuota bulan ini penuh!" dan tombol Konfirmasi mati (abu-abu).**
  - _Penyebab:_ Anda sudah mencapai batas maksimal pengajuan acara di bulan ini untuk kategori lingkungan/seksi Anda.
  - _Solusi Cepat:_ Hubungi pihak Sekretariat Paroki jika kegiatan Anda sangat mendesak agar dibuatkan jadwal langsung dari sisi Admin, atau tunggu hingga pergantian bulan untuk pemesanan baru.

- **Skenario 2: Saat memasukkan jam, muncul peringatan "Ruangan sudah dipesan pada waktu ini" padahal di kalender mingguan terlihat kosong.**
  - _Penyebab:_ Kemungkinan ada acara dadakan yang baru saja disetujui (Approved) beberapa detik yang lalu oleh pihak sekretariat.
  - _Solusi Cepat:_ Segarkan (Refresh/F5) halaman Anda untuk mendapatkan data terbaru. Geser jam acara Anda ke jam berikutnya yang kosong, atau pilih ruangan lain.

- **Skenario 3: Umat tidak bisa login untuk memesan ruangan, layar menampilkan "Login Diperlukan".**
  - _Penyebab:_ Umat mengakses tautan `/booking` tanpa masuk (login) ke dalam sistem, atau masa aktif sesi (session) sudah habis.
  - _Solusi Cepat:_ Klik tombol "Kembali ke Beranda", masukkan Username dan Password, lalu kembali pilih menu Pemesanan Ruang.
