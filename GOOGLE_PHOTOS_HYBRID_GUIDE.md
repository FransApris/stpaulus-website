# 📸 Google Photos Hybrid Integration

## Website St. Paulus Juanda

> **Hybrid Storage Solution**: Local Thumbnails + Google Photos Full Images  
> **Account**: pubdok.stpaulusjuanda@gmail.com  
> **Status**: ✅ Ready for Implementation

---

## 🎯 Arsitektur Hybrid

### **Alur Data**

```
Google Photos (Cloud)
    ↓
[OAuth Authentication]
    ↓
[Sync API] → Download Metadata
    ↓
MySQL Database (path + metadata)
    ↓
Server Local (thumbnails) → Fast Loading
    ↓
Website Gallery → Show Thumbnail
    ↓ (on click)
Google Photos CDN → Full Resolution
```

### **Keuntungan**

- ✅ **Unlimited storage** via Google Photos
- ✅ **Fast loading** dengan thumbnail lokal
- ✅ **SEO friendly** dengan metadata di database
- ✅ **Cost effective** - gratis unlimited photo storage
- ✅ **Auto backup** - Google Photos sebagai backup utama

---

## 🚀 Setup Langkah demi Langkah

### **Step 1: Setup Google Cloud Console**

1. **Buka Google Cloud Console**

   ```
   https://console.cloud.google.com/
   ```

2. **Buat Project Baru**
   - Project Name: `StPaulus Website`
   - Project ID: `stpaulus-website` (atau auto-generated)

3. **Enable Photos Library API**
   - Ke Menu → APIs & Services → Library
   - Search: "Photos Library API"
   - Klik **Enable**

4. **Buat OAuth 2.0 Credentials**
   - Ke Menu → APIs & Services → Credentials
   - Klik **+ CREATE CREDENTIALS** → OAuth client ID
   - Application type: **Web application**
   - Name: `StPaulus Website OAuth`

   **Authorized redirect URIs:**

   ```
   Development:
   http://localhost:3000/api/google-photos/callback

   Production:
   https://stpaulus-juanda.org/api/google-photos/callback
   ```

5. **Copy Credentials**
   - Copy **Client ID** → simpan
   - Copy **Client Secret** → simpan

---

### **Step 2: Konfigurasi Environment Variables**

1. **Copy file konfigurasi**

   ```powershell
   Copy-Item .env.google-photos.example .env.local
   ```

2. **Edit `.env.local`** dan isi:
   ```env
   GOOGLE_PHOTOS_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_PHOTOS_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   GOOGLE_PHOTOS_REDIRECT_URI=http://localhost:3000/api/google-photos/callback
   GOOGLE_PHOTOS_USER_EMAIL=pubdok.stpaulusjuanda@gmail.com
   ```

---

### **Step 3: Update Database Schema**

```powershell
# Jalankan migration
mysql -u root -p stpaulus_cms_db < server/database/migrations/add-google-photos-integration.sql
```

**Atau manual via phpMyAdmin:**

- Import file: `server/database/migrations/add-google-photos-integration.sql`

---

### **Step 4: Update nuxt.config.ts**

Tambahkan runtime config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    googlePhotos: {
      clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID,
      clientSecret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_PHOTOS_REDIRECT_URI,
    },
  },
});
```

---

### **Step 5: Test Connection**

1. **Start Development Server**

   ```powershell
   npm run dev
   ```

2. **Akses Admin Panel**

   ```
   http://localhost:3000/admin/google-photos
   ```

3. **Klik "Connect Google Photos"**
   - Login dengan akun: `pubdok.stpaulusjuanda@gmail.com`
   - Authorize aplikasi
   - Redirect kembali ke website

4. **Verifikasi Connection**
   - Status harus menunjukkan: ✅ Connected

---

## 📋 Cara Menggunakan

### **A. Sync Album dari Google Photos**

1. **Masuk ke Admin Panel**

   ```
   /admin/google-photos
   ```

2. **Klik "Refresh Albums"**
   - Akan menampilkan semua album dari Google Photos

3. **Pilih Album → Klik "Sync to Website"**
   - Pilih gallery album lokal (atau buat baru)
   - Centang "Download thumbnails" (recommended)
   - Klik "Start Sync"

4. **Proses Sync**
   - Download metadata dari Google Photos
   - Download thumbnails ke server lokal
   - Simpan data ke database
   - Status: ✅ Synced

### **B. Tampilkan Gallery di Frontend**

```vue
<template>
  <div>
    <h1>Gallery Gereja</h1>

    <!-- Hybrid Gallery Component -->
    <HybridGallery :album-id="1" />
  </div>
</template>

<script setup>
// Album akan auto-load dari database
// Thumbnail dari server lokal (fast)
// Full image dari Google Photos (on click)
</script>
```

---

## 🔧 API Endpoints

### **1. Get OAuth URL**

```typescript
GET /api/google-photos/auth-url

Response:
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### **2. OAuth Callback** (Auto-handled)

```typescript
GET /api/google-photos/callback?code=xxx

Response:
{
  "success": true,
  "message": "Google Photos connected successfully"
}
```

### **3. List Albums**

```typescript
GET /api/google-photos/albums

Response:
{
  "success": true,
  "count": 15,
  "albums": [
    {
      "id": "xxx",
      "title": "Paskah 2025",
      "mediaItemsCount": 45,
      "coverPhotoUrl": "https://...",
      "productUrl": "https://photos.google.com/..."
    }
  ]
}
```

### **4. Sync Album**

```typescript
POST /api/google-photos/sync
Body:
{
  "googleAlbumId": "xxx",
  "albumId": 1,  // Local gallery album ID (optional)
  "downloadThumbnails": true
}

Response:
{
  "success": true,
  "message": "Photos synced successfully",
  "photosAdded": 45,
  "photosUpdated": 0,
  "totalPhotos": 45
}
```

---

## 🎨 Components

### **1. GooglePhotosManager.vue**

**Lokasi**: `components/GooglePhotosManager.vue`  
**Fungsi**: Admin interface untuk koneksi dan sync

**Usage:**

```vue
<GooglePhotosManager />
```

### **2. HybridGallery.vue**

**Lokasi**: `components/HybridGallery.vue`  
**Fungsi**: Display gallery dengan hybrid loading

**Usage:**

```vue
<!-- Load dari database -->
<HybridGallery :album-id="1" />

<!-- Or dengan data langsung -->
<HybridGallery :photos="photoArray" />
```

---

## 📊 Database Schema

### **Tables Updated:**

**1. `gallery_photos`** - Tambahan kolom:

```sql
- google_photo_id (UNIQUE)
- google_album_id
- source_type (local/google/hybrid)
- google_url (full resolution)
- thumbnail_url (optimized)
- last_synced_at
```

**2. `gallery_albums`** - Tambahan kolom:

```sql
- google_album_id (UNIQUE)
- google_album_url
- auto_sync (BOOLEAN)
- last_synced_at
```

**3. `google_photos_tokens`** - New table:

```sql
- user_email (UNIQUE)
- access_token (encrypted)
- refresh_token
- expires_at
```

**4. `google_photos_sync_logs`** - New table:

```sql
- album_id
- sync_type (manual/auto)
- photos_added
- photos_updated
- status
- error_message
- synced_at
```

---

## ⚙️ Configuration Options

### **Environment Variables:**

```env
# Required
GOOGLE_PHOTOS_CLIENT_ID=xxx
GOOGLE_PHOTOS_CLIENT_SECRET=xxx
GOOGLE_PHOTOS_REDIRECT_URI=xxx
GOOGLE_PHOTOS_USER_EMAIL=xxx

# Optional
GOOGLE_PHOTOS_AUTO_SYNC=false
GOOGLE_PHOTOS_DOWNLOAD_THUMBNAILS=true
GOOGLE_PHOTOS_THUMBNAIL_SIZE=400
```

---

## 🔐 Security Best Practices

1. **Tokens Encryption**
   - Access tokens disimpan di database
   - ⚠️ **TODO**: Encrypt tokens sebelum simpan
   - Gunakan library seperti `crypto`

2. **HTTPS Only (Production)**
   - OAuth callback harus HTTPS
   - Set redirect URI production dengan HTTPS

3. **Rate Limiting**
   - Implementasi rate limit untuk sync API
   - Prevent abuse

4. **Access Control**
   - Hanya admin yang bisa akses Google Photos manager
   - Implement RBAC

---

## 🐛 Troubleshooting

### **Error: "Not Found. The requested location could not be found"**

**Solusi**:

- Check koneksi internet
- Verify API enabled di Google Cloud Console
- Check redirect URI match exactly

### **Error: "Invalid grant"**

**Solusi**:

- Refresh token expired
- Re-authenticate via OAuth flow

### **Photos tidak muncul setelah sync**

**Solusi**:

- Check database: `SELECT * FROM gallery_photos WHERE google_photo_id IS NOT NULL`
- Check file thumbnails: `public/uploads/gallery/thumbnails/`
- Check browser console untuk error

### **Thumbnail tidak ter-download**

**Solusi**:

- Check folder permissions: `public/uploads/gallery/thumbnails/`
- Pastikan `downloadThumbnails: true` saat sync
- Check network connectivity

---

## 📈 Performance Optimization

### **1. Lazy Loading**

```vue
<img loading="lazy" :src="thumbnailUrl" />
```

### **2. Image Size Variants**

```typescript
// Thumbnail: 400x400 (fast loading)
getThumbnailUrl(baseUrl, 400);

// Medium: 800x800 (preview)
getThumbnailUrl(baseUrl, 800);

// Full: 1920x1080 (lightbox)
getFullUrl(baseUrl);
```

### **3. CDN Caching**

- Google Photos CDN sudah optimized
- Local thumbnails served via Nuxt static

### **4. Pagination**

```typescript
// Load photos per page
const pageSize = 20;
const { data } = await useFetch(
  `/api/gallery/albums/${albumId}/photos?page=1&limit=${pageSize}`,
);
```

---

## 🚢 Deployment ke Production

### **1. Update Environment Variables**

```env
GOOGLE_PHOTOS_REDIRECT_URI=https://stpaulus-juanda.org/api/google-photos/callback
```

### **2. Update Google Cloud Console**

- Tambahkan production redirect URI
- Verify domain ownership

### **3. Setup HTTPS**

- Required untuk OAuth
- Gunakan Let's Encrypt (gratis)

### **4. Folder Permissions**

```bash
chmod 755 public/uploads/gallery/thumbnails
chown www-data:www-data public/uploads/gallery/thumbnails
```

---

## 💡 Tips & Best Practices

1. **Regular Sync**
   - Setup cron job untuk auto-sync weekly

   ```bash
   # Crontab
   0 2 * * 0 curl -X POST https://stpaulus-juanda.org/api/google-photos/sync-all
   ```

2. **Backup Strategy**
   - Google Photos = Primary storage
   - Server local = Cache + thumbnails
   - Database backup = Metadata

3. **Image Organization**
   - Gunakan album names yang deskriptif
   - Contoh: "Paskah-2025", "Natal-2024"
   - Sync per event/kegiatan

4. **Bandwidth Optimization**
   - Thumbnail lokal → hemat bandwidth
   - Full image on-demand → user experience tetap bagus

---

## 📞 Support

**Developer**: GitHub Copilot  
**Date**: February 25, 2026  
**Version**: 1.0.0

**Contact**:

- Email: pubdok.stpaulusjuanda@gmail.com
- Website: https://stpaulus-juanda.org

---

## 🎉 Selamat!

Hybrid Google Photos integration sudah siap digunakan!

**Next Steps:**

1. Setup Google Cloud Console credentials
2. Update `.env.local` dengan credentials
3. Run database migration
4. Test connection di admin panel
5. Sync first album
6. Display di frontend

**Enjoy unlimited photo storage! 🚀**
