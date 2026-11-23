<script setup>
import { useSettingsStore } from '@/stores/settings'
import { ArrowRight } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
</script>

<template>
  <!-- Hero section (curved bottom) -->
  <section class="relative bg-primary-dark overflow-hidden text-white min-h-[520px] lg:min-h-[600px] flex items-center">
    <!-- Background Image (Hanya tampil jika ada foto hero resmi di database) -->
    <img
      v-if="settingsStore.heroImageUrl"
      :src="settingsStore.heroImageUrl"
      alt="Kegiatan Paguyuban KWT Kartini"
      class="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
    />

    <!-- Overlay Hijau Tua Transparan -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary/75 z-0" />

    <!-- Hero Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-24 lg:py-28 w-full">
      <div class="max-w-2xl" v-reveal="{ delay: 50 }">
        <!-- Hero Main Title -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
          {{ settingsStore.heroTitle1 }} <br class="hidden sm:inline" />
          {{ settingsStore.heroTitle2 }}
        </h1>

        <!-- Hero Subtitle -->
        <p class="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-xl font-normal">
          {{ settingsStore.heroDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-4">
          <router-link
            :to="settingsStore.heroBtn1Url"
            class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-primary-dark font-extrabold text-sm sm:text-base hover:bg-yellow-400 active:scale-95 transition-all shadow-lg hover:shadow-accent/25"
          >
            <span>{{ settingsStore.heroBtn1Text }}</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>

          <router-link
            :to="settingsStore.heroBtn2Url"
            class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white text-white font-bold text-sm sm:text-base hover:bg-white/10 active:scale-95 transition-all"
          >
            <span>{{ settingsStore.heroBtn2Text }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bawah Melengkung (Socin Curve Shape Divider) -->
    <div class="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
      <svg
        class="relative block w-full h-8 sm:h-14 lg:h-18"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
          fill="currentColor"
          class="text-surface"
        />
      </svg>
    </div>
  </section>
</template>
