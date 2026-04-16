<template>
    <div>
        <!-- Info Banner: Data from Multiple Sources -->
        <div class="mb-4 bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
            <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                    <p class="text-sm font-medium text-teal-900">Data Lingkungan & Ketua (Hybrid)</p>
                    <p class="text-xs text-teal-700 mt-1">
                        Data lingkungan dengan info ketua dari <a href="/admin/dpp" class="font-semibold underline hover:text-teal-900">DPP</a>. 
                        Lingkungan yang bersumber dari DPP dapat diedit langsung di sini atau di <a href="/admin/dpp" class="font-semibold underline hover:text-teal-900">halaman DPP</a>.
                    </p>
                </div>
            </div>
        </div>

        <!-- Header with Search & Filter -->
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <input v-model="searchQuery" type="text" placeholder="Cari lingkungan, ketua, wilayah..."
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent w-80" />
                <select v-model="filterWilayah"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                    <option value="all">Semua Wilayah</option>
                    <option v-for="w in wilayahOptions" :key="w.id" :value="w.id">{{ w.nama }}</option>
                </select>
                <!-- Bulk Edit Toggle -->
                <button @click="toggleBulkMode" :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                    bulkSelectionMode
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!bulkSelectionMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ bulkSelectionMode ? 'Batal' : 'Edit Massal' }}
                </button>
                <button v-if="bulkSelectionMode && selectedLingkungan.length > 0" @click="openBulkEditModal"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit {{ selectedLingkungan.length }} Lingkungan
                </button>
                <!-- View Mode Toggle -->
                <div class="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button @click="viewMode = 'grouped'" :class="[
                        'px-4 py-2 text-sm font-medium transition-colors',
                        viewMode === 'grouped'
                            ? 'bg-[#882f1d] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    ]">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Group
                    </button>
                    <button @click="viewMode = 'list'" :class="[
                        'px-4 py-2 text-sm font-medium transition-colors',
                        viewMode === 'list'
                            ? 'bg-[#882f1d] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    ]">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        List
                    </button>
                </div>
            </div>
        </div>

        <!-- Statistics Cards (Data from Lingkungan + DPP) -->
        <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ stats.totalLingkungan }}</div>
                <div class="text-sm text-blue-800">Total Lingkungan</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ stats.totalKK }}</div>
                <div class="text-sm text-green-800">Total KK</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ stats.totalJiwa }}</div>
                <div class="text-sm text-purple-800">Total Jiwa</div>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">{{ stats.avgKKPerLingkungan }}</div>
                <div class="text-sm text-orange-800">Lingkungan dengan Ketua</div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-gray-600 mt-3">Memuat data...</p>
        </div>

        <!-- Table (List View) -->
        <div v-if="viewMode === 'list'" class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-if="bulkSelectionMode" class="px-4 py-3 text-left">
                            <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                                class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lingkungan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Wilayah</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KK / Jiwa
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="ling in filteredLingkungan" :key="ling.id" class="hover:bg-gray-50">
                        <td v-if="bulkSelectionMode" class="px-4 py-4">
                            <input type="checkbox" :value="ling" v-model="selectedLingkungan"
                                :disabled="ling.source === 'database'"
                                class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d] disabled:opacity-30" />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    :style="{ backgroundColor: ling.color }">
                                    {{ ling.no }}
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ ling.nama }}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-500">{{ ling.wilayah_nama || ling.wilayah_text || '-' }}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-900">{{ ling.ketua || '-' }}</div>
                            <div v-if="ling.telp" class="text-xs text-gray-500">📞 {{ ling.telp }}</div>
                            <div v-if="ling.no_hp_pengurus" class="text-xs text-blue-600">
                                <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Pengurus: {{ ling.no_hp_pengurus }}
                            </div>
                            <div v-else class="text-xs text-amber-600 italic">
                                <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Pengurus: [Belum diisi]
                            </div>
                            <div v-if="ling.has_dpp_ketua" class="text-xs text-teal-600 mt-0.5">✓ Data dari DPP</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ ling.jumlah_kk || 0 }} KK / {{ ling.jumlah_jiwa || 0 }} jiwa
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                ling.is_visible
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ ling.is_visible ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button v-if="ling.source === 'database'" @click="editLingkungan(ling)"
                                class="text-[#882f1d] hover:text-[#6b2416] transition-colors" 
                                title="Edit Data Lingkungan">
                                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <div v-else class="inline-flex items-center gap-2">
                                <button @click="editLingkunganLimited(ling)"
                                    class="text-[#882f1d] hover:text-[#6b2416] transition-colors" 
                                    title="Edit KK, Jiwa, No. HP Kontak">
                                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <a href="/admin/dpp"
                                    class="text-teal-600 hover:text-teal-800 transition-colors inline-flex items-center gap-1" 
                                    title="Data Ketua dari DPP - Edit Ketua di DPP">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span class="text-xs">DPP</span>
                                </a>
                            </div>
                            <button v-if="ling.source === 'database'" @click="confirmDelete(ling)"
                                class="text-red-600 hover:text-red-800 transition-colors" title="Hapus">
                                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <span v-else class="text-xs text-gray-400" title="Data dari DPP - hapus di halaman DPP">
                                Data DPP
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredLingkungan.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500">Belum ada lingkungan yang ditambahkan atau tidak sesuai filter.</p>
            </div>
        </div>

        <!-- Grouped View -->
        <div v-else class="space-y-4">
            <div v-for="group in lingkunganGroupedByWilayah" :key="group.wilayah" 
                class="bg-white rounded-lg shadow-sm overflow-hidden">
                <!-- Wilayah Header -->
                <div class="bg-gradient-to-r from-[#882f1d] to-[#6b2416] px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <h3 class="text-xl font-bold text-white">{{ group.wilayah || 'Tanpa Wilayah' }}</h3>
                        </div>
                        <div class="flex items-center gap-4 text-white">
                            <div class="text-sm">
                                <span class="font-semibold">{{ group.lingkungan.length }}</span> Lingkungan
                            </div>
                            <div class="text-sm">
                                <span class="font-semibold">{{ group.totalKK }}</span> KK
                            </div>
                            <div class="text-sm">
                                <span class="font-semibold">{{ group.totalJiwa }}</span> Jiwa
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pengurus Wilayah (Ketua Wilayah) -->
                <div v-if="getPengurusWilayah(group.wilayah)" class="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-orange-200 px-6 py-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#882f1d] to-[#6b2416] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {{ group.wilayah.charAt(0) }}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-[#882f1d]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-xs font-semibold text-gray-600 uppercase">Ketua Wilayah</span>
                            </div>
                            <div class="font-bold text-gray-900 text-lg mt-1">{{ getPengurusWilayah(group.wilayah).name }}</div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div v-if="getPengurusWilayah(group.wilayah).telp" class="flex items-center gap-2 text-sm text-gray-700">
                                <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span class="font-medium">{{ getPengurusWilayah(group.wilayah).telp }}</span>
                            </div>
                            <div v-if="getPengurusWilayah(group.wilayah).email" class="flex items-center gap-2 text-sm text-gray-700">
                                <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span class="font-medium">{{ getPengurusWilayah(group.wilayah).email }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lingkungan List -->
                <div class="divide-y divide-gray-200">
                    <div v-for="ling in group.lingkungan" :key="ling.id"
                        class="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4 flex-1">
                                <!-- Bulk Select Checkbox -->
                                <input v-if="bulkSelectionMode" type="checkbox" :value="ling" v-model="selectedLingkungan"
                                    :disabled="ling.source === 'database'"
                                    class="w-5 h-5 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d] disabled:opacity-30" />
                                <!-- Number Badge -->
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    :style="{ backgroundColor: ling.color }">
                                    {{ ling.no }}
                                </div>

                                <!-- Info -->
                                <div class="flex-1 grid grid-cols-3 gap-4">
                                    <div>
                                        <div class="text-sm font-semibold text-gray-900">{{ ling.nama }}</div>
                                        <div v-if="ling.keterangan" class="text-xs text-gray-500">{{ ling.keterangan }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 mb-0.5">Ketua Lingkungan:</div>
                                        <div class="text-sm font-medium text-gray-900">{{ ling.ketua || '-' }}</div>
                                        <div v-if="ling.telp" class="text-xs text-gray-500 mt-0.5">📞 {{ ling.telp }}</div>
                                        <div v-if="ling.no_hp_pengurus" class="text-xs text-blue-600 mt-0.5">
                                            <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Pengurus: {{ ling.no_hp_pengurus }}
                                        </div>
                                        <div v-else class="text-xs text-amber-600 italic mt-0.5">
                                            <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Pengurus: [Belum diisi]
                                        </div>
                                        <div v-if="ling.has_dpp_ketua" class="text-xs text-teal-600 mt-0.5">✓ Data dari DPP</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 mb-0.5">Jumlah:</div>
                                        <div class="text-sm text-gray-900">
                                            <span class="font-medium">{{ ling.jumlah_kk || 0 }}</span> KK / 
                                            <span class="font-medium">{{ ling.jumlah_jiwa || 0 }}</span> Jiwa
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-3">
                                <span :class="[
                                    'px-2 py-1 text-xs font-semibold rounded-full',
                                    ling.is_visible
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ ling.is_visible ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                                <span v-if="ling.source === 'dpp'" class="px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                                    Data DPP
                                </span>
                                <button v-if="ling.source === 'database'" @click="editLingkungan(ling)"
                                    class="text-[#882f1d] hover:text-[#6b2416] transition-colors p-1" 
                                    title="Edit Data Lingkungan">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <div v-else class="inline-flex items-center gap-2">
                                    <button @click="editLingkunganLimited(ling)"
                                        class="text-[#882f1d] hover:text-[#6b2416] transition-colors p-1" 
                                        title="Edit">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <button v-if="ling.source === 'database'" @click="confirmDelete(ling)"
                                    class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty wilayah -->
                <div v-if="group.lingkungan.length === 0" class="px-6 py-8 text-center text-gray-500">
                    Belum ada lingkungan di wilayah ini
                </div>
            </div>

            <!-- Empty State for Grouped View -->
            <div v-if="lingkunganGroupedByWilayah.length === 0" 
                class="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500">Belum ada lingkungan yang ditambahkan atau tidak sesuai filter.</p>
            </div>
        </div>

        <!-- Modal Form -->
        <Teleport to="body">
            <div v-if="showModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
                    <div
                        class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ modalMode === 'create' ? 'Tambah Lingkungan' : modalMode === 'edit-limited' ? 'Edit Data Lingkungan (Terbatas)' : 'Edit Lingkungan' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveLingkungan" class="p-6 space-y-4">
                        <!-- Info Banner for Limited Edit -->
                        <div v-if="modalMode === 'edit-limited'" class="mb-4 bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                            <div class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-teal-900">Mode Edit Terbatas</p>
                                    <p class="text-xs text-teal-700 mt-1">
                                        Data ketua berasal dari <a href="/admin/dpp" class="font-semibold underline hover:text-teal-900">DPP</a>. 
                                        Hanya Jumlah KK, Jumlah Jiwa, dan No. HP Kontak yang dapat diedit di sini.
                                        Untuk edit data ketua, silakan ke <a href="/admin/dpp" class="font-semibold underline hover:text-teal-900">halaman DPP</a>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Row 1: No & Nama -->
                        <div class="grid grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    No <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="formData.no" type="number" required placeholder="1"
                                    :readonly="modalMode === 'edit' || modalMode === 'edit-limited'"
                                    :class="[
                                        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent',
                                        (modalMode === 'edit' || modalMode === 'edit-limited') ? 'bg-gray-100 cursor-not-allowed' : ''
                                    ]" />
                            </div>
                            <div class="col-span-3">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lingkungan <span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.nama" type="text" required placeholder="St. Petrus"
                                    :readonly="modalMode === 'edit-limited'"
                                    :class="[
                                        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent',
                                        modalMode === 'edit-limited' ? 'bg-gray-100 cursor-not-allowed' : ''
                                    ]" />
                            </div>
                        </div>

                        <!-- Row 2: Wilayah -->
                        <div v-if="modalMode !== 'edit-limited'" class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Wilayah</label>
                                <select v-model="formData.wilayah_id"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option :value="null">- Pilih Wilayah -</option>
                                    <option v-for="w in wilayahOptions" :key="w.id" :value="w.id">{{ w.nama }}</option>
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Atau isi wilayah manual di bawah</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Wilayah Manual</label>
                                <input v-model="formData.wilayah_text" type="text" placeholder="Juanda, Waru"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="text-xs text-gray-500 mt-1">Jika wilayah tidak ada di dropdown</p>
                            </div>
                        </div>

                        <!-- Row 3: Ketua & No. HP -->
                        <div v-if="modalMode !== 'edit-limited'" class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ketua</label>
                                <input v-model="formData.ketua" type="text" placeholder="Bapak Andreas"
                                    :readonly="formData.has_dpp_ketua"
                                    :class="[
                                        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent',
                                        formData.has_dpp_ketua ? 'bg-gray-100 cursor-not-allowed' : ''
                                    ]" />
                                <p v-if="formData.has_dpp_ketua" class="text-xs text-teal-600 mt-1">✓ Data dari DPP - <a href="/admin/dpp" class="underline">Edit di DPP</a></p>
                                <p v-else class="text-xs text-gray-500 mt-1">Atau kelola di <a href="/admin/dpp" class="text-teal-600 underline">DPP</a></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">No. HP Kontak</label>
                                <input v-model="formData.no_hp_pengurus" type="text" placeholder="081234567890"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="text-xs text-gray-500 mt-1">No. HP sekretaris/pengurus lingkungan</p>
                            </div>
                        </div>

                        <!-- Row 3b (edit-limited): No. HP Kontak -->
                        <div v-if="modalMode === 'edit-limited'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">No. HP Kontak</label>
                            <input v-model="formData.no_hp_pengurus" type="text" placeholder="081234567890"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            <p class="text-xs text-gray-500 mt-1">No. HP sekretaris/pengurus lingkungan</p>
                        </div>

                        <!-- Row 4: Email -->
                        <div v-if="modalMode !== 'edit-limited'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input v-model="formData.email" type="email" placeholder="lingkungan@stpaulus.or.id"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Row 5: Alamat -->
                        <div v-if="modalMode !== 'edit-limited'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea v-model="formData.alamat" rows="2" placeholder="Alamat sekretariat lingkungan..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Row 6: KK & Jiwa -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah KK</label>
                                <input v-model.number="formData.jumlah_kk" type="number" placeholder="75"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Jiwa</label>
                                <input v-model.number="formData.jumlah_jiwa" type="number" placeholder="225"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="text-xs text-gray-500 mt-1">Atau otomatis: {{ formData.jumlah_kk * 3 }} jiwa
                                    (KK × 3)</p>
                            </div>
                        </div>

                        <!-- Row 7: Color & Display Order -->
                        <div v-if="modalMode !== 'edit-limited'" class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Warna Badge</label>
                                <div class="flex items-center gap-2">
                                    <input v-model="formData.color" type="color"
                                        class="w-12 h-10 border border-gray-300 rounded cursor-pointer" />
                                    <input v-model="formData.color" type="text" placeholder="#3B82F6"
                                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                                <input v-model.number="formData.display_order" type="number" placeholder="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <div class="flex items-center h-10">
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="formData.is_visible" type="checkbox" class="sr-only peer" />
                                        <div
                                            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#882f1d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#882f1d]">
                                        </div>
                                        <span class="ml-3 text-sm font-medium text-gray-700">Visible</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Row 8: Keterangan -->
                        <div v-if="modalMode !== 'edit-limited'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                            <textarea v-model="formData.keterangan" rows="2"
                                placeholder="Catatan tambahan tentang lingkungan..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit"
                                class="flex-1 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                                {{ modalMode === 'create' ? 'Tambah' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteConfirm"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                @click.self="showDeleteConfirm = false">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus lingkungan <strong>{{ deleteTarget?.nama }}</strong>?
                    </p>
                    <div class="flex gap-3">
                        <button @click="showDeleteConfirm = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button @click="deleteLingkungan"
                            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Bulk Edit Modal -->
        <Teleport to="body">
            <div v-if="showBulkEditModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                @click.self="closeBulkEditModal">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Edit Massal - Tambah No. HP Kontak</h2>
                        <button @click="closeBulkEditModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="mb-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <p class="text-sm text-blue-900">
                            <strong>{{ selectedLingkungan.length }}</strong> lingkungan dipilih. 
                            Isi nomor HP pengurus untuk setiap lingkungan di bawah, lalu klik Simpan Semua.
                        </p>
                    </div>

                    <form @submit.prevent="saveBulkEdit" class="space-y-4">
                        <div class="border border-gray-200 rounded-lg overflow-hidden">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lingkungan</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilayah</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. HP Kontak</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KK</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jiwa</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="ling in selectedLingkungan" :key="ling.id" class="hover:bg-gray-50">
                                        <td class="px-4 py-3 whitespace-nowrap">
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                :style="{ backgroundColor: ling.color }">
                                                {{ ling.no }}
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="text-sm font-medium text-gray-900">{{ ling.nama }}</div>
                                            <div v-if="ling.ketua" class="text-xs text-gray-500">Ketua: {{ ling.ketua }}</div>
                                        </td>
                                        <td class="px-4 py-3 text-sm text-gray-600">
                                            {{ ling.wilayah_nama || ling.wilayah_text }}
                                        </td>
                                        <td class="px-4 py-3">
                                            <input v-model="bulkEditData[ling.id].no_hp_pengurus" 
                                                type="text" 
                                                placeholder="081234567890"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent text-sm" />
                                        </td>
                                        <td class="px-4 py-3">
                                            <input v-model.number="bulkEditData[ling.id].jumlah_kk" 
                                                type="number" 
                                                placeholder="0"
                                                class="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#882f1d] text-sm" />
                                        </td>
                                        <td class="px-4 py-3">
                                            <input v-model.number="bulkEditData[ling.id].jumlah_jiwa" 
                                                type="number" 
                                                placeholder="0"
                                                class="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#882f1d] text-sm" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t">
                            <div class="text-sm text-gray-600">
                                💡 Kosongkan field yang tidak ingin diubah
                            </div>
                            <div class="flex gap-3">
                                <button type="button" @click="closeBulkEditModal"
                                    class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                                <button type="submit"
                                    class="px-6 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan Semua
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Toast Notification -->
        <Teleport to="body">
            <Transition name="toast">
                <div v-if="toast.show"
                    class="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
                    :class="{
                        'bg-green-500 text-white': toast.type === 'success',
                        'bg-red-500 text-white': toast.type === 'error',
                        'bg-blue-500 text-white': toast.type === 'info'
                    }">
                    <svg v-if="toast.type === 'success'" class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-if="toast.type === 'error'" class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ toast.message }}</span>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from '#imports'

const dppMembers = ref([])  // DPP members from admin/dpp
const wilayahList = ref([]) // Wilayah master data
const lingkunganFromDB = ref([])  // Lingkungan from lingkungan table (for KK/jiwa data)
const lingkunganList = ref([])  // Merged: lingkungan data + DPP ketua info
const wilayahOptions = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterWilayah = ref('all')
const viewMode = ref('grouped') // 'grouped' or 'list'

const showModal = ref(false)
const modalMode = ref('create')
const formData = ref({})

const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

// Bulk Selection & Edit
const bulkSelectionMode = ref(false)
const selectedLingkungan = ref([])
const showBulkEditModal = ref(false)
const bulkEditData = ref({})

const toast = ref({
    show: false,
    message: '',
    type: 'success'
})

const emptyForm = {
    no: null,
    nama: '',
    wilayah_id: null,
    wilayah_text: '',
    ketua: '',
    telp: '',
    no_hp_pengurus: '',
    email: '',
    alamat: '',
    jumlah_kk: 0,
    jumlah_jiwa: 0,
    color: '#3B82F6',
    keterangan: '',
    display_order: 0,
    is_visible: true
}

const filteredLingkungan = computed(() => {
    let result = lingkunganList.value

    // Filter by wilayah
    if (filterWilayah.value !== 'all') {
        result = result.filter(l => l.wilayah_id == filterWilayah.value)
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(l =>
            l.nama.toLowerCase().includes(query) ||
            (l.ketua && l.ketua.toLowerCase().includes(query)) ||
            (l.wilayah_nama && l.wilayah_nama.toLowerCase().includes(query)) ||
            (l.wilayah_text && l.wilayah_text.toLowerCase().includes(query)) ||
            l.no.toString().includes(query)
        )
    }

    return result
})

// Grouped by Wilayah
const lingkunganGroupedByWilayah = computed(() => {
    const groups = {}

    filteredLingkungan.value.forEach(ling => {
        const wilayahName = ling.wilayah_nama || ling.wilayah_text || 'Tanpa Wilayah'
        
        if (!groups[wilayahName]) {
            groups[wilayahName] = {
                wilayah: wilayahName,
                lingkungan: [],
                totalKK: 0,
                totalJiwa: 0
            }
        }

        groups[wilayahName].lingkungan.push(ling)
        groups[wilayahName].totalKK += ling.jumlah_kk || 0
        groups[wilayahName].totalJiwa += ling.jumlah_jiwa || 0
    })

    // Sort lingkungan within each group by no
    Object.values(groups).forEach(group => {
        group.lingkungan.sort((a, b) => a.no - b.no)
    })

    // Convert to array and sort by wilayah name
    return Object.values(groups).sort((a, b) => 
        a.wilayah.localeCompare(b.wilayah)
    )
})

// Pengurus Wilayah (Ketua Wilayah from DPP)
const pengurusWilayah = computed(() => {
    return dppMembers.value
        .filter(m => m.position_category === 'ketua_wilayah')
        .sort((a, b) => {
            const nameA = a.wilayah_name || ''
            const nameB = b.wilayah_name || ''
            return nameA.localeCompare(nameB)
        })
})

const stats = computed(() => {
    const visible = lingkunganList.value.filter(l => l.is_visible)
    const totalKK = visible.reduce((sum, l) => sum + (l.jumlah_kk || 0), 0)
    const totalJiwa = visible.reduce((sum, l) => sum + (l.jumlah_jiwa || 0), 0)
    const ketuaLingkungan = visible.filter(l => l.has_dpp_ketua)

    return {
        totalLingkungan: visible.length,
        totalKK,
        totalJiwa,
        avgKKPerLingkungan: ketuaLingkungan.length  // Show number of lingkungan with DPP ketua
    }
})

// Check if all selectable lingkungan are selected
const isAllSelected = computed(() => {
    const selectableLingkungan = filteredLingkungan.value.filter(l => l.source !== 'database')
    return selectableLingkungan.length > 0 && selectedLingkungan.value.length === selectableLingkungan.length
})

const showToast = (message, type = 'success', duration = 3000) => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, duration)
}

// Helper: Get Pengurus Wilayah by Wilayah Name
const getPengurusWilayah = (wilayahName) => {
    return dppMembers.value.find(m => 
        m.position_category === 'ketua_wilayah' && 
        m.wilayah_name === wilayahName
    )
}

const fetchLingkunganFromDB = async () => {
    try {
        const response = await $fetch('/api/admin/lingkungan')
        lingkunganFromDB.value = response.data || []
        console.log('[Fetch DB] Loaded lingkungan from database:', lingkunganFromDB.value.length)
        // Log which ones have no_hp_pengurus
        const withPhone = lingkunganFromDB.value.filter(l => l.no_hp_pengurus)
        console.log('[Fetch DB] Lingkungan with no_hp_pengurus:', withPhone.length, withPhone.map(l => ({ no: l.no, wilayah: l.wilayah_nama, phone: l.no_hp_pengurus })))
    } catch (err) {
        console.error('Error fetching lingkungan:', err)
        showToast('Gagal memuat data lingkungan', 'error')
    }
}

const fetchDPPMembers = async () => {
    try {
        const response = await $fetch('/api/admin/dpp')
        dppMembers.value = response.data || []
    } catch (err) {
        console.error('Error fetching DPP members:', err)
        showToast('Gagal memuat data DPP', 'error')
    }
}

const mergeLingkunganWithDPP = () => {
    loading.value = true
    try {
        // Create a map of DPP ketua by wilayah and lingkungan number
        const dppKetuaMap = {}
        const dppLingkunganSet = new Set()
        
        dppMembers.value.forEach(member => {
            if (member.position_category === 'ketua_lingkungan') {
                const key = `${member.wilayah_name}-${member.lingkungan_number}`
                dppKetuaMap[key] = member
                dppLingkunganSet.add(key)
            }
        })

        // Start with empty list
        const mergedList = []

        // Step 1: Add all lingkungan from database (if any)
        if (lingkunganFromDB.value && lingkunganFromDB.value.length > 0) {
            lingkunganFromDB.value.forEach(ling => {
                const wilayahName = ling.wilayah_nama || ling.wilayah_text
                const key = `${wilayahName}-${ling.no}`
                const dppKetua = dppKetuaMap[key]

                // Mark this combination as processed
                if (dppKetua) {
                    dppLingkunganSet.delete(key)
                }

                const mergedItem = {
                    ...ling,
                    // Override ketua info with DPP data if available
                    ketua: dppKetua ? dppKetua.name : (ling.ketua || '-'),
                    telp: dppKetua ? (dppKetua.telp || '') : (ling.telp || ''),
                    email: dppKetua ? (dppKetua.email || '') : (ling.email || ''),
                    // IMPORTANT: Preserve no_hp_pengurus from database
                    no_hp_pengurus: ling.no_hp_pengurus || '',
                    dpp_member_id: dppKetua ? dppKetua.id : null,
                    has_dpp_ketua: !!dppKetua,
                    ketua_is_active: dppKetua ? dppKetua.is_active : null,
                    source: 'database'  // Data from lingkungan table
                }
                
                // Debug log for items with no_hp_pengurus
                if (ling.no_hp_pengurus) {
                    console.log('[Merge] DB item with phone:', { no: ling.no, wilayah: wilayahName, phone: ling.no_hp_pengurus })
                }
                
                mergedList.push(mergedItem)
            })
        }

        // Step 2: Add remaining DPP lingkungan not yet in database
        dppLingkunganSet.forEach(key => {
            const member = dppKetuaMap[key]
            if (member) {
                // Normalize wilayah name for matching (case-insensitive, trim spaces)
                const normalizeWilayahName = (name) => {
                    return name.toLowerCase()
                        .replace(/\s+/g, ' ')
                        .trim()
                        // Handle common typos
                        .replace('fransikus', 'fransiskus')
                        .replace('teresia', 'theresia')
                }
                
                const normalizedMemberWilayah = normalizeWilayahName(member.wilayah_name)
                const wilayahData = wilayahList.value.find(w => 
                    normalizeWilayahName(w.nama) === normalizedMemberWilayah
                )
                
                const lingNo = parseInt(member.lingkungan_number)
                
                mergedList.push({
                    id: member.id,
                    no: lingNo,
                    nama: `Lingkungan ${member.wilayah_name} ${lingNo}`,
                    wilayah_id: wilayahData ? wilayahData.id : null,
                    wilayah_nama: member.wilayah_name,
                    wilayah_text: member.wilayah_name,
                    ketua: member.name,
                    telp: member.telp || '',
                    no_hp_pengurus: '',
                    email: member.email || '',
                    alamat: member.address || '',
                    jumlah_kk: 0,
                    jumlah_jiwa: 0,
                    color: '#3B82F6',
                    keterangan: member.position || '',
                    display_order: lingNo,
                    is_visible: member.is_active ? 1 : 0,
                    dpp_member_id: member.id,
                    has_dpp_ketua: true,
                    ketua_is_active: member.is_active,
                    source: 'dpp'  // Data built from DPP members
                })
            }
        })

        lingkunganList.value = mergedList

        // Sort by wilayah and lingkungan number
        lingkunganList.value.sort((a, b) => {
            const wilayahCompare = (a.wilayah_nama || '').localeCompare(b.wilayah_nama || '')
            if (wilayahCompare !== 0) return wilayahCompare
            return a.no - b.no
        })
        
        // Final debug: Log items with no_hp_pengurus in merged result
        const finalWithPhone = lingkunganList.value.filter(l => l.no_hp_pengurus)
        console.log('[Merge Result] Total lingkungan with no_hp_pengurus:', finalWithPhone.length)
        if (finalWithPhone.length > 0) {
            console.table(finalWithPhone.map(l => ({ 
                no: l.no, 
                nama: l.nama, 
                wilayah: l.wilayah_nama, 
                phone: l.no_hp_pengurus,
                source: l.source 
            })))
        }
    } catch (err) {
        console.error('Error merging lingkungan with DPP:', err)
        showToast('Gagal memproses data', 'error')
    } finally {
        loading.value = false
    }
}

const fetchWilayah = async () => {
    try {
        const response = await $fetch('/api/admin/wilayah')
        wilayahList.value = response.data || []
        wilayahOptions.value = response.data.filter(w => w.is_visible)
    } catch (err) {
        console.error('Error fetching wilayah:', err)
    }
}

const openCreateModal = () => {
    formData.value = { ...emptyForm }
    modalMode.value = 'create'
    showModal.value = true
}

const editLingkungan = (lingkungan) => {
    formData.value = { ...lingkungan }
    modalMode.value = 'edit'
    showModal.value = true
}

// Full edit for DPP data
const editLingkunganLimited = (lingkungan) => {
    formData.value = { ...lingkungan }
    modalMode.value = 'edit-limited'
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formData.value = { ...emptyForm }
}

const saveLingkungan = async () => {
    const isEditLimited = modalMode.value === 'edit-limited'
    const isDppSource = formData.value.source === 'dpp'
    
    // Check if DB record exists — for edit-limited AND for source='dpp' items
    let existingDbRecord = null
    if ((isEditLimited || isDppSource) && formData.value.no) {
        const searchNo = parseInt(formData.value.no)
        const searchWilayah = formData.value.wilayah_text || formData.value.wilayah_nama
        
        existingDbRecord = lingkunganFromDB.value.find(l => {
            const matchNo = parseInt(l.no) === searchNo
            const matchWilayah = (l.wilayah_text === searchWilayah) || (l.wilayah_nama === searchWilayah)
            return matchNo && matchWilayah
        })
        
        console.log(`[DB Check] source=${formData.value.source}, Searching for no=${searchNo} + wilayah='${searchWilayah}', found:`, existingDbRecord ? 'YES (id=' + existingDbRecord.id + ')' : 'NO')
    }
    
    // Check if record exists in database (not just from DPP)
    const isEdit = (modalMode.value === 'edit' || modalMode.value === 'edit-limited') && 
                    !!(formData.value.source === 'database' || existingDbRecord)
    
    console.log(`[Save Mode] modalMode=${modalMode.value}, isEditLimited=${isEditLimited}, isEdit=${isEdit}, existingDbRecord=${!!existingDbRecord}`)
    console.log(`[Form Data] no=${formData.value.no}, nama='${formData.value.nama}', wilayah='${formData.value.wilayah_text || formData.value.wilayah_nama}', no_hp='${formData.value.no_hp_pengurus}'`)

    // Validation - skip no and nama validation for edit-limited mode
    if (!isEditLimited) {
        if (!formData.value.no) {
            showToast('Nomor lingkungan harus diisi!', 'error')
            return
        }
        if (!formData.value.nama) {
            showToast('Nama lingkungan harus diisi!', 'error')
            return
        }
    }

    let lingkunganData = {}

    // If limited edit mode (for DPP data), include core fields + editable fields
    if (isEditLimited) {
        // For DPP data, check if we should update existing or create new
        if (existingDbRecord) {
            // Update existing record - only send editable fields
            lingkunganData.jumlah_kk = parseInt(formData.value.jumlah_kk) || 0
            lingkunganData.jumlah_jiwa = parseInt(formData.value.jumlah_jiwa) || 0
            lingkunganData.no_hp_pengurus = formData.value.no_hp_pengurus?.trim() || null
            console.log('[Edit-Limited] UPDATE mode - sending only editable fields')
        } else {
            // Create new DB record with core fields from DPP
            lingkunganData.no = parseInt(formData.value.no)
            lingkunganData.nama = formData.value.nama?.trim()
            
            // Validation for create mode
            if (!lingkunganData.no || !lingkunganData.nama) {
                showToast('Data tidak lengkap: Nomor dan Nama harus diisi!', 'error')
                console.error('[Edit-Limited] CREATE failed - missing no or nama:', { no: lingkunganData.no, nama: lingkunganData.nama })
                return
            }
            
            lingkunganData.wilayah_id = formData.value.wilayah_id || null
            lingkunganData.wilayah_text = formData.value.wilayah_text?.trim() || null
            lingkunganData.ketua = formData.value.ketua?.trim() || null
            lingkunganData.telp = formData.value.telp?.trim() || null
            // Editable fields
            lingkunganData.jumlah_kk = parseInt(formData.value.jumlah_kk) || 0
            lingkunganData.jumlah_jiwa = parseInt(formData.value.jumlah_jiwa) || 0
            lingkunganData.no_hp_pengurus = formData.value.no_hp_pengurus?.trim() || null
            // Defaults for other fields
            lingkunganData.color = formData.value.color || '#3B82F6'
            lingkunganData.is_visible = 1
            lingkunganData.display_order = parseInt(formData.value.no) || 0
            console.log('[Edit-Limited] CREATE mode - sending full data:', lingkunganData)
        }
    } else {
        // Full data for create or normal edit
        lingkunganData.no = parseInt(formData.value.no)
        lingkunganData.nama = formData.value.nama?.trim()
        lingkunganData.wilayah_id = formData.value.wilayah_id || null
        lingkunganData.wilayah_text = formData.value.wilayah_text?.trim() || null
        lingkunganData.ketua = formData.value.ketua?.trim() || null
        lingkunganData.telp = formData.value.telp?.trim() || null
        lingkunganData.no_hp_pengurus = formData.value.no_hp_pengurus?.trim() || null
        lingkunganData.email = formData.value.email?.trim() || null
        lingkunganData.alamat = formData.value.alamat?.trim() || null
        lingkunganData.jumlah_kk = parseInt(formData.value.jumlah_kk) || 0
        lingkunganData.jumlah_jiwa = parseInt(formData.value.jumlah_jiwa) || 0
        lingkunganData.color = formData.value.color || '#3B82F6'
        lingkunganData.keterangan = formData.value.keterangan?.trim() || null
        lingkunganData.display_order = parseInt(formData.value.display_order) || 0
        lingkunganData.is_visible = formData.value.is_visible ? 1 : 0
    }

    // Auto-calculate jumlah_jiwa if not provided (but not for edit-limited mode)
    if (!isEditLimited && !lingkunganData.jumlah_jiwa && lingkunganData.jumlah_kk) {
        lingkunganData.jumlah_jiwa = lingkunganData.jumlah_kk * 3
    }

    // Determine the ID to edit
    const editId = isEdit ? (existingDbRecord?.id || formData.value.id) : null

    // Save values for later reference BEFORE closing modal (formData is cleared on close)
    const savedNo = formData.value.no
    const savedWilayah = formData.value.wilayah_text || formData.value.wilayah_nama
    const toastName = lingkunganData.nama || formData.value.nama || 'Data'
    // DPP sync targets (captured before modal closes)
    const savedDppMemberId = formData.value.dpp_member_id
    const savedHasDppKetua = formData.value.has_dpp_ketua
    const savedKetua = formData.value.ketua
    const savedWilayahName = lingkunganData.wilayah_text || formData.value.wilayah_nama || formData.value.wilayah_text
    const savedLingkunganNo = parseInt(formData.value.no)
    // For removing original dpp item after POST success
    const dppSourceItemId = isDppSource ? formData.value.id : null

    // Close modal immediately BEFORE optimistic update
    closeModal()

    // Optimistic update for edit-limited mode (only KK / jiwa / HP fields)
    if (isEditLimited) {
        const targetId = isEdit ? editId : dppSourceItemId
        if (targetId) {
            const index = lingkunganList.value.findIndex(l => l.id === targetId)
            if (index !== -1) {
                lingkunganList.value.splice(index, 1, {
                    ...lingkunganList.value[index],
                    jumlah_kk: lingkunganData.jumlah_kk ?? lingkunganList.value[index].jumlah_kk,
                    jumlah_jiwa: lingkunganData.jumlah_jiwa ?? lingkunganList.value[index].jumlah_jiwa,
                    no_hp_pengurus: lingkunganData.no_hp_pengurus ?? lingkunganList.value[index].no_hp_pengurus,
                    updated_at: new Date().toISOString()
                })
            }
        }
    }

    // Optimistic update with proper reactivity (for non-edit-limited)
    if (!isEditLimited) {
        if (isEdit) {
            // Update existing item optimistically using splice for reactivity
            const index = lingkunganList.value.findIndex(l => l.id === editId)
            if (index !== -1) {
                const optimisticData = {
                    ...lingkunganList.value[index],
                    ...lingkunganData,
                    id: editId,
                    updated_at: new Date().toISOString()
                }
                lingkunganList.value.splice(index, 1, optimisticData) // Use splice for reactivity
            }
        } else {
            // Add new item optimistically
            const tempId = `temp_${Date.now()}`
            const optimisticData = {
                id: tempId,
                ...lingkunganData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            if (isDppSource && dppSourceItemId) {
                // Replace original dpp item in-place to avoid duplicate
                const dppIdx = lingkunganList.value.findIndex(l => l.id === dppSourceItemId)
                if (dppIdx !== -1) {
                    lingkunganList.value.splice(dppIdx, 1, optimisticData)
                } else {
                    lingkunganList.value.unshift(optimisticData)
                }
            } else {
                lingkunganList.value.unshift(optimisticData)
            }
        }
    }

    try {
        if (isEdit) {
            console.log(`[API] Sending PUT to /api/admin/lingkungan/${editId}`, lingkunganData)
            const response = await $fetch(`/api/admin/lingkungan/${editId}`, {
                method: 'PUT',
                body: lingkunganData
            })
            console.log('[API] PUT Response:', response)
            showToast(`Lingkungan ${toastName} berhasil diperbarui!`)

            // For edit-limited mode, refresh data to properly merge DB + DPP
            if (isEditLimited) {
                console.log('[Edit-Limited] Refreshing data after UPDATE/CREATE')
                await fetchLingkunganFromDB()
                await fetchDPPMembers()
                mergeLingkunganWithDPP()
                console.log('[Edit-Limited] Data refreshed successfully')
                console.log(`[Edit-Limited] Now checking lingkungan no=${savedNo} + wilayah='${savedWilayah}' in final list...`)
                const savedItem = lingkunganList.value.find(l => {
                    const matchNo = parseInt(l.no) === parseInt(savedNo)
                    const matchWilayah = (l.wilayah_text === savedWilayah) || (l.wilayah_nama === savedWilayah)
                    return matchNo && matchWilayah
                })
                if (savedItem) {
                    console.log('[Edit-Limited] ✅ Found in merged list:', {
                        no: savedItem.no,
                        nama: savedItem.nama,
                        wilayah: savedItem.wilayah_nama || savedItem.wilayah_text,
                        no_hp_pengurus: savedItem.no_hp_pengurus,
                        source: savedItem.source
                    })
                } else {
                    console.error('[Edit-Limited] ❌ NOT found in merged list!')
                }
            } else {
                // Update with real server data for normal edit
                if (isDppSource) {
                    // Full refresh for dpp-source items to properly merge DB + DPP
                    await fetchLingkunganFromDB()
                    await fetchDPPMembers()
                    mergeLingkunganWithDPP()
                } else if (response.data) {
                    const index = lingkunganList.value.findIndex(l => l.id === editId)
                    if (index !== -1) {
                        lingkunganList.value.splice(index, 1, response.data)
                    }
                }
            }
        } else {
            console.log('[API] Sending POST to /api/admin/lingkungan', lingkunganData)
            const response = await $fetch('/api/admin/lingkungan', {
                method: 'POST',
                body: lingkunganData
            })
            console.log('[API] POST Response:', response)
            
            const actionText = isEditLimited ? 'berhasil disimpan ke database' : 'berhasil ditambahkan'
            showToast(`Lingkungan ${toastName} ${actionText}!`)

            // For edit-limited mode, refresh data to properly merge DB + DPP
            if (isEditLimited) {
                console.log('[Edit-Limited] Refreshing data after CREATE')
                await fetchLingkunganFromDB()
                await fetchDPPMembers()
                mergeLingkunganWithDPP()
                console.log('[Edit-Limited] Data refreshed successfully')
                console.log(`[Edit-Limited] Now checking lingkungan no=${savedNo} + wilayah='${savedWilayah}' in final list...`)
                const savedItem = lingkunganList.value.find(l => {
                    const matchNo = parseInt(l.no) === parseInt(savedNo)
                    const matchWilayah = (l.wilayah_text === savedWilayah) || (l.wilayah_nama === savedWilayah)
                    return matchNo && matchWilayah
                })
                if (savedItem) {
                    console.log('[Edit-Limited] ✅ Found in merged list:', {
                        no: savedItem.no,
                        nama: savedItem.nama,
                        wilayah: savedItem.wilayah_nama || savedItem.wilayah_text,
                        no_hp_pengurus: savedItem.no_hp_pengurus,
                        source: savedItem.source
                    })
                } else {
                    console.error('[Edit-Limited] ❌ NOT found in merged list!')
                }
            } else {
                // Replace temp ID with real data from server
                if (isDppSource) {
                    // Full refresh for dpp-source items — merge will remove stale dpp item
                    await fetchLingkunganFromDB()
                    await fetchDPPMembers()
                    mergeLingkunganWithDPP()
                } else if (response.data) {
                    const index = lingkunganList.value.findIndex(l => typeof l.id === 'string' && l.id.startsWith('temp_'))
                    if (index !== -1) {
                        lingkunganList.value.splice(index, 1, response.data)
                    }
                }
            }
        }

        // ===== AUTO-SYNC TO DPP =====
        // Jika lingkungan ini punya ketua dari DPP, update data DPP juga
        if (savedHasDppKetua && savedDppMemberId) {
            const existingDppMember = dppMembers.value.find((m) => m.id === savedDppMemberId)
            if (existingDppMember) {
                try {
                    const token = process.client ? sessionStorage.getItem('admin_access_token') : null
                    await $fetch(`/api/admin/dpp/${savedDppMemberId}`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            name: savedKetua || existingDppMember.name,
                            position: existingDppMember.position,
                            position_category: existingDppMember.position_category,
                            wilayah_name: savedWilayahName || existingDppMember.wilayah_name,
                            lingkungan_number: savedLingkunganNo || existingDppMember.lingkungan_number,
                            position_type: existingDppMember.position_type,
                            position_level: existingDppMember.position_level,
                            bidang_name: existingDppMember.bidang_name,
                            seksi_name: existingDppMember.seksi_name,
                            sub_seksi_name: existingDppMember.sub_seksi_name,
                            is_couple: existingDppMember.is_couple,
                            couple_member_id: existingDppMember.couple_member_id,
                            is_ex_officio: existingDppMember.is_ex_officio,
                            display_order: existingDppMember.display_order,
                            period_start_date: existingDppMember.period_start_date,
                            period_end_date: existingDppMember.period_end_date,
                            decree_number: existingDppMember.decree_number,
                            decree_date: existingDppMember.decree_date,
                            notes: existingDppMember.notes,
                            is_active: existingDppMember.is_active
                        }
                    })
                    console.log('[DPP Sync] ✅ DPP member synced from Teritorial')
                    await fetchDPPMembers()
                    mergeLingkunganWithDPP()
                } catch (dppErr) {
                    console.warn('[DPP Sync] ⚠️ Non-blocking sync error:', dppErr)
                }
            }
        }
    } catch (err) {
        console.error('Error saving lingkungan:', err)
        
        // Extract error message from various possible locations
        // Nuxt's createError might put the message in different places
        const errorMessage = err?.response?._data?.message || err?.data?.message || err?.message || err?.statusMessage || 'Unknown error'
        showToast('Gagal: ' + errorMessage, 'error', 6000)

        // Revert optimistic update on error
        await fetchLingkunganFromDB()
        await fetchDPPMembers()
        mergeLingkunganWithDPP()
    }
}

const confirmDelete = (lingkungan) => {
    deleteTarget.value = lingkungan
    showDeleteConfirm.value = true
}

const deleteLingkungan = async () => {
    const deletedItem = { ...deleteTarget.value }
    const deletedIndex = lingkunganList.value.findIndex(l => l.id === deletedItem.id)

    // Store deleted item for potential revert
    const backupItem = deletedIndex !== -1 ? { ...lingkunganList.value[deletedIndex] } : null

    // Close dialog immediately
    showDeleteConfirm.value = false
    deleteTarget.value = null

    // Optimistic delete - remove from UI immediately
    if (deletedIndex !== -1) {
        lingkunganList.value.splice(deletedIndex, 1)
    }

    try {
        await $fetch(`/api/admin/lingkungan/${deletedItem.id}`, {
            method: 'DELETE'
        })
        showToast(`Lingkungan ${deletedItem.nama} berhasil dihapus!`)
    } catch (err) {
        console.error('Error deleting lingkungan:', err)
        
        // Extract error message from various possible locations
        // Nuxt's createError might put the message in different places
        const errorMessage = err?.response?._data?.message || err?.data?.message || err?.message || err?.statusMessage || 'Unknown error'
        showToast('Gagal: ' + errorMessage, 'error', 6000)

        // Revert optimistic delete on error - restore item
        if (backupItem && deletedIndex !== -1) {
            lingkunganList.value.splice(deletedIndex, 0, backupItem)
        }
    }
}

// Bulk Edit Functions
const toggleBulkMode = () => {
    bulkSelectionMode.value = !bulkSelectionMode.value
    if (!bulkSelectionMode.value) {
        // Clear selection when exiting bulk mode
        selectedLingkungan.value = []
    }
}

const toggleSelectAll = (event) => {
    if (event.target.checked) {
        // Select all DPP-sourced lingkungan (exclude database records)
        selectedLingkungan.value = filteredLingkungan.value.filter(l => l.source !== 'database')
    } else {
        selectedLingkungan.value = []
    }
}

const openBulkEditModal = () => {
    // Prepare bulk edit data with current values
    bulkEditData.value = {}
    selectedLingkungan.value.forEach(ling => {
        bulkEditData.value[ling.id] = {
            no_hp_pengurus: ling.no_hp_pengurus || '',
            jumlah_kk: ling.jumlah_kk || 0,
            jumlah_jiwa: ling.jumlah_jiwa || 0
        }
    })
    showBulkEditModal.value = true
}

const closeBulkEditModal = () => {
    showBulkEditModal.value = false
    bulkEditData.value = {}
}

const saveBulkEdit = async () => {
    // Close modal immediately for better UX
    closeBulkEditModal()

    // Show progress toast
    showToast('Menyimpan perubahan...', 'info')

    // Filter only items that have data to save
    const itemsToSave = selectedLingkungan.value.filter(ling => {
        const e = bulkEditData.value[ling.id]
        return e.no_hp_pengurus || e.jumlah_kk > 0 || e.jumlah_jiwa > 0
    })

    // Optimistic update: reflect changes in the list immediately
    for (const ling of itemsToSave) {
        const editData = bulkEditData.value[ling.id]
        const index = lingkunganList.value.findIndex(l => l.id === ling.id)
        if (index !== -1) {
            const updated = { ...lingkunganList.value[index] }
            if (editData.no_hp_pengurus) updated.no_hp_pengurus = editData.no_hp_pengurus.trim()
            if (editData.jumlah_kk > 0) updated.jumlah_kk = editData.jumlah_kk
            if (editData.jumlah_jiwa > 0) updated.jumlah_jiwa = editData.jumlah_jiwa
            lingkunganList.value.splice(index, 1, updated)
        }
    }

    // Fire all API calls in parallel
    const savePromises = itemsToSave.map(async (ling) => {
        const editData = bulkEditData.value[ling.id]
        const lingWilayah = ling.wilayah_text || ling.wilayah_nama
        const existingDbRecord = lingkunganFromDB.value.find(l => {
            const matchNo = parseInt(l.no) === parseInt(ling.no)
            const matchWilayah = (l.wilayah_text === lingWilayah) || (l.wilayah_nama === lingWilayah)
            return matchNo && matchWilayah
        })

        if (existingDbRecord) {
            console.log(`[Bulk Edit] Updating existing record for Ling ${ling.no} + wilayah='${lingWilayah}' (id=${existingDbRecord.id})`)
            const updatePayload = {}
            if (editData.no_hp_pengurus) updatePayload.no_hp_pengurus = editData.no_hp_pengurus.trim()
            if (editData.jumlah_kk > 0) updatePayload.jumlah_kk = editData.jumlah_kk
            if (editData.jumlah_jiwa > 0) updatePayload.jumlah_jiwa = editData.jumlah_jiwa
            return $fetch(`/api/admin/lingkungan/${existingDbRecord.id}`, { method: 'PUT', body: updatePayload })
        } else {
            console.log(`[Bulk Edit] Creating new record for Ling ${ling.no}`)
            return $fetch('/api/admin/lingkungan', {
                method: 'POST',
                body: {
                    no: ling.no,
                    nama: ling.nama,
                    wilayah_id: ling.wilayah_id || null,
                    wilayah_text: ling.wilayah_text || ling.wilayah_nama || null,
                    ketua: ling.ketua || null,
                    telp: ling.telp || null,
                    no_hp_pengurus: editData.no_hp_pengurus?.trim() || null,
                    jumlah_kk: editData.jumlah_kk || 0,
                    jumlah_jiwa: editData.jumlah_jiwa || 0,
                    color: ling.color || '#3B82F6',
                    is_visible: 1
                }
            })
        }
    })

    const results = await Promise.allSettled(savePromises)
    const successCount = results.filter(r => r.status === 'fulfilled').length
    const errorCount = results.filter(r => r.status === 'rejected').length
    const errors = itemsToSave.filter((_, i) => results[i].status === 'rejected').map(l => l.nama)
    results.filter(r => r.status === 'rejected').forEach((r, i) =>
        console.error(`Error saving lingkungan ${itemsToSave[i].nama}:`, r.reason)
    )

    // Refresh data after bulk edit
    await fetchLingkunganFromDB()
    await fetchDPPMembers()
    mergeLingkunganWithDPP()

    // Exit bulk mode and clear selection
    bulkSelectionMode.value = false
    selectedLingkungan.value = []

    // Show result toast
    if (errorCount === 0) {
        showToast(`✅ Berhasil menyimpan ${successCount} lingkungan!`, 'success', 5000)
    } else {
        showToast(`⚠️ Selesai: ${successCount} berhasil, ${errorCount} gagal. Gagal: ${errors.join(', ')}`, 'error', 8000)
    }
}

onMounted(async () => {
    await fetchWilayah()  // Fetch wilayah first
    await Promise.all([fetchLingkunganFromDB(), fetchDPPMembers()])  // Fetch both in parallel
    mergeLingkunganWithDPP()  // Merge the data
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
