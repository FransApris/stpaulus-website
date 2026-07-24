# BAB XXXIV: DATABASE BACKUP (Pencadangan Data Keseluruhan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/backup`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Database Backup** adalah fitur krusial yang berfungsi sebagai "Asuransi Penyelamat" bagi seluruh sistem *website* Paroki. Melalui menu ini, sistem akan mengekstrak (menyalin) seluruh data mulai dari jadwal misa, artikel, profil pengurus, pendaftaran umat, hingga rekam jejak pesan, lalu membungkusnya menjadi satu buah *file* `.sql` yang bisa diunduh ke komputer Anda.

Jika suatu saat *website* terkena peretasan (*hack*), kerusakan *server*, atau hilangnya data secara tak sengaja, *file backup* inilah yang akan digunakan oleh tim teknisi/Developer untuk mengembalikan kondisi *website* seperti sedia kala (*Restore*).

**Akses Pengguna (Role):** 
* **Superadmin Eksklusif:** Hanya pemegang kasta tertinggi (Superadmin) yang dapat mengakses halaman ini. Editor dan Admin Sekretariat biasa tidak diizinkan masuk karena alasan keamanan tingkat tinggi (mencegah kebocoran data sensitif umat).

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Sesuai dengan fungsinya, halaman ini sangat sederhana dan dirancang tanpa form isian teks apa pun. Anda hanya akan melihat layar statistik dan satu tombol aksi:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Info Database** | Teks | *Read-only* | Menampilkan nama *database* paroki yang saat ini beroperasi di dalam server. |
| **Last Backup** | Teks | *Read-only* | Menampilkan informasi kapan terakhir kali pencadangan data ini dilakukan oleh admin. |
| **Download Backup** | Tombol Aksi | Eksekusi | Tombol sakti untuk memulai proses pengekstrakan seluruh data ke dalam bentuk *file*. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

Mengingat tidak ada fitur Tambah, Edit, atau Hapus di menu ini, berikut adalah rutinitas tunggal untuk melakukan pencadangan data:

### Cara Melakukan Pencadangan Data (Download Backup)
**Sangat Disarankan: Lakukan langkah ini minimal 1 Bulan sekali, atau setiap kali usai pendaftaran besar-besaran (seperti usai pendaftaran Sakramen Krisma massal).**

1. Masuk ke menu **Database Backup**.
2. Anda akan disajikan dengan kartu informasi bergambar ikon *Cloud/Server* warna biru.
3. Klik tombol biru bertuliskan **Unduh (*Download*) Backup**.
4. Tombol akan berubah memunculkan animasi putaran (*loading*). Jangan tutup *tab browser* atau menekan tombol kembali (*Back*) selama proses ini berlangsung. Semakin banyak data umat, semakin lama prosesnya (berkisar antara 5 detik hingga 2 menit).
5. Setelah berhasil, *browser* Anda akan otomatis mengunduh *file* berformat `.sql` (Contoh nama file: `backup-stpaulus-2026-07-20.sql`).
6. **Sangat Penting:** Simpan *file* tersebut di dalam komputer Anda (sebaiknya di dalam *Google Drive* paroki atau *Hardisk* Eksternal) di dalam folder yang aman.

`[MASUKKAN SCREENSHOT: Tampilan kartu Download Backup beserta keterangan tanggal Last Backup]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kerahasiaan File SQL:** *File* yang berhasil Anda unduh dari halaman ini tidak boleh sembarangan dikirimkan melalui grup WhatsApp atau diserahkan ke orang tak dikenal. *File* ini berisi **seluruh data paroki**, termasuk *password* yang terenkripsi dan nomor telepon/email seluruh umat.
* **Tidak Ada Fitur Restore Mandiri:** Melalui menu ini, Anda hanya bisa *Mendownload*. Anda **tidak bisa** melakukan proses unggah ulang (*Restore/Recovery*) ke *server* secara mandiri. Hal ini disengaja untuk mencegah admin awam menimpa *database* secara tak sengaja yang berakibat fatal. Jika *website* rusak dan Anda butuh melakukan *Restore*, berikan *file* unduhan tersebut kepada tim Teknisi Server / *Developer* paroki.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya sudah menekan tombol *Download Backup*, animasinya berputar, tapi setelah 3 menit tidak ada *file* apa pun yang terunduh dan tombolnya macet.
**Solusi:** Kemungkinan sistem PHP *server* kehabisan waktu memori (*Timeout*) karena ukuran data paroki yang terlalu gemuk, atau koneksi *internet* Anda sempat putus saat proses ekstrak berjalan. Lakukan *Refresh* halaman (F5), pastikan sinyal *internet* Anda kencang, lalu coba klik *Download* sekali lagi. Jika tetap gagal 3x berturut-turut, *database* sudah terlalu besar dan butuh campur tangan Developer (melakukan *backup* paksa lewat *terminal server*).

**Skenario 2:**
**Gejala:** *File* berhasil diunduh, lalu saat saya klik 2x (*double-click*) di komputer saya, komputernya bingung (menanyakan *Open With / Aplikasi apa yang mau dipakai*) atau memunculkan deretan teks aneh.
**Solusi:** File `.sql` bukanlah *file* dokumen seperti *Microsoft Word* atau *Excel*. Anda tidak perlu membukanya atau mencoba membacanya. Biarkan saja *file* tersebut apa adanya, lalu amankan ke dalam *flashdisk* / penyimpanan awan (*Cloud*). Anda baru menyerahkannya saat terjadi keadaan darurat teknis pada *website*.
