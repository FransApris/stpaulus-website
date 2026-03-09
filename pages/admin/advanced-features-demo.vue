<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🚀 Advanced Features Demo</h1>
        <p class="mt-2 text-gray-600">Testing & Demo untuk 4 fitur advanced</p>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 1. Audit Log -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">1️⃣ Audit Log System</h2>
            <span class="text-3xl">📝</span>
          </div>
          <p class="text-gray-600 mb-4">Mencatat semua aksi yang terjadi di sistem</p>
          <div class="space-y-2">
            <button 
              @click="activeFeature = 'audit'" 
              class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Audit Logs
            </button>
            <div class="text-sm text-gray-500">
              <div>✅ Track: Create, Update, Delete, Approve, Reject</div>
              <div>✅ Record: User, IP, Time, Changes</div>
            </div>
          </div>
        </div>

        <!-- 2. Soft Delete -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">2️⃣ Soft Delete System</h2>
            <span class="text-3xl">🗑️</span>
          </div>
          <p class="text-gray-600 mb-4">Hapus dengan kemampuan restore</p>
          <div class="space-y-2">
            <button 
              @click="activeFeature = 'deleted'" 
              class="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              View Deleted Bookings
            </button>
            <div class="text-sm text-gray-500">
              <div>✅ Soft delete dengan timestamp</div>
              <div>✅ Restore capability</div>
              <div>✅ Permanent delete option</div>
            </div>
          </div>
        </div>

        <!-- 3. Booking History -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">3️⃣ Booking History</h2>
            <span class="text-3xl">📜</span>
          </div>
          <p class="text-gray-600 mb-4">Timeline perubahan status booking</p>
          <div class="space-y-2">
            <input 
              v-model="bookingIdForHistory" 
              type="number" 
              placeholder="Booking ID"
              class="w-full border rounded px-3 py-2 mb-2"
            >
            <button 
              @click="loadHistory" 
              class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              :disabled="!bookingIdForHistory"
            >
              View History
            </button>
            <div class="text-sm text-gray-500">
              <div>✅ Track status changes</div>
              <div>✅ Show who changed & when</div>
              <div>✅ Include reasons</div>
            </div>
          </div>
        </div>

        <!-- 4. Export Excel -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">4️⃣ Export to Excel</h2>
            <span class="text-3xl">📊</span>
          </div>
          <p class="text-gray-600 mb-4">Export data booking ke Excel</p>
          <div class="space-y-2">
            <button 
              @click="activeFeature = 'export'" 
              class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export Options
            </button>
            <div class="text-sm text-gray-500">
              <div>✅ 19 columns data lengkap</div>
              <div>✅ Filter by date & status</div>
              <div>✅ Include deleted option</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="activeFeature" class="bg-white rounded-lg shadow p-6">
        <!-- Close Button -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ getFeatureTitle() }}</h2>
          <button @click="activeFeature = null" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <!-- 1. Audit Logs View -->
        <div v-if="activeFeature === 'audit'">
          <AuditLogsView />
        </div>

        <!-- 2. Deleted Bookings View -->
        <div v-if="activeFeature === 'deleted'">
          <DeletedBookingsView />
        </div>

        <!-- 3. Booking History View -->
        <div v-if="activeFeature === 'history'">
          <BookingHistoryView :booking-id="bookingIdForHistory" />
        </div>

        <!-- 4. Export Options View -->
        <div v-if="activeFeature === 'export'">
          <ExportOptionsView />
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-500">Total Audit Logs</div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.auditLogs }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-500">Deleted Bookings</div>
          <div class="text-2xl font-bold text-orange-600">{{ stats.deletedBookings }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-500">History Records</div>
          <div class="text-2xl font-bold text-purple-600">{{ stats.historyRecords }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-500">Total Bookings</div>
          <div class="text-2xl font-bold text-green-600">{{ stats.totalBookings }}</div>
        </div>
      </div>

      <!-- Documentation Links -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="font-semibold text-blue-900 mb-3">📚 Dokumentasi</h3>
        <div class="space-y-2 text-sm text-blue-800">
          <div>• <code class="bg-blue-100 px-2 py-1 rounded">VIEWING_ADVANCED_FEATURES_GUIDE.md</code> - Panduan lengkap</div>
          <div>• <code class="bg-blue-100 px-2 py-1 rounded">ADVANCED_FEATURES_COMPLETE.md</code> - Overview fitur</div>
          <div>• <code class="bg-blue-100 px-2 py-1 rounded">ADVANCED_FEATURES_FIXED.md</code> - Detail implementasi</div>
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

const activeFeature = ref(null)
const bookingIdForHistory = ref('')
const stats = ref({
  auditLogs: 0,
  deletedBookings: 0,
  historyRecords: 0,
  totalBookings: 0
})

const getFeatureTitle = () => {
  const titles = {
    audit: '📝 Audit Log System',
    deleted: '🗑️ Deleted Bookings',
    history: '📜 Booking History',
    export: '📊 Export to Excel'
  }
  return titles[activeFeature.value] || ''
}

const loadHistory = () => {
  if (bookingIdForHistory.value) {
    activeFeature.value = 'history'
  }
}

const loadStats = async () => {
  try {
    // Load stats from APIs
    const [auditRes, deletedRes] = await Promise.all([
      $fetch('/api/admin/audit-logs?limit=1').catch(() => ({ pagination: { total: 0 } })),
      $fetch('/api/admin/deleted-bookings?limit=1').catch(() => ({ pagination: { total: 0 } }))
    ])
    
    stats.value.auditLogs = auditRes.pagination?.total || 0
    stats.value.deletedBookings = deletedRes.pagination?.total || 0
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}
</style>
