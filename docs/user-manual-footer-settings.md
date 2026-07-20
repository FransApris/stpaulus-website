# BAB XXXI: PENGATURAN FOOTER (Manajemen Kaki Website & Tautan Cepat)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/footer-settings`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Pengaturan Footer** digunakan untuk mengelola area paling bawah dari *website* (bagian kaki/footer) yang biasanya berwarna gelap. Bagian ini melekat dan akan selalu terlihat oleh umat di halaman mana pun mereka berada (beranda, profil, agenda, dll).

Melalui menu ini, admin dapat merombak teks hak cipta (*copyright*), memperbarui alamat fisik gereja, mengatur tautan-tautan ke media sosial resmi paroki (Instagram, YouTube), serta menyusun menu "Tautan Cepat" (*Quick Links*) tanpa harus menyentuh baris kode (*coding*) sama sekali.

**Akses Pengguna (Role):** 
* **Superadmin & Editor Komsos:** Mereka yang bertanggung jawab memelihara informasi dasar dan menyalurkan lalu lintas *website* menuju media sosial paroki.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Formulir di menu ini terbagi menjadi 3 bagian (Blok) utama:

### A. Informasi Umum (*General Info*)
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Entitas Hak Cipta** | Teks | **Wajib** | Tulisan nama kepemilikan yang muncul di sebelah lambang © (Contoh: "KOMSOS Paroki St. Paulus"). |
| **Deskripsi Singkat** | Teks Panjang | Opsional | Kalimat sambutan pendek atau visi-misi paroki yang terletak di bawah logo *footer*. |
| **Alamat Fisik** | Teks Panjang | Opsional | Alamat lengkap gereja (Jalan, RT/RW, Kota, Kode Pos). |

### B. Tautan Media Sosial (*Social Media*)
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Platform** | Teks | **Wajib** | Nama medsos (Contoh: "Instagram" atau "YouTube"). |
| **Ikon Platform** | Teks | **Wajib** | Kode ikon FontAwesome untuk memunculkan logonya (Contoh: `fab fa-instagram` atau `fab fa-youtube`). |
| **Tautan / URL** | URL | **Wajib** | *Link* langsung yang mengarah ke *channel* medsos paroki (Misal: `https://instagram.com/komsosjuanda`). |

### C. Tautan Cepat (*Quick Links*)
| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Judul Link** | Teks | **Wajib** | Teks tombol tautan (Contoh: "Kebijakan Privasi" atau "Sejarah Gereja"). |
| **URL (Tautan)** | Teks | **Wajib** | Alamat URL tujuan (Contoh: `/privacy-policy` atau `https://google.com`). |
| **Kolom (Tipe)** | Dropdown | **Wajib** | Pengaturan letak susunan (Misal: menaruh *link* di Kolom Kiri atau Kolom Kanan *footer*). |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Mengubah Alamat dan Hak Cipta (Update General Info)
1. Buka menu **Pengaturan Footer** di panel sebelah kiri.
2. Pada blok formulir pertama ("Informasi Umum"), perbaiki teks yang ada di kotak **Entitas Hak Cipta**, **Deskripsi**, atau **Alamat Fisik**.
3. Gulir halaman ke paling bawah, dan klik tombol biru **Simpan Pengaturan**.
4. Buka *tab browser* baru, kunjungi *website* paroki, gulir ke paling bawah, dan pastikan perubahannya sudah tayang.

`[MASUKKAN SCREENSHOT: Tampilan 3 kotak isian Informasi Umum Footer]`

### B. Cara Menambah / Mengedit Media Sosial (Create & Update)
1. Gulir ke blok **Media Sosial**. Di situ Anda akan melihat daftar medsos yang sudah ada.
2. Jika ingin menambah baru (misal: TikTok), klik tombol **+ Tambah Media Sosial**.
3. Kotak isian baru akan muncul di bawahnya.
4. Isi **Nama Platform** dengan "TikTok".
5. Isi **Ikon Platform** dengan kode `fab fa-tiktok`.
6. Isi **URL** dengan alamat profil (Misal: `https://tiktok.com/@parokijuanda`).
7. Gulir ke paling bawah layar, klik **Simpan Pengaturan**.

`[MASUKKAN SCREENSHOT: Blok form Media Sosial yang menampilkan kolom Nama, Ikon, dan URL]`

### C. Cara Menyusun Tautan Cepat (Quick Links)
1. Temukan blok **Tautan Cepat (Quick Links)**.
2. Klik tombol **+ Tambah Tautan** jika ingin menambah menu pintasan ke halaman tertentu (misalnya Anda ingin mempromosikan formulir Baptis).
3. Isi **Judul** dengan "Pendaftaran Baptis" dan **URL** dengan alamat halaman *form* baptis tersebut.
4. Pilih diletakkan di **Kolom** mana (Kiri/Tengah/Kanan).
5. Klik **Simpan Pengaturan**.

### D. Cara Menghapus Tautan atau Medsos (Delete)
1. Jika ada akun medsos paroki yang diretas atau sudah tidak dipakai (misal: Twitter/X), masuk ke blok *Media Sosial*.
2. Cari baris input Twitter, lalu klik **Ikon Tempat Sampah (Hapus Merah)** yang ada di sebelahnya.
3. Ingat: Penghapusan di layar Anda belum permanen sampai Anda menggulir ke bawah dan menekan tombol **Simpan Pengaturan**.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Kode Ikon (FontAwesome):** *Website* ini menggunakan *library* ikon dari FontAwesome V5/V6. Pastikan kodenya tepat. Biasanya ikon merek medsos selalu diawali dengan `fab fa-` (Misal: `fab fa-facebook`). Jika Anda salah mengetik kodenya (misal hanya mengetik `instagram`), maka ikon kotaknya akan *blank*/kosong di halaman publik.
* **Aturan Format URL:** 
   - Untuk **Media Sosial**: Selalu gunakan tautan penuh yang diawali `https://`.
   - Untuk **Tautan Cepat Internal** (halaman di dalam web paroki): Cukup gunakan rute garis miring. (Contoh: `/tentang-kami` atau `/berita`).
* **Sistem Penyimpanan Terpadu:** Anda bisa menambah 3 medsos dan menghapus 2 tautan cepat sekaligus di layar, namun semuanya tidak akan diproses oleh *database* sampai Anda menekan tombol agung **Simpan Pengaturan** di akhir halaman.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya membuat Tautan Cepat baru bernama "Jadwal Misa" dan URL-nya `/jadwal-misa`, tapi saat umat mengkliknya dari *footer*, muncul *error* "Halaman Tidak Ditemukan" (404).
**Solusi:** Kemungkinan URL aslinya salah (salah rute/salah ketik). Periksa kembali alamat asli jadwal misa di *website*. Jika alamatnya adalah `stpaulusjuanda.org/mass-schedules`, maka pada kotak isian URL Tautan Cepat di menu *footer* ini, Anda harus menulisnya secara persis: `/mass-schedules` (bukan `/jadwal-misa`).

**Skenario 2:**
**Gejala:** Saya tidak tahu apa kode "Ikon Platform" untuk logo WhatsApp.
**Solusi:** Buka *tab* baru di *browser*, cari di Google: `FontAwesome WhatsApp icon`. Anda akan menemukan kodenya adalah `fab fa-whatsapp`. Ketikkan kode persis tersebut di form *footer*.

**Skenario 3:**
**Gejala:** Saya tak sengaja mengklik ikon 'Tempat Sampah' dan menghapus tautan Instagram, bagaimana cara *Undo*/membatalkannya?
**Solusi:** Jangan panik dan **JANGAN** klik "Simpan Pengaturan". Segera tekan tombol *Refresh/Reload* (F5) pada *browser* Anda. Halaman akan dimuat ulang, dan tautan Instagram yang tak sengaja terhapus di layar tadi akan muncul kembali dengan utuh mengambil data asli dari *server*.
