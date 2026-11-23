<script setup>
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Yakin ingin menghapus?',
  },
  message: {
    type: String,
    default: 'Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan tindakan ini?',
  },
  confirmText: {
    type: String,
    default: 'Ya, Hapus',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    max-width="max-w-md"
    :closeable="!loading"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
        <AlertTriangle class="w-6 h-6" />
      </div>

      <div>
        <h3 class="text-lg font-bold text-ink mb-1.5">
          {{ title }}
        </h3>
        <p class="text-base text-muted">
          {{ message }}
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="loading"
        @click="onCancel"
      >
        {{ cancelText }}
      </BaseButton>

      <BaseButton
        variant="danger"
        size="sm"
        :loading="loading"
        @click="onConfirm"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
