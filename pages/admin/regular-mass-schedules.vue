<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Jadwal Misa Rutin dan Khusus</h1>
      <p class="text-gray-600">Kelola jadwal misa rutin mingguan dan misa khusus untuk paroki</p>
    </div>

    <!-- Navigation Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          @click="activeTab = 'regular'"
          :class="activeTab === 'regular' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
        >
          Jadwal Rutin
        </button>
        <button
          @click="activeTab = 'special'"
          :class="activeTab === 'special' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200"
        >
          Misa Khusus
        </button>
      </nav>
    </div>

    <!-- Regular Mass Schedules Tab -->
    <div v-if="activeTab === 'regular'">
      <!-- Add Regular Schedule Button -->
      <div class="mb-6">
        <button
          @click="showAddRegularModal = true"
          class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
        >
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal rutin</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat jadwal misa rutin pertama.</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-4">
            <div
              v-for="schedule in regularSchedules"
              :key="schedule.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
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
                  <button
                    @click="editRegularSchedule(schedule)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="toggleRegularSchedule(schedule)"
                    :class="schedule.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1"
                    :title="schedule.is_active ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <svg v-if="schedule.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteRegularSchedule(schedule)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
        <button
          @click="showAddSpecialModal = true"
          class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
        >
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada misa khusus</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat jadwal misa khusus pertama.</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-4">
            <div
              v-for="schedule in specialSchedules"
              :key="schedule.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
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
                  <button
                    @click="editSpecialSchedule(schedule)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="toggleSpecialSchedule(schedule)"
                    :class="schedule.status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1"
                    :title="schedule.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <svg v-if="schedule.status === 'active'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteSpecialSchedule(schedule)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Regular Schedule Modal -->
    <div
      v-if="showAddRegularModal || showEditRegularModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeRegularModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditRegularModal ? 'Edit Jadwal Rutin' : 'Tambah Jadwal Rutin' }}
          </h3>

          <form @submit.prevent="saveRegularSchedule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Misa</label>
              <input
                v-model="regularForm.mass_type"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Misa Pagi, Misa Sore"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
              <select
                v-model="regularForm.day_of_week"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
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
              <input
                v-model="regularForm.time"
                type="time"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="regularForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeRegularModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Special Schedule Modal -->
    <div
      v-if="showAddSpecialModal || showEditSpecialModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeSpecialModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditSpecialModal ? 'Edit Misa Khusus' : 'Tambah Misa Khusus' }}
          </h3>

          <form @submit.prevent="saveSpecialSchedule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Misa</label>
              <input
                v-model="specialForm.title"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Misa Jumat Pertama, Misa Hari Raya"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                v-model="specialForm.date"
                type="date"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
              <input
                v-model="specialForm.time"
                type="time"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Liturgi</label>
              <input
                v-model="specialForm.liturgy_type"
                type="text"
                placeholder="Cth: Ekaristi, Sabda, Novena"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                v-model="specialForm.location"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Gereja Utama"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Umat (Opsional)</label>
              <input
                v-model="specialForm.priest_name"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Nama umat yang memimpin"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
              <textarea
                v-model="specialForm.notes"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="Catatan tambahan"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input
                v-model="specialForm.status"
                value="active"
                type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeSpecialModal"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-[#882f1d] text-white rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
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
definePageMeta({
  layout: 'admin'
})

// Tab management
const activeTab = ref('regular')

// Data
const regularSchedules = ref([])
const specialSchedules = ref([])
const liturgyTypes = ref([])
const loading = ref(false)
const saving = ref(false)

// Modal states
const showAddRegularModal = ref(false)
const showEditRegularModal = ref(false)
const showAddSpecialModal = ref(false)
const showEditSpecialModal = ref(false)

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
  liturgy_type: '',
  location: 'Gereja Utama',
  priest_name: '',
  notes: '',
  status: 'active'
})

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
    specialSchedules.value = response.schedules || []
  } catch (error) {
    console.error('Failed to fetch special schedules:', error)
  }
}

const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/liturgy/types')
    liturgyTypes.value = response.types || []
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
  }
}

// Regular schedule functions
const saveRegularSchedule = async () => {
  saving.value = true
  try {
    const url = regularForm.value.id
      ? `/api/admin/regular-mass-schedules/${regularForm.value.id}`
      : '/api/admin/regular-mass-schedules'

    const method = regularForm.value.id ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: regularForm.value
    })

    alert(regularForm.value.id ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan')
    closeRegularModal()
    await fetchRegularSchedules()
  } catch (error) {
    console.error('Failed to save regular schedule:', error)
    alert('Gagal menyimpan jadwal')
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

  try {
    await $fetch(`/api/admin/regular-mass-schedules/${schedule.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    alert('Jadwal berhasil dihapus')
    await fetchRegularSchedules()
  } catch (error) {
    console.error('Failed to delete regular schedule:', error)
    alert('Gagal menghapus jadwal')
  }
}

// Special schedule functions
const saveSpecialSchedule = async () => {
  saving.value = true
  try {
    const url = specialForm.value.id
      ? `/api/admin/liturgy-schedules/${specialForm.value.id}`
      : '/api/admin/liturgy-schedules'

    const method = specialForm.value.id ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`,
        'Content-Type': 'application/json'
      },
      body: specialForm.value
    })

    alert(specialForm.value.id ? 'Misa khusus berhasil diperbarui' : 'Misa khusus berhasil ditambahkan')
    closeSpecialModal()
    await fetchSpecialSchedules()
  } catch (error) {
    console.error('Failed to save special schedule:', error)
    alert('Gagal menyimpan misa khusus')
  } finally {
    saving.value = false
  }
}

const editSpecialSchedule = (schedule) => {
  specialForm.value = { ...schedule }
  showEditSpecialModal.value = true
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
  if (!confirm(`Apakah Anda yakin ingin menghapus misa "${schedule.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/liturgy-schedules/${schedule.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    alert('Misa khusus berhasil dihapus')
    await fetchSpecialSchedules()
  } catch (error) {
    console.error('Failed to delete special schedule:', error)
    alert('Gagal menghapus misa khusus')
  }
}

// Modal functions
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
    liturgy_type: '',
    location: 'Gereja Utama',
    priest_name: '',
    notes: '',
    status: 'active'
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Initialize
onMounted(async () => {
  await Promise.all([fetchRegularSchedules(), fetchSpecialSchedules(), fetchLiturgyTypes()])
})
</script>
