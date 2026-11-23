<script setup>
import { WifiOff, RefreshCw } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Tidak dapat terhubung. Coba lagi',
  },
  message: {
    type: String,
    default: 'Terjadi kendala saat menghubungi server. Silakan periksa koneksi internet Anda atau muat ulang halaman.',
  },
  retryLabel: {
    type: String,
    default: 'Muat Ulang',
  },
})

defineEmits(['retry'])
</script>

<template>
  <div class="bg-red-50/80 border border-red-200 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto shadow-sm">
    <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
      <WifiOff class="w-7 h-7" />
    </div>

    <h3 class="text-lg font-bold text-red-800 mb-2">
      {{ title }}
    </h3>

    <p class="text-base text-red-700 mb-6 leading-relaxed">
      {{ message }}
    </p>

    <BaseButton
      variant="primary"
      size="md"
      class="inline-flex items-center gap-2 cursor-pointer"
      @click="$emit('retry')"
    >
      <RefreshCw class="w-4 h-4" />
      <span>{{ retryLabel }}</span>
    </BaseButton>
  </div>
</template>
