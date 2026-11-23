import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { createHead } from '@unhead/vue/client'
import AboutVisionMissionView from '../views/public/AboutVisionMissionView.vue'
import * as publicApi from '../services/publicApi'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('AboutVisionMissionView Component', () => {
  let pinia
  let head

  beforeEach(async () => {
    pinia = createPinia()
    head = createHead()
    setActivePinia(pinia)
    await router.push('/tentang/visi-misi')
    await router.isReady()
    vi.restoreAllMocks()
  })

  it('renders vision and missions correctly from API endpoint', async () => {
    vi.spyOn(publicApi, 'getPublicVisionMission').mockResolvedValue({
      vision_title: 'Cita-Cita Bersama KWT',
      vision: 'Terwujudnya kemandirian pangan keluarga tani yang sejahtera.',
      mission_title: 'Misi dan Langkah Strategis',
      seo_title: 'Visi dan Misi Pengujian',
      seo_description: 'Deskripsi SEO pengujian visi misi.',
      missions: [
        { id: 1, text: 'Mendorong pemanfaatan pekarangan.', sort_order: 1, is_active: true },
        { id: 2, text: 'Meningkatkan keterampilan pengolahan pangan.', sort_order: 2, is_active: true },
        { id: 3, text: 'Mengembangkan jejaring pemasaran produk.', sort_order: 3, is_active: true },
      ],
    })

    const wrapper = mount(AboutVisionMissionView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    // Wait for async fetch to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Visi dan Misi')
    expect(text).toContain('Arah & Tujuan Gerakan')
    expect(text).toContain('Visi Organisasi')
    expect(text).toContain('Cita-Cita Bersama KWT')
    expect(text).toContain('Terwujudnya kemandirian pangan keluarga tani yang sejahtera.')
    expect(text).toContain('Misi Organisasi')
    expect(text).toContain('Misi dan Langkah Strategis')
    expect(text).toContain('Mendorong pemanfaatan pekarangan.')
    expect(text).toContain('Meningkatkan keterampilan pengolahan pangan.')
    expect(text).toContain('Mengembangkan jejaring pemasaran produk.')

    // Check mission items count
    const missionItems = wrapper.findAll('[data-testid="mission-item"]')
    expect(missionItems).toHaveLength(3)
    expect(missionItems[0].text()).toContain('1')
    expect(missionItems[0].text()).toContain('Mendorong pemanfaatan pekarangan.')
    expect(missionItems[1].text()).toContain('2')
    expect(missionItems[2].text()).toContain('3')

    // Verify that subnav, breadcrumb, and pager are not rendered in this view
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').exists()).toBe(false)
    expect(wrapper.find('nav[aria-label="Navigasi Halaman Tentang"]').exists()).toBe(false)
    expect(wrapper.find('nav[aria-label="Navigasi Halaman Sebelumnya dan Berikutnya"]').exists()).toBe(false)
  })

  it('shows friendly fallbacks when vision or missions are empty', async () => {
    vi.spyOn(publicApi, 'getPublicVisionMission').mockResolvedValue({
      vision_title: 'Cita-Cita Bersama',
      vision: '',
      mission_title: 'Langkah Strategis Kami',
      seo_title: '',
      seo_description: '',
      missions: [],
    })

    const wrapper = mount(AboutVisionMissionView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    await flushPromises()

    const visionEmpty = wrapper.find('[data-testid="vision-empty"]')
    expect(visionEmpty.exists()).toBe(true)
    expect(visionEmpty.text()).toContain('Visi organisasi belum diatur oleh pengelola.')

    const missionEmpty = wrapper.find('[data-testid="mission-empty"]')
    expect(missionEmpty.exists()).toBe(true)
    expect(missionEmpty.text()).toContain('Misi organisasi belum diatur oleh pengelola.')
  })

  it('renders loading state while waiting for data', async () => {
    // Return unresolved promise to simulate pending state
    vi.spyOn(publicApi, 'getPublicVisionMission').mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(AboutVisionMissionView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Memuat visi dan misi...')
  })

  it('renders error state when API request fails', async () => {
    vi.spyOn(publicApi, 'getPublicVisionMission').mockRejectedValue(new Error('Koneksi internet bermasalah'))

    const wrapper = mount(AboutVisionMissionView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    await flushPromises()

    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Gagal Memuat Data')
    expect(wrapper.text()).toContain('Koneksi internet bermasalah')
  })
})
