<script setup>
defineProps({
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
    default: () => 'input-' + Math.random().toString(36).substring(2, 9),
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
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
  autocomplete: {
    type: String,
    default: 'off',
  },
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-ink mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="[
          'w-full px-4 py-2.5 rounded-xl border text-ink text-base transition-colors duration-200',
          'placeholder:text-muted disabled:bg-gray-100 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          errorMessage
            ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
            : 'border-gray-300 focus:ring-primary focus:border-transparent bg-white',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
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
