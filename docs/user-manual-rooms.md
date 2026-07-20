# BAB XVII: KELOLA RUANGAN (Manajemen Peminjaman Fasilitas)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/rooms`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Ruangan** digunakan untuk mendata dan mengatur seluruh inventaris ruangan atau fasilitas gereja yang dapat dipinjam/di-booking oleh umat maupun pengurus paroki.

Melalui menu ini, Anda mengatur batas kapasitas ruangan, fasilitas yang tersedia (seperti AC, Proyektor), serta menentukan tingkat privasi ruangan tersebut—apakah ruangan itu boleh dipinjam oleh sembarang umat, atau hanya eksklusif untuk rapat pengurus tertentu. Pengaturan ini akan langsung memengaruhi pilihan yang muncul di form *Booking Ruangan* pada halaman publik.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Memiliki hak penuh untuk menambah ruangan baru, mengedit spesifikasinya, atau menonaktifkannya sementara saat sedang direnovasi.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat Anda ingin mendaftarkan ruangan baru (tombol **Tambah Ruangan Baru**) atau saat menekan opsi **Edit**, form akan meminta rincian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Ruangan** | Teks Pendek | **Wajib** | Nama spesifik fasilitas (Contoh: "Ruang Rapat Yohanes", "Aula Paroki"). |
| **Kapasitas** | Angka | **Wajib** | Daya tampung maksimal orang di dalam ruangan tersebut. (Penting agar umat tidak meminjam ruangan kecil untuk acara besar). |
| **Lokasi** | Dropdown | **Wajib** | Mengategorikan letak gedung (Contoh: "Gedung Pastoral Lt. 1", "Gereja Induk"). |
| **Fasilitas** | Teks | Opsional | Daftar inventaris di dalam ruangan, pisahkan dengan koma (Contoh: "AC, Proyektor, Papan Tulis, Sound System"). |
| **Memerlukan Persetujuan** | Dropdown | **Wajib** | Pilih **Ya** jika peminjaman ruang ini harus melalui *Acc* sekretariat. Pilih **Tidak** jika otomatis disetujui (biasanya jarang digunakan untuk gereja). |
| **Akses Kategori Umat (Allowed Categories)** | Checkbox | **Wajib** | Centang kategori pengguna mana saja yang berhak melihat dan meminjam ruangan ini (Contoh: Umat Paroki, DPP). Gunakan kotak **Pilih Semua** untuk mempercepat. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Akses menu **Kelola Ruangan** (atau *Rooms*) dari *sidebar*.
2. Anda akan melihat susunan ruangan yang ada, biasanya disajikan dalam bentuk deretan kartu (*Cards*) atau daftar tabel yang menampilkan Nama, Kapasitas, dan Lokasinya.

`[MASUKKAN SCREENSHOT: Tampilan halaman yang memuat daftar ruangan paroki]`

### B. Cara Menambah Data Baru (Create)
1. Temukan bagian atau kotak bertuliskan **Tambah Ruangan Baru** (umumnya di bagian atas halaman).
2. Isikan **Nama Ruangan**, **Kapasitas**, dan pilih **Lokasi** gedung.
3. Sebutkan **Fasilitas** yang ada agar umat tahu.
4. Tentukan kebijakan **Memerlukan Persetujuan** (Sangat disarankan selalu diset ke "Ya").
5. Centang kotak-kotak pada bagian **Kategori Pengguna** yang diizinkan untuk menyewa.
6. Klik tombol **Simpan** / **Tambah Ruangan**.

`[MASUKKAN SCREENSHOT: Form Tambah Ruangan Baru beserta deretan Checkbox kategori pengguna]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Cari ruangan yang ingin direvisi (misal: penambahan fasilitas AC baru).
2. Klik tombol **Edit** (Ikon pensil kuning/biru) pada kartu/baris ruangan tersebut.
3. Lakukan pembaruan angka kapasitas atau teks fasilitas.
4. Klik **Simpan** (*Update*).

`[MASUKKAN SCREENSHOT: Lokasi tombol Edit pada kartu/tabel ruangan]`

### D. Cara Menghapus / Menonaktifkan Ruangan (Delete)
1. Jika ruangan sedang direnovasi atau dialihfungsikan, temukan ruangan tersebut.
2. Klik tombol **Hapus** (Ikon tempat sampah merah).
3. Konfirmasikan persetujuan Anda pada kotak peringatan yang muncul. Ruangan tersebut akan lenyap dari daftar peminjaman umat.

*Catatan: Pastikan tidak ada jadwal peminjaman (*Booking*) aktif/mendatang di ruangan tersebut sebelum Anda menghapusnya, untuk menghindari kebingungan pada sistem.*

`[MASUKKAN SCREENSHOT: Dialog konfirmasi penghapusan data ruangan]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kewajiban Pengisian:** Anda tidak bisa menyimpan ruangan baru jika nama, kapasitas, dan lokasi tidak diisi.
* **Validasi Angka Kapasitas:** Kolom kapasitas hanya bisa menerima input *Angka* (0-9). Jika Anda mencoba memasukkan teks seperti "lima puluh", form akan menolak.
* **Akses Terbatas:** Ruangan hanya akan muncul di layar umat saat mereka mau *booking* JIKA tipe akun umat tersebut sesuai dengan **Akses Kategori Umat** yang Anda centang. (Contoh: Jika Anda hanya mencentang "DPP", maka umat biasa tidak akan pernah melihat ruangan ini di pilihan mereka).

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Ketua Lingkungan menelepon dan protes tidak bisa menemukan "Aula Utama" saat mau mengisi form *booking* ruangan di *website*.
**Solusi:** Kemungkinan besar Anda belum memberikan izin kepada kategori umat tersebut. Masuk ke **Kelola Ruangan**, cari "Aula Utama", klik Edit, lalu pastikan Anda telah mencentang kategori yang relevan (seperti "Pengurus Lingkungan" atau klik "Pilih Semua").

**Skenario 2:**
**Gejala:** Saya mau mengubah aturan persetujuan dari "Ya" menjadi "Tidak", tapi perubahan tidak tersimpan atau form error.
**Solusi:** Biasanya ada *field* (kotak) wajib lain yang terhapus secara tak sengaja, atau Anda belum memilih satupun *Checkbox* Kategori Pengguna. Pastikan minimal ada 1 kotak kategori pengguna yang tercentang sebelum Anda menekan tombol Simpan.

**Skenario 3:**
**Gejala:** Saat menghapus ruangan "Ruang Rapat A", sistem menolak atau memunculkan peringatan error terkait relasi database (foreign key).
**Solusi:** Hal ini menandakan masih ada riwayat *booking* aktif yang menautkan dirinya ke ruangan tersebut. Jangan dihapus. Sebagai *workaround* (solusi sementara), Anda bisa mengedit nama ruangan menjadi "(DITUTUP) Ruang Rapat A" dan menghapus semua centangan kategori penggunanya agar tidak ada umat yang bisa meminjamnya lagi, sampai riwayat *booking* lamanya kedaluwarsa.
