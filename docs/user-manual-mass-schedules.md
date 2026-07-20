# BAB XIV: KELOLA JADWAL MISA (Manajemen Peribadatan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/mass-schedules`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Jadwal Misa** adalah pusat kendali untuk mengatur informasi jadwal peribadatan yang akan ditampilkan kepada umat di halaman utama dan halaman Jadwal Misa pada website publik. 

Berbeda dengan Agenda Kegiatan (yang bersifat umum), menu ini dirancang khusus dan terbagi menjadi tiga tab utama untuk memfasilitasi kebutuhan gereja:
1. **Misa Reguler**: Untuk jadwal misa mingguan dan harian yang bersifat tetap (rutin).
2. **Misa Khusus**: Untuk jadwal misa perayaan hari raya besar (Paskah, Natal), sakramen perkawinan, atau misa requiem yang memiliki tanggal spesifik.
3. **Devosi & Ibadat**: Untuk jadwal kegiatan rohani non-misa (seperti Jalan Salib, Doa Rosario, Adorasi).

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat:** Memiliki hak penuh untuk menambah, mengubah, dan menghapus seluruh jenis jadwal misa.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Tergantung pada jenis jadwal yang Anda buat (Reguler, Khusus, atau Devosi), *field* yang muncul pada *pop-up* form akan menyesuaikan:

### A. Misa Reguler (Rutin)
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Tipe Misa** | Teks Pendek | **Wajib** | Judul/jenis misa reguler (Contoh: "Misa Mingguan Pagi", "Misa Jumat Pertama"). |
| **Hari** | Dropdown Pilihan | **Wajib** | Memilih hari pelaksanaan secara berulang (Senin s.d. Minggu). |
| **Jam** | Time Picker | **Wajib** | Waktu spesifik pelaksanaan misa. |
| **Status Aktif** | Checkbox | Opsional | Centang agar jadwal rutin ini muncul di website. |

### B. Misa Khusus (Hari Raya / Spesifik)
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Misa** | Teks Pendek | **Wajib** | Judul acara perayaan. (Contoh: "Misa Malam Paskah I", "Misa Arwah"). |
| **Tanggal** | Date Picker | **Wajib** | Tanggal pasti pelaksanaan misa tersebut. |
| **Jam** | Time Picker | **Wajib** | Waktu pelaksanaan misa. |
| **Jenis Liturgi** | Dropdown Pilihan | **Wajib** | Memilih warna liturgi khusus untuk perayaan tersebut (jika disyaratkan). |
| **Lokasi** | Teks Pendek | Opsional | Tempat Misa (Contoh: "Gereja Utama", "Kapel"). |
| **Nama Romo** | Teks Pendek | Opsional | Nama imam yang akan memimpin ekaristi. |
| **Catatan Tambahan**| Teks Panjang | Opsional | Informasi khusus untuk umat (Contoh: "Wajib membawa daun palem", "Parkir di gedung sebelah"). |
| **Status Aktif** | Checkbox | Opsional | Centang agar jadwal khusus ini ditampilkan. |

### C. Devosi & Ibadat
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Judul Devosi** | Teks Pendek | **Wajib** | Nama ibadat (Contoh: "Jalan Salib", "Adorasi Sakramen Mahakudus"). |
| **Tipe Ibadat** | Dropdown Pilihan | **Wajib** | Pengelompokan jenis devosi. |
| **Hari** | Dropdown Pilihan | **Wajib** | Hari pelaksanaan devosi. |
| **Jam** | Time Picker | **Wajib** | Jam pelaksanaan ibadat. |
| **Lokasi** | Teks Pendek | Opsional | Tempat berkumpul (Contoh: "Gua Maria"). |
| **Deskripsi** | Teks Panjang | Opsional | Keterangan tata cara ibadat. |
| **Status Aktif** | Checkbox | Opsional | Centang agar jadwal ini aktif. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Buka menu **Kelola Jadwal Misa** dari panel admin.
2. Anda akan melihat **Tiga Tab/Menu Navigasi** di bagian atas (Reguler, Khusus, Devosi).
3. Klik salah satu tab tersebut untuk melihat daftar jadwal yang bersangkutan di dalam tabel.

`[MASUKKAN SCREENSHOT: Tampilan halaman Jadwal Misa yang menunjukkan 3 Tab Navigasi]`

### B. Cara Menambah Data Baru (Create)
1. Tentukan jenis jadwal apa yang ingin dibuat, lalu klik tab-nya terlebih dahulu (misal: masuk ke tab **Misa Khusus**).
2. Klik tombol **Tambah Misa Khusus** di kanan atas.
3. Jendela form akan muncul. Isikan data yang diperlukan seperti Tanggal, Jam, dan Nama Misa.
4. Pastikan kotak centang **Status Aktif** menyala agar jadwal tersebut terpublikasi.
5. Klik tombol **Simpan** (*Save*).

`[MASUKKAN SCREENSHOT: Tampilan pop-up pengisian Misa Khusus dengan pilihan romo dan lokasi]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Buka tab tempat jadwal tersebut berada, lalu cari judul misa di dalam tabel.
2. Di sebelah kanan baris jadwal tersebut, klik ikon pensil (**Edit**).
3. Anda bisa memperbarui Jam atau mengubah nama Romo yang bertugas jika ada pergantian mendadak.
4. Klik **Simpan** untuk memperbarui sistem.

### D. Cara Menghapus / Menonaktifkan Data
* **Jika Jadwal Libur Sementara:** Jangan dihapus. Cukup klik ikon Pensil (Edit), hilangkan centang **Status Aktif**, dan klik Simpan. Jadwal akan menghilang sementara dari layar umat.
* **Jika Ingin Menghapus Permanen:** Klik ikon tempat sampah (**Delete**) berwarna merah di sebelah tombol edit, lalu berikan konfirmasi penghapusan.

`[MASUKKAN SCREENSHOT: Tombol Edit dan Hapus pada tabel jadwal misa]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Input Jam (Time):** Sistem menggunakan format 24-Jam (00:00 - 23:59). Jika misa diadakan jam 5 sore, pastikan Anda mengisinya dengan `17:00`.
* **Prioritas Tampilan Misa Khusus:** Jadwal Misa Khusus yang tanggalnya sudah kedaluwarsa (sudah lewat) secara otomatis tidak akan ditekankan lagi di halaman publik umat. Sistem dirancang untuk menyoroti jadwal yang akan datang terdekat.
* **Kolom Wajib:** Form tidak akan bisa disimpan apabila Anda membiarkan kosong kolom-kolom primer seperti Nama Misa, Hari/Tanggal, atau Jam.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Administrator sudah membuat jadwal "Jalan Salib" untuk hari Jumat, tapi umat komplain tidak melihat jadwalnya di tabel Misa Mingguan.
**Solusi:** Kemungkinan besar administrator menginput "Jalan Salib" di dalam tab *Misa Reguler*. Seharusnya kegiatan non-ekaristi ini dimasukkan ke tab **Devosi & Ibadat** agar dikelompokkan dengan benar di layar umat.

**Skenario 2:**
**Gejala:** Saat ingin memasukkan Misa Malam Paskah (Misa Khusus), daftar pilihan pada kotak **Jenis Liturgi** tidak ada.
**Solusi:** Form Misa Khusus sangat bergantung pada "Kategori Liturgi". Anda harus menuju ke menu *Kelola Kategori Liturgi* (atau yang serupa) untuk menambahkan data "Paskah" beserta warna putih/emas. Setelah itu, kembalilah ke form Jadwal Misa Khusus.

**Skenario 3:**
**Gejala:** Sistem terus-menerus memunculkan *Error* saat menekan tombol Simpan di Misa Reguler.
**Solusi:** Periksa kembali pilihan **Hari** pada *dropdown*. Seringkali admin terburu-buru mengisi Jam namun melewatkan pemilihan hari (masih berstatus *"Pilih Hari"*), yang menyebabkan sistem menolak untuk menyimpan data jadwal rutin tersebut.
