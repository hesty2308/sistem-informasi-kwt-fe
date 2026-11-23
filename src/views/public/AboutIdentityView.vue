<script setup>
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '@/stores/settings'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import IdentityHeroCard from '@/components/about/IdentityHeroCard.vue'
import { Loader2 } from 'lucide-vue-next'

const settingsStore = useSettingsStore()

// Dynamic SEO meta tags with store binding & fallback
useHead({
  title: computed(
    () => settingsStore.identitySeoTitle || 'Identitas Organisasi - Paguyuban KWT Kartini OKU Timur'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () =>
          settingsStore.identitySeoDescription ||
          'Profil lengkap dan identitas resmi Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.'
      ),
    },
    {
      property: 'og:title',
      content: computed(
        () => settingsStore.identitySeoTitle || 'Identitas Organisasi - Paguyuban KWT Kartini OKU Timur'
      ),
    },
    {
      property: 'og:description',
      content: computed(
        () =>
          settingsStore.identitySeoDescription ||
          'Profil lengkap dan identitas resmi Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.'
      ),
    },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content:
        typeof window !== 'undefined'
          ? window.location.origin + '/tentang/identitas'
          : '/tentang/identitas',
    },
  ],
})

onMounted(() => {
  settingsStore.fetchSettings()
})
</script>

<template>
  <PublicLayout>
    <!-- 1. Header Banner -->
    <PageBanner
      :title="settingsStore.identityFullName"
      :subtitle="settingsStore.siteTagline"
    />

    <!-- 2. Konten Halaman -->
    <section class="py-12 sm:py-16 bg-surface min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <!-- Loading State -->
        <div
          v-if="settingsStore.isLoading && !settingsStore.isLoaded && !settingsStore.hasCachedData"
          data-testid="loading-state"
          class="flex flex-col items-center justify-center py-20 text-muted"
        >
          <Loader2 class="w-10 h-10 animate-spin text-primary mb-3" />
          <p class="text-base font-medium">Memuat informasi identitas...</p>
        </div>

        <div v-else class="space-y-10 sm:space-y-12">
          <!-- 1. Kartu Header Identitas & Logo (Hero Card) -->
          <IdentityHeroCard />

        </div>
      </div>
    </section>
  </PublicLayout>
</template>
