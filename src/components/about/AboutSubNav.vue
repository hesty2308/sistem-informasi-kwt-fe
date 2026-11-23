<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { aboutPages } from '@/config/aboutPages'
import { prefetchAboutPages } from '@/utils/prefetchAboutPages'

const route = useRoute()

// While reading one "Tentang" page, load the others so switching tabs is instant.
onMounted(() => {
  prefetchAboutPages()
})

const isActive = (item) => {
  return route.path === item.path || route.name === item.name
}
</script>

<template>
  <nav
    aria-label="Navigasi Halaman Tentang"
    class="sticky top-[65px] sm:top-[73px] z-30 bg-white/95 backdrop-blur-md border-b border-secondary/20 shadow-xs"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Scroll horizontal di mobile, flex wrap di desktop -->
      <div class="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
        <router-link
          v-for="item in aboutPages"
          :key="item.path"
          :to="item.path"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0"
          :class="[
            isActive(item)
              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
              : 'text-ink/80 hover:text-primary hover:bg-surface',
          ]"
        >
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Sembunyikan scrollbar bawaan browser tapi tetap bisa di-scroll horizontal */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
