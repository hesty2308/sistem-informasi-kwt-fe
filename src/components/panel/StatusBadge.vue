<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const badgeConfig = computed(() => {
  const norm = String(props.status).toLowerCase()

  switch (norm) {
    case 'published':
    case 'terbit':
      return {
        text: props.label || 'Terbit',
        classes: 'bg-green-100 text-primary border-green-200',
        dotClass: 'bg-primary',
      }

    case 'draft':
    case 'draf':
      return {
        text: props.label || 'Draf',
        classes: 'bg-gray-100 text-muted border-gray-200',
        dotClass: 'bg-muted',
      }

    case 'active':
    case 'aktif':
      return {
        text: props.label || 'Aktif',
        classes: 'bg-green-100 text-primary border-green-200',
        dotClass: 'bg-primary animate-pulse',
      }

    case 'inactive':
    case 'nonaktif':
      return {
        text: props.label || 'Nonaktif',
        classes: 'bg-red-100 text-red-700 border-red-200',
        dotClass: 'bg-red-600',
      }

    case 'super_admin':
      return {
        text: props.label || 'Super Admin',
        classes: 'bg-blue-100 text-brand-blue border-blue-200',
        dotClass: 'bg-brand-blue',
      }

    case 'admin':
      return {
        text: props.label || 'Admin',
        classes: 'bg-surface text-primary border-secondary/30',
        dotClass: 'bg-primary',
      }

    default:
      return {
        text: props.label || props.status,
        classes: 'bg-gray-100 text-ink border-gray-200',
        dotClass: 'bg-gray-400',
      }
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors shadow-xs"
    :class="badgeConfig.classes"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="badgeConfig.dotClass" />
    <span>{{ badgeConfig.text }}</span>
  </span>
</template>
