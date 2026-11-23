<script setup>
import { ref, watch } from 'vue'
import { PUBLIC_PAGE_OPTIONS, isKnownPublicPage } from '@/config/publicPages'

// Link picker: a list of the website's pages, plus (optionally) a free "other link" field for external
// addresses such as WhatsApp or Facebook. Stores the chosen path/URL as a plain string.
const model = defineModel({ type: String, default: '' })

defineProps({
  label: {
    type: String,
    required: true,
  },
  allowExternal: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const OTHER = '__other__'
const uid = `page-link-${Math.random().toString(36).slice(2, 9)}`

const isOther = ref(Boolean(model.value) && !isKnownPublicPage(model.value))
const selected = ref(isOther.value ? OTHER : model.value || '')

// Keep the list in sync when the form is reloaded/reset from outside.
watch(model, (value) => {
  if (isKnownPublicPage(value)) {
    isOther.value = false
    selected.value = value
  } else if (value) {
    isOther.value = true
    selected.value = OTHER
  }
})

const onSelect = () => {
  if (selected.value === OTHER) {
    isOther.value = true
    if (isKnownPublicPage(model.value)) model.value = ''
    return
  }
  isOther.value = false
  model.value = selected.value
}
</script>

<template>
  <div class="space-y-2">
    <label :for="uid" class="block text-sm font-semibold text-ink">{{ label }}</label>
    <select
      :id="uid"
      v-model="selected"
      class="w-full min-h-11 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      @change="onSelect"
    >
      <option value="" disabled>Pilih halaman tujuan...</option>
      <option v-for="page in PUBLIC_PAGE_OPTIONS" :key="page.path" :value="page.path">
        {{ page.label }}
      </option>
      <option v-if="allowExternal || isOther" :value="OTHER">Tautan lain (alamat website luar)</option>
    </select>

    <input
      v-if="isOther"
      v-model="model"
      type="text"
      placeholder="Tempel alamat lengkap, contoh: https://wa.me/62812xxxxxxxx"
      class="w-full min-h-11 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-base text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    />

    <p v-if="errorMessage" class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
  </div>
</template>
