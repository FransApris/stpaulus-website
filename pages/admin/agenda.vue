<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Kelola Agenda</h1>
        <p class="mt-2 text-sm text-gray-700">
          Kelola jadwal misa, rapat, kegiatan lingkungan, dan acara lainnya.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showAddModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-[#882f1d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Tambah Agenda
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cari</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Cari agenda..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @input="debouncedSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
            >
              <option value="">Semua Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bulan</label>
            <select
              v-model="filters.month"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
            >
              <option value="">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tahun</label>
            <select
              v-model="filters.year"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Dashboard -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Agenda -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Agenda</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.total }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Akan Datang</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-blue-600">{{ stats.upcoming }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Ongoing Events -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Sedang Berlangsung</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-green-600">{{ stats.ongoing }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Events -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Telah Selesai</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-600">{{ stats.past }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agenda Table -->
    <div class="mt-8 flex flex-col">
      <!-- Bulk Actions Toolbar -->
      <div v-if="selectedAgendas.length > 0" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="text-sm font-medium text-blue-900">
              {{ selectedAgendas.length }} agenda terpilih
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="exportSelected"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button
              @click="deleteMultiple"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
            <button
              @click="clearSelection"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d]"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      :checked="allVisibleSelected"
                      @change="toggleSelectAll"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d] sm:left-6"
                    />
                  </th>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tanggal & Waktu</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kegiatan</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="agenda in paginatedAgendas" :key="agenda.id" :class="[selectedAgendas.includes(agenda.id) ? 'bg-blue-50' : 'hover:bg-gray-50']">
                  <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      :checked="selectedAgendas.includes(agenda.id)"
                      @change="toggleSelect(agenda.id)"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d] sm:left-6"
                    />
                  </td>
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div class="font-medium text-gray-900">{{ formatDate(agenda.start_date) }}</div>
                    <div class="text-gray-500">{{ formatTime(agenda.start_date) }}</div>
                    <div v-if="agenda.end_date" class="text-gray-400 text-xs">s/d {{ formatTime(agenda.end_date) }}</div>
                  </td>
                  <td 
                    @click="openPreview(agenda)"
                    class="whitespace-nowrap px-3 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div class="font-medium text-blue-600 hover:text-blue-800">{{ agenda.title }}</div>
                    <div v-if="agenda.description" class="text-gray-500 truncate max-w-xs">{{ agenda.description }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ agenda.location }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span :class="getCategoryClass(agenda)" class="inline-flex rounded-full px-2 text-xs font-semibold leading-5">
                      {{ agenda.category }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span :class="getStatusClass(agenda)" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                      <svg class="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      {{ getStatusText(agenda) }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="editAgenda(agenda)"
                      :disabled="deleting === agenda.id"
                      title="Edit"
                      class="text-[#882f1d] hover:text-[#a55e1f] mr-4 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="showDeleteConfirm(agenda)"
                      :disabled="deleting === agenda.id"
                      :title="deleting === agenda.id ? 'Menghapus...' : 'Hapus'"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-1 inline-flex items-center"
                    >
                      <svg class="w-5 h-5" :class="deleting === agenda.id ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <p class="text-sm text-gray-600">Menampilkan {{ paginatedAgendas.length }} dari {{ totalItems }} agenda</p>
            <div class="flex items-center gap-2">
              <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                class="rounded border px-3 py-1 text-sm"
                :class="page === currentPage ? 'border-[#882f1d] bg-[#882f1d] text-white' : 'hover:bg-gray-50'">
                {{ page }}
              </button>
              <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingAgenda" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveAgenda">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ editingAgenda ? 'Edit Agenda' : 'Tambah Agenda Baru' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nama Kegiatan *</label>
                      <input
                        v-model="agendaForm.title"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Mulai *</label>
                        <input
                          v-model="agendaForm.start_date"
                          type="datetime-local"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                        <input
                          v-model="agendaForm.end_date"
                          type="datetime-local"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Lokasi *</label>
                      <input
                        v-model="agendaForm.location"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Kategori *</label>
                      <select
                        v-model="agendaForm.category_id"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      >
                        <option value="">Pilih Kategori</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                      <textarea
                        v-model="agendaForm.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        placeholder="Deskripsi kegiatan..."
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Kontak Person</label>
                      <input
                        v-model="agendaForm.contact_person"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        placeholder="Nama atau nomor kontak"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="saving"
                class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#882f1d] text-base font-medium text-white hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Menyimpan...' : (editingAgenda ? 'Update' : 'Simpan') }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview && previewAgenda" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="preview-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop -->
        <div @click="closePreview" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- Modal Panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 id="preview-title" class="text-2xl font-bold text-gray-900 mb-2">
                  {{ previewAgenda.title }}
                </h3>
                <span :class="getCategoryClass(previewAgenda)" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                  {{ previewAgenda.category }}
                </span>
              </div>
              <button @click="closePreview" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content Grid -->
            <div class="mt-6 border-t border-gray-200 pt-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <!-- Tanggal Mulai -->
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 flex items-center">
                    <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tanggal Mulai
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 font-medium">
                    {{ formatDateDisplay(previewAgenda.start_date) }}
                  </dd>
                  <dd class="text-sm text-gray-600">
                    {{ formatTimeDisplay(previewAgenda.start_date) }}
                  </dd>
                </div>

                <!-- Tanggal Selesai -->
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 flex items-center">
                    <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tanggal Selesai
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 font-medium">
                    {{ previewAgenda.end_date ? formatDateDisplay(previewAgenda.end_date) : 'Tidak ditentukan' }}
                  </dd>
                  <dd v-if="previewAgenda.end_date" class="text-sm text-gray-600">
                    {{ formatTimeDisplay(previewAgenda.end_date) }}
                  </dd>
                </div>

                <!-- Lokasi -->
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 flex items-center">
                    <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lokasi
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ previewAgenda.location || 'Tidak ditentukan' }}
                  </dd>
                </div>

                <!-- Contact Person -->
                <div v-if="previewAgenda.contact_person" class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 flex items-center">
                    <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Person
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ previewAgenda.contact_person }}
                  </dd>
                </div>

                <!-- Deskripsi -->
                <div v-if="previewAgenda.description" class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Deskripsi
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                    {{ previewAgenda.description }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="editAgenda(previewAgenda); closePreview()"
              type="button"
              class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#882f1d] text-base font-medium text-white hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:ml-3 sm:w-auto sm:text-sm"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              @click="showDeleteConfirm(previewAgenda); closePreview()"
              type="button"
              class="mt-3 w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
            <button
              @click="closePreview"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:mt-0 sm:w-auto sm:text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :show="confirmDelete.show"
      title="Hapus Agenda"
      :message="`Apakah Anda yakin ingin menghapus agenda '${confirmDelete.agendaTitle}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @confirm="deleteAgenda"
      @cancel="cancelDelete"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const agendas = useState('admin-agendas', () => [])
const categories = useState('admin-agenda-categories', () => [])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(null)
const showAddModal = ref(false)
const editingAgenda = ref(null)

const confirmDelete = ref({
  show: false,
  agendaId: null,
  agendaTitle: ''
})

const showPreview = ref(false)
const previewAgenda = ref(null)

const selectedAgendas = ref([])
const currentPage = useState('admin-agenda-page', () => 1)
const pageLimit = 10
const totalItems = computed(() => agendas.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageLimit)))
const paginatedAgendas = computed(() => {
  const start = (currentPage.value - 1) * pageLimit
  return agendas.value.slice(start, start + pageLimit)
})
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
})
const allVisibleSelected = computed(() => {
  return paginatedAgendas.value.length > 0 && paginatedAgendas.value.every(agenda => selectedAgendas.value.includes(agenda.id))
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const stats = computed(() => {
  const now = new Date()
  return {
    total: agendas.value.length,
    upcoming: agendas.value.filter(a => new Date(a.start_date) > now).length,
    ongoing: agendas.value.filter(a => {
      const start = new Date(a.start_date)
      const end = a.end_date ? new Date(a.end_date) : start
      return start <= now && now <= end
    }).length,
    past: agendas.value.filter(a => {
      const end = a.end_date ? new Date(a.end_date) : new Date(a.start_date)
      return end < now
    }).length
  }
})

const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const filters = ref({
  search: '',
  category: '',
  month: '',
  year: ''
})

const agendaForm = ref({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  category_id: '',
  contact_person: ''
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchAgendas()
  }, 500)
}

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/agenda/categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchAgendas = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.month) params.append('month', filters.value.month)
    if (filters.value.year) params.append('year', filters.value.year)

    const response = await $fetch(`/api/admin/agenda?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })
    agendas.value = response
  } catch (error) {
    console.error('Failed to fetch agendas:', error)
    showToast('Gagal memuat daftar agenda', 'error')
  } finally {
    loading.value = false
  }
}

const saveAgenda = async () => {
  saving.value = true
  
  // Simpan context sebelum API call
  const wasEditing = !!editingAgenda.value
  const editingId = editingAgenda.value?.id
  const formData = { ...agendaForm.value }
  
  // Client-side validation
  if (formData.end_date && formData.start_date >= formData.end_date) {
    showToast('Tanggal mulai harus sebelum tanggal selesai', 'error')
    saving.value = false
    return
  }
  
  try {
    const url = wasEditing ? `/api/admin/agenda/${editingId}` : '/api/admin/agenda'
    const method = wasEditing ? 'PUT' : 'POST'

    const result = await $fetch(url, {
      method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })

    // Close modal after success
    closeModal()

    // Refresh data
    await fetchAgendas()
    
    showToast(wasEditing ? 'Agenda berhasil diperbarui' : 'Agenda berhasil ditambahkan', 'success')
  } catch (error) {
    console.error('Failed to save agenda:', error)
    
    // More specific error messages
    let errorMessage = 'Gagal menyimpan agenda. Silakan coba lagi.'
    if (error.statusCode === 400) {
      errorMessage = error.statusMessage || 'Data yang dimasukkan tidak valid'
    }
    
    showToast(errorMessage, 'error')
  } finally {
    saving.value = false
  }
}

const editAgenda = (agenda) => {
  editingAgenda.value = agenda
  agendaForm.value = {
    title: agenda.title,
    description: agenda.description,
    start_date: formatDatetimeLocal(agenda.start_date),
    end_date: formatDatetimeLocal(agenda.end_date),
    location: agenda.location,
    category_id: agenda.category_id || '',
    contact_person: agenda.contact_person
  }
  showAddModal.value = false
}

const showDeleteConfirm = (agenda) => {
  confirmDelete.value = {
    show: true,
    agendaId: agenda.id,
    agendaTitle: agenda.title
  }
}

const cancelDelete = () => {
  confirmDelete.value = {
    show: false,
    agendaId: null,
    agendaTitle: ''
  }
}

const deleteAgenda = async () => {
  const id = confirmDelete.value.agendaId
  
  // Close dialog
  cancelDelete()
  
  // Set deleting state
  deleting.value = id

  // Save original state for rollback
  const originalAgendas = [...agendas.value]
  
  // Optimistic update - langsung hapus dari UI
  agendas.value = agendas.value.filter(a => a.id !== id)

  try {
    await $fetch(`/api/admin/agenda/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })

    showToast('Agenda berhasil dihapus', 'success')
  } catch (error) {
    console.error('Failed to delete agenda:', error)
    
    // Rollback on error
    agendas.value = originalAgendas
    showToast('Gagal menghapus agenda. Silakan coba lagi.', 'error')
  } finally {
    deleting.value = null
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingAgenda.value = null
  agendaForm.value = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    category_id: '',
    contact_person: ''
  }
}

// Helper functions
const formatDatetimeLocal = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  // Format: YYYY-MM-DDTHH:mm (required for datetime-local input)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status helper functions
const getStatusText = (agenda) => {
  const now = new Date()
  const start = new Date(agenda.start_date)
  const end = agenda.end_date ? new Date(agenda.end_date) : start
  
  if (start > now) return 'Akan Datang'
  if (start <= now && now <= end) return 'Berlangsung'
  return 'Selesai'
}

const getStatusClass = (agenda) => {
  const status = getStatusText(agenda)
  if (status === 'Akan Datang') return 'bg-blue-100 text-blue-800'
  if (status === 'Berlangsung') return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-600'
}

// Bulk selection functions
const toggleSelect = (id) => {
  const index = selectedAgendas.value.indexOf(id)
  if (index > -1) {
    selectedAgendas.value.splice(index, 1)
  } else {
    selectedAgendas.value.push(id)
  }
}

const toggleSelectAll = () => {
  const visibleIds = paginatedAgendas.value.map(agenda => agenda.id)
  if (visibleIds.every(id => selectedAgendas.value.includes(id))) {
    selectedAgendas.value = selectedAgendas.value.filter(id => !visibleIds.includes(id))
  } else {
    selectedAgendas.value = Array.from(new Set([...selectedAgendas.value, ...visibleIds]))
  }
}

const clearSelection = () => {
  selectedAgendas.value = []
}

// Export function
const exportSelected = () => {
  const exportData = agendas.value.filter(a => selectedAgendas.value.includes(a.id))
  
  if (exportData.length === 0) {
    showToast('Tidak ada data yang dipilih untuk diekspor', 'error')
    return
  }

  // Create CSV content
  const headers = ['Tanggal Mulai', 'Tanggal Selesai', 'Judul', 'Deskripsi', 'Lokasi', 'Kategori', 'Contact Person', 'Status']
  const rows = exportData.map(agenda => [
    formatDateDisplay(agenda.start_date),
    agenda.end_date ? formatDateDisplay(agenda.end_date) : '-',
    agenda.title,
    agenda.description || '-',
    agenda.location,
    agenda.category,
    agenda.contact_person || '-',
    getStatusText(agenda)
  ])

  // Build CSV
  let csv = headers.join(',') + '\n'
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n'
  })

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `agenda_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast(`${exportData.length} agenda berhasil diekspor`, 'success')
  clearSelection()
}

// Delete multiple function
const deleteMultiple = async () => {
  if (selectedAgendas.value.length === 0) {
    showToast('Tidak ada agenda yang dipilih', 'error')
    return
  }

  if (!confirm(`Hapus ${selectedAgendas.value.length} agenda yang dipilih? Tindakan ini tidak dapat dibatalkan.`)) {
    return
  }

  const originalAgendas = [...agendas.value]
  const idsToDelete = [...selectedAgendas.value]
  
  // Optimistic update
  agendas.value = agendas.value.filter(a => !idsToDelete.includes(a.id))
  clearSelection()

  try {
    // Delete each agenda
    await Promise.all(idsToDelete.map(id =>
      $fetch(`/api/admin/agenda/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        }
      })
    ))

    showToast(`${idsToDelete.length} agenda berhasil dihapus`, 'success')
  } catch (error) {
    console.error('Failed to delete multiple agendas:', error)
    agendas.value = originalAgendas
    showToast('Gagal menghapus beberapa agenda. Silakan coba lagi.', 'error')
  }
}


const getCategoryClass = (agenda) => {
  if (agenda.category_color) {
    // Convert hex color to appropriate Tailwind classes
    const color = agenda.category_color
    if (color === '#3B82F6' || color.toLowerCase() === 'blue') return 'bg-blue-100 text-blue-800'
    if (color === '#10B981' || color.toLowerCase() === 'green') return 'bg-green-100 text-green-800'
    if (color === '#8B5CF6' || color.toLowerCase() === 'purple') return 'bg-purple-100 text-purple-800'
    if (color === '#EF4444' || color.toLowerCase() === 'red') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Fallback to hardcoded classes
  const classes = {
    'Misa & Ibadat': 'bg-blue-100 text-blue-800',
    'Kegiatan Lingkungan': 'bg-green-100 text-green-800',
    'Rapat & Pertemuan': 'bg-purple-100 text-purple-800',
    'Acara Khusus': 'bg-red-100 text-red-800',
    'Lain-lain': 'bg-gray-100 text-gray-800'
  }
  return classes[agenda.category] || 'bg-gray-100 text-gray-800'
}

// Preview modal functions
const openPreview = (agenda) => {
  previewAgenda.value = agenda
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  previewAgenda.value = null
}

// Format date for display
const formatDateDisplay = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimeDisplay = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' WIB'
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = localStorage.getItem('admin_access_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchCategories(), fetchAgendas()])
})
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}
</style>
