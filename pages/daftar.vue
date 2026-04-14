<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-lg mx-auto px-4">

            <!-- Header -->
            <div class="text-center mb-8">
                <GerejaLogo class="mx-auto mb-4" />
                <h1 class="text-2xl font-bold text-gray-900">Daftar Akun Pemesanan</h1>
                <p class="text-gray-600 mt-2">Paroki Santo Paulus Sinaboi</p>
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
                        <select v-model="form.user_category"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                            required>
                            <option value="">-- Pilih Kategori --</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                                {{ cat.display_name }}
                            </option>
                        </select>
                    </div>

                    <!-- Nama Unit / Kelompok -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nama Unit / Kelompok / Lingkungan
                        </label>
                        <input v-model="form.unit_name" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="Contoh: Lingkungan Yohanes, OMK, dll." />
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {{ errorMsg }}
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" :disabled="loading || form.password !== form.confirmPassword"
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
    title: 'Daftar Akun - Paroki Santo Paulus Sinaboi',
    meta: [{ name: 'description', content: 'Daftarkan akun untuk pemesanan ruangan Paroki Santo Paulus Sinaboi' }]
})

const form = ref({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact_phone: '',
    user_category: '',
    unit_name: ''
})

const categories = ref([])
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

// Load categories on mount
onMounted(async () => {
    try {
        categories.value = await $fetch('/api/user-categories')
    } catch (err) {
        console.error('Failed to load categories', err)
    }
})

const handleRegister = async () => {
    errorMsg.value = ''

    if (form.value.password !== form.value.confirmPassword) {
        errorMsg.value = 'Password dan konfirmasi password tidak cocok'
        return
    }

    loading.value = true
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: {
                username: form.value.username,
                email: form.value.email,
                password: form.value.password,
                full_name: form.value.full_name,
                contact_phone: form.value.contact_phone || undefined,
                user_category: form.value.user_category,
                unit_name: form.value.unit_name || undefined
            }
        })

        success.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
        errorMsg.value = err?.data?.statusMessage || err?.statusMessage || 'Gagal mendaftar. Silakan coba lagi.'
    } finally {
        loading.value = false
    }
}
</script>