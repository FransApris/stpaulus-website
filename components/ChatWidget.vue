<template>
  <div class="chat-widget fixed bottom-20 md:bottom-6 z-50" style="right: 5%">
    <!-- Chat Button -->
    <button @click="toggleChat"
      class="bg-paulus-blue hover:bg-blue-700 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
      :class="{ 'rotate-45': isOpen }">
      <svg v-if="!isOpen" class="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
        </path>
      </svg>
      <svg v-else class="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Chat Window with optimized transition -->
    <Transition name="chat">
      <div v-if="isOpen"
        class="absolute bottom-20 md:bottom-24 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col">
        <!-- Header -->
        <div class="bg-paulus-blue text-white p-4 rounded-t-lg">
          <h3 class="font-semibold">Chatbot St. Paulus Juanda</h3>
          <p class="text-sm opacity-90">Tanya tentang misa, sakramen, dan paroki</p>
        </div>

        <!-- Messages -->
        <div class="flex-1 p-4 overflow-y-auto space-y-3" ref="messagesContainer">
          <TransitionGroup name="message">
            <div v-for="message in messages" :key="message.id" :class="[
              'max-w-xs p-3 rounded-lg text-sm',
              message.sender === 'user'
                ? 'bg-paulus-blue text-white ml-auto'
                : 'bg-gray-100 text-gray-800'
            ]">
              {{ message.text }}
            </div>
          </TransitionGroup>
          <div v-if="isTyping" class="bg-gray-100 text-gray-800 p-3 rounded-lg text-sm max-w-xs">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input v-model="newMessage" type="text" placeholder="Ketik pesan Anda..."
              class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-paulus-blue"
              :disabled="isTyping" />
            <button type="submit" :disabled="!newMessage.trim() || isTyping"
              class="bg-paulus-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const isFirstOpen = ref(true)  // Track first open for instant greeting

// Pre-defined welcome message (no computation overhead)
const welcomeMessage = {
  id: 'welcome',
  text: 'Selamat datang! Saya adalah chatbot St. Paulus Juanda. Saya dapat membantu Anda dengan informasi tentang jadwal misa, sakramen, dan kegiatan paroki. Apa yang ingin Anda tanyakan?',
  sender: 'bot'
}

const toggleChat = () => {
  console.time('[ChatWidget] Toggle chat')

  isOpen.value = !isOpen.value

  // Add welcome message INSTANTLY when opening for the first time
  if (isOpen.value && isFirstOpen.value) {
    console.time('[ChatWidget] Add welcome message')

    // Direct array assignment (faster than push)
    messages.value = [welcomeMessage]
    isFirstOpen.value = false

    console.timeEnd('[ChatWidget] Add welcome message')

    // Scroll to bottom (async, doesn't block UI)
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  console.timeEnd('[ChatWidget] Toggle chat')
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    text: newMessage.value,
    sender: 'user'
  }

  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  isTyping.value = true

  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })

  // Add timeout protection
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
    console.log('[ChatWidget] Request timeout after 15 seconds')
  }, 15000) // 15 second timeout

  try {
    const startTime = Date.now()

    const response = await $fetch('/api/chatbot/chat', {
      method: 'POST',
      body: { message: messageText },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const elapsed = Date.now() - startTime
    console.log(`[ChatWidget] Response received in ${elapsed}ms`)

    messages.value.push({
      id: Date.now() + 1,
      text: response.response,
      sender: 'bot'
    })
  } catch (error) {
    clearTimeout(timeoutId)

    let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi.'

    if (error.name === 'AbortError') {
      errorMessage = 'Permintaan timeout. Silakan coba pertanyaan yang lebih sederhana atau hubungi kantor paroki.'
      console.error('[ChatWidget] Request timeout')
    } else {
      console.error('[ChatWidget] Error:', error)
    }

    messages.value.push({
      id: Date.now() + 1,
      text: errorMessage,
      sender: 'bot'
    })
  } finally {
    isTyping.value = false
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
}

// Close chat when clicking outside - with proper event handling
const handleClickOutside = (event) => {
  // Ignore if clicking the button itself
  const chatButton = event.target.closest('.chat-widget button')
  if (chatButton) {
    return
  }

  // Check if click is outside the chat widget
  const chatWidget = event.target.closest('.chat-widget')
  if (!chatWidget && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Add listener with slight delay to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside, true)
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
/* Optimized animations for INSTANT perceived performance */

/* Use GPU acceleration for all animations */
.chat-widget,
.chat-widget *,
.overflow-y-auto {
  /* Force GPU acceleration */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* Optimize rendering */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}

.chat-widget {
  /* Hint browser about upcoming animations */
  will-change: transform;
}

/* FASTEST button animation - 120ms total */
.chat-widget button {
  transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
}

.chat-widget button:active {
  transform: translateZ(0) scale(0.95);
}

/* Chat window transition - SUPER FAST (150ms) */
.chat-enter-active {
  animation: chatSlideIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-leave-active {
  animation: chatSlideOut 0.12s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes chatSlideIn {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.92) translateZ(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1) translateZ(0);
  }
}

@keyframes chatSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) translateZ(0);
  }

  100% {
    opacity: 0;
    transform: translateY(8px) scale(0.96) translateZ(0);
  }
}

/* Message transitions - INSTANT FEEL (100ms) */
.message-enter-active {
  animation: messageFadeIn 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-leave-active {
  animation: messageFadeOut 0.08s cubic-bezier(0.4, 0, 1, 1);
}

.message-move {
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes messageFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px) translateZ(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

@keyframes messageFadeOut {
  0% {
    opacity: 1;
    transform: translateZ(0);
  }

  100% {
    opacity: 0;
    transform: translateZ(0);
  }
}

/* Ultra-smooth scroll performance */
.overflow-y-auto {
  overflow-y: auto;
  /* iOS momentum scrolling */
  -webkit-overflow-scrolling: touch;
  /* Smooth scroll behavior */
  scroll-behavior: smooth;
  /* Contain layout for better performance */
  contain: layout style paint;
}

/* Optimize typing indicator animation */
.animate-bounce {
  animation: bounce 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0) translateZ(0);
  }

  50% {
    transform: translateY(-4px) translateZ(0);
  }
}

/* Optimize for 60fps */
@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {

  .chat-enter-active,
  .chat-leave-active,
  .message-enter-active,
  .message-leave-active {
    animation-duration: 0.01s !important;
  }
}
</style>
