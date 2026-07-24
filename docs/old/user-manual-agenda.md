# BAB XII: KELOLA AGENDA (Manajemen Jadwal & Kegiatan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/agenda`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Agenda** adalah pusat penjadwalan dan pendataan seluruh kegiatan kalender paroki. Setiap acara, rapat, pelayanan rutin, maupun perayaan besar gerejawi yang Anda masukkan di menu ini akan otomatis tersinkronisasi dan ditampilkan pada kalender website publik, sehingga umat dapat terus *up-to-date* dengan jadwal gereja terkini.

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat:** Memiliki hak akses penuh (*Create, Read, Update, Delete*) untuk menyusun dan merombak kalender agenda paroki.
* **Admin Terkait:** Staf atau pengurus khusus yang diberikan *permission* `manage_agenda` oleh sistem.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat Anda menekan tombol **Tambah Agenda Baru** atau tombol **Edit**, akan muncul *pop-up* form dengan rincian isian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Kegiatan** | Teks Pendek | **Wajib** | Judul atau nama spesifik dari acara. (Contoh: "Misa Malam Natal", "Rapat Pleno DPP"). |
| **Tanggal Mulai** | Date & Time Picker | **Wajib** | Tanggal dan jam tepat acara tersebut dimulai. |
| **Tanggal Selesai** | Date & Time Picker | Opsional | Tanggal dan jam acara berakhir. Kosongkan jika acara hanya berlangsung sebentar dan tidak memiliki waktu pasti selesai. |
| **Lokasi** | Teks Pendek | **Wajib** | Tempat diselenggarakannya acara. (Contoh: "Gedung Pastoral Lt.2", "Gereja Utama"). |
| **Kategori** | Dropdown Pilihan | **Wajib** | Mengelompokkan jenis agenda. (Contoh: Rapat, Ibadat, Kegiatan Umat). Jika daftarnya kosong, Anda harus menambahkannya dulu di menu Kelola Kategori. |
| **Jenis Liturgi** | Dropdown Pilihan | Opsional | Khusus untuk kegiatan peribadatan/misa, pilih warna atau jenis liturginya (jika relevan). |
| **Deskripsi** | Teks Panjang | Opsional | Catatan tambahan, keterangan peserta yang diundang, atau rincian *dresscode*. |
| **Kontak Person** | Teks Pendek | Opsional | Nama pengurus atau nomor *WhatsApp* yang bisa dihubungi oleh umat (misal: "Bpk. Budi - 0812345xxx"). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Akses menu **Kelola Agenda** dari *sidebar* sebelah kiri.
2. Anda akan menjumpai daftar kegiatan dalam bentuk tabel tabelaris.
3. Anda bisa menyaring tampilan kegiatan menggunakan kombinasi filter di atas tabel:
   * **Bulan & Tahun**: Untuk melihat agenda khusus di bulan tertentu (misal: Desember 2026).
   * **Kategori**: Untuk hanya menampilkan acara rapat atau jenis lainnya.
   * **Urutkan**: Mengurutkan dari tanggal terlama ke terbaru, atau sebaliknya.
   * **Pencarian**: Mencari nama kegiatan secara spesifik.

`[MASUKKAN SCREENSHOT: Tampilan tabel Agenda beserta deretan baris filternya]`

### B. Cara Menambah Data Baru (Create)
1. Klik tombol coklat **+ Tambah Agenda** (atau sejenisnya) di pojok kanan atas.
2. Jendela pengisian *form* akan terbuka.
3. Isikan seluruh kolom yang bertanda Bintang Merah (*Wajib*). Pastikan **Tanggal Mulai** dipilih dengan benar.
4. Jika kegiatan memiliki penanggung jawab khusus, jangan lupa mengisi kolom **Kontak Person**.
5. Klik tombol **Simpan** / **Save**. Sistem otomatis akan menambahkannya ke kalender umat.

`[MASUKKAN SCREENSHOT: Pop-up form penambahan agenda kegiatan]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Cari nama kegiatan yang mengalami perubahan jadwal pada tabel. Anda dapat memanfaatkan fitur filter bulan untuk pencarian lebih cepat.
2. Klik ikon **Pensil (Edit)** yang berada di ujung baris kegiatan tersebut.
3. Lakukan koreksi (Misalnya mengundurkan **Tanggal Mulai** atau mengubah **Lokasi**).
4. Tekan tombol **Simpan** untuk mengunci perubahan.

`[MASUKKAN SCREENSHOT: Lokasi tombol edit pada tabel agenda]`

### D. Cara Menghapus Data (Delete)
1. Temukan agenda yang dibatalkan secara permanen atau salah input.
2. Klik ikon **Tempat Sampah (Delete)** yang berwarna merah di sebelah tombol edit.
3. Sistem akan meminta konfirmasi penghapusan ("Apakah Anda yakin?").
4. Konfirmasi dialog tersebut, dan acara tersebut akan dihapus seutuhnya dari *database* maupun layar umat.

`[MASUKKAN SCREENSHOT: Notifikasi pop-up peringatan sebelum data agenda terhapus]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Tanggal Masuk Akal:** Jika Anda mengisi **Tanggal Selesai**, sistem mewajibkan bahwa tanggal dan jam selesainya harus **lebih besar (lebih lama)** dari **Tanggal Mulai**. Anda tidak bisa memasukkan jam selesai yang mendahului jam mulai.
* **Kewajiban Pengisian (Mandatory):** Tombol *Simpan* tidak akan bereaksi jika *Nama Kegiatan, Tanggal Mulai, Lokasi,* dan *Kategori* masih kosong.
* **Akses Visibilitas Publik:** Begitu agenda disimpan tanpa status *draft* (jika modul ini tidak menggunakan fitur draft), maka akan hitungan detik data tersebut bisa langsung dilihat oleh umat di website publik. Pastikan penulisan judul dan ejaan lokasi sudah benar.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Sudah membuat agenda untuk bulan depan, tapi kenapa di halaman utama Admin tidak muncul?
**Solusi:** Periksa pilihan **Filter Bulan** di atas tabel Anda. Secara *default*, sistem biasanya hanya menampilkan kegiatan untuk bulan yang sedang berjalan. Ganti *dropdown* bulan ke bulan depan, maka agenda Anda pasti akan muncul.

**Skenario 2:**
**Gejala:** Ingin menambah agenda "Kerja Bakti", tapi pilihan di *dropdown* Kategori sama sekali tidak ada yang pas (atau kosong). Form pun gagal disimpan karena Kategori itu wajib.
**Solusi:** Tutup sejenak jendela Tambah Agenda, navigasikan ke menu **Kelola Kategori Agenda** (atau sub-menu *Categories*), dan tambahkan kategori baru bernama "Kerja Bakti". Setelah disimpan, kembalilah ke menu Agenda, maka pilihan "Kerja Bakti" sudah tersedia di *dropdown*.

**Skenario 3:**
**Gejala:** Waktu di *Datepicker* secara otomatis tertulis dengan jam "12:00" padahal acara jam 19:00, dan tombol Simpan ditolak.
**Solusi:** Ketika mengisi kolom **Tanggal Mulai**, pastikan Anda mengeklik bagian "jam" di dalam kotak kalender (*Datepicker*). Kadang *browser* menolak validasi jika format *AM/PM* atau *HH:mm* pada jam belum Anda pilih secara tuntas.
