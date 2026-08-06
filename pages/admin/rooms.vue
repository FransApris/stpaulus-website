<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <div v-if="toastMessage" 
         class="fixed top-5 right-5 z-50 flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transition-all duration-300 transform translate-y-0"
         :class="toastType === 'success' ? 'bg-green-800 text-green-100 border border-green-700' : 'bg-red-800 text-red-100 border border-red-700'">
      <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path v-if="toastType === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      <span>{{ toastMessage }}</span>
      <button @click="toastMessage = ''" class="ml-4 text-white hover:opacity-75 focus:outline-none">✕</button>
    </div>

    <!-- Header Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Ruangan</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Ruangan Aktif</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.active }}</p>
        </div>
        <div class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Perlu Persetujuan</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ stats.requiresApproval }}</p>
        </div>
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Nonaktif</p>
          <p class="text-2xl font-bold text-gray-400 mt-1">{{ stats.inactive }}</p>
        </div>
        <div class="w-12 h-12 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Container Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Toolbar: Search, Filters & Action Button -->
      <div class="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search and Filters -->
        <div class="flex flex-col sm:flex-row flex-wrap items-center gap-3 flex-1">
          <!-- Search Box -->
          <div class="relative w-full sm:w-64">
            <input v-model="searchQuery" 
                   type="text" 
                   placeholder="Cari ruangan / fasilitas..." 
                   class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Location Filter -->
          <select v-model="selectedLocationFilter" class="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">Semua Lokasi</option>
            <option v-for="loc in locationOptions" :key="loc" :value="loc">{{ loc }}</option>
          </select>

          <!-- Status Filter -->
          <select v-model="selectedStatusFilter" class="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif Saja</option>
          </select>

          <!-- Approval Filter -->
          <select v-model="selectedApprovalFilter" class="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="all">Semua Persetujuan</option>
            <option value="approval">Memerlukan Persetujuan</option>
            <option value="no_approval">Tanpa Persetujuan</option>
          </select>

          <!-- Clear Filters -->
          <button v-if="searchQuery || selectedLocationFilter || selectedStatusFilter !== 'all' || selectedApprovalFilter !== 'all'"
                  @click="resetFilters" 
                  class="text-xs text-blue-600 hover:text-blue-800 font-medium underline px-2 py-1">
            Reset Filter
          </button>
        </div>

        <!-- Add Button -->
        <button @click="openCreateModal" 
                class="bg-[#882f1d] hover:bg-[#6e2517] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Tambah Ruangan Baru
        </button>
      </div>

      <!-- Table View -->
      <div v-if="filteredRooms.length === 0" class="p-12 text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <p class="text-lg font-medium text-gray-700">Tidak ada ruangan ditemukan</p>
        <p class="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau reset filter ruangan.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruangan</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button @click="sortBy('capacity')" class="flex items-center gap-1 hover:text-gray-700">
                  Kapasitas
                  <span v-if="sortField === 'capacity'" class="text-blue-600">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </button>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button @click="sortBy('location')" class="flex items-center gap-1 hover:text-gray-700">
                  Lokasi
                  <span v-if="sortField === 'location'" class="text-blue-600">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </button>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fasilitas</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Persetujuan</th>
              <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Aktif</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in paginatedRooms" :key="room.id" class="hover:bg-gray-50/80 transition-colors">
              <!-- Name & Photo -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    <img v-if="room.photo_url" :src="room.photo_url" :alt="room.name" class="h-full w-full object-cover" />
                    <svg v-else class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900 flex items-center gap-1.5 flex-wrap">
                      <span>{{ room.name }}</span>
                      <span v-if="room.is_dedicated" 
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
                            :title="`Hak Pakai Permanen: ${room.dedicated_to || 'Seksi'}`">
                        🔒 Khusus: {{ room.dedicated_to ? room.dedicated_to : 'Seksi' }}
                      </span>
                    </div>
                    <div v-if="room.description" class="text-xs text-gray-500 max-w-xs truncate" :title="room.description">{{ room.description }}</div>
                  </div>
                </div>
              </td>

              <!-- Capacity -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <svg class="w-3.5 h-3.5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{ room.capacity }} Orang
                </span>
              </td>

              <!-- Location -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                {{ room.location }}
              </td>

              <!-- Facilities -->
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(fac, fIdx) in parseFacilities(room.facilities)" :key="fIdx" 
                        class="inline-block bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded">
                    {{ fac }}
                  </span>
                  <span v-if="parseFacilities(room.facilities).length === 0" class="text-gray-400 italic text-xs">Standard</span>
                </div>
              </td>

              <!-- Requires Approval -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="room.requires_approval ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'" 
                      class="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :class="room.requires_approval ? 'bg-amber-500' : 'bg-gray-400'"></span>
                  {{ room.requires_approval ? 'Perlu Persetujuan' : 'Bebas Dipesan' }}
                </span>
              </td>

              <!-- Active Status Toggle -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button @click="toggleActiveStatus(room)" 
                        :disabled="toggleLoadingId === room.id"
                        class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none disabled:opacity-50"
                        :class="isRoomActive(room) ? 'bg-green-600' : 'bg-gray-300'"
                        :title="isRoomActive(room) ? 'Klik untuk menonaktifkan' : 'Klik untuk mengaktifkan'">
                  <span class="sr-only">Toggle Room Status</span>
                  <span class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        :class="isRoomActive(room) ? 'translate-x-5' : 'translate-x-0'"></span>
                </button>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="openEditModal(room)" title="Edit Ruangan" 
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="promptDeleteRoom(room)" title="Hapus Ruangan" 
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Menampilkan {{ (currentPage - 1) * pageLimit + 1 }}–{{ Math.min(currentPage * pageLimit, totalItems) }} dari {{ totalItems }} ruangan
          </p>
          <div class="flex items-center justify-center sm:justify-end gap-1.5 flex-wrap">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm">
              <span class="sm:hidden">← Prev</span>
              <span class="hidden sm:inline">Sebelumnya</span>
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                    class="min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm"
                    :class="page === currentPage ? 'bg-[#882f1d] text-white' : 'border text-gray-700 hover:bg-gray-50'">
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm">
              <span class="sm:hidden">Next →</span>
              <span class="hidden sm:inline">Berikutnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Room Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 border border-gray-100">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 sticky top-0 bg-white z-10">
          <h3 class="text-lg font-bold text-gray-800">
            {{ isEditing ? 'Edit Ruangan' : 'Tambah Ruangan Baru' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">✕</button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="saveRoom" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Nama Ruangan *</label>
              <input v-model="form.name" type="text" placeholder="Contoh: Balai Paroki Utama" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <!-- Capacity -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Kapasitas (Orang) *</label>
              <input v-model.number="form.capacity" type="number" min="1" placeholder="50" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Lokasi *</label>
              <select v-model="form.location" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Pilih Lokasi Ruangan</option>
                <option v-for="loc in locationOptions" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>

            <!-- Requires Approval -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Persetujuan Admin *</label>
              <select v-model="form.requires_approval" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option :value="true">Memerlukan Persetujuan Admin</option>
                <option :value="false">Bebas Dipesan Langsung</option>
              </select>
            </div>
          </div>

          <!-- Photo URL -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">URL Foto Ruangan (Opsional)</label>
            <div class="flex gap-2">
              <input v-model="form.photo_url" type="url" placeholder="https://res.cloudinary.com/..." class="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <!-- Photo Preview -->
            <div v-if="form.photo_url" class="mt-2 relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img :src="form.photo_url" alt="Preview Foto" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Facilities -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Fasilitas (Dipisah Koma)</label>
            <input v-model="form.facilities" type="text" placeholder="Contoh: AC 2 PK, Sound System, Proyektor, LCD Screen" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Deskripsi & Catatan Tata Tertib</label>
            <textarea v-model="form.description" rows="3" placeholder="Contoh: Harap mematikan AC dan merapikan kembali meja/kursi setelah digunakan..." class="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <!-- Allowed Categories -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-gray-700 uppercase tracking-wider">Kategori Pengguna yang Diizinkan *</label>
              <label class="flex items-center text-xs font-bold text-blue-600 cursor-pointer">
                <input v-model="selectAllModal" @change="toggleAllModalCategories" type="checkbox" class="mr-1.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                Pilih Semua
              </label>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label v-for="cat in userCategories" :key="cat.value" class="flex items-center text-xs text-gray-700 font-medium cursor-pointer hover:text-gray-900">
                <input v-model="form.allowed_categories" :value="cat.value" type="checkbox" class="mr-2 w-4 h-4 text-blue-600 rounded" />
                {{ cat.label }}
              </label>
            </div>
          </div>

          <!-- Dedicated Room Section -->
          <div class="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-amber-900 uppercase tracking-wider">🔒 Ruangan Khusus Permanen (Dedicated)</p>
                <p class="text-xs text-amber-800">Tandai jika ruangan dialokasikan khusus untuk Seksi / Kelompok tertentu</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="form.is_dedicated" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div v-if="form.is_dedicated" class="pt-2">
              <label class="block text-xs font-semibold text-amber-900 mb-1">Nama Seksi / Lembaga Pemilik *</label>
              <input v-model="form.dedicated_to" type="text" placeholder="Contoh: Seksi Komsos, Sekretariat Paroki, Mudika/OMK" class="w-full border border-amber-300 bg-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <!-- Active Status Toggle in Form -->
          <div class="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <div>
              <p class="text-xs font-bold text-blue-900 uppercase tracking-wider">Status Akses Ruangan</p>
              <p class="text-xs text-blue-700">Ruangan aktif dapat dilihat dan dipesan oleh umat/pengguna</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="form.is_active" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <!-- Error Alert inside modal -->
          <p v-if="modalError" class="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{{ modalError }}</p>

          <!-- Buttons -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="formLoading" class="bg-[#882f1d] hover:bg-[#6e2517] text-white px-5 py-2 text-sm font-semibold rounded-lg disabled:opacity-50">
              {{ formLoading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Ruangan') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete / Deactivate Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border border-gray-100">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Ruangan "{{ roomToDelete?.name }}"?</h3>
        <p class="text-sm text-gray-600 mb-6">
          Jika ruangan ini pernah dipesan, sistem akan <strong>menonaktifkan ruangan</strong> untuk menjaga data histori laporan.
        </p>

        <div class="flex justify-center gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            Batal
          </button>
          <button @click="executeDeleteRoom" :disabled="deleteLoading" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
            {{ deleteLoading ? 'Memproses...' : 'Ya, Hapus / Nonaktifkan' }}
          </button>
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

const rooms = useState('admin-rooms', () => [])
const searchQuery = ref('')
const selectedLocationFilter = ref('')
const selectedStatusFilter = ref('all')
const selectedApprovalFilter = ref('all')

const sortField = ref('name')
const sortOrder = ref('asc')
const currentPage = useState('admin-rooms-page', () => 1)
const pageLimit = 10

const toggleLoadingId = ref(null)
const deleteLoading = ref(false)

// Toast Notifications
const toastMessage = ref('')
const toastType = ref('success')

const showToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = ''
    }
  }, 4000)
}

// Location options
const locationOptions = [
  'Gereja',
  'Balai Paroki Lt.1',
  'Balai Paroki Lt.2',
  'Balai Paroki Lt.3',
  'Selasar',
  'Halaman Belakang Gereja',
  'Halaman Depan Gereja'
]

// User Category Options
const userCategories = [
  { value: 'Dewan Pastoral Paroki', label: 'Dewan Pastoral Paroki' },
  { value: 'Kategorial', label: 'Kelompok Kategorial' },
  { value: 'Wilayah', label: 'Wilayah' },
  { value: 'Komunitas', label: 'Komunitas' },
  { value: 'Lingkungan', label: 'Lingkungan' },
  { value: 'Seksi', label: 'Seksi' }
]

// Modal Form State
const showModal = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const modalError = ref('')
const selectAllModal = ref(false)

const form = ref({
  id: null,
  name: '',
  capacity: 10,
  location: '',
  facilities: '',
  description: '',
  photo_url: '',
  requires_approval: true,
  is_active: true,
  is_dedicated: false,
  dedicated_to: '',
  allowed_categories: []
})

// Delete Modal State
const showDeleteModal = ref(false)
const roomToDelete = ref(null)

// Stats Computed
const stats = computed(() => {
  const all = rooms.value || []
  return {
    total: all.length,
    active: all.filter(r => isRoomActive(r)).length,
    inactive: all.filter(r => !isRoomActive(r)).length,
    requiresApproval: all.filter(r => r.requires_approval == 1 || r.requires_approval === true).length,
    dedicated: all.filter(r => r.is_dedicated == 1 || r.is_dedicated === true).length
  }
})

// Helper check room active
function isRoomActive(r) {
  return r.is_active === undefined || r.is_active === null || r.is_active == 1 || r.is_active === true
}

// Helper parse facilities
function parseFacilities(fac) {
  if (!fac) return []
  if (Array.isArray(fac)) return fac
  if (typeof fac === 'string') {
    try {
      const parsed = JSON.parse(fac)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      return fac.split(',').map(s => s.trim()).filter(Boolean)
    }
  }
  return [String(fac)]
}

// Watch modal category changes for selectAll
watch(() => form.value.allowed_categories, (newVal) => {
  selectAllModal.value = (newVal || []).length === userCategories.length
}, { deep: true })

const toggleAllModalCategories = () => {
  if (selectAllModal.value) {
    form.value.allowed_categories = userCategories.map(c => c.value)
  } else {
    form.value.allowed_categories = []
  }
}

// Load Rooms
const loadRooms = async () => {
  try {
    const data = await $fetch('/api/admin/rooms', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    rooms.value = data || []
  } catch (err) {
    console.error('Failed to load rooms:', err)
  }
}

onMounted(() => {
  loadRooms()
})

// Filtering & Sorting
const filteredRooms = computed(() => {
  let list = [...(rooms.value || [])]

  // Filter Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(r => {
      const nameMatch = (r.name || '').toLowerCase().includes(q)
      const locMatch = (r.location || '').toLowerCase().includes(q)
      const facMatch = (r.facilities || '').toLowerCase().includes(q)
      const dedMatch = (r.dedicated_to || '').toLowerCase().includes(q)
      return nameMatch || locMatch || facMatch || dedMatch
    })
  }

  // Filter Location
  if (selectedLocationFilter.value) {
    list = list.filter(r => r.location === selectedLocationFilter.value)
  }

  // Filter Status
  if (selectedStatusFilter.value === 'active') {
    list = list.filter(r => isRoomActive(r))
  } else if (selectedStatusFilter.value === 'inactive') {
    list = list.filter(r => !isRoomActive(r))
  }

  // Filter Approval
  if (selectedApprovalFilter.value === 'approval') {
    list = list.filter(r => r.requires_approval == 1 || r.requires_approval === true)
  } else if (selectedApprovalFilter.value === 'no_approval') {
    list = list.filter(r => !r.requires_approval && r.requires_approval !== 1)
  }

  // Sort
  list.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value === 'capacity') {
      aVal = parseInt(aVal) || 0
      bVal = parseInt(bVal) || 0
    } else {
      aVal = (aVal || '').toString().toLowerCase()
      bVal = (bVal || '').toString().toLowerCase()
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const totalItems = computed(() => filteredRooms.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return filteredRooms.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedLocationFilter.value = ''
  selectedStatusFilter.value = 'all'
  selectedApprovalFilter.value = 'all'
}

// Toggle active status directly from table switch
const toggleActiveStatus = async (room) => {
  toggleLoadingId.value = room.id
  try {
    const token = sessionStorage.getItem('admin_access_token')
    const res = await $fetch(`/api/admin/rooms/${room.id}/toggle-active`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })

    const index = rooms.value.findIndex(r => r.id === room.id)
    if (index !== -1) {
      rooms.value[index] = res.room || { ...room, is_active: room.is_active ? 0 : 1 }
    }
    showToast(res.message || 'Status ruangan berhasil diubah', 'success')
  } catch (err) {
    const msg = (err && err.data && err.data.statusMessage) || 'Gagal mengubah status ruangan'
    showToast(msg, 'error')
  } finally {
    toggleLoadingId.value = null
  }
}

// Open Modal Add / Edit
const openCreateModal = () => {
  isEditing.value = false
  modalError.value = ''
  form.value = {
    id: null,
    name: '',
    capacity: 20,
    location: '',
    facilities: '',
    description: '',
    photo_url: '',
    requires_approval: true,
    is_active: true,
    is_dedicated: false,
    dedicated_to: '',
    allowed_categories: userCategories.map(c => c.value) // Default all checked
  }
  selectAllModal.value = true
  showModal.value = true
}

const openEditModal = (room) => {
  isEditing.value = true
  modalError.value = ''

  const facs = parseFacilities(room.facilities).join(', ')

  let parsedCats = []
  if (Array.isArray(room.allowed_categories)) {
    parsedCats = room.allowed_categories
  } else if (typeof room.allowed_categories === 'string' && room.allowed_categories.trim() !== '') {
    try {
      const p = JSON.parse(room.allowed_categories)
      parsedCats = Array.isArray(p) ? p : []
    } catch (e) {
      parsedCats = room.allowed_categories.split(',').map(s => s.trim()).filter(Boolean)
    }
  }

  form.value = {
    id: room.id,
    name: room.name || '',
    capacity: room.capacity || 10,
    location: room.location || '',
    facilities: facs,
    description: room.description || '',
    photo_url: room.photo_url || '',
    requires_approval: Boolean(room.requires_approval),
    is_active: isRoomActive(room),
    is_dedicated: Boolean(room.is_dedicated),
    dedicated_to: room.dedicated_to || '',
    allowed_categories: parsedCats
  }

  selectAllModal.value = parsedCats.length === userCategories.length
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalError.value = ''
}

// Save Room (POST / PUT)
const saveRoom = async () => {
  if (!form.value.name || !form.value.capacity || !form.value.location) {
    modalError.value = 'Mohon lengkapi Nama Ruangan, Kapasitas, dan Lokasi.'
    return
  }

  if (form.value.is_dedicated && !form.value.dedicated_to?.trim()) {
    modalError.value = 'Mohon isi Nama Seksi / Lembaga Pemilik untuk ruangan khusus.'
    return
  }

  formLoading.value = true
  modalError.value = ''

  let facilitiesPayload = null
  if (form.value.facilities && typeof form.value.facilities === 'string' && form.value.facilities.trim()) {
    facilitiesPayload = JSON.stringify(form.value.facilities.split(',').map(f => f.trim()).filter(Boolean))
  }

  const allowedCategoriesPayload = form.value.allowed_categories.length > 0 
    ? JSON.stringify(form.value.allowed_categories) 
    : null

  const payload = {
    name: form.value.name,
    capacity: form.value.capacity,
    location: form.value.location,
    facilities: facilitiesPayload,
    description: form.value.description || null,
    photo_url: form.value.photo_url || null,
    requires_approval: form.value.requires_approval,
    is_active: form.value.is_active,
    is_dedicated: form.value.is_dedicated,
    dedicated_to: form.value.is_dedicated ? (form.value.dedicated_to.trim() || null) : null,
    allowed_categories: allowedCategoriesPayload
  }

  try {
    const token = sessionStorage.getItem('admin_access_token')
    let result

    if (isEditing.value && form.value.id) {
      result = await $fetch(`/api/admin/rooms/${form.value.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
      const index = rooms.value.findIndex(r => r.id === form.value.id)
      if (index !== -1) {
        rooms.value[index] = result.room || result
      }
      showToast('Ruangan berhasil diperbarui', 'success')
    } else {
      result = await $fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
      rooms.value.unshift(result.room || result)
      showToast('Ruangan baru berhasil dibuat', 'success')
    }

    // Refresh data untuk memastikan state sinkron dengan database
    await loadRooms()

    closeModal()
  } catch (err) {
    const msg = (err && err.data && err.data.statusMessage) || 'Gagal menyimpan ruangan'
    modalError.value = msg
  } finally {
    formLoading.value = false
  }
}

// Delete Prompt & Execute
const promptDeleteRoom = (room) => {
  roomToDelete.value = room
  showDeleteModal.value = true
}

const executeDeleteRoom = async () => {
  if (!roomToDelete.value) return
  deleteLoading.value = true

  try {
    const token = sessionStorage.getItem('admin_access_token')
    const res = await $fetch(`/api/admin/rooms/${roomToDelete.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.deactivated) {
      // Room was soft-deactivated due to existing bookings
      const index = rooms.value.findIndex(r => r.id === roomToDelete.value.id)
      if (index !== -1) {
        rooms.value[index].is_active = 0
      }
      showToast(res.message, 'success')
    } else {
      // Room hard deleted
      rooms.value = rooms.value.filter(r => r.id !== roomToDelete.value.id)
      showToast(res.message, 'success')
    }
  } catch (err) {
    const msg = (err && err.data && err.data.statusMessage) || 'Gagal menghapus ruangan'
    showToast(msg, 'error')
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
    roomToDelete.value = null
  }
}
</script>
