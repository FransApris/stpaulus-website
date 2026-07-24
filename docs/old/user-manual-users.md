# BAB XVI: KELOLA PENGGUNA (Manajemen Akun & Role)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/users`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Pengguna** adalah fondasi keamanan dan pangkalan data akun untuk seluruh website. Melalui menu ini, Anda mengatur siapa saja yang berhak masuk ke dalam sistem panel *admin*, sekaligus mendata umat yang memiliki akun untuk melakukan pemesanan (booking) ruangan atau layanan paroki lainnya.

Sistem *Role-Based Access Control* (RBAC) ditegakkan di halaman ini, memastikan bahwa pengurus biasa tidak akan bisa mengakses menu rahasia atau pengaturan inti sistem yang hanya boleh dibuka oleh Superadmin.

**Akses Pengguna (Role):** 
* **Superadmin:** Penguasa tertinggi. Memiliki hak penuh untuk menambah admin baru, mereset *password* siapapun, dan menghapus pengguna.
* **Admin Sekretariat:** Memiliki hak untuk melihat dan mendata pengguna/umat, namun biasanya tidak bisa mengangkat pengguna biasa menjadi admin baru (bergantung pada konfigurasi).

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat Anda mengeklik tombol tambah pengguna atau mengedit, *form* pendaftaran akan muncul dengan parameter berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Jenis Akun (Role)** | Radio Button | **Wajib** | Memilih apakah akun ini untuk "Umat Biasa" atau "Admin". |
| **Role Admin** | Dropdown | Kondisional | Jika Anda memilih jenis akun "Admin", kotak ini akan muncul untuk menentukan tingkat admin (Contoh: *Super Admin, Admin Sekretariat, Komsos*). |
| **Username** | Teks Pendek | **Wajib** | Nama pengguna yang dipakai untuk *Login*. Tidak boleh ada spasi dan harus unik. |
| **Email** | Teks (Email) | **Wajib** | Alamat email aktif untuk pemulihan *password* atau notifikasi *booking*. (Sifatnya menjadi Opsional saat dalam mode *Edit*). |
| **Password** | Teks Rahasia | **Wajib** | Kata sandi untuk masuk. (Minimal 6 karakter). Hanya muncul saat penambahan baru. |
| **Nama Lengkap** | Teks Pendek | **Wajib** | Nama asli pengguna/umat yang bersangkutan sesuai KTP/Surat Baptis. |
| **No. Telepon** | Teks Pendek | Opsional | Nomor *WhatsApp* atau telepon aktif untuk kemudahan kontak. |
| **Kategori Pengguna** | Dropdown | **Wajib** | Klasifikasi umat (Contoh: "Umat Paroki", "Umat Luar Paroki", "Simpatisan"). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Buka menu **Kelola Pengguna** dari *sidebar*.
2. Daftar seluruh pengguna terdaftar akan tampil di dalam tabel lengkap beserta kolom *Role* dan *Kontak*.
3. Gunakan kotak pencarian (*Search*) di atas tabel untuk mencari nama atau *username* umat dengan cepat tanpa perlu membalik halaman (*pagination*).

`[MASUKKAN SCREENSHOT: Tabel Daftar Pengguna beserta Kotak Pencarian]`

### B. Cara Menambah Data Baru (Create)
1. Di atas tabel, Anda akan menemukan blok pengisian **Tambah Pengguna Baru**.
2. Pilih **Jenis Akun** terlebih dahulu (Umat atau Admin). Jika Admin, tentukan *Role*-nya.
3. Isikan **Username**, **Email**, **Nama Lengkap**, **No. Telepon**, dan pilih **Kategori Pengguna**.
4. Masukkan **Password** awal (Sistem menyarankan 6 karakter).
5. Klik tombol biru **+ Tambah Pengguna**.

`[MASUKKAN SCREENSHOT: Tampilan kotak form "Tambah Pengguna Baru"]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Cari pengguna di dalam tabel.
2. Klik tombol **Edit** (ikon pensil kuning/hijau) di baris sebelah kanan.
3. Jendela form edit akan muncul. Anda bisa memperbaiki *typo* pada nama, email, atau mengubah kategori pengguna.
4. Klik **Simpan** untuk mengunci perubahan.
*Catatan: Anda tidak bisa mengubah password melalui menu Edit ini.*

### D. Cara Mereset Password Pengguna
1. Jika umat lupa *password*, cari nama mereka di tabel.
2. Klik tombol **Kunci** (*Reset Password*) yang berada di sebelah tombol Edit.
3. Jendela *pop-up* akan muncul. Masukkan *password* baru, lalu ketik ulang di kolom konfirmasi.
4. Klik **Reset Password**. Berikan *password* baru tersebut kepada umat.

`[MASUKKAN SCREENSHOT: Jendela dialog Reset Password]`

### E. Cara Menghapus Data (Delete)
1. Temukan nama pengguna yang akan dihapus dari sistem.
2. Klik tombol merah **Tempat Sampah (Delete)**.
3. Untuk mencegah penghapusan fatal secara tidak sengaja, sistem akan meminta Anda mengetikkan suatu kata konfirmasi (biasanya kata "HAPUS") di dalam kotak yang disediakan.
4. Setelah mengetik kata yang diminta, tombol **Ya, Hapus Permanen** akan aktif. Klik tombol tersebut.

`[MASUKKAN SCREENSHOT: Dialog konfirmasi penghapusan yang mewajibkan pengetikan manual]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Username & Email Unik:** Tidak boleh ada dua pengguna di dalam sistem yang memiliki *Username* atau *Email* yang sama persis. Sistem akan langsung menolak pendaftaran jika mendeteksi duplikasi.
* **Keamanan Password:** Kata sandi yang Anda buatkan untuk pengguna baru minimal harus berjumlah 6 karakter.
* **Hierarki Hapus:** Admin biasa (*Admin Sekretariat*) tidak dapat melihat tombol hapus atau mengedit data milik seorang *Superadmin*. 

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat menekan tombol "+ Tambah Pengguna", sistem menampilkan pesan *Error: Username already exists*.
**Solusi:** Artinya *Username* (atau Email) yang Anda masukkan sudah pernah didaftarkan oleh umat lain. Silakan ubah sedikit *Username*-nya (misal: dari "budi" menjadi "budi_stpaulus") atau pastikan umat tersebut belum mendaftar sebelumnya.

**Skenario 2:**
**Gejala:** Saya mengklik tombol Hapus pada pengguna fiktif, tetapi tombol "Ya, Hapus Permanen" berwarna abu-abu redup dan tidak bisa diklik.
**Solusi:** Ini adalah fitur pengaman tingkat tinggi. Anda wajib membaca pesan di layar *pop-up* tersebut, dan **mengetik ulang kata yang diminta** (biasanya menyuruh mengetik "HAPUS" atau "DELETE") ke dalam kotak teks yang tersedia. Setelah ejaannya pas, tombol merahnya baru akan menyala.

**Skenario 3:**
**Gejala:** Ingin mendaftarkan admin baru, tetapi kotak pilihan "Role Admin" tidak muncul meskipun opsi *radio button* Admin sudah diklik.
**Solusi:** Secara hierarki, hanya akun berstatus **Superadmin** yang memiliki wewenang (*privilege*) untuk membuat admin baru. Jika Anda masuk (*login*) menggunakan akun Admin Sekretariat, sistem secara teknis menonaktifkan kotak pembagian *role* demi alasan keamanan data internal. Minta Superadmin yang menambahkannya.
