<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import RichTextEditor from '@/components/panel/RichTextEditor.vue'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['slug-input'])

// Live counter for excerpt
const excerptCount = computed(() => form.value.excerpt?.length || 0)
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20 space-y-6">
    <!-- Judul Kegiatan -->
    <BaseInput
      v-model="form.title"
      label="Judul Kegiatan"
      placeholder="Contoh: Pelatihan Pengolahan Tepung Mocaf Ramah Lingkungan"
      :error="errors.title"
      required
    />

    <!-- Slug URL -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-ink mb-1">
        Slug Tautan URL
      </label>
      <div class="flex items-center rounded-xl border border-secondary/20 bg-surface px-3 py-2.5 text-xs sm:text-sm">
        <span class="text-muted font-mono select-none pr-1">/kegiatan/</span>
        <input
          v-model="form.slug"
          type="text"
          @input="$emit('slug-input')"
          placeholder="slug-otomatis"
          class="w-full bg-transparent font-mono text-ink focus:outline-none"
        />
      </div>
      <p v-if="errors.slug" class="text-xs text-red-500 mt-1">
        {{ errors.slug }}
      </p>
      <p v-else class="text-[11px] text-muted mt-1">
        Dibuat otomatis dari judul, atau sesuaikan bila diperlukan.
      </p>
    </div>

    <!-- Ringkasan (Excerpt) Maksimal 200 Karakter dengan Counter -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <label class="block text-xs sm:text-sm font-semibold text-ink">
          Ringkasan Singkat (Maks 200 Karakter)
        </label>
        <span
          class="text-xs font-mono font-bold"
          :class="excerptCount > 200 ? 'text-red-500' : 'text-muted'"
        >
          {{ excerptCount }} / 200 karakter
        </span>
      </div>
      <textarea
        v-model="form.excerpt"
        maxlength="200"
        rows="3"
        placeholder="Tuliskan 1-2 kalimat ringkasan yang menarik untuk ditampilkan pada kartu kegiatan di halaman Beranda..."
        class="w-full px-4 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition resize-none"
      />
      <p v-if="errors.excerpt" class="text-xs text-red-500 mt-1">
        {{ errors.excerpt }}
      </p>
    </div>

    <!-- Isi Artikel Lengkap (Tiptap Rich Text Editor) -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-ink mb-2">
        Isi Artikel Kegiatan Lengkap <span class="text-red-500">*</span>
      </label>
      <RichTextEditor
        v-model="form.content"
        placeholder="Tuliskan narasi lengkap kegiatan, materi pelatihan, kutipan peserta, dan hasil panen di sini..."
      />
      <p v-if="errors.content" class="text-xs text-red-500 mt-1">
        {{ errors.content }}
      </p>
    </div>
  </div>
</template>
