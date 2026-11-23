import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import router from '../router'
import { useAuthStore } from '../stores/auth'

beforeAll(() => {
  window.scrollTo = vi.fn()
})

// Mock getMeApi so fetchMe doesn't make network calls in unit tests
vi.mock('@/services/auth', () => ({
  getMeApi: vi.fn().mockRejectedValue(new Error('Unauthenticated')),
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  getCsrfCookie: vi.fn(),
}))

describe('Router & Auth Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('/login resolves to not-found (404)', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('/admin resolves to not-found (404)', async () => {
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('/register resolves to not-found (404)', async () => {
    await router.push('/register')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('unauthenticated visitor accessing /pengelola sees 404 (not-found)', async () => {
    const authStore = useAuthStore()
    authStore.user = null
    authStore.isInitialized = true

    await router.push('/pengelola')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('authenticated admin accessing /pengelola succeeds', async () => {
    const authStore = useAuthStore()
    authStore.user = { id: 2, name: 'Admin KWT', role: 'admin' }
    authStore.isInitialized = true

    await router.push('/pengelola')
    expect(router.currentRoute.value.name).toBe('panel-dashboard')
  })

  it('admin accessing /pengelola/super/setting is redirected to 403 (forbidden)', async () => {
    const authStore = useAuthStore()
    authStore.user = { id: 2, name: 'Admin KWT', role: 'admin' }
    authStore.isInitialized = true

    await router.push('/pengelola/super/setting')
    expect(router.currentRoute.value.name).toBe('forbidden')
  })

  it('super_admin accessing /pengelola/super/setting succeeds', async () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, name: 'Super Admin', role: 'super_admin' }
    authStore.isInitialized = true

    await router.push('/pengelola/super/setting')
    expect(router.currentRoute.value.name).toBe('panel-super')
  })
})
