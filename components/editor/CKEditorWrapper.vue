<template>
  <div class="ckeditor-wrapper">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Memuat CKEditor...</p>
    </div>

    <!-- Error fallback - simple textarea -->
    <div v-else-if="loadError" class="error-fallback">
      <p class="text-sm text-red-600 mb-2">⚠️ CKEditor gagal dimuat. Menggunakan editor sederhana.</p>
      <textarea
        v-model="content"
        :placeholder="placeholder"
        class="w-full min-h-[300px] p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
      />
    </div>

    <!-- CKEditor component (loaded dynamically, client-only) -->
    <component
      v-else-if="isEditorReady && CKEditorComponent"
      :is="CKEditorComponent"
      v-model="content"
      :editor="editor"
      :config="editorConfig"
      @ready="onReady"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, watch, onMounted } from '#imports'
import 'ckeditor5/ckeditor5.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: 'Tulis konten di sini...'
  }
})

const emit = defineEmits(['update:modelValue', 'ready'])

// State
const editor = shallowRef(null)
const CKEditorComponent = shallowRef(null)
const isEditorReady = ref(false)
const loading = ref(true)
const loadError = ref(false)
const content = ref(props.modelValue)

// ─── CKEditor 5 v42+ unified package ────────────────────────────────────────
// Sejak v42, semua plugin tersedia dalam satu paket `ckeditor5`.
// `@ckeditor/ckeditor5-build-classic` sudah deprecated — jangan dipakai.
// Import ClassicEditor dan hanya plugin yang BENAR-BENAR ada di paket ini.
// ─────────────────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!process.client) {
    loading.value = false
    return
  }

  try {
    loading.value = true

    // 1. Import komponen Vue dari @ckeditor/ckeditor5-vue
    const { Ckeditor } = await import('@ckeditor/ckeditor5-vue')
    CKEditorComponent.value = Ckeditor

    // 2. Import ClassicEditor dan semua plugin dari paket TUNGGAL `ckeditor5`
    //    (bukan lagi @ckeditor/ckeditor5-build-classic)
    const {
      ClassicEditor,
      // Core
      Essentials,
      Paragraph,
      // Heading
      Heading,
      // Format teks dasar
      Bold,
      Italic,
      Underline,
      Strikethrough,
      // Link
      Link,
      // List
      List,
      ListProperties,
      // Indentasi
      Indent,
      IndentBlock,
      // Blockquote
      BlockQuote,
      // Tabel
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      // Gambar
      Image,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      // Undo/Redo (sudah built-in via Essentials, tapi eksplisit untuk kejelasan)
      Undo,
      // Alignment
      Alignment,
      // HorizontalLine
      HorizontalLine,
      // Font (opsional)
      FontSize,
      FontColor,
      FontBackgroundColor,
    } = await import('ckeditor5')

    // Rakit editor dengan hanya plugin yang dibutuhkan
    editor.value = ClassicEditor
    editorConfig.value = buildConfig({
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Link,
      List,
      ListProperties,
      Indent,
      IndentBlock,
      BlockQuote,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      Image,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Undo,
      Alignment,
      HorizontalLine,
      FontSize,
      FontColor,
      FontBackgroundColor,
    })

    loading.value = false
    isEditorReady.value = true
  } catch (error) {
    console.error('[CKEditor] Failed to load:', error)
    loading.value = false
    loadError.value = true
  }
})

// ─── Konfigurasi editor ──────────────────────────────────────────────────────
// Kita pakai ref agar bisa diisi setelah import async selesai
const editorConfig = ref({})

function buildConfig(plugins) {
  return {
    // ─── Lisensi ─────────────────────────────────────────────────────────────
    // Nilai 'GPL' adalah kunci resmi CKEditor 5 v42+ untuk penggunaan
    // open-source / gratis di bawah lisensi GPL.
    // Tanpa ini, editor akan melempar error "license-key-missing".
    licenseKey: 'GPL',

    plugins: Object.values(plugins),
    placeholder: props.placeholder,

    toolbar: {
      // Hanya daftarkan item toolbar yang plugin-nya memang di-include di atas.
      // Ini mencegah error "toolbarview-item-unavailable".
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'alignment',
        '|',
        'link',
        'imageUpload',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'blockQuote',
        'insertTable',
        'horizontalLine',
        '|',
        'undo',
        'redo',
      ],
      shouldNotGroupWhenFull: true,
    },

    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
      ],
    },

    image: {
      toolbar: [
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'linkImage',
      ],
    },

    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },

    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },

    alignment: {
      options: ['left', 'center', 'right', 'justify'],
    },

    fontSize: {
      // 'default' = ukuran default editor = 16px (sesuai font-size di CSS editor)
      // Opsi diurutkan dari kecil ke besar; hilangkan 10px agar tidak terlalu kecil
      options: [12, 14, 'default', 18, 20, 24, 28, 32, 36],
      supportAllValues: false,
    },

    // Merge dengan config dari props (jika ada override dari parent)
    ...props.config,
  }
}

// ─── Sync v-model ─────────────────────────────────────────────────────────────
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

// ─── onReady: setup upload adapter ───────────────────────────────────────────
const onReady = (editorInstance) => {
  console.log('[CKEditor] Ready, version:', editorInstance.config?.get?.('licenseKey') ?? 'GPL')

  // Setup upload adapter untuk gambar
  if (editorInstance.plugins.has('FileRepository')) {
    editorInstance.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then((file) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData()
              formData.append('file', file)

              fetch('/api/admin/uploads/image', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
                },
                body: formData
              })
                .then(response => response.json())
                .then(result => {
                  if (result.url) {
                    resolve({ default: result.url })
                  } else {
                    reject(result.error || 'Upload failed')
                  }
                })
                .catch(error => {
                  console.error('[CKEditor] Upload error:', error)
                  reject(error)
                })
            })
          })
        },
        abort: () => {
          console.log('[CKEditor] Upload aborted')
        }
      }
    }
  }

  emit('ready', editorInstance)
}
</script>

<style>
/* CSS di-import di script setup */
</style>

<style scoped>
/* CKEditor custom styles untuk St. Paulus theme */
.ckeditor-wrapper {
  width: 100%;
  min-height: 300px;
}

.loading-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 2rem;
}

.error-fallback {
  width: 100%;
}

.error-fallback textarea {
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
}
</style>

<style>
/* Override CKEditor theme dengan warna St. Paulus */
.ck.ck-toolbar {
  background: #f9fafb !important;
  border-color: #e5e7eb !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  padding: 0.5rem !important;
}

.ck.ck-editor__main > .ck-editor__editable {
  min-height: 300px;
  max-height: 600px;
  background: white;
  border: 1px solid #d1d5db !important;
  border-radius: 0 0 0.375rem 0.375rem !important;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

.ck.ck-editor__main > .ck-editor__editable:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  outline: none;
}

.ck.ck-button:not(.ck-disabled):hover {
  background: #fee2e2 !important;
}

.ck.ck-button.ck-on {
  background: #dc2626 !important;
  color: white !important;
}

.ck.ck-button.ck-on:hover {
  background: #b91c1c !important;
}

/* Content styles */
.ck-content img       { max-width: 100%; height: auto; border-radius: 0.375rem; }
.ck-content table     { border-collapse: collapse; width: 100%; }
.ck-content td,
.ck-content th        { border: 1px solid #d1d5db; padding: 0.5rem; }
.ck-content blockquote {
  border-left: 4px solid #dc2626;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
}
.ck-content pre       { background: #f3f4f6; border-radius: 0.375rem; padding: 1rem; overflow-x: auto; }
.ck-content code      { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: 'Monaco','Menlo',monospace; font-size: 0.875em; }
.ck-content a         { color: #dc2626; text-decoration: underline; }
.ck-content a:hover   { color: #b91c1c; }
.ck-content h1        { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
.ck-content h2        { font-size: 1.5em; font-weight: 600; margin: 0.83em 0; }
.ck-content h3        { font-size: 1.25em; font-weight: 600; margin: 1em 0; }
.ck-content h4        { font-size: 1.1em; font-weight: 600; margin: 1.33em 0; }
.ck-content ul,
.ck-content ol        { padding-left: 1.5rem; margin: 1em 0; }
.ck-content li        { margin: 0.5em 0; }
</style>
