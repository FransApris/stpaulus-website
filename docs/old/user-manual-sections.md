# BAB XI: KELOLA BGKP & DPP (Manajemen Bagian / Sections)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/kronik/sections`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola BGKP & DPP (Sections)** adalah pusat pengaturan struktur data untuk sub-kategori atau pembagian organisasi di dalam paroki. Fungsi utamanya adalah untuk mendaftarkan nama-nama spesifik dari Wilayah, Lingkungan, Seksi-Seksi DPP, maupun kepanitiaan BGKP. 

Data yang Anda buat di menu ini akan bertindak sebagai **"Data Master"**. Artinya, ketika staf lain ingin membuat tulisan Kronik tentang suatu Lingkungan, mereka hanya bisa memilih nama Lingkungan yang sudah Anda daftarkan dan aktifkan di menu ini.

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat:** Memiliki hak penuh untuk membuat, mengedit, menghapus, serta mengatur urutan dan status aktif suatu seksi/lingkungan.
* **Editor / Admin Komsos:** Umumnya hanya dapat melihat referensi data ini.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat Anda menekan tombol **+ Add Section** atau tombol **Edit**, akan muncul *pop-up* form (modal) dengan isian berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Kategori (Category)** | Dropdown Pilihan | **Wajib** | Memilih induk kategori organisasi (Contoh: Wilayah, Lingkungan, DPP, atau BGKP). |
| **Nama (Name)** | Teks Pendek | **Wajib** | Nama spesifik dari bagian tersebut. (Contoh: "Wilayah Santo Yusuf", "Lingkungan St. Anna", "Seksi Liturgi"). |
| **Slug (Tautan Pendek)**| Teks Pendek | **Wajib** | Format teks bersih untuk keperluan *link* URL. (Sistem akan **otomatis mengisi** kolom ini saat Anda mengetik Nama, misal: `wilayah-santo-yusuf`). |
| **Deskripsi** | Teks Panjang | Opsional | Penjelasan singkat mengenai tugas atau cakupan bagian ini. |
| **Urutan (Order Index)**| Angka | Opsional | Mengatur urutan tampil bagian ini di dalam senarai/daftar. Semakin kecil angkanya (misal: 0 atau 1), akan semakin di atas posisinya. |
| **Status Aktif** | Checkbox | Opsional | Jika dicentang (Aktif), nama bagian ini akan muncul dan bisa dipilih saat membuat Kronik. Jika tidak dicentang (Nonaktif), akan disembunyikan. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Buka navigasi ke halaman **Sections** (melalui sub-menu di bawah Kronik).
2. Daftar seluruh bagian (Wilayah/Lingkungan/Seksi) akan tersaji dalam bentuk tabel.
3. Untuk pencarian cepat, gunakan baris filter di atas tabel:
   * **Filter by Category**: Pilih spesifik untuk melihat daftar "Lingkungan" saja atau "DPP" saja.
   * **Filter by Status**: Memilah mana yang *Active* atau *Inactive*.
   * **Kotak Pencarian**: Ketikkan nama bagian secara langsung.

`[MASUKKAN SCREENSHOT: Tampilan daftar tabel Sections beserta baris filternya]`

### B. Cara Menambah Data Baru (Create)
1. Klik tombol coklat **+ Add Section** di sudut kanan atas layar.
2. Sebuah jendela *pop-up* akan muncul di tengah layar.
3. Pilih induk **Kategori** terlebih dahulu.
4. Ketikkan **Nama** bagian. (Perhatikan kolom **Slug** di bawahnya akan otomatis terisi menyesuaikan ketikan Anda).
5. (Opsional) Isi Deskripsi dan atur angka Urutan (Order Index) jika ingin disortir secara khusus.
6. Pastikan kotak **Status Aktif (is_active)** dalam keadaan tercentang.
7. Klik tombol biru **Save** untuk menyimpan data ke sistem.

`[MASUKKAN SCREENSHOT: Jendela pop-up form pengisian Tambah Section]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Temukan nama bagian/seksi yang terdapat kesalahan ketik atau ingin diubah pada tabel.
2. Pada baris tersebut (di kolom paling kanan), klik ikon **Pensil (Edit)**.
3. Jendela *pop-up* form akan terbuka membawa data lama. Lakukan penyesuaian (misalnya menonaktifkan centang status, atau memperbaiki ejaan nama).
4. Klik tombol **Save** untuk menerapkan perubahan.

`[MASUKKAN SCREENSHOT: Lokasi ikon pensil (Edit) pada baris tabel]`

### D. Cara Menghapus Data (Delete)
1. Cari nama bagian yang ingin dihapus dari tabel.
2. Klik ikon **Tempat Sampah (Delete)** yang berwarna merah muda di sebelah tombol Edit.
3. Sistem akan meminta konfirmasi penghapusan agar Anda tidak salah klik.
4. Klik persetujuan penghapusan. Data akan dihapus dari *database* secara permanen.

`[MASUKKAN SCREENSHOT: Peringatan pop-up saat tombol hapus ditekan]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kewajiban Pengisian:** Anda tidak dapat menekan tombol *Save* jika kolom Kategori, Nama, atau Slug masih dibiarkan kosong.
* **Aturan Slug Web:** Kolom Slug **tidak boleh mengandung spasi, huruf kapital, atau simbol aneh**. Jika Anda mengetik secara manual, gunakan tanda strip/min (`-`) sebagai pengganti spasi (Contoh yang benar: `seksi-kepemudaan`). Sistem sudah dirancang untuk merapikannya secara otomatis.
* **Nilai Minimum Urutan:** Angka urutan (*Order Index*) tidak boleh bernilai negatif. Mulailah dari angka 0, 1, 2, dan seterusnya.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Sudah berhasil membuat bagian bernama "Lingkungan St. Yosep", tetapi saat admin lain mencoba membuat Kronik, nama lingkungan tersebut tidak muncul di pilihan form Kronik.
**Solusi:** Anda kemungkinan lupa mencentang status aktif. Masuk ke halaman *Sections*, cari "Lingkungan St. Yosep", klik Edit (ikon pensil), centang kotak **"is_active"** di bagian bawah form, lalu klik Save.

**Skenario 2:**
**Gejala:** Saat membuat nama bagian, kolom *Slug* menghasilkan tulisan yang aneh atau karakter berantakan karena menggunakan emoji atau simbol khusus (seperti: `Lingkungan @#$!`).
**Solusi:** Kolom *Slug* adalah tautan URL yang murni mengandalkan huruf alfabet dan angka standar. Hindari penggunaan simbol non-standar pada kolom Nama. Jika terlanjur, hapus dan ketik ulang kolom Slug secara manual menggunakan huruf biasa (misalnya: `lingkungan-khusus`).

**Skenario 3:**
**Gejala:** Tabel kepanjangan dan sulit menemukan nama seksi yang dicari karena halamannya (*pagination*) sangat banyak.
**Solusi:** Manfaatkan kotak pencarian (*Search*) di pojok kanan atas filter tabel, atau ubah *Filter by Category* ke kategori spesifik (contoh: "DPP") agar tabel langsung menyaring dan mengerucutkan data yang relevan saja.
