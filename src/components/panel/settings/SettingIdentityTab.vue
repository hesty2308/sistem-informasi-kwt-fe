<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update-logo'])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Nama, Logo &amp; Bilah Atas</h3>
      <p class="text-sm text-muted">
        Nama dan logo tampil di bagian atas semua halaman. Bilah atas adalah garis hijau tipis paling atas.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.site_name"
        label="Nama Paguyuban"
        placeholder="Contoh: Paguyuban KWT Kartini"
        :error-message="errors.site_name?.[0]"
        help-text="Tampil di samping logo pada bagian atas semua halaman."
        required
      />

      <BaseInput
        v-model="form.site_tagline"
        label="Slogan"
        placeholder="Contoh: Pemberdayaan Wanita Tani Menuju Kemandirian Pangan Kabupaten OKU Timur"
        :error-message="errors.site_tagline?.[0]"
        help-text="Kalimat singkat di bawah nama paguyuban."
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.topbar_tagline"
        label="Tulisan di Bilah Hijau Paling Atas"
        placeholder="Contoh: Pemberdayaan Wanita Tani, Kabupaten OKU Timur"
        :error-message="errors.topbar_tagline?.[0]"
        help-text="Tampil di samping nomor WhatsApp pada bilah hijau tipis paling atas."
      />

      <BaseInput
        v-model="form.facebook_url"
        type="url"
        label="Alamat Halaman Facebook"
        placeholder="https://www.facebook.com/paguyuban.kwt.kartini.okut"
        :error-message="errors.facebook_url?.[0]"
        help-text="Buka halaman Facebook paguyuban di browser, salin alamatnya dari kotak alamat, lalu tempel di sini."
      />
    </div>

    <div class="pt-4 border-t border-gray-100">
      <!-- Logo Website -->
      <div class="max-w-md">
        <ImageUploader
          :model-value="form.logo_file || form.logo_url"
          label="Logo Paguyuban"
          help-text="Gunakan gambar logo berbentuk bundar atau persegi. Ukuran maksimal 2 MB."
          @update:model-value="emit('update-logo', $event)"
        />
        <p v-if="errors.logo?.[0]" class="text-sm text-red-600 font-medium mt-1">
          {{ errors.logo[0] }}
        </p>
      </div>
    </div>
  </div>
</template>
