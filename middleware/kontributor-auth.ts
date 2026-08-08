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

    // SECURITY: Hanya Kontributor yang diizinkan masuk portal kontributor
    const allowedRoles = ['kontributor_berita', 'user_kontributor']
    if (!allowedRoles.includes(role)) {
      // Admin diarahkan ke dashboard admin, user biasa ke homepage
      if (['super_admin', 'admin_komsos', 'admin_sekretariat'].includes(role)) {
        return navigateTo('/admin/dashboard')
      }
      return navigateTo('/')
    }

  } catch (error) {
    console.error('Kontributor auth middleware error:', error)
    return navigateTo('/kontributor/login')
  }
})
