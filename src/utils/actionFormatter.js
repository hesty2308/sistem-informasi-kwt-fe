/**
 * Format system activity log action key into human-readable Indonesian.
 * @param {string} action
 * @returns {string}
 */
export const formatActionName = (action) => {
  const map = {
    login: 'Masuk',
    logout: 'Keluar',
    create_post: 'Tambah Kegiatan',
    update_post: 'Ubah Kegiatan',
    delete_post: 'Hapus Kegiatan',
    create_category: 'Tambah Kategori',
    update_category: 'Ubah Kategori',
    delete_category: 'Hapus Kategori',
    upload_gallery: 'Unggah Galeri',
    update_gallery: 'Ubah Galeri',
    delete_gallery: 'Hapus Galeri',
    reorder_gallery: 'Urutkan Galeri',
    toggle_gallery_visibility: 'Visibilitas Galeri',
    create_user: 'Tambah Pengelola',
    update_user: 'Ubah Pengelola',
    delete_user: 'Hapus Pengelola',
    reset_password: 'Atur Ulang Sandi',
    toggle_user_status: 'Ubah Status Akun',
    update_settings: 'Ubah Pengaturan',
    update_profile: 'Ubah Profil',
    update_password: 'Ubah Kata Sandi',
    create_mission: 'Tambah Misi',
    update_mission: 'Ubah Misi',
    delete_mission: 'Hapus Misi',
    reorder_mission: 'Urutkan Misi',
  }
  return map[action] || action.replace(/_/g, ' ')
}

/**
 * Return CSS badge class for action types.
 * @param {string} action
 * @returns {string}
 */
export const getActionBadgeClass = (action) => {
  if (action?.includes('delete')) return 'bg-red-100 text-red-700 border-red-200'
  if (action?.includes('create') || action?.includes('upload')) return 'bg-blue-100 text-brand-blue border-blue-200'
  if (action?.includes('update') || action?.includes('reset')) return 'bg-amber-100 text-amber-800 border-amber-200'
  if (action?.includes('login')) return 'bg-green-100 text-primary-dark border-green-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}
