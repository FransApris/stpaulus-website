# BAB XVIII: KELOLA KATEGORI PENGGUNA (Klasifikasi Umat & Staf)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/user-categories`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Kategori Pengguna** adalah tempat di mana Anda menyusun label klasifikasi untuk mendaftarkan akun (Misalnya: "Umat Paroki", "Simpatisan", "Pengurus DPP", atau "Staf Eksternal"). 

Fungsi inti dari pembuatan kategori ini akan sangat terasa dampaknya pada sistem *Booking Ruangan*, karena Anda bisa membatasi ruangan tertentu (seperti Ruang Rapat Paroki) agar HANYA bisa dipinjam oleh *user* (pengguna) yang tergabung dalam Kategori Pengguna "Pengurus DPP".

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat Utama:** Memiliki wewenang eksklusif untuk mendefinisikan, mengubah, atau menghapus kategori. Kategori ini menjadi *master data* yang sifatnya sangat jarang diubah setelah sistem stabil berjalan.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat menambah kategori baru melalui form **Tambah Kategori Pengguna Baru** atau saat mengeditnya, Anda akan menemukan beberapa isian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Kategori (Unik)** | Teks Pendek | **Wajib** | Nama teknis/kode sistem. Huruf harus tersambung atau menggunakan garis bawah, dan tidak boleh kembar (Contoh: `umat_paroki` atau `pengurus_dpp`). |
| **Nama Tampilan** | Teks Pendek | **Wajib** | Nama rapi yang akan dibaca oleh umat/pengguna di layar mereka (Contoh: "Umat Paroki St. Paulus", "Pengurus Inti DPP"). |
| **Deskripsi** | Teks Pendek | Opsional | Keterangan singkat untuk pengingat admin mengenai siapa saja yang boleh masuk ke kategori ini. |
| **Urutan Tampilan** | Angka | Opsional | Angka penentu posisi prioritas kategori di dalam *dropdown* pilihan. Angka yang lebih kecil (1, 2) akan muncul paling atas. |
| **Aktif** | Checkbox | Opsional | Hanya muncul di layar Edit. Centang jika kategori ini masih relevan untuk dipilih saat pendaftaran *user* baru. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Buka menu **Kelola Kategori Pengguna** (biasanya berada di bawah sub-menu Pengguna/Users).
2. Anda akan melihat halaman berisi daftar kategori yang ada, yang disajikan di dalam tabel atau kotak daftar (*list*).
3. Anda dapat membaca informasi lengkap mengenai Nama Tampilan, Nama Kode, serta Status keaktifannya secara langsung.

`[MASUKKAN SCREENSHOT: Tampilan daftar tabel Kategori Pengguna]`

### B. Cara Menambah Data Baru (Create)
1. Perhatikan kotak *form* kosong di bagian atas bertuliskan **Tambah Kategori Pengguna Baru**.
2. Masukkan **Nama Kategori (unik)**. *Ingat: Gunakan huruf kecil tanpa spasi (gunakan *underscore/strip*).*
3. Masukkan **Nama Tampilan** dengan penulisan yang rapi.
4. (Opsional) Isi **Deskripsi** dan **Urutan Tampilan** jika diperlukan.
5. Klik tombol biru **Tambah Kategori / Simpan**. Data akan otomatis turun masuk ke dalam tabel di bawahnya.

`[MASUKKAN SCREENSHOT: Form pengisian Tambah Kategori Pengguna Baru di bagian atas halaman]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Pada tabel daftar kategori, temukan kategori yang salah ketik atau mau dinonaktifkan.
2. Klik tombol berlambang pensil (**Edit**) di sebelah kanan.
3. Form *pop-up* atau form di halaman yang sama akan terbuka memuat data lama.
4. Lakukan revisi pada **Nama Tampilan** atau hapus centang pada kotak **Aktif** jika kategori itu tak ingin dipakai lagi.
5. Klik **Update** / **Simpan**.

`[MASUKKAN SCREENSHOT: Tampilan mode Edit saat tombol pensil ditekan]`

### D. Cara Menghapus Data (Delete)
1. Pastikan kategori yang ingin Anda hapus benar-benar belum dipakai oleh satupun pengguna di menu *Kelola Pengguna*.
2. Klik ikon merah tempat sampah (**Delete**).
3. Kotak konfirmasi peringatan sistem akan muncul.
4. Jika yakin, klik setuju/OK. Kategori akan dihilangkan permanen dari basis data.

`[MASUKKAN SCREENSHOT: Dialog peringatan sistem saat akan menghapus kategori pengguna]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Nama Unik:** Kolom *Nama Kategori (unik)* sama sekali tidak mengizinkan adanya redudansi. Jika Anda mencoba memasukkan kata `umat_paroki` padahal sudah ada di *database*, form akan menolaknya.
* **Format Angka Urutan:** Kolom *Urutan Tampilan* (Order) hanya menerima input berupa angka bulat (integer). Anda tidak bisa memasukkan huruf atau karakter desimal/koma.
* **Proteksi Integritas Relasi:** Jika kategori tersebut sudah kadung dipakai oleh 50 umat sebagai identitas akun mereka, sistem berpotensi akan memblokir (*error*) tindakan Anda saat Anda mencoba menekan tombol Hapus (Delete). Sistem mengamankan data agar tidak terjadi akun "tanpa identitas kategori".

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat ingin menyimpan kategori baru, muncul pesan "Error" atau berkedip merah tanpa penjelasan.
**Solusi:** Kemungkinan besar Anda melanggar aturan pengisian kolom pertama (*Nama Kategori (unik)*). Pastikan di kolom tersebut Anda tidak menekan Spasi. Ubah ketikan Anda dari `Pengurus Lingkungan` menjadi `pengurus_lingkungan`. Spasi hanya boleh dipakai di kolom kedua (*Nama Tampilan*).

**Skenario 2:**
**Gejala:** Kategori "Tim Pembangunan" sudah dibuat, tapi di menu form pembuatan *User* baru, pilihan itu tidak ada.
**Solusi:** Masuk kembali ke menu **Kelola Kategori Pengguna**, cari "Tim Pembangunan", klik Edit, lalu pastikan Anda sudah mencentang (mengaktifkan) kotak **Aktif**. Kategori yang dinonaktifkan secara otomatis akan disembunyikan dari *dropdown* pembuatan *user*.

**Skenario 3:**
**Gejala:** Saya mencoba menghapus kategori "Umat Biasa", tapi sistem selalu gagal atau layar me-*refresh* tanpa menghapusnya.
**Solusi:** Ini adalah fitur pengaman (Proteksi Integritas). Hal itu terjadi karena saat ini masih ada akun umat (di tabel pengguna) yang terdaftar menggunakan kategori tersebut. Anda tidak boleh menghapusnya. Solusinya: Edit kategori tersebut dan hilangkan centang **Aktif** agar tidak ada pendaftar baru yang bisa menggunakannya lagi.
