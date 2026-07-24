# BAB XXV: KELOLA DOKUMEN (Pusat Unduhan & Arsip)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/documents`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Dokumen** merupakan perpustakaan virtual atau sentra penyimpanan (*cloud storage*) khusus milik paroki. Menu ini digunakan untuk mengunggah berbagai macam *file* administrasi—mulai dari formulir pendaftaran sakramen, surat keputusan, panduan koor, hingga laporan keuangan tahunan.

Seluruh *file* yang Anda unggah di sini akan langsung terhubung ke halaman "Pusat Unduhan" (Download Center) di *website* publik, sehingga umat bisa dengan mudah mengunduh (*download*) formulir atau dokumen tersebut dari rumah mereka masing-masing tanpa harus memintanya secara fisik ke kantor sekretariat.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Bertanggung jawab sepenuhnya atas manajemen pengarsipan, mengunggah *file* baru, dan menghapus dokumen yang sudah kedaluwarsa.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Ketika mengeklik tombol **Tambah Dokumen** atau saat Anda mengedit dokumen, jendela formulir akan muncul dengan parameter isian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Judul Dokumen** | Teks Pendek | **Wajib** | Nama terang *file* yang akan dibaca oleh umat. (Contoh: "Formulir Pendaftaran Sakramen Krisma 2026"). |
| **Kategori** | Dropdown Pilihan | **Wajib** | Pengelompokan dokumen agar mudah dicari (Contoh: "Formulir", "Laporan"). *Catatan: Jika daftar ini kosong, Anda harus membuatnya dulu di menu Kelola Kategori Dokumen*. |
| **Deskripsi** | Teks Panjang | Opsional | Keterangan tambahan (Contoh: "Harap di-print di kertas ukuran F4 dan dikumpulkan ke ketua lingkungan"). |
| **Unggah File (*Upload*)**| File Upload | **Wajib** (saat baru) | Tombol untuk mencari *file* dari komputer Anda (biasanya mendukung format PDF, DOCX, XLSX, dsb). *Bersifat opsional saat mode Edit.* |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Akses menu **Kelola Dokumen** dari panel admin.
2. Anda akan melihat daftar semua dokumen yang pernah diunggah.
3. Untuk mempermudah pencarian, gunakan filter *dropdown* **Kategori** di bagian atas tabel untuk hanya menampilkan kelompok dokumen tertentu (misal: memfilter hanya melihat kumpulan "Surat Keputusan").

`[MASUKKAN SCREENSHOT: Tampilan tabel Kelola Dokumen dengan filter kategori di bagian atas]`

### B. Cara Menambah Dokumen Baru (Create)
1. Klik tombol **+ Tambah Dokumen** di pojok kanan atas tabel.
2. Saat *pop-up* form muncul, masukkan **Judul Dokumen**.
3. Pilih **Kategori** yang tepat.
4. (Opsional) Ketik instruksi singkat di kotak **Deskripsi**.
5. Klik area tombol **Pilih File (Choose File)**, dan carilah *file* (seperti PDF atau Word) yang ingin Anda bagikan kepada umat dari komputer/laptop Anda.
6. Tunggu hingga nama *file* muncul di samping tombol, lalu klik **Simpan**.

`[MASUKKAN SCREENSHOT: Jendela pengisian form Tambah Dokumen]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Cari dokumen yang ingin direvisi (misalnya: Anda ingin memperbaiki salah ketik pada judul dokumen).
2. Klik tombol dengan ikon **Pensil (Edit)** di sebelah kanan baris dokumen tersebut.
3. Ubah teks *Judul* atau *Deskripsi*-nya. 
4. Jika Anda ingin mengganti *file*-nya (karena *file* lama ternyata salah/revisi), cukup *upload file* baru di kotak yang disediakan. Jika *file*-nya sudah benar dan Anda hanya ingin merubah judulnya, biarkan kotak *upload* tetap kosong.
5. Tekan **Simpan**.

### D. Cara Menghapus Dokumen (Delete)
1. Temukan dokumen yang sudah kedaluwarsa atau ditarik dari peredaran (Misal: "Form Paskah 2024").
2. Klik ikon berwarna merah berbentuk **Tempat Sampah (Delete)**.
3. Kotak konfirmasi peringatan akan muncul. Klik **Ya/OK** untuk menghapus data secara permanen, sekaligus membebaskan sisa ruang penyimpanan di *server* website.

`[MASUKKAN SCREENSHOT: Tampilan tombol Edit dan Hapus pada setiap baris dokumen]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kewajiban Upload Pertama:** Saat Anda menekan tombol "Tambah Dokumen" (buat baru), sistem mewajibkan Anda melampirkan sebuah *file*. Tombol simpan tidak akan bisa memproses data kosong.
* **Batas Ukuran & Format File:** Seringkali *server* membatasi ukuran maksimal *file* yang diunggah (biasanya 5MB hingga 10MB per *file*). Sangat direkomendasikan untuk **selalu menggunakan format `.PDF`** agar *file* tidak berantakan (*layout error*) saat umat mengunduh dan membukanya di HP mereka, tidak peduli apa pun perangkatnya.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat membuat dokumen baru, daftar pilihan pada menu *dropdown* "Kategori" sama sekali tidak ada yang muncul (kosong).
**Solusi:** Menu ini mewajibkan adanya kategori sebelum dokumen bisa diunggah. Tinggalkan halaman ini sebentar, navigasikan ke menu **Kelola Kategori Dokumen**, buat kategori baru (misal: "Dokumen Umum"), lalu kembali lagi ke halaman ini. Pilihan tersebut akan segera tersedia.

**Skenario 2:**
**Gejala:** Proses *upload* selalu gagal (macet) di tengah jalan, atau muncul pesan *Error: Payload too large*.
**Solusi:** *File* yang Anda unggah terlalu besar (melebihi kapasitas batas wajar *server*, misalnya lebih dari 10MB). Buka *file* PDF Anda di komputer, gunakan layanan kompresi (seperti *ilovepdf.com*), dan *upload* ulang *file* hasil kompresinya.

**Skenario 3:**
**Gejala:** Mengapa setiap kali umat *download file* dari website dan membukanya di Microsoft Word mereka, susunan kalimatnya berantakan?
**Solusi:** Ini adalah sifat alami dari ekstensi *.docx* (Word) jika dibuka di komputer berbeda yang memiliki versi *Office* atau jenis *font* yang berbeda. Solusi mutlak: Biasakan untuk selalu menyimpan formulir Anda dari MS Word ke format **PDF** (*Save as PDF*) di komputer Anda, barulah unggah *file* PDF tersebut ke *website* ini.
