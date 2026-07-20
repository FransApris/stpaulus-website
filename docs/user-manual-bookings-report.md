# BAB XX: LAPORAN PEMESANAN (Rekapitulasi Data Booking)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/bookings-report`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Laporan Pemesanan** difungsikan khusus sebagai pusat *Data Analytics* dan Rekapitulasi bagi seluruh aktivitas peminjaman ruangan yang telah terjadi atau akan terjadi di paroki. 

Berbeda dengan menu "Kelola Pemesanan" yang digunakan untuk menyetujui/menolak pesanan secara *real-time*, menu ini didesain khusus untuk kebutuhan presentasi rapat, pengarsipan (*Export Data*), dan pencetakan (Print). Anda bisa menarik laporan bulanan atau tahunan dengan sangat cepat tanpa terganggu oleh form edit atau tombol persetujuan.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Memiliki akses ke halaman ini untuk menarik (*generate*) laporan aktivitas gedung guna dipertanggungjawabkan dalam rapat pleno paroki.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Halaman ini tidak memiliki form input yang rumit untuk mengubah data (karena sifatnya *Read-Only*). Filter utamanya hanyalah rentang waktu:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Tanggal Dari (Start Date)** | Date Picker | **Wajib** | Titik awal penarikan data laporan (Contoh: 1 Januari 2026). |
| **Tanggal Sampai (End Date)** | Date Picker | **Wajib** | Titik akhir penarikan data (Contoh: 31 Januari 2026). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Menampilkan/Membaca Laporan (Read)
1. Buka menu **Laporan Pemesanan** (*Bookings Report*) dari panel navigasi.
2. Di bagian pojok kiri atas, isi kotak **Tanggal Dari** dan **Tanggal Sampai** sesuai periode bulan yang ingin Anda evaluasi.
3. Sistem akan otomatis memuat ulang (atau Anda menekan tombol **Tampilkan**) lalu menyajikan tabel rapi yang berisi Daftar Pemesan, Acara, Ruangan, dan Status akhirnya.

`[MASUKKAN SCREENSHOT: Tampilan tabel laporan setelah filter tanggal diatur]`

### B. Cara Mengunduh Laporan ke PDF / Cetak (Print)
1. Pastikan data yang tampil di layar sudah sesuai dengan rentang tanggal yang Anda inginkan.
2. Klik tombol berlambang Printer (**Cetak / Print**) di pojok kanan atas.
3. Jendela dialog cetak dari *browser* (Chrome/Safari) akan terbuka. Tampilan halaman ini sudah dikonfigurasi khusus (*Print-Friendly*), sehingga elemen-elemen admin seperti menu samping (*sidebar*) dan tombol-tombol akan otomatis menghilang dari kertas.
4. Anda bisa langsung mencetaknya ke mesin *Printer*, atau pada opsi *Destination/Printer*, pilih **Save as PDF** untuk menyimpannya sebagai *file* PDF.

`[MASUKKAN SCREENSHOT: Tampilan layar saat mode pencetakan (Print Preview) aktif]`

### C. Cara Mengekspor ke Excel (Export Data) - *Jika Tersedia*
1. Atur rentang tanggal bulan yang dituju.
2. Klik tombol **Export / Unduh Excel**.
3. Komputer Anda akan mengunduh *file* berformat `.xlsx` yang bisa Anda buka dengan Microsoft Excel. Format ini sangat berguna jika Anda ingin menyortir ulang datanya atau membuat grafik persentase ruangan mana yang paling laris dipinjam.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Rentang Tanggal:** **Tanggal Sampai (End Date)** tidak boleh lebih lama/lampau dibandingkan **Tanggal Dari (Start Date)**. Jika Anda memasukkan (Dari: 30 Januari) dan (Sampai: 1 Januari), sistem akan menampilkan tabel kosong atau *error*.
* **Limitasi Tampilan Cetak (Print):** Saat masuk ke mode *Print Preview*, tabel mungkin terpotong jika halamannya terlalu panjang. Sistem dirancang membagi otomatis ke halaman berikutnya (*Page Break*), namun usahakan kertas diatur pada posisi **Landscape** jika teksnya terlalu padat.
* **Tidak Ada Fitur Edit:** Sesuai namanya, Anda dilarang/tidak bisa melakukan fungsi hapus, edit, atau ganti status di halaman ini.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat mencetak (Print), *sidebar* menu admin sebelah kiri ikut tercetak sehingga tabel laporan terpotong dan terlihat berantakan.
**Solusi:** Seharusnya kelas `no-print` sudah bekerja. Jika *sidebar* masih tercetak, pastikan Anda menggunakan *browser* versi terbaru (disarankan Google Chrome). Sebagai alternatif yang lebih aman, Anda bisa menekan **Ctrl + P** (atau `Cmd + P` di Mac), lalu ubah Layout kertas dari *Portrait* menjadi *Landscape*, serta centang opsi "Background graphics" jika warna barisnya hilang.

**Skenario 2:**
**Gejala:** Laporan pemesanan kosong padahal kemarin baru saja menyetujui pemesanan "Rapat WKRI".
**Solusi:** Pesanan "Rapat WKRI" tersebut mungkin dilaksanakan bulan **depan**, sementara filter **Tanggal** yang terpasang di laporan Anda secara *default* hanya mengecek acara di bulan **ini**. Ubah filter tanggal sampai ke bulan depan, maka pesanan tersebut akan muncul di laporan.

**Skenario 3:**
**Gejala:** Data Excel (*.xlsx*) yang diunduh tidak bisa dibuka karena diklaim *corrupted* (rusak).
**Solusi:** Hal ini kadang dipengaruhi oleh *software* pembaca di komputer lama. Silakan *upload* file Excel yang gagal dibuka tersebut ke Google Drive, lalu buka menggunakan **Google Sheets** (biasanya 100% kompatibel dan langsung terbuka rapi).
