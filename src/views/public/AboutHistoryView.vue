<script setup>
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import HistoryTimeline from '@/components/public/HistoryTimeline.vue'
import { useHistory } from '@/composables/useHistory'
import { useSettingsStore } from '@/stores/settings'
import { AlertCircle, BookOpen, History } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

const { isLoading, isLoaded, error, fetchHistory, title, paragraphs, milestones, seoTitle, seoDescription } =
  useHistory()

useHead({
  title: computed(() => seoTitle.value),
  meta: [
    { name: 'description', content: computed(() => seoDescription.value) },
    { property: 'og:title', content: computed(() => seoTitle.value) },
    { property: 'og:description', content: computed(() => seoDescription.value) },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: typeof window !== 'undefined' ? window.location.origin + '/tentang/sejarah' : '/tentang/sejarah',
    },
  ],
})

const isEmpty = computed(() => paragraphs.value.length === 0 && milestones.value.length === 0)

onMounted(() => {
  fetchHistory().catch(() => {})
})
</script>

<template>
  <PublicLayout>
    <!-- 1. Header Banner -->
    <PageBanner
      :title="settingsStore.pageTexts.history_banner_title"
      :subtitle="settingsStore.pageTexts.history_banner_subtitle"
    />

    <section class="py-12 sm:py-16 bg-surface min-h-[60vh]">
      <div class="max-w-4xl mx-auto px-4 sm:px-8">
        <!-- Loading skeleton -->
        <div v-if="isLoading && !isLoaded" class="space-y-6" aria-busy="true" aria-label="Memuat sejarah" data-testid="loading-state">
          <div class="h-56 rounded-3xl bg-white border border-secondary/20 animate-pulse" />
          <div v-for="n in 3" :key="n" class="h-24 rounded-2xl bg-white border border-secondary/20 animate-pulse" />
        </div>

        <!-- Error state -->
        <div
          v-else-if="error && !isLoaded"
          class="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-red-200 text-center shadow-card"
          data-testid="error-state"
        >
          <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-6 h-6" />
          </div>
          <h2 class="text-lg font-bold text-ink mb-2">Gagal Memuat Data</h2>
          <p class="text-base text-muted mb-5">{{ error }}</p>
          <button
            type="button"
            class="min-h-11 px-5 py-2.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark motion-safe:transition-colors"
            @click="fetchHistory().catch(() => {})"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Empty state -->
        <BaseCard v-else-if="isEmpty" :hoverable="false" class="p-8 sm:p-12 text-center" data-testid="empty-state">
          <History class="w-10 h-10 text-secondary mx-auto mb-3" />
          <p class="text-base text-muted">Belum ada catatan sejarah.</p>
        </BaseCard>

        <div v-else class="space-y-12">
          <!-- Narrative -->
          <BaseCard v-if="paragraphs.length" :hoverable="false" class="p-6 sm:p-10" data-testid="history-narrative">
            <div class="flex items-center gap-3 mb-5">
              <span class="w-11 h-11 rounded-2xl bg-surface text-primary flex items-center justify-center shrink-0">
                <BookOpen class="w-5 h-5" />
              </span>
              <h2 class="text-2xl font-black text-primary">{{ title }}</h2>
            </div>
            <div class="space-y-4">
              <p v-for="(paragraph, idx) in paragraphs" :key="idx" class="text-base sm:text-lg text-ink leading-relaxed whitespace-pre-line">
                {{ paragraph }}
              </p>
            </div>
          </BaseCard>

          <!-- Timeline -->
          <div v-if="milestones.length">
            <h2 class="text-2xl font-black text-primary mb-8">Linimasa Perjalanan</h2>
            <HistoryTimeline :milestones="milestones" />
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
