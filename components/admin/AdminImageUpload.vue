<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <!-- Upload Area -->
    <div 
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      ]"
    >
      <div class="text-center space-y-3">
        <!-- Icon Upload -->
        <div class="flex justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <!-- Text -->
        <div>
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-blue-600">Klik untuk pilih gambar</span> atau drag & drop
          </p>
          <p class="text-xs text-gray-500 mt-1">
            PNG, JPG, WebP hingga 5MB
          </p>
          <p class="text-xs text-blue-500 mt-1 font-medium">
            💡 Ukuran ideal: 1200 x 630 px (rasio 16:9)
          </p>
        </div>

        <!-- File Input Hidden -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
      </div>
    </div>

    <!-- Preview -->
    <div v-if="previewUrl" class="relative">
      <img 
        :src="previewUrl" 
        alt="Preview" 
        class="max-h-48 w-auto mx-auto rounded-lg border border-gray-300 shadow-sm" 
      />
      <button
        type="button"
        @click.stop="clearImage"
        class="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
        title="Hapus gambar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Helper Text -->
    <p v-if="helperText" class="text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  helperText?: string
  type?: 'news' | 'article' | 'gallery'
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Upload Gambar',
  helperText: 'Pilih gambar dari komputer atau paste URL',
  type: 'news',
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string>(props.modelValue || '')
const isDragging = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = async (file: File) => {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file terlalu besar! Maksimal 5MB.')
    return
  }

  // Create preview for UI
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    previewUrl.value = result
  }
  reader.readAsDataURL(file)

  // Upload file to server
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', props.type)

    const response = await $fetch('/api/admin/uploads/image', {
      method: 'POST',
      body: formData
    })

    // Emit the server path, not base64
    if (response && response.url) {
      emit('update:modelValue', response.url)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Gagal upload gambar. Silakan coba lagi.')
    clearImage()
  }
}

const clearImage = () => {
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', '')
}
</script>
