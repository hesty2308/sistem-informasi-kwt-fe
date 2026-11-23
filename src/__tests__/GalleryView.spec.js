import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../router'
import { createHead } from '@unhead/vue/client'
import GalleryView from '../views/public/GalleryView.vue'
import * as publicApi from '../services/publicApi'

beforeAll(() => {
  window.scrollTo = () => {}
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  })
})

const makePhotos = (from, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: from + i,
    title: `Foto ${from + i}`,
    caption: null,
    image_url: `/storage/galleries/${from + i}.webp`,
    thumbnail_url: `/storage/galleries/thumb_${from + i}.webp`,
  }))

const page = (data, currentPage, lastPage, total) => ({
  data,
  meta: { current_page: currentPage, last_page: lastPage, total },
})

describe('GalleryView', () => {
  let pinia
  let head

  const mountView = () =>
    mount(GalleryView, {
      attachTo: document.body,
      global: { plugins: [pinia, head, router] },
    })

  beforeEach(async () => {
    pinia = createPinia()
    head = createHead()
    setActivePinia(pinia)
    await router.push('/galeri')
    await router.isReady()
    vi.restoreAllMocks()
  })

  it('renders the first nine photos and loads more on click', async () => {
    const spy = vi
      .spyOn(publicApi, 'getPublicGalleries')
      .mockResolvedValueOnce(page(makePhotos(1, 9), 1, 2, 12))
      .mockResolvedValueOnce(page(makePhotos(10, 3), 2, 2, 12))

    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.findAll('[data-testid="gallery-item"]')).toHaveLength(9)
    expect(wrapper.find('[data-testid="gallery-count"]').text()).toBe('Menampilkan 9 dari 12 foto')

    await wrapper.find('[data-testid="gallery-load-more"]').trigger('click')
    await flushPromises()

    expect(spy).toHaveBeenLastCalledWith(2)
    expect(wrapper.findAll('[data-testid="gallery-item"]')).toHaveLength(12)
    expect(wrapper.find('[data-testid="gallery-load-more"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps photos and offers retry when loading the next page fails', async () => {
    vi.spyOn(publicApi, 'getPublicGalleries')
      .mockResolvedValueOnce(page(makePhotos(1, 9), 1, 2, 12))
      .mockRejectedValueOnce(new Error('Gagal memuat foto berikutnya.'))

    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="gallery-load-more"]').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-testid="gallery-item"]')).toHaveLength(9)
    expect(wrapper.find('[role="alert"]').text()).toContain('Gagal memuat foto berikutnya.')
    expect(wrapper.find('[data-testid="gallery-load-more"]').text()).toContain('Coba lagi')
    wrapper.unmount()
  })

  it('lightbox shows the server total and fetches the next page past the last loaded photo', async () => {
    const spy = vi
      .spyOn(publicApi, 'getPublicGalleries')
      .mockResolvedValueOnce(page(makePhotos(1, 9), 1, 2, 12))
      .mockResolvedValueOnce(page(makePhotos(10, 3), 2, 2, 12))

    const wrapper = mountView()
    await flushPromises()

    await wrapper.findAll('[data-testid="gallery-item"]')[8].trigger('click')
    await flushPromises()

    const counter = () => document.querySelector('[data-testid="lightbox-counter"]').textContent.replace(/\s+/g, ' ').trim()
    expect(counter()).toBe('Foto 9 dari 12')
    expect(spy).toHaveBeenCalledTimes(2)

    document.querySelector('[data-testid="lightbox-next"]').click()
    await flushPromises()

    expect(counter()).toBe('Foto 10 dari 12')
    wrapper.unmount()
  })

  it('shows empty state when there are no photos', async () => {
    vi.spyOn(publicApi, 'getPublicGalleries').mockResolvedValue(page([], 1, 1, 0))

    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="empty-state"]').text()).toContain('Belum Ada Foto Galeri')
    wrapper.unmount()
  })

  it('shows error state with retry when the first page fails', async () => {
    vi.spyOn(publicApi, 'getPublicGalleries').mockRejectedValue(new Error('Gagal terhubung'))

    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
    wrapper.unmount()
  })
})
