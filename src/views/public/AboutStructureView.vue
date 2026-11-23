<script setup>
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BoardMemberCarousel from '@/components/public/BoardMemberCarousel.vue'
import { useStructure } from '@/composables/useStructure'
import { useSettingsStore } from '@/stores/settings'
import { AlertCircle, Users } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

const {
  members,
  total,
  hasMore,
  isLoading,
  isLoaded,
  isLoadingMore,
  error,
  fetchStructure,
  loadMore,
  title,
  period,
  seoTitle,
  seoDescription,
} = useStructure()

useHead({
  title: computed(() => seoTitle.value),
  meta: [
    { name: 'description', content: computed(() => seoDescription.value) },
    { property: 'og:title', content: computed(() => seoTitle.value) },
    { property: 'og:description', content: computed(() => seoDescription.value) },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content:
        typeof window !== 'undefined'
          ? window.location.origin + '/tentang/struktur-organisasi'
          : '/tentang/struktur-organisasi',
    },
  ],
})

const subtitle = computed(() => (period.value ? `Periode kepengurusan ${period.value}` : ''))

onMounted(() => {
  fetchStructure().catch(() => {})
})
</script>

<template>
  <PublicLayout>
    <!-- 1. Header Banner -->
    <PageBanner
      :title="settingsStore.pageTexts.structure_banner_title"
      :subtitle="settingsStore.pageTexts.structure_banner_subtitle"
    />

    <section class="py-12 sm:py-16 bg-surface min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Loading skeleton -->
        <div v-if="isLoading && !isLoaded" aria-busy="true" aria-label="Memuat data pengurus" data-testid="loading-state">
          <div class="h-10 w-64 max-w-full mx-auto rounded-xl bg-white animate-pulse mb-10" />
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="n in 4"
              :key="n"
              class="h-64 rounded-3xl bg-white border border-secondary/20 animate-pulse"
              :class="{ 'hidden sm:block': n === 2, 'hidden md:block': n === 3, 'hidden lg:block': n === 4 }"
            />
          </div>
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
            @click="fetchStructure().catch(() => {})"
          >
            Coba Lagi
          </button>
        </div>

        <template v-else>
          <SectionTitle :title="title" :subtitle="subtitle" align="center" class="mb-10" />

          <BaseCard
            v-if="members.length === 0"
            :hoverable="false"
            class="max-w-xl mx-auto p-8 sm:p-12 text-center"
            data-testid="empty-state"
          >
            <Users class="w-10 h-10 text-secondary mx-auto mb-3" />
            <p class="text-base text-muted">Data pengurus belum tersedia.</p>
          </BaseCard>

          <BoardMemberCarousel
            v-else
            :members="members"
            :total="total"
            :has-more="hasMore"
            :loading-more="isLoadingMore"
            @load-more="loadMore"
          />
        </template>
      </div>
    </section>
  </PublicLayout>
</template>
