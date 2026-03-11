# Cloudinary + Railway Volume Setup Guide

## Overview
Website ini sekarang mendukung **dual storage strategy**:
- ✅ **Railway Volume** - Persistent local storage (1GB+)
- ✅ **Cloudinary** - Cloud storage dengan CDN, image optimization, free 25GB

## Setup Lengkap

---

### **PART 1: Railway Volume (Persistent Local Storage)**

Railway Volume menyimpan file secara permanen di server Railway.

#### Langkah Setup:

1. **Buka Railway Dashboard**
   - Login ke https://railway.app
   - Pilih project "StPaulus"
   - Klik service "web"

2. **Create Volume**
   - Klik tab **"Settings"**
   - Scroll ke bagian **"Volumes"**
   - Klik **"New Volume"**
   
3. **Configure Volume**
   ```
   Mount Path: /app/public/uploads
   Size: 1GB (atau lebih besar jika diperlukan)
   ```
   
4. **Save & Redeploy**
   - Klik **"Add"**
   - Railway akan otomatis redeploy
   - Tunggu ~2-3 menit

5. **Verify**
   - Cek deployment logs
   - Upload gambar artikel baru
   - Gambar seharusnya tetap ada setelah redeploy

**Biaya:** ~$0.25/GB/bulan

---

### **PART 2: Cloudinary (Cloud Storage + CDN)**

Cloudinary menyimpan file di cloud dengan CDN global dan image optimization.

#### Step 1: Buat Akun Cloudinary

1. Buka https://cloudinary.com/users/register_free
2. Daftar dengan email (atau Google/GitHub)
3. **Free tier**: 25GB storage + 25GB bandwidth/bulan

#### Step 2: Dapatkan API Credentials

1. Login ke Cloudinary Dashboard
2. Buka **"Dashboard"** (home page)
3. Di bagian **"Account Details"**, salin:
   - **Cloud Name** (contoh: `dxxxxx`)
   - **API Key** (contoh: `123456789012345`)
   - **API Secret** (contoh: `abcdefghijklmnopqrstuvwxyz`)

#### Step 3: Setup Environment Variables di Railway

1. Buka Railway Dashboard → Project Anda → Service "web"
2. Klik tab **"Variables"**
3. Tambahkan 3 variables baru:

```bash
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**IMPORTANT:** Ganti nilai di atas dengan credentials Anda!

4. Klik **"Add"** untuk setiap variable
5. Railway akan otomatis redeploy

#### Step 4: Verify Cloudinary

Setelah deployment selesai:

1. **Check logs:**
   ```
   [Cloudinary] ✓ Configured with cloud: dxxxxx
   ```

2. **Upload artikel baru** dengan gambar
   
3. **Check logs upload:**
   ```
   [Upload] Cloudinary enabled: true
   [Upload] Uploading to Cloudinary...
   [Cloudinary] Upload success: https://res.cloudinary.com/...
   ```

4. **Inspect gambar di browser:**
   - URL gambar seharusnya: `https://res.cloudinary.com/dxxxxx/image/upload/...`
   - Bukan: `https://your-domain.com/uploads/articles/...`

---

## Cara Kerja

### **Dual Storage Strategy:**

1. **Jika Cloudinary configured** → Upload ke Cloudinary (primary)
2. **Jika Cloudinary gagal** → Fallback ke Railway Volume
3. **Jika Cloudinary tidak configured** → Langsung ke Railway Volume

### **Prioritas:**
```
Cloudinary (cloud + CDN) → Railway Volume (persistent) → Ephemeral (temporary)
```

### **Keuntungan:**

#### Railway Volume:
- ✅ Setup mudah (no code change)
- ✅ File tersimpan permanent
- ✅ Tidak perlu third-party service

#### Cloudinary:
- ✅ 25GB gratis (100x lebih besar dari Railway Volume 1GB)
- ✅ Global CDN - loading cepat di seluruh dunia
- ✅ Auto image optimization (WebP, AVIF, quality adjustment)
- ✅ Image transformation on-the-fly (resize, crop, filters)
- ✅ Tidak pakai disk space Railway

---

## Testing

### Test Railway Volume:

1. Upload artikel dengan gambar
2. Redeploy Railway (Settings → Redeploy)
3. Buka artikel yang sama
4. **Expected:** Gambar masih muncul (tidak 404)

### Test Cloudinary:

1. Pastikan env vars sudah di-set
2. Upload artikel baru dengan gambar
3. Inspect image URL di browser
4. **Expected:** URL Cloudinary (`res.cloudinary.com/...`)

### Test Fallback:

1. Hapus Cloudinary env vars sementara
2. Upload artikel baru
3. **Expected:** Gambar tersimpan di Railway Volume
4. Restore Cloudinary env vars

---

## Monitoring

### Railway Logs:

```bash
# Volume mounted
[Railway] Volume mounted at /app/public/uploads

# Cloudinary configured
[Cloudinary] ✓ Configured with cloud: dxxxxx

# Upload success (Cloudinary)
[Upload] Cloudinary upload success: https://res.cloudinary.com/...

# Upload success (Local fallback)
[Upload] Local file saved: public/uploads/articles/article-...
```

### Cloudinary Dashboard:

- Buka https://cloudinary.com/console/media_library
- Lihat semua file yang di-upload
- Monitor usage (storage & bandwidth)

---

## Troubleshooting

### Gambar masih 404 setelah Railway Volume setup:

**Cause:** Volume mount path salah atau volume belum mounted.

**Fix:**
- Verify mount path: `/app/public/uploads` (BUKAN `/uploads`)
- Check Railway deployment logs untuk "Volume mounted"
- Redeploy jika perlu

### Cloudinary tidak digunakan (masih local storage):

**Cause:** Environment variables tidak di-set dengan benar.

**Fix:**
- Verify 3 env vars ada di Railway Variables
- Check logs untuk `[Cloudinary] ⚠ Not configured`
- Case-sensitive! Harus uppercase: `CLOUDINARY_CLOUD_NAME`

### Upload error "Cloudinary is not configured":

**Cause:** Cloudinary env vars missing atau salah.

**Fix:**
- Double-check cloud name, api key, api secret
- Restart Railway deployment setelah menambah env vars
- Check Cloudinary Dashboard bahwa credentials benar

### Upload ke Cloudinary lambat:

**Cause:** Network latency ke Cloudinary servers.

**Fix:**
- Normal untuk upload pertama kali
- Cloudinary akan optimize dan store di CDN
- Subsequent loads akan cepat via CDN

---

## Migration Strategy

Jika Anda sudah punya file di local storage dan ingin migrate ke Cloudinary:

1. **Setup Cloudinary** (ikuti langkah di atas)
2. **Re-upload** artikel images yang penting
3. **Old images** tetap akan bekerja via Railway Volume
4. **New images** otomatis ke Cloudinary

Tidak perlu migrasi semua file sekaligus - gradual migration OK!

---

## Cost Estimation

### Railway Volume:
- 1GB: ~$0.25/month
- 5GB: ~$1.25/month
- 10GB: ~$2.50/month

### Cloudinary Free Tier:
- 25GB storage: FREE
- 25GB bandwidth/month: FREE
- Image transformations: FREE
- Upgrade: $89/month (untuk 175GB storage)

### Recommendation:
Start dengan **Cloudinary free tier** untuk 95% use cases. Railway Volume sebagai backup/fallback.

---

## Summary

✅ **Railway Volume** - Setup di Railway Dashboard, mount `/app/public/uploads`, 1GB minimum

✅ **Cloudinary** - Daftar di cloudinary.com, get credentials, add 3 env vars di Railway

✅ **Automatic Fallback** - Jika Cloudinary gagal, otomatis fallback ke Railway Volume

✅ **No Breaking Changes** - Old images tetap bekerja, new images ke Cloudinary

🚀 **Ready to deploy!** - Code sudah siap, tinggal configure di Railway Dashboard.

---

## Support

Jika ada masalah:
1. Check Railway deployment logs
2. Check Cloudinary Dashboard
3. Verify environment variables di Railway
4. Test upload dengan gambar baru

For code issues: Check `server/utils/cloudinary.ts` dan `server/api/admin/uploads/image.post.ts`
