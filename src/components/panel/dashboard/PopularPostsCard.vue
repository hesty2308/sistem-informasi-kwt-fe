<script setup>
import { Eye, TrendingUp } from 'lucide-vue-next'

defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <!-- Top 5 most viewed posts -->
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20 flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-accent/20 text-yellow-700 flex items-center justify-center font-bold">
            <TrendingUp class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-ink">
              Paling Banyak Dilihat
            </h2>
            <p class="text-xs text-muted">
              5 kegiatan terpopuler oleh pembaca
            </p>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="space-y-4 py-4 animate-pulse">
        <div v-for="n in 5" :key="n" class="h-12 bg-gray-100 rounded-xl" />
      </div>

      <div v-else-if="posts.length === 0" class="py-12 text-center text-muted text-xs">
        Belum ada data tayangan kegiatan.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(post, idx) in posts"
          :key="post.id"
          class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface border border-secondary/15 hover:border-secondary/35 transition"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <span class="w-6 h-6 rounded-full bg-white text-primary font-black text-xs flex items-center justify-center border border-secondary/20 shrink-0">
              {{ idx + 1 }}
            </span>
            <router-link
              :to="`/kegiatan/${post.slug}`"
              target="_blank"
              class="font-semibold text-xs sm:text-sm text-ink hover:text-primary transition truncate"
            >
              {{ post.title }}
            </router-link>
          </div>

          <div class="flex items-center gap-1 text-xs font-bold text-primary shrink-0 bg-white px-2 py-1 rounded-lg border border-secondary/15">
            <Eye class="w-3.5 h-3.5" />
            <span>{{ post.views || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Info Box -->
    <div class="mt-6 pt-4 border-t border-gray-100 text-xs text-muted flex items-center justify-between">
      <span>Kabupaten OKU Timur</span>
      <router-link to="/pengelola/kegiatan/tambah" class="text-primary font-bold hover:underline">
        + Tulis Baru
      </router-link>
    </div>
  </div>
</template>
