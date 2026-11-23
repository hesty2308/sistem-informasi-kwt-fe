import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import PublicLayout from '../layouts/PublicLayout.vue'
import AboutBreadcrumb from '../components/about/AboutBreadcrumb.vue'
import AboutSubNav from '../components/about/AboutSubNav.vue'
import AboutPager from '../components/about/AboutPager.vue'
import AboutIdentityView from '../views/public/AboutIdentityView.vue'
import AboutVisionMissionView from '../views/public/AboutVisionMissionView.vue'
import AboutHistoryView from '../views/public/AboutHistoryView.vue'
import AboutStructureView from '../views/public/AboutStructureView.vue'
import { createHead } from '@unhead/vue/client'
import { aboutPages } from '../config/aboutPages'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('About Sub-Routes & Navigation Dropdown', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await router.push('/')
    await router.isReady()
  })

  it('redirects /tentang to /tentang/identitas', async () => {
    await router.push('/tentang')
    expect(router.currentRoute.value.path).toBe('/tentang/identitas')
    expect(router.currentRoute.value.name).toBe('about-identity')
  })

  it('resolves all 4 about sub-routes correctly', async () => {
    const routes = [
      { path: '/tentang/identitas', name: 'about-identity' },
      { path: '/tentang/visi-misi', name: 'about-vision-mission' },
      { path: '/tentang/sejarah', name: 'about-history' },
      { path: '/tentang/struktur-organisasi', name: 'about-structure' },
    ]

    for (const r of routes) {
      await router.push(r.path)
      expect(router.currentRoute.value.path).toBe(r.path)
      expect(router.currentRoute.value.name).toBe(r.name)
    }
  })

  it('renders PublicLayout with Tentang dropdown and sub-links from shared config', async () => {
    const pinia = createPinia()
    const head = createHead()
    setActivePinia(pinia)

    await router.push('/tentang/visi-misi')
    await router.isReady()

    const wrapper = mount(PublicLayout, {
      global: {
        plugins: [pinia, head, router],
      },
      slots: {
        default: '<div id="test-content">Konten Pengujian</div>',
      },
    })

    const text = wrapper.text()
    expect(text).toContain('Tentang')
    for (const page of aboutPages) {
      expect(text).toContain(page.label)
    }
  })

  it('renders all 4 temporary about views properly', () => {
    const pinia = createPinia()
    const head = createHead()
    setActivePinia(pinia)

    const views = [
      { comp: AboutIdentityView, title: 'Identitas Organisasi' },
      { comp: AboutVisionMissionView, title: 'Visi dan Misi' },
      { comp: AboutHistoryView, title: 'Sejarah Singkat' },
      { comp: AboutStructureView, title: 'Struktur Organisasi' },
    ]

    for (const v of views) {
      const wrapper = mount(v.comp, {
        global: {
          plugins: [pinia, head, router],
        },
      })
      expect(wrapper.text()).toContain(v.title)
    }
  })
})

describe('AboutBreadcrumb Component', () => {
  it('renders Beranda, Tentang links and active page name', () => {
    const wrapper = mount(AboutBreadcrumb, {
      props: { current: 'Identitas Organisasi' },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Beranda')
    expect(wrapper.text()).toContain('Tentang')
    expect(wrapper.text()).toContain('Identitas Organisasi')

    // Item terakhir bukan link dan memiliki aria-current="page"
    const currentItem = wrapper.find('[data-testid="breadcrumb-current"]')
    expect(currentItem.exists()).toBe(true)
    expect(currentItem.find('a').exists()).toBe(false)
    expect(currentItem.text()).toBe('Identitas Organisasi')
  })
})

describe('AboutSubNav Component', () => {
  it('renders all sub-pages from shared config and marks active route', async () => {
    await router.push('/tentang/sejarah')
    await router.isReady()

    const wrapper = mount(AboutSubNav, {
      global: {
        plugins: [router],
      },
    })

    for (const page of aboutPages) {
      expect(wrapper.text()).toContain(page.label)
    }

    // Link dengan path /tentang/sejarah harus memiliki class aktif (bg-primary)
    const links = wrapper.findAllComponents({ name: 'RouterLink' })
    const activeLink = links.find((l) => l.props('to') === '/tentang/sejarah')
    expect(activeLink).toBeDefined()
    expect(activeLink.classes()).toContain('bg-primary')
  })
})

describe('AboutPager Component', () => {
  it('hides previous button on first page (/tentang/identitas)', async () => {
    await router.push('/tentang/identitas')
    await router.isReady()

    const wrapper = mount(AboutPager, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('[data-testid="pager-prev"]').exists()).toBe(false)
    const nextBtn = wrapper.find('[data-testid="pager-next"]')
    expect(nextBtn.exists()).toBe(true)
    expect(nextBtn.text()).toContain('Berikutnya')
    expect(nextBtn.text()).toContain('Visi dan Misi')
  })

  it('shows both previous and next buttons on middle page (/tentang/visi-misi)', async () => {
    await router.push('/tentang/visi-misi')
    await router.isReady()

    const wrapper = mount(AboutPager, {
      global: {
        plugins: [router],
      },
    })

    const prevBtn = wrapper.find('[data-testid="pager-prev"]')
    const nextBtn = wrapper.find('[data-testid="pager-next"]')

    expect(prevBtn.exists()).toBe(true)
    expect(prevBtn.text()).toContain('Sebelumnya')
    expect(prevBtn.text()).toContain('Identitas Organisasi')

    expect(nextBtn.exists()).toBe(true)
    expect(nextBtn.text()).toContain('Berikutnya')
    expect(nextBtn.text()).toContain('Sejarah Singkat')
  })

  it('hides next button on last page (/tentang/struktur-organisasi)', async () => {
    await router.push('/tentang/struktur-organisasi')
    await router.isReady()

    const wrapper = mount(AboutPager, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('[data-testid="pager-next"]').exists()).toBe(false)
    const prevBtn = wrapper.find('[data-testid="pager-prev"]')
    expect(prevBtn.exists()).toBe(true)
    expect(prevBtn.text()).toContain('Sebelumnya')
    expect(prevBtn.text()).toContain('Sejarah Singkat')
  })
})
