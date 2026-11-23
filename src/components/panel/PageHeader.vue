<script setup>
import { ChevronRight } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-secondary/15">
    <div>
      <!-- Breadcrumb Navigasi Bahasa Indonesia -->
      <nav
        v-if="breadcrumbs && breadcrumbs.length > 0"
        aria-label="Breadcrumb"
        class="flex items-center gap-1.5 text-xs text-muted mb-1.5 flex-wrap"
      >
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link
            v-if="crumb.to"
            :to="crumb.to"
            class="hover:text-primary transition-colors font-medium"
          >
            {{ crumb.label }}
          </router-link>
          <span v-else class="text-ink font-semibold">
            {{ crumb.label }}
          </span>

          <ChevronRight
            v-if="index < breadcrumbs.length - 1"
            class="w-3.5 h-3.5 text-muted/60"
          />
        </template>
      </nav>

      <!-- Judul Halaman -->
      <h1 class="text-2xl sm:text-3xl font-black text-ink tracking-tight">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="text-xs sm:text-sm text-muted mt-1 font-normal">
        {{ subtitle }}
      </p>
    </div>

    <!-- Slot Tombol Aksi Halaman -->
    <div v-if="$slots.actions || $slots.default" class="flex items-center gap-3 shrink-0">
      <slot name="actions">
        <slot />
      </slot>
    </div>
  </div>
</template>
