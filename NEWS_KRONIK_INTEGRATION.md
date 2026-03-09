# 🔄 Integrasi Otomatis News-Kronik

## 📋 Deskripsi
Sistem integrasi otomatis antara **Berita (News)** dan **Kronik Gereja** yang memungkinkan berita dengan kategori tertentu (misalnya "Peristiwa Paroki") secara otomatis membuat entry di Kronik ketika di-publish.

## 🎯 Fitur
- ✅ Auto-create kronik entry saat news dengan kategori tertentu di-publish
- ✅ Auto-update kronik entry saat news di-edit
- ✅ Auto-delete kronik entry saat news dihapus atau unpublish
- ✅ Tracking relasi news-kronik untuk sinkronisasi dua arah
- ✅ Konfigurasi kategori mana yang di-sync via database

## 📁 Files yang Dibuat/Dimodifikasi

### 1. Migration
**File:** `migrations/021_add_news_kronik_sync.sql`
- Menambah kolom `source_news_id`, `is_auto_synced`, `sync_updated_at` di `kronik_entries`
- Menambah kolom `sync_to_kronik`, `kronik_category_id` di `article_categories`

### 2. Utility Function
**File:** `server/utils/news-kronik-sync.ts`
- `shouldSyncToKronik()` - Cek apakah kategori harus di-sync
- `syncNewsToKronik()` - Sync news ke kronik (create/update)
- `unsyncNewsFromKronik()` - Hapus kronik entry
- `handleNewsKronikSync()` - Handler utama untuk auto-sync

### 3. API Updates
- `server/api/admin/news/index.post.ts` - Tambah auto-sync saat create
- `server/api/admin/news/[id].put.ts` - Tambah auto-sync saat update
- `server/api/admin/news/[id].delete.ts` - Tambah unsync saat delete

## 🚀 Cara Setup

### Step 1: Jalankan Migration
```bash
# Via MySQL client atau phpMyAdmin
mysql -u root -p stpaulus_cms_db < migrations/021_add_news_kronik_sync.sql

# Atau via script
npm run db:migrate
```

### Step 2: Konfigurasi Kategori untuk Sync
Jalankan query berikut untuk mengaktifkan sync pada kategori tertentu:

```sql
-- Contoh: Aktifkan sync untuk kategori "Peristiwa Paroki"
-- Mapping ke kronik_category_id = 1 (Umum Paroki)

UPDATE article_categories 
SET sync_to_kronik = TRUE, kronik_category_id = 1
WHERE name = 'Peristiwa Paroki' OR slug = 'peristiwa-paroki';

-- Atau gunakan ID kategori
UPDATE article_categories 
SET sync_to_kronik = TRUE, kronik_category_id = 1
WHERE id = 5;
```

#### Mapping Kronik Categories:
Query untuk melihat ID kategori kronik:
```sql
SELECT id, name, slug FROM kronik_categories;
```

Hasil contoh:
- 1 = Umum Paroki
- 2 = DPP (Dewan Paroki)
- 3 = BGKP (Bidang Kategorial)
- 4 = Wilayah
- 5 = Lingkungan

#### Mapping Article Categories:
```sql
SELECT id, name, slug FROM article_categories;
```

**Contoh mapping yang disarankan:**
```sql
-- Peristiwa Paroki → Umum Paroki
UPDATE article_categories SET sync_to_kronik = TRUE, kronik_category_id = 1 
WHERE name LIKE '%Peristiwa%Paroki%';

-- Kegiatan Lingkungan → Lingkungan
UPDATE article_categories SET sync_to_kronik = TRUE, kronik_category_id = 5 
WHERE name LIKE '%Lingkungan%';

-- Kegiatan DPP → DPP
UPDATE article_categories SET sync_to_kronik = TRUE, kronik_category_id = 2 
WHERE name LIKE '%DPP%' OR name LIKE '%Dewan%Paroki%';
```

### Step 3: Restart Dev Server
```bash
# Ctrl+C di terminal, lalu
npm run dev
```

## 📖 Cara Kerja

### Scenario 1: Create News
1. Admin buat berita baru via `/admin/news`
2. Pilih kategori "Peristiwa Paroki"
3. Set status "Published"
4. Klik "Publish"
5. **OTOMATIS**: Entry kronik terbuat di kategori "Umum Paroki"

### Scenario 2: Update News
1. Admin edit berita existing
2. Ubah judul/konten/foto
3. Klik "Update"
4. **OTOMATIS**: Kronik entry juga ter-update

### Scenario 3: Unpublish News
1. Admin ubah status dari "Published" → "Draft"
2. **OTOMATIS**: Kronik entry terhapus

### Scenario 4: Delete News
1. Admin hapus berita
2. **OTOMATIS**: Kronik entry juga terhapus

## 🔍 Tracking & Debugging

### Cek News yang Sudah Di-Sync
```sql
SELECT 
  ke.id as kronik_id,
  ke.what_title,
  ke.source_news_id,
  n.title as news_title,
  n.status as news_status
FROM kronik_entries ke
INNER JOIN news n ON ke.source_news_id = n.id
WHERE ke.is_auto_synced = TRUE;
```

### Cek Kategori yang Aktif Sync
```sql
SELECT 
  ac.id,
  ac.name as article_category,
  kc.name as kronik_category,
  ac.sync_to_kronik
FROM article_categories ac
LEFT JOIN kronik_categories kc ON ac.kronik_category_id = kc.id
WHERE ac.sync_to_kronik = TRUE;
```

### Cek Log Console
Buka browser console atau server terminal untuk melihat log:
```
[News-Kronik Sync] Created kronik entry 123 from news 456
[News-Kronik Sync] Updated existing kronik entry 123 from news 456
[News-Kronik Sync] Deleted kronik entry 123 for news 456
```

## ⚙️ Konfigurasi Lanjutan

### Disable Sync untuk Kategori Tertentu
```sql
UPDATE article_categories 
SET sync_to_kronik = FALSE 
WHERE id = 5;
```

### Ubah Mapping Kategori
```sql
-- Ubah dari kronik_category_id = 1 ke 2
UPDATE article_categories 
SET kronik_category_id = 2 
WHERE id = 5;
```

### Sync Manual untuk News Existing
Jika ada berita lama yang ingin di-sync:
```sql
-- 1. Set kategori news menjadi sync-enabled
UPDATE article_categories SET sync_to_kronik = TRUE, kronik_category_id = 1 
WHERE id = [ID_KATEGORI];

-- 2. Trigger sync dengan re-save news via admin panel
-- Atau jalankan script manual:
-- (Perlu dibuat script terpisah untuk bulk sync)
```

## 🛡️ Keamanan & Validasi

### Proteksi Data
- Kronik auto-synced ditandai dengan `is_auto_synced = TRUE`
- Tidak bisa di-edit manual via `/kronik/manage` (hanya via news panel)
- Delete news otomatis cascade delete kronik entry

### Field Mapping
| News Field | Kronik Field |
|------------|--------------|
| title | what_title |
| content | what_description |
| image | featured_image |
| published_at | when_date & published_at |
| author | author_id (lookup by name) |
| status | status (always 'published') |

## 🐛 Troubleshooting

### News tidak ter-sync ke kronik
**Penyebab:**
- Kategori belum di-set `sync_to_kronik = TRUE`
- Status news bukan "published"
- `kronik_category_id` null atau invalid

**Solusi:**
```sql
-- Cek konfigurasi kategori
SELECT * FROM article_categories WHERE id = [ID_KATEGORI];

-- Pastikan kronik_category_id valid
SELECT * FROM kronik_categories WHERE id = [KRONIK_CAT_ID];
```

### Kronik entry duplikat
**Penyebab:** News di-save berkali-kali dengan bug

**Solusi:**
```sql
-- Hapus duplikat (keep oldest)
DELETE ke1 FROM kronik_entries ke1
INNER JOIN kronik_entries ke2 
WHERE ke1.source_news_id = ke2.source_news_id 
  AND ke1.id > ke2.id
  AND ke1.is_auto_synced = TRUE;
```

### Error saat delete news
**Penyebab:** Foreign key constraint atau kronik sudah ada komentar/views

**Solusi:** Sudah handle cascade delete di `unsyncNewsFromKronik()`

## 📊 Statistik & Monitoring

### Query untuk Dashboard Admin
```sql
-- Total news yang di-sync
SELECT COUNT(*) as total_synced 
FROM kronik_entries 
WHERE is_auto_synced = TRUE;

-- News per kategori
SELECT 
  ac.name as kategori,
  COUNT(ke.id) as total_kronik
FROM article_categories ac
LEFT JOIN news_category_relations ncr ON ac.id = ncr.category_id
LEFT JOIN news n ON ncr.news_id = n.id
LEFT JOIN kronik_entries ke ON n.id = ke.source_news_id AND ke.is_auto_synced = TRUE
WHERE ac.sync_to_kronik = TRUE
GROUP BY ac.id;
```

## 🔮 Future Improvements
- [ ] UI admin untuk enable/disable sync per kategori
- [ ] Bulk sync untuk news existing
- [ ] Two-way sync (edit kronik → update news)
- [ ] Webhook notification saat sync
- [ ] Sync log table untuk audit trail

## 📞 Support
Jika ada masalah, cek:
1. Console log server (terminal yang running `npm run dev`)
2. Browser console (F12 → Console tab)
3. Database log kronik entries dengan `is_auto_synced = TRUE`

---

**Created:** 2026-02-14  
**Version:** 1.0.0  
**Author:** System Integration Team
