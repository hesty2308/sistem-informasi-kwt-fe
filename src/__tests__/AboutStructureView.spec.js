import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { createHead } from '@unhead/vue/client'
import AboutStructureView from '../views/public/AboutStructureView.vue'
import AboutHistoryView from '../views/public/AboutHistoryView.vue'
import * as publicApi from '../services/publicApi'

beforeAll(() => {
  window.scrollTo = () => {}
  // jsdom lacks matchMedia; useReveal and the carousel read prefers-reduced-motion from it.
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  })
})

const membersPage = (members, meta = {}) => ({
  data: members,
  meta: { current_page: 1, last_page: 1, total: members.length, ...meta },
})

describe('AboutStructureView & AboutHistoryView', () => {
  let pinia
  let head

  const mountView = (component) =>
    mount(component, {
      global: { plugins: [pinia, head, router] },
    })

  beforeEach(async () => {
    pinia = createPinia()
    head = createHead()
    setActivePinia(pinia)
    await router.push('/tentang/struktur-organisasi')
    await router.isReady()
    vi.restoreAllMocks()
  })

  it('renders member cards with photo or initials and the period', async () => {
    vi.spyOn(publicApi, 'getPublicStructure').mockResolvedValue({
      title: 'Susunan Pengurus',
      period: '2024–2029',
    })
    vi.spyOn(publicApi, 'getPublicStructureMembers').mockResolvedValue(
      membersPage([
        { id: 1, name: 'Siti Aminah', position: 'Ketua', photo_url: '/storage/a.webp', thumb_url: '/storage/thumb_a.webp' },
        { id: 2, name: 'Rina Wati', position: 'Sekretaris', photo_url: null, thumb_url: null },
      ])
    )

    const wrapper = mountView(AboutStructureView)
    await flushPromises()

    expect(wrapper.text()).toContain('Periode kepengurusan 2024–2029')
    const cards = wrapper.findAll('[data-testid="board-member-card"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].find('img').attributes('src')).toBe('/storage/thumb_a.webp')
    expect(cards[0].find('img').attributes('alt')).toBe('Foto Siti Aminah')
    expect(cards[1].find('[data-testid="board-member-initials"]').text()).toBe('RW')
  })

  it('shows empty state when no members are available', async () => {
    vi.spyOn(publicApi, 'getPublicStructure').mockResolvedValue({ title: 'Susunan Pengurus', period: '' })
    vi.spyOn(publicApi, 'getPublicStructureMembers').mockResolvedValue(membersPage([]))

    const wrapper = mountView(AboutStructureView)
    await flushPromises()

    expect(wrapper.find('[data-testid="empty-state"]').text()).toContain('Data pengurus belum tersedia.')
  })

  it('shows error state with retry when the API fails', async () => {
    vi.spyOn(publicApi, 'getPublicStructure').mockRejectedValue(new Error('Gagal terhubung'))
    vi.spyOn(publicApi, 'getPublicStructureMembers').mockResolvedValue(membersPage([]))

    const wrapper = mountView(AboutStructureView)
    await flushPromises()

    expect(wrapper.find('[data-testid="error-state"]').text()).toContain('Coba Lagi')
  })

  it('renders history paragraphs and the timeline', async () => {
    vi.spyOn(publicApi, 'getPublicHistory').mockResolvedValue({
      title: 'Jejak Langkah Kami',
      text: 'Paragraf pertama.\n\nParagraf kedua.',
      milestones: [
        { id: 1, year: 2015, title: 'Awal pembentukan', description: 'Kelompok kecil.' },
        { id: 2, year: 2018, title: 'Resmi berdiri', description: null },
      ],
    })

    const wrapper = mountView(AboutHistoryView)
    await flushPromises()

    expect(wrapper.findAll('[data-testid="history-narrative"] p')).toHaveLength(2)
    const items = wrapper.findAll('[data-testid="history-milestone"]')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('2015')
    expect(items[1].text()).toContain('Resmi berdiri')
  })

  it('shows empty history state when there is no content', async () => {
    vi.spyOn(publicApi, 'getPublicHistory').mockResolvedValue({ title: 'Jejak', text: '', milestones: [] })

    const wrapper = mountView(AboutHistoryView)
    await flushPromises()

    expect(wrapper.find('[data-testid="empty-state"]').text()).toContain('Belum ada catatan sejarah.')
  })
})
