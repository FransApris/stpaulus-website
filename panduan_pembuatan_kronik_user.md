# BAB PANDUAN: PEMBUATAN KRONIK (KONTRIBUTOR BERITA)

### 1. DESKRIPSI & FUNGSI UTAMA

Menu Pembuatan Kronik adalah fasilitas bagi umat untuk mencatat, mendokumentasikan, dan mempublikasikan kegiatan atau peristiwa penting yang terjadi di lingkungan, wilayah, maupun kelompok kategorial paroki. 

Fungsi utama menu ini adalah mengumpulkan liputan berita kegiatan dengan metode jurnalistik 5W1H (*What, Who, When, Where, Why, How*). Menu ini juga dilengkapi dengan fitur **Kecerdasan Buatan (AI)** yang dapat menyusun kerangka tulisan Anda menjadi narasi berita yang utuh dan profesional.

**Hak Akses (Role/Aktor):**
Menu ini diperuntukkan bagi pengguna dengan level **Kontributor Berita**, **Pengurus Lingkungan/Wilayah**, atau umat yang telah diberikan hak akses khusus oleh Sekretariat/Komsos Paroki.

---

### 2. DAFTAR PARAMETER / FIELD FORM _(Form Fields Specification)_

Saat Anda akan membuat tulisan Kronik baru, formulir yang disediakan terbagi menjadi beberapa bagian penting:

**Bagian Kategori:**
- **Kategori:**
  - _Jenis:_ Dropdown Pilihan
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Kategori otomatis disesuaikan dengan hak akses Anda (misal: "Kegiatan Wilayah").
- **Bagian (Section):**
  - _Jenis:_ Dropdown Pilihan
  - _Sifat:_ **Opsional (Optional)**
  - _Keterangan:_ Sub-kategori lebih spesifik (jika ada).

**Bagian WHAT (Apa yang Terjadi):**
- **Judul Kegiatan:**
  - _Jenis:_ Teks
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Nama acara (Contoh: "Perayaan Ekaristi Pemberkatan Keluarga").
- **Deskripsi Lengkap:**
  - _Jenis:_ Teks (Area besar)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Rincian peristiwa yang terjadi.
- **Foto Utama:**
  - _Jenis:_ File Upload (Gambar JPG/PNG)
  - _Sifat:_ **Opsional (Namun sangat disarankan)**
  - _Keterangan:_ Foto *thumbnail* yang akan tampil di halaman depan.
- **Galeri Foto:**
  - _Jenis:_ File Upload (Multiple Gambar JPG/PNG)
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Maksimal 5 foto dokumentasi pendukung acara.

**Bagian WHO (Siapa yang Terlibat):**
- **Yang Terlibat:**
  - _Jenis:_ Teks
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Menyebutkan nama-nama tokoh/pihak yang hadir.

**Bagian WHEN (Kapan):**
- **Tanggal & Waktu:**
  - _Jenis:_ Pemilih Waktu (Datetime-local)
  - _Sifat:_ **Wajib (Required)**
  - _Keterangan:_ Tanggal dan jam acara berlangsung.
- **Durasi:**
  - _Jenis:_ Teks
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Contoh: "2 Jam" atau "08.00 - 10.00".

**Bagian WHERE (Dimana):**
- **Lokasi & Alamat Lengkap:**
  - _Jenis:_ Teks
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Tempat acara berlangsung (misal: "Gereja St. Paulus").

**Bagian WHY & HOW (Mengapa & Bagaimana):**
- **Tujuan Kegiatan & Cara Pelaksanaan:**
  - _Jenis:_ Teks
  - _Sifat:_ **Opsional**
  - _Keterangan:_ Latar belakang dan metode jalannya acara.

---

### 3. PANDUAN LANGKAH DEMI LANGKAH _(Step-by-Step Tutorial)_

#### a. Cara Mengakses dan Melihat Daftar Kronik Sendiri
1. Pastikan Anda sudah masuk (Login) ke dalam website.
2. Klik profil Anda atau menu navigasi untuk masuk ke halaman **Manajemen Kronik** (atau melalui `stpaulusjuanda.org/kronik/manage`).
3. Di halaman utama Kronik, Anda dapat membaca daftar berita/kegiatan yang pernah Anda tulis.

#### b. Cara Menambah Data Baru & Membuat Narasi Otomatis (Create)
1. Pada halaman Manajemen Kronik, klik tombol biru **Tambah Kronik Baru**.
2. Anda akan diarahkan ke formulir penulisan. Silakan pilih **Kategori** terlebih dahulu.
3. Isilah poin-poin pertanyaan jurnalistik mulai dari WHAT hingga HOW secara singkat namun jelas.
4. Unggah **Foto Utama** dengan mengklik tombol "Choose File". Tunggu tulisan "Mengunggah..." selesai.
5. **(Fitur Spesial AI):** Jika Anda kesulitan merangkai kata, Anda dapat mengklik tombol ungu **Generate Narasi AI** di bagian bawah.
6. *Penting:* Agar AI bisa bekerja, minimal Anda harus mengisi Judul (What), Tanggal (When), dan Lokasi (Where).
7. AI akan membuatkan teks berita yang rapi. Anda bisa mereview hasilnya di jendela yang muncul.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan Form Pengisian 5W1H dan Tombol Generate Narasi AI]`

#### c. Cara Menyimpan Draft atau Submit untuk Review (Update)
1. Setelah tulisan Anda jadi, perhatikan dua tombol di paling bawah:
   - **Simpan sebagai Draft:** Jika Anda belum selesai menulis dan ingin melanjutkannya nanti. Berita tidak akan dikirim ke Komsos.
   - **Submit untuk Review:** Jika tulisan sudah selesai sempurna dan siap dibaca oleh admin Komsos Paroki.
2. Jika Anda memilih *Submit*, status tulisan Anda akan menjadi *Pending Review*. Anda harus menunggu persetujuan dari admin agar berita Anda tayang di halaman utama website paroki.

`[MASUKKAN SCREENSHOT DI SINI: Tampilan Tombol Draft dan Submit]`

#### d. Cara Menghapus Draft atau Kronik Sendiri (Delete)
1. Kembali ke halaman Manajemen Kronik awal.
2. Cari tulisan yang berstatus **DRAFT** atau **DITOLAK**.
3. Jika terdapat tombol berlogo tong sampah (Hapus), klik tombol tersebut untuk menghapusnya. *(Catatan: Tulisan yang sudah berstatus DISETUJUI / PUBLISHED biasanya hanya bisa dihapus oleh Admin Komsos).*

---

### 4. VALIDASI ATURAN & BATASAN SISTEM _(Business Rules & Constraints)_

- **Batasan Foto/Gambar:** Anda hanya dapat mengunggah 1 Foto Utama dan maksimal **5 Foto Galeri**.
- **Aturan Fitur AI:** Tombol *Generate Narasi AI* akan dinonaktifkan (berwarna abu-abu/redup) jika kolom wajib seperti Judul Acara, Tanggal, dan Lokasi belum diisi.
- **Kategori Otomatis:** Sistem akan mengunci (disable) beberapa kategori yang tidak relevan dengan jabatan atau hak akses Anda di sistem. (Misal: Umat wilayah A tidak bisa memasukkan berita ke kategori wilayah B).
- **Proses Persetujuan (Moderasi):** Sebuah tulisan tidak akan tayang secara publik di website meskipun Anda sudah mengklik "Submit". Semua tulisan harus diperiksa (direview) terlebih dahulu oleh Admin Komsos.

---

### 5. PANDUAN TROUBLESHOOTING _(Penyelesaian Masalah)_

Berikut adalah skenario kendala umum dan cara mengatasinya:

- **Skenario 1: Muncul peringatan "Minimal isi What, When, dan Where terlebih dahulu" di bagian bawah.**
  - _Penyebab:_ Anda mencoba mengklik tombol *Generate Narasi AI* namun data dasarnya masih kosong.
  - _Solusi Cepat:_ Gulir ke atas, pastikan kolom Judul, Tanggal, dan Lokasi telah Anda ketik, lalu coba klik tombol AI kembali.

- **Skenario 2: Gambar utama tidak mau terunggah (Loading terus-menerus atau Error).**
  - _Penyebab:_ Ukuran file gambar yang Anda masukkan dari kamera terlalu besar (biasanya lebih dari 5MB), atau koneksi internet tidak stabil.
  - _Solusi Cepat:_ Perkecil (*compress*) ukuran foto Anda menggunakan aplikasi HP atau melalui web pengecil gambar. Pastikan juga format gambar adalah JPG atau PNG, lalu coba unggah ulang.

- **Skenario 3: Saya klik "Simpan sebagai Draft", tapi tulisannya tidak muncul di halaman depan web paroki.**
  - _Penyebab:_ "Draft" berarti tulisan masih berada di meja kerja pribadi Anda dan ditutup dari publik.
  - _Solusi Cepat:_ Jika tulisan sudah benar, Anda harus masuk ke menu Edit kronik tersebut, gulir ke paling bawah, lalu ubah statusnya dengan menekan tombol **Submit untuk Review**. Tunggu admin menyetujuinya.
