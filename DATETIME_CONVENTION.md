# DATETIME_CONVENTION.md
## Konvensi Datetime WIB (Asia/Jakarta) — Wajib Dibaca Semua Developer

---

## Prinsip Utama

| Aturan | Keterangan |
|---|---|
| **DB menyimpan UTC** | Semua field `start_time`, `end_time`, `created_at`, dll. di MySQL disimpan tanpa timezone (= UTC) |
| **Tampilan pakai WIB** | Semua waktu yang ditampilkan ke user menggunakan Asia/Jakarta (UTC+7) |
| **Single Source of Truth** | Semua konversi datetime HANYA melalui file utility yang sudah disediakan |

---

## File yang Wajib Digunakan

### Untuk Server (API files di `server/api/`)
```ts
import { dbToUtcIso, dbToWibDate, dbToWibTimeStr, todayWib, wibDayBoundariesUtc } from '~/server/utils/datetime'
```

| Fungsi | Kegunaan |
|---|---|
| `dbToUtcIso(raw)` | Konversi `"2026-08-21 01:00:00"` → `"2026-08-21T01:00:00Z"` |
| `dbToWibDate(raw)` | Ambil tanggal WIB `"2026-08-21"` dari raw DB value |
| `dbToWibTimeStr(raw)` | Format waktu `"08.00"` WIB |
| `dbToWibTimeColon(raw)` | Format waktu `"08:00"` WIB |
| `dbToWibDateLong(raw)` | Format `"Jumat, 21 Agustus 2026"` WIB |
| `dbToWibDateTime(raw)` | Format datetime pendek WIB |
| `todayWib()` | Hari ini `YYYY-MM-DD` dalam WIB |
| `wibDayBoundariesUtc(dateStr)` | Batas hari WIB dalam UTC untuk query MySQL |
| `localWibToUtcMysql(date, time)` | Konversi WIB input ke MySQL UTC string |
| `isoToMysql(isoStr)` | ISO UTC string ke MySQL string |

### Untuk Frontend (`.vue` files)
```ts
const { formatWibDate, formatWibTime, formatWibTimeRange, formatWibBookingTime, formatWibDateTime, todayWibStr, isBookingPassed } = useDatetime()
```

| Fungsi | Kegunaan |
|---|---|
| `toUtcDate(s)` | Parse string (dari DB/API) ke Date object UTC-aware |
| `formatWibDate(s)` | `"Jumat, 21 Agustus 2026"` |
| `formatWibTime(s)` | `"08:00"` WIB |
| `formatWibTimeRange(start, end)` | `"08:00 - 10:00"` WIB |
| `formatWibBookingTime(start, end)` | `"Jumat, 21 Agustus 2026 (08:00 - 10:00)"` |
| `formatWibDateTime(s)` | `"21 Agu 2026, 08:00"` WIB |
| `todayWibStr()` | Hari ini `YYYY-MM-DD` WIB |
| `isBookingPassed(endTime)` | Cek apakah booking sudah lewat |

---

## ❌ DILARANG — Jangan Lakukan Ini

```ts
// ❌ Membaca raw time dari DB string langsung
const parts = raw.split(' ')
const timePart = parts[1].slice(0, 5)  // <-- SALAH! ini UTC, bukan WIB

// ❌ Inline UTC conversion
String(s).replace(' ', 'T') + 'Z'  // <-- gunakan dbToUtcIso() dari datetime.ts

// ❌ UTC date sebagai WIB date
new Date().toISOString().split('T')[0]  // <-- gunakan todayWib() dari datetime.ts

// ❌ Inline timezone format
d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })  // <-- gunakan dbToWibTimeStr()

// ❌ Membuat Date dari string DB tanpa 'Z'
new Date("2026-08-21 01:00:00")  // browser anggap lokal! Gunakan toUtcDate() dari useDatetime
```

## ✅ Lakukan Ini

```ts
// ✅ Server: konversi raw DB ke UTC ISO
const iso = dbToUtcIso(booking.start_time)

// ✅ Server: tampilkan waktu WIB
const timeStr = dbToWibTimeStr(booking.start_time)  // "08.00"

// ✅ Server: filter query berdasarkan hari WIB
const { dayStart, dayEnd } = wibDayBoundariesUtc('2026-08-21')
// → { dayStart: "2026-08-20 17:00:00", dayEnd: "2026-08-21 16:59:59" }

// ✅ Frontend: parse dan format
const { formatWibTime, toUtcDate } = useDatetime()
formatWibTime(booking.start_time)  // "08:00"
toUtcDate(booking.start_time)      // Date object yang benar
```

---

## Mengapa Masalah Ini Terjadi?

Database MySQL dengan opsi `dateStrings: true` mengembalikan datetime sebagai string `"2026-08-21 01:00:00"` **tanpa informasi timezone**. Browser dan Node.js akan menginterpretasikan string ini sebagai **waktu lokal**, bukan UTC.

Karena semua booking disimpan dalam UTC (dari `toISOString()` yang dilakukan saat submit), jika kita membaca `01:00:00` tanpa menambahkan `Z`, browser di Indonesia (WIB) akan mengira itu pukul 01:00 WIB, padahal sebenarnya pukul **08:00 WIB** (01:00 UTC + 7 jam = 08:00 WIB).

**Solusinya**: selalu tambahkan `Z` saat parsing (via `dbToUtcIso`), dan selalu gunakan `timeZone: 'Asia/Jakarta'` saat format tampilan (via fungsi-fungsi di atas).

---

## File yang Sudah Menggunakan Konvensi Ini (per 2026-07-31)

- ✅ `server/utils/datetime.ts` — utility file (source of truth)
- ✅ `composables/useDatetime.ts` — composable file (source of truth)
- ✅ `server/api/bookings/weekly-schedule.get.ts`
- ✅ `server/api/bookings/index.get.ts`
- ✅ `server/api/bookings/public-list.get.ts`
- ✅ `server/api/bookings/check-availability.get.ts`
- ✅ `server/api/admin/bookings/index.get.ts`
- ✅ `server/api/public/signage-bookings.get.ts`
- ✅ `server/api/rooms-availability.get.ts`
- ✅ `pages/booking.vue`
- ✅ `pages/admin/bookings-new.vue`
