<template>
  <div class="chat-widget fixed bottom-28 right-4 sm:bottom-8 sm:right-8 z-[9999]">
    
    <!-- Tooltip Sapaan -->
    <Transition name="fade-slide-down">
      <div v-if="showTooltip && !isOpen" class="absolute top-[110%] right-0 mt-2 w-max bg-white text-gray-800 font-medium px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-md border border-gray-100 flex items-center gap-1.5 pointer-events-auto">
        <span class="animate-pulse text-xs">👋</span>
        <span class="text-[11px] leading-tight">Ada yang bisa dibantu?</span>
        <button @click.stop="showTooltip = false" class="ml-0.5 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Tutup sapaan">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </Transition>

    <!-- Chat Button -->
    <button @click="toggleChat"
      aria-label="Buka Chatbot AI Paroki St. Paulus Juanda"
      class="chat-fab bg-paulus-blue hover:bg-[#882f1d] text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-xl hover:shadow-2xl z-50 relative"
      :class="[
        isBouncing && !isOpen ? 'animate-bounce-custom' : '',
        !isBouncing && !isOpen ? 'animate-pulse-slow' : ''
      ]">
      
      <span class="transition-all duration-300 transform flex items-center justify-center absolute inset-0" :class="{ 'rotate-90 opacity-0 scale-50': isOpen, 'rotate-0 opacity-100 scale-100': !isOpen }">
        <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
          </path>
        </svg>
      </span>
      <span class="transition-all duration-300 transform flex items-center justify-center absolute inset-0" :class="{ 'rotate-0 opacity-100 scale-100': isOpen, '-rotate-90 opacity-0 scale-50': !isOpen }">
        <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </span>
    </button>

    <!-- Chat Window with Mobile Bottom Sheet -->
    <Transition name="chat-window">
      <div v-if="isOpen"
        class="fixed inset-x-0 bottom-0 top-auto sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 w-full sm:w-[380px] h-[85vh] sm:h-[550px] bg-gray-50 rounded-t-3xl sm:rounded-2xl shadow-2xl sm:border border-gray-100 flex flex-col z-[60] chat-window-container">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-paulus-blue to-[#882f1d] text-white p-4 rounded-t-3xl sm:rounded-t-2xl flex justify-between items-center shadow-md relative z-10 shrink-0">
          <div>
            <h3 class="font-bold flex items-center gap-2">
              <svg class="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Chatbot St. Paulus
            </h3>
            <p class="text-xs opacity-90 mt-0.5 ml-7">Tanya misa, sakramen & paroki</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- Clear Chat Button -->
            <button @click="clearChat" title="Hapus Percakapan" class="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-hidden">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <button @click="toggleChat" class="sm:hidden p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-hidden">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth" ref="messagesContainer">
          <TransitionGroup name="message-list">
            <div v-for="message in messages" :key="message.id" :class="[
              'max-w-[85%] p-3 text-[14px] leading-relaxed relative',
              message.sender === 'user'
                ? 'bg-paulus-blue text-white ml-auto rounded-2xl rounded-tr-sm shadow-sm whitespace-pre-wrap'
                : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0'
            ]">
              <!-- Render Markdown safely -->
              <div v-if="message.sender === 'bot'">
                <div v-html="renderMarkdown(message.text)" class="markdown-body"></div>
                <div v-if="message.has_action && (message.action || message.actions)" class="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <!-- Backward compatibility for single action -->
                  <NuxtLink v-if="message.action && !message.actions" :to="message.action.target_route" @click="isOpen = false" class="inline-block bg-[#882f1d] hover:bg-[#a55e1f] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm w-full text-center">
                    {{ message.action.button_text }}
                  </NuxtLink>
                  <!-- Support for multiple actions -->
                  <template v-if="message.actions">
                    <NuxtLink v-for="(act, idx) in message.actions" :key="idx" :to="act.target_route" @click="isOpen = false" class="inline-block bg-[#882f1d] hover:bg-[#a55e1f] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm w-full text-center">
                      {{ act.button_text }}
                    </NuxtLink>
                  </template>
                </div>
              </div>
              <div v-else>{{ message.text }}</div>
            </div>
          </TransitionGroup>

          <!-- Typewriter Effect Active Message -->
          <Transition name="message-list">
            <div v-if="streamingText" class="max-w-[85%] p-3 text-[14px] leading-relaxed relative bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 prose prose-sm">
              <div v-html="renderMarkdown(streamingText)" class="markdown-body inline"></div><span class="inline-block w-1.5 h-4 ml-1 bg-gray-400 animate-pulse align-middle"></span>
            </div>
          </Transition>

          <!-- Typing Indicator -->
          <div v-if="isTyping && !streamingText" class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] w-fit">
            <div class="flex items-center space-x-1.5 h-4">
              <div class="w-1.5 h-1.5 bg-paulus-blue rounded-full animate-bounce-dot"></div>
              <div class="w-1.5 h-1.5 bg-paulus-blue rounded-full animate-bounce-dot" style="animation-delay: 0.15s"></div>
              <div class="w-1.5 h-1.5 bg-paulus-blue rounded-full animate-bounce-dot" style="animation-delay: 0.3s"></div>
            </div>
          </div>
          
          <!-- Quick Suggestions -->
          <Transition name="fade">
            <div v-if="showSuggestions && !isTyping && messages.length <= 1" class="flex flex-wrap gap-2 pt-2">
              <button v-for="suggestion in suggestions" :key="suggestion" @click="sendSuggestion(suggestion)"
                class="bg-white border border-paulus-blue text-paulus-blue text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors active:scale-95 shadow-sm text-left">
                {{ suggestion }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Input Box -->
        <div class="p-3 bg-white border-t border-gray-100 shrink-0">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-paulus-blue focus-within:ring-1 focus-within:ring-paulus-blue transition-all">
            <textarea v-model="newMessage" placeholder="Tanyakan sesuatu..."
              class="flex-1 bg-transparent border-none px-3 py-2 max-h-24 min-h-[44px] text-sm focus:outline-none focus:ring-0 resize-none w-full"
              :disabled="isTyping || isStreaming" maxlength="500" rows="1" @keydown.enter.prevent="handleEnter"></textarea>
            
            <button type="submit" :disabled="!newMessage.trim() || isTyping || isStreaming"
              aria-label="Kirim Pesan Chatbot"
              class="bg-paulus-blue text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-sm">
              <svg class="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch, useRoute } from '#imports'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const route = useRoute()

const renderMarkdown = (text) => {
  if (!text) return ''
  return DOMPurify.sanitize(marked.parse(text, { breaks: true, async: false }))
}

const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const isStreaming = ref(false)
const streamingText = ref('')
const messagesContainer = ref(null)
const showTooltip = ref(false)
const isBouncing = ref(true)

const suggestions = [
  'Jadwal Misa hari ini?',
  'Bagaimana cara pesan ruangan?',
  'Kontak Sekretariat Paroki'
]
const showSuggestions = ref(true)

// Pre-defined welcome message
const welcomeMessage = {
  id: 'welcome',
  text: 'Selamat datang! Saya adalah asisten virtual Paroki St. Paulus Juanda. Saya dapat membantu Anda dengan informasi tentang jadwal misa, sakramen, dan kegiatan paroki. Apa yang ingin Anda tanyakan?',
  sender: 'bot'
}

// Load history from session storage
const loadChatHistory = () => {
  if (process.client) {
    const history = sessionStorage.getItem('stpaulus_chat_history')
    if (history) {
      try {
        messages.value = JSON.parse(history)
        if (messages.value.length > 1) {
          showSuggestions.value = false
        }
        return
      } catch (e) {
        console.error('Failed to parse chat history', e)
      }
    }
  }
  messages.value = [welcomeMessage]
}

// Save history
const saveChatHistory = () => {
  if (process.client) {
    sessionStorage.setItem('stpaulus_chat_history', JSON.stringify(messages.value))
  }
}

// Watch messages to auto-save
watch(messages, () => {
  saveChatHistory()
}, { deep: true })

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  showTooltip.value = false // hide tooltip once clicked

  if (isOpen.value) {
    scrollToBottom()
  }
}

const clearChat = () => {
  if (confirm('Hapus seluruh riwayat percakapan?')) {
    messages.value = [welcomeMessage]
    sessionStorage.removeItem('stpaulus_chat_history')
    showSuggestions.value = true
  }
}

const sendSuggestion = (text) => {
  newMessage.value = text
  showSuggestions.value = false
  sendMessage()
}

const handleEnter = (e) => {
  if (!e.shiftKey) {
    sendMessage()
  } else {
    newMessage.value += '\n'
  }
}

// Simulate typewriter effect for streaming response
const streamResponse = async (payload) => {
  isStreaming.value = true
  streamingText.value = ''
  
  let fullText = ''
  let actionData = null
  let actionsData = null

  if (typeof payload === 'string') {
    fullText = payload
  } else if (payload && payload.reply) {
    fullText = payload.reply
    
    // Extrak actions secara agresif, abaikan flag has_action dari AI
    if (payload.actions && Array.isArray(payload.actions)) {
      actionsData = payload.actions
    } else if (payload.button_text && payload.target_route) {
      actionData = {
        button_text: payload.button_text,
        target_route: payload.target_route
      }
    }
  }

  if (!fullText) fullText = 'Maaf, saya tidak mengerti.'

  // Split into words for faster rendering
  const words = fullText.split(' ')
  
  for (let i = 0; i < words.length; i++) {
    // Abort stream if window closed (optional)
    streamingText.value += words[i] + ' '
    scrollToBottom()
    // Small dynamic delay to simulate natural typing
    await new Promise(r => setTimeout(r, Math.max(10, Math.random() * 40)))
  }

  // Finalize
  messages.value.push({
    id: Date.now() + 1,
    text: fullText,
    sender: 'bot',
    has_action: !!actionData || !!actionsData,
    action: actionData,
    actions: actionsData
  })
  
  streamingText.value = ''
  isStreaming.value = false
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isStreaming.value) return

  showSuggestions.value = false
  showTooltip.value = false

  const userMessage = {
    id: Date.now(),
    text: newMessage.value.trim(),
    sender: 'user'
  }

  messages.value.push(userMessage)
  const messageText = userMessage.text
  newMessage.value = ''
  isTyping.value = true
  scrollToBottom()

  // Ambil maksimal 5 pesan terakhir (tidak termasuk pesan saat ini) untuk history
  const recentHistory = messages.value
    .slice(Math.max(0, messages.value.length - 6), messages.value.length - 1)
    .filter(m => m.id !== 'welcome')
    .map(m => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      content: m.text
    }))

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 50000) // Timeout 50 detik (server max ~45 detik)

  try {
    const response = await $fetch('/api/chatbot/chat', {
      method: 'POST',
      body: { 
        message: messageText,
        history: recentHistory,
        context: {
          path: route.path,
          title: document.title
        }
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    isTyping.value = false
    
    // Start streaming effect instead of direct push
    await streamResponse(response.response)

  } catch (error) {
    clearTimeout(timeoutId)
    isTyping.value = false

    let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi.'
    if (error.name === 'AbortError' || error?.cause?.name === 'AbortError') {
      errorMessage = 'Permintaan timeout. Silakan coba lagi nanti.'
    } else if (error?.status === 429) {
      errorMessage = 'Terlalu banyak permintaan. Mohon tunggu sebentar.'
    } else if (error?.response?._data?.statusMessage || error?.response?._data?.message) {
      errorMessage = `Error Server: ${error.response._data.statusMessage || error.response._data.message}`
    } else if (error.message) {
      errorMessage = `Sistem Error: ${error.message}`
    }
    
    await streamResponse(errorMessage)
  }
}

const handleClickOutside = (event) => {
  if (window.innerWidth < 640) return // Ignore click outside on mobile (full screen sheet)
  
  const chatButton = event.target.closest('.chat-fab')
  const chatWidget = event.target.closest('.chat-window-container')
  
  if (!chatButton && !chatWidget && isOpen.value) {
    isOpen.value = false
  }
}

let tooltipTimer
onMounted(() => {
  loadChatHistory()
  
  tooltipTimer = setTimeout(() => {
    if (!isOpen.value) {
      showTooltip.value = true
      // Auto-hide tooltip after 5 seconds to prevent blocking UI
      setTimeout(() => {
        showTooltip.value = false
      }, 5000)
    }
  }, 3000)

  setTimeout(() => isBouncing.value = false, 5000)

  setTimeout(() => {
    document.addEventListener('click', handleClickOutside, true)
  }, 100)
})

onUnmounted(() => {
  clearTimeout(tooltipTimer)
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
/* Tooltip Animations */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

/* Chat Window Transitions - Elastic/Bounce */
.chat-window-enter-active {
  animation: chatElasticIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.chat-window-leave-active {
  animation: chatElasticOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes chatElasticIn {
  0% { opacity: 0; transform: scale(0.85) translateY(30px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes chatElasticOut {
  0% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.85) translateY(30px); pointer-events: none; }
}

/* Base Transform Origins */
.chat-window-container {
  transform-origin: bottom center;
}
@media (min-width: 640px) {
  .chat-window-container {
    transform-origin: bottom right;
  }
}

/* Message List Animations */
.message-list-enter-active,
.message-list-move {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.message-list-leave-active {
  transition: all 0.2s;
  position: absolute;
}
.message-list-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}
.message-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Typing Indicator Bounce Dot */
@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce-dot {
  animation: bounce-dot 0.8s ease-in-out infinite;
}

/* Custom FAB Bounce */
@keyframes custom-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-custom {
  animation: custom-bounce 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Pulse Idle */
@keyframes pulse-slow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(28, 62, 107, 0.5); transform: scale(1); }
  50% { box-shadow: 0 0 0 15px rgba(28, 62, 107, 0); transform: scale(1.02); }
}
.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}

/* Quick Action Suggestion Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* GPU Acceleration Fixes */
.chat-widget * {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

/* Hide scrollbar for cleaner UI */
.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .chat-window-enter-active,
  .chat-window-leave-active,
  .message-list-enter-active,
  .fade-slide-up-enter-active,
  .animate-pulse-slow,
  .animate-bounce-custom,
  .animate-bounce-dot {
    animation: none !important;
    transition: opacity 0.1s !important;
    transform: none !important;
  }
}
</style>
