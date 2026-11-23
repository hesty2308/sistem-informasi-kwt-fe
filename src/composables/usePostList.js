import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { getPublicPosts, getPublicCategories } from '@/services/publicApi'

// Public post list state: search, category filter, and pagination kept in sync with the URL query.
export function usePostList() {
  const route = useRoute()
  const router = useRouter()

  const posts = ref([])
  const categories = ref([])
  const isLoading = ref(true)
  const isNetworkError = ref(false)
  const errorMessage = ref('')

  const currentPage = ref(parseInt(route.query.page) || 1)
  const totalPages = ref(1)
  const totalPosts = ref(0)
  const selectedCategory = ref(route.query.category || '')
  const searchInput = ref(route.query.search || '')
  const activeSearch = ref(route.query.search || '')

  // Synchronize query parameters to the URL
  const syncUrlQuery = () => {
    const query = {}
    if (activeSearch.value) query.search = activeSearch.value
    if (selectedCategory.value) query.category = selectedCategory.value
    if (currentPage.value > 1) query.page = currentPage.value

    router.replace({ query })
  }

  // Fetch categories for pill filters
  const loadCategories = async () => {
    try {
      const data = await getPublicCategories()
      categories.value = data || []
    } catch {
      // Graceful fallback
      categories.value = []
    }
  }

  // Fetch posts from API
  const fetchPosts = async () => {
    isLoading.value = true
    isNetworkError.value = false
    errorMessage.value = ''

    try {
      const params = {
        page: currentPage.value,
      }
      if (activeSearch.value) {
        params.search = activeSearch.value
      }
      if (selectedCategory.value) {
        params.category = selectedCategory.value
      }

      const response = await getPublicPosts(params)
      posts.value = response.data || []
      totalPages.value = response.meta?.last_page || 1
      totalPosts.value = response.meta?.total || 0
    } catch (err) {
      isNetworkError.value = true
      errorMessage.value = err.message || 'Tidak dapat terhubung ke server.'
    } finally {
      isLoading.value = false
    }
  }

  // Debounced search (400ms delay)
  const debouncedSearch = useDebounceFn((value) => {
    activeSearch.value = value.trim()
    currentPage.value = 1
    syncUrlQuery()
    fetchPosts()
  }, 400)

  const onSearchInput = (value) => {
    debouncedSearch(value)
  }

  const clearSearch = () => {
    searchInput.value = ''
    activeSearch.value = ''
    currentPage.value = 1
    syncUrlQuery()
    fetchPosts()
  }

  const selectCategory = (slug) => {
    if (selectedCategory.value === slug) return
    selectedCategory.value = slug
    currentPage.value = 1
    syncUrlQuery()
    fetchPosts()
  }

  const resetFilters = () => {
    clearSearch()
    selectCategory('')
  }

  const onPageChange = (newPage) => {
    currentPage.value = newPage
    syncUrlQuery()
    fetchPosts()
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  // Listen to browser back/forward buttons
  watch(
    () => route.query,
    (newQuery) => {
      const qSearch = newQuery.search || ''
      const qCat = newQuery.category || ''
      const qPage = parseInt(newQuery.page) || 1

      let needReload = false

      if (activeSearch.value !== qSearch) {
        searchInput.value = qSearch
        activeSearch.value = qSearch
        needReload = true
      }
      if (selectedCategory.value !== qCat) {
        selectedCategory.value = qCat
        needReload = true
      }
      if (currentPage.value !== qPage) {
        currentPage.value = qPage
        needReload = true
      }

      if (needReload) {
        fetchPosts()
      }
    }
  )

  onMounted(async () => {
    await Promise.all([loadCategories(), fetchPosts()])
  })

  return {
    posts,
    categories,
    isLoading,
    isNetworkError,
    currentPage,
    totalPages,
    totalPosts,
    selectedCategory,
    searchInput,
    activeSearch,
    fetchPosts,
    onSearchInput,
    clearSearch,
    selectCategory,
    resetFilters,
    onPageChange,
  }
}
