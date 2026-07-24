# BAB XXVII: KELOLA BGKP PAROKI (Badan Pengurus Gereja & Dana)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/bgkp`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola BGKP Paroki** (Badan Gereja Katolik Paroki) atau yang sering juga disamakan dengan struktur inti DPP (Dewan Pastoral Paroki) berfungsi untuk mendokumentasikan secara digital susunan organisasi pengurus gereja. 

Data kepengurusan yang dimasukkan melalui menu ini tidak hanya bertindak sebagai *database* internal, tetapi juga akan ditampilkan di halaman "Profil Paroki" bagi publik, sehingga umat bisa mengetahui secara pasti siapa saja tokoh awam maupun rohaniwan yang bertanggung jawab atas pengelolaan operasional dan keuangan paroki periode ini.

**Akses Pengguna (Role):** 
* **Superadmin & Sekretaris DPP:** Mereka yang memiliki *Surat Keputusan (SK)* dari keuskupan/pastoran berhak memperbarui susunan organisasi di dalam sistem ini setiap kali terjadi pergantian kepengurusan (biasanya per periode 3 tahun).

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Ketika mengeklik **Tambah Anggota**, jendela isian akan muncul. Form ini dirancang untuk mendokumentasikan posisi struktural seakurat mungkin:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Lengkap** | Teks | **Wajib** | Nama anggota pengurus beserta gelarnya (Contoh: Bpk. Nicolaus Yosep Smith). |
| **Jabatan Lengkap** | Teks | **Wajib** | Nama spesifik jabatannya (Contoh: "Ketua Harian" atau "Bendahara Pembangunan"). |
| **Tipe Jabatan** | Dropdown | **Wajib** | Klasifikasi hierarki sistem (Contoh: Ketua, Sekretaris, Anggota). Ini berguna untuk penyusunan urutan (sorter) foto di halaman publik nanti. |
| **Level Jabatan** | Teks | Opsional | Khusus untuk membedakan jenjang (Contoh isi: "I" atau "II" untuk Sekretaris I dan Sekretaris II). |
| **Ex Officio** | Checkbox | Opsional | Centang jika jabatan ini bersifat otomatis melekat pada jabatannya yang lain (misalnya Romo Paroki yang otomatis menjadi Ketua Umum BGKP). |
| **Periode (Mulai-Selesai)**| Datepicker | Opsional | Tanggal awal menjabat dan perkiraan tanggal turun jabatan (demisioner). |
| **Data SK (Nomor & Tgl)**| Teks & Datepicker| Opsional | Bukti legalitas pengangkatan pengurus. Masukkan Nomor SK (Contoh: `465/G.113/V/2026`) dan tanggal diterbitkannya SK tersebut. |
| **Catatan** | Teks Panjang | Opsional | Keterangan khusus tugas spesifik dari orang tersebut. |
| **Status Aktif** | Checkbox | Opsional | Centang agar nama pengurus tersebut tampil di *website*. Jika masa jabatannya habis, hilangkan centangnya untuk merumahkan datanya. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat Susunan Kepengurusan (Read)
1. Buka menu **Kelola BGKP** pada *sidebar* admin.
2. Anda akan disuguhkan tabel yang berisi nama-nama pengurus beserta struktur jabatannya. 
3. Di atas tabel, tersedia tiga filter penting: **Filter Jabatan**, **Filter Status**, dan **Urutkan**. Gunakan filter *Urutkan: Urutan Tampil* untuk melihat hierarki kepengurusan dari yang tertinggi (Ketua) hingga ke jajaran Anggota.

`[MASUKKAN SCREENSHOT: Tampilan tabel susunan pengurus BGKP yang difilter berdasar urutan tampil]`

### B. Cara Menambah Pengurus Baru (Create)
1. Klik tombol **+ Tambah Anggota** di kanan atas tabel.
2. Pada *pop-up* form yang muncul, isikan **Nama Lengkap**.
3. Ketikkan **Jabatan Lengkap** sesuai yang tertera di SK (Misal: "Sekretaris DPP").
4. Pilih **Tipe Jabatan** dari pilihan *dropdown* yang tersedia (agar sistem tahu hirarkinya). Jika ia adalah Sekretaris 2, masukkan angka romawi "II" di kotak **Level (optional)**.
5. (Sangat Disarankan) Isi **Tanggal Mulai**, **Nomor SK**, dan **Tanggal SK** sebagai bentuk arsip digital paroki.
6. Pastikan **Status Aktif** tercentang, lalu **Simpan**.

`[MASUKKAN SCREENSHOT: Tampilan form pengisian data lengkap pengurus baru]`

### C. Cara Mengubah Data atau Menurunkan Jabatan (Update)
Jika ada pengurus yang mengundurkan diri atau masa jabatannya telah habis:
1. Klik ikon **Pensil (Edit)** pada baris nama orang tersebut.
2. Jika ia hanya *typo* nama/jabatan, silakan perbaiki dan Simpan.
3. Jika ia **berhenti menjabat**, hilangkan centang pada kotak **Status Aktif**, pastikan **Tanggal Selesai** diisi dengan tanggal berhentinya, lalu klik **Simpan**. Data orang tersebut akan otomatis turun dari halaman utama website umat, namun tidak hilang dari *database* paroki.

### D. Cara Menghapus Data (Delete)
1. Dikhususkan hanya jika ada kesalahan *input* nama orang yang sebenarnya tidak pernah dilantik.
2. Klik ikon merah **Tempat Sampah (Delete)**.
3. Konfirmasi peringatan "Hapus Anggota BGKP" dengan menekan tombol **Ya / OK**.

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Kewajiban Pengelompokan (Tipe Jabatan):** Sistem secara *default* mungkin tidak tahu mana yang harus ditaruh paling atas di *website* publik antara "Ketua Harian" atau "Ketua Pembangunan". Itulah mengapa pengisian *dropdown* **Tipe Jabatan** bersifat **Wajib**, karena kolom inilah yang akan menentukan hierarki (jabatan dengan tipe 'Ketua' selalu dimunculkan di atas 'Anggota').
* **Penggunaan *Ex Officio*:** Opsi *Ex Officio* ini sebaiknya hanya dicentang untuk Romo Kepala Paroki, karena jabatannya sebagai Ketua Umum BGKP melekat bukan berdasarkan SK kepengurusan 3 tahunan, melainkan karena perannya sebagai gembala utama gereja.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Saya sudah menambahkan nama Bpk. Budi sebagai "Wakil Ketua", tapi kenapa di tabel urutannya malah berada di bawah "Anggota"?
**Solusi:** Anda kemungkinan salah memilih *dropdown* **Tipe Jabatan** saat membuatnya. Anda mungkin mengetikkan "Wakil Ketua" di form *Jabatan Lengkap*, tetapi Anda memilih "Anggota" di *dropdown Tipe Jabatan*. Klik Edit pada nama Bpk. Budi, lalu pastikan *Tipe Jabatan* diatur ke "Wakil" atau yang setara agar urutannya naik.

**Skenario 2:**
**Gejala:** Daftar susunan pengurus kepanjangan dan tercampur dengan pengurus lama tahun 2021.
**Solusi:** Pastikan Anda menonaktifkan pengurus lama. Klik tombol *Edit* pada nama-nama pengurus periode 2021, lalu hilangkan centang **Status Aktif**. Setelah itu, gunakan *Filter Status* di atas tabel untuk hanya menampilkan "Aktif".

**Skenario 3:**
**Gejala:** Di kolom SK, tulisan Nomor SK terpotong jika diakses dari layar HP (*mobile*).
**Solusi:** Ini adalah hal wajar terkait keterbatasan lebar layar HP (*responsive design*). Admin disarankan melakukan manajemen data kepengurusan semacam ini menggunakan PC/Laptop agar seluruh kolom tabel (Masa Periode, Nomor SK) bisa terbaca dengan utuh dan tidak ada kesalahan ketik.
