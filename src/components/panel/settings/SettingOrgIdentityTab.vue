<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'
import { googleFields, GOOGLE_GROUP_HEADING, GOOGLE_GROUP_DESCRIPTION } from '@/config/settingFieldGroups'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const pageGoogleFields = googleFields('about_identity_seo_title', 'about_identity_seo_description')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Identitas Organisasi</h3>
      <p class="text-sm text-muted">
        Nama lengkap tampil sebagai judul besar di atas halaman. Deskripsi dan profil tampil di kartu identitas.
      </p>
    </div>

    <BaseInput
      v-model="form.identity_card_badge"
      label="Label Kecil di Atas Kartu"
      placeholder="Contoh: Identitas Resmi Organisasi"
      :error-message="errors.identity_card_badge?.[0]"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.about_identity_full_name"
        label="Nama Lengkap Organisasi"
        placeholder="Contoh: Paguyuban Kelompok Wanita Tani Kartini Kabupaten OKU Timur"
        :error-message="errors.about_identity_full_name?.[0]"
      />
      <BaseInput
        v-model="form.about_identity_abbreviation"
        label="Singkatan"
        placeholder="Contoh: KWT Kartini OKU Timur"
        :error-message="errors.about_identity_abbreviation?.[0]"
      />
    </div>

    <BaseTextarea
      v-model="form.about_identity_short_desc"
      label="Deskripsi Singkat"
      placeholder="Satu atau dua kalimat yang menjelaskan paguyuban..."
      :rows="3"
      :error-message="errors.about_identity_short_desc?.[0]"
      help-text="Tampil di bawah nama organisasi pada kartu identitas."
    />

    <BaseTextarea
      v-model="form.about_text"
      label="Profil Organisasi"
      placeholder="Tuliskan latar belakang dan profil paguyuban KWT Kartini..."
      :rows="6"
      :error-message="errors.about_text?.[0]"
      help-text="Narasi profil lengkap. Pisahkan paragraf dengan satu baris kosong."
    />

    <SettingTextGroup
      v-model:form="form"
      :heading="GOOGLE_GROUP_HEADING"
      :description="GOOGLE_GROUP_DESCRIPTION"
      :fields="pageGoogleFields"
      :errors="errors"
    />
  </div>
</template>
