<script setup>
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useVisionMission } from '@/composables/useVisionMission'
import { useSettingsStore } from '@/stores/settings'
import { Target, Compass, Loader2, AlertCircle } from 'lucide-vue-next'

// Banner, section heading, and box labels are editable in the panel (Visi & Misi).
const settingsStore = useSettingsStore()
const pageTexts = computed(() => settingsStore.pageTexts)
const bannerTitle = computed(() => pageTexts.value.vision_banner_title)
const bannerSubtitle = computed(() => pageTexts.value.vision_banner_subtitle)
const sectionTitle = computed(() => pageTexts.value.vision_section_title)
const sectionSubtitle = computed(() => pageTexts.value.vision_section_subtitle)
const visionBadge = computed(() => pageTexts.value.vision_badge)
const missionBadge = computed(() => pageTexts.value.mission_badge)
const orgFooter = 'Paguyuban Kelompok Wanita Tani Kartini OKU Timur'
const visionEmptyFallback = 'Visi organisasi belum diatur oleh pengelola.'
const missionEmptyFallback = 'Misi organisasi belum diatur oleh pengelola.'

const {
  isLoading,
  isLoaded,
  error,
  fetchVisionMission,
  visionTitle,
  visionText,
  missionTitle,
  missions,
  seoTitle,
  seoDescription,
} = useVisionMission()

// Dynamic SEO meta tags from endpoint with reactive fallback
useHead({
  title: computed(() => seoTitle.value),
  meta: [
    {
      name: 'description',
      content: computed(() => seoDescription.value),
    },
    {
      property: 'og:title',
      content: computed(() => seoTitle.value),
    },
    {
      property: 'og:description',
      content: computed(() => seoDescription.value),
    },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content:
        typeof window !== 'undefined'
          ? window.location.origin + '/tentang/visi-misi'
          : '/tentang/visi-misi',
    },
  ],
})

onMounted(() => {
  fetchVisionMission().catch(() => {})
})
</script>

<template>
  <PublicLayout>
    <!-- 1. Header Banner -->
    <PageBanner
      :title="bannerTitle"
      :subtitle="bannerSubtitle"
    />

    <!-- 2. Konten Utama Visi & Misi -->
    <section class="py-12 sm:py-16 bg-surface min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Judul Bagian -->
        <SectionTitle
          :title="sectionTitle"
          :subtitle="sectionSubtitle"
          align="center"
          class="mb-10 sm:mb-14"
        />

        <!-- Loading State -->
        <div
          v-if="isLoading && !isLoaded"
          data-testid="loading-state"
          class="flex flex-col items-center justify-center py-20 text-muted"
        >
          <Loader2 class="w-10 h-10 animate-spin text-primary mb-3" />
          <p class="text-base font-medium">Memuat visi dan misi...</p>
        </div>

        <!-- Error State with Retry -->
        <div
          v-else-if="error && !isLoaded"
          data-testid="error-state"
          class="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-red-200 text-center shadow-card"
        >
          <div
            class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4"
          >
            <AlertCircle class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-ink mb-2">Gagal Memuat Data</h3>
          <p class="text-base text-muted mb-5">{{ error }}</p>
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-xs"
            @click="fetchVisionMission"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Content Loaded -->
        <div v-else class="space-y-12">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <!-- 1. Kotak Visi (5 Kolom) -->
            <BaseCard
              :hoverable="false"
              class="lg:col-span-5 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 sm:p-10 shadow-card flex flex-col justify-between relative overflow-hidden border-0"
              data-testid="vision-card"
            >
              <!-- Outer Decorative Glow -->
              <div
                class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none"
              />

              <div class="relative z-10">
                <div
                  class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-accent mb-6 shadow-xs"
                >
                  <Target class="w-6 h-6" />
                </div>

                <span
                  class="inline-block text-xs font-extrabold uppercase tracking-widest text-accent mb-2"
                >
                  {{ visionBadge }}
                </span>
                <h3 class="text-xl sm:text-2xl font-black text-white mb-4">
                  {{ visionTitle }}
                </h3>

                <!-- Visi Statement (Sanitized text rendering via mustache, NO v-html) -->
                <p
                  v-if="visionText"
                  data-testid="vision-text"
                  class="text-white/95 text-base sm:text-lg leading-relaxed italic font-light"
                >
                  "{{ visionText }}"
                </p>
                <p
                  v-else
                  data-testid="vision-empty"
                  class="text-white/80 text-base italic font-light"
                >
                  {{ visionEmptyFallback }}
                </p>
              </div>

              <div
                class="mt-8 pt-6 border-t border-white/20 text-xs text-white/80 relative z-10"
              >
                {{ orgFooter }}
              </div>
            </BaseCard>

            <!-- 2. Kotak Misi (7 Kolom) -->
            <BaseCard
              :hoverable="false"
              class="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-secondary/20 flex flex-col justify-between"
              data-testid="mission-card"
            >
              <div>
                <div class="flex items-center gap-3 mb-6 sm:mb-8">
                  <div
                    class="w-12 h-12 rounded-2xl bg-surface border border-secondary/30 flex items-center justify-center text-primary shadow-xs"
                  >
                    <Compass class="w-6 h-6" />
                  </div>
                  <div>
                    <span
                      class="block text-xs font-bold uppercase tracking-wider text-primary"
                    >
                      {{ missionBadge }}
                    </span>
                    <h3 class="text-xl sm:text-2xl font-black text-ink">
                      {{ missionTitle }}
                    </h3>
                  </div>
                </div>

                <!-- Daftar Misi Bernomor & Terurut Dinamis (Sanitized text, NO v-html) -->
                <ol
                  v-if="missions.length > 0"
                  class="space-y-4"
                  data-testid="mission-list"
                >
                  <li
                    v-for="(item, idx) in missions"
                    :key="item.id || idx"
                    class="flex items-start gap-3.5 bg-surface/70 hover:bg-surface p-4 sm:p-5 rounded-2xl border border-secondary/20 shadow-xs transition-colors"
                    data-testid="mission-item"
                  >
                    <span
                      class="w-7 h-7 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    >
                      {{ idx + 1 }}
                    </span>
                    <div class="flex-1">
                      <p
                        class="text-ink text-base leading-relaxed font-normal"
                      >
                        {{ item.text }}
                      </p>
                    </div>
                  </li>
                </ol>

                <!-- Fallback jika Misi Kosong -->
                <div
                  v-else
                  data-testid="mission-empty"
                  class="p-8 rounded-2xl bg-surface/50 border border-secondary/15 text-center text-muted"
                >
                  <p class="text-base italic">
                    {{ missionEmptyFallback }}
                  </p>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
