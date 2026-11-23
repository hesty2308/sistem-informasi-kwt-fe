<script setup>
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

// Hanya menggunakan gambar asli dari backend/database
const coverSrc = computed(() => {
  return props.post.thumbnail_url || props.post.cover_image_url || null
})

// Safe category name
const categoryName = computed(() => {
  return props.post.category?.name || 'Kegiatan'
})
</script>

<template>
  <article
    class="group flex flex-col bg-background rounded-3xl overflow-hidden border border-secondary/20 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
  >
    <!-- Media Container: Foto Asli dari Database atau Blok Polos KWT jika tidak ada foto -->
    <div class="relative aspect-[16/10] overflow-hidden bg-surface">
      <img
        v-if="coverSrc"
        :src="coverSrc"
        :alt="post.title"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <!-- Tampilan bersih jika artikel memang tidak memiliki foto di database -->
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-primary/10 via-surface to-secondary/20 flex items-center justify-center"
      >
        <span class="text-xs font-bold text-primary/40 uppercase tracking-widest select-none">
          KWT Kartini
        </span>
      </div>

      <!-- Category Badge (Top-Left) -->
      <div class="absolute top-3 left-3 z-10">
        <BaseBadge variant="category" size="sm" class="shadow-sm">
          {{ categoryName }}
        </BaseBadge>
      </div>

      <!-- Date Badge (Bottom-Left) -->
      <div
        v-if="post.published_day && post.published_month_short"
        class="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-md text-center border border-secondary/20 min-w-[46px]"
      >
        <span class="block text-base font-black leading-none text-primary">
          {{ post.published_day }}
        </span>
        <span class="block text-[10px] font-extrabold uppercase tracking-wider text-muted leading-tight mt-0.5">
          {{ post.published_month_short }}
        </span>
      </div>
    </div>

    <!-- Content Body -->
    <div class="p-5 sm:p-6 flex flex-col flex-grow">
      <router-link :to="`/kegiatan/${post.slug}`" class="block mb-2 group/title">
        <h3 class="font-bold text-lg text-ink group-hover/title:text-primary transition-colors line-clamp-2 leading-snug">
          {{ post.title }}
        </h3>
      </router-link>

      <p class="text-muted text-base line-clamp-2 mb-5 leading-relaxed flex-grow">
        {{ post.excerpt }}
      </p>

      <!-- Action Link -->
      <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <router-link
          :to="`/kegiatan/${post.slug}`"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark group/link"
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight class="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </router-link>

        <span v-if="post.views !== undefined" class="text-xs text-muted">
          {{ post.views }} kali dibaca
        </span>
      </div>
    </div>
  </article>
</template>
