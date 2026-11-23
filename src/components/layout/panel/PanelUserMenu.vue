<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, ExternalLink, ChevronDown } from 'lucide-vue-next'

defineEmits(['logout'])

const route = useRoute()
const authStore = useAuthStore()

const isOpen = ref(false)

// Close the dropdown on route change
watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  }
)
</script>

<template>
  <!-- User dropdown menu -->
  <div class="relative">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-surface border border-transparent hover:border-secondary/20 transition cursor-pointer"
    >
      <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
        {{ authStore.user?.name?.charAt(0) || 'P' }}
      </div>
      <div class="hidden sm:block text-left">
        <span class="block text-xs font-bold text-ink leading-tight truncate max-w-[120px]">
          {{ authStore.user?.name || 'Pengelola' }}
        </span>
        <span class="block text-[10px] text-muted capitalize">
          {{ authStore.isSuperAdmin ? 'Super Admin' : 'Admin' }}
        </span>
      </div>
      <ChevronDown class="w-4 h-4 text-muted hidden sm:block" />
    </button>

    <!-- Dropdown Box -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-secondary/20 py-2 z-40 text-sm"
    >
      <div class="px-4 py-2 border-b border-gray-100 sm:hidden">
        <span class="block font-bold text-xs text-ink truncate">
          {{ authStore.user?.name }}
        </span>
        <span class="block text-[10px] text-muted">
          {{ authStore.isSuperAdmin ? 'Super Admin' : 'Admin' }}
        </span>
      </div>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        class="sm:hidden flex items-center gap-2 px-4 py-2.5 text-xs text-ink hover:bg-surface font-semibold"
      >
        <ExternalLink class="w-4 h-4 text-primary" />
        <span>Lihat Website</span>
      </a>

      <router-link
        to="/pengelola/profil"
        class="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm text-ink hover:bg-surface font-semibold transition"
      >
        <User class="w-4 h-4 text-primary" />
        <span>Profil Saya</span>
      </router-link>

      <div class="my-1 border-t border-gray-100" />

      <button
        type="button"
        @click="$emit('logout')"
        class="w-full flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 font-semibold transition text-left cursor-pointer"
      >
        <LogOut class="w-4 h-4" />
        <span>Keluar</span>
      </button>
    </div>
  </div>
</template>
