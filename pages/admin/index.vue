<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

// Auto redirect to dashboard
await navigateTo('/admin/dashboard', { replace: true })
</script>

<template>
  <div></div>
</template>
