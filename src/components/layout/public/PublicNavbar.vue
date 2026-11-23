<script setup>
import { prefetchAboutPages } from '@/utils/prefetchAboutPages'
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { usePublicNav } from '@/composables/usePublicNav'
import PublicMobileMenu from '@/components/layout/public/PublicMobileMenu.vue'
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-vue-next'

defineProps({
  isScrolled: {
    type: Boolean,
    default: false,
  },
})

const settingsStore = useSettingsStore()
const { route, navLinks, aboutSubLinks, isActiveRoute, isActiveSubRoute } = usePublicNav()

const isMobileMenuOpen = ref(false)
const isDesktopAboutOpen = ref(false)

// Close mobile & desktop dropdown on route change
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    isDesktopAboutOpen.value = false
  }
)
</script>

<template>
  <!-- Sticky white header -->
  <nav
    class="sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-gray-100"
    :class="{ 'shadow-md py-2': isScrolled, 'shadow-sm py-3': !isScrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
      <!-- Logo & Identitas Brand (Kiri) -->
      <router-link to="/" class="flex items-center gap-3 group">
        <img
          v-if="settingsStore.logoUrl"
          :src="settingsStore.logoUrl"
          alt="Logo Paguyuban KWT Kartini"
          class="h-14 w-14 object-contain rounded-full shadow-sm border border-secondary/20 p-0.5 bg-white transition-transform group-hover:scale-105"
        />
        <div>
          <span class="block text-lg sm:text-xl font-extrabold text-primary group-hover:text-primary-dark transition leading-tight">
            {{ settingsStore.siteName }}
          </span>
          <span class="block text-xs font-medium text-muted tracking-wide">
            {{ settingsStore.siteTagline }}
          </span>
        </div>
      </router-link>

      <!-- Menu Desktop (Tengah/Kanan) -->
      <div class="hidden md:flex items-center gap-1 lg:gap-2">
        <template v-for="item in navLinks" :key="item.path">
          <!-- Dropdown Menu Khusus 'Tentang' -->
          <div
            v-if="item.path === '/tentang'"
            class="relative group"
            @mouseenter="isDesktopAboutOpen = true; prefetchAboutPages()"
            @mouseleave="isDesktopAboutOpen = false"
            @focusin="prefetchAboutPages()"
          >
            <button
              type="button"
              @click="isDesktopAboutOpen = !isDesktopAboutOpen"
              class="relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              :class="[
                isActiveRoute(item.path)
                  ? 'text-primary font-bold'
                  : 'text-ink/80 hover:text-primary hover:bg-surface'
              ]"
              aria-haspopup="true"
              :aria-expanded="isDesktopAboutOpen"
            >
              <span>{{ item.name }}</span>
              <ChevronDown
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isDesktopAboutOpen }"
              />
              <!-- Garis Indikator Kuning di Bawah Menu Aktif -->
              <span
                v-if="isActiveRoute(item.path)"
                class="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
              />
            </button>

            <!-- Panel Sub-Menu Dropdown Desktop -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-1 scale-95"
            >
              <div
                v-show="isDesktopAboutOpen"
                class="absolute left-0 top-full pt-1.5 z-50 w-60"
              >
                <div class="bg-white rounded-2xl shadow-xl border border-secondary/20 p-2 space-y-1">
                  <router-link
                    v-for="sub in aboutSubLinks"
                    :key="sub.path"
                    :to="sub.path"
                    @click="isDesktopAboutOpen = false"
                    class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition"
                    :class="[
                      isActiveSubRoute(sub.path)
                        ? 'bg-surface text-primary font-bold border-l-4 border-accent'
                        : 'text-ink/80 hover:text-primary hover:bg-surface/80'
                    ]"
                  >
                    <span>{{ sub.label || sub.name }}</span>
                    <ChevronRight class="w-3.5 h-3.5 text-muted" />
                  </router-link>
                </div>
              </div>
            </transition>
          </div>

          <!-- Menu Reguler Lainnya -->
          <router-link
            v-else
            :to="item.path"
            class="relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all"
            :class="[
              isActiveRoute(item.path)
                ? 'text-primary font-bold'
                : 'text-ink/80 hover:text-primary hover:bg-surface'
            ]"
          >
            <span>{{ item.name }}</span>
            <!-- Garis Indikator Kuning di Bawah Menu Aktif -->
            <span
              v-if="isActiveRoute(item.path)"
              class="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
            />
          </router-link>
        </template>
      </div>

      <!-- Tombol Hamburger Mobile (HP) -->
      <button
        type="button"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="Buka menu navigasi"
        class="md:hidden p-2 rounded-xl text-ink hover:text-primary hover:bg-surface transition"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <PublicMobileMenu v-model="isMobileMenuOpen" />
  </nav>
</template>
