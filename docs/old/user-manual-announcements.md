# BAB XXIII: PENGUMUMAN GEREJA (Manajemen Poster & Informasi Umat)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/announcements`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Pengumuman Gereja** adalah etalase digital tempat Anda mengunggah informasi, poster kegiatan, imbauan, atau kabar sukacita/dukacita agar tampil di halaman depan *website* publik. 

Pengumuman yang dibuat di sini disajikan dalam format visual (gambar/poster) yang ditujukan untuk menarik perhatian umat secara instan. Fitur ini sangat canggih karena Anda bisa menautkan (mengaitkan) sebuah pengumuman gambar langsung dengan kalender "Agenda" yang sudah ada, sehingga ketika umat mengklik pengumuman tersebut, mereka bisa langsung masuk ke rincian jadwal.

**Akses Pengguna (Role):** 
* **Superadmin & Editor Komsos:** Mereka adalah kreator utama yang memublikasikan dan mendesain gambar poster sebelum diunggah ke portal.
* **Admin Sekretariat:** Bertugas menaikkan pengumuman administratif rutin (contoh: Pendaftaran Baptis, Bina Iman).

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Ketika mengeklik tombol **+ Tambah Pengumuman** atau saat Anda mengedit pengumuman lama, sebuah *form* layar penuh atau *pop-up* akan meminta rincian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Acara** | Teks Pendek | **Wajib** | Judul besar dari pengumuman. (Contoh: "Misa Pembukaan Tahun Liturgi", "Pendaftaran Komuni Pertama"). |
| **Jenis Kegiatan** | Dropdown | **Wajib** | Kategori internal pengumuman (Contoh: "Kegiatan", "Imbauan", "Sosialisasi"). |
| **Terkait Agenda** | Dropdown | Opsional | Jika pengumuman ini adalah versi poster dari jadwal yang sudah Anda buat di menu *Kelola Agenda*, Anda bisa memilih nama agendanya di sini agar informasinya terintegrasi. |
| **Tanggal Acara** | Date Picker | **Wajib** | Tanggal kapan acara pada pengumuman tersebut dilangsungkan. |
| **Jam Acara** | Time Picker | **Wajib** | Jam pelaksanaan kegiatan. |
| **Deskripsi** | Teks Panjang | Opsional | Keterangan tambahan (caption) jika poster tidak memuat teks yang cukup jelas. |
| **Gambar Pengumuman** | File Upload | **Wajib** | Tombol untuk mengunggah poster visual. (Mendukung format JPG, PNG, WEBP, GIF). |
| **Aktifkan Pengumuman** | Checkbox | Opsional | Jika dicentang, maka setelah disimpan pengumuman akan *Live* di website. Jika tidak dicentang, ia tersimpan sebagai *Draft*. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Buka menu **Pengumuman Gereja** dari *sidebar*.
2. Anda akan disajikan tata letak berbentuk *Grid/Cards* (Kotak-kotak) atau tabel yang memuat *(thumbnail)* pratinjau gambar poster dari masing-masing pengumuman.
3. Anda bisa memanfaatkan kotak pencarian (**Search**) di atas untuk mencari pengumuman berdasarkan nama acara.

`[MASUKKAN SCREENSHOT: Tampilan daftar Pengumuman beserta kotak pencariannya]`

### B. Cara Menambah Data Baru (Create)
1. Klik tombol **+ Tambah Pengumuman Baru**.
2. Isikan secara berurutan: **Nama Acara**, **Jenis Kegiatan**, **Tanggal**, dan **Jam**.
3. (Opsional) Jika pengumuman ini berkaitan dengan jadwal di kalender agenda, pilih nama agendanya di *dropdown* **Terkait Agenda**.
4. Klik area **Upload Gambar** atau tombol pencarian file, lalu pilih *file* poster dari komputer/laptop Anda. Tunggu hingga gambar pratinjaunya (*preview*) muncul.
5. Pastikan kotak **Aktifkan Pengumuman** sudah tercentang.
6. Klik **Simpan**.

`[MASUKKAN SCREENSHOT: Form penambahan Pengumuman Gereja lengkap dengan area Upload Gambar]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Cari kartu pengumuman yang ada salah pengetikan *(typo)* atau yang posternya ingin diganti (revisi desain).
2. Klik tombol berlambang **Pensil (Edit)** pada baris pengumuman tersebut.
3. Lakukan pengubahan. Jika ingin mengganti poster, cukup *upload* kembali gambar yang baru, sistem otomatis akan menimpa (*replace*) gambar yang lama.
4. Tekan **Simpan**.

### D. Cara Menghapus / Menyembunyikan Pengumuman
* **Menyembunyikan Sementara (Arsip):** Jika acara sudah lewat, lebih baik jangan dihapus, cukup klik **Edit**, hilangkan centang **Aktifkan Pengumuman**, lalu **Simpan**. Pengumuman akan turun dari website umat tapi datanya tetap aman.
* **Menghapus Permanen (Delete):** Jika salah unggah (misal: *upload* gambar pribadi), klik ikon **Tempat Sampah Merah**, konfirmasi peringatan, dan sistem akan menghapus data sekaligus *file* fotonya dari *server*.

`[MASUKKAN SCREENSHOT: Tampilan kartu pengumuman yang menunjukkan tombol Edit dan Hapus]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Upload Gambar:** *File* yang diunggah memiliki batasan maksimal (*Upload Size Limit*) biasanya 2MB atau 5MB (bergantung server). Usahakan selalu mematangkan desain di aplikasi *Canva* atau *Photoshop* dan mengekspornya ke format `.JPG` yang ringan agar *website* tetap memuat halaman dengan cepat. *File* `.PDF` tidak didukung di form ini.
* **Integrasi Tanggal:** Jika Anda menghubungkan pengumuman ini ke sebuah **Agenda**, usahakan Tanggal dan Jam-nya disamakan (agar umat tidak bingung ketika membaca).
* **Kewajiban Pengisian (Required):** Anda tidak akan bisa menyudahi pengisian form dan tombol *Simpan* tidak akan merespons jika Anda melupakan (*skip*) pengisian bagian-bagian yang wajib (Bintang Merah).

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya sudah menekan tombol "Simpan", tapi layar hanya *loading* berputar-putar dan kemudian muncul notifikasi "Error: File too large".
**Solusi:** Gambar poster (*flyer*) yang Anda coba unggah memiliki resolusi dan ukuran *file* yang terlalu besar (melebihi kapasitas maksimal sistem). Kompres atau perkecil resolusi gambar tersebut di komputer (misal menggunakan situs *iloveimg.com*), lalu *upload* ulang file yang lebih ringan.

**Skenario 2:**
**Gejala:** Saya baru saja membuat pengumuman, tapi kenapa tidak muncul sama sekali di halaman utama website umat?
**Solusi:** Anda kemungkinan besar lupa mencentang kotak centang (**Checkbox**) bertuliskan **Aktifkan Pengumuman** di bagian bawah layar sebelum menyimpannya. Silakan Edit pengumuman tersebut, centang kotaknya, dan Simpan.

**Skenario 3:**
**Gejala:** Pilihan "Misa Perdana Romo X" tidak ada di kotak *Terkait Agenda*.
**Solusi:** Dropdown *Terkait Agenda* hanya menarik data yang sudah Anda buat di menu **Kelola Agenda**. Jika Anda belum membuat jadwal Misa Perdana tersebut di menu *Kelola Agenda*, maka pilihannya tentu tidak akan muncul di sini. Buka *tab* baru, buat jadwalnya di menu Agenda terlebih dahulu, lalu kembali (*refresh*) ke halaman Pengumuman ini.
