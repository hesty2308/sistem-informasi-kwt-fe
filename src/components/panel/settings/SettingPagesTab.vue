<script setup>
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'
import { bannerFields } from '@/config/settingFieldGroups'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const postsBannerFields = bannerFields('posts_banner_title', 'posts_banner_subtitle', { title: 'Kegiatan Kami' })
const galleryBannerFields = bannerFields('gallery_banner_title', 'gallery_banner_subtitle', {
  title: 'Galeri Dokumentasi',
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Kegiatan &amp; Galeri</h3>
      <p class="text-sm text-muted">
        Judul hijau besar di bagian atas halaman Kegiatan dan halaman Galeri. Isi kegiatan dan foto diatur di
        menu "Kegiatan" dan "Galeri" pada sidebar.
      </p>
    </div>

    <SettingTextGroup
      v-model:form="form"
      heading="Judul Atas Halaman Kegiatan"
      :fields="postsBannerFields"
      :errors="errors"
    />
    <SettingTextGroup
      v-model:form="form"
      heading="Judul Atas Halaman Galeri"
      :fields="galleryBannerFields"
      :errors="errors"
    />
  </div>
</template>
