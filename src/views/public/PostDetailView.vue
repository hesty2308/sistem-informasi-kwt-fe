<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getPublicPostDetail } from '@/services/publicApi'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PostCard from '@/components/public/PostCard.vue'
import PostArticle from '@/components/public/PostArticle.vue'
import NetworkError from '@/components/ui/NetworkError.vue'
import { ArrowLeft, Home } from 'lucide-vue-next'

const route = useRoute()

const post = ref(null)
const isLoading = ref(true)
const isNetworkError = ref(false)
const isNotFound = ref(false)
const errorMessage = ref('')

const pageTitle = ref('Detail Kegiatan - Paguyuban KWT Kartini')
const pageDescription = ref('Dokumentasi kegiatan Paguyuban KWT Kartini Kabupaten OKU Timur')

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: () => post.value?.cover_image_url || '' },
    { property: 'og:url', content: () => (typeof window !== 'undefined' ? window.location.href : '') },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: () => post.value?.cover_image_url || '' },
  ],
  link: [
    { rel: 'canonical', href: () => (typeof window !== 'undefined' ? window.location.href : '') },
  ],
})

const loadPost = async () => {
  isLoading.value = true
  isNetworkError.value = false
  isNotFound.value = false
  errorMessage.value = ''

  try {
    const slug = route.params.slug
    const data = await getPublicPostDetail(slug)
    post.value = data

    // Set dynamic SEO head
    pageTitle.value = `${data.title} - Paguyuban KWT Kartini OKU Timur`
    pageDescription.value = data.excerpt || 'Dokumentasi kegiatan Paguyuban KWT Kartini OKU Timur'
  } catch (err) {
    if (err.response?.status === 404 || err.message?.includes('tidak ditemukan')) {
      isNotFound.value = true
      pageTitle.value = 'Kegiatan Tidak Ditemukan (404) - Paguyuban KWT Kartini'
    } else {
      isNetworkError.value = true
      errorMessage.value = err.message || 'Tidak dapat terhubung ke server.'
    }
  } finally {
    isLoading.value = false
  }
}

// Watch for slug changes (e.g. clicking related post)
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      loadPost()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)

onMounted(() => {
  loadPost()
})
</script>

<template>
  <PublicLayout>
    <div class="bg-surface py-10 sm:py-14 min-h-[70vh]">
      <div class="max-w-5xl mx-auto px-4 sm:px-8">
        <!-- Navigasi Kembali -->
        <div class="mb-6">
          <router-link
            to="/kegiatan"
            class="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition group"
          >
            <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Semua Kegiatan</span>
          </router-link>
        </div>

        <!-- 1. State Loading Skeleton -->
        <div
          v-if="isLoading"
          class="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-secondary/20 animate-pulse space-y-6"
        >
          <div class="h-6 w-32 bg-gray-200 rounded-full" />
          <div class="h-10 w-3/4 bg-gray-200 rounded-xl" />
          <div class="h-5 w-1/2 bg-gray-200 rounded-lg" />
          <div class="aspect-[16/9] w-full bg-gray-200 rounded-3xl" />
          <div class="space-y-3 pt-4">
            <div class="h-4 w-full bg-gray-200 rounded" />
            <div class="h-4 w-5/6 bg-gray-200 rounded" />
            <div class="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>

        <!-- 2. State Galat Jaringan -->
        <NetworkError
          v-else-if="isNetworkError"
          @retry="loadPost"
        />

        <!-- 3. State 404 Tidak Ditemukan -->
        <div
          v-else-if="isNotFound || !post"
          class="bg-white rounded-3xl p-8 sm:p-14 shadow-card border border-secondary/20 text-center max-w-2xl mx-auto"
        >
          <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-black">404</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            Kegiatan Tidak Ditemukan
          </h1>

          <p class="text-muted text-base leading-relaxed mb-8">
            Maaf, kegiatan yang Anda cari tidak tersedia, belum dipublikasikan, atau tautan telah kedaluwarsa.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <router-link
              to="/kegiatan"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition shadow-sm"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Daftar Kegiatan</span>
            </router-link>

            <router-link
              to="/"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface text-ink font-semibold text-sm border border-secondary/30 hover:bg-white transition"
            >
              <Home class="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </router-link>
          </div>
        </div>

        <!-- 4. Detail Artikel Kegiatan -->
        <PostArticle v-else :post="post" />

        <!-- 5. Bagian Kegiatan Lainnya (3 Kartu) -->
        <div
          v-if="post && post.related_posts && post.related_posts.length > 0"
          class="mt-14 sm:mt-16"
        >
          <div class="flex items-center justify-between mb-8">
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Rekomendasi
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-ink">
                Kegiatan Lainnya
              </h2>
            </div>

            <router-link
              to="/kegiatan"
              class="text-sm font-bold text-primary hover:text-primary-dark transition"
            >
              Lihat Semua &rarr;
            </router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PostCard
              v-for="relPost in post.related_posts"
              :key="relPost.id"
              :post="relPost"
            />
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
