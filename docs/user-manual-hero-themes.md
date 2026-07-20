# BAB XXX: PENGELOLA TEMA HERO (Desain Banner Halaman Utama)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/hero-themes`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Pengelola Tema Hero** (*Hero Themes Manager*) adalah pusat kendali visual paling penting untuk mengatur wajah (halaman depan) *website* paroki. Gambar *Hero* merujuk pada foto atau poster raksasa yang menyambut umat sesaat setelah mereka membuka alamat *website* (biasanya terletak tepat di bawah logo paroki).

Melalui menu ini, paroki dapat dengan mudah mengganti "Tema/Nuansa" website sesuai kalender liturgi (misalnya mengganti *banner* depan dengan tema Paskah, Natal, atau Bulan Rosario) tanpa perlu meminta bantuan *developer* untuk merombak kode. Hanya ada **satu gambar** yang bisa menyala (*Aktif*) pada satu waktu.

**Akses Pengguna (Role):** 
* **Superadmin & Komsos (Komunikasi Sosial):** Mereka yang memiliki hak untuk merancang desain grafis dan menentukan visual utama *website* agar selaras dengan warna liturgi atau *event* paroki saat itu.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Pengisian form pada menu ini dibuat sesederhana mungkin agar proses ganti tema bisa dilakukan dengan cepat.

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Tema** | Teks | **Wajib** | Judul internal untuk memudahkan pencarian (Contoh: "Tema Natal 2026" atau "Paskah Nuansa Putih"). |
| **Gambar (Upload)** | File Upload | **Wajib** (Baru) | Kotak untuk mengunggah desain gambar/foto dari komputer. Format yang didukung: JPG, PNG, atau WEBP. *(Opsional saat Anda mengedit tema).* |
| **Status (Aktif/Tidak)**| Tombol Aksi | Dinamis | Indikator yang menunjukkan apakah gambar tersebut sedang dipasang di halaman depan umat. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat dan Memeriksa Tema (Read & Preview)
1. Buka menu **Pengelola Tema Hero** pada panel navigasi.
2. Anda akan melihat tabel daftar tema yang pernah diunggah. Kolom status akan menunjukkan label **Aktif** berwarna hijau untuk gambar yang sedang tayang, dan **Tidak Aktif** berwarna abu-abu untuk gambar yang tersimpan.
3. Untuk melihat seperti apa wujud gambarnya sebelum diaktifkan, klik tombol **Pratinjau (Ikon Mata)**. Gambar akan terbuka dalam bentuk *pop-up* besar (*preview*).

`[MASUKKAN SCREENSHOT: Tabel daftar tema dengan kolom status aktif/tidak aktif]`

### B. Cara Menambah Tema Baru (Create)
1. Persiapkan desain *banner* Anda di komputer (disarankan berukuran lebar, lanskap/mendatar resolusi *High-Definition*).
2. Klik tombol **+ Tambah Tema**.
3. Ketikkan **Nama Tema** (Misal: "Bulan Maria - Mei 2026").
4. Klik tombol **Pilih File (*Choose File*)** pada kolom *Gambar*, lalu cari *file* foto dari komputer Anda.
5. Klik **Simpan**.
*(Catatan: Tema yang baru disimpan tidak akan langsung mengganti gambar di depan, melainkan akan berstatus 'Tidak Aktif' terlebih dahulu agar Anda bisa mengeceknya).*

`[MASUKKAN SCREENSHOT: Jendela pop-up form penambahan nama tema dan upload gambar]`

### C. Cara Mengaktifkan / Mengganti Tema Halaman Depan (Set Active)
Ini adalah langkah paling krusial untuk mengubah wajah website:
1. Temukan tema yang ingin Anda jadikan sampul depan pada tabel.
2. Klik tombol centang hijau (**Aktifkan / Set Active**).
3. Anda juga bisa mengaktifkannya dari dalam jendela *Preview (Pratinjau)* dengan mengeklik tombol **Aktifkan**.
4. Sistem akan secara otomatis mencopot (*deactivate*) tema yang lama, dan menaikkan tema pilihan Anda ini ke halaman Beranda publik.

### D. Cara Mengubah Data atau Menghapus (Update & Delete)
* **Mengubah Nama/Gambar:** Klik tombol **Edit (Ikon Pensil)** jika Anda salah mengetik nama tema atau ingin menimpa gambar lama dengan revisi desain baru (tanpa mengubah namanya).
* **Menghapus Permanen:** Klik tombol **Hapus (Ikon Tempat Sampah Merah)** untuk menyingkirkan tema usang yang tak terpakai agar tidak memenuhi kapasitas *server*. 
*(Perhatian: Anda tidak bisa menghapus tema yang statusnya sedang 'Aktif'. Jika ingin menghapusnya, aktifkan tema lain terlebih dahulu).*

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Aturan Single-Active:** Sistem divalidasi dengan logika eksklusif. Artinya, jika Anda mengaktifkan 'Tema B', maka 'Tema A' yang sebelumnya aktif akan secara otomatis dipaksa turun (menjadi Tidak Aktif). Tidak mungkin ada dua tema yang menyala di halaman depan.
* **Resolusi & Dimensi Gambar:** Mengingat ini adalah gambar *Hero* (sampul depan penuh), pastikan gambar didesain dengan format mendatar/lanskap (*Landscape*). Jika Anda mengunggah gambar tegak/berdiri (*Portrait*), wajah website akan terlihat terpotong atau sangat memanjang ke bawah.
* **Batas Ukuran (*File Size*):** Gambar beresolusi tinggi memakan memori. Disarankan untuk membatasi ukuran gambar di bawah **2 MB**, agar proses akses *website* umat (*loading*) tetap secepat kilat. Gunakan format `.WEBP` atau kompres `.JPG` sebelum *upload*.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya sudah menekan tombol "Aktifkan" pada Tema Paskah, tapi kok di komputer atau HP saya tampilannya masih gambar tema lama (Pra-Paskah)?
**Solusi:** Ini adalah hal wajar yang disebabkan oleh *Cache* (sisa memori) pada *browser* Anda. Website sebenarnya sudah berubah, tapi *browser* Anda masih membaca memori kemarin. Silakan lakukan *Hard Refresh* dengan menekan **Ctrl + F5** (di Windows) atau **Cmd + Shift + R** (di Mac), maka gambar baru akan langsung muncul.

**Skenario 2:**
**Gejala:** Tombol Hapus (Tempat Sampah) pada salah satu tema tiba-tiba hilang atau tidak bisa diklik.
**Solusi:** Tema tersebut kemungkinan besar berstatus **Aktif**. Sistem memproteksi tema yang sedang menyala agar tidak terhapus tak sengaja (yang bisa membuat halaman depan menjadi *blank*). Anda harus mengaktifkan tema lain terlebih dahulu, barulah tombol hapus di tema tadi akan muncul kembali.

**Skenario 3:**
**Gejala:** Gambar yang saya unggah tampil gepeng atau bagian pinggirnya terpotong di layar HP.
**Solusi:** Gambar *Hero* dikonfigurasi dengan mode CSS `object-fit: cover` agar bisa menyesuaikan segala jenis ukuran layar laptop hingga HP. Solusi desain terbaik: Pastikan fokus objek utama (misalnya wajah orang atau teks salib) diletakkan di **tengah-tengah (*center*) gambar**, sehingga aman walau bagian pinggirnya terpotong otomatis oleh sistem HP.
