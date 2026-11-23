<script setup>
import { useSettingsStore } from '@/stores/settings'
import { Phone, Facebook } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
</script>

<template>
  <!-- Small top bar -->
  <header class="bg-primary-dark text-white text-xs py-2 px-4 sm:px-8 border-b border-primary/40 relative z-50">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <!-- Info Kontak Singkat -->
      <div class="flex items-center gap-4">
        <a
          v-if="settingsStore.whatsappLink"
          :href="settingsStore.whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
        >
          <Phone class="w-3.5 h-3.5 text-accent" />
          <span>WhatsApp: {{ settingsStore.phoneWhatsApp }}</span>
        </a>
        <span v-if="settingsStore.whatsappLink" class="hidden md:inline text-white/40">|</span>
        <span class="hidden md:inline text-white/80">
          {{ settingsStore.topbarTagline }}
        </span>
      </div>

      <!-- Ikon Media Sosial -->
      <div class="flex items-center gap-3">
        <a
          :href="settingsStore.facebookUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Kunjungi Facebook KWT Kartini"
          aria-label="Facebook Paguyuban KWT Kartini"
          class="inline-flex items-center gap-1 hover:text-accent transition-colors"
        >
          <Facebook class="w-3.5 h-3.5 text-accent" />
          <span class="hidden sm:inline">Facebook</span>
        </a>
      </div>
    </div>
  </header>
</template>
