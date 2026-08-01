// middleware/kontributor-auth.ts
// Auth guard khusus untuk rute Portal Kontributor.
// Memastikan user sudah login DAN memiliki role yang diizinkan.
// Jika tidak ada token, redirect ke halaman login kontributor (bukan admin).

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (!process.client) return

  const accessToken = sessionStorage.getItem('admin_access_token')
  if (!accessToken) {
    // Bug Fix #5: Redirect ke /kontributor/login, bukan /admin/login
    return navigateTo('/kontributor/login')
  }

  try {
    const auth = useAuth()
    await auth.fetchUserData()

    const role = auth.user.value?.role

    if (!role) {
      // Token ada tapi user data tidak bisa dimuat
      return navigateTo('/kontributor/login')
    }

    // Kontributor dan Super Admin diizinkan masuk portal
    const allowedRoles = ['kontributor_berita', 'user_kontributor', 'super_admin']
    if (!allowedRoles.includes(role)) {
      // Admin roles lain (admin_komsos, dll) harus ke admin dashboard
      return navigateTo('/admin/dashboard')
    }

  } catch (error) {
    console.error('Kontributor auth middleware error:', error)
    return navigateTo('/kontributor/login')
  }
})
