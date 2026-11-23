<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

// A boxed group of setting text fields (e.g. a page banner or the Google/browser-tab texts).
// `fields`: [{ key, label, placeholder?, helpText?, multiline? }]
const form = defineModel('form', { type: Object, required: true })

defineProps({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  fields: {
    type: Array,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="p-4 sm:p-5 rounded-2xl bg-surface border border-secondary/20 space-y-4">
    <div>
      <span class="block text-sm font-bold text-primary">{{ heading }}</span>
      <p v-if="description" class="text-sm text-muted mt-0.5">{{ description }}</p>
    </div>
    <template v-for="field in fields" :key="field.key">
      <BaseTextarea
        v-if="field.multiline"
        v-model="form[field.key]"
        :label="field.label"
        :placeholder="field.placeholder || ''"
        :help-text="field.helpText || ''"
        :rows="2"
        :error-message="errors[field.key]?.[0]"
      />
      <BaseInput
        v-else
        v-model="form[field.key]"
        :label="field.label"
        :placeholder="field.placeholder || ''"
        :help-text="field.helpText || ''"
        :error-message="errors[field.key]?.[0]"
      />
    </template>
  </div>
</template>
