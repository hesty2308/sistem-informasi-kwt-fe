import { ref, computed } from 'vue'
import { getPublicGalleries } from '@/services/publicApi'

export function useGallery() {
  const items = ref([])
  const currentPage = ref(0)
  const lastPage = ref(1)
  const total = ref(0)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const error = ref(null)
  const loadMoreError = ref(null)

  const hasMore = computed(() => currentPage.value < lastPage.value)

  const toMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback

  const applyMeta = (res, fallbackPage) => {
    currentPage.value = res?.meta?.current_page || fallbackPage
    lastPage.value = res?.meta?.last_page || lastPage.value
    total.value = res?.meta?.total ?? items.value.length
  }

  const fetchFirstPage = async () => {
    isLoading.value = true
    error.value = null
    loadMoreError.value = null
    try {
      const res = await getPublicGalleries(1)
      items.value = Array.isArray(res?.data) ? res.data : []
      lastPage.value = 1
      applyMeta(res, 1)
    } catch (err) {
      error.value = toMessage(err, 'Tidak dapat terhubung ke server.')
    } finally {
      isLoading.value = false
    }
  }

  // Appends the next page (9 photos); failures keep the photos already shown.
  const loadMore = async () => {
    if (!hasMore.value || isLoadingMore.value) return
    isLoadingMore.value = true
    loadMoreError.value = null
    try {
      const res = await getPublicGalleries(currentPage.value + 1)
      const known = new Set(items.value.map((item) => item.id))
      items.value.push(...(res?.data || []).filter((item) => !known.has(item.id)))
      applyMeta(res, currentPage.value + 1)
    } catch (err) {
      loadMoreError.value = toMessage(err, 'Gagal memuat foto berikutnya.')
    } finally {
      isLoadingMore.value = false
    }
  }

  return {
    items,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    fetchFirstPage,
    loadMore,
  }
}
