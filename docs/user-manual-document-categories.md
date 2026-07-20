# BAB XXIV: KELOLA KATEGORI DOKUMEN (Klasifikasi Arsip & Surat)
**URL Endpoint:** `https://stpaulusjuanda.org/admin/document-categories`

## 1. DESKRIPSI & FUNGSI UTAMA
Menu **Kelola Kategori Dokumen** berfungsi sebagai pusat pembuatan klasifikasi atau "map folder digital" untuk seluruh sistem pengarsipan paroki. Kategori ini mendikte bagaimana file-file PDF, dokumen surat, atau formulir pendaftaran nantinya dikelompokkan pada menu *Kelola Dokumen*.

Pengaturan warna yang spesifik pada setiap kategori ditujukan untuk memudahkan mata admin (serta umat yang nanti mengunduhnya) dalam membedakan secara instan antara dokumen mana yang bersifat "Formulir", mana yang bersifat "Laporan", atau mana yang merupakan "Surat Keputusan".

**Akses Pengguna (Role):** 
* **Superadmin & Admin Sekretariat:** Mereka memegang kendali atas struktur pengarsipan (*filing system*) paroki dan berhak merombak jenis-jenis kategori dokumen.

---

## 2. DAFTAR PARAMETER / FIELD FORM (Form Fields Specification)
Ketika menekan tombol **Tambah Kategori** atau ketika masuk ke mode **Edit**, sebuah jendela dialog akan meminta parameter berikut:

| Nama Field | Jenis Input | Sifat | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Nama Kategori** | Teks Pendek | **Wajib** | Nama klasifikasi untuk kelompok dokumen (Contoh: "Surat Edaran", "Formulir Sakramen", "Laporan Keuangan"). |
| **Warna Kategori** | Color Picker & Hex | **Wajib** | Warna label (tag) yang akan ditempelkan pada kategori tersebut. Anda bisa langsung mengeklik palet untuk memilih warna, atau memasukkan kode heksadesimal HTML (contoh: `#882F1D`). |
| **Deskripsi** | Teks Panjang | Opsional | Penjelasan singkat (untuk staf admin lainnya) mengenai kriteria *file* yang boleh dimasukkan ke dalam kategori ini. |
| **Status Aktif** | Checkbox | Opsional | Centang agar kategori ini tersedia sebagai pilihan di dalam menu pengunggahan dokumen. |

---

## 3. PANDUAN LANGKAH DEMI LANGKAH (Step-by-Step Tutorial)

### A. Cara Melihat/Membaca Data (Read)
1. Pilih menu **Kategori Dokumen** pada panel sebelah kiri.
2. Daftar kategori akan tersaji dalam format tabel. Setiap baris data memiliki bulatan atau kotak kecil berwarna di sebelahnya yang memvisualisasikan pilihan warna dari kategori tersebut.
3. Anda dapat mencari kategori tertentu dengan menggeser halaman atau menggunakan fitur *Search*.

`[MASUKKAN SCREENSHOT: Tampilan tabel Kategori Dokumen dengan indikator warna-warninya]`

### B. Cara Menambah Kategori Baru (Create)
1. Klik tombol **+ Tambah Kategori** di atas tabel.
2. Jendela pengisian *form* melayang (*pop-up*) akan muncul.
3. Masukkan **Nama Kategori** (Misal: "Dokumen Bina Iman").
4. Klik kotak pemilih **Warna**, lalu pilihlah warna yang cerah dan enak dipandang. (Sistem juga menyediakan kotak input berupa teks jika Anda sudah memiliki kode warna/Hex spesifik dari panduan desain paroki).
5. (Opsional) Tambahkan **Deskripsi**.
6. Centang **Status Aktif**, lalu tekan tombol **Simpan**.

`[MASUKKAN SCREENSHOT: Pop-up form penambahan Kategori Dokumen beserta palet warnanya]`

### C. Cara Mengubah/Mengedit Data (Update)
1. Sorot baris nama kategori yang ada di dalam tabel, lalu klik ikon **Pensil (Edit)**.
2. Ubahlah bagian yang diperlukan (misal: mengganti warnanya dari merah ke biru).
3. Anda juga bisa menonaktifkan kategori tersebut dengan menghapus centang pada kotak **Status Aktif**.
4. Klik **Simpan** untuk mengunci perubahan. 

*(Perhatian: Jika warnanya Anda ganti, semua dokumen yang telah diklasifikasikan ke kategori ini akan otomatis ikut berganti warna labelnya di halaman depan).*

### D. Cara Menghapus Data (Delete)
1. Temukan kategori usang yang sudah tidak pernah digunakan lagi.
2. Klik ikon tempat sampah (**Delete**) merah di sebelah tombol Edit.
3. *Browser* akan meminta Anda mengkonfirmasi penghapusan ("Apakah Anda yakin ingin menghapus data ini?"). Klik **OK / Yes**.

`[MASUKKAN SCREENSHOT: Tampilan dialog konfirmasi pop-up dari sistem saat menghapus data]`

---

## 4. VALIDASI ATURAN & BATASAN SISTEM (Business Rules & Constraints)
* **Wajib Terisi (Mandatory):** Data Kategori dan Warna tidak boleh dikosongkan. Sistem akan menahan tombol *Simpan* untuk merespons jika hal ini dilanggar.
* **Format Kode Warna (Hex):** Jika Anda menggunakan kotak pengetikan teks warna (alih-alih menggunakan palet otomatis), pastikan format penulisannya adalah heksadesimal 6 digit yang selalu diawali simbol Pagar (`#`). Contoh penulisan yang benar: `#FFFFFF`. Contoh yang salah dan berujung *error*: `FFF` atau `putih`.
* **Keterikatan Dokumen (*Dependency*):** Kategori yang sedang memayungi/memiliki 10 file dokumen di dalamnya disarankan **tidak dihapus**. Jika dihapus paksa, maka ke-10 file dokumen tersebut akan kehilangan payung klasifikasinya. Solusi terbaik adalah mengeditnya dan menghapus centang **Status Aktif**-nya.

---

## 5. PANDUAN TROUBLESHOOTING (Penyelesaian Masalah)

**Skenario 1:** 
**Gejala:** Sudah membuat Kategori "Formulir", namun kenapa saat saya masuk ke menu *Upload Dokumen*, pilihan Kategori "Formulir" itu tidak muncul di daftar?
**Solusi:** Anda kemungkinan besar lupa mencentang kotak **Status Aktif** (*Checkbox*) pada saat pembuatan Kategori "Formulir" tadi. Kembali ke halaman ini, klik Edit, beri centang pada kotak *Aktif*, lalu Simpan.

**Skenario 2:**
**Gejala:** Saat menyimpan editan warna kategori dari palet, tombol Simpan terkunci atau form menjadi error (*crash*).
**Solusi:** Ini biasanya terjadi jika Anda mengetik teks sembarangan di kotak teks kode Hex (Misal mengetik `merah` bukannya `#FF0000`). Hapus semua ketikan yang ada di kotak teks tersebut, dan gunakanlah fitur Klik Palet Warna (*Color Picker*) otomatis dari *browser* yang berada tepat di sebelahnya, lalu ulangi menyimpan.

**Skenario 3:**
**Gejala:** Warna label kategori "Surat Keputusan" terlalu silau (kuning terang), sehingga tulisan judulnya tidak terbaca oleh umat.
**Solusi:** Edit Kategori "Surat Keputusan" tersebut. Pada *Color Picker*, geser kursor atau penggesernya *(slider)* ke arah bayangan warna yang lebih gelap (misal: kuning gelap kecokelatan, atau ganti biru dongker). Hal ini karena warna font di sistem dirancang agar kontras dengan latar belakangnya.
