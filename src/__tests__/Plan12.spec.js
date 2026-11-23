import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import * as publicApi from '../services/publicApi'
import { prefetchAboutPages, resetAboutPrefetch } from '../utils/prefetchAboutPages'
import { readPublicCache } from '../utils/publicCache'
import { useSettingsStore } from '../stores/settings'
import PublicTopBar from '../components/layout/public/PublicTopBar.vue'
import PublicFooter from '../components/layout/public/PublicFooter.vue'

describe('prefetchAboutPages', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetAboutPrefetch()
    vi.restoreAllMocks()
  })

  it('stores the About pages data in the browser cache used by the pages', async () => {
    vi.spyOn(publicApi, 'getPublicVisionMission').mockResolvedValue({ vision: 'Visi baru', missions: [] })
    vi.spyOn(publicApi, 'getPublicHistory').mockResolvedValue({ title: 'Sejarah', milestones: [] })
    vi.spyOn(publicApi, 'getPublicStructure').mockResolvedValue({ title: 'Pengurus', period: '2024–2029' })
    vi.spyOn(publicApi, 'getPublicStructureMembers').mockResolvedValue({
      data: [{ id: 1, name: 'Siti' }],
      meta: { current_page: 1, last_page: 1, total: 1 },
    })

    await prefetchAboutPages()

    expect(readPublicCache('vision-mission').vision).toBe('Visi baru')
    expect(readPublicCache('history').title).toBe('Sejarah')
    expect(readPublicCache('structure')).toMatchObject({
      heading: { period: '2024–2029' },
      members: [{ id: 1, name: 'Siti' }],
    })
  })

  it('does not refetch on every hover and stays silent when the server fails', async () => {
    const vm = vi.spyOn(publicApi, 'getPublicVisionMission').mockRejectedValue(new Error('offline'))
    vi.spyOn(publicApi, 'getPublicHistory').mockRejectedValue(new Error('offline'))
    vi.spyOn(publicApi, 'getPublicStructure').mockRejectedValue(new Error('offline'))
    vi.spyOn(publicApi, 'getPublicStructureMembers').mockRejectedValue(new Error('offline'))

    await expect(prefetchAboutPages()).resolves.toBeDefined()
    await prefetchAboutPages()
    await prefetchAboutPages()

    expect(vm).toHaveBeenCalledTimes(1)
  })
})

describe('contact data without sample fallbacks', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hides WhatsApp and email when they are not filled in', () => {
    const store = useSettingsStore()
    store.settings = { ...store.settings, phone_whatsapp: '', email: '', address: '' }

    const topBar = mount(PublicTopBar, { global: { plugins: [router] } })
    const footer = mount(PublicFooter, { global: { plugins: [router] } })

    expect(topBar.find('a[href^="https://wa.me/"]').exists()).toBe(false)
    expect(footer.find('a[href^="https://wa.me/"]').exists()).toBe(false)
    expect(footer.find('a[href^="mailto:"]').exists()).toBe(false)
    expect(store.whatsappLink).toBe('')
  })

  it('shows the real number once it is saved', () => {
    const store = useSettingsStore()
    store.settings = { ...store.settings, phone_whatsapp: '081234567890' }

    const topBar = mount(PublicTopBar, { global: { plugins: [router] } })
    expect(topBar.find('a[href="https://wa.me/6281234567890"]').exists()).toBe(true)
  })
})
