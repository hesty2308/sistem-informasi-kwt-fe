<script setup>
import { ExternalLink, Edit3, Trash2 } from 'lucide-vue-next'

defineProps({
  post: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])
</script>

<template>
  <!-- Row actions: preview, edit, delete -->
  <div class="flex items-center justify-end gap-1.5">
    <!-- Lihat di Website (Tab Baru) -->
    <router-link
      :to="`/kegiatan/${post.slug}`"
      target="_blank"
      title="Lihat Pratinjau di Website"
      class="p-2 rounded-lg text-ink/70 hover:text-primary hover:bg-surface transition"
    >
      <ExternalLink class="w-4 h-4" />
    </router-link>

    <!-- Ubah -->
    <router-link
      :to="`/pengelola/kegiatan/${post.id}/ubah`"
      title="Ubah Data Kegiatan"
      class="p-2 rounded-lg text-ink/70 hover:text-primary hover:bg-surface transition"
    >
      <Edit3 class="w-4 h-4" />
    </router-link>

    <!-- Hapus -->
    <button
      type="button"
      title="Hapus Kegiatan"
      @click="$emit('delete')"
      class="p-2 rounded-lg text-ink/70 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</template>
