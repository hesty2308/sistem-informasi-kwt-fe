import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MilestoneManager from '@/components/panel/settings/MilestoneManager.vue'
import * as panelApi from '@/services/panelApi'

const sampleMilestones = () => [
  { id: 1, year: 2015, title: 'Awal pembentukan', description: 'Kelompok kecil.', is_active: true },
  { id: 2, year: 2021, title: 'Program P2L', description: null, is_active: false },
]

const mountManager = () =>
  mount(MilestoneManager, {
    global: { stubs: { teleport: true } },
  })

describe('MilestoneManager Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('renders milestones with hidden label for inactive items', async () => {
    vi.spyOn(panelApi, 'getSuperHistoryMilestones').mockResolvedValue(sampleMilestones())

    const wrapper = mountManager()
    await flushPromises()

    const rows = wrapper.findAll('[data-testid="milestone-row"]')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('2015')
    expect(rows[0].text()).toContain('Awal pembentukan')
    expect(rows[1].text()).toContain('Disembunyikan dari halaman publik')
  })

  it('shows empty state when there are no milestones', async () => {
    vi.spyOn(panelApi, 'getSuperHistoryMilestones').mockResolvedValue([])

    const wrapper = mountManager()
    await flushPromises()

    expect(wrapper.find('[data-testid="milestone-manager-empty"]').exists()).toBe(true)
  })

  it('adds a milestone and keeps the list sorted by year', async () => {
    vi.spyOn(panelApi, 'getSuperHistoryMilestones').mockResolvedValue(sampleMilestones())
    const createSpy = vi.spyOn(panelApi, 'createSuperHistoryMilestone').mockResolvedValue({
      message: 'Butir linimasa berhasil ditambahkan.',
      data: { id: 3, year: 2018, title: 'Paguyuban berdiri', description: null, is_active: true },
    })

    const wrapper = mountManager()
    await flushPromises()

    const inputs = wrapper.findAll('form input')
    await inputs[0].setValue('2018')
    await inputs[1].setValue('Paguyuban berdiri')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createSpy).toHaveBeenCalledWith({ year: 2018, title: 'Paguyuban berdiri', description: '' })
    const rows = wrapper.findAll('[data-testid="milestone-row"]')
    expect(rows).toHaveLength(3)
    expect(rows[1].text()).toContain('Paguyuban berdiri')
  })

  it('shows field errors from validation response', async () => {
    vi.spyOn(panelApi, 'getSuperHistoryMilestones').mockResolvedValue([])
    vi.spyOn(panelApi, 'createSuperHistoryMilestone').mockRejectedValue({
      status: 422,
      message: 'Data tidak valid.',
      errors: { year: ['Tahun tidak boleh melebihi tahun berjalan.'] },
    })

    const wrapper = mountManager()
    await flushPromises()

    const inputs = wrapper.findAll('form input')
    await inputs[0].setValue('3000')
    await inputs[1].setValue('Masa depan')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Tahun tidak boleh melebihi tahun berjalan.')
  })
})
