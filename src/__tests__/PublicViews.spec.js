import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import router from '../router'
import PageBanner from '../components/public/PageBanner.vue'
import PostCard from '../components/public/PostCard.vue'
import NetworkError from '../components/ui/NetworkError.vue'
import NotFoundView from '../views/public/NotFoundView.vue'
import HomeView from '../views/public/HomeView.vue'
import { useSettingsStore } from '../stores/settings'
import * as publicApi from '../services/publicApi'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('Public Components & Views', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('PageBanner renders title and subtitle without a badge or blinking dot', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Kegiatan Kami',
        subtitle: 'Berita dan kegiatan terbaru',
      },
    })

    expect(wrapper.text()).toContain('Kegiatan Kami')
    expect(wrapper.text()).toContain('Berita dan kegiatan terbaru')
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    expect(wrapper.find('.bg-accent\\/20').exists()).toBe(false)
  })

  it('PostCard renders post title, category, and date box', () => {
    const post = {
      id: 1,
      title: 'Pelatihan Olahan Pangan Lokal',
      slug: 'pelatihan-olahan-pangan-lokal',
      excerpt: 'Kegiatan pelatihan pembuatan tepung mocaf.',
      published_day: '21',
      published_month_short: 'OKT',
      views: 45,
      category: {
        id: 1,
        name: 'Pelatihan',
      },
    }

    const wrapper = mount(PostCard, {
      props: { post },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Pelatihan Olahan Pangan Lokal')
    expect(wrapper.text()).toContain('Pelatihan')
    expect(wrapper.text()).toContain('21')
    expect(wrapper.text()).toContain('OKT')
    expect(wrapper.text()).toContain('Baca Selengkapnya')
  })

  it('NetworkError renders Indonesian text and emits retry on button click', async () => {
    const wrapper = mount(NetworkError, {
      props: {
        title: 'Tidak dapat terhubung. Coba lagi',
        retryLabel: 'Muat Ulang',
      },
    })

    expect(wrapper.text()).toContain('Tidak dapat terhubung. Coba lagi')
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('NotFoundView renders Indonesian 404 message and home link', () => {
    const pinia = createPinia()
    const head = createHead()
    setActivePinia(pinia)

    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [pinia, head, router],
      },
    })

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Halaman Tidak Ditemukan')
    expect(wrapper.text()).toContain('Kembali ke Beranda')
  })

  it('HomeView no longer shows the removed hero badge, statistics, Facebook banner, or footer badge', async () => {
    vi.spyOn(publicApi, 'getPublicHome').mockResolvedValue({ posts: [], galleries: [] })
    const pinia = createPinia()
    setActivePinia(pinia)
    const settingsStore = useSettingsStore()
    settingsStore.fetchSettings = vi.fn()
    // Stale values a not-yet-migrated server could still send must not reappear.
    settingsStore.settings = {
      ...settingsStore.settings,
      hero_badge: 'Pemberdayaan Wanita Tani OKU Timur',
      home_stats_title: 'Kemandirian dari Pekarangan Rumah',
      home_stats_subtitle: 'Membangun kedaulatan pangan keluarga berbasis gotong royong dan kearifan lokal',
      stat_cards: [{ id: 1, icon: 'Users', number: '12+', title: 'Kelompok Tani Desa', description: '', order: 1 }],
      cta_facebook_badge: 'Keluarga Besar KWT Kartini',
      cta_facebook_title: 'Dukung dan Ikuti Kiprah Wanita Tani OKU Timur',
      cta_facebook_btn_text: 'Ikuti Kami di Facebook',
      footer_badge: 'Gerakan Perempuan Berdaya, Pangan Mandiri',
    }

    const wrapper = mount(HomeView, {
      global: { plugins: [pinia, createHead(), router], directives: { reveal: {} } },
    })
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain(settingsStore.heroTitle1)
    for (const removed of [
      'Pemberdayaan Wanita Tani OKU Timur',
      'Kemandirian dari Pekarangan Rumah',
      'Membangun kedaulatan pangan keluarga',
      'Kelompok Tani Desa',
      'Keluarga Besar KWT Kartini',
      'Dukung dan Ikuti Kiprah Wanita Tani OKU Timur',
      'Ikuti Kami di Facebook',
      'Gerakan Perempuan Berdaya, Pangan Mandiri',
    ]) {
      expect(text).not.toContain(removed)
    }
    vi.restoreAllMocks()
  })
})
