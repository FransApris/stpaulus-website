# BAB XXII: PESAN MASUK (Manajemen Kontak & Aspirasi Umat)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/contact-messages`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Pesan Masuk** berfungsi layaknya kotak masuk (*Inbox* Email) internal untuk *website* paroki. Menu ini menampung seluruh aspirasi, keluhan, maupun pertanyaan yang dikirimkan oleh umat atau publik melalui halaman "Hubungi Kami" (*Contact Us*) di situs utama.

Admin tidak bisa "membuat" pesan dari menu ini. Fitur ini dirancang murni untuk membaca, memantau, dan menghapus pesan. Sistem antarmukanya (*interface*) juga dibuat modern, terbagi menjadi panel daftar pesan di sebelah kiri dan panel pembacaan detail pesan di sebelah kanan.

**Akses Pengguna (Role):** 
* **Admin Sekretariat & Komsos:** Mereka adalah garda terdepan komunikasi paroki yang wajib memantau menu ini setiap hari untuk merespons pertanyaan umat secara cepat.
* **Superadmin:** Untuk memantau kualitas pelayanan sekretariat terhadap aspirasi umat.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Berhubung ini adalah menu *Inbox*, tidak ada *form* untuk menginput data baru. Namun, saat Anda membaca sebuah pesan, Anda akan melihat informasi (Parameter) yang dikirimkan oleh umat:

| Nama Field | Sifat Tampilan | Deskripsi & Fungsi |
| :--- | :--- | :--- |
| **Nama Pengirim** | Teks | Nama umat yang menghubungi paroki. |
| **Email Pengirim** | Teks | Alamat email tujuan jika admin ingin membalas (*Reply*) pertanyaan tersebut. |
| **Nomor Telepon** | Teks | Nomor yang bisa dihubungi (jika umat mengisinya). |
| **Subjek / Judul** | Teks | Topik utama pesan (Misal: "Tanya Syarat Baptis Anak"). |
| **Isi Pesan** | Teks Panjang | Rincian pertanyaan atau keluhan. |
| **Status Baca** | Indikator | Menandakan apakah pesan sudah dibaca (*Read*) atau belum (*Unread*). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Membaca Pesan Baru (Read)
1. Akses menu **Pesan Masuk** di panel admin.
2. Di panel sebelah kiri, Anda akan melihat daftar pesan. Pesan yang memiliki tanda titik indikator atau ditebalkan (*Bold*) menandakan bahwa pesan tersebut berstatus **Belum Dibaca** (*Unread*).
3. Anda bisa menggunakan *Tab Filter* di atas daftar pesan untuk hanya menampilkan **Belum Dibaca**, atau menampilkan **Semua** pesan.
4. Klik salah satu pesan dari daftar sebelah kiri tersebut.
5. Detail lengkap pesan akan otomatis terbuka di layar (panel) sebelah kanan. Statusnya pun akan langsung berubah menjadi "Sudah Dibaca".

`[MASUKKAN SCREENSHOT: Tampilan layar yang terbagi dua: daftar pesan di kiri, detail isi pesan di kanan]`

### B. Cara Merespons / Membalas Pesan (Reply)
Sistem *website* saat ini tidak menyediakan fitur "Kirim Balasan" secara langsung dari dalam panel admin.
1. Baca pesan dan perhatikan bagian **Email** atau **Nomor Telepon** pengirim.
2. Gunakan aplikasi Email resmi sekretariat paroki (misalnya Gmail/Outlook) atau *WhatsApp* kantor untuk membalas pertanyaan umat tersebut ke kontak yang tertera.

### C. Cara Menghapus Pesan (Delete)
Pesan masuk yang berupa penipuan (*Spam*), promosi iklan, atau yang dirasa sudah tidak penting dapat dihapus untuk menghemat *storage* (ruang penyimpanan).
1. Klik pesan yang ingin dibuang dari daftar di sebelah kiri.
2. Setelah detailnya muncul di sebelah kanan, cari dan klik ikon merah bergambar tempat sampah (**Hapus / Delete**).
3. Sistem akan memunculkan peringatan. Klik **Ya, Hapus** untuk membuangnya secara permanen.

`[MASUKKAN SCREENSHOT: Tombol hapus (delete) yang berada di sudut area pembacaan pesan]`

### D. Cara Menyegarkan Kotak Masuk (Refresh)
Jika Anda sedang menunggu pesan masuk dari seseorang:
1. Klik tombol **Refresh** (ikon panah melingkar) di pojok kanan atas layar (tepat di sebelah teks hitungan "Total Pesan").
2. Daftar pesan akan diperbarui tanpa perlu me-*reload* seluruh halaman *browser*.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Auto-Read System:** Sistem divalidasi dengan logika klik. Segera setelah Anda mengklik sebuah judul pesan di panel kiri untuk pertama kalinya, hitungan *badge* merah (notifikasi) pesan belum dibaca di sistem akan otomatis berkurang satu.
* **Anti-Spam (Penghapusan Permanen):** Tidak ada folder "Tong Sampah" (*Recycle Bin*) pada menu ini. Jika Anda menghapus pesan, data tersebut akan hilang seketika secara permanen. Pastikan pesan sudah tidak diperlukan sebelum menghapusnya.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Ada notifikasi angka "1" di menu Pesan Masuk, tetapi saat saya buka, tidak ada pesan baru yang terlihat tebal/berwarna di daftar.
**Solusi:** Kemungkinan pesan tersebut sudah tertumpuk jauh di bawah (pesan lama yang terlewat dibaca). Jangan mencarinya secara manual; cukup klik *tab/filter* **"Belum Dibaca"** di panel sebelah kiri, maka sistem akan langsung menyaring dan memunculkan 1 pesan yang tersembunyi tersebut.

**Skenario 2:**
**Gejala:** Saya mengklik sebuah pesan dan ingin membalasnya, tapi tidak menemukan tombol "Kirim Balasan".
**Solusi:** Sesuai desain sistem, *website* paroki tidak difungsikan sebagai klien email penuh (seperti Gmail). Anda diwajibkan menyalin (*copy*) alamat email umat tersebut, lalu membalasnya menggunakan email resmi sekretariat (misalnya: `sekretariat@stpaulusjuanda.org`).

**Skenario 3:**
**Gejala:** Daftar pesan sebelah kiri blank (kosong melompong) padahal ada keterangan "Total: 5 pesan".
**Solusi:** Hal ini biasanya diakibatkan koneksi internet Anda yang sempat terputus saat proses penarikan data berjalan. Klik tombol **Refresh** (ikon putar) di pojok kanan atas halaman untuk memerintahkan sistem memuat ulang daftar pesan.
