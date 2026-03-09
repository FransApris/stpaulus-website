<template>
    <div>
        <!-- Add Devotion Button -->
        <div class="mb-6">
            <button @click="$emit('openAddModal')"
                class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Tambah Jadwal Devosi
            </button>
        </div>

        <!-- Devotions List -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div v-if="loading" class="p-8 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
                <p class="mt-2 text-gray-600">Memuat jadwal...</p>
            </div>

            <div v-else-if="devotions.length === 0" class="p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal devosi</h3>
                <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat jadwal devosi pertama.</p>
            </div>

            <div v-else class="p-6">
                <div class="space-y-4">
                    <div v-for="devotion in devotions" :key="devotion.id"
                        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">{{ getDevotionIcon(devotion.type) }}</span>
                                    <h4 class="text-lg font-medium text-gray-900">{{ devotion.title }}</h4>
                                </div>
                                <div class="mt-2 space-y-1 text-sm text-gray-600">
                                    <p><span class="font-medium">Jenis:</span> {{ devotion.type_name ||
                                        getDevotionLabel(devotion.type) }}</p>
                                    <p><span class="font-medium">Hari:</span> {{ devotion.day_of_week }}</p>
                                    <p><span class="font-medium">Waktu:</span> {{ devotion.time }}</p>
                                    <p v-if="devotion.location"><span class="font-medium">Lokasi:</span> {{
                                        devotion.location }}</p>
                                    <p v-if="devotion.description" class="text-xs text-gray-500">{{ devotion.description
                                        }}</p>
                                    <p><span class="font-medium">Status:</span>
                                        <span :class="devotion.is_active ? 'text-green-600' : 'text-red-600'">
                                            {{ devotion.is_active ? 'Aktif' : 'Tidak Aktif' }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button @click="$emit('edit', devotion)" class="text-blue-600 hover:text-blue-800 p-1"
                                    title="Edit">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                        </path>
                                    </svg>
                                </button>
                                <button @click="$emit('toggle', devotion)"
                                    :class="devotion.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                                    class="p-1" :title="devotion.is_active ? 'Nonaktifkan' : 'Aktifkan'">
                                    <svg v-if="devotion.is_active" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                                        </path>
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </button>
                                <button @click="$emit('delete', devotion)" class="text-red-600 hover:text-red-800 p-1"
                                    title="Hapus">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    devotions: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['openAddModal', 'edit', 'toggle', 'delete'])

const getDevotionIcon = (type) => {
    const icons = {
        'jalan_salib': '✝️',
        'doa_novena': '📿',
        'doa_rosario': '📿',
        'adorasi': '🕯️'
    }
    return icons[type] || '🙏'
}

const getDevotionLabel = (type) => {
    const labels = {
        'jalan_salib': 'Jalan Salib',
        'doa_novena': 'Doa Novena',
        'doa_rosario': 'Doa Rosario',
        'adorasi': 'Adorasi (Sakramen Mahakudus)'
    }
    return labels[type] || type
}
</script>
