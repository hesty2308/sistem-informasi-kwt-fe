<script setup>
defineProps({
  hoverable: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: Boolean,
    default: true,
  },
  tag: {
    type: String,
    default: 'div',
  },
})
</script>

<template>
  <component
    :is="tag"
    :class="[
      'bg-background rounded-3xl border border-secondary/20 shadow-card transition-all duration-300 overflow-hidden',
      hoverable ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : '',
      padding ? 'p-5 sm:p-6' : '',
    ]"
  >
    <slot />
  </component>
</template>
