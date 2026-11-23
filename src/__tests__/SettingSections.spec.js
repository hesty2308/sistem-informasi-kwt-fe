import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { useAuthStore } from '../stores/auth'
import { settingSections, settingSectionPath } from '../config/settingSections'

describe('Pengaturan Website sub-page routes', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    authStore.setUser({ name: 'Super', role: 'super_admin' })
    authStore.isInitialized = true
    await router.push('/')
    await router.isReady()
  })

  it('redirects the settings root and the /admin alias to the first section', async () => {
    await router.push('/pengelola/super/pengaturan')
    expect(router.currentRoute.value.path).toBe('/pengelola/super/pengaturan/identitas')

    await router.push('/admin')
    expect(router.currentRoute.value.path).toBe('/pengelola/super/pengaturan/identitas')
  })

  it('resolves every section slug to the settings page', async () => {
    for (const section of settingSections) {
      await router.push(settingSectionPath(section.slug))
      expect(router.currentRoute.value.name).toBe('panel-super-settings')
      expect(router.currentRoute.value.params.section).toBe(section.slug)
    }
  })

  it('redirects the old "tentang" section to Identitas Organisasi', async () => {
    await router.push('/pengelola/super/pengaturan/tentang')
    expect(router.currentRoute.value.path).toBe('/pengelola/super/pengaturan/identitas-organisasi')
  })

  it('sends unknown sections back to the first section', async () => {
    await router.push('/pengelola/super/pengaturan/tidak-ada')
    expect(router.currentRoute.value.path).toBe('/pengelola/super/pengaturan/identitas')
  })
})
