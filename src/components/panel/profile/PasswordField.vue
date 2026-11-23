<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const model = defineModel({ type: String, default: '' })

defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const isVisible = ref(false)
</script>

<template>
  <!-- Password input with a show/hide toggle -->
  <div>
    <div class="flex items-center justify-between mb-1">
      <label class="block text-xs sm:text-sm font-semibold text-ink">
        {{ label }} <span class="text-red-500">*</span>
      </label>
      <button
        type="button"
        @click="isVisible = !isVisible"
        class="text-xs text-muted hover:text-primary transition inline-flex items-center gap-1 cursor-pointer"
      >
        <component :is="isVisible ? EyeOff : Eye" class="w-3.5 h-3.5" />
        <span>{{ isVisible ? 'Sembunyikan' : 'Lihat' }}</span>
      </button>
    </div>
    <input
      v-model="model"
      :type="isVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      class="w-full px-4 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
    />
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>
