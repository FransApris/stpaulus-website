# BAB X: KELOLA KRONIK (Manajemen Sejarah & Peristiwa)

**URL Endpoint:** `https://stpaulusjuanda.org/admin/kronik`

## 1. DESKRIPSI & FUNGSI UTAMA

Menu **Kelola Kronik** berfungsi sebagai pusat pencatatan sejarah, dokumentasi acara penting, dan arsip peristiwa yang terjadi di Paroki St. Paulus Juanda. Sistem penulisan kronik dirancang dengan pendekatan jurnalistik komprehensif menggunakan kerangka **5W1H** (_What, Who, When, Where, Why, How_) agar dokumentasi gereja tersusun rapi, terstruktur, dan memiliki nilai sejarah jangka panjang.

**Akses Pengguna (Role):**
Menu ini idealnya dikelola oleh:

- **Superadmin / Admin Sekretariat:** Memiliki hak penuh untuk membuat, mengedit, menghapus, serta melakukan validasi (_Approve/Publish_) pada seluruh kronik.
- **Admin Komsos / Editor:** Dapat menulis, mengubah, dan mengunggah kronik, atau menyimpan sebagai _Draft_ sebelum di-_Publish_ secara resmi.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)

Saat Anda menekan tombol tambah atau edit, terdapat beberapa isian data yang harus dilengkapi. Berikut adalah rinciannya:

| Nama Field                  | Jenis Input        | Sifat       | Deskripsi & Fungsi                                                                                                                                          |
| :-------------------------- | :----------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kategori**                | Dropdown           | **Wajib**   | Pengelompokan kronik secara umum (Contoh: Kronik Gereja, DPP, BGKP, Wilayah, atau Lingkungan).                                                              |
| **Bagian (Section)**        | Dropdown           | Kondisional | Sub-kategori spesifik. _Field_ ini **Wajib** diisi jika Anda memilih kategori teritorial (seperti Wilayah/Lingkungan). Contoh isian: "Lingkungan St. Anna". |
| **Judul / Apa (What)**      | Teks Pendek        | **Wajib**   | Nama spesifik dari peristiwa/kegiatan (Maksimal satu kalimat padat).                                                                                        |
| **Deskripsi Lengkap**       | Rich Text Editor   | **Wajib**   | Kotak teks dinamis (seperti Ms.Word) untuk menjabarkan rincian lengkap peristiwa. Anda dapat menebalkan huruf atau membuat daftar poin di sini.             |
| **Siapa (Who)**             | Teks Panjang       | Opsional    | Mendata tokoh penting, kelompok, atau pihak mana saja yang terlibat dalam acara tersebut.                                                                   |
| **Tanggal & Waktu (When)**  | Date & Time Picker | **Wajib**   | Tanggal dan jam persis pelaksanaan kegiatan.                                                                                                                |
| **Durasi**                  | Teks Pendek        | Opsional    | Informasi lama kegiatan berlangsung (Contoh: "2 Jam", "1 Hari Penuh").                                                                                      |
| **Lokasi & Alamat (Where)** | Teks Pendek        | Opsional    | Nama gedung atau tempat (_Lokasi_) dan detail jalannya (_Alamat Lengkap_).                                                                                  |
| **Tujuan (Why)**            | Teks Panjang       | Opsional    | Alasan, latar belakang, atau tujuan utama mengapa kegiatan tersebut dilaksanakan.                                                                           |
| **Proses (How)**            | Teks Panjang       | Opsional    | Rangkuman jalannya acara dari awal hingga selesai (Susunan acara).                                                                                          |
| **Foto Utama**              | File Upload        | Opsional    | Unggah 1 foto utama (Thumbnail/Cover) berformat gambar (JPG/PNG).                                                                                           |
| **Galeri Foto**             | File Upload        | Opsional    | Unggah foto dokumentasi pendukung acara (Maksimal 5 foto).                                                                                                  |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)

1. Buka menu **Kelola Kronik** dari bilah navigasi samping (sidebar).
2. Anda akan melihat tabel berisi daftar kronik terbaru.
3. Gunakan baris filter di bagian atas tabel:
   - Pilih status (_Published, Draft, Pending, Archived_).
   - Pilih Kategori.
   - Atau ketik kata kunci di kolom **Pencarian**, lalu klik tombol **Filter** warna merah.

`[MASUKKAN SCREENSHOT: Tampilan tabel dan baris filter (dropdown dan tombol Filter)]`

### B. Cara Menambah Data Baru (Create)

1. Pada halaman utama Kronik, klik tombol **+ Tambah Kronik Baru** di pojok kanan atas.
2. Anda akan masuk ke form pembuatan. Silakan isi form berpanduan 5W1H dari atas ke bawah.
3. Unggah **Foto Utama** dan **Galeri Foto** (jika ada).
4. Gulir ke bagian paling bawah untuk memilih tindakan penyimpanan:
   - Klik **Simpan sebagai Draft** (Abu-abu): Jika belum selesai menulis dan ingin dilanjutkan nanti.
   - Klik **Kirim untuk Approval** (Biru): Jika Anda adalah staf yang membutuhkan persetujuan atasan sebelum kronik dipublikasikan.
   - Klik **Publish Langsung** (Emas/Coklat): Jika tulisan sudah final dan ingin langsung ditampilkan di website publik.

`[MASUKKAN SCREENSHOT: Tiga tombol aksi di bagian bawah form Tambah Kronik]`

### C. Cara Mengubah/Mengedit Data (Update)

1. Cari judul kronik yang ingin diperbaiki pada tabel halaman utama Kronik.
2. Pada kolom aksi di sebelah kanan tabel, klik tombol berlogo pensil (**Edit**).
3. Lakukan perubahan pada teks atau ganti foto jika diperlukan.
   _(Catatan: Untuk menghapus foto di galeri, klik tanda "X" kecil merah pada foto tersebut, lalu unggah yang baru)._
4. Klik tombol **Simpan** untuk memperbarui data ke sistem.

`[MASUKKAN SCREENSHOT: Posisi tombol Edit (logo pensil) di dalam baris tabel]`

### D. Cara Menghapus/Menonaktifkan Data (Archive/Delete)

Sistem ini menggunakan mekanisme _Soft Delete_ / Pengarsipan untuk menjaga jejak sejarah data.

1. Cari kronik yang ingin diturunkan pada tabel.
2. Klik tombol berlogo tempat sampah (**Delete/Archive**) di sebelah tombol Edit.
3. Sistem akan memunculkan peringatan konfirmasi. Jika yakin, klik **Ya, Hapus/Arsipkan**.
4. Kronik tersebut tidak akan muncul lagi di halaman publik paroki, namun masih tersimpan secara internal dengan status _Archived_.

`[MASUKKAN SCREENSHOT: Kotak dialog pop-up konfirmasi penghapusan data]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)

- **Kewajiban Sub-Kategori (Section):** Jika Anda memilih Kategori yang menuntut rincian pembagian (misalnya: Lingkungan), maka kolom _Bagian/Section_ sifatnya menjadi **Wajib**. Sistem tidak akan mau memproses penyimpanan jika kolom ini kosong.
- **Batas Maksimal Galeri:** Sistem secara otomatis memblokir unggahan untuk bagian Galeri Foto jika jumlah file yang dipilih **melebihi 5 buah foto**.
- **Ekstensi & Format File:** Sistem hanya akan membaca file dari direktori perangkat Anda yang memiliki ekstensi standar gambar (\*image/\*\* seperti `.jpg`, `.jpeg`, `.png`).

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:**
**Gejala:** Saat memilih kategori "Lingkungan", muncul kotak peringatan kuning bertuliskan: _"⚠️ Belum ada bagian untuk kategori ini..."_ dan form tidak bisa disimpan.
**Solusi:** Ini berarti daftar nama Lingkungan di _database_ belum dibuat. Klik link tulisan bergaris bawah **halaman Sections** pada peringatan tersebut, lalu tekan "Tambah Section", ketik nama Lingkungannya (Misal: St. Anna), dan simpan. Setelah itu, kembalilah ke form Tambah Kronik.

**Skenario 2:**
**Gejala:** Kotak pengisian "Deskripsi Lengkap" tidak muncul, hanya ada indikator _loading_ (lingkaran berputar) yang terus-menerus memuat.
**Solusi:** Modul teks (_CKEditor_) ini membutuhkan koneksi internet (CDN) untuk bisa dimuat. Pastikan koneksi WiFi/LAN admin sedang stabil. Coba segarkan ulang halaman dengan menekan tombol **F5** pada keyboard.

**Skenario 3:**
**Gejala:** Gagal memilih foto untuk kolom Galeri meskipun file yang dipilih sudah berupa gambar.
**Solusi:** Kemungkinan besar Anda langsung memilih/menyorot 6 foto (atau lebih) sekaligus dari komputer Anda. Kurangi jumlah _highlight_ foto maksimal menjadi 5 saja, lalu tekan _Open/Upload_.
