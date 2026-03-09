<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Wilayah & Lingkungan</h1>
            <p class="text-gray-600">Kelola data wilayah dan lingkungan Paroki St. Paulus</p>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                    <button @click="activeTab = 'lingkungan'" :class="[
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'lingkungan'
                            ? 'border-[#882f1d] text-[#882f1d]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        📍 Lingkungan
                    </button>
                    <button @click="activeTab = 'wilayah'" :class="[
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'wilayah'
                            ? 'border-[#882f1d] text-[#882f1d]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        🗺️ Wilayah
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
