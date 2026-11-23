import http from './http'

/**
 * Health check ping to backend API.
 * @returns {Promise<{message: string}>}
 */
export const pingApi = async () => {
  const response = await http.get('/ping')
  return response.data
}
