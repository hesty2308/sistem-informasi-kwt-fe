<script setup>
import { computed } from 'vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SafeHtml from '@/components/ui/SafeHtml.vue'
import PostShareButtons from '@/components/public/PostShareButtons.vue'
import { Calendar, Eye, User } from 'lucide-vue-next'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const coverSrc = computed(() => props.post?.cover_image_url || null)
</script>

<template>
  <!-- Full post article -->
  <article class="bg-white rounded-3xl shadow-card border border-secondary/20 overflow-hidden">
    <!-- Foto Sampul Besar (Hanya tampil jika ada foto di database) -->
    <div
      v-if="coverSrc"
      class="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-surface"
    >
      <img
        :src="coverSrc"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- Kategori Badge Overlay -->
      <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <BaseBadge variant="category" size="md" class="shadow-md">
          {{ post.category?.name || 'Kegiatan' }}
        </BaseBadge>
      </div>
    </div>

    <!-- Bagian Header Artikel -->
    <div class="p-6 sm:p-10 lg:p-12">
      <!-- Kategori Badge jika artikel tidak memiliki foto sampul -->
      <div v-if="!coverSrc" class="mb-4">
        <BaseBadge variant="category" size="md">
          {{ post.category?.name || 'Kegiatan' }}
        </BaseBadge>
      </div>

      <!-- Metadata Bar -->
      <div class="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-muted pb-4 border-b border-gray-100">
        <div class="flex items-center gap-1.5">
          <Calendar class="w-4 h-4 text-primary" />
          <span>{{ post.published_at_formatted || 'Tanggal belum ditentukan' }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <User class="w-4 h-4 text-primary" />
          <span>Ditulis oleh: <strong class="text-ink font-semibold">{{ post.author?.name || 'Pengelola KWT' }}</strong></span>
        </div>

        <div class="flex items-center gap-1.5 ml-auto">
          <Eye class="w-4 h-4 text-muted" />
          <span>{{ post.views }} kali dibaca</span>
        </div>
      </div>

      <!-- Judul Kegiatan -->
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-ink mt-6 mb-6 leading-tight">
        {{ post.title }}
      </h1>

      <!-- Ringkasan / Excerpt Highlight -->
      <div
        v-if="post.excerpt"
        class="p-4 sm:p-5 rounded-2xl bg-surface border-l-4 border-accent text-ink/90 text-sm sm:text-base font-medium leading-relaxed mb-8 italic"
      >
        "{{ post.excerpt }}"
      </div>

      <!-- Konten Lengkap (SafeHtml via DOMPurify) -->
      <div class="prose prose-lg max-w-none text-ink leading-relaxed mb-10" data-testid="post-content">
        <SafeHtml :content="post.content" />
      </div>

      <PostShareButtons :post="post" />
    </div>
  </article>
</template>
