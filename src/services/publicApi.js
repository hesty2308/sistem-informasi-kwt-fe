import http from './http'

/**
 * Fetch safe public settings.
 * @returns {Promise<Object>}
 */
export const getPublicSettings = async () => {
  const response = await http.get('/public/settings')
  return response.data.data
}

/**
 * Fetch home page composite data (latest 6 posts, 6 galleries, settings).
 * @returns {Promise<{posts: Array, galleries: Array, settings: Object}>}
 */
export const getPublicHome = async () => {
  const response = await http.get('/public/home')
  return response.data.data
}

/**
 * Fetch list of categories with published post count.
 * @returns {Promise<Array>}
 */
export const getPublicCategories = async () => {
  const response = await http.get('/public/categories')
  return response.data.data
}

/**
 * Fetch paginated published posts with search & category filters.
 * @param {Object} params - { search, category, page }
 * @returns {Promise<{data: Array, links: Object, meta: Object}>}
 */
export const getPublicPosts = async (params = {}) => {
  const response = await http.get('/public/posts', { params })
  return response.data
}

/**
 * Fetch post detail by slug (with view count increment and 3 related posts).
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export const getPublicPostDetail = async (slug) => {
  const response = await http.get(`/public/posts/${slug}`)
  return response.data.data
}

/**
 * Fetch one page of visible gallery items (9 per page).
 * @param {number} page
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export const getPublicGalleries = async (page = 1) => {
  const response = await http.get('/public/galleries', { params: { page } })
  return response.data
}

/**
 * Fetch vision, mission, and SEO meta.
 * @returns {Promise<{vision_title: string, vision: string, mission_title: string, seo_title: string, seo_description: string, missions: Array}>}
 */
export const getPublicVisionMission = async () => {
  const response = await http.get('/public/about/vision-mission')
  return response.data.data
}


/**
 * Fetch history narrative, SEO meta, and active milestones.
 * @returns {Promise<{title: string, text: string, seo_title: string, seo_description: string, milestones: Array}>}
 */
export const getPublicHistory = async () => {
  const response = await http.get('/public/about/history')
  return response.data.data
}

/**
 * Fetch organization structure heading, period, and SEO meta.
 * @returns {Promise<{title: string, period: string, seo_title: string, seo_description: string}>}
 */
export const getPublicStructure = async () => {
  const response = await http.get('/public/about/structure')
  return response.data.data
}

/**
 * Fetch one page of active board members (9 per page).
 * @param {number} page
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export const getPublicStructureMembers = async (page = 1) => {
  const response = await http.get('/public/about/structure/members', { params: { page } })
  return response.data
}
