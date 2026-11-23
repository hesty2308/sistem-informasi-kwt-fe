<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Bagian Bawah Website (Footer)</h3>
      <p class="text-sm text-muted">
        Bagian berwarna biru di paling bawah semua halaman.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.footer_links_title"
        label="Judul Kolom Menu"
        placeholder="Contoh: Tautan Cepat"
        :error-message="errors.footer_links_title?.[0]"
      />
      <BaseInput
        v-model="form.footer_contact_title"
        label="Judul Kolom Kontak"
        placeholder="Contoh: Hubungi Kami"
        :error-message="errors.footer_contact_title?.[0]"
      />
    </div>

    <BaseTextarea
      v-model="form.footer_text"
      label="Kalimat Tentang Paguyuban"
      placeholder="Tulis ringkasan singkat profil organisasi yang tampil di bagian bawah website..."
      :rows="3"
      :error-message="errors.footer_text?.[0]"
      help-text="Tampil di kolom pertama, di bawah logo."
    />

    <BaseInput
      v-model="form.footer_facebook_btn_text"
      label="Tulisan pada Tombol Facebook"
      placeholder="Contoh: Kunjungi Facebook Kami"
      :error-message="errors.footer_facebook_btn_text?.[0]"
    />

    <BaseInput
      v-model="form.footer_copyright"
      label="Tulisan Hak Cipta"
      placeholder="Contoh: Semua hak dilindungi."
      :error-message="errors.footer_copyright?.[0]"
      help-text="Tampil di baris paling bawah. Tahun dan nama paguyuban ditambahkan otomatis di depannya."
    />

    <div class="p-4 rounded-2xl bg-surface border border-secondary/20 text-sm text-muted space-y-1">
      <p class="font-bold text-ink">Diambil otomatis dari bagian lain:</p>
      <p>• Alamat, WhatsApp, dan email diambil dari menu <strong>Kontak</strong>.</p>
      <p>• Daftar "Tautan Cepat" otomatis sama dengan menu <strong>Menu Utama</strong>.</p>
    </div>
  </div>
</template>
