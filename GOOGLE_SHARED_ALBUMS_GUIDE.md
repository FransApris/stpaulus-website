# Google Shared Albums - User Guide

## ✅ Implementasi Selesai!

Sistem galeri menggunakan **Google Shared Albums** telah berhasil diimplementasikan. Tidak perlu OAuth yang rumit!

---

## 🎯 Cara Kerja

1. Admin membuat album di Google Photos
2. Share album dengan link publik
3. **Upload thumbnail/screenshot album** (penting untuk preview!)
4. Copy link dan paste di admin panel website
5. Album otomatis tampil di halaman galeri publik!

> **⚠️ Catatan Penting:** Google Photos tidak mengizinkan embed iframe karena security policy. 
> Oleh karena itu, **thumbnail sangat penting** untuk memberikan preview yang menarik di gallery page.
> Tanpa thumbnail, hanya akan tampil placeholder icon.

---

## 📋 Cara Menggunakan

### Step 1: Buat Album di Google Photos

1. Buka [Google Photos](https://photos.google.com)
2. Login dengan akun gereja (pubdok.stpaulusjuanda@gmail.com)
3. Klik **"Library"** → **"Albums"** → **"Create album"**
4. Beri nama album (contoh: "Kegiatan Natal 2026")
5. Upload foto-foto ke album

### Step 2: Share Album

1. Buka album yang sudah dibuat
2. Klik tombol **"Share"** (icon 🔗)
3. Klik **"Create link"** atau **"Get link"**
4. Pastikan opsi **"Anyone with the link"** aktif
5. **Copy link tersebut** (akan berbentuk: `https://photos.app.goo.gl/xyz123...`)

### Step 3: Get Thumbnail URL

**Opsi A: Screenshot & Upload**
1. Buka album di Google Photos
2. Ambil screenshot album (Windows: Win+Shift+S)
3. Save screenshot
4. Upload ke folder `/public/uploads/` di project
5. Thumbnail URL: `/uploads/nama-file.jpg`

**Opsi B: Copy Image Address dari Google Photos**
1. Buka album di Google Photos
2. Klik foto cover yang ingin dijadikan thumbnail
3. Klik kanan foto → **"Copy image address"**
4. Paste URL tersebut (akan panjang, tapi works!)

**Opsi C: Tanpa Thumbnail**
- Bisa skip, tapi album akan tampil dengan placeholder icon saja
- Tidak recommended untuk user experience

### Step 4: Tambahkan ke Website

1. Login ke admin panel: http://localhost:3000/admin/gallery
2. Klik tombol **"➕ Tambah Album Baru"**
3. Isi form:
   - **Judul Album**: Nama album (contoh: "Natal 2025")
   - **Deskripsi**: Deskripsi singkat album
   - **Share URL**: **PASTE** link yang di-copy di Step 2
   - **Thumbnail URL**: **PASTE** URL thumbnail dari Step 3 ⭐ (highly recommended!)
   - **Urutan Tampilan**: Angka urutan (semakin kecil = semakin atas)
   - **Aktif**: Centang untuk langsung tampilkan di website
4. Klik **"Simpan"**

### Step 5: Lihat Hasilnya

1. Buka halaman galeri publik: http://localhost:3000/galeri
2. Album akan muncul dengan embed dari Google Photos
3. Pengunjung bisa lihat preview dan klik "Lihat Album Lengkap"

---

## 🎨 Fitur Admin Panel

### Kelola Album
- ✏️ **Edit**: Ubah judul, deskripsi, atau URL album
- 👁️ **Sembunyikan/Tampilkan**: Toggle visibility tanpa hapus album
- 🗑️ **Hapus**: Hapus album dari database (tidak hapus dari Google Photos)

### Preview Album
- Admin panel menampilkan preview iframe dari setiap album
- Badge "Tidak Aktif" untuk album yang disembunyikan
- Sorting otomatis berdasarkan urutan tampilan

---

## 📱 Tampilan Public Gallery

- Grid responsif (3 kolom desktop, 2 tablet, 1 mobile)
- Card dengan thumbnail atau placeholder icon
- Link "Buka Album" yang membuka album di Google Photos (new tab)
- Tanggal pembuatan album
- Hover effect yang smooth
- Badge "Google Photos" di setiap card

> **Note:** Pengunjung akan klik card untuk membuka album langsung di Google Photos.
> Ini memberikan experience yang lebih baik karena mereka bisa lihat semua foto dengan tampilan penuh Google Photos.

---

## 🔥 Keuntungan Google Shared Albums

✅ **Tidak perlu OAuth** - Tidak ada setup kompleks!  
✅ **Storage gratis** - Unlimited high-quality photos di Google  
✅ **Auto-sync** - Update foto di Google, pengunjung langsung bisa lihat di Google Photos  
✅ **Mobile-friendly** - Google Photos responsive otomatis  
✅ **Simple maintenance** - Admin tinggal manage link saja  
✅ **No bandwidth cost** - Foto di-host Google, bukan di server kita  
⚠️ **Perlu thumbnail** - Untuk preview yang menarik (Google Photos block iframe embedding)  

---

## 🛠️ Troubleshooting

### Album tidak muncul di halaman publik?
- Pastikan checkbox **"Aktif"** centang saat create/edit album
- Cek apakah link Google Photos valid (buka di browser baru)
- Refresh halaman galeri (Ctrl+F5)

### Thumbnail tidak tampil?
- Pastikan URL thumbnail benar (test buka di browser baru)
- Jika pakai `/uploads/file.jpg`, pastikan file ada di folder `public/uploads/`
- Jika pakai URL external, pastikan tidak ada CORS issue
- Coba upload ulang thumbnail dengan format JPG atau PNG

### "Refused to display in a frame" error di console?
- Ini **normal** dan **expected**! Google Photos memang block iframe embedding
- Solusi kami: Pakai thumbnail + direct link (current implementation)
- User click card → Buka album di Google Photos directly

### Error saat save album?
- Pastikan format URL benar: `https://photos.app.goo.gl/...` atau `https://photos.google.com/share/...`
- Jangan gunakan link yang sama untuk 2 album berbeda

---

## 📊 Database Structure

```sql
CREATE TABLE google_shared_albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  share_url VARCHAR(500) NOT NULL UNIQUE,
  thumbnail_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 API Endpoints

**Public Endpoints (No Authentication):**
- `GET /api/shared-albums` - List all albums (use `?active=true` for active only)
  - Used by: Public gallery page at `/galeri`

**Admin Endpoints (Authentication Required):**
- `GET /api/admin/shared-albums` - List all albums (admin view)
- `POST /api/admin/shared-albums` - Create new album (admin only)
- `PUT /api/admin/shared-albums/:id` - Update album (admin only)
- `DELETE /api/admin/shared-albums/:id` - Delete album (admin only)
  - Used by: Admin panel at `/admin/gallery`

---

## 📝 Tips & Best Practices

1. **Naming convention**: Gunakan nama album yang deskriptif
   - ✅ "Misa Natal 2025"
   - ✅ "Retret Pemuda Februari 2026"
   - ❌ "Album 1", "Test"

2. **Display order**: Gunakan kelipatan 10 untuk mudah insert di tengah
   - Event terbaru: 10
   - Event kemarin: 20
   - Event bulan lalu: 30
   - (Kalau mau insert di tengah, bisa pakai 15, 25, dst)

3. **Deskripsi**: Tulis deskripsi singkat tapi jelas
   - ✅ "Perayaan misa Natal dengan umat paroki"
   - ❌ "Ini album natal" (too short)

4. **Testing**: Selalu buka link di incognito/private browser untuk pastikan public accessible

---

## 🎉 Sample Data

Database sudah berisi 2 sample albums untuk testing:
1. "Album Kegiatan Gereja 2026"
2. "Natal 2025"

Anda bisa edit atau hapus sample albums ini setelah menambahkan album asli.

---

## 📞 Support

Jika ada kendala:
1. Check console browser (F12) untuk error messages
2. Check server terminal untuk error logs
3. Pastikan MySQL database running
4. Pastikan Nuxt dev server running (`npm run dev`)

---

**Selamat menggunakan! 🎊**

Sistem ini jauh lebih simpel dibanding OAuth setup yang error terus. Enjoy! 😊
