# BAB XXIX: WILAYAH DAN LINGKUNGAN (Manajemen Teritorial Umat)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/teritorial`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Wilayah dan Lingkungan** adalah fondasi tata letak geografis (teritorial) dari Paroki St. Paulus. Menu ini difungsikan untuk mendata susunan pembagian area paroki, mulai dari skala besar (Wilayah) hingga ke unit basis terkecil (Lingkungan) beserta informasi kontak para ketuanya.

Sistem *database* ini sangat krusial karena ia menjadi acuan (referensi) bagi *dropdown* di halaman pendaftaran umat atau form-form lainnya. Jika ada penambahan wilayah baru dari keuskupan, Anda wajib menambahkannya di menu ini agar terbaca oleh seluruh ekosistem *website*.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Secara eksklusif mengelola pembagian wilayah. Editor biasa tidak memiliki hak akses karena ini mengubah struktur *database* utama paroki.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Halaman ini dibagi menjadi beberapa *Tab* (Wilayah, Lingkungan, dan Seksi). Form isian untuk penambahan/pengubahan data meliputi:

### A. Parameter Form "Wilayah"
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Wilayah** | Teks | **Wajib** | Sebutan atau nomor wilayah (Contoh: "Wilayah 1 - Juanda"). |
| **Keterangan** | Teks Panjang | Opsional | Cakupan jalan/daerah yang dinaungi wilayah ini. |
| **Tampilkan (Visible)**| Checkbox | Opsional | Centang agar wilayah ini masuk ke opsi pendaftaran umat. |

### B. Parameter Form "Lingkungan"
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Lingkungan** | Teks | **Wajib** | Nama pelindung (Contoh: "Lingkungan St. Petrus"). |
| **Induk Wilayah** | Dropdown | **Wajib** | Pilih wilayah mana yang menaungi lingkungan ini. |
| **Ketua Lingkungan** | Teks | Opsional | Nama ketua yang sedang menjabat saat ini. |
| **Nomor HP / WA** | Teks | Opsional | Nomor kontak ketua/sekretaris lingkungan. |
| **Email** | Teks | Opsional | Alamat *email* sekretariat lingkungan (jika ada). |
| **Alamat** | Teks Panjang | Opsional | Alamat tempat pertemuan rutin/balai lingkungan. |
| **Warna Label** | Color Picker | Opsional | Warna khusus (seperti merah/biru) untuk mempercantik tampilan kartu lingkungan di *website* utama. |
| **Tampilkan (Visible)**| Checkbox | Opsional | Centang agar nama lingkungan tayang di *website*. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Membaca & Beralih Tab (Read)
1. Buka menu **Wilayah, Lingkungan & Seksi** di menu panel admin.
2. Di bagian atas layar, di bawah judul utama, Anda akan menemukan baris menu navigasi (*Tabs*) yang bertuliskan: **Lingkungan**, **Wilayah**, dan **Seksi**.
3. Klik salah satu *Tab* tersebut untuk beralih mode. Misal: Klik *Tab Wilayah* untuk mengelola nama-nama wilayah.

`[MASUKKAN SCREENSHOT: Tampilan 3 baris menu Tab di atas tabel utama]`

### B. Cara Menambah Wilayah / Lingkungan Baru (Create)
**Contoh kasus: Menambah Lingkungan Baru**
1. Pastikan Anda sedang berada di tab **Lingkungan**.
2. Klik tombol **+ Tambah Lingkungan** di atas tabel.
3. Ketikkan **Nama Lingkungan** (Misal: "St. Yakobus").
4. Pilih **Induk Wilayah** dari daftar *dropdown*. (Jika *dropdown* kosong, Anda harus menambah datanya di *Tab Wilayah* terlebih dahulu).
5. Masukkan nama **Ketua** dan **Nomor HP** (sangat berguna agar sekretariat mudah menghubungi).
6. Sesuaikan **Warna Label** dan pastikan kotak **Tampilkan** dicentang.
7. Klik **Simpan**.

`[MASUKKAN SCREENSHOT: Form Tambah Lingkungan yang menampilkan pemilih warna dan kontak]`

### C. Cara Mengedit Data atau Mengganti Ketua (Update)
Saat terjadi serah terima jabatan ketua lingkungan yang baru:
1. Masuk ke tab **Lingkungan**, cari nama lingkungannya (Misal: St. Petrus).
2. Klik tombol **Edit (Ikon Pensil)** di sisi kanan.
3. Ganti isian di kolom **Ketua Lingkungan** dan **Nomor HP** dengan data ketua yang baru dilantik.
4. Klik **Simpan**. (Ingat, jangan mengubah Nama Lingkungannya kecuali ada mandat pemekaran).

### D. Cara Menghapus / Menonaktifkan Data (Delete)
1. Mengingat krusialnya relasi *database*, **sangat tidak disarankan** menghapus wilayah/lingkungan yang sedang berjalan, karena akan menyebabkan kerusakan data (*error*) pada umat yang telanjur mendaftar di lingkungan tersebut.
2. Jika sebuah lingkungan "dibekukan" atau digabung: Klik **Edit**, lalu matikan (hilangkan centang) pada kotak sakelar **Tampilkan (Visible)**, dan **Simpan**. Lingkungan tersebut akan diarsipkan.
3. Hanya hapus data (klik ikon **Tempat Sampah**) jika itu adalah data uji coba (fiktif).

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Keterikatan Hierarki (*Dependency*):** Anda tidak dapat membuat lingkungan baru tanpa memasukkannya ke dalam sebuah Wilayah. Oleh karena itu, *dropdown* "Induk Wilayah" bersifat wajib diisi.
* **Format Warna (Hex):** Pada form Lingkungan, Anda bisa memilih warna melalui palet kotak. Jika Anda mengetik secara manual, gunakan kode HTML *Hexadecimal* (Contoh: `#3B82F6`).

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat menambah Lingkungan, *dropdown* pilihan "Induk Wilayah" benar-benar kosong, tidak bisa diklik.
**Solusi:** Itu karena *database* Wilayah paroki masih kosong. Anda melompati langkah kerja. Pindah dulu ke *Tab Wilayah*, buat minimal satu buah Wilayah (Misal: "Wilayah 1"), simpan, lalu kembali lagi ke *Tab Lingkungan* untuk membuat lingkungannya.

**Skenario 2:**
**Gejala:** Saya menghapus Wilayah 3, tiba-tiba tiga (3) lingkungan yang ada di dalamnya hilang/error semua.
**Solusi:** Inilah mengapa opsi "Hapus (Delete)" sangat berbahaya di sistem *database* relasional. Menghapus induk akan memutus rantai anak-anaknya. Untuk memulihkan, Anda mungkin perlu mengecek menu "Pemulihan (Restore)" atau segera mengontak teknisi/developer. Solusi teraman: Jangan pernah dihapus, cukup hilangkan centang "Tampilkan (Visible)".

**Skenario 3:**
**Gejala:** Tabel lingkungan berantakan karena kolom "Keterangan" terlalu panjang saat dibaca di layar laptop kecil.
**Solusi:** Anda tidak perlu menuliskan sejarah panjang lingkungan di kolom "Keterangan". Cukup isi *Keterangan* dengan poin-poin padat (Maksimal 2 kalimat singkat) agar tabel admin Anda tetap terlihat rapi dan tidak terlalu tebal.
