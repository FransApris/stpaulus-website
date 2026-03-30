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
    
    <!-- CKEditor component -->
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
import { ref, shallowRef, watch, onMounted } from '#imports'

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

// State - use shallowRef for component to avoid reactivity overhead
const editor = ref(null)
const CKEditorComponent = shallowRef(null)
const isEditorReady = ref(false)
const loading = ref(true)
const loadError = ref(false)
const content = ref(props.modelValue)

const loadClassicEditorLocalBuild = async () => {
  const module = await import('@ckeditor/ckeditor5-build-classic')
  return module.default || module
}

onMounted(async () => {
  if (process.client) {
    try {
      loading.value = true
      
      // Import CKEditor Vue component (exported as 'Ckeditor')
      const { Ckeditor } = await import('@ckeditor/ckeditor5-vue')
      CKEditorComponent.value = Ckeditor

      // Use local build only to avoid runtime dependency on external CDN.
      editor.value = await loadClassicEditorLocalBuild()
      
      loading.value = false
      isEditorReady.value = true
    } catch (error) {
      console.error('[CKEditor] Failed to load:', error)
      loading.value = false
      loadError.value = true
    }
  } else {
    loading.value = false
  }
})

// Default CKEditor configuration (only items available in classic build)
const editorConfig = ref({
  placeholder: props.placeholder,
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      // Note: 'underline', 'alignment', 'codeBlock' not available in classic build
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
      '|',
      'undo',
      'redo'
    ],
    shouldNotGroupWhenFull: true
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'linkImage'
    ],
    styles: [
      'alignLeft',
      'alignCenter',
      'alignRight',
      'full'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
    ]
  },
  ...props.config
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

// Watch for editor changes
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

const onReady = (editorInstance) => {
  console.log('CKEditor is ready', editorInstance)
  
  // Setup upload adapter
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
                  'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
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
                  console.error('Upload error:', error)
                  reject(error)
                })
            })
          })
        },
        abort: () => {
          console.log('Upload aborted')
        }
      }
    }
  }
  
  emit('ready', editorInstance)
}
</script>

<style>
/* CKEditor 5 custom styles untuk St. Paulus theme */
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

/* Editor toolbar */
.ck.ck-toolbar {
  background: #f9fafb;
  border-color: #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.5rem;
}

/* Editor content area */
.ck.ck-editor__main > .ck-editor__editable {
  min-height: 300px;
  max-height: 600px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0 0 0.375rem 0.375rem;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

/* Focus state - St. Paulus red theme */
.ck.ck-editor__main > .ck-editor__editable:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  outline: none;
}

/* Toolbar buttons */
.ck.ck-button:not(.ck-disabled):hover {
  background: #fee2e2;
}

.ck.ck-button.ck-on {
  background: #dc2626;
  color: white;
}

.ck.ck-button.ck-on:hover {
  background: #b91c1c;
}

/* Dropdown */
.ck.ck-dropdown .ck-dropdown__button:hover {
  background: #fee2e2;
}

/* Images in editor */
.ck-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
}

/* Tables */
.ck-content table {
  border-collapse: collapse;
  width: 100%;
}

.ck-content table td,
.ck-content table th {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
}

/* Blockquote */
.ck-content blockquote {
  border-left: 4px solid #dc2626;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
}

/* Code block */
.ck-content pre {
  background: #f3f4f6;
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
}

.ck-content code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875em;
}

/* Links */
.ck-content a {
  color: #dc2626;
  text-decoration: underline;
}

.ck-content a:hover {
  color: #b91c1c;
}

/* Headings */
.ck-content h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.ck-content h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.ck-content h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 1em;
}

.ck-content h4 {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
}

/* Lists */
.ck-content ul,
.ck-content ol {
  padding-left: 1.5rem;
  margin: 1em 0;
}

.ck-content li {
  margin: 0.5em 0;
}

/* Placeholder */
.ck.ck-editor__editable.ck-focused:before {
  color: #9ca3af;
}
</style>
