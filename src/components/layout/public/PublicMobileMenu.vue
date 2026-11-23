<script setup>
import { prefetchAboutPages } from '@/utils/prefetchAboutPages'
import { ref, watch, onMounted } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { usePublicNav } from '@/composables/usePublicNav'

const isOpen = defineModel({ type: Boolean, default: false })

const { route, navLinks, aboutSubLinks, isActiveRoute, isActiveSubRoute } = usePublicNav()

const isAboutOpen = ref(false)

const closeMenu = () => {
  isOpen.value = false
}

// Expand the "Tentang" accordion while browsing an about page.
watch(isOpen, (open) => {
  if (open && route.path.startsWith('/tentang')) {
    isAboutOpen.value = true
  }
})

onMounted(() => {
  if (route.path.startsWith('/tentang')) {
    isAboutOpen.value = true
  }
})
</script>

<template>
  <!-- Mobile sliding drawer panel -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div
      v-if="isOpen"
      class="md:hidden bg-white border-t border-gray-100 shadow-xl px-4 py-4"
    >
      <div class="flex flex-col gap-1">
        <template v-for="item in navLinks" :key="item.path">
          <!-- Menu Accordion Khusus 'Tentang' di Mobile -->
          <div v-if="item.path === '/tentang'" class="flex flex-col">
            <button
              type="button"
              @touchstart.passive="prefetchAboutPages()"
              @click="isAboutOpen = !isAboutOpen; prefetchAboutPages()"
              class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-semibold transition text-left cursor-pointer"
              :class="[
                isActiveRoute(item.path)
                  ? 'bg-surface text-primary border-l-4 border-accent font-bold'
                  : 'text-ink hover:bg-gray-50'
              ]"
            >
              <span>{{ item.name }}</span>
              <ChevronDown
                class="w-5 h-5 text-muted transition-transform duration-200"
                :class="{ 'rotate-180': isAboutOpen }"
              />
            </button>

            <!-- Sub-Menu Accordion Mobile -->
            <transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0 overflow-hidden"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0 overflow-hidden"
            >
              <div
                v-show="isAboutOpen"
                class="pl-4 pr-1 py-1 space-y-1 bg-surface/60 rounded-xl my-1 border border-secondary/10"
              >
                <router-link
                  v-for="sub in aboutSubLinks"
                  :key="sub.path"
                  :to="sub.path"
                  @click="closeMenu"
                  class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition"
                  :class="[
                    isActiveSubRoute(sub.path)
                      ? 'text-primary font-bold bg-white shadow-xs'
                      : 'text-ink/80 hover:text-primary hover:bg-white/60'
                  ]"
                >
                  <span>{{ sub.label || sub.name }}</span>
                  <ChevronRight class="w-4 h-4 text-muted" />
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Menu Reguler Mobile -->
          <router-link
            v-else
            :to="item.path"
            @click="closeMenu"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition"
            :class="[
              isActiveRoute(item.path)
                ? 'bg-surface text-primary border-l-4 border-accent font-bold'
                : 'text-ink hover:bg-gray-50'
            ]"
          >
            <span>{{ item.name }}</span>
            <ChevronRight class="w-4 h-4 text-muted" />
          </router-link>
        </template>
      </div>
    </div>
  </transition>
</template>
