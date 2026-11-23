<script setup>
import { FolderOpen } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Belum ada data',
  },
  description: {
    type: String,
    default: 'Data yang Anda cari saat ini belum tersedia atau belum ditambahkan.',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-surface/60 rounded-3xl border border-dashed border-secondary/30">
    <div class="w-16 h-16 mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <slot name="icon">
        <FolderOpen class="w-8 h-8" />
      </slot>
    </div>

    <h3 class="text-base sm:text-lg font-bold text-ink mb-1">
      {{ title }}
    </h3>

    <p v-if="description" class="text-base text-muted max-w-sm">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
