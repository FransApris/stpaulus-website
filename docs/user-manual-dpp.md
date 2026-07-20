# BAB XXVIII: KELOLA DPP PAROKI (Dewan Pastoral Paroki)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/dpp`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola DPP Paroki** berfungsi untuk mengatur dan menyajikan struktur raksasa Dewan Pastoral Paroki secara terstruktur dan terpadu. Jika menu *BGKP* berfokus pada pengurus inti/harian, menu DPP ini mencakup jangkauan yang jauh lebih luas: mulai dari Ketua Bidang, Ketua Seksi, Sub-Seksi, hingga Ketua Wilayah dan Lingkungan.

Fitur ini dirancang sangat cerdas. Ia mampu mengelompokkan secara otomatis siapa saja pengurus yang masuk di "Bidang Liturgi" atau siapa pengurus di "Wilayah 2". Data ini kemudian disajikan di halaman depan *website* agar umat mengenali para pelayannya masing-masing.

**Akses Pengguna (Role):** 
* **Superadmin & Sekretaris DPP:** Pemegang tanggung jawab tertinggi untuk menyelaraskan susunan kepengurusan berdasarkan Surat Keputusan (SK) dari Keuskupan atau Paroki.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Mengingat kompleksitas struktur DPP, *form* yang disediakan sangat adaptif. *Field* yang muncul bergantung pada **Kategori Jabatan** yang Anda pilih:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Lengkap** | Teks | **Wajib** | Nama pengurus (beserta gelar jika ada). |
| **Kategori Jabatan** | Dropdown | **Wajib** | Penentu struktur: "Pengurus Inti", "Ketua Bidang", "Seksi", atau "Wilayah/Lingkungan". Pilihan ini menentukan form di bawahnya. |
| **Jabatan Lengkap** | Teks | **Wajib** | Sebutan jabatannya (Contoh: "Ketua Seksi Kepemudaan"). |
| **Nama Bidang/Seksi**| Dropdown & Teks| Dinamis | (Hanya muncul jika kategorinya sesuai). Pilih bidang/wilayah/seksi yang menaunginya. |
| **Tipe Jabatan** | Dropdown | **Wajib** | Menentukan hierarki tampilan (Ketua selalu tampil di atas Anggota). |
| **Level Jabatan** | Teks | Opsional | Isi angka romawi (Misal "II") jika jabatannya berjenjang (Wakil II, Anggota II). |
| **Ex Officio** | Checkbox | Opsional | Centang jika jabatan otomatis melekat (khusus Romo/biarawan). |
| **Geser Urutan (Otomatis)**| Checkbox | (Create) | *(Hanya muncul saat buat baru)*. Jika dicentang, sistem otomatis menyisipkan namanya di urutan yang tepat dan menggeser data lain ke bawah tanpa merusak urutan tabel. |
| **Periode (Mulai-Selesai)**| Datepicker | Opsional | Rentang masa bakti pelayanan. |
| **Data SK (Nomor & Tgl)**| Teks & Datepicker| Opsional | Bukti penerbitan legalitas kepengurusan. |
| **Status Aktif** | Checkbox | Opsional | Centang agar datanya tayang di *website*. Jika masa baktinya purna, hilangkan centang ini. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Membaca Susunan (Read)
1. Buka menu **DPP Paroki** di navigasi admin.
2. Anda akan dihadapkan pada tabel susunan anggota.
3. Manfaatkan secara maksimal deretan *Filter* di atas tabel. Jika Anda hanya ingin melihat susunan "Bidang Liturgi", atur **Filter Kategori** ke *Bidang* atau *Seksi*, lalu cari dari kolom yang relevan.
4. Gunakan filter **Urutkan: Urutan Tampil** untuk memastikan posisi para ketua berada di baris atas, diikuti oleh wakil, sekretaris, lalu anggota.

### B. Cara Menambah Anggota / Pengurus Baru (Create)
1. Klik tombol **+ Tambah Anggota**.
2. Masukkan **Nama Lengkap** pengurus.
3. Pilih **Kategori Jabatan**. (Jika Anda memilih "Ketua Seksi", layar otomatis akan memunculkan *dropdown* baru untuk memilih *Bidang* mana seksi ini bernaung, lalu mengetikkan nama Seksinya).
4. Pastikan mengisi **Tipe Jabatan** dengan benar (Hierarki: Ketua / Wakil / Anggota).
5. Pada blok form berwarna biru (jika ada), biarkan kotak **Geser urutan otomatis** tercentang agar ia tersusun rapi dengan sendirinya di tabel.
6. Lengkapi isian pendukung (Periode, SK, Catatan).
7. Centang **Status Aktif**, lalu tekan **Simpan**.

`[MASUKKAN SCREENSHOT: Form Tambah Anggota DPP yang menampilkan dropdown dinamis sesuai kategorinya]`

### C. Cara Mengubah Data atau Menurunkan Jabatan (Update)
1. Cari nama orang yang ingin di-edit di tabel, lalu klik tombol **Pensil (Edit)**.
2. Jika ada pergantian pengurus (pengurus lama lengser), hilangkan centang pada kotak **Status Aktif**, dan jangan lupa isi **Tanggal Selesai**.
3. Klik **Simpan**. 
4. Segera *Tambah Anggota* yang baru untuk menggantikan posisinya yang kosong.

### D. Cara Mengatur Urutan Tabel Secara Manual (Drag & Drop)
Sistem memiliki fitur visual untuk mengubah urutan (hirarki) tanpa mengetik angka:
1. Temukan ikon panah silang (**Tarik/Drag**) di sisi kiri setiap baris tabel.
2. Klik dan tahan (*drag*) baris tersebut, lalu geser ke atas atau ke bawah sesuai urutan yang benar (Contoh: Menarik Ketua Seksi Koor agar berada tepat di bawah Ketua Bidang Liturgi).
3. Lepaskan klik. Sistem biasanya akan otomatis menyimpan struktur urutan yang baru.

`[MASUKKAN SCREENSHOT: Kursor sedang menarik/drag baris tabel untuk mengubah posisi pengurus]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Logika *Dropdown* Bersarang (*Nested Form*):** Form disetel menjadi sangat ketat dan dinamis. Anda tidak bisa mendaftarkan "Seksi Sosial" jika Anda tidak menautkannya ke "Bidang Koinonia / Pelayanan" di *dropdown* atasnya. Sistem *website* membutuhkan "pohon" relasi tersebut untuk menggambar strukturnya di layar umat.
* **Integrasi Status:** Orang-orang yang tidak dicentang status *Aktif*-nya tidak akan pernah dimunculkan di halaman publik website, meskipun jabatannya sangat penting (misal: Ketua DPP).
* **Prioritas Tabel:** Fitur *Geser Urutan (Auto Shift Order)* selalu mengkalkulasi tipe jabatannya. Ketua selalu diutamakan disisipkan di atas Anggota.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat mengisi form pengurus "Ketua Lingkungan St. Maria", pilihan "Lingkungan St. Maria" tidak muncul di *dropdown* Wilayah.
**Solusi:** Form DPP terintegrasi secara modular. Anda mungkin salah memilih kategori. Pastikan **Kategori Jabatan** di bagian paling atas sudah Anda pilih sebagai **"Ketua Lingkungan"** atau **"Wilayah/Lingkungan"**. Barulah kolom pencarian Wilayah dan Lingkungan akan dimunculkan oleh sistem.

**Skenario 2:**
**Gejala:** Di halaman utama *website* umat, struktur Bidang Liturgi bentuknya aneh; nama para anggotanya malah terpisah di bawah nama pengurus bidang yang lain.
**Solusi:** Ini terjadi karena urutan tabel *(Display Order)* di panel admin Anda berantakan. Masuk ke halaman admin **Kelola DPP**, pastikan filter diatur ke "Urutkan: Urutan Tampil". Setelah itu, gunakan fitur **Tarik/Drag** (seperti pada poin 3.D) untuk menggeser baris nama Anggota Liturgi agar menempel persis di bawah baris Ketua Seksi Liturginya.

**Skenario 3:**
**Gejala:** Saya sudah mencentang opsi 'Ex Officio' pada profil Romo Paroki di form ini, tapi tulisan 'Ex Officio' tidak tampil di profilnya.
**Solusi:** Fitur 'Ex Officio' ini hanya penanda secara internal (*database*) untuk memudahkan staf sekretariat menyaring laporan. Label teks ini tidak selalu dirancang untuk terlihat langsung (diekspos) di desain visual halaman umat agar tampilannya tidak sumpek.
