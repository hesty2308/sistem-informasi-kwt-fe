<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import MissionManager from '@/components/panel/settings/MissionManager.vue'
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'
import {
  bannerFields,
  sectionHeadingFields,
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

const pageBannerFields = bannerFields('vision_banner_title', 'vision_banner_subtitle', { title: 'Visi dan Misi' })
const pageSectionFields = sectionHeadingFields('vision_section_title', 'vision_section_subtitle', {
  title: 'Arah & Tujuan Gerakan',
})
const pageGoogleFields = googleFields('about_vision_seo_title', 'about_vision_seo_description')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Visi &amp; Misi</h3>
      <p class="text-sm text-muted">
        Tulisan disimpan dengan tombol "Simpan Pengaturan" di bawah. Butir misi langsung tersimpan saat
        ditambah atau diubah.
      </p>
    </div>

    <SettingTextGroup
      v-model:form="form"
      heading="Judul Atas Halaman"
      :fields="pageBannerFields"
      :errors="errors"
    />

    <SettingTextGroup
      v-model:form="form"
      heading="Judul di Atas Kotak Visi & Misi"
      :fields="pageSectionFields"
      :errors="errors"
    />

    <div class="p-4 sm:p-5 rounded-2xl bg-surface border border-secondary/20 space-y-4">
      <span class="block text-sm font-bold text-primary">Kotak Visi (hijau)</span>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.vision_badge"
          label="Label Kecil"
          placeholder="Contoh: Visi Organisasi"
          :error-message="errors.vision_badge?.[0]"
        />
        <BaseInput
          v-model="form.vision_title"
          label="Judul Kotak"
          placeholder="Contoh: Cita-Cita Bersama"
          :error-message="errors.vision_title?.[0]"
        />
      </div>
      <BaseTextarea
        v-model="form.vision"
        label="Teks Visi"
        placeholder="Tuliskan cita-cita besar dan visi paguyuban..."
        :rows="4"
        :error-message="errors.vision?.[0]"
      />
    </div>

    <div class="p-4 sm:p-5 rounded-2xl bg-surface border border-secondary/20 space-y-4">
      <span class="block text-sm font-bold text-primary">Kotak Misi (putih)</span>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.mission_badge"
          label="Label Kecil"
          placeholder="Contoh: Misi Organisasi"
          :error-message="errors.mission_badge?.[0]"
        />
        <BaseInput
          v-model="form.mission_title"
          label="Judul Kotak"
          placeholder="Contoh: Langkah Strategis Kami"
          :error-message="errors.mission_title?.[0]"
        />
      </div>
      <MissionManager />
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
