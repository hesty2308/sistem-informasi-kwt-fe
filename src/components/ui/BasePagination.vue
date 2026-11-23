<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['page-change'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage && !props.loading) {
    emit('page-change', page)
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-between gap-3 py-4 text-sm"
    aria-label="Paginasi Halaman"
  >
    <!-- Tombol Sebelumnya -->
    <button
      type="button"
      :disabled="currentPage <= 1 || loading"
      class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-secondary/30 bg-white font-medium text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
      @click="goToPage(currentPage - 1)"
    >
      <ChevronLeft class="w-4 h-4" />
      <span>Sebelumnya</span>
    </button>

    <!-- Keterangan Halaman -->
    <div class="font-medium text-muted text-xs sm:text-sm">
      Halaman <span class="font-bold text-primary">{{ currentPage }}</span> dari <span class="font-bold text-ink">{{ totalPages }}</span>
    </div>

    <!-- Tombol Berikutnya -->
    <button
      type="button"
      :disabled="currentPage >= totalPages || loading"
      class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-secondary/30 bg-white font-medium text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
      @click="goToPage(currentPage + 1)"
    >
      <span>Berikutnya</span>
      <ChevronRight class="w-4 h-4" />
    </button>
  </nav>
</template>
