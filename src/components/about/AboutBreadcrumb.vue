<script setup>
import { ChevronRight, Home } from 'lucide-vue-next'

defineProps({
  current: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center text-xs sm:text-sm text-muted font-medium">
    <ol class="flex items-center flex-wrap gap-1.5 sm:gap-2">
      <!-- 1. Beranda -->
      <li class="inline-flex items-center">
        <router-link
          to="/"
          class="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors"
        >
          <Home class="w-3.5 h-3.5" />
          <span>Beranda</span>
        </router-link>
      </li>

      <!-- Separator -->
      <li class="text-muted/60" aria-hidden="true">
        <ChevronRight class="w-3.5 h-3.5" />
      </li>

      <!-- 2. Tentang -->
      <li class="inline-flex items-center">
        <router-link
          to="/tentang"
          class="text-muted hover:text-primary transition-colors"
        >
          Tentang
        </router-link>
      </li>

      <!-- Separator -->
      <li class="text-muted/60" aria-hidden="true">
        <ChevronRight class="w-3.5 h-3.5" />
      </li>

      <!-- 3. Current Page (Bukan Link) -->
      <li
        data-testid="breadcrumb-current"
        class="inline-flex items-center font-bold text-primary"
        aria-current="page"
      >
        <span class="truncate max-w-[220px] sm:max-w-none">{{ current }}</span>
      </li>
    </ol>
  </nav>
</template>
