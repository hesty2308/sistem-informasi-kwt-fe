<script setup>
import { Maximize2 } from 'lucide-vue-next'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['open'])
</script>

<template>
  <button
    type="button"
    data-testid="gallery-item"
    :aria-label="`Buka foto ${item.title}`"
    class="group relative block w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-card border border-secondary/20 hover:shadow-card-hover transition-all duration-300 cursor-pointer text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
    @click="$emit('open')"
  >
    <img
      :src="item.thumbnail_url || item.image_url || ''"
      :alt="item.title"
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    <!-- Zoom icon in the top right corner -->
    <span class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
      <Maximize2 class="w-4 h-4" />
    </span>

    <!-- Text overlay -->
    <span class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5 sm:p-6">
      <span class="block text-white font-bold text-base sm:text-lg line-clamp-2 leading-snug">
        {{ item.title }}
      </span>
      <span v-if="item.caption" class="block text-white/80 text-xs sm:text-sm line-clamp-1 mt-1 font-light">
        {{ item.caption }}
      </span>
    </span>
  </button>
</template>
