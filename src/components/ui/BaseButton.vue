<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
  type: {
    type: String,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-accent text-primary font-bold hover:bg-yellow-400 active:scale-[0.98] shadow-sm'
    case 'secondary':
      return 'bg-primary text-white font-semibold hover:bg-primary-dark active:scale-[0.98] shadow-sm'
    case 'outline':
      return 'border-2 border-primary text-primary font-semibold hover:bg-primary/5 active:scale-[0.98]'
    case 'ghost':
      return 'text-primary font-semibold hover:bg-primary/10 active:scale-[0.98]'
    case 'danger':
      return 'bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-[0.98] shadow-sm'
    default:
      return 'bg-accent text-primary font-bold'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm px-4 py-1.5 min-h-[38px] gap-1.5'
    case 'lg':
      return 'text-lg px-7 py-3 min-h-[50px] gap-2.5'
    case 'md':
    default:
      return 'text-base px-5 py-2.5 min-h-[44px] gap-2'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
      variantClasses,
      sizeClasses,
      block ? 'w-full' : '',
    ]"
    @click="$emit('click', $event)"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot />
  </button>
</template>
