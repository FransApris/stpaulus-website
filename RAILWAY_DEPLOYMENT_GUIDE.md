# 🚀 Deploy StPaulus Website ke Railway.com

Panduan lengkap untuk deploy aplikasi StPaulus Website ke Railway.com.

---

## 📋 Prasyarat

1. ✅ Akun GitHub (sudah ada: FransApris/stpaulus-website)
2. ✅ Akun Railway.com (daftar di https://railway.app/)
3. ✅ Database MySQL (bisa pakai Railway MySQL atau external)
4. ✅ Project sudah di-push ke GitHub

---

## 🎯 Langkah Deploy

### 1️⃣ Buat Project di Railway

1. Login ke https://railway.app/
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository: **FransApris/stpaulus-website**
5. Railway akan otomatis detect Nuxt.js

### 2️⃣ Tambahkan MySQL Database

**Opsi A: Pakai Railway MySQL (Recommended)**

1. Di project Railway, klik **"+ New"** → **"Database"** → **"Add MySQL"**
2. Railway akan auto-create database dan generate credentials
3. Copy connection details untuk step berikutnya

**Opsi B: Pakai Database External**

Jika sudah punya MySQL hosting external (seperti PlanetScale, DigitalOcean, dll):
- Siapkan connection details (host, port, user, password, database name)

### 3️⃣ Setup Environment Variables

Di Railway dashboard, masuk ke tab **"Variables"** dan tambahkan:

#### Database Configuration
```bash
DATABASE_CLIENT=mysql
MYSQL_HOST=<dari Railway MySQL atau external>
MYSQL_PORT=3306
MYSQL_USER=<dari Railway MySQL atau external>
MYSQL_PASSWORD=<dari Railway MySQL atau external>
MYSQL_DATABASE=<dari Railway MySQL atau external>
```

#### JWT Secret (Generate dulu!)
```bash
# Generate dengan command: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<your_generated_64_char_hex_string>
```

#### CORS Configuration
```bash
# Ganti dengan domain Railway Anda setelah deploy
ALLOWED_ORIGINS=https://your-app.up.railway.app,https://www.stpaulus-juanda.org
```

#### API Keys (Optional tapi Recommended)

**GROQ API** (untuk Chatbot):
```bash
GROQ_API_KEY=<your_groq_api_key>
```
Daftar gratis di: https://console.groq.com/

**Google Gemini AI** (untuk Kronik AI Narration):
```bash
GEMINI_API_KEY=<your_gemini_api_key>
```
Daftar gratis di: https://makersuite.google.com/app/apikey

**Google Photos API** (untuk Gallery):
```bash
GOOGLE_PHOTOS_CLIENT_ID=<your_client_id>
GOOGLE_PHOTOS_CLIENT_SECRET=<your_client_secret>
GOOGLE_PHOTOS_REDIRECT_URI=https://your-app.up.railway.app/api/google-photos/callback
GOOGLE_PHOTOS_USER_EMAIL=pubdok.stpaulusjuanda@gmail.com
GOOGLE_PHOTOS_DOWNLOAD_THUMBNAILS=true
GOOGLE_PHOTOS_THUMBNAIL_SIZE=400
```

### 4️⃣ Configure Build & Start Settings

Railway biasanya auto-detect, tapi untuk memastikan:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
node .output/server/index.mjs
```

**Port:** Railway akan auto-assign (default: $PORT environment variable)

### 5️⃣ Deploy!

1. Setelah semua environment variables di-set, klik **"Deploy"**
2. Railway akan:
   - Clone repo dari GitHub
   - Install dependencies
   - Build aplikasi
   - Start server
3. Tunggu 2-5 menit untuk build pertama
4. Railway akan generate URL: `https://your-app.up.railway.app`

---

## 🗄️ Setup Database Tables

Setelah deploy berhasil, Anda perlu import database schema:

### Import SQL Files ke Railway MySQL

**Opsi 1: Pakai Railway MySQL Client**
1. Di Railway dashboard, klik MySQL service
2. Klik tab **"Data"** → **"Connect"**
3. Gunakan MySQL client untuk import:
   ```bash
   mysql -h <MYSQL_HOST> -u <MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE> < migrations/create_tables.sql
   ```

**Opsi 2: Pakai phpMyAdmin atau TablePlus**
1. Gunakan connection details dari Railway
2. Import file SQL dari folder `migrations/`
3. File utama: `migrations/001_create_all_tables.sql` (atau sesuai nama yg ada)

**Opsi 3: Pakai Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ke project
railway link

# Connect ke MySQL
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < migrations/your_migration.sql
```

---

## 🔧 Troubleshooting

### ❌ Build Failed

**Problem:** Dependency error
```bash
# Solution: Pastikan package.json sudah complete
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Problem:** Out of memory
```bash
# Solution: Upgrade Railway plan atau optimize dependencies
```

### ❌ Database Connection Error

**Problem:** Can't connect to MySQL
```bash
# Check:
1. MYSQL_HOST correct? (jangan pakai localhost!)
2. MYSQL_USER dan MYSQL_PASSWORD correct?
3. Database exists?
4. Network policy allow Railway IP?
```

### ❌ 502 Bad Gateway

**Problem:** App not starting
```bash
# Check Railway logs:
1. Klik project → View Logs
2. Cari error message
3. Biasanya: missing env variables atau port binding issue
```

### ❌ Google Photos tidak berfungsi

**Problem:** Redirect URI mismatch
```bash
# Solution:
1. Update Google Cloud Console OAuth settings
2. Tambahkan Railway domain ke Authorized redirect URIs
3. Format: https://your-app.up.railway.app/api/google-photos/callback
```

---

## 🎨 Custom Domain (Optional)

### Setup Domain Sendiri

1. Di Railway dashboard, klik tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"+ Add Domain"**
4. Masukkan domain Anda (misal: `stpaulus-juanda.org`)
5. Railway akan berikan CNAME record
6. Di domain registrar (Namecheap, GoDaddy, dll):
   - Tambahkan CNAME record sesuai instruksi Railway
   - Tunggu DNS propagation (5-30 menit)

7. Update environment variables:
   ```bash
   ALLOWED_ORIGINS=https://stpaulus-juanda.org,https://www.stpaulus-juanda.org
   GOOGLE_PHOTOS_REDIRECT_URI=https://stpaulus-juanda.org/api/google-photos/callback
   ```

---

## 📊 Monitoring

### Railway Built-in Monitoring

- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History dan rollback capability

### Access Railway Dashboard:
```
https://railway.app/project/<your-project-id>
```

---

## 💰 Pricing

**Railway Pricing** (as of 2026):

- **Hobby Plan**: $5/month
  - $5 usage credit
  - Good for small projects
  
- **Developer Plan**: $20/month
  - $20 usage credit
  - Better for production

**Database Pricing:**
- Railway MySQL: Included in usage credit
- Charged based on CPU time + Memory + Storage

**Estimasi untuk StPaulus Website:**
- Aplikasi: ~$3-5/month
- Database: ~$2-3/month
- **Total: ~$5-8/month**

---

## 🔄 Auto Deploy dari GitHub

Railway sudah auto-enabled:
- Setiap `git push` ke branch `main` akan trigger auto deploy
- No action needed!

**Untuk disable auto-deploy:**
1. Railway dashboard → Settings
2. Scroll ke "GitHub"
3. Toggle off "Auto Deploy"

---

## ✅ Post-Deploy Checklist

- [ ] Website accessible di Railway URL
- [ ] Database tables sudah di-import
- [ ] Login admin berfungsi
- [ ] Upload gambar berfungsi
- [ ] Google Photos integration berfungsi (jika enabled)
- [ ] Chatbot berfungsi (jika GROQ_API_KEY set)
- [ ] Custom domain configured (jika ada)
- [ ] SSL certificate active (auto by Railway)
- [ ] Environment variables production-ready
- [ ] Database backup strategy in place

---

## 📞 Support

**Railway Documentation:**
- https://docs.railway.app/

**Railway Community:**
- Discord: https://discord.gg/railway

**StPaulus Website Issues:**
- GitHub: https://github.com/FransApris/stpaulus-website/issues

---

## 🎉 Selamat!

Website StPaulus Anda sekarang sudah live di Railway! 🚀

**Next Steps:**
1. Test semua fitur di production
2. Setup backup database secara regular
3. Monitor performance dan logs
4. Scale jika diperlukan

---

*Last updated: March 9, 2026*
