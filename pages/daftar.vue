<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-lg mx-auto px-4">

            <!-- Header -->
            <div class="text-center mb-8">
                <GerejaLogo class="mx-auto mb-4" />
                <h1 class="text-2xl font-bold text-gray-900">Daftar Akun Pemesanan</h1>
                <p class="text-gray-600 mt-2">Paroki St. Paulus, Juanda</p>
            </div>

            <!-- Success State -->
            <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow">
                <div class="text-5xl mb-4">✅</div>
                <h2 class="text-xl font-semibold text-green-800 mb-3">Pendaftaran Berhasil!</h2>
                <p class="text-green-700 mb-4">
                    Akun Anda telah didaftarkan dan sedang menunggu persetujuan dari sekretariat paroki.
                </p>
                <p class="text-green-600 text-sm mb-4">
                    Email konfirmasi telah dikirim ke alamat email Anda.
                    Anda akan mendapat email lagi setelah akun disetujui atau ditolak oleh admin.
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <nuxt-link to="/cek-status"
                        class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Cek Status Akun
                    </nuxt-link>
                    <nuxt-link to="/booking"
                        class="inline-block bg-white text-green-700 border border-green-400 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors">
                        Kembali ke Pemesanan
                    </nuxt-link>
                </div>
            </div>

            <!-- Registration Form -->
            <div v-else class="bg-white rounded-xl shadow p-6">
                <form @submit.prevent="handleRegister" class="space-y-4">

                    <!-- Nama Lengkap -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.full_name" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Nama lengkap Anda" required />
                    </div>

                    <!-- Username -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Username <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.username" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Pilih username unik" required autocomplete="username" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Email <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.email" type="email"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="email@contoh.com" required autocomplete="email" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Password <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.password" type="password"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Minimal 6 karakter" required minlength="6" autocomplete="new-password" />
                    </div>

                    <!-- Konfirmasi Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.confirmPassword" type="password"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            :class="{ 'border-red-400': form.confirmPassword && form.password !== form.confirmPassword }"
                            placeholder="Ulangi password" required autocomplete="new-password" />
                        <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
                            class="mt-1 text-xs text-red-600">
                            Password tidak cocok
                        </p>
                    </div>

                    <!-- Nomor Telepon -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nomor Telepon / HP
                        </label>
                        <input v-model="form.contact_phone" type="tel"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="08xxxxxxxxxx" autocomplete="tel" />
                    </div>

                    <!-- Kategori -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Kategori <span class="text-red-500">*</span>
                        </label>
                        <select v-model="form.user_category" @change="onCategoryChange"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                            :class="{ 'border-red-400': categoriesError }"
                            required>
                            <option value="">-- Pilih Kategori --</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                                {{ cat.display_name }}
                            </option>
                        </select>
                        <p v-if="categoriesError" class="mt-1 text-xs text-red-600">
                            ⚠️ Gagal memuat daftar kategori. Coba muat ulang halaman atau hubungi sekretariat paroki.
                        </p>
                    </div>

                    <!-- ═══ DROPDOWN: WILAYAH (satu level) ═══ -->
                    <template v-if="showWilayahDropdown">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pilih Wilayah <span class="text-red-500">*</span>
                            </label>
                            <select v-model="selectedWilayah" @change="onWilayahOnlyChange"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                required>
                                <option value="">-- Pilih Wilayah --</option>
                                <option v-for="w in wilayahList" :key="w" :value="w">{{ w }}</option>
                            </select>
                            <p v-if="form.unit_name" class="mt-1.5 text-xs text-green-700 font-medium">
                                ✅ Terpilih: <span class="font-semibold">{{ form.unit_name }}</span>
                            </p>
                        </div>
                    </template>

                    <!-- ═══ CASCADING DROPDOWN: LINGKUNGAN (dua level) ═══ -->
                    <template v-else-if="showLingkunganDropdown">
                        <!-- Level 1: Pilih Wilayah -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pilih Wilayah <span class="text-red-500">*</span>
                            </label>
                            <select v-model="selectedWilayah" @change="onWilayahChange"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                :disabled="lingkunganLoading"
                                required>
                                <option value="">
                                    {{ lingkunganLoading ? 'Memuat data...' : '-- Pilih Wilayah --' }}
                                </option>
                                <option v-for="w in wilayahList" :key="w" :value="w">{{ w }}</option>
                            </select>
                        </div>

                        <!-- Level 2: Pilih Lingkungan (muncul setelah wilayah dipilih) -->
                        <Transition name="slide-down">
                            <div v-if="selectedWilayah">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Pilih Lingkungan <span class="text-red-500">*</span>
                                </label>
                                <select v-model="selectedLingkungan" @change="onLingkunganChange"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                    required>
                                    <option value="">-- Pilih Lingkungan --</option>
                                    <option
                                        v-for="ling in lingkunganByWilayah"
                                        :key="ling.id"
                                        :value="ling.nama">
                                        {{ ling.nama }}
                                    </option>
                                </select>
                                <p v-if="form.unit_name" class="mt-1.5 text-xs text-green-700 font-medium">
                                    ✅ Terpilih: <span class="font-semibold">{{ form.unit_name }}</span>
                                </p>
                            </div>
                        </Transition>
                    </template>

                    <!-- ═══ CASCADING DROPDOWN: SEKSI ═══ -->
                    <template v-else-if="showSeksiDropdown">
                        <!-- Level 1: Pilih Bidang -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pilih Bidang <span class="text-red-500">*</span>
                            </label>
                            <select v-model="selectedBidang" @change="onBidangChange"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                :disabled="seksiLoading"
                                required>
                                <option value="">
                                    {{ seksiLoading ? 'Memuat data...' : '-- Pilih Bidang --' }}
                                </option>
                                <option v-for="b in bidangList" :key="b" :value="b">{{ b }}</option>
                            </select>
                        </div>

                        <!-- Level 2: Pilih Seksi (muncul setelah bidang dipilih) -->
                        <Transition name="slide-down">
                            <div v-if="selectedBidang">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Pilih Seksi <span class="text-red-500">*</span>
                                </label>
                                <select v-model="selectedSeksi" @change="onSeksiChange"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                    required>
                                    <option value="">-- Pilih Seksi --</option>
                                    <option
                                        v-for="s in seksiByBidang"
                                        :key="s.id"
                                        :value="s.nama">
                                        {{ s.nama }}
                                    </option>
                                </select>
                                <p v-if="form.unit_name" class="mt-1.5 text-xs text-green-700 font-medium">
                                    ✅ Terpilih: <span class="font-semibold">{{ form.unit_name }}</span>
                                </p>
                            </div>
                        </Transition>
                    </template>

                    <!-- ═══ INPUT TEKS BIASA: kategori tanpa sub-unit ═══ -->
                    <template v-else-if="form.user_category">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Unit / Kelompok
                            </label>
                            <input v-model="form.unit_name" type="text"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                :placeholder="unitNamePlaceholder" />
                            <p class="mt-1 text-xs text-gray-500">{{ unitNameHelper }}</p>
                        </div>
                    </template>

                    <!-- Error Message -->
                    <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {{ errorMsg }}
                    </div>

                    <!-- Submit Button -->
                    <button type="submit"
                        :disabled="loading || form.password !== form.confirmPassword || !isFormValid"
                        class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
                    </button>

                </form>

                <!-- Link to login -->
                <div class="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?
                    <nuxt-link to="/booking" class="text-green-600 hover:underline font-medium">
                        Login di sini
                    </nuxt-link>
                </div>
            </div>

            <!-- Back link -->
            <div class="mt-6 text-center">
                <nuxt-link to="/" class="text-sm text-gray-500 hover:text-gray-700 hover:underline">
                    ← Kembali ke Beranda
                </nuxt-link>
            </div>

        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

useHead({
    title: 'Daftar Akun - Paroki St. Paulus, Juanda',
    meta: [{ name: 'description', content: 'Daftarkan akun untuk pemesanan ruangan Paroki St. Paulus, Juanda' }]
})

// ── Pemetaan kategori → jenis dropdown ─────────────────────────────────────
// Menggunakan substring matching case-insensitive pada kolom `name`
// agar tidak bergantung pada nilai exact dari database.
// Contoh: 'lingkungan', 'umat_lingkungan', 'Lingkungan_Paroki' → semua cocok
const categoryContains = (catName, keyword) =>
    (catName || '').toLowerCase().includes(keyword.toLowerCase())

// ── 8 Wilayah Paroki St. Paulus Juanda (hardcoded karena data master) ───────
const WILAYAH_PAROKI = [
    'Bartolomeus',
    'Fransiskus Asisi',
    'Maria Regina',
    'Petrus',
    'Simon',
    'Theresia',
    'Vincentius a Paulo',
    'Yakobus',
]

// ── Form state utama ────────────────────────────────────────────────────────
const form = ref({
    full_name:       '',
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    contact_phone:   '',
    user_category:   '',
    unit_name:       ''   // ← selalu yang dikirim ke backend
})

// ── Remote data ─────────────────────────────────────────────────────────────
const categories       = ref([])
const categoriesError  = ref(false)
const allLingkungan    = ref([])
const lingkunganLoading = ref(false)
const lingkunganLoaded  = ref(false)
const allSeksi         = ref([])
const seksiLoading     = ref(false)
const seksiLoaded      = ref(false)

// ── Sub-dropdown state ──────────────────────────────────────────────────────
const selectedWilayah    = ref('')
const selectedLingkungan = ref('')
const selectedBidang     = ref('')
const selectedSeksi      = ref('')

// ── UI ───────────────────────────────────────────────────────────────────────
const loading  = ref(false)
const errorMsg = ref('')
const success  = ref(false)

// ── Computed: jenis dropdown yang aktif ─────────────────────────────────────
// Wilayah-only: kategori mengandung 'wilayah' tapi BUKAN 'lingkungan'
const showWilayahDropdown = computed(() =>
    categoryContains(form.value.user_category, 'wilayah') &&
    !categoryContains(form.value.user_category, 'lingkungan')
)
// Lingkungan dua-level: kategori mengandung 'lingkungan'
const showLingkunganDropdown = computed(() =>
    categoryContains(form.value.user_category, 'lingkungan')
)
const showSeksiDropdown = computed(() =>
    categoryContains(form.value.user_category, 'seksi')
)
// Apakah perlu load data lingkungan? (untuk wilayah-only ATAU dua-level)
const needsLingkunganData = computed(() =>
    showWilayahDropdown.value || showLingkunganDropdown.value
)

// ── Daftar Wilayah: pakai konstanta statis (lebih andal dari API) ───────────
const wilayahList = WILAYAH_PAROKI

// ── Lingkungan dalam wilayah terpilih ───────────────────────────────────────
// Strategi multi-level:
// 1. Coba cocokkan wilayah_display / wilayah_nama / wilayah_text
// 2. Fallback: nama lingkungan mengandung nama wilayah (jika relasi DB kosong)
const lingkunganByWilayah = computed(() => {
    if (!selectedWilayah.value || allLingkungan.value.length === 0) return []
    const target = selectedWilayah.value.toLowerCase()

    // Strategi 1: cocokkan field wilayah (relasi DB tersedia)
    const byRelasi = allLingkungan.value.filter(l => {
        const w = ((l.wilayah_display || l.wilayah_nama || l.wilayah_text || '')).trim().toLowerCase()
        return w === target
    })
    if (byRelasi.length > 0) {
        return byRelasi.sort((a, b) => (a.no || 0) - (b.no || 0))
    }

    // Strategi 2: fallback — nama lingkungan mengandung nama wilayah
    // Contoh: 'Bartolomeus 1', 'Bartolomeus 2' → cocok dengan wilayah 'Bartolomeus'
    const byNama = allLingkungan.value.filter(l =>
        (l.nama || '').toLowerCase().includes(target)
    )
    return byNama.sort((a, b) => (a.no || 0) - (b.no || 0))
})

// ── Computed: Daftar Bidang (distinct) ──────────────────────────────────────
const bidangList = computed(() => {
    const seen = new Set()
    return allSeksi.value
        .map(s => (s.bidang || '').trim())
        .filter(b => b && !seen.has(b) && seen.add(b))
        .sort((a, b) => a.localeCompare(b, 'id'))
})

// ── Computed: Seksi dalam bidang terpilih ───────────────────────────────────
const seksiByBidang = computed(() => {
    if (!selectedBidang.value) return []
    const seenNama = new Set()
    return allSeksi.value
        .filter(s => (s.bidang || '').trim() === selectedBidang.value)
        .filter(s => {
            const key = (s.nama || '').trim().toLowerCase()
            if (seenNama.has(key)) return false
            seenNama.add(key)
            return true
        })
        .sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'))
})

// ── Computed: helper text untuk input teks bebas ────────────────────────────
const unitNamePlaceholder = computed(() => {
    const cat = form.value.user_category
    if (cat === 'dpp')  return 'Contoh: DPP Paroki St. Paulus'
    if (cat === 'bgkp') return 'Contoh: BGKP Paroki St. Paulus'
    return 'Nama kelompok / unit Anda (opsional)'
})
const unitNameHelper = computed(() => {
    const cat = form.value.user_category
    if (cat === 'dpp')  return 'Isi nama Anda atau posisi di DPP jika diperlukan.'
    if (cat === 'bgkp') return 'Isi nama Anda atau posisi di BGKP jika diperlukan.'
    return 'Opsional. Kosongkan jika tidak ada unit spesifik.'
})

// ── Computed: validasi tambahan sebelum submit ──────────────────────────────
const isFormValid = computed(() => {
    if (!form.value.user_category) return false
    // Untuk kategori dengan dropdown: unit_name wajib terisi
    if (showWilayahDropdown.value || showLingkunganDropdown.value || showSeksiDropdown.value) {
        return !!form.value.unit_name
    }
    return true
})

// ── Handler: kategori berubah ───────────────────────────────────────────────
const onCategoryChange = async () => {
    // Reset semua pilihan sub-dropdown & unit_name
    selectedWilayah.value    = ''
    selectedLingkungan.value = ''
    selectedBidang.value     = ''
    selectedSeksi.value      = ''
    form.value.unit_name     = ''
    errorMsg.value           = ''

    // Lazy-load data lingkungan jika perlu (wilayah-only ATAU lingkungan dua-level)
    if (needsLingkunganData.value && !lingkunganLoaded.value) {
        await loadLingkungan()
    }
    if (showSeksiDropdown.value && !seksiLoaded.value) {
        await loadSeksi()
    }
}

// ── Handlers: interaksi sub-dropdown ───────────────────────────────────────
const onWilayahChange = () => {
    selectedLingkungan.value = ''
    form.value.unit_name     = ''
}
// Handler khusus untuk kategori Wilayah (satu level) — langsung simpan ke unit_name
const onWilayahOnlyChange = () => {
    form.value.unit_name = selectedWilayah.value
}
const onLingkunganChange = () => {
    // Simpan nama lingkungan ke form.unit_name → dikirim ke backend
    form.value.unit_name = selectedLingkungan.value
}
const onBidangChange = () => {
    selectedSeksi.value  = ''
    form.value.unit_name = ''
}
const onSeksiChange = () => {
    // Simpan nama seksi ke form.unit_name → dikirim ke backend
    form.value.unit_name = selectedSeksi.value
}

// ── Loaders API ─────────────────────────────────────────────────────────────
const loadLingkungan = async () => {
    lingkunganLoading.value = true
    try {
        const res = await $fetch('/api/lingkungan')
        const rawList = Array.isArray(res) ? res : (res?.data || [])
        allLingkungan.value = rawList
        lingkunganLoaded.value = true
        // Debug
        const wilayahUnik = [...new Set(rawList.map(l =>
            ((l.wilayah_display || l.wilayah_nama || l.wilayah_text || '')).trim()
        ).filter(Boolean))]
        console.log('[daftar] Lingkungan loaded:', rawList.length, 'item, wilayah:', wilayahUnik)
        if (rawList.length > 0) console.log('[daftar] Contoh item[0]:', JSON.stringify(rawList[0]))
    } catch (err) {
        console.error('[daftar] Gagal load lingkungan', err)
        errorMsg.value = 'Gagal memuat daftar lingkungan. Silakan muat ulang halaman.'
    } finally {
        lingkunganLoading.value = false
    }
}

const loadSeksi = async () => {
    seksiLoading.value = true
    try {
        const rawList = await $fetch('/api/seksi')
        allSeksi.value = Array.isArray(rawList) ? rawList : []
        seksiLoaded.value = true
        // Debug
        const bidangUnik = [...new Set(allSeksi.value.map(s => (s.bidang || '').trim()).filter(Boolean))]
        console.log('[daftar] Seksi loaded:', allSeksi.value.length, 'item, bidang:', bidangUnik)
    } catch (err) {
        console.error('[daftar] Gagal load seksi', err)
        errorMsg.value = 'Gagal memuat daftar seksi. Silakan muat ulang halaman.'
    } finally {
        seksiLoading.value = false
    }
}

// ── Mount: load kategori saja (lingkungan & seksi lazy) ────────────────────
onMounted(async () => {
    try {
        categories.value = await $fetch('/api/user-categories')
        if (!categories.value || categories.value.length === 0) {
            categoriesError.value = true
        }
        // Debug: lihat nama kategori aktual di DB
        console.log('[daftar] Kategori dari DB:', categories.value?.map(c => `${c.name} (${c.display_name})`))
    } catch (err) {
        console.error('Failed to load categories', err)
        categoriesError.value = true
    }
})

// ── Submit ───────────────────────────────────────────────────────────────────
const handleRegister = async () => {
    errorMsg.value = ''

    if (form.value.password !== form.value.confirmPassword) {
        errorMsg.value = 'Password dan konfirmasi password tidak cocok'
        return
    }

    // Guard: dropdown wajib harus sudah dipilih
    if (showLingkunganDropdown.value && !form.value.unit_name) {
        errorMsg.value = 'Silakan pilih lingkungan terlebih dahulu'
        return
    }
    if (showSeksiDropdown.value && !form.value.unit_name) {
        errorMsg.value = 'Silakan pilih seksi terlebih dahulu'
        return
    }

    loading.value = true
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: {
                username:      form.value.username,
                email:         form.value.email,
                password:      form.value.password,
                full_name:     form.value.full_name,
                contact_phone: form.value.contact_phone || undefined,
                user_category: form.value.user_category,
                unit_name:     form.value.unit_name || undefined
            }
        })
        success.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
        errorMsg.value =
            err?.data?.statusMessage ||
            err?.data?.message ||
            err?.statusMessage ||
            err?.message ||
            'Gagal mendaftar. Silakan coba lagi.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Animasi slide-down untuk dropdown Level 2 */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease;
    overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-6px);
    max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
    opacity: 1;
    transform: translateY(0);
    max-height: 300px;
}
</style>