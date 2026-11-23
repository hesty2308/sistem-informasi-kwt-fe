<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import BaseCard from '@/components/ui/BaseCard.vue'
import { ShieldCheck } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

// Small label above the name, editable in the panel (Tentang → Identitas).
const officialBadgeLabel = computed(() => settingsStore.pageTexts.identity_card_badge)
</script>

<template>
  <!-- Identity header card with the large logo -->
  <BaseCard
    :hoverable="false"
    class="p-8 sm:p-12 lg:p-14 bg-white border border-secondary/20 shadow-card"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <!-- Kolom Logo Besar -->
      <div class="lg:col-span-5 flex flex-col items-center text-center">
        <!-- Shown only when a logo is uploaded in the settings -->
        <div v-if="settingsStore.logoUrl" class="relative mb-5">
          <div
            class="absolute inset-0 rounded-full bg-secondary/20 blur-xl scale-110 pointer-events-none"
          />
          <img
            :src="settingsStore.logoUrl"
            alt="Logo Paguyuban KWT Kartini"
            class="relative z-10 w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-full shadow-lg border-4 border-white bg-white p-2"
          />
        </div>
        <span
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface text-primary border border-secondary/30 text-xs font-bold uppercase tracking-wider mb-2"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-secondary" />
          <span>{{ officialBadgeLabel }}</span>
        </span>
        <span
          v-if="settingsStore.identityAbbreviation"
          class="text-xs font-bold text-muted bg-gray-100 px-3 py-1 rounded-full"
        >
          {{ settingsStore.identityAbbreviation }}
        </span>
      </div>

      <!-- Kolom Judul & Narasi Profil Singkat -->
      <div class="lg:col-span-7 space-y-4 text-center lg:text-left">
        <div>
          <h1
            data-testid="identity-full-name"
            class="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight mb-2"
          >
            {{ settingsStore.identityFullName }}
          </h1>
          <p
            v-if="settingsStore.siteTagline"
            class="text-base text-primary font-semibold leading-relaxed"
          >
            {{ settingsStore.siteTagline }}
          </p>
        </div>

        <!-- Paragraf Pengantar Singkat -->
        <div
          v-if="settingsStore.identityShortDesc || settingsStore.aboutText"
          class="pt-2 text-ink/85 text-base leading-relaxed space-y-3"
        >
          <p v-if="settingsStore.identityShortDesc">
            {{ settingsStore.identityShortDesc }}
          </p>
          <p v-if="settingsStore.aboutText" class="text-muted">
            {{ settingsStore.aboutText }}
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
