# BAB XV: KELOLA JENIS LITURGI
**URL Endpoint:** `https://stpaulusjuanda.org/admin/liturgy-types`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Jenis Liturgi** merupakan pusat *Master Data* untuk mengatur dan mendata perayaan-perayaan gerejawi khusus beserta warna liturginya (seperti Masa Adven, Natal, Prapaskah, Paskah, atau Hari Raya Santo/Santa). 

Data yang dikelola di sini sangat penting karena akan muncul sebagai *dropdown* pilihan wajib (Kategori Liturgi) ketika Anda membuat jadwal pada **Misa Khusus**. Indikator warna dan ikon emoji yang diatur di menu ini akan mempermudah umat dalam mengidentifikasi tema liturgi pada kalender paroki.

**Akses Pengguna (Role):** 
* **Superadmin / Admin Sekretariat:** Memiliki hak penuh untuk menambah, mengedit, menghapus, atau menonaktifkan jenis liturgi sesuai kalender liturgi tahunan gereja Katolik.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Saat Anda mengeklik **Tambah Jenis Liturgi** atau **Edit**, sebuah jendela *pop-up* akan muncul dengan beberapa *field* berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama** | Teks Pendek | **Wajib** | Judul perayaan liturgi (Contoh: "Masa Prapaskah", "Pekan Suci", "Hari Raya Paskah"). |
| **Slug** | Teks Pendek | **Wajib** | Format teks bersih untuk URL (Sistem biasanya otomatis mengisinya berdasarkan Nama. Contoh: `masa-prapaskah`). |
| **Ikon (emoji)** | Teks Pendek | Opsional | Emoji yang merepresentasikan perayaan tersebut (Contoh: 🕊️, 🌿, ✝️) agar tampilan kalender lebih menarik. |
| **Warna** | Color Picker | **Wajib** | Warna liturgi pakaian imam/tema perayaan. Anda bisa mengeklik kotak warna untuk memilih (Contoh: Ungu untuk Adven/Prapaskah, Putih/Kuning untuk Paskah). |
| **Deskripsi** | Teks Panjang | Opsional | Penjelasan singkat mengenai tema bacaan atau instruksi internal terkait misa dengan liturgi ini. |
| **Status Aktif** | Checkbox | Opsional | Hanya muncul di layar Edit. Jika dicentang, liturgi ini bisa dipilih di form jadwal Misa. Jika tidak, akan disembunyikan. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Pilih menu **Kelola Jenis Liturgi** (atau *Liturgy Types*) di panel samping.
2. Anda akan melihat tabel/daftar yang memuat nama perayaan, lengkap dengan lambang warna liturginya.

`[MASUKKAN SCREENSHOT: Tampilan tabel Jenis Liturgi yang menampilkan nama, slug, dan warna]`

### B. Cara Menambah Data Baru (Create)
1. Klik tombol coklat **+ Tambah Jenis Liturgi** (atau *Create Type*) di pojok kanan atas.
2. Jendela pengisian *form* akan terbuka.
3. Ketikkan **Nama** perayaan (Kolom **Slug** akan otomatis menyesuaikan, atau Anda bisa mengetiknya dengan format menggunakan strip `-`).
4. (Opsional) Masukkan **Ikon Emoji** jika diperlukan. Anda bisa menyalin-tempel (copy-paste) emoji dari internet.
5. Klik kotak **Warna** dan pilihlah warna liturgi yang sesuai dengan pedoman puji syukur / ordo.
6. Klik **Simpan**.

`[MASUKKAN SCREENSHOT: Pop-up form Tambah Jenis Liturgi]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Temukan jenis liturgi yang ingin Anda perbaiki di dalam tabel.
2. Klik tombol berlambang **Pensil (Edit)** di baris tersebut.
3. Lakukan pembaruan, seperti mengganti warna jika keliru, atau mencentang/menghilangkan centang pada kotak **Aktif**.
4. Klik **Simpan** untuk menerapkan perubahan.

`[MASUKKAN SCREENSHOT: Tombol Edit pada setiap baris data di tabel]`

### D. Cara Menghapus / Menonaktifkan Data
* **Jika Perayaan Sudah Berakhir (Saran):** Sebaiknya jangan dihapus. Cukup klik *Edit*, lalu **hilangkan centang pada Status Aktif**, dan Simpan. Data akan diarsipkan dan bisa diaktifkan lagi tahun depan.
* **Jika Salah Input (Hapus Permanen):** Klik tombol tempat sampah (**Delete/Hapus**) yang berwarna merah di sebelah tombol edit, lalu konfirmasikan *prompt* "Apakah Anda yakin?".

`[MASUKKAN SCREENSHOT: Dialog konfirmasi penghapusan data secara permanen]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Slug:** Jika Anda mengisinya secara manual, **jangan menggunakan spasi**, simbol (`!@#$`), maupun huruf kapital. Gunakan tanda hubung/strip (`-`) untuk memisahkan kata.
* **Format Warna HTML:** Warna disimpan dalam format heksadesimal HTML (contoh: `#FF0000` untuk merah). Menggunakan *Color Picker* (penetes warna) akan otomatis menghasilkan format yang benar dan bebas error.
* **Kewajiban Pengisian:** Anda tidak dapat menyimpan data jika bagian *Nama*, *Slug*, dan *Warna* dikosongkan.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat ingin memasukkan Misa Malam Paskah (di menu Jadwal Misa Khusus), daftar pilihan pada kotak **Jenis Liturgi** kosong atau tidak ada pilihan "Malam Paskah".
**Solusi:** Form Misa Khusus sangat bergantung pada ketersediaan data di menu ini. Anda harus masuk ke menu **Kelola Jenis Liturgi** ini, klik Tambah Jenis Liturgi, buat data "Malam Paskah" (dengan warna Putih/Emas). Setelah disimpan, pilihan itu akan langsung tersedia di Jadwal Misa Khusus.

**Skenario 2:**
**Gejala:** Administrator mengetikkan simbol seperti "Salib (T)" di kolom **Ikon (emoji)**, tetapi tampilannya di *website* berantakan atau menjadi teks biasa.
**Solusi:** Kolom Ikon dirancang khusus untuk membaca *Unicode Emoji* standar dari bawaan perangkat. Jangan mengetik teks seperti "Salib", melainkan buka menu emoji di *keyboard* Anda (tekan `Windows + .` di PC atau `Cmd + Ctrl + Spasi` di Mac) lalu sisipkan emoji ✝️.

**Skenario 3:**
**Gejala:** Sistem terus-menerus memblokir ketika saya menekan tombol Simpan, padahal semua kotak yang kosong sudah saya isi.
**Solusi:** Periksa kembali penulisan di kolom **Slug**. Seringkali admin secara tidak sengaja menekan spasi di akhir kata atau salah menggunakan karakter garis bawah (`_`). Hapus seluruh isi Slug, lalu biarkan sistem mengisinya secara otomatis berdasar tulisan pada kotak Nama.
