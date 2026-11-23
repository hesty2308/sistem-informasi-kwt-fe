<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  // Must be a native HTML element; v-html on a Vue component would be discarded.
  tag: {
    type: String,
    default: 'div',
    validator: (val) => /^[a-z][a-z0-9]*$/.test(val),
  },
})

const sanitizedHtml = computed(() => {
  if (!props.content) return ''
  return DOMPurify.sanitize(props.content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  })
})
</script>

<template>
  <component
    :is="tag"
    class="prose prose-green max-w-none text-ink leading-relaxed"
    v-html="sanitizedHtml"
  />
</template>
