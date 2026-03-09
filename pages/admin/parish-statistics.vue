<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Statistik Paroki</h1>
                        <p class="mt-1 text-sm text-gray-500">Kelola data "Paroki dalam Angka" yang ditampilkan di
                            homepage</p>
                    </div>
                    <NuxtLink to="/admin/dashboard"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d]"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                    <p class="text-red-800">{{ error }}</p>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="stat in statistics" :key="stat.stat_key"
                    class="bg-white rounded-lg shadow-md overflow-hidden">
                    <!-- Card Header -->
                    <div class="bg-gradient-to-r from-[#882f1d] to-[#6b2416] px-6 py-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-white">{{ stat.stat_label }}</h3>
                            <span class="text-white/70 text-sm">{{ stat.stat_subtitle }}</span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-6">
                        <!-- Current Value Display -->
                        <div class="mb-6 text-center">
                            <div class="text-5xl font-bold text-[#882f1d] mb-2">
                                {{ stat.stat_value }}
                            </div>
                            <div class="text-sm text-gray-500">
                                Terakhir diperbarui: {{ stat.last_updated || 'Belum pernah' }}
                            </div>
                        </div>

                        <!-- Edit Form -->
                        <form @submit.prevent="updateStatistic(stat)" class="space-y-4">
                            <!-- New Value -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nilai Baru
                                </label>
                                <input v-model.number="stat.newValue" type="number" min="0" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#882f1d] focus:border-[#882f1d]"
                                    :placeholder="`Masukkan nilai ${stat.stat_label.toLowerCase()}`" />
                            </div>

                            <!-- Change Reason (Optional) -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Alasan Perubahan (Opsional)
                                </label>
                                <textarea v-model="stat.changeReason" rows="2"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#882f1d] focus:border-[#882f1d]"
                                    placeholder="Contoh: Update data sensus 2026"></textarea>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" :disabled="stat.updating || !stat.newValue"
                                class="w-full bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                                <span v-if="stat.updating">
                                    <svg class="animate-spin h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Menyimpan...
                                </span>
                                <span v-else>
                                    💾 Simpan Perubahan
                                </span>
                            </button>
                        </form>

                        <!-- History Link -->
                        <button @click="showHistory(stat)"
                            class="w-full mt-4 text-sm text-[#882f1d] hover:text-[#6b2416] font-medium">
                            📜 Lihat Riwayat Perubahan
                        </button>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage"
                class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    {{ successMessage }}
                </div>
            </div>

            <!-- History Modal -->
            <div v-if="showHistoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                @click.self="showHistoryModal = false">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <!-- Modal Header -->
                    <div
                        class="bg-gradient-to-r from-[#882f1d] to-[#6b2416] px-6 py-4 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white">
                            Riwayat Perubahan: {{ selectedStat?.stat_label }}
                        </h3>
                        <button @click="showHistoryModal = false" class="text-white hover:text-gray-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto max-h-[60vh]">
                        <div v-if="loadingHistory" class="flex justify-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
                        </div>

                        <div v-else-if="history.length === 0" class="text-center py-8 text-gray-500">
                            Belum ada riwayat perubahan
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="(item, index) in history" :key="index"
                                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="text-red-600 font-semibold">{{ item.old_value }}</span>
                                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span class="text-green-600 font-semibold">{{ item.new_value }}</span>
                                        </div>
                                        <p class="text-sm text-gray-600">{{ item.change_reason }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                    <span>👤 {{ item.changed_by }}</span>
                                    <span>📅 {{ item.formatted_date }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

// State
const loading = ref(true)
const error = ref(null)
const statistics = ref([])
const successMessage = ref('')
const showHistoryModal = ref(false)
const loadingHistory = ref(false)
const history = ref([])
const selectedStat = ref(null)

// Fetch statistics
const fetchStatistics = async () => {
    try {
        loading.value = true
        error.value = null

        const response = await $fetch('/api/parish-statistics')

        if (response.success) {
            // Add reactive properties for form handling
            statistics.value = response.data.map(stat => ({
                ...stat,
                newValue: null,
                changeReason: '',
                updating: false
            }))
        } else {
            error.value = 'Gagal memuat data statistik'
        }
    } catch (err) {
        console.error('Error fetching statistics:', err)
        error.value = 'Terjadi kesalahan saat memuat data'
    } finally {
        loading.value = false
    }
}

// Update statistic
const updateStatistic = async (stat) => {
    if (!stat.newValue || stat.newValue === stat.stat_value) {
        return
    }

    try {
        stat.updating = true

        const response = await $fetch('/api/admin/parish-statistics', {
            method: 'PUT',
            body: {
                stat_key: stat.stat_key,
                stat_value: stat.newValue,
                change_reason: stat.changeReason || `Update ${stat.stat_label}`
            }
        })

        if (response.success) {
            // Update local data
            stat.stat_value = stat.newValue
            stat.last_updated = new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })

            // Reset form
            stat.newValue = null
            stat.changeReason = ''

            // Show success message
            successMessage.value = `${stat.stat_label} berhasil diperbarui!`
            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        }
    } catch (err) {
        console.error('Error updating statistic:', err)
        alert('Gagal menyimpan perubahan. Silakan coba lagi.')
    } finally {
        stat.updating = false
    }
}

// Show history
const showHistory = async (stat) => {
    selectedStat.value = stat
    showHistoryModal.value = true
    loadingHistory.value = true
    history.value = []

    try {
        const response = await $fetch(`/api/admin/parish-statistics/history?stat_key=${stat.stat_key}`)
        if (response.success) {
            history.value = response.data
        }
    } catch (err) {
        console.error('Error fetching history:', err)
    } finally {
        loadingHistory.value = false
    }
}

// Initialize
onMounted(() => {
    fetchStatistics()
})
</script>

<style scoped>
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
}
</style>
