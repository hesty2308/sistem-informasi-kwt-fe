<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => 'select-' + Math.random().toString(36).substring(2, 9),
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Pilih salah satu opsi...',
  },
  helpText: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'change', 'blur'])

const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label ?? opt.value,
      }
    }
    return {
      value: opt,
      label: opt,
    }
  })
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-ink mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-2.5 rounded-xl border text-ink text-base transition-colors duration-200 bg-white appearance-none cursor-pointer',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          errorMessage
            ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
            : 'border-gray-300 focus:ring-primary focus:border-transparent',
        ]"
        @change="$emit('update:modelValue', $event.target.value); $emit('change', $event.target.value)"
        @blur="$emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">
          {{ placeholder }}
        </option>
        <option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Chevron indicator -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-muted">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Help text / Pesan Bantuan -->
    <p v-if="helpText && !errorMessage" class="text-xs text-muted mt-1.5">
      {{ helpText }}
    </p>

    <!-- Error message / Pesan Error -->
    <p v-if="errorMessage" class="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
