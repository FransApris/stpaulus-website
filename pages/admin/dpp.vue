<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 mb-1">Kelola DPP Paroki</h1>
                <p class="text-gray-600">Manajemen data Dewan Pengurus Paroki</p>
            </div>
            <button @click="openCreateModal"
                class="bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Anggota
            </button>
        </div>

        <!-- View Mode Toggle -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700">Tampilan:</label>
                <div class="flex gap-2">
                    <button @click="viewMode = 'grouped'" :class="[
                        'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                        viewMode === 'grouped'
                            ? 'bg-[#882f1d] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]">
                        Per Bidang
                    </button>
                    <button @click="viewMode = 'list'" :class="[
                        'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                        viewMode === 'list'
                            ? 'bg-[#882f1d] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]">
                        Semua (List)
                    </button>
                </div>
            </div>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
                    <input v-model="filters.search" type="text" placeholder="Cari nama anggota..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                    <select v-model="filters.bidang"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Bidang</option>
                        <option value="pengurus_inti">Pengurus Inti</option>
                        <option value="Pembinaan">Pembinaan</option>
                        <option value="Kerasulan Umum">Kerasulan Umum</option>
                        <option value="Kerasulan Khusus">Kerasulan Khusus</option>
                        <option value="Sumber">Sumber</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select v-model="filters.position_category"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Kategori</option>
                        <option value="pengurus_inti">Pengurus Inti</option>
                        <option value="ketua_bidang">Ketua Bidang</option>
                        <option value="ketua_seksi">Ketua Seksi</option>
                        <option value="anggota">Anggota</option>
                        <option value="ketua_wilayah">Ketua Wilayah</option>
                        <option value="ketua_lingkungan">Ketua Lingkungan</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.is_active"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="all">Semua Status</option>
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
                    <select v-model="filters.sort"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                        <option value="display_order">Urutan Tampil</option>
                        <option value="name">Nama</option>
                        <option value="created_at">Tanggal Dibuat</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-[#882f1d] border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-gray-600 mt-3">Memuat data...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {{ error }}
        </div>

        <!-- Grouped View (Per Bidang) -->
        <div v-else-if="viewMode === 'grouped'" class="space-y-6">
            <!-- Pengurus Inti -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="bg-[#882f1d] px-6 py-4 cursor-pointer hover:bg-[#6b2416] transition-colors" @click="toggleSection('pengurus_inti')">
                    <h2 class="text-xl font-bold text-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isSectionCollapsed('pengurus_inti') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Pengurus Inti</span>
                        </div>
                        <div class="flex items-center gap-3" @click.stop>
                            <span class="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                                {{ groupedMembers.pengurus_inti?.length || 0 }} anggota
                            </span>
                            <button @click="openCreateForPengurusInti"
                                class="bg-white text-[#882f1d] px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                                title="Tambah Pengurus Inti">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah
                            </button>
                        </div>
                    </h2>
                </div>
                <div v-if="!isSectionCollapsed('pengurus_inti')">
                <div v-if="groupedMembers.pengurus_inti && groupedMembers.pengurus_inti.length > 0" class="divide-y divide-gray-200">
                    <div v-for="member in groupedMembers.pengurus_inti" :key="member.id"
                        class="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">{{ member.name }}</div>
                            <div class="text-sm text-gray-600">{{ member.position }}</div>
                            <div v-if="member.is_ex_officio" class="text-xs text-[#882f1d] font-semibold mt-1">Ex
                                Officio</div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ member.is_active ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                            <button @click="editMember(member)"
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(member)"
                                class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="px-6 py-8 text-center text-gray-500">
                    Tidak ada anggota
                </div>
                </div>
            </div>

            <!-- Bidang-bidang -->
            <div v-for="bidang in bidangList" :key="bidang" class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="bg-indigo-600 px-6 py-4 cursor-pointer hover:bg-indigo-700 transition-colors" @click="toggleSection(bidang)">
                    <h2 class="text-xl font-bold text-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isSectionCollapsed(bidang) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Bidang {{ bidang }}</span>
                        </div>
                        <div class="flex items-center gap-3" @click.stop>
                            <span class="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                                {{ groupedMembers[bidang]?.length || 0 }} anggota
                            </span>
                            <button @click="openCreateForBidang(bidang)"
                                class="bg-white text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                                :title="`Tambah Anggota Bidang ${bidang}`">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah
                            </button>
                        </div>
                    </h2>
                </div>
                <div v-if="!isSectionCollapsed(bidang)">
                <div v-if="groupedMembers[bidang] && groupedMembers[bidang].length > 0" class="divide-y divide-gray-200">
                    <div v-for="member in groupedMembers[bidang]" :key="member.id"
                        class="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">{{ member.name }}</div>
                            <div class="text-sm text-gray-600">{{ member.position }}</div>
                            <div v-if="member.seksi_name" class="text-xs text-gray-500 mt-1">
                                Seksi: {{ member.seksi_name }}
                                <span v-if="member.sub_seksi_name"> • {{ member.sub_seksi_name }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ member.is_active ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                            <button @click="editMember(member)"
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(member)"
                                class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="px-6 py-8 text-center text-gray-500">
                    Tidak ada anggota
                </div>
                </div>
            </div>

            <!-- Ketua Wilayah & Lingkungan -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="bg-teal-600 px-6 py-4 cursor-pointer hover:bg-teal-700 transition-colors" @click="toggleSection('wilayah_lingkungan')">
                    <h2 class="text-xl font-bold text-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isSectionCollapsed('wilayah_lingkungan') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Ketua Wilayah & Lingkungan</span>
                        </div>
                        <div class="flex items-center gap-3" @click.stop>
                            <span class="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                                {{ groupedMembers.ketua_wilayah?.length || 0 }} anggota
                            </span>
                            <div class="flex gap-2">
                                <button @click="openCreateForKetuaWilayah"
                                    class="bg-white text-teal-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                                    title="Tambah Ketua Wilayah">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ketua Wilayah
                                </button>
                                <button @click="openCreateForKetuaLingkunganDefault"
                                    class="bg-white text-teal-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                                    title="Tambah Ketua Lingkungan">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ketua Lingkungan
                                </button>
                            </div>
                        </div>
                    </h2>
                </div>
                <div v-if="!isSectionCollapsed('wilayah_lingkungan')">
                <div v-if="wilayahGroupsAdmin.length > 0" class="divide-y divide-gray-200">
                    <!-- Loop per Wilayah -->
                    <div v-for="wilayahGroup in wilayahGroupsAdmin" :key="wilayahGroup.name" 
                        class="border-b border-gray-200 last:border-b-0">
                        
                        <!-- Wilayah Header -->
                        <div class="px-6 py-3 bg-teal-50 border-l-4 border-teal-600 cursor-pointer hover:bg-teal-100 transition-colors" @click="toggleWilayah(wilayahGroup.name)">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <svg class="w-4 h-4 text-teal-600 transition-transform duration-200" :class="{ 'rotate-180': isWilayahCollapsed(wilayahGroup.name) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    <div class="font-bold text-teal-900 text-lg">Wilayah {{ wilayahGroup.name }}</div>
                                </div>
                                <div class="flex items-center gap-3 text-sm text-teal-700">
                                    <span>{{ wilayahGroup.lingkungan.length }} Lingkungan</span>
                                </div>
                            </div>
                        </div>

                        <!-- Wilayah Content (Collapsible) -->
                        <div v-if="!isWilayahCollapsed(wilayahGroup.name)">
                        <!-- Ketua Wilayah -->
                        <div v-if="wilayahGroup.ketua" class="px-6 py-3 bg-white border-l-4 border-teal-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <svg class="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                    </svg>
                                    <div>
                                        <div class="text-xs text-gray-500 font-medium">Ketua Wilayah</div>
                                        <div class="font-semibold text-gray-900">{{ wilayahGroup.ketua.name }}</div>
                                        <div class="text-xs text-gray-600 mt-0.5">{{ wilayahGroup.ketua.position }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span :class="[
                                        'px-2 py-1 text-xs font-semibold rounded-full',
                                        wilayahGroup.ketua.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    ]">
                                        {{ wilayahGroup.ketua.is_active ? 'Aktif' : 'Tidak Aktif' }}
                                    </span>
                                    <button @click="editMember(wilayahGroup.ketua)"
                                        class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="confirmDelete(wilayahGroup.ketua)"
                                        class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="px-6 py-2 bg-amber-50 border-l-4 border-amber-400">
                            <div class="flex items-center gap-2 text-amber-800 text-sm">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <span>Belum ada Ketua Wilayah - Silakan tambah dari tombol "Ketua Wilayah" di atas</span>
                            </div>
                        </div>

                        <!-- List Lingkungan (Ketua Lingkungan from DPP) -->
                        <div v-if="wilayahGroup.lingkungan.length > 0" class="px-6 py-4 bg-gray-50">
                            <div class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Ketua Lingkungan ({{ wilayahGroup.lingkungan.length }})
                            </div>
                            <div class="space-y-2">
                                <div v-for="ling in wilayahGroup.lingkungan" :key="ling.id"
                                    class="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                                    <div class="flex items-center gap-4">
                                        <svg class="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                        <div>
                                            <div class="font-medium text-gray-900">{{ ling.name }}</div>
                                            <div class="text-xs text-gray-600 mt-0.5">{{ ling.position }}</div>
                                            <div class="text-xs text-gray-500 mt-0.5">Lingkungan {{ ling.lingkungan_number }}</div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex items-center gap-2">
                                        <span :class="[
                                            'px-2 py-1 text-xs font-semibold rounded-full',
                                            ling.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        ]">
                                            {{ ling.is_active ? 'Aktif' : 'Tidak Aktif' }}
                                        </span>
                                        <button @click="editMember(ling)"
                                            class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button @click="confirmDelete(ling)"
                                            class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="px-6 py-4 bg-gray-50 text-center text-gray-500 text-sm">
                            Belum ada Ketua Lingkungan - Silakan tambah dari tombol "Ketua Lingkungan" di atas
                        </div>
                        </div>
                    </div>
                </div>
                <div v-else class="px-6 py-8 text-center text-gray-500">
                    Tidak ada anggota
                </div>
                </div>
            </div>
        </div>

        <!-- DPP Table (List View) -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jabatan
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa
                            Jabatan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Urutan</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="member in paginatedDisplayedMembers" :key="member.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                            <div v-if="member.is_ex_officio" class="text-xs text-[#882f1d] font-semibold">Ex Officio
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                getPositionTypeClass(member.position_type)
                            ]">
                                {{ getPositionTypeName(member.position_type) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ member.position_level || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div v-if="member.period_start_date">
                                {{ formatDate(member.period_start_date) }} -
                                {{ member.period_end_date ? formatDate(member.period_end_date) : 'Sekarang' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs font-semibold rounded-full',
                                member.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            ]">
                                {{ member.is_active ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ member.display_order }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button @click="editMember(member)"
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1" title="Edit">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="confirmDelete(member)"
                                class="text-red-600 hover:text-red-800 transition-colors p-1" title="Hapus">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="displayedMembers.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Data</h3>
                <p class="text-gray-500 mb-4">Belum ada data anggota DPP yang ditambahkan.</p>
                <button @click="openCreateModal"
                    class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-4 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Anggota Pertama
                </button>
            </div>

            <div v-if="displayedMembers.length > pageLimit" class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p class="text-sm text-gray-600">
                    Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}-
                    {{ Math.min(currentPage * pageLimit, displayedMembers.length) }}
                    dari {{ displayedMembers.length }} anggota
                </p>
                <div class="flex items-center gap-2">
                    <button
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sebelumnya
                    </button>
                    <button
                        v-for="page in visiblePages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="[
                            'px-3 py-1.5 rounded-lg border text-sm',
                            currentPage === page
                                ? 'bg-[#882f1d] text-white border-[#882f1d]'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        ]"
                    >
                        {{ page }}
                    </button>
                    <button
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage >= totalPages"
                        class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Teleport to="body">
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div
                        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ modalMode === 'create' ? 'Tambah Anggota DPP' : 'Edit Anggota DPP' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveMember" class="p-6 space-y-4">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.name" type="text" required placeholder="Nicolaus Yosep Smith"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                        </div>

                        <!-- Position -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Jabatan Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.position" type="text" required placeholder="Otomatis terisi..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            <p class="text-xs text-blue-600 mt-1">{{ getPositionPreview() }}</p>
                        </div>

                        <!-- Position Category -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Kategori Jabatan <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.position_category" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                <option value="pengurus_inti">Pengurus Inti</option>
                                <option value="ketua_bidang">Ketua Bidang</option>
                                <option value="ketua_seksi">Ketua Seksi</option>
                                <option value="anggota">Anggota Bidang/Seksi</option>
                                <option value="ketua_wilayah">Ketua Wilayah</option>
                                <option value="ketua_lingkungan">Ketua Lingkungan</option>
                            </select>
                        </div>

                        <!-- Bidang Fields (shown for ketua_bidang, ketua_seksi, anggota) -->
                        <div v-if="['ketua_bidang', 'ketua_seksi', 'anggota'].includes(formData.position_category)"
                            class="space-y-4 p-4 bg-blue-50 rounded-lg">
                            <h3 class="text-sm font-semibold text-blue-900">Informasi Bidang</h3>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Bidang <span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.bidang_name" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="">Pilih Bidang</option>
                                    <option value="Pembinaan">Pembinaan</option>
                                    <option value="Kerasulan Umum">Kerasulan Umum</option>
                                    <option value="Kerasulan Khusus">Kerasulan Khusus</option>
                                    <option value="Sumber">Sumber</option>
                                </select>
                            </div>
                            <div v-if="formData.position_category === 'ketua_seksi' || formData.position_category === 'anggota'">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Seksi</label>
                                <input v-model="formData.seksi_name" type="text" placeholder="Contoh: Liturgi"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div v-if="formData.position_category === 'anggota'">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sub Seksi</label>
                                <input v-model="formData.sub_seksi_name" type="text" placeholder="Contoh: Koor"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Wilayah Fields (shown for ketua_wilayah, ketua_lingkungan) -->
                        <div v-if="['ketua_wilayah', 'ketua_lingkungan'].includes(formData.position_category)"
                            class="space-y-4 p-4 bg-indigo-50 rounded-lg">
                            <h3 class="text-sm font-semibold text-indigo-900">Informasi Wilayah/Lingkungan</h3>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Wilayah <span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.wilayah_name" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="">Pilih Wilayah</option>
                                    <option v-for="wilayah in wilayahList" :key="wilayah.id" :value="wilayah.nama">
                                        {{ wilayah.nama }}
                                    </option>
                                </select>
                            </div>
                            <div v-if="formData.position_category === 'ketua_lingkungan'">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Lingkungan <span class="text-red-500">*</span>
                                </label>
                                <select v-if="filteredLingkunganByWilayah.length > 0"
                                    v-model.number="formData.lingkungan_number" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="" disabled>Pilih Lingkungan</option>
                                    <option v-for="ling in filteredLingkunganByWilayah" :key="ling.id" :value="parseInt(ling.no)">
                                        Lingkungan {{ ling.no }} - {{ ling.nama }}
                                    </option>
                                </select>
                                <div v-else class="flex gap-2">
                                    <input v-model.number="formData.lingkungan_number" type="number" required
                                        placeholder="Nomor Lingkungan..."
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                    <p class="text-xs text-gray-500 mt-1">Pilih wilayah dulu untuk melihat daftar lingkungan</p>
                                </div>
                            </div>
                        </div>

                        <!-- Position Type & Level -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Jabatan <span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.position_type" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent">
                                    <option value="ketua">Ketua</option>
                                    <option value="wakil_ketua">Wakil Ketua</option>
                                    <option value="sekretaris">Sekretaris</option>
                                    <option value="bendahara">Bendahara</option>
                                    <option value="anggota">Anggota</option>
                                    <option value="ketua_wilayah">Ketua Wilayah</option>
                                    <option value="ketua_lingkungan">Ketua Lingkungan</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Level (optional)</label>
                                <input v-model="formData.position_level" type="text" placeholder="I, II, III"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                <p class="text-xs text-gray-500 mt-1">Untuk Sekretaris/Bendahara I, II, III</p>
                            </div>
                        </div>

                        <!-- Ex Officio & Display Order -->
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="flex items-center gap-2">
                                        <input v-model="formData.is_ex_officio" type="checkbox"
                                            class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                                        <span class="text-sm font-medium text-gray-700">Ex Officio (Jabatan Otomatis)</span>
                                    </label>
                                    <p class="text-xs text-gray-500 mt-1">Contoh: Romo sebagai Ketua/Wakil</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil <span
                                            class="text-red-500">*</span></label>
                                    <input v-model.number="formData.display_order" type="number" required placeholder="0" min="0"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                                    <p class="text-xs text-gray-500 mt-1">{{ getDisplayOrderHint() }}</p>
                                </div>
                            </div>
                            <div v-if="modalMode === 'create'" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <label class="flex items-start gap-2 cursor-pointer">
                                    <input v-model="formData.auto_shift_order" type="checkbox"
                                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5" />
                                    <div class="flex-1">
                                        <span class="text-sm font-medium text-blue-900">Sisipkan & Geser Urutan Otomatis</span>
                                        <p class="text-xs text-blue-700 mt-1">
                                            Aktifkan untuk menyisipkan data di urutan {{ formData.display_order }}. 
                                            Semua data dengan urutan ≥ {{ formData.display_order }} akan digeser +1 otomatis.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Period Dates -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input v-model="formData.period_start_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input v-model="formData.period_end_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Decree Info -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nomor SK</label>
                                <input v-model="formData.decree_number" type="text" placeholder="465/G.113/V/2025"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal SK</label>
                                <input v-model="formData.decree_date" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Notes -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea v-model="formData.notes" rows="3" placeholder="Catatan tambahan..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="flex items-center gap-2">
                                <input v-model="formData.is_active" type="checkbox"
                                    class="w-4 h-4 text-[#882f1d] border-gray-300 rounded focus:ring-[#882f1d]" />
                                <span class="text-sm font-medium text-gray-700">Status Aktif</span>
                            </label>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit" :disabled="saving"
                                class="px-4 py-2 bg-[#882f1d] text-white rounded-lg hover:bg-[#6b2416] transition-colors disabled:opacity-50">
                                {{ saving ? 'Menyimpan...' : (modalMode === 'create' ? 'Tambah' : 'Simpan') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <ConfirmDialog :show="showDeleteConfirm" title="Hapus Anggota DPP?"
            :message="`Apakah Anda yakin ingin menghapus ${memberToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`"
            confirmText="Hapus" @confirm="deleteMember" @cancel="showDeleteConfirm = false" />

        <!-- Toast Notification -->
        <Transition name="slide-up">
            <div v-if="showToast"
                class="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
                :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
                <svg v-if="toastType === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>{{ toastMessage }}</span>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from '#imports'

definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

// State
const members = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const showDeleteConfirm = ref(false)
const memberToDelete = ref<any>(null)
const viewMode = ref<'grouped' | 'list'>('grouped')
const currentPage = ref(1)
const pageLimit = 10

// Collapse/Expand state for sections
const collapsedSections = ref<Record<string, boolean>>({
    pengurus_inti: false,
    wilayah_lingkungan: false
})

// Collapse/Expand state for individual wilayah
const collapsedWilayah = ref<Record<string, boolean>>({})

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey]
}

const isSectionCollapsed = (sectionKey: string) => {
    return collapsedSections.value[sectionKey] || false
}

const toggleWilayah = (wilayahName: string) => {
    collapsedWilayah.value[wilayahName] = !collapsedWilayah.value[wilayahName]
}

const isWilayahCollapsed = (wilayahName: string) => {
    return collapsedWilayah.value[wilayahName] || false
}

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Wilayah data from API
const wilayahList = ref<any[]>([])

// Lingkungan data from API
const lingkunganList = ref<any[]>([])

// Filters
const filters = ref({
    search: '',
    bidang: 'all',
    position_category: 'all',
    position_type: 'all',
    is_active: 'all',
    sort: 'display_order'
})

// Form Data
const formData = ref({
    id: null as number | null,
    name: '',
    position: '',
    position_category: 'anggota',
    position_type: 'anggota',
    position_level: '',
    bidang_name: '',
    seksi_name: '',
    sub_seksi_name: '',
    wilayah_name: '',
    lingkungan_number: null as number | null,
    is_ex_officio: false,
    display_order: 0,
    auto_shift_order: false,
    period_start_date: '',
    period_end_date: '',
    decree_number: '',
    decree_date: '',
    notes: '',
    is_active: true
})

// Computed - Filtered Members
const filteredMembers = computed(() => {
    let result = [...members.value]

    // Search filter
    if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        result = result.filter(m =>
            m.name.toLowerCase().includes(search) ||
            m.position.toLowerCase().includes(search) ||
            (m.bidang_name && m.bidang_name.toLowerCase().includes(search)) ||
            (m.seksi_name && m.seksi_name.toLowerCase().includes(search))
        )
    }

    // Bidang filter
    if (filters.value.bidang !== 'all') {
        if (filters.value.bidang === 'pengurus_inti') {
            result = result.filter(m => m.position_category === 'pengurus_inti')
        } else {
            result = result.filter(m => m.bidang_name === filters.value.bidang)
        }
    }

    // Position category filter
    if (filters.value.position_category !== 'all') {
        result = result.filter(m => m.position_category === filters.value.position_category)
    }

    // Position type filter
    if (filters.value.position_type !== 'all') {
        result = result.filter(m => m.position_type === filters.value.position_type)
    }

    // Active filter
    if (filters.value.is_active !== 'all') {
        const isActive = filters.value.is_active === 'true'
        result = result.filter(m => m.is_active === isActive)
    }

    // Sort
    result.sort((a, b) => {
        if (filters.value.sort === 'display_order') {
            return (a.display_order || 0) - (b.display_order || 0)
        } else if (filters.value.sort === 'name') {
            return a.name.localeCompare(b.name)
        } else if (filters.value.sort === 'created_at') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
    })

    return result
})

// Computed - displayed members for template
const displayedMembers = computed(() => filteredMembers.value)

const totalPages = computed(() => {
    const pages = Math.ceil(displayedMembers.value.length / pageLimit)
    return pages > 0 ? pages : 1
})

const paginatedDisplayedMembers = computed(() => {
    const start = (currentPage.value - 1) * pageLimit
    return displayedMembers.value.slice(start, start + pageLimit)
})

const visiblePages = computed(() => {
    const pages: number[] = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + 4)

    for (let page = start; page <= end; page++) {
        pages.push(page)
    }

    return pages
})

// Computed - bidang list
const bidangList = computed(() => {
    return ['Pembinaan', 'Kerasulan Umum', 'Kerasulan Khusus', 'Sumber']
})

// Computed - grouped members by bidang
const groupedMembers = computed(() => {
    const grouped: Record<string, any[]> = {
        pengurus_inti: [],
        'Pembinaan': [],
        'Kerasulan Umum': [],
        'Kerasulan Khusus': [],
        'Sumber': [],
        ketua_wilayah: []
    }

    filteredMembers.value.forEach((member: any) => {
        if (member.position_category === 'pengurus_inti') {
            grouped.pengurus_inti?.push(member)
        } else if (member.position_category === 'ketua_wilayah' || member.position_category === 'ketua_lingkungan') {
            grouped.ketua_wilayah?.push(member)
        } else if (member.bidang_name) {
            grouped[member.bidang_name]?.push(member)
        }
    })

    // Sort each group by display_order
    Object.keys(grouped).forEach(key => {
        grouped[key]?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    })

    return grouped
})

// Computed - Group wilayah with their lingkungan
const wilayahGroupsAdmin = computed(() => {
    const wilayahData = groupedMembers.value.ketua_wilayah || []
    const wilayahMap: Record<string, { ketua: any | null, lingkungan: any[] }> = {}

    // Initialize with wilayah from API (sorted by display_order)
    wilayahList.value.forEach((w: any) => {
        wilayahMap[w.nama] = { ketua: null, lingkungan: [] }
    })

    // Group members by wilayah
    wilayahData.forEach((member: any) => {
        const wilayahName = member.wilayah_name
        if (!wilayahName) return

        if (!wilayahMap[wilayahName]) {
            wilayahMap[wilayahName] = { ketua: null, lingkungan: [] }
        }

        if (member.position_category === 'ketua_wilayah') {
            wilayahMap[wilayahName].ketua = member
        } else if (member.position_category === 'ketua_lingkungan') {
            wilayahMap[wilayahName].lingkungan.push(member)
        }
    })

    // Sort lingkungan by lingkungan_number within each wilayah
    Object.keys(wilayahMap).forEach(wilayahName => {
        if (wilayahMap[wilayahName]?.lingkungan) {
            wilayahMap[wilayahName].lingkungan.sort((a, b) => {
            return (parseInt(a.lingkungan_number) || 0) - (parseInt(b.lingkungan_number) || 0)
            })
        }
    })

    // Convert to array and filter out empty wilayah
    return Object.entries(wilayahMap)
        .filter(([_, data]) => data.ketua || data.lingkungan.length > 0)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => {
            // Sort by ketua display_order if available
            const orderA = a.ketua?.display_order || 999
            const orderB = b.ketua?.display_order || 999
            return orderA - orderB
        })
})

// Toast notification function
const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

// Methods
const fetchWilayah = async () => {
    try {
        const response = await $fetch('/api/admin/wilayah') as any
        if (response.success) {
            wilayahList.value = response.data.sort((a: any, b: any) =>
                (a.display_order || 0) - (b.display_order || 0)
            )
        }
    } catch (err: any) {
        console.error('Error fetching wilayah:', err)
    }
}

const fetchLingkungan = async () => {
    try {
        const response = await $fetch('/api/admin/lingkungan') as any
        if (response.success) {
            lingkunganList.value = response.data.sort((a: any, b: any) =>
                (parseInt(a.no) || 0) - (parseInt(b.no) || 0)
            )
        }
    } catch (err: any) {
        console.error('Error fetching lingkungan:', err)
    }
}

// Lingkungan filtered by selected wilayah
const filteredLingkunganByWilayah = computed(() => {
    if (!formData.value.wilayah_name) return lingkunganList.value
    return lingkunganList.value.filter(
        (l: any) => l.wilayah_nama === formData.value.wilayah_name ||
                    l.wilayah_text === formData.value.wilayah_name
    )
})

const fetchMembers = async () => {
    try {
        loading.value = true
        error.value = ''

        const response = await $fetch('/api/admin/dpp') as any

        if (response.success) {
            members.value = response.data
        }
    } catch (err: any) {
        console.error('Error fetching DPP members:', err)
        error.value = err.message || 'Gagal memuat data anggota DPP'
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    modalMode.value = 'create'
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_category: 'anggota',
        position_type: 'anggota',
        position_level: '',
        bidang_name: '',
        seksi_name: '',
        sub_seksi_name: '',
        wilayah_name: '',
        lingkungan_number: null,
        is_ex_officio: false,
        display_order: members.value.length,
        auto_shift_order: false,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

// Context-specific create methods
const openCreateForPengurusInti = () => {
    modalMode.value = 'create'
    const currentCount = groupedMembers.value.pengurus_inti?.length || 0
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_category: 'pengurus_inti',
        position_type: 'anggota',
        position_level: '',
        bidang_name: '',
        seksi_name: '',
        sub_seksi_name: '',
        wilayah_name: '',
        lingkungan_number: null,
        is_ex_officio: false,
        display_order: currentCount,
        auto_shift_order: false,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

const openCreateForBidang = (bidangName: string) => {
    modalMode.value = 'create'
    const bidangMembers = groupedMembers.value[bidangName] || []
    const maxOrder = bidangMembers.length > 0 
        ? Math.max(...bidangMembers.map((m: any) => m.display_order || 0))
        : 0
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_category: 'anggota',
        position_type: 'anggota',
        position_level: '',
        bidang_name: bidangName,
        seksi_name: '',
        sub_seksi_name: '',
        wilayah_name: '',
        lingkungan_number: null,
        is_ex_officio: false,
        display_order: maxOrder + 1,
        auto_shift_order: false,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

const openCreateForKetuaWilayah = () => {
    modalMode.value = 'create'
    const wilayahMembers = groupedMembers.value.ketua_wilayah || []
    const ketuaWilayahCount = wilayahMembers.filter((m: any) => m.position_category === 'ketua_wilayah').length
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_category: 'ketua_wilayah',
        position_type: 'ketua_wilayah',
        position_level: '',
        bidang_name: '',
        seksi_name: '',
        sub_seksi_name: '',
        wilayah_name: '',
        lingkungan_number: null,
        is_ex_officio: false,
        display_order: ketuaWilayahCount + 1,
        auto_shift_order: false,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

const openCreateForKetuaLingkungan = (wilayahName?: string, lingkunganNo?: number) => {
    modalMode.value = 'create'
    formData.value = {
        id: null,
        name: '',
        position: '',
        position_category: 'ketua_lingkungan',
        position_type: 'ketua_lingkungan',
        position_level: '',
        bidang_name: '',
        seksi_name: '',
        sub_seksi_name: '',
        wilayah_name: wilayahName || '',
        lingkungan_number: lingkunganNo || null,
        is_ex_officio: false,
        display_order: 100,
        auto_shift_order: false,
        period_start_date: '',
        period_end_date: '',
        decree_number: '',
        decree_date: '',
        notes: '',
        is_active: true
    }
    showModal.value = true
}

// Wrapper for button click without parameters
const openCreateForKetuaLingkunganDefault = () => {
    openCreateForKetuaLingkungan()
}


const editMember = (member: any) => {
    modalMode.value = 'edit'
    formData.value = {
        id: member.id,
        name: member.name,
        position: member.position,
        position_category: member.position_category || 'anggota',
        position_type: member.position_type,
        position_level: member.position_level || '',
        bidang_name: member.bidang_name || '',
        seksi_name: member.seksi_name || '',
        sub_seksi_name: member.sub_seksi_name || '',
        wilayah_name: member.wilayah_name || '',
        lingkungan_number: member.lingkungan_number || null,
        is_ex_officio: Boolean(member.is_ex_officio),
        display_order: member.display_order || 0,
        auto_shift_order: false,
        period_start_date: formatDateForInput(member.period_start_date) || '',
        period_end_date: formatDateForInput(member.period_end_date) || '',
        decree_number: member.decree_number || '',
        decree_date: formatDateForInput(member.decree_date) || '',
        notes: member.notes || '',
        is_active: Boolean(member.is_active)
    }
    showModal.value = true
}

const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return ''
    try {
        // Convert ISO datetime to yyyy-MM-dd format
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''
        return date.toISOString().split('T')[0]
    } catch {
        return ''
    }
}

const getDisplayOrderHint = () => {
    if (formData.value.position_category === 'ketua_wilayah') {
        return 'Urutan 1-8 untuk Ketua Wilayah'
    } else if (formData.value.position_category === 'ketua_lingkungan') {
        return 'Format: XYY (X=wilayah 1-8, YY=lingkungan 01-99)'
    } else if (formData.value.position_category === 'pengurus_inti') {
        return 'Urutan untuk Pengurus Inti (Ketua, Wakil, Sekretaris, Bendahara)'
    } else if (formData.value.bidang_name) {
        return `Urutan dalam Bidang ${formData.value.bidang_name}`
    }
    return 'Angka lebih kecil tampil lebih dulu'
}

const closeModal = () => {
    showModal.value = false
}

const saveMember = async () => {
    try {
        saving.value = true
        error.value = ''

        const url = modalMode.value === 'create'
            ? '/api/admin/dpp'
            : `/api/admin/dpp/${formData.value.id}`

        const method = modalMode.value === 'create' ? 'POST' : 'PUT'

        // Prepare body - exclude auto_shift_order for edit mode
        const body = modalMode.value === 'edit' 
            ? {
                name: formData.value.name,
                position: formData.value.position,
                position_category: formData.value.position_category,
                position_type: formData.value.position_type,
                position_level: formData.value.position_level,
                bidang_name: formData.value.bidang_name,
                seksi_name: formData.value.seksi_name,
                sub_seksi_name: formData.value.sub_seksi_name,
                wilayah_name: formData.value.wilayah_name,
                lingkungan_number: formData.value.lingkungan_number,
                is_ex_officio: formData.value.is_ex_officio,
                display_order: formData.value.display_order,
                period_start_date: formData.value.period_start_date,
                period_end_date: formData.value.period_end_date,
                decree_number: formData.value.decree_number,
                decree_date: formData.value.decree_date,
                notes: formData.value.notes,
                is_active: formData.value.is_active
            }
            : formData.value

        // OPTIMISTIC UPDATE
        if (modalMode.value === 'create') {
            // Create: Add temporary item to array immediately
            const tempId = `temp_${Date.now()}`
            const tempMember = {
                ...formData.value,
                id: tempId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            members.value.unshift(tempMember) // Add to beginning for better UX
            closeModal()
            saving.value = false

            // Send to server in background
            try {
                const response = await $fetch(url, { method, body }) as any
                if (response.success && response.data) {
                    // Replace temp item with real data using splice for reactivity
                    const index = members.value.findIndex((m: any) => m.id === tempId)
                    if (index !== -1) {
                        members.value.splice(index, 1, response.data)
                    }
                    showToastMessage('Anggota DPP berhasil ditambahkan!', 'success')
                }
            } catch (err: any) {
                // Remove temp item on error
                const tempIndex = members.value.findIndex((m: any) => m.id === tempId)
                if (tempIndex !== -1) {
                    members.value.splice(tempIndex, 1)
                }
                error.value = err.message || 'Gagal menyimpan data anggota DPP'
                showToastMessage(err.message || 'Gagal menambahkan anggota DPP', 'error')
                console.error('Error creating DPP member:', err)
            }
        } else {
            // Edit: Update item immediately using splice for reactivity
            const originalMember = { ...members.value.find((m: any) => m.id === formData.value.id) }
            const index = members.value.findIndex((m: any) => m.id === formData.value.id)
            
            if (index !== -1) {
                const updatedMember = {
                    ...members.value[index],
                    ...body,
                    updated_at: new Date().toISOString()
                }
                members.value.splice(index, 1, updatedMember) // Use splice for reactivity
            }
            closeModal()
            saving.value = false

            // Send to server in background
            try {
                const response = await $fetch(url, { method, body }) as any
                if (response.success && response.data) {
                    // Update with server data using splice
                    if (index !== -1) {
                        members.value.splice(index, 1, response.data)
                    }
                    showToastMessage('Anggota DPP berhasil diperbarui!', 'success')
                }
            } catch (err: any) {
                // Rollback on error using splice
                if (index !== -1 && originalMember) {
                    members.value.splice(index, 1, originalMember)
                }
                error.value = err.message || 'Gagal menyimpan data anggota DPP'
                showToastMessage(err.message || 'Gagal memperbarui anggota DPP', 'error')
                console.error('Error updating DPP member:', err)
            }
        }
    } catch (err: any) {
        console.error('Error saving DPP member:', err)
        error.value = err.message || 'Gagal menyimpan data anggota DPP'
        saving.value = false
    }
}

const confirmDelete = (member: any) => {
    memberToDelete.value = member
    showDeleteConfirm.value = true
}

const deleteMember = async () => {
    try {
        const memberToDeleteId = memberToDelete.value.id
        const memberBackup = { ...memberToDelete.value }
        const memberIndex = members.value.findIndex((m: any) => m.id === memberToDeleteId)

        // OPTIMISTIC UPDATE: Remove immediately using splice for reactivity
        if (memberIndex !== -1) {
            members.value.splice(memberIndex, 1)
        }
        showDeleteConfirm.value = false
        memberToDelete.value = null

        // Send delete request in background
        try {
            const response = await $fetch(`/api/admin/dpp/${memberToDeleteId}`, {
                method: 'DELETE'
            }) as any

            if (!response.success) {
                throw new Error(response.message || 'Delete failed')
            }
            // Success feedback
            showToastMessage('Anggota DPP berhasil dihapus!', 'success')
        } catch (err: any) {
            // ROLLBACK: Restore member on error using splice
            if (memberIndex !== -1) {
                members.value.splice(memberIndex, 0, memberBackup)
            } else {
                members.value.push(memberBackup)
            }
            error.value = err.message || 'Gagal menghapus anggota DPP'
            showToastMessage(err.message || 'Gagal menghapus anggota DPP', 'error')
            console.error('Error deleting DPP member:', err)
        }
    } catch (err: any) {
        console.error('Error in deleteMember:', err)
        error.value = err.message || 'Gagal menghapus anggota DPP'
    }
}

const getPositionTypeName = (type: string) => {
    const names: any = {
        'ketua': 'Ketua',
        'wakil_ketua': 'Wakil Ketua',
        'sekretaris': 'Sekretaris',
        'bendahara': 'Bendahara',
        'anggota': 'Anggota'
    }
    return names[type] || type
}

const getPositionTypeClass = (type: string) => {
    const classes: any = {
        'ketua': 'bg-[#882f1d] text-white',
        'wakil_ketua': 'bg-purple-100 text-purple-800',
        'sekretaris': 'bg-blue-100 text-blue-800',
        'bendahara': 'bg-green-100 text-green-800',
        'anggota': 'bg-gray-100 text-gray-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const autoGeneratePosition = () => {
    const category = formData.value.position_category
    const wilayah = formData.value.wilayah_name
    const lingkungan = formData.value.lingkungan_number
    const bidang = formData.value.bidang_name
    const posType = formData.value.position_type

    let generatedPosition = ''

    if (category === 'ketua_wilayah' && wilayah) {
        generatedPosition = `Ketua Wilayah ${wilayah}`
    } else if (category === 'ketua_lingkungan' && wilayah && lingkungan) {
        generatedPosition = `Ketua Lingkungan ${wilayah} ${lingkungan}`
    } else if (category === 'ketua_bidang' && bidang) {
        generatedPosition = `Ketua Bidang ${bidang}`
    } else if (category === 'ketua_seksi' && bidang) {
        const seksi = formData.value.seksi_name
        generatedPosition = seksi ? `Ketua Seksi ${seksi} - Bidang ${bidang}` : `Ketua Seksi Bidang ${bidang}`
    } else if (category === 'pengurus_inti') {
        // Map position_type to readable name
        const typeNames: Record<string, string> = {
            'ketua': 'Ketua',
            'wakil_ketua': 'Wakil Ketua',
            'sekretaris': 'Sekretaris',
            'bendahara': 'Bendahara',
            'anggota': 'Anggota'
        }
        const level = formData.value.position_level
        generatedPosition = typeNames[posType] || 'Pengurus Inti'
        if (level && (posType === 'sekretaris' || posType === 'bendahara')) {
            generatedPosition += ` ${level}`
        }
    } else if (category === 'anggota' && bidang) {
        const seksi = formData.value.seksi_name
        const subSeksi = formData.value.sub_seksi_name
        if (subSeksi) {
            generatedPosition = `Anggota ${subSeksi} - ${seksi || bidang}`
        } else if (seksi) {
            generatedPosition = `Anggota ${seksi} - Bidang ${bidang}`
        } else {
            generatedPosition = `Anggota Bidang ${bidang}`
        }
    }

    // Only auto-fill if position is empty or same as previous generated
    if (generatedPosition && (!formData.value.position || formData.value.position === previousGeneratedPosition.value)) {
        formData.value.position = generatedPosition
        previousGeneratedPosition.value = generatedPosition
    }
}

const getPositionPreview = () => {
    const category = formData.value.position_category
    const wilayah = formData.value.wilayah_name
    const lingkungan = formData.value.lingkungan_number
    const bidang = formData.value.bidang_name

    if (category === 'ketua_wilayah') {
        return wilayah ? `💡 Saran: Ketua Wilayah ${wilayah}` : '💡 Pilih wilayah untuk auto-generate'
    } else if (category === 'ketua_lingkungan') {
        return (wilayah && lingkungan) ? `💡 Saran: Ketua Lingkungan ${wilayah} ${lingkungan}` : '💡 Pilih wilayah & nomor lingkungan'
    } else if (category === 'ketua_bidang') {
        return bidang ? `💡 Saran: Ketua Bidang ${bidang}` : '💡 Pilih bidang untuk auto-generate'
    } else if (category === 'pengurus_inti') {
        return '💡 Contoh: Ketua, Wakil Ketua, Sekretaris I, Bendahara II'
    } else if (category === 'anggota' && bidang) {
        return `💡 Saran: Anggota Bidang ${bidang}` + (formData.value.seksi_name ? ` - ${formData.value.seksi_name}` : '')
    }
    return '💡 Isi otomatis sesuai pilihan kategori dan wilayah/bidang'
}

const previousGeneratedPosition = ref('')

// Watch for changes and auto-generate position
watch(
    () => [formData.value.position_category, formData.value.wilayah_name, formData.value.lingkungan_number, formData.value.bidang_name, formData.value.seksi_name, formData.value.sub_seksi_name, formData.value.position_type, formData.value.position_level],
    () => {
        autoGeneratePosition()
    },
    { deep: true }
)

watch(
    () => [
        filters.value.search,
        filters.value.bidang,
        filters.value.position_category,
        filters.value.position_type,
        filters.value.is_active,
        filters.value.sort,
        viewMode.value
    ],
    () => {
        currentPage.value = 1
    }
)

watch(totalPages, (pages: number) => {
    if (currentPage.value > pages) {
        currentPage.value = pages
    }
})

// Lifecycle
onMounted(() => {
    fetchWilayah()
    fetchLingkungan()
    fetchMembers()
})
</script>

<style scoped>
/* Toast transition */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translate(-50%, 1rem);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, -1rem);
}
</style>
