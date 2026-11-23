import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { useAuthStore } from '../stores/auth'
import StatCard from '../components/panel/StatCard.vue'
import StatusBadge from '../components/panel/StatusBadge.vue'
import PageHeader from '../components/panel/PageHeader.vue'
import DataTable from '../components/panel/DataTable.vue'
import PanelLayout from '../layouts/PanelLayout.vue'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('Panel Components & Layout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('StatCard renders title, value, and description correctly', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Total Kegiatan',
        value: 12,
        description: 'Kegiatan aktif',
        variant: 'primary',
      },
    })

    expect(wrapper.text()).toContain('Total Kegiatan')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('Kegiatan aktif')
  })

  it('StatusBadge renders proper badge for published, draft, active, and super_admin', () => {
    const wPub = mount(StatusBadge, { props: { status: 'published' } })
    expect(wPub.text()).toContain('Terbit')

    const wDraft = mount(StatusBadge, { props: { status: 'draft' } })
    expect(wDraft.text()).toContain('Draf')

    const wActive = mount(StatusBadge, { props: { status: 'active' } })
    expect(wActive.text()).toContain('Aktif')

    const wSuper = mount(StatusBadge, { props: { status: 'super_admin' } })
    expect(wSuper.text()).toContain('Super Admin')
  })

  it('PageHeader renders title, subtitle, and breadcrumb links', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Profil Saya',
        subtitle: 'Kelola informasi akun',
        breadcrumbs: [
          { label: 'Panel Pengelola', to: '/pengelola' },
          { label: 'Profil Saya' },
        ],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Profil Saya')
    expect(wrapper.text()).toContain('Kelola informasi akun')
    expect(wrapper.text()).toContain('Panel Pengelola')
  })

  it('DataTable renders columns and items', () => {
    const columns = [
      { key: 'title', label: 'Judul' },
      { key: 'category', label: 'Kategori' },
    ]
    const items = [
      { id: 1, title: 'Kegiatan A', category: 'Pelatihan' },
      { id: 2, title: 'Kegiatan B', category: 'Panen' },
    ]

    const wrapper = mount(DataTable, {
      props: { columns, items },
    })

    expect(wrapper.text()).toContain('Kegiatan A')
    expect(wrapper.text()).toContain('Pelatihan')
    expect(wrapper.text()).toContain('Kegiatan B')
    expect(wrapper.text()).toContain('Panen')
  })

  it('PanelLayout shows different navigation for admin vs super_admin', () => {
    const authStore = useAuthStore()

    // 1. As regular Admin
    authStore.user = { id: 2, name: 'Siti Aminah', role: 'admin', email: 'admin@kwt.id' }
    authStore.isInitialized = true

    const wrapperAdmin = mount(PanelLayout, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapperAdmin.text()).toContain('Dashboard')
    expect(wrapperAdmin.text()).toContain('Kegiatan')
    expect(wrapperAdmin.text()).toContain('Profil Saya')
    // Must NOT contain Super Admin section
    expect(wrapperAdmin.text()).not.toContain('Pengaturan Super Admin')
    expect(wrapperAdmin.text()).not.toContain('Kelola Pengelola')

    // 2. As Super Admin
    authStore.user = { id: 1, name: 'Kartini Utama', role: 'super_admin', email: 'super@kwt.id' }

    const wrapperSuper = mount(PanelLayout, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapperSuper.text()).toContain('Dashboard')
    expect(wrapperSuper.text()).toContain('Pengaturan Super Admin')
    expect(wrapperSuper.text()).toContain('Kelola Pengelola')
    expect(wrapperSuper.text()).toContain('Pengaturan Website')
    expect(wrapperSuper.text()).toContain('Riwayat Aktivitas')
  })
})
