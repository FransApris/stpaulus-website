<template>
  <div class="flex flex-col h-[calc(100vh-12rem)]">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-cinzel text-gray-900">Pesan Masuk</h1>
      <div class="flex items-center space-x-4">
        <div class="text-sm text-gray-600">
          Total: {{ pagination.total_messages }} pesan
        </div>
        <button
          @click="fetchMessages(pagination.current_page)"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          title="Refresh"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content with Sidebar -->
    <div class="flex-1 flex bg-white shadow-sm rounded-lg overflow-hidden">
      <!-- Sidebar - Message List -->
      <div class="w-96 border-r border-gray-200 flex flex-col">
        <!-- Filter Tabs -->
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              @click="filterStatus = 'all'"
              :class="filterStatus === 'all' ? 'border-b-2 border-[#882f1d] text-[#882f1d]' : 'text-gray-600 hover:text-gray-900'"
              class="flex-1 px-4 py-3 text-sm font-medium"
            >
              Semua ({{ pagination.total_messages }})
            </button>
            <button
              @click="filterStatus = 'unread'"
              :class="filterStatus === 'unread' ? 'border-b-2 border-[#882f1d] text-[#882f1d]' : 'text-gray-600 hover:text-gray-900'"
              class="flex-1 px-4 py-3 text-sm font-medium"
            >
              Belum Dibaca ({{ unreadCount }})
            </button>
          </div>
        </div>

        <!-- Message List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
          </div>
          
          <div v-else-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p class="text-sm">Tidak ada pesan</p>
          </div>

          <div v-else>
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              @click="viewMessage(message.id)"
              :class="[
                'p-4 border-b border-gray-200 cursor-pointer transition-colors',
                selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-[#882f1d]' : 'hover:bg-gray-50',
                !message.is_read ? 'bg-blue-50/30' : ''
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                  <div
                    :class="message.is_read ? 'bg-gray-300' : 'bg-blue-500'"
                    class="w-2 h-2 rounded-full flex-shrink-0"
                  ></div>
                  <h3 :class="message.is_read ? 'font-normal' : 'font-semibold'" class="text-sm text-gray-900 truncate">
                    {{ message.name }}
                  </h3>
                </div>
                <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {{ formatShortDate(message.created_at) }}
                </span>
              </div>
              <p class="text-xs text-gray-600 mb-1">{{ message.email }}</p>
              <p class="text-xs text-gray-600 mb-1">{{ message.phone }}</p>
              <p class="text-sm text-gray-700 line-clamp-2">{{ message.message_preview }}</p>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="border-t border-gray-200 p-3 flex items-center justify-between bg-gray-50">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.has_prev"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
          >
            ← Sebelumnya
          </button>
          <span class="text-xs text-gray-600">
            Hal {{ pagination.current_page }} / {{ pagination.total_pages }}
          </span>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.has_next"
            class="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
          >
            Selanjutnya →
          </button>
        </div>
      </div>

      <!-- Main Content - Message Detail -->
      <div class="flex-1 flex flex-col">
        <!-- Empty State -->
        <div v-if="!selectedMessage" class="flex-1 flex flex-col items-center justify-center text-gray-500">
          <svg class="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <p class="text-lg font-medium">Pilih pesan untuk melihat detail</p>
          <p class="text-sm mt-1">Klik pada pesan di sidebar untuk membaca isinya</p>
        </div>

        <!-- Message Detail -->
        <div v-else class="flex-1 flex flex-col">
          <!-- Message Header -->
          <div class="border-b border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-10 h-10 rounded-full bg-[#882f1d] flex items-center justify-center text-white font-semibold">
                    {{ selectedMessage?.name?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ selectedMessage?.name || 'N/A' }}</h2>
                    <p class="text-sm text-gray-600">{{ selectedMessage?.email || 'N/A' }}</p>
                    <p class="text-sm text-gray-600">{{ selectedMessage?.phone || 'N/A' }}</p>
                  </div>
                </div>
                <p class="text-sm text-gray-500">
                  Dikirim pada {{ selectedMessage?.created_at ? formatDate(selectedMessage.created_at) : 'N/A' }}
                </p>
              </div>
              <button
                @click="deleteMessage(selectedMessage.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Hapus pesan"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Message Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="prose max-w-none">
              <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ selectedMessage?.message || 'Tidak ada pesan' }}</p>
              </div>
            </div>
          </div>

          <!-- Message Actions -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <a
                  :href="`mailto:${selectedMessage?.email || ''}`"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Balas via Email
                </a>
              </div>
              <button
                @click="closeDetail"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  middleware: 'auth',
  layout: 'admin'
})

const messages = ref([])
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_messages: 0,
  has_next: false,
  has_prev: false
})
const selectedMessage = ref(null)
const loading = ref(false)
const filterStatus = ref('all')
const toast = ref({ show: false, message: '', type: 'success' })

// Toast notification function
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Computed properties
const unreadCount = computed(() => {
  return messages.value.filter(m => !m.is_read).length
})

const filteredMessages = computed(() => {
  if (filterStatus.value === 'unread') {
    return messages.value.filter(m => !m.is_read)
  }
  return messages.value
})

// Fetch messages
const fetchMessages = async (page = 1) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/admin/contact-messages?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    messages.value = response.messages
    pagination.value = response.pagination
  } catch (error) {
    if (error.statusCode === 401) {
      sessionStorage.removeItem('admin_token')
      navigateTo('/admin/login')
      return
    }
    console.error('Error fetching messages:', error)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchMessages(page)
    selectedMessage.value = null
  }
}

// View message detail
const viewMessage = async (id) => {
  try {
    const message = await $fetch(`/api/admin/contact-messages/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    
    console.log('Received message:', message)
    
    // Ensure message has all required properties
    if (message && message.id) {
      selectedMessage.value = message
      
      // Update is_read status in the list
      const messageIndex = messages.value.findIndex(m => m.id === id)
      if (messageIndex !== -1) {
        messages.value[messageIndex].is_read = true
      }
    } else {
      showToast('Data pesan tidak lengkap', 'error')
      console.error('Invalid message structure:', message)
    }
  } catch (error) {
    if (error.statusCode === 401) {
      sessionStorage.removeItem('admin_token')
      navigateTo('/admin/login')
      return
    }
    console.error('Error fetching message detail:', error)
    showToast('Gagal memuat detail pesan', 'error')
  }
}

// Delete message
const deleteMessage = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
    // Optimistic update: Remove from UI immediately
    const index = messages.value.findIndex(m => m.id === id)
    const deletedMessage = index !== -1 ? { ...messages.value[index] } : null
    
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
    
    // Close detail if deleted message is currently selected
    if (selectedMessage.value?.id === id) {
      selectedMessage.value = null
    }
    
    try {
      await $fetch(`/api/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
        }
      })
      
      showToast('Pesan berhasil dihapus')
      
      // Update pagination count
      pagination.value.total_messages--
    } catch (error) {
      if (error.statusCode === 401) {
        sessionStorage.removeItem('admin_token')
        navigateTo('/admin/login')
        return
      }
      console.error('Error deleting message:', error)
      showToast('Gagal menghapus pesan', 'error')
      
      // Rollback: Re-add the deleted message
      if (deletedMessage && index !== -1) {
        messages.value.splice(index, 0, deletedMessage)
      }
    }
  }
}

// Close detail
const closeDetail = () => {
  selectedMessage.value = null
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format short date for sidebar
const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Kemarin'
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }
}

// Watch filter status
watch(filterStatus, () => {
  selectedMessage.value = null
})

// Initial load
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
