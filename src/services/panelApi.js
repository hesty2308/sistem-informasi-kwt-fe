import http from './http'

/**
 * Fetch panel dashboard statistics, recent posts, and popular posts.
 * @returns {Promise<{stats: Object, recent_posts: Array, popular_posts: Array}>}
 */
export const getPanelDashboard = async () => {
  const response = await http.get('/panel/dashboard')
  return response.data.data
}

// =============================================================================
// POSTS (KEGIATAN)
// =============================================================================

/**
 * Fetch paginated list of posts for panel.
 * @param {Object} params - { search, category_id, status, sort_by, sort_order, page }
 * @returns {Promise<{data: Array, links: Object, meta: Object}>}
 */
export const getPanelPosts = async (params = {}) => {
  const response = await http.get('/panel/posts', { params })
  return response.data
}

/**
 * Fetch single post detail for viewing/editing.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const getPanelPost = async (id) => {
  const response = await http.get(`/panel/posts/${id}`)
  return response.data.data
}

/**
 * Create a new post with multipart/form-data (support image upload).
 * @param {FormData} formData
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createPanelPost = async (formData) => {
  const response = await http.post('/panel/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Update an existing post. Uses POST with _method=PUT for FormData multipart support.
 * @param {number|string} id
 * @param {FormData|Object} payload
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updatePanelPost = async (id, payload) => {
  if (payload instanceof FormData) {
    if (!payload.has('_method')) {
      payload.append('_method', 'PUT')
    }
    const response = await http.post(`/panel/posts/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const response = await http.put(`/panel/posts/${id}`, payload)
  return response.data
}

/**
 * Soft delete a post.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deletePanelPost = async (id) => {
  const response = await http.delete(`/panel/posts/${id}`)
  return response.data
}

// =============================================================================
// CATEGORIES (KATEGORI)
// =============================================================================

/**
 * Fetch all categories with post counts.
 * @returns {Promise<Array>}
 */
export const getPanelCategories = async () => {
  const response = await http.get('/panel/categories')
  return response.data.data
}

/**
 * Create a new category.
 * @param {{ name: string, color?: string }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createPanelCategory = async (data) => {
  const response = await http.post('/panel/categories', data)
  return response.data
}

/**
 * Update category details.
 * @param {number|string} id
 * @param {{ name: string, color?: string }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updatePanelCategory = async (id, data) => {
  const response = await http.put(`/panel/categories/${id}`, data)
  return response.data
}

/**
 * Delete a category. (Fails with 422 if posts exist).
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deletePanelCategory = async (id) => {
  const response = await http.delete(`/panel/categories/${id}`)
  return response.data
}

// =============================================================================
// GALLERIES (GALERI)
// =============================================================================

/**
 * Fetch all gallery items.
 * @returns {Promise<Array>}
 */
export const getPanelGalleries = async () => {
  const response = await http.get('/panel/galleries')
  return response.data.data
}

/**
 * Upload single or multiple gallery photos with upload progress callback.
 * @param {FormData} formData
 * @param {Function} [onProgress]
 * @returns {Promise<{message: string, data: Array}>}
 */
export const uploadPanelGalleries = async (formData, onProgress = null) => {
  const response = await http.post('/panel/galleries/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
  return response.data
}

/**
 * Update gallery metadata (title, caption, sort_order, is_visible).
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updatePanelGallery = async (id, data) => {
  const response = await http.put(`/panel/galleries/${id}`, data)
  return response.data
}

/**
 * Toggle visibility of gallery photo.
 * @param {number|string} id
 * @returns {Promise<{message: string, data: Object}>}
 */
export const togglePanelGalleryVisibility = async (id) => {
  const response = await http.patch(`/panel/galleries/${id}/toggle-visibility`)
  return response.data
}

/**
 * Reorder gallery items batch.
 * @param {Array<{id: number, sort_order: number}>} items
 * @returns {Promise<{message: string}>}
 */
export const reorderPanelGalleries = async (items) => {
  const response = await http.post('/panel/galleries/reorder', { items })
  return response.data
}

/**
 * Delete a gallery photo.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deletePanelGallery = async (id) => {
  const response = await http.delete(`/panel/galleries/${id}`)
  return response.data
}

// =============================================================================
// SUPER ADMIN: KELOLA PENGELOLA (USERS)
// =============================================================================

/**
 * Fetch list of all managers.
 * @param {Object} [params] - { search, role, is_active }
 * @returns {Promise<Array>}
 */
export const getSuperUsers = async (params = {}) => {
  const response = await http.get('/panel/super/users', { params })
  return response.data.data
}

/**
 * Create a new manager.
 * @param {{ name: string, email: string, password: string, role: string }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createSuperUser = async (data) => {
  const response = await http.post('/panel/super/users', data)
  return response.data
}

/**
 * Fetch a single manager details.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const getSuperUser = async (id) => {
  const response = await http.get(`/panel/super/users/${id}`)
  return response.data.data
}

/**
 * Update an existing manager.
 * @param {number|string} id
 * @param {{ name: string, email: string, role: string, is_active: boolean }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updateSuperUser = async (id, data) => {
  const response = await http.put(`/panel/super/users/${id}`, data)
  return response.data
}

/**
 * Toggle active status of a manager.
 * @param {number|string} id
 * @returns {Promise<{message: string, data: Object}>}
 */
export const toggleSuperUserStatus = async (id) => {
  const response = await http.patch(`/panel/super/users/${id}/toggle-status`)
  return response.data
}

/**
 * Reset password of a manager.
 * @param {number|string} id
 * @param {string} password
 * @returns {Promise<{message: string}>}
 */
export const resetSuperUserPassword = async (id, password) => {
  const response = await http.post(`/panel/super/users/${id}/reset-password`, { password })
  return response.data
}

/**
 * Delete a manager account.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deleteSuperUser = async (id) => {
  const response = await http.delete(`/panel/super/users/${id}`)
  return response.data
}

// =============================================================================
// SUPER ADMIN: PENGATURAN WEBSITE (SETTINGS)
// =============================================================================

/**
 * Fetch all website settings for editing.
 * @returns {Promise<Object>}
 */
export const getSuperSettings = async () => {
  const response = await http.get('/panel/super/settings')
  return response.data.data
}

/**
 * Update website settings. Supports FormData for uploading logo / hero image.
 * @param {FormData|Object} payload
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updateSuperSettings = async (payload) => {
  const headers = payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  const response = await http.post('/panel/super/settings', payload, { headers })
  return response.data
}

/**
 * Reset website settings to default values.
 * @param {Array<string>|null} [keys]
 * @returns {Promise<{message: string, data: Object}>}
 */
export const resetSuperSettings = async (keys = null) => {
  const response = await http.post('/panel/super/settings/reset', { keys })
  return response.data
}

// =============================================================================
// SUPER ADMIN: RIWAYAT AKTIVITAS (ACTIVITY LOGS - READ ONLY)
// =============================================================================

/**
 * Fetch paginated activity logs.
 * @param {Object} [params] - { user_id, start_date, end_date, search, page }
 * @returns {Promise<{data: Array, links: Object, meta: Object}>}
 */
export const getSuperActivityLogs = async (params = {}) => {
  const response = await http.get('/panel/super/activity-logs', { params })
  return response.data
}

// =============================================================================
// SUPER ADMIN: MISI ORGANISASI (MISSIONS)
// =============================================================================

/**
 * Fetch all missions (active and inactive) in display order.
 * @returns {Promise<Array>}
 */
export const getSuperMissions = async () => {
  const response = await http.get('/panel/super/missions')
  return response.data.data
}

/**
 * Create a new mission at the end of the list.
 * @param {{ text: string, is_active?: boolean }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createSuperMission = async (data) => {
  const response = await http.post('/panel/super/missions', data)
  return response.data
}

/**
 * Update mission text or active status.
 * @param {number|string} id
 * @param {{ text?: string, is_active?: boolean }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updateSuperMission = async (id, data) => {
  const response = await http.put(`/panel/super/missions/${id}`, data)
  return response.data
}

/**
 * Save a new display order for missions.
 * @param {Array<{id: number, sort_order: number}>} items
 * @returns {Promise<{message: string}>}
 */
export const reorderSuperMissions = async (items) => {
  const response = await http.post('/panel/super/missions/reorder', { items })
  return response.data
}

/**
 * Delete a mission.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deleteSuperMission = async (id) => {
  const response = await http.delete(`/panel/super/missions/${id}`)
  return response.data
}

// =============================================================================
// SUPER ADMIN: LINIMASA SEJARAH (HISTORY MILESTONES)
// =============================================================================

/**
 * Fetch all history milestones (active and inactive) in chronological order.
 * @returns {Promise<Array>}
 */
export const getSuperHistoryMilestones = async () => {
  const response = await http.get('/panel/super/history-milestones')
  return response.data.data
}

/**
 * Create a new history milestone.
 * @param {{ year: number, title: string, description?: string, is_active?: boolean }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createSuperHistoryMilestone = async (data) => {
  const response = await http.post('/panel/super/history-milestones', data)
  return response.data
}

/**
 * Update a history milestone.
 * @param {number|string} id
 * @param {{ year?: number, title?: string, description?: string, is_active?: boolean }} data
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updateSuperHistoryMilestone = async (id, data) => {
  const response = await http.put(`/panel/super/history-milestones/${id}`, data)
  return response.data
}

/**
 * Delete a history milestone.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deleteSuperHistoryMilestone = async (id) => {
  const response = await http.delete(`/panel/super/history-milestones/${id}`)
  return response.data
}

// =============================================================================
// PENGURUS (BOARD MEMBERS) - admin and super admin
// =============================================================================

/**
 * Fetch all board members (active and inactive) in display order.
 * @returns {Promise<Array>}
 */
export const getBoardMembers = async () => {
  const response = await http.get('/panel/board-members')
  return response.data.data
}

/**
 * Create a new board member (multipart, photo optional).
 * @param {FormData} formData
 * @returns {Promise<{message: string, data: Object}>}
 */
export const createBoardMember = async (formData) => {
  const response = await http.post('/panel/board-members', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Update a board member. FormData is sent as POST with _method=PUT for file upload support.
 * @param {number|string} id
 * @param {FormData|Object} payload
 * @returns {Promise<{message: string, data: Object}>}
 */
export const updateBoardMember = async (id, payload) => {
  if (payload instanceof FormData) {
    if (!payload.has('_method')) {
      payload.append('_method', 'PUT')
    }
    const response = await http.post(`/panel/board-members/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }
  const response = await http.put(`/panel/board-members/${id}`, payload)
  return response.data
}

/**
 * Save a new display order for board members.
 * @param {Array<{id: number, sort_order: number}>} items
 * @returns {Promise<{message: string}>}
 */
export const reorderBoardMembers = async (items) => {
  const response = await http.post('/panel/board-members/reorder', { items })
  return response.data
}

/**
 * Delete a board member and its photo.
 * @param {number|string} id
 * @returns {Promise<{message: string}>}
 */
export const deleteBoardMember = async (id) => {
  const response = await http.delete(`/panel/board-members/${id}`)
  return response.data
}
