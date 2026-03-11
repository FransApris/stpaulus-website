<template>
    <div class="min-h-screen pt-16 bg-gray-50">
        <section class="py-8 md:py-16 bg-white">
            <div class="container mx-auto px-4">
                <!-- Breadcrumb -->
                <Breadcrumb title="Dewan Pastoral Paroki" />

                <!-- Header Section -->
                <div class="text-center mb-8 md:mb-12">
                    <h1 class="text-3xl md:text-4xl font-cinzel text-[#882f1d] mb-3 md:mb-4">Dewan Pastoral Paroki</h1>
                    <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        {{ decreeInfo.periodLabel }}
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="py-12">
            <div class="text-center">
                <div class="inline-block w-12 h-12 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-gray-600 mt-4">Memuat data DPP...</p>
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
                            <p class="text-3xl font-bold text-green-900">{{ statistics.pengurusInti }}</p>
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
                            <p class="text-sm font-medium text-purple-600 mb-1">Jumlah Wilayah</p>
                            <p class="text-3xl font-bold text-purple-900">{{ statistics.totalWilayah }}</p>
                        </div>
                        <div class="bg-purple-200 p-3 rounded-lg">
                            <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

            <!-- Pengurus Inti Section -->
            <section v-if="groupedMembers.pengurus_inti.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-[#882f1d] rounded"></div>
                    Pengurus Inti
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="member in groupedMembers.pengurus_inti" :key="member.id"
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

            <!-- Bidang Sections -->
            <section v-for="bidang in ['Pembinaan', 'Sumber', 'Kerasulan Khusus', 'Kerasulan Umum']" :key="bidang" class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 rounded" :class="getBidangColor(bidang)"></div>
                    Bidang {{ bidang }}
                </h2>
                
                <!-- Ketua & Sekretaris Bidang -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <template v-for="member in getMembersByBidang(bidang).leadership" :key="member.id">
                        <div class="bg-white rounded-lg shadow-sm p-6 border-t-4 hover:shadow-md transition-shadow"
                            :class="getBidangBorderColor(bidang)">
                            <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
                            <p class="text-sm text-gray-600">{{ member.position }}</p>
                        </div>
                    </template>
                </div>

                <!-- Seksi-seksi -->
                <div v-if="getMembersByBidang(bidang).seksi.length > 0" class="space-y-6">
                    <div v-for="(seksiMembers, seksiName) in groupBySeksi(getMembersByBidang(bidang).seksi)" 
                        :key="seksiName" class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">{{ seksiName }}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="member in seksiMembers" :key="member.id"
                                class="bg-white rounded-lg shadow-sm p-4 border-l-4"
                                :class="getBidangBorderColor(bidang)">
                                <p class="font-semibold text-gray-900">{{ member.name }}</p>
                                <p v-if="member.sub_seksi_name" class="text-xs text-gray-500 mt-1">{{ member.sub_seksi_name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Ketua Wilayah & Lingkungan Section -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div class="w-1 h-8 bg-indigo-600 rounded"></div>
                    Ketua Wilayah & Lingkungan
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="(members, wilayahName) in wilayahGroups" :key="wilayahName"
                        class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-indigo-600">
                        <h3 class="text-lg font-bold text-indigo-900 mb-4">Wilayah {{ wilayahName }}</h3>
                        <div class="space-y-4">
                            <!-- Ketua Wilayah -->
                            <div v-for="member in members.filter((m: any) => m.position_category === 'ketua_wilayah')" :key="member.id" 
                                class="border-l-4 border-l-indigo-600 pl-3 pb-3 border-b border-b-gray-200">
                                <p class="font-bold text-indigo-900 text-sm">{{ member.name }}</p>
                                <p class="text-xs text-indigo-600 font-semibold">Ketua Wilayah</p>
                            </div>
                            <!-- Ketua Lingkungan -->
                            <div class="space-y-2">
                                <div v-for="member in members.filter((m: any) => m.position_category === 'ketua_lingkungan')" :key="member.id" 
                                    class="border-l-2 border-gray-300 pl-3">
                                    <p class="font-semibold text-gray-900 text-sm">{{ member.name }}</p>
                                    <p class="text-xs text-gray-500">{{ member.position }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// SEO
useHead({
    title: 'Dewan Pastoral Paroki - Paroki St. Paulus Sidoarjo',
    meta: [
        {
            name: 'description',
            content: 'Daftar pengurus Dewan Pastoral Paroki (DPP) St. Paulus Sidoarjo'
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

        const response = await $fetch('/api/dpp') as any

        if (response.success) {
            members.value = response.data.all || []
        }
    } catch (err: any) {
        console.error('Error fetching DPP members:', err)
        error.value = 'Gagal memuat data DPP. Silakan coba lagi nanti.'
    } finally {
        loading.value = false
    }
}

// Computed - Grouped Members
const groupedMembers = computed(() => {
    return {
        pengurus_inti: members.value.filter(m => m.position_category === 'pengurus_inti'),
        bidang_pembinaan: members.value.filter(m => m.position_category === 'bidang_pembinaan'),
        bidang_sumber: members.value.filter(m => m.position_category === 'bidang_sumber'),
        bidang_kerasulan_khusus: members.value.filter(m => m.position_category === 'bidang_kerasulan_khusus'),
        bidang_kerasulan_umum: members.value.filter(m => m.position_category === 'bidang_kerasulan_umum')
    }
})

// Computed - Wilayah Groups
const wilayahGroups = computed(() => {
    const groups: any = {}
    const wilayahMembers = members.value.filter(m => 
        m.position_category === 'ketua_wilayah' || m.position_category === 'ketua_lingkungan'
    )
    
    wilayahMembers.forEach(m => {
        if (m.wilayah_name) {
            if (!groups[m.wilayah_name]) {
                groups[m.wilayah_name] = []
            }
            groups[m.wilayah_name].push(m)
        }
    })
    
    // Sort each group: Ketua Wilayah first, then Ketua Lingkungan by lingkungan_number
    Object.keys(groups).forEach(wilayahName => {
        groups[wilayahName].sort((a: any, b: any) => {
            // Ketua Wilayah always comes first
            if (a.position_category === 'ketua_wilayah' && b.position_category !== 'ketua_wilayah') return -1
            if (a.position_category !== 'ketua_wilayah' && b.position_category === 'ketua_wilayah') return 1
            
            // Sort Ketua Lingkungan by lingkungan_number
            if (a.position_category === 'ketua_lingkungan' && b.position_category === 'ketua_lingkungan') {
                return (a.lingkungan_number || 0) - (b.lingkungan_number || 0)
            }
            
            return 0
        })
    })
    
    return groups
})

// Computed - Statistics
const statistics = computed(() => {
    const total = members.value.length
    const pengurusInti = members.value.filter(m => m.position_category === 'pengurus_inti').length
    const totalWilayah = Object.keys(wilayahGroups.value).length

    return { total, pengurusInti, totalWilayah }
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

// Methods
const getMembersByBidang = (bidangName: string) => {
    const bidangKey = `bidang_${bidangName.toLowerCase().replace(/ /g, '_')}`
    const allMembers = (groupedMembers.value as any)[bidangKey] || []
    
    return {
        leadership: allMembers.filter((m: any) => 
            m.position_type === 'ketua_bidang' || m.position_type === 'sekretaris_bidang'
        ),
        seksi: allMembers.filter((m: any) => 
            m.position_type !== 'ketua_bidang' && m.position_type !== 'sekretaris_bidang'
        )
    }
}

const groupBySeksi = (members: any[]) => {
    const grouped: any = {}
    members.forEach(m => {
        const seksiName = m.seksi_name || 'Lainnya'
        if (!grouped[seksiName]) {
            grouped[seksiName] = []
        }
        grouped[seksiName].push(m)
    })
    return grouped
}

const getBidangColor = (bidang: string) => {
    const colors: any = {
        'Pembinaan': 'bg-blue-600',
        'Sumber': 'bg-green-600',
        'Kerasulan Khusus': 'bg-purple-600',
        'Kerasulan Umum': 'bg-orange-600'
    }
    return colors[bidang] || 'bg-gray-600'
}

const getBidangBorderColor = (bidang: string) => {
    const colors: any = {
        'Pembinaan': 'border-blue-600',
        'Sumber': 'border-green-600',
        'Kerasulan Khusus': 'border-purple-600',
        'Kerasulan Umum': 'border-orange-600'
    }
    return colors[bidang] || 'border-gray-600'
}

// Lifecycle
onMounted(() => {
    fetchMembers()
})
</script>
