# BAB XXXV: DATABASE RESTORE (Pemulihan Data Keseluruhan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/restore`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Database Restore** merupakan fitur darurat paling berisiko tinggi (*high-risk*) di dalam ekosistem panel admin paroki. Fitur ini berfungsi untuk menimpa (mengganti) *database* yang sedang berjalan saat ini dengan *file* cadangan lama (*backup*) berformat `.sql`.

Tindakan ini ibarat memutar waktu *website* kembali ke masa lalu. Segala jenis penambahan data umat atau pendaftaran *booking* yang terjadi **setelah** tanggal *file backup* tersebut dibuat, akan **hilang atau musnah selamanya** digantikan dengan memori data yang lama. Itulah sebabnya fitur ini hanya boleh digunakan saat *website* benar-benar *error* parah atau data terhapus massal karena sabotase.

**Akses Pengguna (Role):** 
* **Superadmin / Tim IT / Developer:** Hanya boleh diakses oleh teknisi atau staf yang benar-benar paham risiko penimpaan *database*. Admin Sekretariat biasa diharamkan untuk mencoba fitur ini.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Berhubung fungsinya sangat mematikan, antarmuka halamannya didesain sesederhana mungkin agar tidak ada ruang untuk kebingungan.

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Area Upload SQL** | Kotak File Drop | **Wajib** | Area kotak bergaris putus-putus (*dashed*) untuk menarik-dan-melepas (*Drag & Drop*) *file* SQL atau klik untuk mencarinya secara manual di komputer Anda. |
| **Ikon Silang (Hapus)** | Tombol Ikon | Opsional | Muncul jika Anda sudah memasukkan *file*. Berfungsi untuk membatalkan file yang akan diunggah sebelum dieksekusi. |
| **Tombol Restore** | Tombol Aksi | Eksekusi | Tombol merah eksekusi akhir. Baru bisa diklik (*Enable*) jika Anda sudah memasukkan *file* ke dalam *Area Upload*. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### Cara Melakukan Pemulihan Data (*Restore*)
*Peringatan Keras: Pastikan Anda yakin 100% dan sudah berdiskusi dengan seluruh staf paroki sebelum menjalankan proses ini, karena pendaftaran umat yang baru masuk hari ini berpotensi hilang.*

1. Masuk ke menu **Database Restore**.
2. Anda akan disajikan dengan area bergaris putus-putus. Buka *folder* di komputer Anda yang berisi *file* hasil *Backup* terdahulu (contoh: `backup-stpaulus-2026-07-20.sql`).
3. Anda bisa mengeklik kotak tersebut untuk memilih *file*, atau tarik *file* dari *folder* lalu jatuhkan (*Drag & Drop*) ke dalam kotak bergaris tersebut.
4. Jika *file* berhasil masuk, nama *file* beserta ukuran datanya (contoh: `15.4 MB`) akan tampil di layar, dan tombol **Restore Database** di bagian bawah akan menyala (bisa diklik).
5. Klik **Restore Database**.
6. Sistem akan memunculkan jendela *pop-up* peringatan terakhir. Konfirmasi dengan memilih **Ya, Lanjutkan**.
7. Proses akan memakan waktu lumayan lama (berkisar antara 30 detik hingga 5 menit). **DILARANG KERAS** menutup *tab browser* atau mematikan internet selama proses ini berjalan, karena bisa menyebabkan *database* rusak total (*corrupt*).
8. Setelah muncul notifikasi "Sukses", Anda akan dipaksa keluar (*Logout*) dan *website* telah kembali ke kondisi memori lama.

`[MASUKKAN SCREENSHOT: Tampilan kotak Drag & Drop beserta tombol Restore Database yang menyala merah]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Validasi Ekstensi File:** Kotak *upload* dilengkapi proteksi khusus. Jika Anda mencoba memasukkan *file* selain `.sql` (Misal *file* `.zip`, `.pdf`, atau `.docx`), sistem akan menolaknya mentah-mentah dan tombol *Restore* tidak akan bisa ditekan.
* **Tidak Ada Fitur Undo (Batal):** Begitu baris pemuatan (*loading bar*) proses *restore* dimulai, sistem akan menghapus tabel lama satu per satu dan menggantinya. Tindakan ini bersifat absolut (mutlak). Tidak ada tombol "Kembali ke Masa Depan".
* **Kecocokan Skema (*Schema Match*):** Dilarang keras mengunggah *file* `.sql` dari aplikasi atau *website* paroki lain ke dalam sistem ini. Strukturnya berbeda, dan tindakan ini akan menghancurkan sistem secara instan.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat proses *Restore* berjalan 50%, tiba-tiba muncul *error* layar merah bertuliskan "*Timeout*" atau "*Payload Too Large*".
**Solusi:** Ini adalah musuh utama dari sistem *restore* berbasis *Web Browser*. Artinya ukuran *file database* Anda terlalu besar untuk diproses oleh kecepatan internet biasa. Jangan panik, *website* mungkin sedang dalam kondisi *corrupt* (setengah jadi). **Segera hubungi pihak Developer/Hosting**. Mereka perlu melakukan proses *restore* secara manual dari *Terminal Server* (menggunakan *command-line* SSH), bukan dari panel admin ini.

**Skenario 2:**
**Gejala:** Saya salah memasukkan *file Backup* tahun 2024, padahal niatnya memasukkan file *Backup* minggu lalu (2026).
**Solusi:** Selama Anda **belum** menekan tombol *Restore*, Anda masih aman. Klik saja ikon **Silang / Tempat Sampah Merah** di sebelah nama *file* tahun 2024 tersebut. Kotaknya akan kembali kosong. Silakan masukkan *file* yang benar.

**Skenario 3:**
**Gejala:** Setelah proses *Restore* berhasil dan 100% selesai, saya tidak bisa *Login* lagi menggunakan *password* saya saat ini.
**Solusi:** Ini adalah bukti bahwa *Restore* berhasil. Karena Anda memutar waktu sistem ke masa lalu, *password* yang berlaku sekarang adalah *password* lama Anda di masa tersebut. Coba ingat-ingat kembali *password* Anda pada tanggal *file backup* itu dibuat, atau gunakan fitur *Lupa Password*.
