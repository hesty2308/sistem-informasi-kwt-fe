<script setup>
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '@/stores/settings'
import { usePostList } from '@/composables/usePostList'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import PostCard from '@/components/public/PostCard.vue'
import PostFilterBar from '@/components/public/PostFilterBar.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import NetworkError from '@/components/ui/NetworkError.vue'

const settingsStore = useSettingsStore()

useHead({
  title: 'Kegiatan Kami - Paguyuban KWT Kartini OKU Timur',
  meta: [
    {
      name: 'description',
      content:
        'Kumpulan berita, pengumuman, dokumentasi pelatihan pengolahan pangan, dan panen raya Paguyuban KWT Kartini Kabupaten OKU Timur.',
    },
    { property: 'og:title', content: 'Kegiatan Kami - Paguyuban KWT Kartini OKU Timur' },
    {
      property: 'og:description',
      content: 'Kumpulan berita, pengumuman, dan kegiatan Paguyuban KWT Kartini OKU Timur.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + '/kegiatan' : '/kegiatan' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + '/kegiatan' : '/kegiatan' },
  ],
})

const {
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
} = usePostList()
</script>

<template>
  <PublicLayout>
    <!-- 1. Banner Melengkung -->
    <PageBanner
      :title="settingsStore.postsBannerTitle"
      :subtitle="settingsStore.postsBannerSubtitle"
    />

    <!-- 2. Konten Utama Kegiatan -->
    <div class="bg-surface py-10 sm:py-14 min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Filter & Search Bar Container -->
        <PostFilterBar
          v-model:search="searchInput"
          :categories="categories"
          :selected-category="selectedCategory"
          :active-search="activeSearch"
          :total-posts="totalPosts"
          :is-loading="isLoading"
          @search-input="onSearchInput"
          @clear-search="clearSearch"
          @select-category="selectCategory"
          @reset="resetFilters"
        />

        <!-- 3. State Tampilan (Error, Skeleton, Empty, Data) -->

        <!-- Galat Jaringan -->
        <NetworkError
          v-if="isNetworkError"
          @retry="fetchPosts"
        />

        <!-- Skeleton Loading -->
        <div
          v-else-if="isLoading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <SkeletonCard v-for="n in 9" :key="n" />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="posts.length === 0"
          class="bg-white rounded-3xl p-8 sm:p-12 shadow-card text-center"
        >
          <EmptyState
            title="Belum ada kegiatan yang cocok."
            description="Tidak ditemukan kegiatan dengan kata kunci atau kategori yang Anda pilih. Silakan gunakan kata kunci lain atau reset filter."
            action-label="Tampilkan Semua Kegiatan"
            @action="resetFilters"
          />
        </div>

        <!-- Data Grid (9 per halaman) -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <PostCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
            />
          </div>

          <!-- Paginasi Halaman (Komponen BasePagination) -->
          <div class="bg-white rounded-3xl p-4 shadow-card border border-secondary/20 max-w-xl mx-auto">
            <BasePagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :loading="isLoading"
              @page-change="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
