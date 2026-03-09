# Fix: Menu Kronik BIAK di Portal Layanan Digital

## ✅ Masalah Terselesaikan

**Tanggal**: 9 Maret 2026  
**Affected Files**: 
- `server/api/me.get.ts`
- `pages/kronik/manage/create.vue`
- `pages/kronik/manage/edit/[id].vue`

---

## 🐛 Masalah

User BIAK tidak melihat section "Seksi BIAK" saat akan menulis kronik karena:

1. **API `/api/me` tidak mengembalikan `organization_type`** dan `organization_id`
2. **Auto-select kategori salah**: User BIAK memiliki `user_category = 'CATEGORICAL_GROUP'` → sistem otomatis pilih kategori **BGKP** (category_id = 3), padahal seharusnya **DPP** (category_id = 2)
3. **Tidak ada filter sections** berdasarkan `organization_id` user

---

##🔧 Perbaikan yang Dilakukan

### 1. Update API `/api/me.get.ts`

**Menambahkan field `organization_type` dan `organization_id`:**

```typescript
// OLD
SELECT u.id, u.username, u.email, u.full_name, u.contact_phone, u.user_category, u.unit_name, u.role, u.role_id...

// NEW  
SELECT u.id, u.username, u.email, u.full_name, u.contact_phone, u.user_category, u.unit_name, u.role, u.role_id, u.organization_type, u.organization_id...
```

### 2. Update Logic Auto-Select Kategori (`create.vue` & `edit/[id].vue`)

**Sekarang mengecek `organization_type` terlebih dahulu:**

```typescript
// Check organization_type first (more specific)
if (user.value.organization_type) {
    const orgTypeMap: Record<string, number> = {
        'gereja': 1,        // Gereja
        'dpp': 2,           // DPP  ← User BIAK ada di sini
        'bgkp': 3,          // BGKP
        'wilayah': 4,       // Wilayah
        'lingkungan': 5     // Lingkungan
    }
    selectedCategoryId = orgTypeMap[user.value.organization_type.toLowerCase()] || null
}

// Fallback to user_category if no organization_type
if (!selectedCategoryId) {
    // ...existing categoryMap logic
}
```

### 3. Filter Sections Berdasarkan `organization_id`

**Non-admin users hanya melihat section mereka:**

```typescript
// Filter sections based on user's organization_id (if not admin)
if (user.value && user.value.organization_id && !['super-admin', 'admin-paroki'].includes(user.value.user_category)) {
    // Non-admin users can only see their own section
    availableSections = availableSections.filter((s: Section) => s.id === user.value?.organization_id)
    
    // Auto-select the section if only one available
    if (availableSections.length === 1) {
        form.section_id = availableSections[0].id
    }
}
```

---

## 🎯 Hasil Akhir

Sekarang ketika user BIAK login dan akses **Kelola Kronik**:

1. ✅ Kategori **DPP** otomatis terpilih (bukan BGKP)
2. ✅ Section **Seksi BIAK (Bina Iman Anak & Keluarga)** otomatis terpilih dan ter-filter
3. ✅ User non-admin hanya melihat section mereka sendiri
4. ✅ Admin tetap bisa melihat semua sections

---

## 🧪 Testing

### Test Case 1: Login sebagai Ketua BIAK
```
Username: ketua.biak
Password: admin123
Expected: 
- Kategori "DPP" otomatis terpilih
- Dropdown section hanya menampilkan "Seksi BIAK (Bina Iman Anak & Keluarga)"
- Section otomatis terpilih
```

### Test Case 2: Login sebagai Admin
```
Username: superadmin
Password: admin123
Expected:
- Bisa pilih semua kategori
- Bisa melihat semua sections dalam kategori yang dipilih
```

### Test Case 3: Login sebagai Ketua OMK
```
Username: ketua.omk
Password: admin123
Expected:
- Kategori "DPP" otomatis terpilih
- Dropdown section hanya menampilkan "Seksi OMK (Orang Muda Katolik)"
```

---

## 📝 Catatan Penting

1. **Clear Browser Cache**: Setelah deployment, user mungkin perlu clear cache atau hard refresh (Ctrl+Shift+R)
2. **Logout & Login**: User yang sudah login sebelum fix mungkin perlu logout dan login kembali
3. **Organization Mapping**:
   - `organization_type = 'dpp'` → Category: DPP
   - `organization_id = 15` → Section: Seksi BIAK

---

## 🔄 Next Steps (Optional)

Pertimbangkan enhancement berikutnya:
1. **Backend API Filter**: Tambahkan filter `organization_id` di API `/api/kronik/sections` untuk security
2. **Permission Validation**: Validasi di server-side apakah user berhak menulis ke section tertentu
3. **Section Auto-Hide**: Jika user hanya punya 1 section, hide dropdown dan auto-assign value

---

**Status**: ✅ SELESAI & READY FOR TESTING
