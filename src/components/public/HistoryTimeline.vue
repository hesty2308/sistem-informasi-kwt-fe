<script setup>
import HistoryTimelineItem from '@/components/public/HistoryTimelineItem.vue'

defineProps({
  milestones: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <ol class="relative ml-3 sm:ml-4 border-l-2 border-secondary/60" aria-label="Linimasa sejarah paguyuban">
    <HistoryTimelineItem v-for="item in milestones" :key="item.id" :milestone="item" />
  </ol>
</template>
