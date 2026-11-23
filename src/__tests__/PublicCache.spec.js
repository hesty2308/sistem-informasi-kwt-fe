import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import * as publicApi from '../services/publicApi'
import { useSettingsStore } from '../stores/settings'
import { useVisionMission } from '../composables/useVisionMission'
import { readPublicCache, writePublicCache } from '../utils/publicCache'

describe('Remembered public data (no flash of old text)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('settings store shows the last server text immediately, before any request', () => {
    writePublicCache('settings', { hero_title_2: 'Teks Yang Sudah Diubah' })

    const store = useSettingsStore()

    expect(store.heroTitle2).toBe('Teks Yang Sudah Diubah')
    expect(store.hasCachedData).toBe(true)
  })

  it('falls back to the built-in default when nothing is remembered yet', () => {
    const store = useSettingsStore()

    expect(store.heroTitle2).toBe('Kita Tumbuh dan Berdaya')
    expect(store.hasCachedData).toBe(false)
  })

  it('refreshes from the server and remembers the new text for the next visit', async () => {
    writePublicCache('settings', { hero_title_2: 'Teks Lama' })
    vi.spyOn(publicApi, 'getPublicSettings').mockResolvedValue({ hero_title_2: 'Teks Terbaru' })

    const store = useSettingsStore()
    await store.fetchSettings()

    expect(store.heroTitle2).toBe('Teks Terbaru')
    expect(readPublicCache('settings').hero_title_2).toBe('Teks Terbaru')
  })

  it('about pages render remembered content without a loading state and keep it if the refresh fails', async () => {
    writePublicCache('vision-mission', { vision_title: 'Visi Tersimpan', vision: 'Isi visi', missions: [] })
    vi.spyOn(publicApi, 'getPublicVisionMission').mockRejectedValue(new Error('Gagal terhubung'))

    let api
    mount(defineComponent({ setup: () => { api = useVisionMission(); return () => h('div') } }))

    expect(api.isLoading.value).toBe(false)
    expect(api.isLoaded.value).toBe(true)
    expect(api.visionTitle.value).toBe('Visi Tersimpan')

    await api.fetchVisionMission().catch(() => {})
    await flushPromises()

    expect(api.isLoading.value).toBe(false)
    expect(api.visionTitle.value).toBe('Visi Tersimpan')
  })
})

describe('Loading screen on every page refresh', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountLayout = async () => {
    const { default: PublicLayout } = await import('../layouts/PublicLayout.vue')
    const { default: router } = await import('../router')
    return mount(PublicLayout, {
      attachTo: document.body,
      global: { plugins: [router] },
      slots: { default: '<p>Isi halaman</p>' },
    })
  }
  const splash = (wrapper) => wrapper.find('[data-testid="public-loading"]')

  it('shows the remembered logo and stays until fresh settings arrive and the minimum time passed', async () => {
    writePublicCache('settings', { site_name: 'Nama Lama', logo_url: '/storage/settings/logo.webp' })
    let resolve
    vi.spyOn(publicApi, 'getPublicSettings').mockReturnValue(new Promise((r) => { resolve = r }))

    const wrapper = await mountLayout()
    // Even with remembered data, a refresh shows the loading screen with the logo.
    expect(splash(wrapper).exists()).toBe(true)
    expect(wrapper.find('[data-testid="public-loading-logo"]').attributes('src')).toBe('/storage/settings/logo.webp')

    // Fresh settings alone are not enough before the minimum time.
    resolve({ site_name: 'Nama Baru Dari Super Admin', logo_url: '/storage/settings/logo.webp' })
    await flushPromises()
    expect(splash(wrapper).exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(1200)
    expect(splash(wrapper).exists()).toBe(false)
    expect(wrapper.find('nav').text()).toContain('Nama Baru Dari Super Admin')
    wrapper.unmount()
  })

  it('shows the site name without a logo when none is uploaded', async () => {
    vi.spyOn(publicApi, 'getPublicSettings').mockReturnValue(new Promise(() => {}))

    const wrapper = await mountLayout()
    expect(splash(wrapper).text()).toContain('Paguyuban KWT Kartini')
    expect(wrapper.find('[data-testid="public-loading-logo"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('never stays stuck: shows the site after the maximum wait even without an answer', async () => {
    vi.spyOn(publicApi, 'getPublicSettings').mockReturnValue(new Promise(() => {}))

    const wrapper = await mountLayout()
    await vi.advanceTimersByTimeAsync(7999)
    expect(splash(wrapper).exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(1)
    expect(splash(wrapper).exists()).toBe(false)
    wrapper.unmount()
  })

  it('is not shown again when moving between pages within the site', async () => {
    vi.spyOn(publicApi, 'getPublicSettings').mockResolvedValue({ site_name: 'Nama' })

    const first = await mountLayout()
    await flushPromises()
    await vi.advanceTimersByTimeAsync(1200)
    expect(splash(first).exists()).toBe(false)
    first.unmount()

    // Next page in the same page load (store is kept): no loading screen.
    const second = await mountLayout()
    expect(splash(second).exists()).toBe(false)
    second.unmount()
  })
})
