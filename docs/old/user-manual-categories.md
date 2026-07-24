# BAB XIII: KELOLA KATEGORI AGENDA (Manajemen Label Kegiatan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/categories`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Kategori Agenda** berfungsi sebagai "Data Master" untuk menentukan label atau klasifikasi acara yang ada di paroki. Kategori ini digunakan untuk mempermudah umat dalam menyaring dan mengenali jenis kegiatan pada kalender website (Misal: membedakan warna kalender antara kegiatan "Rapat", "Peribadatan", atau "Bina Iman").

Sistem ini bersifat mandatori; Anda tidak dapat menambahkan kegiatan baru di menu Agenda jika pilihan kategorinya belum terdaftar di menu ini.

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat:** Memiliki hak penuh untuk menambah, mengedit, dan menghapus kategori.
* **Editor / Admin Komsos:** Biasanya hanya memiliki akses baca (referensi) saat akan menyortir acara.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat mengeklik tombol **Tambah Kategori** atau mengedit kategori yang sudah ada, Anda akan dihadapkan pada sebuah kotak dialog (*pop-up*) dengan field pengisian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Kategori** | Teks Pendek | **Wajib** | Nama klasifikasi kegiatan. (Contoh: "Rapat DPP", "Pelayanan Sakramen", "Latihan Paduan Suara"). |
| **Warna (Color)** | Color Picker & Hex | **Wajib** | Indikator warna yang akan menyoroti kegiatan ini di kalender. Anda dapat mengeklik kotak warna untuk memilih langsung, atau mengetik kode heksadesimal (Contoh: `#882f1d`). |
| **Deskripsi** | Teks Panjang | Opsional | Penjelasan singkat terkait penggunaan kategori ini untuk panduan staf admin yang lain. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Pilih menu **Kategori Agenda** (atau *Categories*) dari panel samping.
2. Anda akan melihat halaman berisi daftar kategori yang diwakili dengan ikon/balok kecil sesuai warna yang telah diatur.
3. Gunakan **Kotak Pencarian** di kanan atas (berlogo kaca pembesar) untuk mencari nama kategori tertentu secara instan.

`[MASUKKAN SCREENSHOT: Tampilan daftar Kategori lengkap dengan indikator warnanya]`

### B. Cara Menambah Data Baru (Create)
1. Klik tombol coklat/marun **+ Tambah Kategori** (atau **Create Category**).
2. Sebuah jendela *form* akan muncul.
3. Ketikkan **Nama Kategori**.
4. Klik kotak **Warna** untuk menampilkan palet warna dan pilihlah warna yang paling merepresentasikan kategori tersebut (misal: Merah untuk Rapat, Biru untuk Pembinaan).
5. (Opsional) Tambahkan **Deskripsi**.
6. Klik **Simpan** (*Save*).

`[MASUKKAN SCREENSHOT: Pop-up form Tambah Kategori yang menampilkan Color Picker]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Sorot kategori yang ingin Anda ubah di dalam daftar.
2. Klik tombol **Edit** (ikon pensil).
3. Anda bisa mengubah nama kategori atau mengganti warnanya jika dirasa warna lama sulit dibaca/menyatu dengan latar belakang web.
4. Klik **Simpan** untuk mengunci perubahan. 
*(Catatan: Perubahan warna akan langsung memengaruhi tampilan seluruh kegiatan lama di kalender yang memakai kategori tersebut).*

`[MASUKKAN SCREENSHOT: Lokasi tombol edit di setiap baris/kartu kategori]`

### D. Cara Menghapus Data (Delete)
1. Temukan kategori yang sudah tidak lagi dipakai.
2. Klik tombol **Hapus** (ikon tempat sampah warna merah).
3. Kotak dialog konfirmasi akan muncul. Klik **Ya, Hapus** untuk membuang kategori tersebut secara permanen dari sistem.

`[MASUKKAN SCREENSHOT: Dialog konfirmasi peringatan penghapusan]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Pencegahan Data Kosong:** Kolom Nama Kategori dan Warna tidak boleh kosong. Jika Anda menekan *Simpan* dalam keadaan kosong, sistem akan memblokir tindakan tersebut.
* **Format Warna Hex:** Jika Anda mengetikkan warna secara manual di kolom teks, format wajib diawali dengan tanda pagar (`#`) dan diikuti oleh 6 digit kombinasi huruf A-F dan angka 0-9 (Contoh: `#FFFFFF` untuk putih).
* **Dependensi Agenda:** Jika Anda menghapus sebuah Kategori yang saat ini sedang digunakan oleh 5 kegiatan di menu Agenda, maka kemungkinan besar 5 kegiatan tersebut akan kehilangan label kategorinya atau tidak muncul secara normal di kalender. Sebaiknya ubah/edit kategorinya alih-alih menghapusnya jika sudah banyak digunakan.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Sudah membuat Kategori "Pemberkatan", warnanya sudah dipilih kuning (`#FFFF00`), tetapi teks/judul acaranya di kalender utama menjadi sulit terbaca (silau).
**Solusi:** Edit kategori tersebut dan ubah warnanya ke warna yang agak gelap (seperti Biru Tua atau Merah Marun) karena mayoritas kalender menggunakan warna teks putih di atas blok warna tersebut, atau *background* kalendernya sudah terang.

**Skenario 2:**
**Gejala:** Saat menyimpan kategori baru, muncul pesan error atau sistem tidak merespons, padahal Nama Kategori sudah diisi.
**Solusi:** Cek kembali format input pada kotak warna (*Color*). Jika Anda salah mengetikkan kombinasi (misal: kurang tanda pagar, atau jumlah huruf kurang dari 6 digit seperti `#FF0`), HTML *Color Picker* tidak akan bisa membaca dan mengakibatkan tombol *Simpan* terkunci. Gunakan fitur klik palet warna otomatis saja untuk lebih amannya.

**Skenario 3:**
**Gejala:** Saya terlanjur menghapus Kategori "Ibadat", dan tiba-tiba banyak kegiatan hilang dari kalender umat.
**Solusi:** Segera buat Kategori baru dengan nama yang persis sama ("Ibadat"). Kemudian buka kembali menu **Kelola Agenda**, cari kegiatan yang hilang, lalu *Edit* dan pilih ulang Kategori "Ibadat" yang baru saja Anda buat.
