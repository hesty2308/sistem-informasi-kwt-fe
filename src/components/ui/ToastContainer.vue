<script setup>
import { useToastStore } from '@/stores/toast'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="item in toastStore.toasts"
        :key="item.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border text-sm transition-all',
          item.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : '',
          item.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' : '',
          item.type === 'info' ? 'bg-blue-50 border-brand-blue text-blue-900' : '',
        ]"
      >
        <!-- Icon -->
        <CheckCircle2 v-if="item.type === 'success'" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <AlertCircle v-else-if="item.type === 'error'" class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <Info v-else class="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />

        <!-- Message -->
        <p class="flex-1 font-medium leading-snug">
          {{ item.message }}
        </p>

        <!-- Close button -->
        <button
          type="button"
          class="shrink-0 p-0.5 text-gray-400 hover:text-ink rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          @click="toastStore.remove(item.id)"
          aria-label="Tutup notifikasi"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
