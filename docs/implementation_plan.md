# Implementasi: Emergency Lockdown Script (Panic Button)

Untuk mewujudkan dokumen *Incident Response Plan* menjadi sebuah alat yang nyata dan bisa langsung digunakan, saya merancang sebuah skrip **Panic Button**.

Dalam kondisi darurat (misalnya Anda mendeteksi adanya aktivitas peretasan aktif), admin tidak perlu lagi membuka panel web, karena panel web mungkin sudah dikompromi. Anda cukup menjalankan satu perintah di server:
`node scripts/emergency-lockdown.mjs`

### Apa yang akan dilakukan skrip ini secara berurutan?
1. **Lockdown Maintenance (Containment):** Skrip akan langsung menyuntikkan perintah ke tabel database `app_settings` untuk menyalakan mode *Maintenance* pada **seluruh 23 halaman utama** secara instan.
2. **Instant Snapshot (Preservation):** Skrip akan otomatis memanggil utilitas `backup-database.mjs` Anda dan membuat file *cold backup* SQL dengan awalan `emergency-backup-...` sebagai bukti forensik.
3. **Session Revocation (Key Rotation):** Skrip akan mencari parameter `JWT_SECRET` di dalam file `.env` dan **meresetnya** dengan kombinasi acak (Cryptographically Secure Random String). Ini akan membatalkan semua sesi login (termasuk milik peretas) seketika (membutuhkan *restart* server setelahnya).

### Proposed Changes

#### [NEW] `scripts/emergency-lockdown.mjs`
Membuat *script* Node.js mandiri yang menggunakan pustaka lokal (`fs`, `crypto`, `child_process`) untuk mengeksekusi tiga langkah darurat di atas.

#### [MODIFY] `package.json`
Menambahkan alias *command* di NPM:
`"lockdown": "node scripts/emergency-lockdown.mjs"`
Sehingga Anda cukup menjalankan `npm run lockdown` saat darurat.

> [!CAUTION]
> **User Review Required:**
> Skrip ini sangat *powerful* karena akan benar-benar memutuskan semua koneksi user dan mengubah file `.env` Anda jika dijalankan. Apakah Anda setuju saya membuatkan utilitas tanggap darurat ini sekarang? Tekan **Proceed** untuk melanjutkan eksekusi.
