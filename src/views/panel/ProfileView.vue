<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { updateProfileApi } from '@/services/auth'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/panel/StatusBadge.vue'
import ProfilePasswordCard from '@/components/panel/profile/ProfilePasswordCard.vue'
import { User } from 'lucide-vue-next'

useHead({
  title: 'Profil Saya - Panel Pengelola KWT Kartini',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})

const authStore = useAuthStore()
const toastStore = useToastStore()

// State Formulir Profil
const profileForm = reactive({
  name: '',
  email: '',
})
const profileErrors = reactive({
  name: '',
  email: '',
})
const isUpdatingProfile = ref(false)

// Populate profile from authStore
const populateProfile = () => {
  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
  }
}

// Handler Simpan Profil
const handleUpdateProfile = async () => {
  profileErrors.name = ''
  profileErrors.email = ''

  if (!profileForm.name.trim()) {
    profileErrors.name = 'Nama lengkap wajib diisi.'
    return
  }
  if (!profileForm.email.trim()) {
    profileErrors.email = 'Alamat email wajib diisi.'
    return
  }

  isUpdatingProfile.value = true

  try {
    const data = await updateProfileApi({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    })

    if (data.user) {
      authStore.setUser(data.user)
    }

    toastStore.success('Profil berhasil diperbarui.')
  } catch (err) {
    if (err.response?.data?.errors) {
      const errs = err.response.data.errors
      if (errs.name) profileErrors.name = errs.name[0]
      if (errs.email) profileErrors.email = errs.email[0]
    } else {
      toastStore.error(err.message || 'Gagal memperbarui profil.')
    }
  } finally {
    isUpdatingProfile.value = false
  }
}

onMounted(() => {
  populateProfile()
})
</script>

<template>
  <PanelLayout>
    <!-- Header Halaman & Breadcrumbs -->
    <PageHeader
      title="Profil Saya"
      subtitle="Kelola informasi akun pengelola dan keamanan kata sandi Anda"
      :breadcrumbs="[
        { label: 'Panel Pengelola', to: '/pengelola' },
        { label: 'Profil Saya' }
      ]"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- 1. FORMULIR INFORMASI PROFIL (7 Kolom) -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 rounded-xl bg-surface border border-secondary/30 flex items-center justify-center text-primary">
            <User class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-ink">
              Informasi Pengelola
            </h2>
            <p class="text-xs text-muted">
              Perbarui nama lengkap dan alamat email aktif akun Anda
            </p>
          </div>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="space-y-5">
          <!-- Role & Status Info Badges -->
          <div class="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-surface border border-secondary/20 mb-2">
            <div class="flex items-center gap-2 text-xs">
              <span class="text-muted font-semibold">Tingkat Peran:</span>
              <StatusBadge :status="authStore.user?.role || 'admin'" />
            </div>

            <span class="text-muted/40 hidden sm:inline">|</span>

            <div class="flex items-center gap-2 text-xs">
              <span class="text-muted font-semibold">Status Akun:</span>
              <StatusBadge status="active" label="Aktif" />
            </div>
          </div>

          <!-- Nama Lengkap -->
          <BaseInput
            v-model="profileForm.name"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap Anda"
            :error="profileErrors.name"
            required
          />

          <!-- Alamat Email -->
          <BaseInput
            v-model="profileForm.email"
            type="email"
            label="Alamat Email"
            placeholder="contoh@gmail.com"
            :error="profileErrors.email"
            required
          />

          <!-- Tombol Simpan Profil -->
          <div class="pt-4 flex justify-end">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="isUpdatingProfile"
              class="w-full sm:w-auto px-6 cursor-pointer"
            >
              <span>Simpan Perubahan Profil</span>
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- 2. FORMULIR UBAH KATA SANDI (5 Kolom) -->
      <ProfilePasswordCard class="lg:col-span-5" />
    </div>
  </PanelLayout>
</template>
