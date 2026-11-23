import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MissionManager from '@/components/panel/settings/MissionManager.vue'
import * as panelApi from '@/services/panelApi'

const sampleMissions = () => [
  { id: 1, text: 'Mendorong pemanfaatan pekarangan.', sort_order: 1, is_active: true },
  { id: 2, text: 'Melatih kewirausahaan wanita tani.', sort_order: 2, is_active: false },
]

const mountManager = () =>
  mount(MissionManager, {
    global: { stubs: { teleport: true } },
  })

describe('MissionManager Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('renders missions from API with hidden label for inactive items', async () => {
    vi.spyOn(panelApi, 'getSuperMissions').mockResolvedValue(sampleMissions())

    const wrapper = mountManager()
    await flushPromises()

    const rows = wrapper.findAll('[data-testid="mission-row"]')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Mendorong pemanfaatan pekarangan.')
    expect(rows[1].text()).toContain('Disembunyikan dari halaman publik')
  })

  it('shows empty state when there are no missions', async () => {
    vi.spyOn(panelApi, 'getSuperMissions').mockResolvedValue([])

    const wrapper = mountManager()
    await flushPromises()

    expect(wrapper.find('[data-testid="mission-manager-empty"]').exists()).toBe(true)
  })

  it('adds a new mission to the end of the list', async () => {
    vi.spyOn(panelApi, 'getSuperMissions').mockResolvedValue(sampleMissions())
    const createSpy = vi.spyOn(panelApi, 'createSuperMission').mockResolvedValue({
      message: 'Butir misi berhasil ditambahkan.',
      data: { id: 3, text: 'Menjalin kemitraan pasar lokal.', sort_order: 3, is_active: true },
    })

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.find('form textarea').setValue('Menjalin kemitraan pasar lokal.')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createSpy).toHaveBeenCalledWith({ text: 'Menjalin kemitraan pasar lokal.' })
    const rows = wrapper.findAll('[data-testid="mission-row"]')
    expect(rows).toHaveLength(3)
    expect(rows[2].text()).toContain('Menjalin kemitraan pasar lokal.')
  })

  it('moves a mission down and sends the new order', async () => {
    vi.spyOn(panelApi, 'getSuperMissions').mockResolvedValue(sampleMissions())
    const reorderSpy = vi.spyOn(panelApi, 'reorderSuperMissions').mockResolvedValue({ message: 'ok' })

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.findAll('[aria-label="Turunkan urutan"]')[0].trigger('click')
    await flushPromises()

    expect(reorderSpy).toHaveBeenCalledWith([
      { id: 2, sort_order: 1 },
      { id: 1, sort_order: 2 },
    ])
    expect(wrapper.findAll('[data-testid="mission-row"]')[0].text()).toContain('Melatih kewirausahaan')
  })

  it('restores the previous order when reorder fails', async () => {
    vi.spyOn(panelApi, 'getSuperMissions').mockResolvedValue(sampleMissions())
    vi.spyOn(panelApi, 'reorderSuperMissions').mockRejectedValue(new Error('network'))

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.findAll('[aria-label="Turunkan urutan"]')[0].trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-testid="mission-row"]')[0].text()).toContain('Mendorong pemanfaatan')
  })
})
