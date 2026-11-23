<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  milestone: {
    type: Object,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['save', 'toggle', 'delete'])

const isEditing = ref(false)
const draft = ref({ year: '', title: '', description: '' })

const startEdit = () => {
  draft.value = {
    year: props.milestone.year,
    title: props.milestone.title,
    description: props.milestone.description || '',
  }
  isEditing.value = true
}

const submitEdit = () => {
  // Parent closes the editor through `done` once the API call succeeds.
  emit('save', { ...draft.value, year: Number(draft.value.year) }, () => {
    isEditing.value = false
  })
}

const iconButtonClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/30 text-primary hover:bg-surface transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
</script>

<template>
  <li
    class="p-4 rounded-2xl border bg-white transition-colors duration-200"
    :class="milestone.is_active ? 'border-secondary/30' : 'border-dashed border-muted/40 bg-surface'"
    data-testid="milestone-row"
  >
    <div v-if="isEditing" class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <BaseInput v-model="draft.year" type="number" label="Tahun" :error-message="errors.year?.[0]" />
        <div class="sm:col-span-3">
          <BaseInput v-model="draft.title" label="Judul Peristiwa" :error-message="errors.title?.[0]" />
        </div>
      </div>
      <BaseTextarea v-model="draft.description" label="Keterangan" :rows="3" :error-message="errors.description?.[0]" />
      <div class="flex flex-wrap gap-2 justify-end">
        <BaseButton variant="ghost" :disabled="busy" @click="isEditing = false">Batal</BaseButton>
        <BaseButton :loading="busy" @click="submitEdit">Simpan</BaseButton>
      </div>
    </div>

    <div v-else class="flex flex-col sm:flex-row sm:items-start gap-3">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <span class="shrink-0 px-3 py-1.5 rounded-xl bg-primary text-white font-bold">{{ milestone.year }}</span>
        <div class="min-w-0">
          <p class="text-base font-semibold text-ink break-words" :class="{ 'text-muted': !milestone.is_active }">
            {{ milestone.title }}
          </p>
          <p v-if="milestone.description" class="text-base text-muted leading-relaxed break-words whitespace-pre-line">
            {{ milestone.description }}
          </p>
          <span
            v-if="!milestone.is_active"
            class="inline-block mt-1 px-2 py-0.5 rounded-full bg-white border border-muted/30 text-xs font-semibold text-muted"
          >
            Disembunyikan dari halaman publik
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 sm:shrink-0">
        <button
          type="button"
          :class="iconButtonClass"
          :disabled="busy"
          :title="milestone.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
          :aria-label="milestone.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
          @click="emit('toggle')"
        >
          <EyeOff v-if="milestone.is_active" class="w-4 h-4" />
          <Eye v-else class="w-4 h-4" />
        </button>
        <button type="button" :class="iconButtonClass" :disabled="busy" title="Ubah butir" aria-label="Ubah butir linimasa" @click="startEdit">
          <Pencil class="w-4 h-4" />
        </button>
        <button
          type="button"
          :class="[iconButtonClass, 'text-red-600 border-red-200 hover:bg-red-50']"
          :disabled="busy"
          title="Hapus butir"
          aria-label="Hapus butir linimasa"
          @click="emit('delete')"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </li>
</template>
