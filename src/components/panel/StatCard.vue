<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  description: {
    type: String,
    default: '',
  },
  trend: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'accent', 'blue'].includes(val),
  },
})

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-secondary/15 text-primary border-secondary/25'
    case 'accent':
      return 'bg-accent/20 text-yellow-700 border-accent/40'
    case 'blue':
      return 'bg-brand-blue/15 text-brand-blue border-brand-blue/25'
    case 'primary':
    default:
      return 'bg-primary/10 text-primary border-primary/20'
  }
})
</script>

<template>
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-secondary/20 hover:border-secondary/40 transition-all">
    <div class="flex items-center justify-between gap-4 mb-3">
      <span class="text-xs sm:text-sm font-semibold text-muted tracking-wide">
        {{ title }}
      </span>

      <div
        v-if="icon"
        class="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        :class="iconBgClass"
      >
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>

    <div class="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-1">
      {{ value }}
    </div>

    <div v-if="description || trend" class="flex items-center gap-2 text-xs text-muted">
      <span v-if="trend" class="font-bold text-primary">
        {{ trend }}
      </span>
      <span v-if="description">
        {{ description }}
      </span>
    </div>
  </div>
</template>
