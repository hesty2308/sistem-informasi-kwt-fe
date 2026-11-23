import { ref, computed } from 'vue'
import { getPublicVisionMission } from '@/services/publicApi'
import { readPublicCache, writePublicCache } from '@/utils/publicCache'

const CACHE_KEY = 'vision-mission'

export function useVisionMission() {
  // Start from the last response remembered in this browser (shown instantly), then refresh.
  const cached = readPublicCache(CACHE_KEY)
  const data = ref(cached)
  const isLoading = ref(!cached)
  const isLoaded = ref(!!cached)
  const error = ref(null)

  const fetchVisionMission = async () => {
    // Refresh silently when content is already on screen.
    isLoading.value = !data.value
    error.value = null
    try {
      const res = await getPublicVisionMission()
      data.value = res
      writePublicCache(CACHE_KEY, res)
      isLoaded.value = true
      return res
    } catch (err) {
      error.value =
        err?.response?.data?.message || err?.message || 'Gagal memuat data visi dan misi.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const visionTitle = computed(() => data.value?.vision_title || 'Cita-Cita Bersama')
  const visionText = computed(() => data.value?.vision || '')
  const missionTitle = computed(() => data.value?.mission_title || 'Langkah Strategis Kami')
  const missions = computed(() => {
    const list = data.value?.missions
    return Array.isArray(list) ? list : []
  })
  const seoTitle = computed(
    () => data.value?.seo_title || 'Visi dan Misi - Paguyuban KWT Kartini OKU Timur'
  )
  const seoDescription = computed(
    () =>
      data.value?.seo_description ||
      'Visi, misi perjuangan, dan arah gerak Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.'
  )

  return {
    data,
    isLoading,
    isLoaded,
    error,
    fetchVisionMission,
    visionTitle,
    visionText,
    missionTitle,
    missions,
    seoTitle,
    seoDescription,
  }
}
