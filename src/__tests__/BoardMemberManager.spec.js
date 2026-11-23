import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BoardMemberManager from '@/components/panel/board-member/BoardMemberManager.vue'
import * as panelApi from '@/services/panelApi'

const sampleMembers = () => [
  { id: 1, name: 'Siti Aminah', position: 'Ketua', photo_url: null, thumb_url: null, sort_order: 1, is_active: true },
  { id: 2, name: 'Rina Wati', position: 'Sekretaris', photo_url: null, thumb_url: null, sort_order: 2, is_active: false },
]

const mountManager = () =>
  mount(BoardMemberManager, {
    global: { stubs: { teleport: true } },
  })

describe('BoardMemberManager Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('renders members with initials and hidden label for inactive items', async () => {
    vi.spyOn(panelApi, 'getBoardMembers').mockResolvedValue(sampleMembers())

    const wrapper = mountManager()
    await flushPromises()

    const rows = wrapper.findAll('[data-testid="board-member-row"]')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('SA')
    expect(rows[0].text()).toContain('Ketua')
    expect(rows[1].text()).toContain('Disembunyikan dari halaman publik')
  })

  it('shows empty state when there are no members', async () => {
    vi.spyOn(panelApi, 'getBoardMembers').mockResolvedValue([])

    const wrapper = mountManager()
    await flushPromises()

    expect(wrapper.find('[data-testid="board-member-manager-empty"]').exists()).toBe(true)
  })

  it('moves a member down and sends the new order', async () => {
    vi.spyOn(panelApi, 'getBoardMembers').mockResolvedValue(sampleMembers())
    const reorderSpy = vi.spyOn(panelApi, 'reorderBoardMembers').mockResolvedValue({ message: 'ok' })

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.findAll('[aria-label="Turunkan urutan"]')[0].trigger('click')
    await flushPromises()

    expect(reorderSpy).toHaveBeenCalledWith([
      { id: 2, sort_order: 1 },
      { id: 1, sort_order: 2 },
    ])
    expect(wrapper.findAll('[data-testid="board-member-row"]')[0].text()).toContain('Rina Wati')
  })

  it('toggles visibility with a JSON update', async () => {
    vi.spyOn(panelApi, 'getBoardMembers').mockResolvedValue(sampleMembers())
    const updateSpy = vi.spyOn(panelApi, 'updateBoardMember').mockResolvedValue({
      message: 'ok',
      data: { ...sampleMembers()[0], is_active: false },
    })

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.findAll('[aria-label="Sembunyikan dari publik"]')[0].trigger('click')
    await flushPromises()

    expect(updateSpy).toHaveBeenCalledWith(1, { is_active: false })
    expect(wrapper.findAll('[data-testid="board-member-row"]')[0].text()).toContain('Disembunyikan dari halaman publik')
  })

  it('creates a member through the form dialog', async () => {
    vi.spyOn(panelApi, 'getBoardMembers').mockResolvedValue([])
    const createSpy = vi.spyOn(panelApi, 'createBoardMember').mockResolvedValue({
      message: 'Data pengurus berhasil ditambahkan.',
      data: { id: 9, name: 'Dewi', position: 'Bendahara', photo_url: null, thumb_url: null, sort_order: 1, is_active: true },
    })

    const wrapper = mountManager()
    await flushPromises()

    await wrapper.findAll('button').find((b) => b.text().includes('Tambah Pengurus')).trigger('click')
    await flushPromises()

    const inputs = wrapper.findAll('#board-member-form input:not([type="file"])')
    await inputs[0].setValue('Dewi')
    await inputs[1].setValue('Bendahara')
    await wrapper.find('#board-member-form').trigger('submit')
    await flushPromises()

    expect(createSpy).toHaveBeenCalledTimes(1)
    const formData = createSpy.mock.calls[0][0]
    expect(formData.get('name')).toBe('Dewi')
    expect(formData.get('position')).toBe('Bendahara')
    expect(wrapper.findAll('[data-testid="board-member-row"]')).toHaveLength(1)
  })
})
