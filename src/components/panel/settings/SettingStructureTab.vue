<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'
import {
  bannerFields,
  googleFields,
  GOOGLE_GROUP_HEADING,
  GOOGLE_GROUP_DESCRIPTION,
} from '@/config/settingFieldGroups'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const pageBannerFields = bannerFields('structure_banner_title', 'structure_banner_subtitle', {
  title: 'Struktur Organisasi',
})
const pageGoogleFields = googleFields('structure_seo_title', 'structure_seo_description')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Struktur Organisasi</h3>
      <p class="text-sm text-muted">
        Hanya tulisan di halaman. Nama, jabatan, dan foto pengurus diatur oleh admin di menu
        <strong>Pengurus</strong> pada sidebar.
      </p>
    </div>

    <SettingTextGroup
      v-model:form="form"
      heading="Judul Atas Halaman"
      :fields="pageBannerFields"
      :errors="errors"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        v-model="form.structure_title"
        label="Judul di Atas Daftar Pengurus"
        placeholder="Contoh: Susunan Pengurus"
        :error-message="errors.structure_title?.[0]"
      />
      <BaseInput
        v-model="form.structure_period"
        label="Periode Kepengurusan"
        placeholder="Contoh: 2024–2029"
        :error-message="errors.structure_period?.[0]"
      />
    </div>

    <SettingTextGroup
      v-model:form="form"
      :heading="GOOGLE_GROUP_HEADING"
      :description="GOOGLE_GROUP_DESCRIPTION"
      :fields="pageGoogleFields"
      :errors="errors"
    />
  </div>
</template>
