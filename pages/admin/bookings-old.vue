<template>
  <div class="space-y-6">
        <!-- Filter -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Filter Pemesanan</h2>
          <select v-model="filterStatus" @change="loadBookings" class="border p-2 rounded">
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <!-- Bookings List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Daftar Pemesanan</h2>
          <div v-if="bookings.length === 0" class="text-gray-500">Belum ada pemesanan.</div>
          <div v-else class="space-y-4">
            <div v-for="booking in bookings" :key="booking.id" class="border p-4 rounded">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ booking.event_name }}</h3>
                  <p>Ruangan: {{ booking.room_name }}</p>
                  <p>Pemesan: {{ booking.user_name }} ({{ booking.user_category }})</p>
                  <p>Unit: {{ booking.unit_name }}</p>
                  <p>Tanggal: {{ formatBookingDate(booking.start_time) }}</p>
                  <p>Waktu: {{ formatBookingTime(booking.start_time, booking.end_time) }}</p>
                  <p>Status: <span :class="getStatusClass(booking.status)">{{ booking.status }}</span></p>
                  <p v-if="booking.rejection_reason" class="text-red-600">Alasan Penolakan: {{ booking.rejection_reason }}</p>
                  <p v-if="booking.cancellation_reason" class="text-orange-600">Alasan Pembatalan: {{ booking.cancellation_reason }}</p>
                </div>
                <div class="space-y-2">
                  <!-- Tombol untuk status PENDING -->
                  <div v-if="booking.status === 'PENDING'" class="flex space-x-2">
                    <button @click="approveBooking(booking)" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Setujui</button>
                    <button @click="rejectBooking(booking)" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Tolak</button>
                  </div>
                  <!-- Tombol untuk status APPROVED -->
                  <div v-if="booking.status === 'APPROVED'" class="flex space-x-2">
                    <button @click="cancelBooking(booking)" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Batalkan</button>
                  </div>
                  <!-- Tombol Delete (untuk semua status) -->
                  <button @click="confirmDeleteBooking(booking)" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full">
                    🗑️ Hapus Pemesanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reject Modal -->
        <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 class="text-lg font-semibold mb-4">Tolak Pemesanan</h3>
            <p class="mb-4">Alasan penolakan:</p>
            <textarea v-model="rejectionReason" class="w-full border p-2 rounded" rows="3" required></textarea>
            <div class="flex justify-end space-x-2 mt-4">
              <button @click="showRejectModal = false" class="px-4 py-2 text-gray-600">Batal</button>
              <button @click="confirmReject" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Tolak</button>
            </div>
          </div>
        </div>

        <!-- Cancel Modal -->
        <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 class="text-lg font-semibold mb-4">Batalkan Pemesanan</h3>
            <p class="mb-2 text-gray-700">Pemesanan yang sudah disetujui akan dibatalkan.</p>
            <p class="mb-4 text-sm text-gray-600">Alasan pembatalan (opsional):</p>
            <textarea v-model="cancellationReason" class="w-full border p-2 rounded" rows="3" placeholder="Masukkan alasan pembatalan..."></textarea>
            <div class="flex justify-end space-x-2 mt-4">
              <button @click="showCancelModal = false" class="px-4 py-2 text-gray-600">Batal</button>
              <button @click="confirmCancel" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Batalkan Pemesanan</button>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div class="flex items-center mb-4">
              <svg class="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 class="text-lg font-semibold text-gray-900">Konfirmasi Hapus Pemesanan</h3>
            </div>
            <div class="mb-4">
              <p class="text-gray-700 mb-2">Apakah Anda yakin ingin menghapus pemesanan ini?</p>
              <div class="bg-gray-50 p-3 rounded border border-gray-200">
                <p class="text-sm font-semibold text-gray-900">{{ selectedBooking?.event_name }}</p>
                <p class="text-sm text-gray-600">{{ selectedBooking?.room_name }}</p>
                <p class="text-sm text-gray-600">{{ selectedBooking?.user_name }}</p>
              </div>
              <p class="text-red-600 text-sm mt-2 font-medium">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
            </div>
            <div class="flex justify-end space-x-2">
              <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Batal</button>
              <button @click="deleteBooking" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus Pemesanan</button>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const bookings = ref([])
const filterStatus = ref('PENDING')
const showRejectModal = ref(false)
const rejectionReason = ref('')
const selectedBooking = ref(null)
const showCancelModal = ref(false)
const cancellationReason = ref('')
const showDeleteModal = ref(false)

const loadBookings = async () => {
  try {
    const params = filterStatus.value ? `?status=${filterStatus.value}` : ''
    bookings.value = await $fetch(`/api/admin/bookings${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load bookings', err)
  }
}

onMounted(() => {
  loadBookings()
})

const approveBooking = async (booking) => {
  // Optimistic update: Update status immediately in UI
  const originalStatus = booking.status
  const index = bookings.value.findIndex(b => b.id === booking.id)
  if (index !== -1) {
    bookings.value[index].status = 'APPROVED'
  }
  
  try {
    await $fetch(`/api/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
      },
      body: { status: 'APPROVED' }
    })
    
    // Show success message without blocking
    setTimeout(() => {
      alert('Pemesanan berhasil disetujui')
    }, 100)
  } catch (err) {
    console.error('Error approving booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal menyetujui pemesanan'
    alert(`Error: ${errorMessage}`)
    
    // Rollback: Restore original status
    if (index !== -1) {
      bookings.value[index].status = originalStatus
    }
  }
}

const rejectBooking = (booking) => {
  selectedBooking.value = booking
  showRejectModal.value = true
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    alert('Alasan penolakan diperlukan')
    return
  }
  
  // Optimistic update: Update status immediately and close modal
  const originalStatus = selectedBooking.value.status
  const bookingId = selectedBooking.value.id
  const reason = rejectionReason.value
  const index = bookings.value.findIndex(b => b.id === bookingId)
  
  if (index !== -1) {
    bookings.value[index].status = 'REJECTED'
    bookings.value[index].rejection_reason = reason
  }
  
  // Close modal immediately
  showRejectModal.value = false
  const tempBooking = selectedBooking.value
  selectedBooking.value = null
  rejectionReason.value = ''
  
  try {
    await $fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
      },
      body: { status: 'REJECTED', rejection_reason: reason }
    })
    
    // Show success message without blocking
    setTimeout(() => {
      alert('Pemesanan berhasil ditolak')
    }, 100)
  } catch (err) {
    console.error('Error rejecting booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal menolak pemesanan'
    alert(`Error: ${errorMessage}`)
    
    // Rollback: Restore original status
    if (index !== -1) {
      bookings.value[index].status = originalStatus
      delete bookings.value[index].rejection_reason
    }
  }
}

const cancelBooking = (booking) => {
  selectedBooking.value = booking
  showCancelModal.value = true
  cancellationReason.value = ''
}

const confirmCancel = async () => {
  // Optimistic update: Update status immediately and close modal
  const originalStatus = selectedBooking.value.status
  const bookingId = selectedBooking.value.id
  const reason = cancellationReason.value
  const index = bookings.value.findIndex(b => b.id === bookingId)
  
  if (index !== -1) {
    bookings.value[index].status = 'CANCELLED'
    if (reason) {
      bookings.value[index].cancellation_reason = reason
    }
  }
  
  // Close modal immediately
  showCancelModal.value = false
  const tempBooking = selectedBooking.value
  selectedBooking.value = null
  cancellationReason.value = ''
  
  try {
    const body = { status: 'CANCELLED' }
    if (reason) {
      body.cancellation_reason = reason
    }
    
    await $fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
      },
      body
    })
    
    // Show success message without blocking
    setTimeout(() => {
      alert('Pemesanan berhasil dibatalkan')
    }, 100)
  } catch (err) {
    console.error('Error cancelling booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal membatalkan pemesanan'
    alert(`Error: ${errorMessage}`)
    
    // Rollback: Restore original status
    if (index !== -1) {
      bookings.value[index].status = originalStatus
      delete bookings.value[index].cancellation_reason
    }
  }
}

const confirmDeleteBooking = (booking) => {
  selectedBooking.value = booking
  showDeleteModal.value = true
}

const deleteBooking = async () => {
  const bookingId = selectedBooking.value.id
  const index = bookings.value.findIndex(b => b.id === bookingId)
  
  // Optimistic update: Remove from list immediately
  const deletedBooking = bookings.value[index]
  if (index !== -1) {
    bookings.value.splice(index, 1)
  }
  
  // Close modal immediately
  showDeleteModal.value = false
  selectedBooking.value = null
  
  try {
    await $fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_access_token')}`
      }
    })
    
    // Show success message without blocking
    setTimeout(() => {
      alert('Pemesanan berhasil dihapus')
    }, 100)
  } catch (err) {
    console.error('Error deleting booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal menghapus pemesanan'
    alert(`Error: ${errorMessage}`)
    
    // Rollback: Restore deleted booking
    if (index !== -1) {
      bookings.value.splice(index, 0, deletedBooking)
    }
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600'
    case 'PENDING': return 'text-yellow-600'
    case 'REJECTED': return 'text-red-600'
    case 'CANCELLED': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

const formatBookingDate = (dateTime) => {
  const date = new Date(dateTime)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatBookingTime = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const startTimeStr = start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const endTimeStr = end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return `${startTimeStr} - ${endTimeStr}`
}
</script>
