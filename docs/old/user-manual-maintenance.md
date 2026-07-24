# BAB XXXII: MANAJEMEN MAINTENANCE (Pengaturan Perawatan Halaman)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/maintenance`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Manajemen Maintenance** adalah fitur panel kontrol darurat yang dirancang untuk mengunci/menutup halaman *website* publik tertentu untuk sementara waktu.

Saat sebuah halaman diaktifkan mode *maintenance*-nya, pengunjung atau umat yang mengakses halaman tersebut tidak akan bisa melihat isinya. Sebagai gantinya, umat akan disambut dengan layar "Sedang Dalam Perbaikan / Perawatan" yang estetik. Fitur ini sangat bermanfaat jika Anda sedang mengunggah banyak data sekaligus (agar umat tidak melihat tampilan setengah jadi) atau jika sebuah fitur (misalnya *Booking Ruangan*) sedang mengalami gangguan teknis.

**Akses Pengguna (Role):** 
* **Superadmin:** Satu-satunya pemegang otoritas yang diizinkan untuk mengunci sebuah halaman karena ini berdampak langsung pada operasional umat secara keseluruhan.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Halaman ini didesain sangat minimalis dan aman. Tidak ada pengetikan teks manual, hanya berupa daftar nama halaman dan tombol *Switch* (Sakelar).

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Daftar Halaman** | Teks | *Read-only* | Menampilkan modul-modul penting *website* (Contoh: "Formulir Booking", "Jadwal Misa", "Kronik"). |
| **Sakelar (Toggle)** | Tombol Geser| Tombol Aksi | Mengubah status halaman menjadi: <br>• **Menyala (Aktif):** Halaman dalam perbaikan (Tertutup untuk umat). <br>• **Mati (Nonaktif):** Halaman normal kembali (Bisa diakses umat). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Membaca Status Halaman (Read)
1. Buka menu **Manajemen Maintenance** di barisan menu administrator.
2. Anda akan disajikan dengan sebuah kotak panjang (*Banner*) berisi penjelasan cara kerja sistem.
3. Di bawahnya terdapat tabel rapi yang memuat nama-nama halaman. Perhatikan tombol **Sakelar (*Toggle Switch*)** di sisi kanan setiap baris:
   - Jika sakelarnya **berwarna abu-abu** dan posisinya di kiri, artinya halaman sedang normal/baik-baik saja.
   - Jika sakelarnya **berwarna merah bata** dan posisinya di kanan, artinya halaman tersebut sedang digembok/ditutup untuk perbaikan.

### B. Cara Menutup Halaman (Aktifkan Mode Maintenance)
**Skenario:** Anda sedang mengubah seluruh harga sewa ruangan, dan tidak ingin ada umat yang *booking* sebelum harga baru Anda simpan.
1. Cari baris bertuliskan **Booking Ruangan / Fasilitas** di dalam tabel halaman.
2. Klik tombol sakelar di sebelah kanan baris tersebut satu kali.
3. Sakelar akan menampilkan animasi berputar (*loading*), lalu bergeser ke kanan dan berubah warna.
4. Mulai detik tersebut, setiap umat yang mencoba masuk ke halaman "Pemesanan Ruangan", hanya akan menjumpai layar "Mohon Maaf, Halaman Sedang dalam Perawatan".

`[MASUKKAN SCREENSHOT: Kursor sedang mengeklik sakelar untuk mengaktifkan maintenance]`

### C. Cara Membuka Kembali Halaman (Nonaktifkan Maintenance)
1. Setelah tugas Anda (seperti mengubah harga sewa atau menambah jadwal) sudah selesai, kembalilah ke menu **Manajemen Maintenance** ini.
2. Cari halaman yang tadi sakelarnya menyala merah bata.
3. Klik sakelar tersebut sekali lagi.
4. Sakelar akan bergeser kembali ke kiri (berwarna abu-abu). Website kini sudah dibuka kembali dan beroperasi secara normal untuk umat.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Konten Tidak Dihapus:** Mengaktifkan mode *maintenance* **tidak akan menghapus**, menghilangkan, atau mengubah sedikit pun data *database* pada halaman tersebut. Halaman itu murni hanya "ditutup tirainya" menggunakan kode pembatas agar tidak bisa dilihat orang luar.
* **Auto-Save System:** Layar pengaturan ini tidak memiliki tombol agung "Simpan Semua". Setiap kali Anda mengklik sakelar, sistem langsung mengeksekusinya (*real-time auto-save*). Pastikan Anda tidak iseng mengeklik sakelar jika tidak berniat menutup *website*.
* **Limitasi Akses:** Jika *website* utama tertutup karena *maintenance*, panel admin ini **tetap bisa diakses** (tidak ikut terkunci), sehingga Anda tidak perlu takut kehilangan akses.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Sakelar (*toggle*) berputar *loading* terus menerus tanpa henti saat saya klik.
**Solusi:** Koneksi *internet* Anda kemungkinan besar putus sepersekian detik di saat permintaan terkirim ke *server*. Tekan *Refresh* halaman pada *browser* (F5), dan periksa apakah status sakelarnya sudah berubah. Jika belum, klik kembali sakelarnya saat internet stabil.

**Skenario 2:**
**Gejala:** Saya sudah menonaktifkan sakelar (abu-abu), tapi umat masih melaporkan bahwa halaman Booking masih menampilkan pesan "Sedang Dalam Perawatan".
**Solusi:** Beri tahu umat tersebut untuk me-*refresh* *browser* HP/laptop mereka (*Swipe down* atau tekan lambang panah melingkar). *Browser* kadang masih "menyimpan" layar *error* versi 5 menit yang lalu (*cache*), sehingga mereka hanya butuh *refresh* untuk memuat tampilan terbarunya.

**Skenario 3:**
**Gejala:** Bolehkah saya membiarkan halaman "Sakramen" dalam mode maintenance selama seminggu penuh?
**Solusi:** Sangat tidak disarankan. Mode maintenance didesain untuk perbaikan jam/harian. Jika halaman tersebut akan ditarik dari peredaran dalam waktu lama (berbulan-bulan), lebih baik minta bantuan tim Komsos/IT untuk menyembunyikan saja tautan menu "Sakramen"-nya dari *header/footer* website.
