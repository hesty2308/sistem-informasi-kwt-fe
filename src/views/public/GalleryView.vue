<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '@/stores/settings'
import { useGallery } from '@/composables/useGallery'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import GalleryGridItem from '@/components/public/GalleryGridItem.vue'
import GalleryLightbox from '@/components/public/GalleryLightbox.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import NetworkError from '@/components/ui/NetworkError.vue'

const settingsStore = useSettingsStore()

useHead({
  title: 'Galeri Foto - Paguyuban KWT Kartini OKU Timur',
  meta: [
    {
      name: 'description',
      content:
        'Dokumentasi visual, foto panen raya, kebersamaan anggota, dan inovasi pertanian Paguyuban KWT Kartini Kabupaten OKU Timur.',
    },
    { property: 'og:title', content: 'Galeri Foto - Paguyuban KWT Kartini OKU Timur' },
    {
      property: 'og:description',
      content: 'Dokumentasi visual, foto panen raya, dan inovasi pertanian Paguyuban KWT Kartini OKU Timur.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + '/galeri' : '/galeri' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + '/galeri' : '/galeri' },
  ],
})

const {
  items: galleries,
  total,
  hasMore,
  isLoading,
  isLoadingMore,
  error,
  loadMoreError,
  fetchFirstPage,
  loadMore,
} = useGallery()

// Index of the photo open in the lightbox; null when closed.
const activeIndex = ref(null)

onMounted(fetchFirstPage)
</script>

<template>
  <PublicLayout>
    <!-- 1. Curved banner -->
    <PageBanner
      :title="settingsStore.galleryBannerTitle"
      :subtitle="settingsStore.galleryBannerSubtitle"
    />

    <!-- 2. Photo grid -->
    <div class="bg-surface py-10 sm:py-16 min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Error state -->
        <NetworkError
          v-if="error"
          data-testid="error-state"
          @retry="fetchFirstPage"
        />

        <!-- Loading skeleton -->
        <div
          v-else-if="isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="aspect-[4/3] rounded-3xl bg-gray-200 animate-pulse"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="galleries.length === 0"
          data-testid="empty-state"
          class="bg-white rounded-3xl p-8 sm:p-12 shadow-card text-center"
        >
          <EmptyState
            title="Belum Ada Foto Galeri"
            description="Dokumentasi foto kegiatan akan segera diunggah oleh pengurus paguyuban."
          />
        </div>

        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <GalleryGridItem
              v-for="(item, idx) in galleries"
              :key="item.id"
              :item="item"
              @open="activeIndex = idx"
            />
          </div>

          <!-- Load more -->
          <div class="mt-10 flex flex-col items-center gap-4 text-center">
            <p class="text-base text-muted" data-testid="gallery-count">
              Menampilkan {{ galleries.length }} dari {{ Math.max(total, galleries.length) }} foto
            </p>

            <p
              v-if="loadMoreError"
              role="alert"
              class="text-base text-red-700"
            >
              {{ loadMoreError }}
            </p>

            <BaseButton
              v-if="hasMore"
              variant="secondary"
              size="lg"
              data-testid="gallery-load-more"
              :loading="isLoadingMore"
              :disabled="isLoadingMore"
              @click="loadMore"
            >
              {{ isLoadingMore ? 'Memuat...' : loadMoreError ? 'Coba lagi' : 'Muat lebih banyak' }}
            </BaseButton>
          </div>
        </template>
      </div>
    </div>

    <!-- 3. Lightbox -->
    <GalleryLightbox
      v-model:index="activeIndex"
      :items="galleries"
      :total="total"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </PublicLayout>
</template>
