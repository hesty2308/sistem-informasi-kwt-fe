<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { getPanelPosts, getPanelCategories, deletePanelPost } from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import DataTable from '@/components/panel/DataTable.vue'
import StatusBadge from '@/components/panel/StatusBadge.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PostManageFilters from '@/components/panel/post/PostManageFilters.vue'
import PostRowActions from '@/components/panel/post/PostRowActions.vue'
import { PlusCircle, Eye } from 'lucide-vue-next'

useHead({
  title: 'Kelola Kegiatan - Panel Pengelola KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const toastStore = useToastStore()

const posts = ref([])
const categories = ref([])
const isLoading = ref(true)

// Filter & Pagination States
const searchInput = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

// Delete Dialog State
const isConfirmDeleteOpen = ref(false)
const selectedPostToDelete = ref(null)
const isDeleting = ref(false)

const deleteMessage = computed(() => {
  return `Kegiatan "${selectedPostToDelete.value?.title || ''}" akan dihapus dan tidak lagi ditampilkan di website publik.`
})

const columns = [
  { key: 'cover', label: 'Foto', sortable: false, class: 'w-16' },
  { key: 'title', label: 'Judul Kegiatan', sortable: true },
  { key: 'category', label: 'Kategori', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'published_at_formatted', label: 'Tanggal Terbit', sortable: true },
  { key: 'views', label: 'Dibaca', sortable: true, class: 'text-right' },
]

const loadCategories = async () => {
  try {
    const data = await getPanelCategories()
    categories.value = data || []
  } catch {
    categories.value = []
  }
}

const loadPosts = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
    }
    if (searchInput.value.trim()) params.search = searchInput.value.trim()
    if (selectedCategory.value) params.category_id = selectedCategory.value
    if (selectedStatus.value) params.status = selectedStatus.value

    const response = await getPanelPosts(params)
    posts.value = response.data || []
    totalPages.value = response.meta?.last_page || 1
    totalItems.value = response.meta?.total || 0
  } catch (err) {
    toastStore.error(err.message || 'Gagal memuat daftar kegiatan.')
  } finally {
    isLoading.value = false
  }
}

const onSearch = () => {
  currentPage.value = 1
  loadPosts()
}

const clearSearch = () => {
  searchInput.value = ''
  currentPage.value = 1
  loadPosts()
}

const onPageChange = (newPage) => {
  currentPage.value = newPage
  loadPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Delete Post Action
const confirmDelete = (post) => {
  selectedPostToDelete.value = post
  isConfirmDeleteOpen.value = true
}

const handleDeletePost = async () => {
  if (!selectedPostToDelete.value) return

  isDeleting.value = true
  try {
    await deletePanelPost(selectedPostToDelete.value.id)
    toastStore.success('Kegiatan berhasil dihapus.')
    isConfirmDeleteOpen.value = false
    selectedPostToDelete.value = null
    loadPosts()
  } catch (err) {
    toastStore.error(err.message || 'Gagal menghapus kegiatan.')
  } finally {
    isDeleting.value = false
  }
}

watch([selectedCategory, selectedStatus], () => {
  currentPage.value = 1
  loadPosts()
})

onMounted(() => {
  loadCategories()
  loadPosts()
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Kelola Kegiatan"
      subtitle="Manajemen publikasi berita, dokumentasi pelatihan, dan panen raya"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Kegiatan' }]"
    >
      <template #actions>
        <router-link
          to="/pengelola/kegiatan/tambah"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark active:scale-95 transition shadow-sm"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </router-link>
      </template>
    </PageHeader>

    <!-- Filter & Search Toolbar Card -->
    <PostManageFilters
      v-model:search="searchInput"
      v-model:category="selectedCategory"
      v-model:status="selectedStatus"
      :categories="categories"
      @search="onSearch"
      @clear-search="clearSearch"
    />

    <!-- Data Table Kegiatan -->
    <div class="bg-white rounded-3xl p-6 shadow-card border border-secondary/20">
      <DataTable
        :columns="columns"
        :items="posts"
        :loading="isLoading"
        empty-text="Belum ada kegiatan yang cocok."
      >
        <!-- Cell: Cover Thumbnail -->
        <template #cell-cover="{ item }">
          <div class="w-12 h-10 rounded-lg overflow-hidden bg-surface border border-secondary/15 shrink-0">
            <img
              v-if="item.cover_image_url"
              :src="item.cover_image_url"
              :alt="item.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-muted text-[10px]">
              Tanpa Foto
            </div>
          </div>
        </template>

        <!-- Cell: Title -->
        <template #cell-title="{ item }">
          <div class="max-w-xs sm:max-w-md">
            <router-link
              :to="`/pengelola/kegiatan/${item.id}/ubah`"
              class="font-bold text-ink hover:text-primary transition line-clamp-1 block text-sm"
            >
              {{ item.title }}
            </router-link>
            <span class="text-xs text-muted font-mono truncate block mt-0.5">
              /kegiatan/{{ item.slug }}
            </span>
          </div>
        </template>

        <!-- Cell: Category -->
        <template #cell-category="{ item }">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface text-primary border border-secondary/25">
            {{ item.category?.name || 'Umum' }}
          </span>
        </template>

        <!-- Cell: Status -->
        <template #cell-status="{ item }">
          <StatusBadge :status="item.status || 'published'" />
        </template>

        <!-- Cell: Views -->
        <template #cell-views="{ item }">
          <div class="inline-flex items-center gap-1 text-muted text-xs font-semibold">
            <Eye class="w-3.5 h-3.5" />
            <span>{{ item.views || 0 }}</span>
          </div>
        </template>

        <!-- Cell: Actions -->
        <template #actions="{ item }">
          <PostRowActions :post="item" @delete="confirmDelete(item)" />
        </template>
      </DataTable>

      <!-- Pagination (10 per halaman) -->
      <div v-if="totalPages > 1" class="mt-6 pt-4 border-t border-gray-100">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :loading="isLoading"
          @page-change="onPageChange"
        />
      </div>
    </div>

    <!-- Confirm Dialog Hapus Kegiatan -->
    <ConfirmDialog
      v-model="isConfirmDeleteOpen"
      title="Yakin ingin menghapus kegiatan ini?"
      :message="deleteMessage"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="handleDeletePost"
    />
  </PanelLayout>
</template>
