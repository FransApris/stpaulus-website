<template>
    <div class="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Header -->
        <div class="mb-2 sm:mb-6">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Wilayah, Lingkungan & Seksi</h1>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">Kelola data wilayah, lingkungan, dan seksi Paroki St. Paulus</p>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
            <div class="border-b border-gray-200 overflow-x-auto">
                <nav class="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
                    <button @click="activeTab = 'lingkungan'" :class="[
                        'whitespace-nowrap py-3.5 sm:py-4 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2',
                        activeTab === 'lingkungan'
                            ? 'border-[#882f1d] text-[#882f1d]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <span>📍</span>
                        <span>Lingkungan</span>
                    </button>
                    <button @click="activeTab = 'wilayah'" :class="[
                        'whitespace-nowrap py-3.5 sm:py-4 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2',
                        activeTab === 'wilayah'
                            ? 'border-[#882f1d] text-[#882f1d]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <span>🗺️</span>
                        <span>Wilayah</span>
                    </button>
                    <button @click="activeTab = 'seksi'" :class="[
                        'whitespace-nowrap py-3.5 sm:py-4 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2',
                        activeTab === 'seksi'
                            ? 'border-[#882f1d] text-[#882f1d]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <span>👥</span>
                        <span>Seksi</span>
                    </button>
                </nav>
            </div>
        </div>

        <!-- Lingkungan Tab Content -->
        <div v-if="activeTab === 'lingkungan'">
            <LingkunganManager />
        </div>

        <!-- Wilayah Tab Content -->
        <div v-if="activeTab === 'wilayah'">
            <WilayahManager />
        </div>

        <!-- Seksi Tab Content -->
        <div v-if="activeTab === 'seksi'">
            <SeksiManager />
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

const activeTab = ref('lingkungan')

// Listen for tab switch event from WilayahManager
onMounted(() => {
    const handleTabSwitch = () => {
        activeTab.value = 'lingkungan'
    }
    window.addEventListener('switch-to-lingkungan', handleTabSwitch)
    
    onUnmounted(() => {
        window.removeEventListener('switch-to-lingkungan', handleTabSwitch)
    })
})
</script>
