<script setup>
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
</script>

<template>
  <!-- Full-page loading screen shown on every page load until the site is ready -->
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    role="status"
    aria-live="polite"
    data-testid="public-loading"
  >
    <div class="flex flex-col items-center gap-5 px-6 text-center">
      <img
        v-if="settingsStore.logoUrl"
        :src="settingsStore.logoUrl"
        alt="Logo Paguyuban KWT Kartini"
        class="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-full bg-white p-1.5 shadow-card border border-secondary/20 animate-pulse motion-reduce:animate-none"
        data-testid="public-loading-logo"
      />
      <div>
        <p class="text-xl sm:text-2xl font-extrabold text-primary leading-tight">
          {{ settingsStore.siteName }}
        </p>
        <p class="text-base text-muted mt-1">Memuat halaman...</p>
      </div>
      <span
        class="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
