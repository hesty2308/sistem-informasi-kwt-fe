<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { aboutPages } from '@/config/aboutPages'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  prev: {
    type: Object,
    default: undefined,
  },
  next: {
    type: Object,
    default: undefined,
  },
})

const route = useRoute()

const currentIndex = computed(() => {
  return aboutPages.findIndex((page) => page.path === route.path || page.name === route.name)
})

const computedPrevPage = computed(() => {
  if (props.prev !== undefined) return props.prev
  if (currentIndex.value > 0) {
    return aboutPages[currentIndex.value - 1]
  }
  return null
})

const computedNextPage = computed(() => {
  if (props.next !== undefined) return props.next
  if (currentIndex.value >= 0 && currentIndex.value < aboutPages.length - 1) {
    return aboutPages[currentIndex.value + 1]
  }
  return null
})
</script>

<template>
  <nav
    aria-label="Navigasi Halaman Sebelumnya dan Berikutnya"
    class="border-t border-gray-100 pt-8 mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
  >
    <!-- 1. Tombol Sebelumnya (Disembunyikan di Halaman Pertama) -->
    <div class="flex-1 flex justify-start">
      <router-link
        v-if="computedPrevPage"
        :to="computedPrevPage.path"
        data-testid="pager-prev"
        class="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-secondary/20 shadow-card hover:shadow-card-hover hover:border-primary transition-all duration-200 group text-left"
      >
        <div
          class="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0"
        >
          <ChevronLeft class="w-5 h-5" />
        </div>
        <div>
          <span class="block text-xs font-semibold text-muted uppercase tracking-wider">Sebelumnya</span>
          <span class="block text-sm font-bold text-ink group-hover:text-primary transition-colors">
            {{ computedPrevPage.label }}
          </span>
        </div>
      </router-link>
    </div>

    <!-- 2. Tombol Berikutnya (Disembunyikan di Halaman Terakhir) -->
    <div class="flex-1 flex justify-end">
      <router-link
        v-if="computedNextPage"
        :to="computedNextPage.path"
        data-testid="pager-next"
        class="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 px-5 py-3.5 rounded-2xl bg-white border border-secondary/20 shadow-card hover:shadow-card-hover hover:border-primary transition-all duration-200 group text-right"
      >
        <div>
          <span class="block text-xs font-semibold text-muted uppercase tracking-wider">Berikutnya</span>
          <span class="block text-sm font-bold text-ink group-hover:text-primary transition-colors">
            {{ computedNextPage.label }}
          </span>
        </div>
        <div
          class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center group-hover:bg-primary-dark transition-colors shrink-0"
        >
          <ChevronRight class="w-5 h-5" />
        </div>
      </router-link>
    </div>
  </nav>
</template>
