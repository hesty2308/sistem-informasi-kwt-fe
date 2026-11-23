import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getMeApi } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isInitialized = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const role = computed(() => user.value?.role || null)
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
  const isAdmin = computed(() => ['super_admin', 'admin'].includes(user.value?.role))

  const setUser = (userData) => {
    user.value = userData
  }

  const clearSession = () => {
    user.value = null
  }

  const fetchMe = async () => {
    try {
      const data = await getMeApi()
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials) => {
    const data = await loginApi(credentials)
    user.value = data.user
    isInitialized.value = true
    return data
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      user.value = null
    }
  }

  // Handle unauthorized event dispatched by http interceptor
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      clearSession()
    })
  }

  return {
    user,
    role,
    isLoggedIn,
    isSuperAdmin,
    isAdmin,
    isInitialized,
    setUser,
    clearSession,
    fetchMe,
    login,
    logout,
  }
})
