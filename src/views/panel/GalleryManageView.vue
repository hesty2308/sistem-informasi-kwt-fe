<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import {
  getPanelGalleries,
  togglePanelGalleryVisibility,
  deletePanelGallery,
  reorderPanelGalleries,
} from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import GalleryManageCard from '@/components/panel/gallery/GalleryManageCard.vue'
import GalleryUploadModal from '@/components/panel/gallery/GalleryUploadModal.vue'
import GalleryEditModal from '@/components/panel/gallery/GalleryEditModal.vue'
import { UploadCloud, Image as ImageIcon } from 'lucide-vue-next'

useHead({
  title: 'Kelola Galeri - Panel Pengelola KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const toastStore = useToastStore()

const galleries = ref([])
const isLoading = ref(true)

const isUploadModalOpen = ref(false)

// Edit Modal State
const isEditModalOpen = ref(false)
const editingItem = ref(null)

// Delete Confirm State
const isConfirmDeleteOpen = ref(false)
const itemToDelete = ref(null)
const isDeleting = ref(false)

const deleteMessage = computed(() => {
  return `Foto "${itemToDelete.value?.title || ''}" akan dihapus secara permanen dari server.`
})

const loadGalleries = async () => {
  isLoading.value = true
  try {
    const data = await getPanelGalleries()
    galleries.value = data || []
  } catch (err) {
    toastStore.error(err.message || 'Gagal memuat foto galeri.')
  } finally {
    isLoading.value = false
  }
}

// Edit Item
const openEditModal = (item) => {
  editingItem.value = item
  isEditModalOpen.value = true
}

// Toggle Visibility
const handleToggleVisibility = async (item) => {
  try {
    const res = await togglePanelGalleryVisibility(item.id)
    item.is_visible = !item.is_visible
    toastStore.success(res.message || 'Status visibilitas diperbarui.')
  } catch (err) {
    toastStore.error(err.message || 'Gagal mengubah visibilitas foto.')
  }
}

// Move Up / Down
const moveItem = async (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= galleries.value.length) return

  // Swap locally
  const temp = galleries.value[index]
  galleries.value[index] = galleries.value[targetIndex]
  galleries.value[targetIndex] = temp

  // Update sort orders
  const items = galleries.value.map((item, idx) => ({
    id: item.id,
    sort_order: idx + 1,
  }))

  try {
    await reorderPanelGalleries(items)
  } catch {
    loadGalleries()
  }
}

// Delete
const confirmDelete = (item) => {
  itemToDelete.value = item
  isConfirmDeleteOpen.value = true
}

const handleDeleteGallery = async () => {
  if (!itemToDelete.value) return

  isDeleting.value = true
  try {
    await deletePanelGallery(itemToDelete.value.id)
    toastStore.success('Foto galeri berhasil dihapus.')
    isConfirmDeleteOpen.value = false
    itemToDelete.value = null
    loadGalleries()
  } catch (err) {
    toastStore.error(err.message || 'Gagal menghapus foto galeri.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  loadGalleries()
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Kelola Galeri Foto"
      subtitle="Manajemen arsip visual foto kegiatan, pelatihan, dan panen raya KWT Kartini"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Galeri' }]"
    >
      <template #actions>
        <BaseButton
          variant="primary"
          @click="isUploadModalOpen = true"
          class="cursor-pointer"
        >
          <UploadCloud class="w-4 h-4 mr-2" />
          <span>Unggah Foto</span>
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Grid Foto Galeri Manajemen -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="n in 6" :key="n" class="aspect-[4/3] bg-gray-100 rounded-2xl" />
      </div>

      <div v-else-if="galleries.length === 0" class="py-12 text-center text-muted">
        <ImageIcon class="w-12 h-12 mx-auto text-muted/40 mb-3" />
        <p class="font-semibold text-ink text-base mb-1">Belum ada foto di galeri</p>
        <p class="text-xs mb-4">Klik tombol Unggah Foto di atas untuk menambahkan dokumentasi.</p>
        <BaseButton variant="primary" size="sm" @click="isUploadModalOpen = true">
          Unggah Foto Sekarang
        </BaseButton>
      </div>

      <!-- Gallery Items Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GalleryManageCard
          v-for="(item, index) in galleries"
          :key="item.id"
          :item="item"
          :index="index"
          :is-last="index === galleries.length - 1"
          @move="(direction) => moveItem(index, direction)"
          @toggle-visibility="handleToggleVisibility(item)"
          @edit="openEditModal(item)"
          @delete="confirmDelete(item)"
        />
      </div>
    </div>

    <!-- 1. Modal Unggah Banyak Foto -->
    <GalleryUploadModal v-model="isUploadModalOpen" @uploaded="loadGalleries" />

    <!-- 2. Modal Ubah Metadata Galeri -->
    <GalleryEditModal v-model="isEditModalOpen" :item="editingItem" @updated="loadGalleries" />

    <!-- 3. Confirm Dialog Hapus Foto -->
    <ConfirmDialog
      v-model="isConfirmDeleteOpen"
      title="Yakin ingin menghapus foto ini?"
      :message="deleteMessage"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="handleDeleteGallery"
    />
  </PanelLayout>
</template>
