<script setup>
import { ref, reactive, watch } from 'vue'
import { updatePanelGallery } from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isOpen = defineModel({ type: Boolean, default: false })

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['updated'])

const toastStore = useToastStore()

const editForm = reactive({
  title: '',
  caption: '',
})
const isUpdating = ref(false)

// Refill the form every time the modal opens for an item.
watch(isOpen, (open) => {
  if (open && props.item) {
    editForm.title = props.item.title || ''
    editForm.caption = props.item.caption || ''
  }
})

const handleUpdateGallery = async () => {
  if (!editForm.title.trim()) {
    toastStore.error('Judul foto wajib diisi.')
    return
  }

  isUpdating.value = true
  try {
    await updatePanelGallery(props.item.id, {
      title: editForm.title.trim(),
      caption: editForm.caption.trim(),
    })
    toastStore.success('Data galeri berhasil diperbarui.')
    isOpen.value = false
    emit('updated')
  } catch (err) {
    toastStore.error(err.message || 'Gagal memperbarui galeri.')
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <BaseModal
    v-model="isOpen"
    title="Ubah Keterangan Foto Galeri"
    max-width="max-w-md"
  >
    <form @submit.prevent="handleUpdateGallery" class="space-y-4">
      <BaseInput
        v-model="editForm.title"
        label="Judul Foto"
        placeholder="Masukkan judul foto"
        required
      />

      <div>
        <label class="block text-xs sm:text-sm font-semibold text-ink mb-1">
          Keterangan / Takarir
        </label>
        <textarea
          v-model="editForm.caption"
          rows="3"
          placeholder="Tuliskan keterangan dokumentasi foto ini..."
          class="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
        />
      </div>

      <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <BaseButton
          type="button"
          variant="ghost"
          @click="isOpen = false"
        >
          Batal
        </BaseButton>

        <BaseButton
          type="submit"
          variant="primary"
          :loading="isUpdating"
        >
          Simpan Perubahan
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
