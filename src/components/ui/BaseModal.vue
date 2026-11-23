<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'max-w-md',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  if (props.closeable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'w-full bg-background rounded-3xl shadow-xl border border-secondary/20 p-6 sm:p-7 relative overflow-hidden',
              maxWidth,
            ]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <slot name="header">
                <h3 v-if="title" class="text-lg font-bold text-primary">
                  {{ title }}
                </h3>
              </slot>

              <button
                v-if="closeable"
                type="button"
                @click="closeModal"
                class="text-muted hover:text-ink p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Tutup dialog"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="text-ink text-sm sm:text-base mb-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
