<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'accent', 'blue', 'outline', 'category'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md'].includes(val),
  },
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-secondary text-ink font-semibold'
    case 'accent':
      return 'bg-accent text-primary font-bold'
    case 'blue':
      return 'bg-brand-blue text-white font-medium'
    case 'outline':
      return 'border border-primary text-primary bg-white'
    case 'primary':
    default:
      // Hijau tua KWT Kartini - Label Kategori Utama
      return 'bg-primary text-white font-semibold shadow-xs'
  }
})

const sizeClasses = computed(() => {
  return props.size === 'sm'
    ? 'text-xs px-2.5 py-0.5'
    : 'text-xs sm:text-sm px-3.5 py-1'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center justify-center rounded-full tracking-wide transition-colors',
      variantClasses,
      sizeClasses,
    ]"
  >
    <slot />
  </span>
</template>
