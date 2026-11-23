import axios from 'axios'
import http from './http'

/**
 * Fetch CSRF cookie from Sanctum SPA endpoint.
 * @returns {Promise<any>}
 */
export const getCsrfCookie = () => {
  return axios.get('/sanctum/csrf-cookie', {
    withCredentials: true,
    withXSRFToken: true,
  })
}

/**
 * Perform user login.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ message: string, user: any }>}
 */
export const loginApi = async (credentials) => {
  await getCsrfCookie()
  const response = await http.post('/auth/login', credentials)
  return response.data
}

/**
 * Perform user logout.
 * @returns {Promise<{ message: string }>}
 */
export const logoutApi = async () => {
  const response = await http.post('/auth/logout')
  return response.data
}

/**
 * Get current authenticated user profile.
 * @returns {Promise<{ user: any }>}
 */
export const getMeApi = async () => {
  const response = await http.get('/auth/me')
  return response.data
}

/**
 * Update profile information.
 * @param {{ name: string, email: string }} payload
 * @returns {Promise<{ message: string, user: any }>}
 */
export const updateProfileApi = async (payload) => {
  const response = await http.put('/auth/profile', payload)
  return response.data
}

/**
 * Update password.
 * @param {{ current_password: string, password: string, password_confirmation: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export const updatePasswordApi = async (payload) => {
  const response = await http.put('/auth/password', payload)
  return response.data
}
