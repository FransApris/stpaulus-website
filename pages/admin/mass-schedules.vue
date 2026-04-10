<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Jadwal Misa & Devosi</h1>
      <p class="text-gray-600">Kelola jadwal misa rutin, misa khusus, dan devosi untuk paroki</p>
    </div>

    <!-- Navigation Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button @click="activeTab = 'regular'"
          :class="activeTab === 'regular' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200">
          Jadwal Rutin
        </button>
        <button @click="activeTab = 'special'"
          :class="activeTab === 'special' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200">
          Misa Khusus
        </button>
        <button @click="activeTab = 'devotion'"
          :class="activeTab === 'devotion' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200">
          Devosi
        </button>
      </nav>
    </div>

    <!-- Regular Mass Schedules Tab -->
    <div v-if="activeTab === 'regular'">
      <!-- Add Regular Schedule Button -->
      <div class="mb-6">
        <button @click="showAddRegularModal = true"
          class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Tambah Jadwal Rutin
        </button>
      </div>

      <!-- Regular Schedules List -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-gray-600">Memuat jadwal...</p>
        </div>

        <div v-else-if="regularSchedules.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal rutin</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat jadwal misa rutin pertama.</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-4">
            <div v-for="schedule in regularSchedules" :key="schedule.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-900">{{ schedule.mass_type }}</h4>
                  <div class="mt-2 space-y-1 text-sm text-gray-600">
                    <p><span class="font-medium">Hari:</span> {{ schedule.day_of_week }}</p>
                    <p><span class="font-medium">Waktu:</span> {{ schedule.time }}</p>
                    <p><span class="font-medium">Status:</span>
                      <span :class="schedule.is_active ? 'text-green-600' : 'text-red-600'">
                        {{ schedule.is_active ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button @click="editRegularSchedule(schedule)" class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>
                  <button @click="toggleRegularSchedule(schedule)"
                    :class="schedule.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1" :title="schedule.is_active ? 'Nonaktifkan' : 'Aktifkan'">
                    <svg v-if="schedule.is_active" class="w-5 h-5" fill="none" stroke="currentColor"
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
                  <button @click="deleteRegularSchedule(schedule)" class="text-red-600 hover:text-red-800 p-1"
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

    <!-- Special Mass Schedules Tab -->
    <div v-if="activeTab === 'special'">
      <!-- Add Special Schedule Button -->
      <div class="mb-6">
        <button @click="openAddSpecialModal"
          class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Tambah Misa Khusus
        </button>
      </div>

      <!-- Special Schedules List -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-gray-600">Memuat jadwal...</p>
        </div>

        <div v-else-if="specialSchedules.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada misa khusus</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat jadwal misa khusus pertama.</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-4">
            <div v-for="schedule in specialSchedules" :key="schedule.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-900">{{ schedule.title }}</h4>
                  <div class="mt-2 space-y-1 text-sm text-gray-600">
                    <p><span class="font-medium">Tanggal:</span> {{ formatDate(schedule.date) }}</p>
                    <p><span class="font-medium">Waktu:</span> {{ schedule.time }}</p>
                    <p><span class="font-medium">Lokasi:</span> {{ schedule.location }}</p>
                    <p v-if="schedule.priest_name"><span class="font-medium">Umat:</span> {{ schedule.priest_name }}</p>
                    <p><span class="font-medium">Status:</span>
                      <span :class="schedule.status === 'active' ? 'text-green-600' : 'text-red-600'">
                        {{ schedule.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                      </span>
                    </p>
                  </div>
                  <p v-if="schedule.notes" class="mt-2 text-sm text-gray-500">{{ schedule.notes }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="editSpecialSchedule(schedule)" class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>
                  <button @click="toggleSpecialSchedule(schedule)"
                    :class="schedule.status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1" :title="schedule.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'">
                    <svg v-if="schedule.status === 'active'" class="w-5 h-5" fill="none" stroke="currentColor"
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
                  <button @click="deleteSpecialSchedule(schedule)" class="text-red-600 hover:text-red-800 p-1"
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

    <!-- Devotions Tab -->
    <div v-if="activeTab === 'devotion'">
      <DevotionsList :devotions="devotions" :loading="loading" @openAddModal="openAddDevotionModal" @edit="editDevotion"
        @toggle="toggleDevotion" @delete="deleteDevotion" />
    </div>

    <!-- Add/Edit Regular Schedule Modal -->
    <div v-if="showAddRegularModal || showEditRegularModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditRegularModal ? 'Edit Jadwal Rutin' : 'Tambah Jadwal Rutin' }}
          </h3>

          <form @submit.prevent="saveRegularSchedule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Misa</label>
              <input v-model="regularForm.mass_type" type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Contoh: Misa Pagi, Misa Sore"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
              <select v-model="regularForm.day_of_week" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required>
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
              <input v-model="regularForm.time" type="time" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required />
            </div>

            <div class="flex items-center">
              <input v-model="regularForm.is_active" type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeRegularModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Special Schedule Modal -->
    <div v-if="showAddSpecialModal || showEditSpecialModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditSpecialModal ? 'Edit Misa Khusus' : 'Tambah Misa Khusus' }}
          </h3>

          <form @submit.prevent="saveSpecialSchedule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Misa</label>
              <input v-model="specialForm.title" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Misa Jumat Pertama, Misa Hari Raya" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input v-model="specialForm.date" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
              <input v-model="specialForm.time" type="time" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Liturgi</label>
              <select v-model="specialForm.liturgy_type_id" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required :disabled="liturgyTypesLoading">
                <option value="">
                  {{ liturgyTypesLoading ? 'Memuat...' : liturgyTypes.length === 0 ? 'Tidak ada jenis liturgi aktif' :
                    'Pilih Jenis Liturgi' }}
                </option>
                <option v-for="type in liturgyTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input v-model="specialForm.location" type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Contoh: Gereja Utama"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Umat (Opsional)</label>
              <input v-model="specialForm.priest_name" type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Nama umat yang memimpin" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
              <textarea v-model="specialForm.notes" class="w-full border border-gray-300 rounded-md px-3 py-2" rows="3"
                placeholder="Catatan tambahan"></textarea>
            </div>

            <div class="flex items-center">
              <input v-model="specialForm.isActive" type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeSpecialModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Devotion Modal -->
    <div v-if="showAddDevotionModal || showEditDevotionModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeDevotionModal">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditDevotionModal ? 'Edit Jadwal Devosi' : 'Tambah Jadwal Devosi' }}
          </h3>

          <form @submit.prevent="saveDevotion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
              <input v-model="devotionForm.title" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Jalan Salib Jumat Sore" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Devosi *</label>
              <select v-model="devotionForm.type" class="w-full border border-gray-300 rounded-md px-3 py-2" required>
                <option value="">Pilih Jenis Devosi</option>
                <option v-for="type in devotionTypes" :key="type.value" :value="type.value">
                  {{ type.icon }} {{ type.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hari *</label>
              <select v-model="devotionForm.day_of_week" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required>
                <option value="">Pilih Hari</option>
                <option value="Minggu">Minggu</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Waktu *</label>
              <input v-model="devotionForm.time" type="time" class="w-full border border-gray-300 rounded-md px-3 py-2"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input v-model="devotionForm.location" type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Gereja Utama" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea v-model="devotionForm.description" class="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3" placeholder="Deskripsi tambahan tentang devosi ini"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Urutan Tampilan</label>
              <input v-model.number="devotionForm.display_order" type="number"
                class="w-full border border-gray-300 rounded-md px-3 py-2" min="0" placeholder="0" />
            </div>

            <div class="flex items-center">
              <input v-model="devotionForm.is_active" type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeDevotionModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DevotionsList from '~/components/admin/DevotionsList.vue'

definePageMeta({
  layout: 'admin'
})

// Tab management
const activeTab = ref('regular')

// Data
const regularSchedules = ref([])
const specialSchedules = ref([])
const devotions = ref([])
const liturgyTypes = ref([])
const liturgyTypesLoading = ref(false)
const loading = ref(false)
const saving = ref(false)

// Modal states
const showAddRegularModal = ref(false)
const showEditRegularModal = ref(false)
const showAddSpecialModal = ref(false)
const showEditSpecialModal = ref(false)
const showAddDevotionModal = ref(false)
const showEditDevotionModal = ref(false)

// Forms
const regularForm = ref({
  id: null,
  mass_type: '',
  day_of_week: '',
  time: '',
  is_active: true
})

const specialForm = ref({
  id: null,
  title: '',
  date: '',
  time: '',
  liturgy_type_id: null,
  location: 'Gereja Utama',
  priest_name: '',
  notes: '',
  isActive: true
})

const devotionForm = ref({
  id: null,
  title: '',
  type: '',
  day_of_week: '',
  time: '',
  location: 'Gereja Utama',
  description: '',
  is_active: true,
  display_order: 0
})

// Devotion types for dropdown
const devotionTypes = [
  { value: 'jalan_salib', label: 'Jalan Salib', icon: '✝️' },
  { value: 'doa_novena', label: 'Doa Novena', icon: '📿' },
  { value: 'doa_rosario', label: 'Doa Rosario', icon: '📿' },
  { value: 'adorasi', label: 'Adorasi (Sakramen Mahakudus)', icon: '🕯️' }
]

// Fetch data
const fetchRegularSchedules = async () => {
  try {
    const response = await $fetch('/api/admin/regular-mass-schedules', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    regularSchedules.value = response
  } catch (error) {
    console.error('Failed to fetch regular schedules:', error)
  }
}

const fetchSpecialSchedules = async () => {
  try {
    const response = await $fetch('/api/admin/liturgy-schedules', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    // Handle paginated response - extract schedules array
    specialSchedules.value = response.schedules || response || []
  } catch (error) {
    console.error('Failed to fetch special schedules:', error)
  }
}

const fetchLiturgyTypes = async () => {
  liturgyTypesLoading.value = true
  try {
    console.log('[Mass Schedules] Fetching liturgy types...')
    const response = await $fetch('/api/admin/liturgy-types', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    console.log('[Mass Schedules] Liturgy types response:', response)
    // API now returns array directly
    liturgyTypes.value = (response || []).filter(type => type.is_active)
    console.log('[Mass Schedules] Filtered active liturgy types:', liturgyTypes.value.length)
  } catch (error) {
    console.error('[Mass Schedules] Failed to fetch liturgy types:', error)
    // Show error message inside modal instead of alert
    liturgyTypes.value = []
  } finally {
    liturgyTypesLoading.value = false
  }
}

// Regular schedule functions
const saveRegularSchedule = async () => {
  // Optimistic update: Clone form data before closing modal
  const formData = { ...regularForm.value }
  const wasEditing = !!formData.id
  const isEditing = !!regularForm.value.id

  saving.value = true

  try {
    const url = formData.id
      ? `/api/admin/regular-mass-schedules/${formData.id}`
      : '/api/admin/regular-mass-schedules'

    const method = formData.id ? 'PUT' : 'POST'

    // Close modal immediately for instant UX
    closeRegularModal()

    // Save to server in background
    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: formData
    })

    // Update UI instantly with server response
    if (wasEditing) {
      const index = regularSchedules.value.findIndex(s => s.id === formData.id)
      if (index !== -1) {
        regularSchedules.value[index] = result.schedule || result
      }
    } else {
      // Add new schedule to top of list
      regularSchedules.value.unshift(result.schedule || result)
    }

    // Show success message without blocking
    setTimeout(() => {
      alert(isEditing ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan')
    }, 100)
  } catch (error) {
    console.error('Failed to save regular schedule:', error)
    alert('Gagal menyimpan jadwal')
    // Rollback: Re-fetch to ensure data consistency
    await fetchRegularSchedules()
  } finally {
    saving.value = false
  }
}

const editRegularSchedule = (schedule) => {
  regularForm.value = { ...schedule }
  showEditRegularModal.value = true
}

const toggleRegularSchedule = async (schedule) => {
  try {
    await $fetch(`/api/admin/regular-mass-schedules/${schedule.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...schedule, is_active: !schedule.is_active }
    })

    await fetchRegularSchedules()
  } catch (error) {
    console.error('Failed to toggle regular schedule:', error)
    alert('Gagal mengubah status jadwal')
  }
}

const deleteRegularSchedule = async (schedule) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus jadwal "${schedule.mass_type}"?`)) {
    return
  }

  // Optimistic update: Remove from UI immediately
  const deletedSchedule = { ...schedule }
  const index = regularSchedules.value.findIndex(s => s.id === schedule.id)
  if (index !== -1) {
    regularSchedules.value.splice(index, 1)
  }

  try {
    await $fetch(`/api/admin/regular-mass-schedules/${schedule.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Show success message without blocking
    setTimeout(() => {
      alert('Jadwal berhasil dihapus')
    }, 100)
  } catch (error) {
    console.error('Failed to delete regular schedule:', error)
    alert('Gagal menghapus jadwal')
    // Rollback: Re-add the deleted schedule
    if (index !== -1) {
      regularSchedules.value.splice(index, 0, deletedSchedule)
    }
  }
}

// Special schedule functions
const saveSpecialSchedule = async () => {
  // Optimistic update: Clone form data before closing modal
  const formData = { ...specialForm.value }
  const wasEditing = !!formData.id
  const isEditing = !!specialForm.value.id

  saving.value = true

  try {
    const url = formData.id
      ? `/api/admin/liturgy-schedules/${formData.id}`
      : '/api/admin/liturgy-schedules'

    const method = formData.id ? 'PUT' : 'POST'

    // Prepare the payload with correct field names
    const payload = {
      ...formData,
      status: formData.isActive ? 'active' : 'inactive'
    }
    delete payload.isActive

    // Close modal immediately for instant UX
    closeSpecialModal()

    // Save to server in background
    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    // Update UI instantly with server response
    if (wasEditing) {
      const index = specialSchedules.value.findIndex(s => s.id === formData.id)
      if (index !== -1) {
        specialSchedules.value[index] = result.schedule || result
      }
    } else {
      // Add new schedule to top of list
      specialSchedules.value.unshift(result.schedule || result)
    }

    // Show success message without blocking
    setTimeout(() => {
      alert(isEditing ? 'Misa khusus berhasil diperbarui' : 'Misa khusus berhasil ditambahkan')
    }, 100)
  } catch (error) {
    console.error('Failed to save special schedule:', error)
    alert('Gagal menyimpan misa khusus')
    // Rollback: Re-fetch to ensure data consistency
    await fetchSpecialSchedules()
  } finally {
    saving.value = false
  }
}

const editSpecialSchedule = async (schedule) => {
  // Convert date to YYYY-MM-DD format if it's an ISO timestamp
  let formattedDate = schedule.date
  if (typeof schedule.date === 'string' && schedule.date.includes('T')) {
    formattedDate = schedule.date.split('T')[0]
  }

  specialForm.value = {
    ...schedule,
    date: formattedDate,
    isActive: schedule.status === 'active'
  }
  showEditSpecialModal.value = true
  await fetchLiturgyTypes()
}

const toggleSpecialSchedule = async (schedule) => {
  try {
    await $fetch(`/api/admin/liturgy-schedules/${schedule.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...schedule, status: schedule.status === 'active' ? 'inactive' : 'active' }
    })

    await fetchSpecialSchedules()
  } catch (error) {
    console.error('Failed to toggle special schedule:', error)
    alert('Gagal mengubah status misa khusus')
  }
}

const deleteSpecialSchedule = async (schedule) => {
  const title = schedule.title || 'Jadwal Misa'
  if (!confirm(`Apakah Anda yakin ingin menghapus misa "${title}"?`)) {
    return
  }

  // Optimistic update: Remove from UI immediately
  const deletedSchedule = { ...schedule }
  const index = specialSchedules.value.findIndex(s => s.id === schedule.id)
  if (index !== -1) {
    specialSchedules.value.splice(index, 1)
  }

  try {
    await $fetch(`/api/admin/liturgy-schedules/${schedule.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Show success message without blocking
    setTimeout(() => {
      alert('Misa khusus berhasil dihapus')
    }, 100)
  } catch (error) {
    console.error('Failed to delete special schedule:', error)
    alert('Gagal menghapus misa khusus')
    // Rollback: Re-add the deleted schedule
    if (index !== -1) {
      specialSchedules.value.splice(index, 0, deletedSchedule)
    }
  }
}

// Modal functions
const openAddSpecialModal = async () => {
  showAddSpecialModal.value = true
  await fetchLiturgyTypes()
}

const closeRegularModal = () => {
  showAddRegularModal.value = false
  showEditRegularModal.value = false
  regularForm.value = {
    id: null,
    mass_type: '',
    day_of_week: '',
    time: '',
    is_active: true
  }
}

const closeSpecialModal = () => {
  showAddSpecialModal.value = false
  showEditSpecialModal.value = false
  specialForm.value = {
    id: null,
    title: '',
    date: '',
    time: '',
    liturgy_type_id: null,
    location: 'Gereja Utama',
    priest_name: '',
    notes: '',
    isActive: true
  }
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Format tanggal tidak valid'

  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Devotion functions
const fetchDevotions = async () => {
  loading.value = true
  try {
    const result = await $fetch('/api/admin/devotions', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    devotions.value = result.data || []
  } catch (error) {
    console.error('Failed to fetch devotions:', error)
    alert('Gagal memuat data devosi')
  } finally {
    loading.value = false
  }
}

const openAddDevotionModal = () => {
  devotionForm.value = {
    id: null,
    title: '',
    type: '',
    day_of_week: '',
    time: '',
    location: 'Gereja Utama',
    description: '',
    is_active: true,
    display_order: 0
  }
  showAddDevotionModal.value = true
}

const editDevotion = (devotion) => {
  devotionForm.value = {
    id: devotion.id,
    title: devotion.title,
    type: devotion.type,
    day_of_week: devotion.day_of_week,
    time: devotion.time,
    location: devotion.location || 'Gereja Utama',
    description: devotion.description || '',
    is_active: devotion.is_active === 1,
    display_order: devotion.display_order || 0
  }
  showEditDevotionModal.value = true
}

const saveDevotion = async () => {
  const formData = { ...devotionForm.value }
  const isEditing = !!formData.id

  saving.value = true

  try {
    const url = formData.id
      ? `/api/admin/devotions/${formData.id}`
      : '/api/admin/devotions'

    const method = formData.id ? 'PUT' : 'POST'

    // Prepare payload
    const payload = {
      ...formData,
      is_active: formData.is_active ? 1 : 0
    }

    // Close modal immediately for instant UX
    closeDevotionModal()

    // Save to server in background
    const result = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    // Optimistic update
    if (isEditing) {
      const index = devotions.value.findIndex(d => d.id === formData.id)
      if (index !== -1) {
        devotions.value[index] = { ...devotions.value[index], ...payload }
      }
    } else {
      devotions.value.push({ ...payload, id: result.data.id })
    }

    // Show success message without blocking
    setTimeout(() => {
      alert(isEditing ? 'Devosi berhasil diupdate' : 'Devosi berhasil ditambahkan')
    }, 100)
  } catch (error) {
    console.error('Failed to save devotion:', error)
    alert('Gagal menyimpan devosi')

    // Reload to ensure data consistency
    await fetchDevotions()
  } finally {
    saving.value = false
  }
}

const toggleDevotion = async (devotion) => {
  const newStatus = devotion.is_active === 1 ? 0 : 1

  // Optimistic update
  const index = devotions.value.findIndex(d => d.id === devotion.id)
  if (index !== -1) {
    devotions.value[index].is_active = newStatus
  }

  try {
    await $fetch(`/api/admin/devotions/${devotion.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...devotion,
        is_active: newStatus
      }
    })

    setTimeout(() => {
      alert(`Devosi berhasil ${newStatus === 1 ? 'diaktifkan' : 'dinonaktifkan'}`)
    }, 100)
  } catch (error) {
    console.error('Failed to toggle devotion:', error)
    alert('Gagal mengubah status devosi')

    // Revert on error
    if (index !== -1) {
      devotions.value[index].is_active = devotion.is_active
    }
  }
}

const deleteDevotion = async (devotion) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus devosi "${devotion.title}"?`)) {
    return
  }

  // Optimistic delete
  const originalDevotions = [...devotions.value]
  devotions.value = devotions.value.filter(d => d.id !== devotion.id)

  try {
    await $fetch(`/api/admin/devotions/${devotion.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    setTimeout(() => {
      alert('Devosi berhasil dihapus')
    }, 100)
  } catch (error) {
    console.error('Failed to delete devotion:', error)
    alert('Gagal menghapus devosi')

    // Revert on error
    devotions.value = originalDevotions
  }
}

const closeDevotionModal = () => {
  showAddDevotionModal.value = false
  showEditDevotionModal.value = false
  devotionForm.value = {
    id: null,
    title: '',
    type: '',
    day_of_week: '',
    time: '',
    location: 'Gereja Utama',
    description: '',
    is_active: true,
    display_order: 0
  }
}

// Initialize
onMounted(async () => {
  await Promise.all([fetchRegularSchedules(), fetchSpecialSchedules(), fetchDevotions()])
})
</script>
