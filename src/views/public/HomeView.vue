<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { getPublicHome } from '@/services/publicApi'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PostCard from '@/components/public/PostCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import { useSettingsStore } from '@/stores/settings'
import { ArrowRight, RefreshCw } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

useHead({
  title: 'Beranda - Paguyuban KWT Kartini OKU Timur',
  meta: [
    {
      name: 'description',
      content:
        'Sistem Informasi Kegiatan Paguyuban Kelompok Wanita Tani (KWT) Kartini, Kabupaten OKU Timur. Wadah persatuan wanita tani berdaya dan ketahanan pangan lestari.',
    },
    { property: 'og:title', content: 'Beranda - Paguyuban KWT Kartini OKU Timur' },
    {
      property: 'og:description',
      content: 'Wadah persatuan wanita tani berdaya dan ketahanan pangan lestari di Kabupaten OKU Timur.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + '/' : '/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + '/' : '/' },
  ],
})

const posts = ref([])
const galleries = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

const loadHomeData = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const data = await getPublicHome()
    posts.value = data.posts || []
    galleries.value = data.galleries || []
  } catch (error) {
    errorMessage.value = error.message || 'Gagal memuat data dari server'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHomeData()
})
</script>

<template>
  <PublicLayout>
    <!-- 1. HERO SECTION -->
    <HomeHero />

    <!-- ================================================================= -->
    <!-- 2. KEGIATAN TERBARU (6 Kartu Gaya Socin)                          -->
    <!-- ================================================================= -->
    <section class="py-16 sm:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4" v-reveal="{ delay: 50 }">
          <SectionTitle
            :title="settingsStore.pageTexts.home_posts_title"
            :subtitle="settingsStore.pageTexts.home_posts_subtitle"
          />
          <router-link
            to="/kegiatan"
            class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition group"
          >
            <span>Lihat Semua Kegiatan</span>
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
          <p class="text-red-700 font-semibold mb-2">
            Gagal Memuat Kegiatan
          </p>
          <p class="text-base text-red-700 mb-4">
            {{ errorMessage }}
          </p>
          <BaseButton variant="primary" size="sm" @click="loadHomeData">
            <RefreshCw class="w-4 h-4 mr-1.5" />
            Coba Muat Ulang
          </BaseButton>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="py-8">
          <EmptyState
            title="Belum Ada Kegiatan"
            description="Saat ini belum ada dokumentasi kegiatan yang dipublikasikan. Silakan kembali lagi nanti."
          />
        </div>

        <!-- Data Grid (3 Kolom Desktop, 2 Tablet, 1 HP) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" v-reveal="{ delay: 100 }">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Tombol Mobile: Lihat Semua Kegiatan -->
        <div class="mt-10 text-center md:hidden" v-if="!isLoading && posts.length > 0">
          <router-link
            to="/kegiatan"
            class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-surface text-primary font-bold border border-secondary/30 hover:bg-white transition shadow-sm"
          >
            <span>Lihat Semua Kegiatan</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- 3. CUPLIKAN GALERI (6 Foto) + Tombol "Lihat Galeri"              -->
    <!-- ================================================================= -->
    <section class="py-16 sm:py-20 bg-surface">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4" v-reveal="{ delay: 50 }">
          <SectionTitle
            :title="settingsStore.pageTexts.home_gallery_title"
            :subtitle="settingsStore.pageTexts.home_gallery_subtitle"
          />
          <router-link
            to="/galeri"
            class="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition group"
          >
            <span>Lihat Galeri Lengkap</span>
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="n in 6" :key="n" class="aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
        </div>

        <!-- Gallery Grid -->
        <div v-else-if="galleries.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" v-reveal="{ delay: 100 }">
          <div
            v-for="item in galleries"
            :key="item.id"
            class="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-card border border-secondary/20 hover:shadow-card-hover transition-all duration-300"
          >
            <img
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <!-- Dark Gradient Overlay with Caption -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
              <h4 class="text-white font-bold text-sm sm:text-base line-clamp-2 leading-snug">
                {{ item.title }}
              </h4>
              <p v-if="item.caption" class="text-white/80 text-xs line-clamp-1 mt-1 font-light">
                {{ item.caption }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-8">
          <EmptyState
            title="Belum Ada Foto Galeri"
            description="Dokumentasi foto kegiatan akan segera diunggah oleh pengurus."
          />
        </div>
      </div>
    </section>

  </PublicLayout>
</template>
