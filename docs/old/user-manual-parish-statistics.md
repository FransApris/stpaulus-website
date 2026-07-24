# BAB XXXIII: STATISTIK PAROKI (Manajemen Data 'Paroki Dalam Angka')
**URL Endpoint:** `https://stpaulusjuanda.org/admin/parish-statistics`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Statistik Paroki** didesain khusus untuk mengelola angka-angka kebanggaan (*Milestones*) yang biasanya ditampilkan di halaman utama (*Homepage*) *website* publik. 

Alih-alih mengedit kode pemrograman untuk mengubah angka jumlah umat, admin dapat memperbarui angka-angka tersebut secara langsung dari menu ini (Misalnya mengupdate angka "Total Umat", "Jumlah Lingkungan", atau "Jumlah Wilayah"). Setiap perubahan akan dicatat dalam riwayat pembaruan sistem.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat Utama:** Hanya staf khusus yang memegang data Sensus Umat Paroki terbaru yang disarankan mengubah angka-angka di menu ini, karena menyangkut validitas data publik.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Halaman ini tidak memiliki tombol "Tambah Data Baru", melainkan hanya berupa deretan kartu (*cards*) data statistik yang sudah ditentukan oleh sistem. Setiap kartu statistik memiliki dua kotak input:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nilai Baru** | Angka (*Number*) | **Wajib** | Angka final/terbaru yang akan langsung menggantikan angka lama di halaman depan. Hanya menerima *input* bilangan bulat (Contoh: `4500`). |
| **Alasan Perubahan** | Teks Panjang | Opsional | Kolom catatan historis internal. Sangat dianjurkan untuk diisi agar admin lain tahu sumber datanya (Contoh: "Berdasarkan Sensus Bapa Uskup Mei 2026"). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat Angka Saat Ini (Read)
1. Buka menu **Statistik Paroki** di navigasi admin Anda.
2. Anda akan melihat susunan kartu-kartu statistik (seperti "Total Umat", "Total Lingkungan").
3. Di dalam setiap kartu, perhatikan bagian atasnya. Terdapat teks besar bertuliskan angka saat ini. Angka itulah yang sedang tayang secara *Live* (langsung) ditonton oleh umat di halaman depan.

`[MASUKKAN SCREENSHOT: Tampilan kartu statistik yang menunjukkan Angka Saat Ini]`

### B. Cara Mengubah / Memperbarui Angka (Update)
Katakanlah hasil sensus bulan ini menunjukkan penambahan umat dari 4.000 menjadi 4.500 jiwa:
1. Temukan kartu bertuliskan **Total Umat**.
2. Pada kolom **Nilai Baru**, ketikkan angka terbaru (contoh: `4500`). Jangan menggunakan titik atau koma (jangan menulis `4.500`).
3. Pada kolom **Alasan Perubahan**, tuliskan referensi datanya (contoh: "Hasil sensus lingkungan Mei 2026").
4. Klik tombol **Perbarui (*Update*)**.
5. Sistem akan menyimpan data tersebut, dan angka di bagian atas kartu akan langsung berubah menjadi 4500.

`[MASUKKAN SCREENSHOT: Kotak pengisian Nilai Baru dan Alasan Perubahan sebelum tombol Perbarui ditekan]`

*(Catatan: Anda tidak bisa Menambah kategori baru atau Menghapus kategori statistik dari menu ini. Anda hanya bisa memperbarui (Update) nilainya. Jika butuh menambah kategori (Misal: "Jumlah Romo"), silakan hubungi tim Developer).*

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Format Angka:** Kotak *Nilai Baru* sangat ketat dan hanya mau menerima tipe data **Angka Murni (*Integer*)**. Jika Anda memaksa memasukkan huruf atau tanda baca (titik/koma), tombol *Perbarui* akan terkunci atau menghasilkan *Error*.
* **Tidak Ada Angka Negatif:** Angka terendah yang bisa diinput adalah `0` (Nol). Anda tidak bisa memasukkan angka minus.
* **Auto-Render Publik:** Semua perubahan yang terjadi dan berhasil disimpan di halaman ini, sifatnya **instan**. Tidak butuh menunggu 24 jam; angka di halaman utama *website* akan seketika berubah.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat mengetik "15.000" (dengan titik) di kotak Nilai Baru, sistem menolak dan kotak berwarna merah.
**Solusi:** Ini adalah fitur perlindungan *database*. Hapus tanda titik tersebut dan ketik ulang secara polos menjadi `15000`. Sistem halaman depan nanti yang akan otomatis membacanya dan meriasnya menjadi "15.000" atau "15K" untuk umat.

**Skenario 2:**
**Gejala:** Saya baru saja memperbarui angka "Total Lingkungan" menjadi 45, tapi di halaman depan umat kok angkanya masih 40?
**Solusi:** Beri tahu *browser* Anda untuk menarik data paling *fresh* dengan cara menekan *Hard Refresh* (**Ctrl + F5**) di halaman depan. Jika Anda membukanya di HP, cobalah buka *website* menggunakan *mode Samaran (Incognito/Private)* untuk memastikan sistem berfungsi normal dan itu murni hanya karena riwayat memori (*Cache*).

**Skenario 3:**
**Gejala:** Halaman ini *loading* terus-menerus dan muncul tulisan merah "Gagal mengambil data statistik".
**Solusi:** Hal ini menandakan koneksi antara panel admin dengan *database* paroki sedang terputus sejenak. Jangan mencoba mengklik tombol perbarui apa pun. Tunggu 1 menit, lalu klik ikon *Refresh* di *browser* Anda. Jika *error* berlanjut lebih dari 10 menit, segera laporkan ke tim teknis/Developer.
