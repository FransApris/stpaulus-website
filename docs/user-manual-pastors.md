# BAB XXVI: KELOLA ROMO BERTUGAS (Manajemen Profil Gembala Paroki)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/pastors`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Romo Bertugas** didesain secara khusus untuk mendokumentasikan rekam jejak para pastor (imam) yang sedang atau pernah berkarya melayani Paroki St. Paulus. Data yang diinput pada menu ini akan ditampilkan secara elegan di halaman publik "Profil Romo" atau "Sejarah Paroki", lengkap dengan masa bakti mereka.

Fitur ini bertindak sebagai museum digital untuk menghargai warisan penggembalaan para pastor terdahulu (Romo Paroki, Vikaris/Romo Rekan) sekaligus memperkenalkan gembala yang saat ini sedang aktif bertugas kepada umat paroki.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat Utama:** Memiliki kewenangan untuk menambah profil romo baru jika ada pergantian (*mutasi*) jabatan, serta mengarsipkan profil romo yang telah pindah tugas.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Berbeda dengan form biasa, form Romo Bertugas memiliki banyak elemen personal (*Curriculum Vitae*). Saat mengeklik **Tambah Data Romo**, parameter berikut akan muncul:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Posisi/Jabatan** | Dropdown | **Wajib** | Status gembala (Contoh: Kepala Paroki, Romo Rekan, dsb). |
| **Tahun Mulai** | Teks (Angka) | **Wajib** | Tahun di mana romo tersebut mulai ditugaskan di paroki (Contoh: 2024). |
| **Tahun Selesai** | Teks (Angka) | Opsional | Tahun romo tersebut dipindahtugaskan. Biarkan kosong (atau tulis "Sekarang") jika masih aktif. |
| **Status** | Dropdown | **Wajib** | Pilih "Aktif" jika masih bertugas, atau "Nonaktif" jika sudah pindah/pensiun. |
| **Biografi** | Teks Panjang | Opsional | Cerita singkat rekam jejak atau riwayat hidup romo. |
| **Kutipan / Motto** | Teks Panjang | Opsional | Motto tahbisan atau ayat Alkitab favorit romo. |
| **Pencapaian** | Teks Panjang | Opsional | Hal besar/fokus penggembalaan yang pernah diraih di paroki ini. |
| **Tempat & Tgl Lahir**| Teks & Datepicker| Opsional | Kota kelahiran dan tanggal lahir. |
| **Tanggal Imamat** | Datepicker | Opsional | Tanggal bersejarah (Tahbisan) romo tersebut menjadi imam. |
| **Kontak (Email/Telp)**| Teks Pendek | Opsional | Nomor telepon/email pastoran (hanya jika memang diizinkan untuk dipublikasikan). |
| **URL Foto / Upload** | Teks / File | Opsional | Anda bisa mengunggah foto resmi romo, atau menempelkan tautan (URL) gambar dari *database* luar. |
| **Tampilkan (Visible)**| Checkbox | Opsional | Centang agar profil ini bisa dilihat langsung oleh umat di halaman depan. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat Data Romo (Read)
1. Akses menu **Kelola Romo Bertugas** (Pastors) pada menu admin.
2. Layar akan menampilkan kartu-kartu profil atau tabel berisi foto dan nama romo. Biasanya, daftar ini diurutkan berdasarkan Romo Kepala yang sedang aktif terlebih dahulu.

`[MASUKKAN SCREENSHOT: Tampilan galeri/kartu daftar profil romo yang pernah dan sedang bertugas]`

### B. Cara Menambah Profil Romo Baru (Create)
Bila ada Romo Rekan baru yang ditugaskan oleh Keuskupan ke paroki Anda:
1. Klik tombol coklat/hijau **+ Tambah Romo**.
2. Jendela form profil akan terbuka. 
3. Isi secara lengkap data primer: **Nama** (biasanya di kotak bagian atas), **Posisi/Jabatan**, dan **Tahun Mulai** (Tahun saat serah terima jabatan).
4. Karena romo tersebut baru datang, kosongkan kolom **Tahun Selesai** dan atur **Status** ke "Aktif".
5. Lengkapi biodata lainnya seperti **Biografi**, **Tanggal Tahbisan**, dan unggah pas foto resminya (berjubah/berkasula).
6. Centang kotak **Tampilkan (Visible)** lalu klik **Simpan**.

`[MASUKKAN SCREENSHOT: Tampilan panjang form pengisian biodata Romo Bertugas]`

### C. Cara Mengubah Data / Menandai Pindah Tugas (Update)
Jika Romo Kepala dimutasi (pindah tugas) ke paroki lain:
1. Cari nama romo tersebut di daftar, lalu klik tombol **Edit** (ikon pensil).
2. Ubah kolom **Tahun Selesai** dengan tahun kepindahannya (Misal: 2026).
3. Ubah kotak **Status** dari "Aktif" menjadi **"Nonaktif"**.
4. (Penting) Tetap biarkan kotak **Tampilkan (Visible)** tercentang agar sejarah pelayanannya tetap terabadikan di halaman "Sejarah Paroki".
5. Klik **Simpan**.

### D. Cara Menghapus Data (Delete)
1. Langkah ini sebaiknya **dihindari** untuk menjaga arsip sejarah paroki, kecuali jika Anda memasukkan *data testing/fiktif*.
2. Jika memang harus dihapus, klik ikon merah **Tempat Sampah (Delete)** pada profil tersebut.
3. Konfirmasikan peringatan penghapusan yang muncul di layar.

`[MASUKKAN SCREENSHOT: Letak tombol Edit dan Delete di setiap kartu profil romo]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kewajiban Pengisian Tahun Mulai:** Anda tidak akan bisa menyimpan form apabila **Tahun Mulai** dikosongkan. Ini sangat penting karena sistem *website* biasanya akan mengurutkan susunan foto romo secara otomatis berdasarkan tahun pelayanannya (kronologis).
* **Visibilitas dan Status Berbeda:** 
   - Status **Nonaktif** berarti romo tersebut sudah tidak melayani lagi (pindah). 
   - Status **Tidak Tercentang di Visible (Tidak Tampil)** berarti profil romo disembunyikan sepenuhnya dari layar umat (*Draft*). Seorang romo bisa berstatus Nonaktif, tapi tetap Tampil (sebagai mantan romo paroki).
* **Batasan Format Foto:** Pastikan rasio foto yang diunggah proporsional (disarankan *Portrait* / vertikal 4:5 layaknya pas foto) agar wajah romo tidak tampak gepeng di halaman utama *website*.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Romo yang baru datang tahun ini fotonya malah berada di urutan paling bawah, terkalahkan oleh romo tahun 1990-an.
**Solusi:** Sistem mengurutkan romo berdasarkan *Tahun Mulai*. Pastikan Anda tidak salah mengetik tahun masuk di form Edit (Misal salah ketik tahun 1924 padahal seharusnya 2024). Perbaiki tahunnya dan urutannya akan otomatis mengikut ke atas.

**Skenario 2:**
**Gejala:** Saat saya memasukkan foto dengan URL Eksternal (bukan di-upload langsung), gambarnya malah pecah atau memunculkan ikon gambar rusak (broken link).
**Solusi:** Kemungkinan URL gambar yang Anda ambil dari *Google* di-blokir oleh pemilik aslinya (*hotlinking protection*) atau Anda memasukkan URL halaman web, bukan URL file gambarnya langsung. Saran terbaik: *Download* gambar tersebut ke laptop Anda, lalu gunakan tombol **Upload Foto** secara langsung dari dalam komputer Anda.

**Skenario 3:**
**Gejala:** Saya sudah menset Romo A menjadi "Nonaktif", tapi kenapa wajahnya masih muncul besar di halaman *Home* (Beranda) *website* paroki?
**Solusi:** Halaman Beranda (*Home*) biasanya dikonfigurasi untuk hanya menarik data romo yang statusnya **"Aktif"**. Jika hal ini terjadi, kemungkinan sistem *cache* (rekaman memori) pada *browser* umat masih menyimpan data lama. Coba tekan *Refresh* paksa (Ctrl + F5) pada halaman depan. Jika masih muncul, hubungi *Developer* karena mungkin ada filter *database* yang meleset di halaman Beranda.
