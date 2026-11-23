<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import PageLinkSelect from '@/components/panel/settings/PageLinkSelect.vue'
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'
import { sectionHeadingFields } from '@/config/settingFieldGroups'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update-hero'])

const postsHeadingFields = sectionHeadingFields('home_posts_title', 'home_posts_subtitle', {
  title: 'Kegiatan Terbaru',
})
const galleryHeadingFields = sectionHeadingFields('home_gallery_title', 'home_gallery_subtitle', {
  title: 'Galeri Dokumentasi',
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Bagian Pembuka Beranda</h3>
      <p class="text-sm text-muted">
        Bagian paling atas Beranda: judul besar, kalimat pembuka, dua tombol, dan foto latar.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.hero_title_1"
        label="Judul Besar Baris 1"
        placeholder="Contoh: Bersama Kartini,"
        :error-message="errors.hero_title_1?.[0]"
      />

      <BaseInput
        v-model="form.hero_title_2"
        label="Judul Besar Baris 2"
        placeholder="Contoh: Kita Tumbuh dan Berdaya"
        :error-message="errors.hero_title_2?.[0]"
      />
    </div>

    <BaseTextarea
      v-model="form.hero_description"
      label="Kalimat Pembuka"
      placeholder="Tuliskan kalimat pembuka yang menggugah semangat..."
      :rows="3"
      :error-message="errors.hero_description?.[0]"
      help-text="Tampil di bawah judul besar."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4 p-4 sm:p-5 rounded-2xl bg-surface border border-secondary/20">
        <span class="block text-sm font-bold text-primary">Tombol Kuning (kiri)</span>
        <BaseInput
          v-model="form.hero_btn1_text"
          label="Tulisan pada Tombol"
          placeholder="Contoh: Lihat Kegiatan"
          :error-message="errors.hero_btn1_text?.[0]"
        />
        <PageLinkSelect
          v-model="form.hero_btn1_url"
          label="Saat Diklik, Buka Halaman"
          allow-external
          :error-message="errors.hero_btn1_url?.[0]"
        />
      </div>

      <div class="space-y-4 p-4 sm:p-5 rounded-2xl bg-surface border border-secondary/20">
        <span class="block text-sm font-bold text-primary">Tombol Bergaris Putih (kanan)</span>
        <BaseInput
          v-model="form.hero_btn2_text"
          label="Tulisan pada Tombol"
          placeholder="Contoh: Tentang Kami"
          :error-message="errors.hero_btn2_text?.[0]"
        />
        <PageLinkSelect
          v-model="form.hero_btn2_url"
          label="Saat Diklik, Buka Halaman"
          allow-external
          :error-message="errors.hero_btn2_url?.[0]"
        />
      </div>
    </div>

    <div class="max-w-md">
      <ImageUploader
        :model-value="form.hero_file || form.hero_image_url"
        label="Foto Latar Bagian Pembuka"
        help-text="Pilih foto mendatar (lanskap) kegiatan tani. Ukuran maksimal 2 MB."
        @update:model-value="emit('update-hero', $event)"
      />
      <p v-if="errors.hero_image?.[0]" class="text-sm text-red-600 font-medium mt-1">
        {{ errors.hero_image[0] }}
      </p>
    </div>

    <div class="pt-6 border-t border-gray-100 space-y-4">
      <div>
        <h3 class="text-base font-bold text-ink mb-1">Judul Bagian Lain di Beranda</h3>
        <p class="text-sm text-muted">Judul di atas daftar kegiatan dan foto galeri pada Beranda.</p>
      </div>
      <SettingTextGroup
        v-model:form="form"
        heading="Bagian Kegiatan Terbaru"
        :fields="postsHeadingFields"
        :errors="errors"
      />
      <SettingTextGroup
        v-model:form="form"
        heading="Bagian Galeri"
        :fields="galleryHeadingFields"
        :errors="errors"
      />
    </div>
  </div>
</template>
