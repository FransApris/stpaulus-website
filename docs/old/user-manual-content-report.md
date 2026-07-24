# BAB XXI: LAPORAN KONTEN (Rekapitulasi Aktivitas Publikasi)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/content-report`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Laporan Konten** difungsikan khusus sebagai dasbor analitik dan perekap data publikasi *website*. Fitur ini melacak seberapa aktif paroki dalam mengunggah informasi terbaru (seperti pengumuman Kronik, pembaruan galeri, atau agenda) ke layar publik dalam satu periode tertentu. 

Sama halnya dengan Laporan Pemesanan, menu ini bersifat *Read-Only* (hanya untuk membaca dan menarik data). Fitur ini sangat bermanfaat bagi Editor atau Admin Komsos (Komunikasi Sosial) saat harus menyusun laporan pertanggungjawaban program kerja terkait produktivitas pengelolaan website paroki.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Komsos/Sekretariat:** Idealnya diakses oleh pengurus yang bertanggung jawab atas pengelolaan *digital marketing* paroki untuk memantau performa publikasi bulanan/tahunan.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Mengingat ini adalah menu penarikan laporan, tidak ada *form* rumit untuk input data. Komponen utama di sini hanyalah filter rentang waktu:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Tanggal Dari (Start Date)** | Date Picker | **Wajib** | Tanggal awal penarikan data laporan aktivitas konten (Contoh: 1 Januari 2026). |
| **Tanggal Sampai (End Date)** | Date Picker | **Wajib** | Tanggal akhir penarikan data aktivitas konten (Contoh: 31 Januari 2026). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Menampilkan/Membaca Laporan (Read)
1. Akses menu **Laporan Konten** (*Content Report*) melalui *sidebar* admin.
2. Di baris menu paling atas, temukan dua kotak tanggal. Isi kotak **Tanggal Dari** dan **Tanggal Sampai** sesuai dengan periode yang Anda inginkan.
3. Klik tombol **Tampilkan** (atau sistem akan otomatis memuat ulang saat tanggal diganti).
4. Tabel rekapitulasi akan langsung menampilkan daftar judul konten yang pernah dibuat/diunggah selama masa tersebut, siapa penulisnya, serta status (Draft/Aktif).

`[MASUKKAN SCREENSHOT: Tampilan tabel laporan konten yang difilter per bulan tertentu]`

### B. Cara Mengunduh Laporan ke PDF / Mencetak Langsung (Print)
1. Setelah tabel menampilkan data yang akurat, perhatikan tombol di pojok kanan atas.
2. Klik tombol dengan ikon Printer (**Cetak / Print**).
3. Halaman akan masuk ke mode *Print Preview*. Tombol-tombol menu admin dan *sidebar* otomatis akan disembunyikan agar hasil cetak terlihat bersih dan profesional.
4. Pada jendela cetak *browser*, pastikan orientasi kertas (*Layout*) diatur ke **Landscape** jika kolom tabel dirasa terlalu sempit.
5. Anda dapat mencetaknya langsung ke kertas (pilih nama printer Anda) atau menyimpan *file* tersebut dengan memilih tujuan cetak **Save as PDF**.

`[MASUKKAN SCREENSHOT: Jendela Print Preview yang menunjukkan layout landscape bersih]`

### C. Cara Mengekspor ke Excel (Export Data) - *Jika Tersedia*
1. Tentukan filter rentang tanggal.
2. Tekan tombol **Export / Unduh Excel**.
3. Sistem akan memproses dan mengunduh *file* berektensi `.xlsx`. Data mentah dalam format Excel ini akan memudahkan pengurus Komsos untuk membuat grafik statistik pertumbuhan publikasi paroki.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Logika Penanggalan Valid:** Nilai pada **Tanggal Sampai** secara logis harus selalu lebih besar (lebih maju) atau sama dengan **Tanggal Dari**. Memasukkan tanggal terbalik akan menghasilkan laporan yang kosong (0 baris data).
* **Proteksi Manipulasi Data:** Karena halaman ini murni ditujukan untuk penyajian rekaman (*log*), Anda sama sekali tidak bisa menghapus, menambah, atau mengedit baris konten dari halaman ini. (Jika menemukan salah ketik di judul konten, Anda harus memperbaikinya langsung dari menu sumbernya, misalnya di Kelola Kronik).
* **Mode Cetak Anti-Clutter:** Fungsi klik **Cetak** memicu CSS khusus (*class* `no-print`) yang membuang semua kotak filter navigasi, sehingga tinta *printer* tidak terbuang sia-sia untuk hal yang tidak penting.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat mode Cetak (Print) diaktifkan, warna-warni pada kotak *Status* (misal warna hijau untuk "Aktif") menjadi transparan atau hilang.
**Solusi:** Ini adalah pengaturan bawaan pelit-tinta dari *browser* Anda (bukan *error* dari website). Pada jendela Print (khususnya Chrome), klik *More settings* (Setelan tambahan), gulir ke bawah, lalu centang opsi **Background graphics** (Grafik latar belakang). Warna pada tabel akan segera muncul kembali.

**Skenario 2:**
**Gejala:** Laporan Konten tidak menampilkan buletin paroki yang saya *upload* pagi ini.
**Solusi:** Perhatikan jam dan tanggal pada filter. Secara standar, laporan mungkin memotong filter hingga pukul `00:00` pada "Tanggal Sampai". Cobalah untuk memajukan "Tanggal Sampai" satu hari ke depan (misal: jika hari ini tanggal 15, set ke tanggal 16) agar data unggahan hari ini bisa masuk dalam batas perhitungan rentang *database*.

**Skenario 3:**
**Gejala:** Tabel kepanjangan dan saat diprint, teks di halaman kedua terpotong/menumpuk dengan nomor halaman.
**Solusi:** Hal ini terkait ukuran kertas (*Paper size*) di *browser* yang tidak sesuai dengan kertas printer Anda. Pastikan jika Anda menggunakan kertas A4, pilih *Size: A4* pada jendela cetak. Jika dirasa baris (*row*) terlalu padat, kurangi pengaturan skalanya (*Scale*) dari 100% menjadi 90% atau 85%.
