import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import * as panelApi from '../services/panelApi'
import * as publicApi from '../services/publicApi'
import { useSettingForm } from '../composables/useSettingForm'
import { settingSections } from '../config/settingSections'

const STORED = {
  site_name: 'Paguyuban KWT Kartini',
  logo_url: 'http://127.0.0.1:8000/storage/settings/logo.webp',
  hero_image_url: 'http://127.0.0.1:8000/storage/settings/hero.webp',
}

// The composable registers lifecycle hooks and a route guard, so run it inside a component.
const mountForm = async () => {
  let api
  const Host = defineComponent({
    setup() {
      api = useSettingForm()
      return () => h('div')
    },
  })
  mount(Host, { global: { plugins: [router] } })
  await flushPromises()
  return api
}

const sentForm = (spy, call) => spy.mock.calls[call][0]

describe('useSettingForm image handling', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await router.push('/')
    await router.isReady()
    vi.restoreAllMocks()
    vi.spyOn(panelApi, 'getSuperSettings').mockResolvedValue({ ...STORED })
    vi.spyOn(publicApi, 'getPublicSettings').mockResolvedValue({ ...STORED })
  })

  it('loads the stored logo and hero image URLs for the previews', async () => {
    const api = await mountForm()
    expect(api.form.value.logo_url).toBe(STORED.logo_url)
    expect(api.form.value.hero_image_url).toBe(STORED.hero_image_url)
  })

  it('uploads a new logo once and does not re-send it on the next save', async () => {
    const update = vi.spyOn(panelApi, 'updateSuperSettings').mockResolvedValue({ data: { ...STORED } })
    const api = await mountForm()

    api.handleUpdateLogo(new File(['x'], 'logo.png', { type: 'image/png' }))
    await api.handleSave()
    expect(sentForm(update, 0).get('logo')).toBeInstanceOf(File)

    await api.handleSave()
    expect(sentForm(update, 1).has('logo')).toBe(false)
    expect(api.form.value.logo_file).toBe(null)
  })

  it('asks the server to delete the hero image when it is removed', async () => {
    const update = vi.spyOn(panelApi, 'updateSuperSettings').mockResolvedValue({ data: { ...STORED, hero_image_url: null } })
    const api = await mountForm()

    api.handleUpdateHero(null)
    await api.handleSave()

    expect(sentForm(update, 0).get('remove_hero_image')).toBe('1')
    expect(sentForm(update, 0).has('remove_logo')).toBe(false)
    expect(api.form.value.hero_image_url).toBe(null)
  })

  it('resets only the keys of one section and keeps unsaved edits elsewhere', async () => {
    const reset = vi.spyOn(panelApi, 'resetSuperSettings').mockResolvedValue({
      data: { ...STORED, footer_text: 'Teks Footer Bawaan', footer_copyright: 'Semua hak dilindungi.' },
    })
    const api = await mountForm()
    api.form.value.footer_text = 'Footer Ubahan'
    api.form.value.site_name = 'Nama Belum Disimpan'

    const footer = settingSections.find((section) => section.slug === 'footer')
    await api.handleReset(footer.keys, footer.label)

    expect(reset).toHaveBeenCalledWith(footer.keys)
    expect(api.form.value.footer_text).toBe('Teks Footer Bawaan')
    expect(api.form.value.site_name).toBe('Nama Belum Disimpan')
  })

  it('every settings section only lists keys that exist in the settings form', async () => {
    const api = await mountForm()
    const imageKeys = ['logo', 'hero_image']
    for (const section of settingSections) {
      expect(section.keys.length).toBeGreaterThan(0)
      for (const key of section.keys.filter((k) => !imageKeys.includes(k))) {
        expect(key in api.form.value, `${section.slug}: ${key}`).toBe(true)
      }
    }
  })
})
