<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Google Photos Integration - Test Page</h1>
        <p class="text-gray-600 mb-8">Testing page (no authentication required)</p>

        <!-- Google Photos Manager Component -->
        <LazyGooglePhotosManager />

        <!-- Instructions -->
        <div class="mt-12 bg-blue-50 border-l-4 border-blue-400 p-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
              <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Click "Connect Google Photos" button</li>
                <li>Login with: pubdok.stpaulusjuanda@gmail.com</li>
                <li>Authorize the application</li>
                <li>You'll be redirected back here</li>
                <li>Click "Refresh Albums" to see your albums</li>
                <li>Select an album and click "Sync to Website"</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="mt-6 flex gap-4 text-sm">
          <a href="/admin/login" class="text-blue-600 hover:underline">→ Login to Admin Panel</a>
          <a href="/" class="text-gray-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No authentication required for testing
definePageMeta({
  layout: 'default'
})
</script>
