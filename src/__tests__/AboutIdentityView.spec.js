import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { createHead } from '@unhead/vue/client'
import AboutIdentityView from '../views/public/AboutIdentityView.vue'
import { useSettingsStore } from '../stores/settings'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('AboutIdentityView Component', () => {
  let pinia
  let head

  beforeEach(async () => {
    pinia = createPinia()
    head = createHead()
    setActivePinia(pinia)
    await router.push('/tentang/identitas')
    await router.isReady()
  })

  it('renders all organization identity information from settings store', () => {
    const store = useSettingsStore()
    store.isLoaded = true
    store.settings = {
      about_identity_full_name: 'Paguyuban Kelompok Wanita Tani Kartini Kabupaten Ogan Komering Ulu Timur',
      about_identity_abbreviation: 'KWT Kartini OKU Timur',
      about_identity_short_desc: 'Wadah persatuan dan pemberdayaan kaum perempuan tani.',
      about_text: 'Fokus utama gerakan kami adalah optimalisasi lahan pekarangan.',
      site_tagline: 'Pemberdayaan Wanita Tani Menuju Kemandirian Pangan',
      phone_whatsapp: '082188991234',
      email: 'info@kwtkartini.id',
      facebook_url: 'https://facebook.com/kwtkartini',
      address: 'Jl. Belitang No. 12',
    }

    const wrapper = mount(AboutIdentityView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    const text = wrapper.text()
    expect(text).toContain('Paguyuban Kelompok Wanita Tani Kartini')
    expect(text).toContain('KWT Kartini OKU Timur')
    expect(text).toContain('Fokus utama gerakan kami adalah optimalisasi lahan pekarangan.')
    // The "Informasi Pokok Organisasi" card was removed (contact data stays in the footer only).
    expect(text).not.toContain('Informasi Pokok Organisasi')
    expect(text).not.toContain('Alamat Sekretariat')
    expect(text).toContain('Wadah persatuan dan pemberdayaan kaum perempuan tani.')
    expect(text).toContain('Identitas Resmi Organisasi')
    expect(text).not.toContain('null')
  })

  it('never displays null when identity fields are empty', () => {
    const store = useSettingsStore()
    store.isLoaded = true
    store.settings = {
      about_identity_full_name: 'Paguyuban KWT Kartini',
      about_identity_abbreviation: '',
      phone_whatsapp: '',
      email: '',
      facebook_url: '',
      address: '',
    }

    const wrapper = mount(AboutIdentityView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    // Never output the string "null"
    expect(wrapper.text()).not.toContain('null')
  })

  it('shows loading state when settings are being fetched and not yet loaded', () => {
    const store = useSettingsStore()
    store.isLoaded = false
    store.isLoading = true

    const wrapper = mount(AboutIdentityView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Memuat informasi identitas...')
  })
})
