<template>
    <div class="min-h-screen pt-16 bg-gray-50">
        <section class="py-8 md:py-16 bg-white">
            <div class="container mx-auto px-4">
                <!-- Breadcrumb -->
                <Breadcrumb title="BGKP Paroki" />

                <!-- Header Section -->
                <div class="text-center mb-8 md:mb-12">
                    <h1 class="text-3xl md:text-4xl font-cinzel text-[#882f1d] mb-3 md:mb-4">Badan Gereja Katolik Paroki</h1>
                    <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        {{ decreeInfo.periodLabel }}
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="py-12">
            <div class="text-center">
                <div class="inline-block w-12 h-12 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-gray-600 mt-4">Memuat data BGKP...</p>
            </div>
        </div>

                <!-- Error State -->
                <div v-else-if="error" class="py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700 font-semibold">{{ error }}</p>
            </div>
        </div>

                <!-- Content -->
                <div v-else class="py-12">
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-blue-600 mb-1">Total Anggota</p>
                            <p class="text-3xl font-bold text-blue-900">{{ statistics.total }}</p>
                        </div>
                        <div class="bg-blue-200 p-3 rounded-lg">
                            <svg class="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-green-600 mb-1">Pengurus Inti</p>
                            <p class="text-3xl font-bold text-green-900">{{ statistics.core }}</p>
                        </div>
                        <div class="bg-green-200 p-3 rounded-lg">
                            <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-purple-600 mb-1">Ex Officio</p>
                            <p class="text-3xl font-bold text-purple-900">{{ statistics.exOfficio }}</p>
                        </div>
                        <div class="bg-purple-200 p-3 rounded-lg">
                            <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-orange-600 mb-1">Masa Jabatan</p>
                            <p class="text-3xl font-bold text-orange-900">3</p>
                            <p class="text-xs text-orange-600 mt-1">Tahun</p>
                        </div>
                        <div class="bg-orange-200 p-3 rounded-lg">
                            <svg class="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decree Information -->
            <div v-if="decreeInfo.number" class="bg-white rounded-lg shadow-sm p-6 mb-12 border-l-4 border-[#882f1d]">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informasi Surat Keputusan
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Nomor SK</p>
                        <p class="font-semibold text-gray-900">{{ decreeInfo.number }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Tanggal SK</p>
                        <p class="font-semibold text-gray-900">{{ decreeInfo.date }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Masa Berlaku</p>
                        <p class="font-semibold text-gray-900">{{ decreeInfo.period }}</p>
                    </div>
                </div>
            </div>

            <!-- Ketua Section -->
            <section v-if="groupedMembers.ketua.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-[#882f1d] rounded"></div>
                    Ketua
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="member in groupedMembers.ketua" :key="member.id"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#882f1d] hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                                <p class="text-sm text-gray-600">{{ member.position }}</p>
                            </div>
                            <span v-if="member.is_ex_officio"
                                class="text-xs bg-[#882f1d] text-white px-2 py-1 rounded-full font-semibold">
                                Ex Officio
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Wakil Ketua Section -->
            <section v-if="groupedMembers.wakil_ketua.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-purple-600 rounded"></div>
                    Wakil Ketua
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="member in groupedMembers.wakil_ketua" :key="member.id"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-purple-600 hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                                <p class="text-sm text-gray-600">{{ member.position }}</p>
                            </div>
                            <span v-if="member.is_ex_officio"
                                class="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold">
                                Ex Officio
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sekretaris Section -->
            <section v-if="groupedMembers.sekretaris.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-blue-600 rounded"></div>
                    Sekretaris
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="member in groupedMembers.sekretaris" :key="member.id"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-600 hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                                <p class="text-sm text-gray-600">{{ member.position }}</p>
                                <p v-if="member.position_level" class="text-xs text-blue-600 font-semibold mt-1">
                                    {{ member.position_level }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Bendahara Section -->
            <section v-if="groupedMembers.bendahara.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-green-600 rounded"></div>
                    Bendahara
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="member in groupedMembers.bendahara" :key="member.id"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-600 hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                                <p class="text-sm text-gray-600">{{ member.position }}</p>
                                <p v-if="member.position_level" class="text-xs text-green-600 font-semibold mt-1">
                                    {{ member.position_level }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Anggota Section -->
            <section v-if="groupedMembers.anggota.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-gray-600 rounded"></div>
                    Anggota
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div v-for="member in groupedMembers.anggota" :key="member.id"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-gray-400 hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                                <p class="text-sm text-gray-600">{{ member.position }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Empty State -->
            <div v-if="members.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500">Belum ada data anggota BGKP yang tersedia.</p>
            </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// SEO
useHead({
    title: 'Badan Gereja Katolik Paroki - Paroki St. Paulus Surabaya',
    meta: [
        {
            name: 'description',
            content: 'Daftar anggota Badan Gereja Katolik Paroki (BGKP) St. Paulus Surabaya'
        }
    ]
})

// State
const members = ref<any[]>([])
const loading = ref(true)
const error = ref('')

// Fetch Data
const fetchMembers = async () => {
    try {
        loading.value = true
        error.value = ''

        const response = await $fetch('/api/bgkp') as any

        if (response.success) {
            members.value = response.data.all || []
        }
    } catch (err: any) {
        console.error('Error fetching BGKP members:', err)
        error.value = 'Gagal memuat data BGKP. Silakan coba lagi nanti.'
    } finally {
        loading.value = false
    }
}

// Computed - Grouped Members
const groupedMembers = computed(() => {
    return {
        ketua: members.value.filter(m => m.position_type === 'ketua'),
        wakil_ketua: members.value.filter(m => m.position_type === 'wakil_ketua'),
        sekretaris: members.value.filter(m => m.position_type === 'sekretaris'),
        bendahara: members.value.filter(m => m.position_type === 'bendahara'),
        anggota: members.value.filter(m => m.position_type === 'anggota')
    }
})

// Computed - Statistics
const statistics = computed(() => {
    const total = members.value.length
    const core = members.value.filter(m =>
        ['ketua', 'wakil_ketua', 'sekretaris', 'bendahara'].includes(m.position_type)
    ).length
    const exOfficio = members.value.filter(m => m.is_ex_officio).length

    return { total, core, exOfficio }
})

// Computed - Decree Info
const decreeInfo = computed(() => {
    const firstMember = members.value[0]
    if (!firstMember) {
        return {
            number: '',
            date: '',
            period: '',
            periodLabel: 'Periode Tidak Tersedia'
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const number = firstMember.decree_number || ''
    const date = firstMember.decree_date ? formatDate(firstMember.decree_date) : ''
    const startDate = firstMember.period_start_date ? formatDate(firstMember.period_start_date) : ''
    const endDate = firstMember.period_end_date ? formatDate(firstMember.period_end_date) : 'Sekarang'
    const period = startDate ? `${startDate} - ${endDate}` : ''
    const periodLabel = period || 'Periode Tidak Tersedia'

    return { number, date, period, periodLabel }
})

// Lifecycle
onMounted(() => {
    fetchMembers()
})
</script>
