import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BoardMemberCarousel from '@/components/public/BoardMemberCarousel.vue'

const makeMembers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Pengurus ${i + 1}`,
    position: 'Anggota',
    photo_url: null,
    thumb_url: null,
  }))

const mockReducedMotion = (reduce) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }))
}

describe('BoardMemberCarousel Component', () => {
  let scrollToSpy

  beforeEach(() => {
    vi.useFakeTimers()
    scrollToSpy = vi.fn()
    Element.prototype.scrollTo = scrollToSpy
  })

  afterEach(() => {
    vi.useRealTimers()
    delete Element.prototype.scrollTo
  })

  it('renders every loaded member as a card with the range label', () => {
    mockReducedMotion(false)
    const wrapper = mount(BoardMemberCarousel, { props: { members: makeMembers(3), total: 3 } })

    expect(wrapper.findAll('[data-testid="board-member-card"]')).toHaveLength(3)
    expect(wrapper.find('[data-testid="carousel-range"]').text()).toBe('1 dari 3')
  })

  it('auto-advances when motion is allowed', async () => {
    mockReducedMotion(false)
    mount(BoardMemberCarousel, { props: { members: makeMembers(3), total: 3 } })

    await vi.advanceTimersByTimeAsync(4000)

    expect(scrollToSpy).toHaveBeenCalled()
  })

  it('does not auto-advance when the user prefers reduced motion', async () => {
    mockReducedMotion(true)
    mount(BoardMemberCarousel, { props: { members: makeMembers(3), total: 3 } })

    await vi.advanceTimersByTimeAsync(12000)

    expect(scrollToSpy).not.toHaveBeenCalled()
  })

  it('pauses auto-advance while hovered', async () => {
    mockReducedMotion(false)
    const wrapper = mount(BoardMemberCarousel, { props: { members: makeMembers(3), total: 3 } })

    await wrapper.find('section').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(12000)

    expect(scrollToSpy).not.toHaveBeenCalled()
  })

  it('requests the next page when reaching the end of loaded members', async () => {
    mockReducedMotion(true)
    const wrapper = mount(BoardMemberCarousel, {
      props: { members: makeMembers(2), total: 11, hasMore: true },
    })

    await wrapper.find('[data-testid="carousel-next"]').trigger('click')

    expect(wrapper.emitted('load-more')).toBeTruthy()
  })

  it('wraps back to the first card when there is nothing more to load', async () => {
    mockReducedMotion(true)
    const wrapper = mount(BoardMemberCarousel, { props: { members: makeMembers(2), total: 2 } })

    // jsdom has no layout, so one card counts as visible: next moves to index 1, then wraps to 0.
    await wrapper.find('[data-testid="carousel-next"]').trigger('click')
    await wrapper.find('[data-testid="carousel-next"]').trigger('click')

    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
    expect(wrapper.emitted('load-more')).toBeFalsy()
  })
})
