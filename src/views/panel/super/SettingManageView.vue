<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useSettingForm } from '@/composables/useSettingForm'
import {
  settingSections,
  findSettingSection,
  settingSectionTitle,
  DEFAULT_SETTING_SECTION_PATH,
} from '@/config/settingSections'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import SettingIdentityTab from '@/components/panel/settings/SettingIdentityTab.vue'
import SettingNavTab from '@/components/panel/settings/SettingNavTab.vue'
import SettingHeroTab from '@/components/panel/settings/SettingHeroTab.vue'
import SettingFooterTab from '@/components/panel/settings/SettingFooterTab.vue'
import SettingOrgIdentityTab from '@/components/panel/settings/SettingOrgIdentityTab.vue'
import SettingVisionMissionTab from '@/components/panel/settings/SettingVisionMissionTab.vue'
import SettingPagesTab from '@/components/panel/settings/SettingPagesTab.vue'
import SettingContactTab from '@/components/panel/settings/SettingContactTab.vue'
import SettingHistoryTab from '@/components/panel/settings/SettingHistoryTab.vue'
import SettingStructureTab from '@/components/panel/settings/SettingStructureTab.vue'
import SettingActionsBar from '@/components/panel/settings/SettingActionsBar.vue'
import { MapPin } from 'lucide-vue-next'

const route = useRoute()

const {
  form,
  errors,
  isLoading,
  isSaving,
  isResetting,
  isDirty,
  handleUpdateLogo,
  handleUpdateHero,
  handleSave,
  handleCancel,
  handleReset,
} = useSettingForm()

// Form component (and its extra listeners) for each settings sub-page.
const sectionComponents = {
  identitas: { component: SettingIdentityTab, listeners: { 'update-logo': handleUpdateLogo } },
  'menu-navigasi': { component: SettingNavTab },
  'hero-beranda': { component: SettingHeroTab, listeners: { 'update-hero': handleUpdateHero } },
  footer: { component: SettingFooterTab },
  'kegiatan-galeri': { component: SettingPagesTab },
  'identitas-organisasi': { component: SettingOrgIdentityTab },
  'visi-misi': { component: SettingVisionMissionTab },
  sejarah: { component: SettingHistoryTab },
  pengurus: { component: SettingStructureTab },
  kontak: { component: SettingContactTab },
}

// The router only lets known slugs through; fall back to the first section just in case.
const currentSection = computed(
  () => findSettingSection(route.params.section) || settingSections[0]
)
const currentForm = computed(() => sectionComponents[currentSection.value.slug])
const sectionTitle = computed(() => settingSectionTitle(currentSection.value))

useHead({
  title: computed(() => `${sectionTitle.value} - Pengaturan Website - Panel Super Admin KWT Kartini`),
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const isResetConfirmOpen = ref(false)

// "Kembalikan ke Default" only resets the settings of the sub-page currently open.
const resetTitle = computed(() => `Kembalikan "${sectionTitle.value}" ke Default?`)
const resetMessage = computed(() => {
  const { keys } = currentSection.value
  const label = sectionTitle.value
  const imageNote = keys.includes('logo')
    ? ' Logo yang sudah diunggah juga akan dikosongkan.'
    : keys.includes('hero_image')
      ? ' Gambar hero yang sudah diunggah juga akan dikosongkan.'
      : ''
  return `Semua isian di bagian "${label}" akan dikembalikan ke nilai bawaan.${imageNote} Bagian lain tidak berubah.`
})

const handleConfirmReset = async () => {
  isResetConfirmOpen.value = false
  await handleReset(currentSection.value.keys, sectionTitle.value)
}

</script>

<template>
  <PanelLayout>
    <div class="mb-6">
      <PageHeader
        :title="sectionTitle"
        subtitle="Pengaturan Website — ubah tulisan dan gambar yang tampil di website"
        :breadcrumbs="[
          { label: 'Panel Pengelola', to: '/pengelola' },
          { label: 'Pengaturan Website', to: DEFAULT_SETTING_SECTION_PATH },
          { label: sectionTitle },
        ]"
        class="mb-0"
      />
    </div>

    <p
      class="flex items-start gap-2 mb-4 px-4 py-3 rounded-2xl bg-white border border-secondary/20 text-base text-ink"
      data-testid="setting-appears-on"
    >
      <MapPin class="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
      <span><strong>Tampil di:</strong> {{ currentSection.appearsOn }}</span>
    </p>

    <div v-if="isLoading" class="bg-white rounded-3xl p-12 text-center text-muted shadow-card">
      <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <p class="text-sm">Memuat pengaturan website...</p>
    </div>

    <!-- Section form (chosen from the sidebar sub-menu) -->
    <div
      v-else
      class="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card border border-secondary/20"
      data-testid="setting-section"
      @input="isDirty = true"
    >
      <component
        :is="currentForm.component"
        :key="currentSection.slug"
        v-model:form="form"
        :errors="errors"
        v-on="currentForm.listeners || {}"
        @mark-dirty="isDirty = true"
      />

      <SettingActionsBar
        :is-dirty="isDirty"
        :is-saving="isSaving"
        :is-resetting="isResetting"
        @save="handleSave"
        @cancel="handleCancel"
        @reset="isResetConfirmOpen = true"
      />
    </div>

    <!-- Confirm Reset Dialog -->
    <ConfirmDialog
      v-model="isResetConfirmOpen"
      :title="resetTitle"
      :message="resetMessage"
      confirm-text="Ya, Kembalikan ke Default"
      cancel-text="Batal"
      @confirm="handleConfirmReset"
      @cancel="isResetConfirmOpen = false"
    />
  </PanelLayout>
</template>
