<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import MilestoneManager from '@/components/panel/settings/MilestoneManager.vue'
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

const pageBannerFields = bannerFields('history_banner_title', 'history_banner_subtitle', { title: 'Sejarah Singkat' })
const pageGoogleFields = googleFields('history_seo_title', 'history_seo_description')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Sejarah Singkat</h3>
      <p class="text-sm text-muted">
        Tulisan disimpan dengan tombol "Simpan Pengaturan" di bawah. Butir linimasa langsung tersimpan saat
        ditambah atau diubah.
      </p>
    </div>

    <SettingTextGroup
      v-model:form="form"
      heading="Judul Atas Halaman"
      :fields="pageBannerFields"
      :errors="errors"
    />

    <BaseInput
      v-model="form.history_title"
      label="Judul di Atas Cerita Sejarah"
      placeholder="Contoh: Jejak Langkah Kami"
      :error-message="errors.history_title?.[0]"
    />

    <BaseTextarea
      v-model="form.history_text"
      label="Cerita Sejarah"
      placeholder="Ceritakan awal mula dan perjalanan paguyuban..."
      :rows="8"
      :error-message="errors.history_text?.[0]"
      help-text="Pisahkan paragraf dengan satu baris kosong."
    />

    <SettingTextGroup
      v-model:form="form"
      :heading="GOOGLE_GROUP_HEADING"
      :description="GOOGLE_GROUP_DESCRIPTION"
      :fields="pageGoogleFields"
      :errors="errors"
    />

    <MilestoneManager />
  </div>
</template>
