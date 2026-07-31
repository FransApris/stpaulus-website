# CATEGORY_CONVENTION.md
## Konvensi Kategori Pengguna (User Category) — Wajib Dibaca Semua Developer

---

## Prinsip Utama

| Aturan | Keterangan |
|---|---|
| **Penyimpanan di DB bervariasi** | Nilai `user_category` di database bisa disimpan dalam berbagai format dan bahasa (misal: `"DPP"`, `"BGKP"`, `"PARISH_COUNCIL"`, `"Dewan Paroki Pastoral"`, `"Dewan Pastoral Paroki"`). |
| **Normalisasi Wajib** | Karena variasi tersebut, Anda **tidak boleh** melakukan komparasi literal string `===` secara langsung dengan nilai mentah dari database. |
| **Single Source of Truth** | Semua pengecekan, normalisasi, dan format tampilan kategori HANYA melalui file utility `server/utils/category.ts`. |

---

## File yang Wajib Digunakan

### Untuk Server (API files di `server/api/`)
```ts
import { canonicalizeCategory, normalizeCategory, getCategoryDisplayName } from '~/server/utils/category'
```

| Fungsi | Kegunaan |
|---|---|
| `canonicalizeCategory(raw)` | Mengubah nama kategori mentah apapun ke nama kategori canonical internal (contoh: `"DPP"`, `"BGKP"`, `"PARISH_COUNCIL"` → `"dewan"`). Gunakan ini untuk **if/else** dan pengecekan akses (Authorization / Quota). |
| `getCategoryDisplayName(raw)` | Mengubah nama kategori mentah apapun ke label rapi untuk frontend (contoh: `"PARISH_COUNCIL"` → `"Dewan Pastoral Paroki"`). |
| `normalizeCategory(raw)` | Mengubah ke lowercase, membuang spasi berlebih, mengubah underscore jadi spasi (contoh: `" Categorical_Group "` → `"categorical group"`). |

---

## ❌ DILARANG — Jangan Lakukan Ini

```ts
// ❌ Membandingkan nilai mentah DB dengan string literal langsung
if (user.user_category === 'PARISH_COUNCIL') { ... } // SALAH! Bisa jadi di DB nilainya 'DPP' atau 'BGKP'

// ❌ Mendefinisikan map/alias kategori sendiri di dalam file API
const categoryMap = { 'PARISH_COUNCIL': 'Dewan Pastoral Paroki' } // SALAH! Duplikasi kode dan rentan bug

// ❌ Menulis logika normalization sendiri
const normalized = String(cat).toLowerCase().trim() // SALAH! Gunakan utils/category.ts
```

## ✅ Lakukan Ini

```ts
// ✅ Pengecekan Hak Akses (Authorization) / Kuota
const category = canonicalizeCategory(user.user_category)
if (category === 'dewan') { 
  // Berlaku untuk semua alias: DPP, BGKP, PARISH_COUNCIL, Dewan Pastoral Paroki
  console.log('User has unlimited quota')
}

// ✅ Menampilkan Kategori ke Frontend
const displayCategory = getCategoryDisplayName(user.user_category)
// Jika user_category = 'CATEGORICAL_GROUP', maka displayCategory = 'Kategorial'
```

---

## Mengapa Masalah Ini Terjadi Sebelumnya?

Pada rilis sebelumnya, ada pengecekan kuota pemesanan di `server/api/bookings.post.ts` yang membatasi pemesanan ruangan. Pengecekan ini menggunakan logika seperti ini:
`const isUnlimited = ['PARISH_COUNCIL', 'CATEGORICAL_GROUP'].includes(userCategoryRaw.toUpperCase())`

Ini menjadi masalah (Bug) karena data kategori user (terutama DPP dan BGKP) di database disimpan dengan berbagai format (`'DPP'`, `'BGKP'`). Karena nilai ini secara literal berbeda dengan `'PARISH_COUNCIL'`, mereka tidak dikenali sebagai kategori "unlimited" dan tetap dikenai batas maksimal pemesanan.

**Solusinya**: Semua logika parsing dan pencocokan alias kategori kini dipusatkan di `server/utils/category.ts` sehingga ketika kita menambahkan variasi sebutan baru untuk suatu kategori, perubahannya otomatis berlaku ke semua API.
