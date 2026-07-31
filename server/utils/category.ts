// server/utils/category.ts

/**
 * Normalizes a category string for comparison (lowercase, trimmed, standard spaces)
 */
export const normalizeCategory = (cat: string): string => {
  return String(cat || '')
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

/**
 * Maps common variations and acronyms of categories to their standard canonical names.
 * This ensures that "DPP", "Dewan Paroki", and "PARISH_COUNCIL" are all treated the same.
 */
export const categoryAliasMap: Record<string, string[]> = {
  wilayah: ['wilayah', 'region'],
  lingkungan: ['lingkungan'],
  kategorial: ['kategorial', 'categorical group', 'categorical_group'],
  komunitas: ['komunitas', 'community'],
  seksi: ['seksi', 'section'],
  // BGKP (Badan Gereja Katolik Paroki) is grouped with DPP — both are parish-level bodies
  // so BGKP users get access to the same rooms that allow "Dewan Pastoral Paroki"
  dewan: ['dewan pastoral paroki', 'dewan paroki pastoral', 'dewan paroki', 'dpp', 'parish council', 'parish_council', 'badan gereja katolik paroki', 'bgkp'],
  admin: ['admin', 'administrator', 'super_admin']
}

/**
 * Takes any raw category string and returns its canonical internal name (e.g. "dewan", "kategorial").
 * Used for authorization, quota checks, and room access validation.
 */
export const canonicalizeCategory = (raw: string): string => {
  const normalized = normalizeCategory(raw)
  for (const [canonical, aliases] of Object.entries(categoryAliasMap)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return canonical
    }
  }
  return normalized
}

/**
 * Returns a nicely formatted display name for a given raw category.
 * Used when showing the user's category in the UI (e.g. in /api/me).
 */
export const getCategoryDisplayName = (rawCategory: string): string => {
  const canonical = canonicalizeCategory(rawCategory)
  
  const displayMap: Record<string, string> = {
    dewan: 'Dewan Pastoral Paroki',
    kategorial: 'Kategorial',
    wilayah: 'Wilayah',
    komunitas: 'Komunitas',
    lingkungan: 'Lingkungan',
    admin: 'Admin'
  }
  
  return displayMap[canonical] || rawCategory
}
