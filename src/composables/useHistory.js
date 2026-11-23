import { ref, computed } from 'vue'
import { getPublicHistory } from '@/services/publicApi'
import { readPublicCache, writePublicCache } from '@/utils/publicCache'

const CACHE_KEY = 'history'

export function useHistory() {
  // Start from the last response remembered in this browser (shown instantly), then refresh.
  const cached = readPublicCache(CACHE_KEY)
  const data = ref(cached)
  const isLoading = ref(!cached)
  const isLoaded = ref(!!cached)
  const error = ref(null)

  const fetchHistory = async () => {
    // Refresh silently when content is already on screen.
    isLoading.value = !data.value
    error.value = null
    try {
      const res = await getPublicHistory()
      data.value = res
      writePublicCache(CACHE_KEY, res)
      isLoaded.value = true
      return res
    } catch (err) {
      error.value = err?.response?.data?.message || err?.message || 'Gagal memuat data sejarah.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const title = computed(() => data.value?.title || 'Jejak Langkah Kami')
  // Narrative is plain text; blank lines separate paragraphs.
  const paragraphs = computed(() =>
    String(data.value?.text || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
  )
  const milestones = computed(() => {
    const list = data.value?.milestones
    return Array.isArray(list) ? list : []
  })
  const seoTitle = computed(
    () => data.value?.seo_title || 'Sejarah Singkat - Paguyuban KWT Kartini OKU Timur'
  )
  const seoDescription = computed(
    () =>
      data.value?.seo_description ||
      'Sejarah dan rekam jejak perjuangan Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.'
  )

  return {
    isLoading,
    isLoaded,
    error,
    fetchHistory,
    title,
    paragraphs,
    milestones,
    seoTitle,
    seoDescription,
  }
}
