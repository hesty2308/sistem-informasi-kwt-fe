<script setup>
import { ref, reactive } from 'vue'
import { useToastStore } from '@/stores/toast'
import { updatePasswordApi } from '@/services/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import PasswordField from '@/components/panel/profile/PasswordField.vue'
import { Lock } from 'lucide-vue-next'

const toastStore = useToastStore()

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordErrors = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const isUpdatingPassword = ref(false)

const handleUpdatePassword = async () => {
  passwordErrors.current_password = ''
  passwordErrors.password = ''
  passwordErrors.password_confirmation = ''

  if (!passwordForm.current_password) {
    passwordErrors.current_password = 'Kata sandi lama wajib diisi.'
    return
  }
  if (!passwordForm.password) {
    passwordErrors.password = 'Kata sandi baru wajib diisi.'
    return
  }
  if (passwordForm.password.length < 8) {
    passwordErrors.password = 'Kata sandi baru minimal 8 karakter.'
    return
  }
  if (!/[A-Za-z]/.test(passwordForm.password) || !/[0-9]/.test(passwordForm.password)) {
    passwordErrors.password = 'Kata sandi baru harus berupa campuran huruf dan angka.'
    return
  }
  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Konfirmasi kata sandi baru tidak cocok.'
    return
  }

  isUpdatingPassword.value = true

  try {
    await updatePasswordApi({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })

    toastStore.success('Kata sandi berhasil diperbarui.')

    // Reset password fields
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  } catch (err) {
    if (err.response?.data?.errors) {
      const errs = err.response.data.errors
      if (errs.current_password) passwordErrors.current_password = errs.current_password[0]
      if (errs.password) passwordErrors.password = errs.password[0]
      if (errs.password_confirmation) passwordErrors.password_confirmation = errs.password_confirmation[0]
    } else {
      toastStore.error(err.message || 'Gagal memperbarui kata sandi.')
    }
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>

<template>
  <!-- Change password form -->
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
        <Lock class="w-5 h-5" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-ink">
          Ubah Kata Sandi
        </h2>
        <p class="text-xs text-muted">
          Gunakan kata sandi yang kuat dan aman
        </p>
      </div>
    </div>

    <form @submit.prevent="handleUpdatePassword" class="space-y-4">
      <PasswordField
        v-model="passwordForm.current_password"
        label="Kata Sandi Lama"
        placeholder="Masukkan kata sandi lama"
        :error="passwordErrors.current_password"
      />

      <PasswordField
        v-model="passwordForm.password"
        label="Kata Sandi Baru"
        placeholder="Minimal 8 karakter campuran huruf & angka"
        :error="passwordErrors.password"
      />

      <PasswordField
        v-model="passwordForm.password_confirmation"
        label="Ulangi Kata Sandi Baru"
        placeholder="Ulangi kata sandi baru"
        :error="passwordErrors.password_confirmation"
      />

      <!-- Tombol Perbarui Kata Sandi -->
      <div class="pt-4 flex justify-end">
        <BaseButton
          type="submit"
          variant="secondary"
          :loading="isUpdatingPassword"
          class="w-full cursor-pointer"
        >
          <span>Perbarui Kata Sandi</span>
        </BaseButton>
      </div>
    </form>
  </div>
</template>
