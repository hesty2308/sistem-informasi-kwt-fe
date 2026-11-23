import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { useAuthStore } from '../stores/auth'
import PostArticle from '../components/public/PostArticle.vue'
import PasswordField from '../components/panel/profile/PasswordField.vue'
import PanelNavList from '../components/layout/panel/PanelNavList.vue'
import PublicNavbar from '../components/layout/public/PublicNavbar.vue'
import PublicFooter from '../components/layout/public/PublicFooter.vue'
import { useSettingsStore } from '../stores/settings'

describe('Components split out of large views (Plan 06)', () => {
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    await router.push('/')
    await router.isReady()
  })

  it('PostArticle renders the sanitized post body', () => {
    const wrapper = mount(PostArticle, {
      props: {
        post: {
          slug: 'panen-raya',
          title: 'Panen Raya',
          content: '<p>Isi kegiatan panen.</p><script>alert(1)</script>',
          views: 3,
        },
      },
      global: { plugins: [pinia, router] },
    })

    const body = wrapper.find('[data-testid="post-content"]')
    expect(body.text()).toContain('Isi kegiatan panen.')
    expect(body.html()).not.toContain('<script>')
  })

  it('PasswordField toggles between hidden and visible input', async () => {
    const wrapper = mount(PasswordField, {
      props: { label: 'Kata Sandi Baru', modelValue: 'rahasia1' },
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.text()).toContain('Sembunyikan')
  })

  it('PanelNavList shows super admin links only to super admins', async () => {
    const authStore = useAuthStore()
    authStore.setUser({ name: 'Admin', role: 'admin' })

    const wrapper = mount(PanelNavList, { global: { plugins: [pinia, router] } })
    expect(wrapper.text()).toContain('Kegiatan')
    // Board members are managed by admins (not only the super admin).
    expect(wrapper.find('a[href="/pengelola/pengurus"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Pengaturan Super Admin')

    authStore.setUser({ name: 'Super', role: 'super_admin' })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Pengaturan Super Admin')
    expect(wrapper.text()).toContain('Riwayat Aktivitas')
  })

  it('PanelNavList shows settings sections as a sub-menu that opens on settings pages', async () => {
    const authStore = useAuthStore()
    authStore.setUser({ name: 'Super', role: 'super_admin' })

    const wrapper = mount(PanelNavList, { attachTo: document.body, global: { plugins: [pinia, router] } })
    const submenu = () => wrapper.find('[id="panel-settings-submenu"]')
    const toggle = wrapper.find('[data-testid="settings-group-toggle"]')

    // Closed outside the settings pages, opens on click.
    expect(submenu().isVisible()).toBe(false)
    await toggle.trigger('click')
    expect(submenu().isVisible()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('true')

    const visibleItems = () =>
      wrapper.findAll('[data-testid="settings-subitem"]').filter((i) => i.isVisible()).map((i) => i.text())
    expect(visibleItems()).toEqual([
      'Nama, Logo & Bilah Atas',
      'Menu Utama',
      'Beranda',
      'Halaman Kegiatan & Galeri',
      'Kontak',
      'Bagian Bawah (Footer)',
    ])

    // "Tentang" is a nested drop-down holding its four pages.
    const aboutToggle = wrapper.find('[data-testid="settings-subgroup-toggle"]')
    expect(aboutToggle.text()).toBe('Tentang')
    expect(aboutToggle.attributes('aria-expanded')).toBe('false')
    await aboutToggle.trigger('click')
    expect(aboutToggle.attributes('aria-expanded')).toBe('true')
    expect(visibleItems()).toEqual([
      'Nama, Logo & Bilah Atas',
      'Menu Utama',
      'Beranda',
      'Halaman Kegiatan & Galeri',
      'Identitas',
      'Visi & Misi',
      'Sejarah',
      'Pengurus',
      'Kontak',
      'Bagian Bawah (Footer)',
    ])
    const links = wrapper.findAll('[data-testid="settings-subitem"]')
    expect(links.find((l) => l.text() === 'Visi & Misi').attributes('href')).toBe(
      '/pengelola/super/pengaturan/visi-misi'
    )
    wrapper.unmount()
  })

  it('public navbar and footer show no logo when none is uploaded, and the uploaded one otherwise', async () => {
    const settingsStore = useSettingsStore()
    const mountBoth = () => [PublicNavbar, PublicFooter].map((c) => mount(c, { global: { plugins: [pinia, router] } }))

    settingsStore.settings = { ...settingsStore.settings, logo_url: null }
    for (const w of mountBoth()) {
      expect(w.find('img[alt="Logo Paguyuban KWT Kartini"]').exists()).toBe(false)
    }

    settingsStore.settings = { ...settingsStore.settings, logo_url: '/storage/settings/logo.webp' }
    for (const w of mountBoth()) {
      expect(w.find('img[alt="Logo Paguyuban KWT Kartini"]').attributes('src')).toBe('/storage/settings/logo.webp')
    }
  })
})
