<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { createPanelCategory, updatePanelCategory } from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isOpen = defineModel({ type: Boolean, default: false })

const props = defineProps({
  // Category being edited; null creates a new one.
  category: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved'])

const toastStore = useToastStore()

const DEFAULT_COLOR = '#0B6B35'

const colorPresets = [
  '#0B6B35', // Hijau KWT Primer
  '#7AB635', // Hijau Sekunder
  '#FFD91A', // Kuning Aksen
  '#1E35B8', // Biru Brand
  '#0284C7', // Biru Langit
  '#D97706', // Oranye Amber
  '#DC2626', // Merah
  '#7C3AED', // Ungu
]

const isEditMode = computed(() => !!props.category)
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  color: DEFAULT_COLOR,
})
const errors = reactive({
  name: '',
  color: '',
})

// Reset the form every time the modal opens.
watch(isOpen, (open) => {
  if (!open) return
  form.name = props.category?.name || ''
  form.color = props.category?.color || DEFAULT_COLOR
  errors.name = ''
  errors.color = ''
})

const handleSubmit = async () => {
  errors.name = ''
  errors.color = ''

  if (!form.name.trim()) {
    errors.name = 'Nama kategori wajib diisi.'
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      color: form.color || DEFAULT_COLOR,
    }

    if (isEditMode.value) {
      await updatePanelCategory(props.category.id, payload)
      toastStore.success('Kategori berhasil diperbarui.')
    } else {
      await createPanelCategory(payload)
      toastStore.success('Kategori berhasil ditambahkan.')
    }

    isOpen.value = false
    emit('saved')
  } catch (err) {
    if (err.response?.data?.errors?.name) {
      errors.name = err.response.data.errors.name[0]
    } else {
      toastStore.error(err.response?.data?.message || err.message || 'Gagal menyimpan kategori.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Create / edit category modal -->
  <BaseModal
    v-model="isOpen"
    :title="isEditMode ? 'Ubah Kategori' : 'Tambah Kategori Baru'"
    max-width="max-w-md"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nama Kategori -->
      <BaseInput
        v-model="form.name"
        label="Nama Kategori"
        placeholder="Contoh: Pelatihan, Panen Raya, Olah Pangan"
        :error="errors.name"
        required
      />

      <!-- Pilihan Warna Kategori -->
      <div>
        <label class="block text-xs sm:text-sm font-semibold text-ink mb-1">
          Warna Label Kategori
        </label>
        <div class="flex items-center gap-3 mb-2">
          <input
            v-model="form.color"
            type="color"
            class="w-10 h-10 rounded-xl cursor-pointer border border-secondary/25 p-0.5 bg-white"
          />
          <input
            v-model="form.color"
            type="text"
            placeholder="#0B6B35"
            class="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <!-- Color Presets -->
        <div class="flex items-center gap-2 pt-1">
          <button
            v-for="color in colorPresets"
            :key="color"
            type="button"
            @click="form.color = color"
            class="w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer border border-black/10"
            :style="{ backgroundColor: color }"
          />
        </div>
        <p v-if="errors.color" class="text-xs text-red-500 mt-1">
          {{ errors.color }}
        </p>
      </div>

      <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <BaseButton
          type="button"
          variant="ghost"
          @click="isOpen = false"
          class="cursor-pointer"
        >
          Batal
        </BaseButton>

        <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          class="cursor-pointer"
        >
          Simpan Kategori
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
