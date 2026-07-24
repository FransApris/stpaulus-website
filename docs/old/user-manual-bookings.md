# BAB XIX: KELOLA PEMESANAN (Manajemen Booking Ruangan)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/bookings-new`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Pemesanan** merupakan pusat validasi (verifikasi) dari setiap permohonan peminjaman ruangan yang diajukan oleh umat/pengurus melalui *website* publik. 

Pada menu ini, admin tidak bertugas membuat pemesanan baru, melainkan bertindak sebagai "Pemberi Izin". Admin bertugas meninjau detail acara umat, memastikan tidak ada jadwal atau ruangan yang saling bertabrakan (*double booking*), dan akhirnya menyetujui, menolak, atau membatalkan permohonan tersebut.

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Memiliki hak penuh untuk meninjau, menyetujui, menolak permohonan, melihat riwayat audit (*Audit Logs*), dan mengunduh laporan (Excel).

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Di menu ini, interaksi admin lebih berfokus pada kotak dialog (pop-up) ketika melakukan **Penolakan** atau **Pembatalan** pesanan. Berikut *field* yang harus diisi:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Alasan Penolakan** | Teks Panjang | **Wajib** | Hanya muncul jika admin menekan tombol **Tolak (Reject)**. Admin harus menjelaskan mengapa izin ruangan tidak diberikan (Contoh: "Ruangan sedang direnovasi" atau "Bentrok dengan acara DPP"). Pesan ini akan dikirimkan ke pengguna. |
| **Alasan Pembatalan** | Teks Panjang | Opsional | Muncul saat membatalkan (*Cancel*) pesanan yang **sudah telanjur disetujui**. Meskipun opsional, sangat disarankan untuk diisi agar umat tahu mengapa acaranya dibatalkan mendadak. |
| **Filter Status** | Dropdown | Opsional | Alat bantu untuk menampilkan pemesanan berdasarkan status (Semua, Menunggu, Disetujui, Ditolak, Dibatalkan). |
| **Tanggal Dari & Sampai**| Date Picker | Opsional | Rentang waktu untuk menyaring atau mengunduh laporan pemesanan di bulan/minggu tertentu. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Memeriksa Data (Read & Review)
1. Buka menu **Kelola Pemesanan**.
2. Anda akan melihat deretan permohonan peminjaman. Permohonan yang paling mendesak (baru masuk) akan berada di atas.
3. Gunakan filter di bagian atas tabel (Status, Rentang Tanggal) jika ingin fokus mengecek yang statusnya masih **Menunggu (Pending)**.
4. Klik pada baris permohonan atau tombol **Detail** untuk membaca tujuan acara, jumlah orang, dan ruangan yang dipinjam.

`[MASUKKAN SCREENSHOT: Tampilan tabel Pemesanan Ruangan beserta baris filternya]`

### B. Cara Menyetujui Pemesanan (Approve)
1. Cari permohonan yang berstatus *Menunggu (Pending)*.
2. Pastikan jam dan ruangannya tidak bentrok dengan acara lain.
3. Klik tombol hijau **Setujui (Approve)**.
4. Status akan berubah, dan ruangan tersebut otomatis akan terkunci di sistem sehingga tidak bisa dipinjam umat lain di jam yang sama.

### C. Cara Menolak Pemesanan (Reject)
1. Jika ruangan tidak bisa dipakai, klik tombol merah **Tolak (Reject)**.
2. Kotak dialog *Tolak Pemesanan* akan muncul.
3. Isikan **Alasan Penolakan** secara jelas dan beretika. (Contoh: "Mohon maaf, Aula sudah di-booking oleh WKRI di jam yang sama").
4. Klik **Kirim Penolakan**.

`[MASUKKAN SCREENSHOT: Dialog pop-up pengisian Alasan Penolakan]`

### D. Cara Membatalkan Pesanan yang Telanjur Disetujui (Cancel)
1. Cari pesanan berstatus *Disetujui* yang tiba-tiba harus dibatalkan (misalnya karena ada acara paroki yang lebih *urgent*).
2. Klik tombol **Batalkan (Cancel)**.
3. Masukkan alasan pembatalan pada form *pop-up* yang muncul.
4. Klik **Konfirmasi Pembatalan**. Ruangan akan kembali kosong dan berstatus *Tersedia*.

### E. Cara Menghapus / Memulihkan (Delete & Restore)
1. Pesanan lama atau yang sifatnya *spam* bisa dihapus dengan menekan tombol berlambang **Tempat Sampah (Delete)**.
2. Data tidak benar-benar hilang, melainkan berpindah ke "Keranjang Sampah". 
3. Anda bisa melihat daftar yang terhapus dengan mengklik *tab/filter* yang relevan. Jika ingin mengembalikannya, klik tombol **Restore (Pulihkan)** pada data tersebut.

### F. Cara Mengunduh Laporan (Export Excel)
1. Atur **Filter Tanggal** di bagian atas (Contoh: 1 Januari s/d 31 Januari).
2. Klik tombol **Download Laporan / Export Excel**.
3. Komputer Anda akan mengunduh file `.xlsx` yang berisi rekapitulasi data *booking* selama periode tersebut, sangat berguna untuk dilaporkan ke rapat pleno pengurus.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Anti-Bentrok (Double Booking):** Jika ada umat mencoba me-request ruangan di jam yang bersinggungan dengan pesanan yang sudah *Disetujui*, sistem secara otomatis (di bagian depan umat) sudah menolak mereka. Namun, jika ada dua umat me-request di detik yang sama, admin harus memutuskan salah satu untuk disetujui, dan yang lainnya ditolak.
* **Kewajiban Pengisian Penolakan:** Form Tolak (*Reject*) memvalidasi isian Anda. Jika kotak teks alasan penolakan dibiarkan kosong, Anda tidak akan bisa menyelesaikan proses penolakan tersebut.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saat menekan tombol "Setujui", sistem memunculkan pesan error "Ruangan tidak tersedia pada jam tersebut".
**Solusi:** Kemungkinan besar ada admin lain yang sedetik lebih cepat dari Anda menyetujui pemesanan umat yang lain di ruangan yang sama. Anda harus menyegarkan halaman (F5), cek jadwal siapa yang sudah disetujui, dan Anda harus **Menolak (Reject)** sisa permohonan yang kalah cepat tadi.

**Skenario 2:**
**Gejala:** Saya salah menekan tombol "Tolak", padahal seharusnya "Setujui".
**Solusi:** Status pemesanan tidak bisa diubah kembali dari "Ditolak" menjadi "Disetujui" secara langsung karena sistem sudah melepaskan jadwal tersebut. Solusi paling rapi adalah menghubungi umat bersangkutan, memintanya melakukan *booking* ulang di website, lalu Anda segera menyetujui permohonan barunya.

**Skenario 3:**
**Gejala:** Saat mendownload laporan Excel, datanya kosong padahal bulan ini banyak yang meminjam.
**Solusi:** Periksa rentang tanggal **"Dari:"** dan **"Sampai:"** pada filter Anda. Seringkali admin terbalik mengisi tanggal (tanggal akhir ditaruh di awal). Pastikan input filter bulannya sudah akurat, kemudian tekan kembali tombol Download.
