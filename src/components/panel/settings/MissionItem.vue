<script setup>
import { ref } from 'vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  mission: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['save', 'toggle', 'move', 'delete'])

const isEditing = ref(false)
const draft = ref('')

const startEdit = () => {
  draft.value = props.mission.text
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const submitEdit = () => {
  // Parent closes the editor through `done` once the API call succeeds.
  emit('save', draft.value, () => {
    isEditing.value = false
  })
}

const iconButtonClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/30 text-primary hover:bg-surface transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
</script>

<template>
  <li
    class="p-4 rounded-2xl border bg-white transition-colors duration-200"
    :class="mission.is_active ? 'border-secondary/30' : 'border-dashed border-muted/40 bg-surface'"
    data-testid="mission-row"
  >
    <div v-if="isEditing" class="space-y-3">
      <BaseTextarea
        v-model="draft"
        :label="`Ubah Butir Misi ${index + 1}`"
        :rows="3"
        :error-message="error"
      />
      <div class="flex flex-wrap gap-2 justify-end">
        <BaseButton variant="ghost" :disabled="busy" @click="cancelEdit">Batal</BaseButton>
        <BaseButton :loading="busy" @click="submitEdit">Simpan</BaseButton>
      </div>
    </div>

    <div v-else class="flex flex-col sm:flex-row sm:items-start gap-3">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <span
          class="shrink-0 w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center"
        >
          {{ index + 1 }}
        </span>
        <div class="min-w-0">
          <p class="text-base text-ink leading-relaxed break-words" :class="{ 'text-muted': !mission.is_active }">
            {{ mission.text }}
          </p>
          <span
            v-if="!mission.is_active"
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
          :disabled="busy || index === 0"
          title="Naikkan urutan"
          aria-label="Naikkan urutan"
          @click="emit('move', -1)"
        >
          <ArrowUp class="w-4 h-4" />
        </button>
        <button
          type="button"
          :class="iconButtonClass"
          :disabled="busy || index === total - 1"
          title="Turunkan urutan"
          aria-label="Turunkan urutan"
          @click="emit('move', 1)"
        >
          <ArrowDown class="w-4 h-4" />
        </button>
        <button
          type="button"
          :class="iconButtonClass"
          :disabled="busy"
          :title="mission.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
          :aria-label="mission.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
          @click="emit('toggle')"
        >
          <EyeOff v-if="mission.is_active" class="w-4 h-4" />
          <Eye v-else class="w-4 h-4" />
        </button>
        <button
          type="button"
          :class="iconButtonClass"
          :disabled="busy"
          title="Ubah misi"
          aria-label="Ubah misi"
          @click="startEdit"
        >
          <Pencil class="w-4 h-4" />
        </button>
        <button
          type="button"
          :class="[iconButtonClass, 'text-red-600 border-red-200 hover:bg-red-50']"
          :disabled="busy"
          title="Hapus misi"
          aria-label="Hapus misi"
          @click="emit('delete')"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </li>
</template>
