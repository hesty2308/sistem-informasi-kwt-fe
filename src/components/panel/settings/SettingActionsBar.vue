<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { Save, RotateCcw, X } from 'lucide-vue-next'

defineProps({
  isDirty: {
    type: Boolean,
    default: false,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  isResetting: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['save', 'cancel', 'reset'])
</script>

<template>
  <!-- Bottom actions bar: save, cancel, reset to default -->
  <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <BaseButton
        variant="outline"
        size="sm"
        :disabled="isSaving || isResetting"
        @click="$emit('reset')"
        title="Kembalikan isian di bagian ini ke pengaturan bawaan"
        class="text-red-600 border-red-200 hover:bg-red-50"
      >
        <RotateCcw class="w-3.5 h-3.5 mr-1.5" />
        <span>Kembalikan ke Default</span>
      </BaseButton>

      <BaseButton
        v-if="isDirty"
        variant="outline"
        size="sm"
        :disabled="isSaving"
        @click="$emit('cancel')"
      >
        <X class="w-3.5 h-3.5 mr-1.5" />
        <span>Batal</span>
      </BaseButton>
    </div>

    <div class="flex items-center gap-4">
      <p class="text-xs text-muted hidden sm:inline">
        <span v-if="isDirty" class="text-amber-600 font-semibold">• Ada perubahan yang belum disimpan</span>
        <span v-else>Pengaturan tersimpan rapi</span>
      </p>

      <BaseButton variant="primary" size="md" :loading="isSaving" @click="$emit('save')">
        <Save class="w-4 h-4 mr-1.5" />
        <span>Simpan Pengaturan</span>
      </BaseButton>
    </div>
  </div>
</template>
