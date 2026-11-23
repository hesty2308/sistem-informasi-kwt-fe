import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserTable from '@/components/panel/UserTable.vue'
import SettingIdentityTab from '@/components/panel/settings/SettingIdentityTab.vue'
import { useAuthStore } from '@/stores/auth'

describe('Super Admin Panel Components', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('UserTable renders user list with role badges and disabled self-action', () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, name: 'Super Admin', role: 'super_admin' }

    const users = [
      {
        id: 1,
        name: 'Super Admin',
        email: 'super@kwtkartini.id',
        role: 'super_admin',
        is_active: true,
        last_login_at: '2026-10-21T10:00:00Z',
      },
      {
        id: 2,
        name: 'Pengurus Tani',
        email: 'pengurus@kwtkartini.id',
        role: 'admin',
        is_active: false,
        last_login_at: null,
      },
    ]

    const wrapper = mount(UserTable, {
      props: {
        users,
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Super Admin')
    expect(wrapper.text()).toContain('Anda')
    expect(wrapper.text()).toContain('Pengurus Tani')
    expect(wrapper.text()).toContain('Nonaktif')
    expect(wrapper.text()).toContain('Belum pernah')

    // Find delete buttons - self button should be disabled
    const buttons = wrapper.findAll('button[title*="akun sendiri"]')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('SettingIdentityTab renders site name and tagline inputs', () => {
    const form = {
      site_name: 'Paguyuban KWT Kartini',
      site_tagline: 'Maju Bersama',
      logo_url: null,
      logo_file: null,
      hero_image_url: null,
      hero_file: null,
    }

    const wrapper = mount(SettingIdentityTab, {
      props: {
        form,
        errors: {},
      },
    })

    expect(wrapper.text()).toContain('Nama Paguyuban')
    expect(wrapper.text()).toContain('Slogan')
    expect(wrapper.text()).toContain('Logo Paguyuban')
  })

  it('SettingNavTab renders navigation menu repeater items and can add new item', async () => {
    const SettingNavTab = (await import('@/components/panel/settings/SettingNavTab.vue')).default
    const form = {
      nav_menus: [
        { id: 1, name: 'Beranda', path: '/', is_active: true, order: 1 },
        { id: 2, name: 'Tentang', path: '/tentang', is_active: true, order: 2 },
      ],
    }

    const wrapper = mount(SettingNavTab, {
      props: {
        form,
        errors: {},
      },
    })

    expect(wrapper.text()).toContain('Menu Utama Website')
    // Each item: a name field + a page picker (no typed URL path).
    expect(wrapper.findAll('input').length).toBe(2)
    const pickers = wrapper.findAll('select')
    expect(pickers.map((s) => s.element.value)).toEqual(['/', '/tentang'])

    // Click Tambah Menu
    const addBtn = wrapper.find('button')
    await addBtn.trigger('click')

    expect(form.nav_menus.length).toBe(3)
    expect(wrapper.emitted('mark-dirty')).toBeTruthy()
  })
})
