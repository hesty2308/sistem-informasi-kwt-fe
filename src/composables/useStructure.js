import { ref, computed } from 'vue'
import { getPublicStructure, getPublicStructureMembers } from '@/services/publicApi'
import { readPublicCache, writePublicCache } from '@/utils/publicCache'

const CACHE_KEY = 'structure'

export function useStructure() {
  // Start from the heading + first member page remembered in this browser, then refresh.
  const cached = readPublicCache(CACHE_KEY)
  const heading = ref(cached?.heading ?? null)
  const members = ref(Array.isArray(cached?.members) ? cached.members : [])
  const currentPage = ref(cached ? cached.meta?.current_page || 1 : 0)
  const lastPage = ref(cached?.meta?.last_page || 1)
  const total = ref(cached?.meta?.total ?? members.value.length)
  const isLoading = ref(!cached)
  const isLoaded = ref(!!cached)
  const isLoadingMore = ref(false)
  const error = ref(null)

  const hasMore = computed(() => currentPage.value < lastPage.value)

  const toMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Gagal memuat data struktur organisasi.'

  const fetchStructure = async () => {
    // Refresh silently when content is already on screen.
    isLoading.value = !isLoaded.value
    error.value = null
    try {
      const [headingRes, membersRes] = await Promise.all([
        getPublicStructure(),
        getPublicStructureMembers(1),
      ])
      heading.value = headingRes
      members.value = Array.isArray(membersRes?.data) ? membersRes.data : []
      currentPage.value = membersRes?.meta?.current_page || 1
      lastPage.value = membersRes?.meta?.last_page || 1
      total.value = membersRes?.meta?.total ?? members.value.length
      writePublicCache(CACHE_KEY, { heading: headingRes, members: members.value, meta: membersRes?.meta || null })
      isLoaded.value = true
    } catch (err) {
      error.value = toMessage(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Appends the next page (9 members); failures keep the already loaded members.
  const loadMore = async () => {
    if (!hasMore.value || isLoadingMore.value) return
    isLoadingMore.value = true
    try {
      const res = await getPublicStructureMembers(currentPage.value + 1)
      const known = new Set(members.value.map((m) => m.id))
      members.value.push(...(res?.data || []).filter((m) => !known.has(m.id)))
      currentPage.value = res?.meta?.current_page || currentPage.value + 1
      lastPage.value = res?.meta?.last_page || lastPage.value
      total.value = res?.meta?.total ?? total.value
    } catch {
      // Silent: the carousel simply stops at the members already loaded.
    } finally {
      isLoadingMore.value = false
    }
  }

  const title = computed(() => heading.value?.title || 'Susunan Pengurus')
  const period = computed(() => heading.value?.period || '')
  const seoTitle = computed(
    () => heading.value?.seo_title || 'Struktur Organisasi - Paguyuban KWT Kartini OKU Timur'
  )
  const seoDescription = computed(
    () =>
      heading.value?.seo_description ||
      'Struktur organisasi dan susunan pengurus Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.'
  )

  return {
    members,
    total,
    hasMore,
    isLoading,
    isLoaded,
    isLoadingMore,
    error,
    fetchStructure,
    loadMore,
    title,
    period,
    seoTitle,
    seoDescription,
  }
}
