<script setup>
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Eye, EyeOff, KeyRound } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const localError = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      password.value = ''
      passwordConfirmation.value = ''
      showPassword.value = false
      localError.value = ''
    }
  }
)

const handleSubmit = () => {
  localError.value = ''

  if (!password.value) {
    localError.value = 'Kata sandi baru wajib diisi.'
    return
  }

  if (password.value.length < 8) {
    localError.value = 'Kata sandi minimal 8 karakter.'
    return
  }

  if (!/[a-zA-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    localError.value = 'Kata sandi harus berupa gabungan huruf dan angka.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    localError.value = 'Konfirmasi kata sandi tidak cocok.'
    return
  }

  emit('submit', password.value)
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Atur Ulang Kata Sandi"
    max-width="max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="mb-4 p-3 bg-surface rounded-2xl border border-secondary/20 flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <KeyRound class="w-4 h-4" />
      </div>
      <div class="text-xs">
        <p class="font-bold text-ink">{{ user?.name }}</p>
        <p class="text-muted">{{ user?.email }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label class="block text-xs font-bold text-ink uppercase tracking-wider">
          Kata Sandi Baru <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Minimal 8 karakter (huruf & angka)"
            required
            class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white pr-12 transition"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1 cursor-pointer"
            :title="showPassword ? 'Sembunyikan' : 'Tampilkan'"
          >
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label class="block text-xs font-bold text-ink uppercase tracking-wider">
          Konfirmasi Kata Sandi Baru <span class="text-red-500">*</span>
        </label>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="passwordConfirmation"
          placeholder="Ulangi kata sandi baru"
          required
          class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white transition"
        />
      </div>

      <p v-if="localError || errors.password?.[0]" class="text-xs text-red-500 font-medium">
        {{ localError || errors.password?.[0] }}
      </p>
      <p v-else class="text-xs text-muted">
        Pengguna dapat langsung masuk menggunakan kata sandi baru ini.
      </p>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="isSaving"
          @click="handleClose"
        >
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          :loading="isSaving"
          @click="handleSubmit"
        >
          Simpan Kata Sandi
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
