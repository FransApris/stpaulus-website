# BAB XXXVI: DATABASE MIGRASI (Penyesuaian Struktur Sistem & Uji Coba)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/migrations`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Database Migrasi** adalah fasilitas khusus level sistem yang disediakan untuk keperluan penyelarasan basis data (*database sync*) dan pengujian teknis. Fitur ini lazim digunakan ketika ada pembaruan besar (*major update*) pada *website* (misalnya penambahan kolom baru di tabel pendaftaran oleh *Developer*) yang mengharuskan *database* lama menyesuaikan diri tanpa kehilangan data.

Selain itu, halaman ini juga dilengkapi dengan alat diagnostik sederhana berupa **Test Email** untuk memastikan *server* masih mampu mengirimkan notifikasi (seperti pesan konfirmasi *booking* atau balasan pesan umat) dengan normal ke alamat *email*.

**Akses Pengguna (Role):** 
* **Superadmin / Developer:** Hanya boleh diakses oleh pimpinan teknis. Tidak direkomendasikan untuk Admin Sekretariat, karena mengeksekusi migrasi yang salah dapat merusak arsitektur *database*.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Halaman ini dibagi menjadi dua area fungsional, yaitu Area Uji Coba dan Area Daftar Migrasi:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Email Tujuan (Test)** | Teks (Email) | Opsional | Kotak untuk memasukkan alamat *email* Anda sendiri guna menguji apakah sistem SMTP (Pengiriman Surat) *server* berfungsi dengan baik. |
| **Kirim Test Email** | Tombol Aksi | Eksekusi | Tombol untuk meluncurkan *email* percobaan ke alamat yang sudah diketik di kotak sebelahnya. |
| **Daftar Migrasi** | Tabel Statis | *Read-only* | Menampilkan deretan modul atau *script* pembaruan *database* yang belum/sudah dijalankan. |
| **Jalankan (Run)** | Tombol Aksi | Eksekusi | Tombol untuk mengeksekusi satu baris *script* migrasi. Jika sudah pernah dijalankan, tombol akan berubah menjadi "Selesai" dan tidak bisa diklik lagi. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Menguji Pengiriman Email Server
Jika umat melapor bahwa mereka tidak mendapat *email* balasan setelah mengisi form kontak, Anda bisa menguji *server* melalui cara ini:
1. Masuk ke halaman **Database Migrasi**.
2. Di bagian paling atas, temukan kotak isian berlabel *Test Email*.
3. Masukkan alamat *email* pribadi Anda (Misal: `sekretariat.stpaulus@gmail.com`).
4. Klik tombol **Kirim Test Email**.
5. Tombol akan berubah menjadi *Mengirim...* dan setelah berhasil, akan muncul notifikasi sukses berwarna hijau di bawahnya.
6. Buka kotak masuk (*Inbox*) Gmail/Yahoo Anda untuk memastikan pesannya benar-benar mendarat.

`[MASUKKAN SCREENSHOT: Kotak pengisian Test Email yang menampilkan notifikasi sukses hijau]`

### B. Cara Menjalankan Script Migrasi (Database Update)
*Langkah ini biasanya hanya dilakukan jika Anda mendapat instruksi khusus dari Tim IT / Developer.*
1. Di bawah area *Test Email*, Anda akan melihat daftar modul migrasi.
2. Cari modul yang diminta oleh *Developer* (Misalnya: `Migrasi Tabel Booking V2`).
3. Pastikan di sebelah kanannya terdapat tombol merah bata bertuliskan **Jalankan**. (Jika tombol sudah berwarna hijau bertuliskan **Selesai**, berarti *script* itu sudah dieksekusi di masa lalu, Anda tidak perlu berbuat apa-apa).
4. Klik tombol **Jalankan** tersebut satu kali saja.
5. Biarkan *loading* berjalan hingga tombol berubah menjadi hijau bertuliskan **Selesai**. Arsitektur *database* Anda kini telah diperbarui.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Sekali Eksekusi (*Run-Once Policy*):** Setiap *script* migrasi dirancang hanya untuk dieksekusi **satu kali seumur hidup**. Begitu tombol diklik dan berhasil, sistem akan mengunci tombol tersebut selamanya menjadi warna hijau. Mengeksekusi *script* yang sama dua kali bisa mengakibatkan duplikasi data (data ganda) atau *error* tabel bentrok.
* **Format Email Valid:** Pada area *Test Email*, pastikan Anda menyertakan simbol `@` dan *domain* yang benar (Contoh: `@yahoo.co.id`). Jika formatnya salah, *server* otomatis menolak mengirim *email* tersebut.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya sudah mencoba mengirim *Test Email*, layarnya bilang "Sukses", tapi saya tunggu 15 menit di kotak masuk (*Inbox*) *email* saya, pesannya tidak ada.
**Solusi:** Kemungkinan besar sistem anti-spam Google/Yahoo mencurigai *email* tersebut karena dikirim dari *server* otomatis. Coba periksa *folder* **Spam** atau **Junk** Anda. Jika *email* masuk ke sana, klik tombol "Bukan Spam" agar ke depannya *email* dari paroki selalu masuk ke *Inbox* utama umat. Jika di folder Spam juga tidak ada, berarti SMTP/Password *Email* gereja di dalam *server* (*Environment Variables*) sudah kedaluwarsa dan perlu disetel ulang oleh Developer.

**Skenario 2:**
**Gejala:** Saat saya mengklik "Jalankan" pada salah satu migrasi, tombolnya berputar lama lalu muncul *error* "Table already exists" atau "Duplicate Column".
**Solusi:** Ini berarti struktur *database* tersebut diam-diam sudah pernah diperbarui sebelumnya secara manual (bukan lewat tombol ini). Abaikan saja *error* tersebut, karena ini mengonfirmasi bahwa *database* Anda sebenarnya sudah berada di versi terbaru (*up-to-date*).

**Skenario 3:**
**Gejala:** Haruskah saya rutin mengunjungi dan mengeklik tombol di halaman ini setiap minggu?
**Solusi:** Tidak perlu. Halaman ini adalah modul instalasi pasif. Anda hanya perlu ke sini jika ada rilis fitur baru (*update patch*) berskala besar yang diumumkan secara resmi oleh pengembang (*Developer*) website.
