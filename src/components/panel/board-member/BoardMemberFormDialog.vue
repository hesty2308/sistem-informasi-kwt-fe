<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const isOpen = defineModel({ type: Boolean, default: false })

const props = defineProps({
  // null when adding a new member.
  member: {
    type: Object,
    default: null,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit'])

const name = ref('')
const position = ref('')
// File for a new upload, URL string for the current photo, or null for no photo.
const photo = ref(null)

const isEdit = computed(() => Boolean(props.member))
const title = computed(() => (isEdit.value ? 'Ubah Data Pengurus' : 'Tambah Pengurus'))

watch(isOpen, (open) => {
  if (!open) return
  name.value = props.member?.name || ''
  position.value = props.member?.position || ''
  photo.value = props.member?.photo_url || null
})

const submit = () => {
  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('position', position.value)

  if (photo.value instanceof File) {
    formData.append('photo', photo.value)
  } else if (isEdit.value && !photo.value && props.member?.photo_url) {
    formData.append('remove_photo', '1')
  }

  emit('submit', formData)
}
</script>

<template>
  <BaseModal v-model="isOpen" :title="title" max-width="max-w-lg" :closeable="!saving">
    <form id="board-member-form" class="space-y-4" @submit.prevent="submit">
      <BaseInput
        v-model="name"
        label="Nama Lengkap"
        placeholder="Contoh: Siti Aminah"
        required
        :error-message="errors.name?.[0]"
      />
      <BaseInput
        v-model="position"
        label="Jabatan"
        placeholder="Contoh: Ketua"
        required
        :error-message="errors.position?.[0]"
      />
      <ImageUploader
        v-model="photo"
        label="Foto Pengurus (opsional)"
        help-text="Format JPG, JPEG, PNG, atau WEBP. Ukuran maksimal 2 MB. Sebaiknya foto persegi."
      />
      <p v-if="errors.photo?.[0]" class="text-sm text-red-600 font-medium">{{ errors.photo[0] }}</p>
    </form>

    <template #footer>
      <BaseButton variant="ghost" :disabled="saving" @click="isOpen = false">Batal</BaseButton>
      <BaseButton type="submit" form="board-member-form" :loading="saving" :disabled="!name.trim() || !position.trim()">
        Simpan
      </BaseButton>
    </template>
  </BaseModal>
</template>
