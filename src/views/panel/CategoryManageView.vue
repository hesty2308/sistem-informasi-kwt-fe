<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import {
  getPanelCategories,
  deletePanelCategory,
} from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import DataTable from '@/components/panel/DataTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import CategoryFormModal from '@/components/panel/category/CategoryFormModal.vue'
import { PlusCircle, Edit3, Trash2 } from 'lucide-vue-next'

useHead({
  title: 'Kelola Kategori - Panel Pengelola KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const toastStore = useToastStore()

const categories = ref([])
const isLoading = ref(true)

// Modal Form State
const isModalOpen = ref(false)
const editingCategory = ref(null)

// Delete State
const isConfirmDeleteOpen = ref(false)
const categoryToDelete = ref(null)
const isDeleting = ref(false)

const deleteMessage = computed(() => {
  return `Kategori "${categoryToDelete.value?.name || ''}" akan dihapus. Perhatian: Kategori yang masih dipakai oleh kegiatan tidak dapat dihapus.`
})

const columns = [
  { key: 'name', label: 'Nama Kategori', sortable: true },
  { key: 'slug', label: 'Slug URL', sortable: true },
  { key: 'color', label: 'Warna Label', sortable: false },
  { key: 'posts_count', label: 'Jumlah Kegiatan', sortable: true, class: 'text-right' },
]

const loadCategories = async () => {
  isLoading.value = true
  try {
    const data = await getPanelCategories()
    categories.value = data || []
  } catch (err) {
    toastStore.error(err.message || 'Gagal memuat kategori.')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editingCategory.value = null
  isModalOpen.value = true
}

const openEditModal = (cat) => {
  editingCategory.value = cat
  isModalOpen.value = true
}

// Delete Category
const confirmDelete = (cat) => {
  categoryToDelete.value = cat
  isConfirmDeleteOpen.value = true
}

const handleDeleteCategory = async () => {
  if (!categoryToDelete.value) return

  isDeleting.value = true
  try {
    await deletePanelCategory(categoryToDelete.value.id)
    toastStore.success('Kategori berhasil dihapus.')
    isConfirmDeleteOpen.value = false
    categoryToDelete.value = null
    loadCategories()
  } catch (err) {
    // If category still has posts, message "Kategori masih dipakai oleh X kegiatan." is returned
    const msg = err.response?.data?.message || err.message || 'Gagal menghapus kategori.'
    toastStore.error(msg)
    isConfirmDeleteOpen.value = false
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Kelola Kategori"
      subtitle="Manajemen rubrik klasifikasi kegiatan Paguyuban KWT Kartini"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Kategori' }]"
    >
      <template #actions>
        <BaseButton
          variant="primary"
          @click="openCreateModal"
          class="cursor-pointer"
        >
          <PlusCircle class="w-4 h-4 mr-2" />
          <span>Tambah Kategori</span>
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Data Table Kategori -->
    <div class="bg-white rounded-3xl p-6 shadow-card border border-secondary/20">
      <DataTable
        :columns="columns"
        :items="categories"
        :loading="isLoading"
        empty-text="Belum ada kategori yang dibuat."
      >
        <!-- Cell: Name with Color Preview -->
        <template #cell-name="{ item }">
          <div class="flex items-center gap-3">
            <span
              class="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-black/10"
              :style="{ backgroundColor: item.color || '#0B6B35' }"
            />
            <span class="font-bold text-ink">
              {{ item.name }}
            </span>
          </div>
        </template>

        <!-- Cell: Slug -->
        <template #cell-slug="{ item }">
          <span class="font-mono text-xs text-muted">
            {{ item.slug }}
          </span>
        </template>

        <!-- Cell: Color Hex -->
        <template #cell-color="{ item }">
          <div class="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2 py-1 rounded-lg bg-surface border border-secondary/20">
            <span>{{ item.color || '#0B6B35' }}</span>
          </div>
        </template>

        <!-- Cell: Posts Count -->
        <template #cell-posts_count="{ item }">
          <span class="font-bold text-xs sm:text-sm text-ink px-2.5 py-1 rounded-full bg-surface border border-secondary/15">
            {{ item.posts_count || 0 }} kegiatan
          </span>
        </template>

        <!-- Cell: Actions -->
        <template #actions="{ item }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              title="Ubah Kategori"
              @click="openEditModal(item)"
              class="p-2 rounded-lg text-ink/70 hover:text-primary hover:bg-surface transition cursor-pointer"
            >
              <Edit3 class="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Hapus Kategori"
              @click="confirmDelete(item)"
              class="p-2 rounded-lg text-ink/70 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal Form Tambah / Ubah Kategori -->
    <CategoryFormModal v-model="isModalOpen" :category="editingCategory" @saved="loadCategories" />

    <!-- Confirm Dialog Hapus Kategori -->
    <ConfirmDialog
      v-model="isConfirmDeleteOpen"
      title="Yakin ingin menghapus kategori ini?"
      :message="deleteMessage"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="handleDeleteCategory"
    />
  </PanelLayout>
</template>
