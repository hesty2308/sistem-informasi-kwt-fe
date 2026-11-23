<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { usePublicSplash } from '@/composables/usePublicSplash'
import PublicSplash from '@/components/layout/public/PublicSplash.vue'
import PublicTopBar from '@/components/layout/public/PublicTopBar.vue'
import PublicNavbar from '@/components/layout/public/PublicNavbar.vue'
import PublicFooter from '@/components/layout/public/PublicFooter.vue'
import { ArrowUp } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

// Loading screen with the logo on every page refresh; the page keeps loading underneath.
const { isVisible: isSplashVisible } = usePublicSplash()

const isScrolled = ref(false)
const showBackToTop = ref(false)

const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  isScrolled.value = scrollY > 20
  showBackToTop.value = scrollY > 350
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  settingsStore.fetchSettings()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-ink font-sans selection:bg-secondary/30 selection:text-primary-dark">
    <!-- 0. Loading screen (fades out when the site is ready) -->
    <transition leave-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none" leave-to-class="opacity-0">
      <PublicSplash v-if="isSplashVisible" />
    </transition>

    <!-- 1. Top Bar Kecil -->
    <PublicTopBar />

    <!-- 2. Header Putih Sticky -->
    <PublicNavbar :is-scrolled="isScrolled" />

    <!-- 3. Slot Konten Utama Halaman -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- 4. Footer Biru (brand-blue) -->
    <PublicFooter />

    <!-- Floating Back to Top Button -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <button
        v-if="showBackToTop"
        type="button"
        @click="scrollToTop"
        aria-label="Gulir ke atas halaman"
        class="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-accent text-primary-dark shadow-xl hover:bg-yellow-400 active:scale-95 transition-all cursor-pointer border-2 border-primary-dark"
      >
        <ArrowUp class="w-5 h-5 stroke-[2.5]" />
      </button>
    </transition>
  </div>
</template>
