<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { Save, Send, CheckCircle } from 'lucide-vue-next'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['submit'])
</script>

<template>
  <div class="bg-white rounded-3xl p-6 shadow-card border border-secondary/20 space-y-5">
    <h3 class="text-base font-bold text-ink pb-3 border-b border-gray-100 flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-primary" />
      <span>Pengaturan Publikasi</span>
    </h3>

    <!-- Status Publikasi -->
    <div>
      <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        Status Naskah
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          @click="form.status = 'published'"
          class="py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border"
          :class="form.status === 'published' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-ink/80 border-secondary/20 hover:bg-white'"
        >
          <span class="w-2 h-2 rounded-full" :class="form.status === 'published' ? 'bg-accent' : 'bg-gray-400'" />
          <span>Terbitkan</span>
        </button>

        <button
          type="button"
          @click="form.status = 'draft'"
          class="py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border"
          :class="form.status === 'draft' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-surface text-ink/80 border-secondary/20 hover:bg-white'"
        >
          <span class="w-2 h-2 rounded-full" :class="form.status === 'draft' ? 'bg-white' : 'bg-gray-400'" />
          <span>Draf</span>
        </button>
      </div>
    </div>

    <!-- Kategori Kegiatan -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-ink mb-1">
        Kategori Kegiatan
      </label>
      <select
        v-model="form.category_id"
        class="w-full px-3 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
      >
        <option value="">Pilih Kategori Kegiatan</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="errors.category_id" class="text-xs text-red-500 mt-1">
        {{ errors.category_id }}
      </p>
    </div>

    <!-- Tanggal Terbit (Boleh Dijadwalkan) -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-ink mb-1">
        Tanggal Terbit (Penjadwalan)
      </label>
      <input
        v-model="form.published_at"
        type="datetime-local"
        class="w-full px-3 py-2.5 rounded-xl border border-secondary/20 bg-surface text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
      />
      <p class="text-[11px] text-muted mt-1">
        Kosongkan untuk otomatis menggunakan waktu saat ini saat diterbitkan.
      </p>
    </div>

    <!-- Tombol Aksi Simpan -->
    <div class="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
      <BaseButton
        type="button"
        variant="primary"
        :loading="isSubmitting && form.status === 'published'"
        @click="$emit('submit', 'published')"
        class="w-full justify-center cursor-pointer shadow-sm"
      >
        <Send class="w-4 h-4 mr-2" />
        <span>{{ isEditMode ? 'Simpan &amp; Terbitkan' : 'Terbitkan Sekarang' }}</span>
      </BaseButton>

      <BaseButton
        type="button"
        variant="outline"
        :loading="isSubmitting && form.status === 'draft'"
        @click="$emit('submit', 'draft')"
        class="w-full justify-center cursor-pointer text-xs"
      >
        <Save class="w-4 h-4 mr-2" />
        <span>Simpan sebagai Draf</span>
      </BaseButton>
    </div>
  </div>
</template>
