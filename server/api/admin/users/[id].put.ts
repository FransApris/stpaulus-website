import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission, hashPassword } from '../../../utils/auth'
import { isCategoryUnlimited } from '../../../utils/quota'
import { isoToMysql } from '../../../utils/datetime'

export default defineEventHandler(async (event) => {
  // ── Semua logika dibungkus try-catch agar tidak ada HTTP 500 anonim ────────
  try {
    const decoded = requireAuth(event)
    const adminId = decoded.userId

    // Permission check
    await requireUserManagementPermission(event)

    // Validasi targetUserId sebelum dipakai di query
    const rawId = getRouterParam(event, 'id')
    const targetUserId = rawId ? parseInt(rawId, 10) : NaN
    if (!rawId || isNaN(targetUserId) || targetUserId <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'ID pengguna tidak valid' })
    }

    const body = await readBody(event)
    console.log('[Update User] ===== START UPDATE USER ID:', targetUserId, '=====')
    console.log('[Update User] Admin ID:', adminId)
    console.log('[Update User] Payload keys:', Object.keys(body || {}))

    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Request body tidak valid' })
    }

    const {
      username,
      email,
      password,            // opsional — jika kosong, password TIDAK diubah
      full_name,
      contact_phone,
      user_category,
      unit_name,
      role,
      requires_password_reset  // opsional — kolom mungkin tidak ada di DB lama
    } = body

    // ── Validasi field wajib ─────────────────────────────────────────────────
    if (!username || typeof username !== 'string' || !username.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Username wajib diisi' })
    }
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Nama lengkap wajib diisi' })
    }

    // ── Fetch admin yang sedang login (sekali saja, tidak duplikat) ──────────
    const adminUser = await getQuery(
      'SELECT r.name AS role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [adminId]
    ) as { role_name?: string } | undefined

    if (!adminUser) {
      throw createError({ statusCode: 403, statusMessage: 'Akses ditolak: admin tidak ditemukan' })
    }

    // ── Cek user yang akan diupdate ──────────────────────────────────────────
    const existingUser = await getQuery(`
      SELECT u.id, u.username, u.email, u.role_id,
             COALESCE(r.name, 'user') AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [targetUserId]) as {
      id: number
      username: string
      email: string | null
      role_id: number | null
      role_name: string
    } | undefined

    if (!existingUser) {
      throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan' })
    }

    // ── Cek duplikat username / email ────────────────────────────────────────
    // Hanya cek email jika email dikirim dan tidak kosong
    const trimmedEmail = email && typeof email === 'string' ? email.trim() : null
    const duplicateQuery = trimmedEmail
      ? 'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?'
      : 'SELECT id FROM users WHERE username = ? AND id != ?'
    const duplicateParams = trimmedEmail
      ? [username.trim(), trimmedEmail, targetUserId]
      : [username.trim(), targetUserId]

    const duplicateCheck = await getQuery(duplicateQuery, duplicateParams) as any
    if (duplicateCheck) {
      throw createError({
        statusCode: 400,
        statusMessage: trimmedEmail
          ? 'Username atau email sudah digunakan oleh pengguna lain'
          : 'Username sudah digunakan oleh pengguna lain'
      })
    }

    // ── Validasi user_category jika dikirim ──────────────────────────────────
    if (user_category) {
      const validCategories = await allQuery(
        'SELECT name FROM user_categories WHERE is_active = 1'
      ) as { name: string }[] | undefined

      if (!Array.isArray(validCategories)) {
        console.error('[Update User] Failed to load user_categories from DB')
        throw createError({ statusCode: 500, statusMessage: 'Gagal memuat daftar kategori' })
      }

      const validCategoryNames = validCategories.map(c => c.name)
      if (!validCategoryNames.includes(user_category)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Kategori pengguna tidak valid. Pilihan: ${validCategoryNames.join(', ')}`
        })
      }

      // Security: hanya super_admin yang bisa assign kategori unlimited (DPP/BGKP)
      const categoryIsUnlimited = await isCategoryUnlimited(user_category)
      if (categoryIsUnlimited && adminUser.role_name !== 'super_admin') {
        console.warn('[Update User] SECURITY: non-super-admin tried to assign unlimited category:', user_category, 'by admin:', adminId)
        throw createError({
          statusCode: 403,
          statusMessage: 'Hanya Super Admin yang dapat mengubah kategori ke kuota unlimited (DPP/BGKP)'
        })
      }
    }

    // ── Build updateData — hanya field yang pasti ada ────────────────────────
    const updateData: Record<string, any> = {
      username: username.trim(),
      email: trimmedEmail || null,
      full_name: full_name.trim(),
      contact_phone: contact_phone ? String(contact_phone).trim() : null,
      unit_name: unit_name ? String(unit_name).trim() : null,
      updated_at: isoToMysql(new Date().toISOString())
    }

    // user_category — masukkan hanya jika dikirim (undefined = tidak diubah)
    if (user_category !== undefined) {
      updateData.user_category = user_category || null
    }

    // ── Password handling: HANYA hash jika password diisi ────────────────────
    // Jika password null/undefined/string kosong → SKIP, tidak ubah hash
    const passwordTrimmed = password && typeof password === 'string' ? password.trim() : ''
    if (passwordTrimmed) {
      if (passwordTrimmed.length < 6) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Password baru minimal 6 karakter'
        })
      }
      console.log('[Update User] Password change requested — hashing...')
      updateData.password_hash = await hashPassword(passwordTrimmed)
    } else {
      console.log('[Update User] No password change — keeping existing hash')
    }

    // ── Role update ──────────────────────────────────────────────────────────
    if (role !== undefined) {
      const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : ''

      if (!normalizedRole) {
        throw createError({ statusCode: 400, statusMessage: 'Role tidak boleh kosong jika disertakan' })
      }

      const isSuperAdmin = adminUser.role_name === 'super_admin'
      const isAdminKomsos = adminUser.role_name === 'admin_komsos'
      const komsosSafeRoles = ['user', 'kontributor_berita', 'user_kontributor']

      // Edge case fix: jika admin tidak punya hak ubah role TAPI role yang dikirim
      // sama persis dengan role user saat ini → skip silently (tidak perlu diubah).
      // Ini mencegah admin_sekretariat mendapat 403 palsu saat edit profil biasa
      // dan frontend-nya selalu menyertakan field 'role' dalam payload.
      const existingRoleName = existingUser.role_name ?? 'user'
      const roleIsUnchanged = normalizedRole === existingRoleName.toLowerCase()

      if (!isSuperAdmin) {
        if (!isAdminKomsos || !komsosSafeRoles.includes(normalizedRole)) {
          if (roleIsUnchanged) {
            // Role sama, tidak perlu diubah — lewati blok ini tanpa error
            console.log('[Update User] Role unchanged by non-privileged admin — skipping role update')
          } else {
            throw createError({
              statusCode: 403,
              statusMessage: 'Anda tidak memiliki izin untuk mengubah role pengguna ini'
            })
          }
        } else {
          // admin_komsos dengan safe role — proses perubahan
          if (normalizedRole === 'user') {
            updateData.role_id = null
            updateData.role = 'user'
          } else {
            const roleRecord = await getQuery(
              'SELECT id, name FROM roles WHERE LOWER(name) = ?',
              [normalizedRole]
            ) as { id?: number; name?: string } | undefined

            if (!roleRecord?.id) {
              console.error('[Update User] Invalid role:', normalizedRole)
              throw createError({
                statusCode: 400,
                statusMessage: `Role tidak valid: ${role}. Pilihan: user, super_admin, admin_komsos, admin_sekretariat, kontributor_berita`
              })
            }

            updateData.role_id = roleRecord.id
            updateData.role = roleRecord.name || normalizedRole
          }
        }
      } else {
        // super_admin — semua role boleh diubah
        if (normalizedRole === 'user') {
          updateData.role_id = null
          updateData.role = 'user'
        } else {
          const roleRecord = await getQuery(
            'SELECT id, name FROM roles WHERE LOWER(name) = ?',
            [normalizedRole]
          ) as { id?: number; name?: string } | undefined

          if (!roleRecord?.id) {
            console.error('[Update User] Invalid role:', normalizedRole)
            throw createError({
              statusCode: 400,
              statusMessage: `Role tidak valid: ${role}. Pilihan: user, super_admin, admin_komsos, admin_sekretariat, kontributor_berita`
            })
          }

          // Double-guard: hanya super_admin yang bisa assign role super_admin
          if (roleRecord.name === 'super_admin' && !isSuperAdmin) {
            throw createError({
              statusCode: 403,
              statusMessage: 'Hanya super admin yang dapat memberikan akses super admin'
            })
          }

          updateData.role_id = roleRecord.id
          updateData.role = roleRecord.name || normalizedRole
        }
      }
    }

    // ── requires_password_reset (opsional, kolom mungkin tidak ada di DB lama) ─
    if (requires_password_reset !== undefined) {
      updateData.requires_password_reset = requires_password_reset ? 1 : 0
    }

    // ── Pastikan tidak ada nilai undefined di updateData ─────────────────────
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === undefined) {
        console.warn('[Update User] Removing undefined key from updateData:', key)
        delete updateData[key]
      }
    }

    console.log('[Update User] Fields to update:', Object.keys(updateData))

    // ── Build & execute UPDATE query ─────────────────────────────────────────
    const fields = Object.keys(updateData)
    const values = Object.values(updateData)
    const setClause = fields.map(f => `\`${f}\` = ?`).join(', ')

    try {
      await runQuery(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...values, targetUserId]
      )
    } catch (dbError: any) {
      console.error('[Update User] DB UPDATE error code    :', dbError.code)
      console.error('[Update User] DB UPDATE sqlMessage    :', dbError.sqlMessage)
      console.error('[Update User] DB UPDATE error message :', dbError.message)

      // Konflik unique constraint yang terlewat oleh cek manual di atas
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Username atau email sudah digunakan oleh pengguna lain'
        })
      }

      // Kolom tidak dikenal — kolom opsional belum ada di DB lama (misal: requires_password_reset)
      if (dbError.code === 'ER_BAD_FIELD_ERROR') {
        const match = dbError.sqlMessage?.match(/Unknown column '(.+?)' in/)
        const unknownCol = match?.[1]?.replace(/`/g, '') ?? null

        if (unknownCol && Object.prototype.hasOwnProperty.call(updateData, unknownCol)) {
          console.warn('[Update User] Unknown column — retrying without:', unknownCol)
          delete updateData[unknownCol]
          const retryFields = Object.keys(updateData)
          const retryValues = Object.values(updateData)
          const retryClause = retryFields.map(f => `\`${f}\` = ?`).join(', ')
          await runQuery(
            `UPDATE users SET ${retryClause} WHERE id = ?`,
            [...retryValues, targetUserId]
          )
        } else {
          throw createError({
            statusCode: 500,
            statusMessage: `Kolom DB tidak dikenal: ${unknownCol ?? 'unknown'}`
          })
        }
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: `Gagal memperbarui data di database: ${dbError.message ?? 'unknown DB error'}`
        })
      }
    }

    console.log('[Update User] ===== UPDATE SUCCESS — ID:', targetUserId, '=====')

    // ── Fetch data user terbaru untuk dikembalikan ke frontend ───────────────
    const updatedUser = await getQuery(`
      SELECT
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.contact_phone,
        u.user_category,
        u.unit_name,
        u.role,
        u.role_id,
        r.name AS role_name,
        r.display_name AS role_display_name,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [targetUserId])

    return {
      message: 'Pengguna berhasil diperbarui',
      user: updatedUser
    }

  } catch (error: any) {
    // ── Central error logger — setiap error PASTI muncul di log server ───────
    console.error('[Update User] ===== ERROR =====')
    console.error('[Update User] Error type   :', error?.constructor?.name)
    console.error('[Update User] statusCode   :', error?.statusCode)
    console.error('[Update User] statusMessage:', error?.statusMessage)
    console.error('[Update User] DB code      :', error?.code)
    console.error('[Update User] DB message   :', error?.sqlMessage ?? error?.message)
    console.error('[Update User] Stack        :', error?.stack)

    // Jika sudah createError (4xx/5xx yang disengaja), lempar ulang apa adanya
    if (error?.statusCode) {
      throw error
    }

    // Duplikat di outer catch (safety net)
    if (error?.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username atau email sudah digunakan oleh pengguna lain'
      })
    }

    // Semua error tak terduga → 500 dengan pesan yang membantu debugging
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal memperbarui pengguna: ${error?.message ?? 'Internal server error'}`
    })
  }
})


