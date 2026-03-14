import { computed } from '#imports'

// Composable for checking user permissions
export const usePermissions = () => {
  const { user, permissions, loading } = useAuth()

  /**
   * Check if user has specific permission
   */
  const can = (permissionSlug: string): boolean => {
    if (!user.value) return false

    // Super Admin has all permissions
    if (user.value.role === 'super-admin') return true

    // Check if user has the permission in permissions array
    return permissions.value?.some((p: string) => p === permissionSlug) || false
  }

  /**
   * Check if user can access kronik category
   */
  const canAccessKronik = (categorySlug: string, action: 'view' | 'create' | 'edit' | 'delete' | 'publish' = 'view'): boolean => {
    if (!user.value) return false

    // Super Admin & Admin Paroki have full access
    if (['super-admin', 'admin-paroki'].includes(user.value.role)) {
      return true
    }

    // Check specific permission
    return can(`kronik.${categorySlug}.${action}`)
  }

  /**
   * Check if user can edit specific kronik entry
   */
  const canEditKronik = (kronik: any): boolean => {
    if (!user.value) return false

    // Super Admin & Admin Paroki can edit all
    if (['super-admin', 'admin-paroki'].includes(user.value.role)) {
      return true
    }

    // Ketua can edit all content in their section
    if (user.value.role?.includes('ketua')) {
      return kronik.section_id === user.value.organization_id
    }

    // Pengurus can only edit their own content
    return kronik.author_id === user.value.id
  }

  /**
   * Check if user can publish kronik
   */
  const canPublishKronik = (categorySlug: string): boolean => {
    if (!user.value) return false

    // Only Admin and Ketua can publish
    const publishRoles = [
      'super-admin',
      'admin-paroki',
      'ketua-dpp',
      'ketua-bgkp',
      'ketua-wilayah',
      'ketua-lingkungan'
    ]

    if (publishRoles.includes(user.value.role)) {
      return canAccessKronik(categorySlug, 'publish')
    }

    return false
  }

  /**
   * Check if user can delete kronik entry
   */
  const canDeleteKronik = (kronik: any): boolean => {
    if (!user.value) return false

    // Super Admin & Admin Paroki can delete all
    if (['super-admin', 'admin-paroki'].includes(user.value.role)) {
      return true
    }

    // Ketua can delete content in their section
    if (user.value.role?.includes('ketua')) {
      return kronik.section_id === user.value.organization_id
    }

    // Pengurus can only delete their own draft/pending content
    if (kronik.author_id === user.value.id) {
      return ['draft', 'pending'].includes(kronik.status)
    }

    return false
  }

  /**
   * Get available categories for user (based on permissions)
   */
  const getAvailableCategories = (categories: any[], action: 'view' | 'create' | 'edit' = 'create'): any[] => {
    if (!user.value) return []

    // Super Admin & Admin Paroki see all
    if (['super-admin', 'admin-paroki'].includes(user.value.role)) {
      return categories
    }

    // Filter based on permissions
    return categories.filter((cat: any) => canAccessKronik(cat.slug, action))
  }

  /**
   * Get available sections for user (based on organization)
   */
  const getAvailableSections = (sections: any[]): any[] => {
    if (!user.value) return []

    // Super Admin & Admin Paroki see all
    if (['super-admin', 'admin-paroki'].includes(user.value.role)) {
      return sections
    }

    // Ketua/Pengurus only see their organization sections
    if (user.value?.organization_id) {
      return sections.filter((sec: any) => sec.id === user.value?.organization_id)
    }

    return sections
  }

  /**
   * Check if user is admin or higher
   */
  const isAdmin = computed(() => {
    if (!user.value) return false
    return ['super-admin', 'admin-paroki'].includes(user.value.role)
  })

  /**
   * Check if user is ketua (chairman)
   */
  const isKetua = computed(() => {
    if (!user.value) return false
    return user.value.role?.includes('ketua') || false
  })

  /**
   * Check if user is pengurus (member)
   */
  const isPengurus = computed(() => {
    if (!user.value) return false
    return user.value.role?.includes('pengurus') || false
  })

  return {
    can,
    canAccessKronik,
    canEditKronik,
    canPublishKronik,
    canDeleteKronik,
    getAvailableCategories,
    getAvailableSections,
    isAdmin,
    isKetua,
    isPengurus
  }
}
