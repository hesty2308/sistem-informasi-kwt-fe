<script setup>
import { ref, watch, computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Eye, EyeOff } from 'lucide-vue-next'

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
  currentUserId: {
    type: [Number, String],
    default: null,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const isEditing = computed(() => !!props.user?.id)
const isSelf = computed(() => isEditing.value && Number(props.user?.id) === Number(props.currentUserId))

const showPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
  is_active: true,
})

const roleOptions = [
  { value: 'admin', label: 'Admin (Pengelola Konten)' },
  { value: 'super_admin', label: 'Super Admin (Akses Penuh)' },
]

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (props.user) {
        form.value = {
          name: props.user.name || '',
          email: props.user.email || '',
          password: '',
          role: props.user.role || 'admin',
          is_active: props.user.is_active ?? true,
        }
      } else {
        form.value = {
          name: '',
          email: '',
          password: '',
          role: 'admin',
          is_active: true,
        }
      }
      showPassword.value = false
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEditing ? 'Ubah Data Pengelola' : 'Tambah Pengelola Baru'"
    max-width="max-w-lg"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="form.name"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap pengelola"
        :error="errors.name?.[0]"
        required
      />

      <BaseInput
        v-model="form.email"
        type="email"
        label="Alamat Email"
        placeholder="contoh@gmail.com"
        :error="errors.email?.[0]"
        required
      />

      <!-- Password initial for new user only -->
      <div v-if="!isEditing" class="space-y-1">
        <label class="block text-xs font-bold text-ink uppercase tracking-wider">
          Kata Sandi Awal <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="Minimal 8 karakter gabungan huruf dan angka"
            required
            class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white pr-12 transition"
            :class="{ 'border-red-400 focus:ring-red-400': errors.password?.[0] }"
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
        <p v-if="errors.password?.[0]" class="text-xs text-red-500 font-medium">
          {{ errors.password[0] }}
        </p>
        <p v-else class="text-xs text-muted">
          Wajib minimal 8 karakter dengan campuran huruf dan angka.
        </p>
      </div>

      <!-- Role Select -->
      <div>
        <BaseSelect
          v-model="form.role"
          label="Peran Akses"
          :options="roleOptions"
          :disabled="isSelf"
          :error="errors.role?.[0]"
          required
        />
        <p v-if="isSelf" class="text-xs text-amber-600 mt-1 font-medium">
          Peran akun sendiri tidak dapat diubah demi keamanan sistem.
        </p>
      </div>

      <!-- Status Toggle (only editing) -->
      <div v-if="isEditing" class="pt-2 border-t border-gray-100">
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="form.is_active"
            :disabled="isSelf"
            class="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0 border-gray-300 disabled:opacity-50"
          />
          <span class="text-sm font-semibold text-ink">
            Akun Aktif (Dapat masuk ke sistem)
          </span>
        </label>
        <p v-if="isSelf" class="text-xs text-amber-600 mt-1 font-medium">
          Akun sendiri tidak dapat dinonaktifkan.
        </p>
      </div>
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
          {{ isEditing ? 'Simpan Perubahan' : 'Tambah Pengelola' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
