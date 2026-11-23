<script setup>
import { useReveal } from '@/composables/useReveal'

defineProps({
  milestone: {
    type: Object,
    required: true,
  },
})

const { targetRef, isRevealed } = useReveal()
</script>

<template>
  <li
    ref="targetRef"
    class="relative pl-10 sm:pl-14 pb-10 last:pb-0 motion-safe:transition-all motion-safe:duration-300"
    :class="isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
    data-testid="history-milestone"
  >
    <!-- Dot on the timeline line -->
    <span
      class="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 -translate-x-1/2 rounded-full bg-primary border-4 border-surface shadow-xs"
      aria-hidden="true"
    />

    <span class="inline-block px-3 py-1 rounded-full bg-accent text-primary text-sm font-black tracking-wide mb-2">
      {{ milestone.year }}
    </span>
    <h3 class="text-lg sm:text-xl font-bold text-ink mb-1.5">{{ milestone.title }}</h3>
    <p v-if="milestone.description" class="text-base text-muted leading-relaxed whitespace-pre-line">
      {{ milestone.description }}
    </p>
  </li>
</template>
