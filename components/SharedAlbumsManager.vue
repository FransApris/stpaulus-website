<template>
  <div class="shared-albums-manager">
    <div class="header">
      <h2>Kelola Album Google Photos</h2>
      <button @click="showAddForm = true" class="btn-primary">
        ➕ Tambah Album Baru
      </button>
    </div>

    <!-- Add/Edit Form Modal -->
    <div v-if="showAddForm || editingAlbum" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editingAlbum ? 'Edit Album' : 'Tambah Album Baru' }}</h3>
        
        <form @submit.prevent="saveAlbum">
          <div class="form-group">
            <label>Judul Album *</label>
            <input 
              v-model="formData.title" 
              type="text" 
              placeholder="Contoh: Kegiatan Natal 2026"
              required
            />
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea 
              v-model="formData.description" 
              placeholder="Deskripsi singkat tentang album ini"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Share URL Google Photos *</label>
            <input 
              v-model="formData.share_url" 
              type="url" 
              placeholder="https://photos.app.goo.gl/..."
              required
            />
            <small class="help-text">
              📋 Cara mendapatkan share URL:<br>
              1. Buka album di Google Photos<br>
              2. Klik tombol "Share" (icon bagikan)<br>
              3. Klik "Create link"<br>
              4. Copy link dan paste di sini
            </small>
          </div>

          <div class="form-group">
            <label>Thumbnail (Gambar Sampul Album) *</label>
            
            <!-- File Upload Option -->
            <div class="upload-section">
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*"
                @change="handleFileUpload"
                class="file-input"
              />
              <button 
                type="button" 
                @click="fileInput?.click()" 
                class="btn-upload"
                :disabled="uploadingThumbnail"
              >
                {{ uploadingThumbnail ? '📤 Uploading...' : '📁 Pilih Gambar dari Komputer' }}
              </button>
            </div>
            
            <!-- OR Divider -->
            <div class="divider">
              <span>ATAU</span>
            </div>
            
            <!-- Manual URL Input -->
            <input 
              v-model="formData.thumbnail_url" 
              type="text" 
              placeholder="Paste URL gambar atau akan otomatis terisi setelah upload"
              :disabled="uploadingThumbnail"
            />
            
            <!-- Thumbnail Preview -->
            <div v-if="formData.thumbnail_url && !uploadingThumbnail" class="thumbnail-preview">
              <img 
                :src="formData.thumbnail_url" 
                alt="Preview"
                @error="thumbnailError = true"
              />
              <button 
                type="button" 
                @click="formData.thumbnail_url = ''; thumbnailError = false" 
                class="remove-thumbnail"
                title="Hapus thumbnail"
              >
                ✕
              </button>
            </div>
            
            <small class="help-text">
              💡 <strong>Recommended:</strong> Upload gambar dari komputer untuk hasil terbaik<br>
              ⚠️ <strong>Perhatian:</strong> Google Photos URL mungkin di-block oleh browser (CORS policy)<br>
              ✅ <strong>Best practice:</strong> Gunakan button upload hijau di atas
            </small>
          </div>

          <div class="form-group">
            <label>Urutan Tampilan</label>
            <input 
              v-model.number="formData.display_order" 
              type="number" 
              min="0"
            />
            <small class="help-text">Album dengan angka lebih kecil akan tampil lebih dulu</small>
          </div>

          <div class="form-group checkbox">
            <label>
              <input v-model="formData.is_active" type="checkbox" />
              <span>Aktif (tampilkan di website)</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn-secondary">
              Batal
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Albums List -->
    <div v-if="loading && albums.length === 0" class="loading">
      Memuat album...
    </div>

    <div v-else-if="albums.length === 0" class="empty-state">
      <p>Belum ada album. Klik tombol "Tambah Album Baru" untuk memulai.</p>
    </div>

    <div v-else class="albums-grid">
      <div v-for="album in sortedAlbums" :key="album.id" class="album-card">
        <div class="album-preview">
          <!-- Thumbnail Preview -->
          <img 
            v-if="album.thumbnail_url" 
            :src="album.thumbnail_url" 
            :alt="album.title"
            class="album-thumbnail"
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
            @error="handleImageError"
          />
          <div v-else class="no-thumbnail">
            <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p class="text">Tidak ada thumbnail</p>
            <p class="hint">Upload thumbnail untuk preview yang lebih menarik</p>
          </div>
          <div v-if="!album.is_active" class="inactive-badge">Tidak Aktif</div>
          <!-- Google Photos Badge -->
          <a 
            :href="album.share_url" 
            target="_blank"
            class="google-photos-badge"
            title="Buka di Google Photos"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a11.5 11.5 0 0 1 11.5 11.5A11.5 11.5 0 0 1 12 23.5 11.5 11.5 0 0 1 .5 12 11.5 11.5 0 0 1 12 .5zm3.5 4.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
            </svg>
            <span>Google Photos</span>
          </a>
        </div>
        
        <div class="album-info">
          <h3>{{ album.title }}</h3>
          <p v-if="album.description" class="description">{{ album.description }}</p>
          <small class="metadata">
            Urutan: {{ album.display_order }} | 
            Dibuat: {{ formatDate(album.created_at) }}
          </small>
        </div>

        <div class="album-actions">
          <button @click="editAlbum(album)" class="btn-edit" title="Edit">
            ✏️
          </button>
          <button @click="toggleActive(album)" class="btn-toggle" :title="album.is_active ? 'Sembunyikan' : 'Tampilkan'">
            {{ album.is_active ? '👁️' : '👁️‍🗨️' }}
          </button>
          <button @click="deleteAlbum(album)" class="btn-delete" title="Hapus">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Album {
  id: number;
  title: string;
  description?: string;
  share_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const albums = ref<Album[]>([]);
const showAddForm = ref(false);
const editingAlbum = ref<Album | null>(null);
const loading = ref(false);
const uploadingThumbnail = ref(false);
const thumbnailError = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const formData = ref({
  title: '',
  description: '',
  share_url: '',
  thumbnail_url: '',
  is_active: true,
  display_order: 0
});

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
});

const sortedAlbums = computed(() => {
  return [...albums.value].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

// Fetch albums
const fetchAlbums = async () => {
  try {
    loading.value = true;
    const response = await $fetch<{ success: boolean; data: Album[] }>('/api/admin/shared-albums');
    if (response.success) {
      albums.value = response.data;
    }
  } catch (error: any) {
    showToast('Gagal memuat album: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

// Save album (create or update)
const saveAlbum = async () => {
  try {
    loading.value = true;
    
    if (editingAlbum.value) {
      // Update
      const response = await $fetch(`/api/admin/shared-albums/${editingAlbum.value.id}`, {
        method: 'PUT',
        body: formData.value
      });
      showToast('Album berhasil diupdate!', 'success');
    } else {
      // Create
      const response = await $fetch('/api/admin/shared-albums', {
        method: 'POST',
        body: formData.value
      });
      showToast('Album berhasil ditambahkan!', 'success');
    }
    
    closeForm();
    await fetchAlbums();
  } catch (error: any) {
    showToast('Gagal menyimpan album: ' + error.data?.message || error.message, 'error');
  } finally {
    loading.value = false;
  }
};

// Edit album
const editAlbum = (album: Album) => {
  editingAlbum.value = album;
  formData.value = {
    title: album.title,
    description: album.description || '',
    share_url: album.share_url,
    thumbnail_url: album.thumbnail_url || '',
    is_active: album.is_active,
    display_order: album.display_order
  };
};

// Toggle active status
const toggleActive = async (album: Album) => {
  try {
    await $fetch(`/api/admin/shared-albums/${album.id}`, {
      method: 'PUT',
      body: { is_active: !album.is_active }
    });
    showToast(`Album ${!album.is_active ? 'ditampilkan' : 'disembunyikan'}!`, 'success');
    await fetchAlbums();
  } catch (error: any) {
    showToast('Gagal mengubah status album', 'error');
  }
};

// Delete album
const deleteAlbum = async (album: Album) => {
  if (!confirm(`Yakin ingin menghapus album "${album.title}"?`)) {
    return;
  }
  
  try {
    await $fetch(`/api/admin/shared-albums/${album.id}`, {
      method: 'DELETE'
    });
    showToast('Album berhasil dihapus!', 'success');
    await fetchAlbums();
  } catch (error: any) {
    showToast('Gagal menghapus album', 'error');
  }
};

// Close form
const closeForm = () => {
  showAddForm.value = false;
  editingAlbum.value = null;
  formData.value = {
    title: '',
    description: '',
    share_url: '',
    thumbnail_url: '',
    is_active: true,
    display_order: 0
  };
  thumbnailError.value = false;
};

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('File harus berupa gambar (JPG, PNG, dll)', 'error');
    return;
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showToast('Ukuran file maksimal 5MB', 'error');
    return;
  }
  
  try {
    uploadingThumbnail.value = true;
    thumbnailError.value = false;
    
    // Create FormData
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    
    // Upload to server
    const response = await $fetch<{ success: boolean; url: string }>('/api/admin/shared-albums/upload-thumbnail', {
      method: 'POST',
      body: formDataUpload
    });
    
    if (response.success && response.url) {
      formData.value.thumbnail_url = response.url;
      showToast('Thumbnail berhasil diupload!', 'success');
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    showToast('Gagal upload thumbnail: ' + (error.message || 'Unknown error'), 'error');
  } finally {
    uploadingThumbnail.value = false;
    // Reset input so same file can be selected again
    if (target) target.value = '';
  }
};

// Show toast notification
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Handle image load error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  console.warn('Failed to load image:', img.src);
  // Hide broken image, fallback will show
  img.style.display = 'none';
};

// Fetch albums on mount
onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped>
.shared-albums-manager {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  cursor: pointer;
}

.form-group.checkbox input {
  width: auto;
  margin-right: 8px;
}

.help-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

/* Upload Section */
.upload-section {
  margin-bottom: 10px;
}

.file-input {
  display: none;
}

.btn-upload {
  width: 100%;
  padding: 12px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-upload:hover:not(:disabled) {
  background: #45a049;
}

.btn-upload:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 15px 0;
  color: #999;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider:not(:empty)::before {
  margin-right: 10px;
}

.divider:not(:empty)::after {
  margin-left: 10px;
}

.thumbnail-preview {
  position: relative;
  margin-top: 10px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.thumbnail-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-thumbnail {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-thumbnail:hover {
  background: rgba(255, 0, 0, 1);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 25px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-edit,
.btn-toggle,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Albums Grid */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.album-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: box-shadow 0.2s;
}

.album-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.album-preview {
  position: relative;
  width: 100%;
  height: 250px;
  background: #f5f5f5;
  overflow: hidden;
}

.album-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: #999;
}

.no-thumbnail .icon {
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
  opacity: 0.4;
}

.no-thumbnail .text {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.no-thumbnail .hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}

.inactive-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.google-photos-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  color: #1a73e8;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.google-photos-badge:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.album-info {
  padding: 15px;
}

.album-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.album-info .description {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.album-info .metadata {
  font-size: 12px;
  color: #999;
}

.album-actions {
  display: flex;
  gap: 4px;
  padding: 12px 15px;
  border-top: 1px solid #f0f0f0;
  justify-content: right;
}

.btn-edit {
  background: transparent;
  color: #666;
  font-size: 18px;
  padding: 6px 10px;
}

.btn-edit:hover {
  color: #2196F3;
  transform: scale(1.1);
}

.btn-toggle {
  background: transparent;
  color: #666;
  font-size: 18px;
  padding: 6px 10px;
}

.btn-toggle:hover {
  color: #FF9800;
  transform: scale(1.1);
}

.btn-delete {
  background: transparent;
  color: #666;
  font-size: 18px;
  padding: 6px 10px;
}

.btn-delete:hover {
  color: #f44336;
  transform: scale(1.1);
}

/* Loading & Empty States */
.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 2000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #4CAF50;
}

.toast.error {
  background: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .albums-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .header h2 {
    text-align: center;
  }
  
  .album-actions {
    flex-direction: column;
  }
}
</style>
