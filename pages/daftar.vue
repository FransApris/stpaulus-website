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

                    <!-- ═══ CASCADING DROPDOWN: LINGKUNGAN ═══ -->
                    <template v-if="showLingkunganDropdown">
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
// Nilai ini harus cocok dengan kolom `name` di tabel user_categories.
// Sesuaikan jika nama kategori di DB Anda berbeda.
const KATEGORI_LINGKUNGAN = ['lingkungan']
const KATEGORI_SEKSI      = ['seksi', 'omk', 'wkri', 'legio_maria', 'kelompok_kategorial']

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
const showLingkunganDropdown = computed(() =>
    KATEGORI_LINGKUNGAN.includes(form.value.user_category)
)
const showSeksiDropdown = computed(() =>
    KATEGORI_SEKSI.includes(form.value.user_category)
)

// ── Computed: Daftar Wilayah (distinct) ─────────────────────────────────────
const wilayahList = computed(() => {
    const seen = new Set()
    return allLingkungan.value
        .map(l => l.wilayah_display || l.wilayah_nama || l.wilayah_text || '')
        .filter(w => w && !seen.has(w) && seen.add(w))
        .sort()
})

// ── Computed: Lingkungan dalam wilayah terpilih ─────────────────────────────
const lingkunganByWilayah = computed(() => {
    if (!selectedWilayah.value) return []
    return allLingkungan.value
        .filter(l =>
            (l.wilayah_display || l.wilayah_nama || l.wilayah_text) === selectedWilayah.value
        )
        .sort((a, b) => (a.no || 0) - (b.no || 0))
})

// ── Computed: Daftar Bidang (distinct) ──────────────────────────────────────
const bidangList = computed(() => {
    const seen = new Set()
    return allSeksi.value
        .map(s => s.bidang || '')
        .filter(b => b && !seen.has(b) && seen.add(b))
        .sort()
})

// ── Computed: Seksi dalam bidang terpilih ───────────────────────────────────
const seksiByBidang = computed(() => {
    if (!selectedBidang.value) return []
    return allSeksi.value
        .filter(s => s.bidang === selectedBidang.value)
        .sort((a, b) => a.nama.localeCompare(b.nama))
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
    // Untuk kategori dengan dropdown: unit_name wajib terisi (berarti user sudah memilih)
    if (showLingkunganDropdown.value || showSeksiDropdown.value) {
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

    // Lazy-load data hanya saat dibutuhkan
    if (showLingkunganDropdown.value && !lingkunganLoaded.value) {
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
        // /api/lingkungan mengembalikan { data: [...], stats: {...} }
        allLingkungan.value  = Array.isArray(res) ? res : (res?.data || [])
        lingkunganLoaded.value = true
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
        // /api/seksi mengembalikan array langsung
        allSeksi.value  = await $fetch('/api/seksi') || []
        seksiLoaded.value = true
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