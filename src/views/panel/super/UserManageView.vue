<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import UserTable from '@/components/panel/UserTable.vue'
import UserFormModal from '@/components/panel/UserFormModal.vue'
import UserResetPasswordModal from '@/components/panel/UserResetPasswordModal.vue'
import UserFilterBar from '@/components/panel/UserFilterBar.vue'
import {
  getSuperUsers,
  createSuperUser,
  updateSuperUser,
  toggleSuperUserStatus,
  resetSuperUserPassword,
  deleteSuperUser,
} from '@/services/panelApi'
import { Plus } from 'lucide-vue-next'

useHead({
  title: 'Kelola Pengelola - Panel Super Admin KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const authStore = useAuthStore()
const toast = useToastStore()

const users = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')

const isFormModalOpen = ref(false)
const selectedUser = ref(null)
const formErrors = ref({})

const isResetModalOpen = ref(false)
const resetErrors = ref({})

const isConfirmDeleteOpen = ref(false)
const userToDelete = ref(null)

const loadUsers = async () => {
  isLoading.value = true
  try {
    const data = await getSuperUsers()
    users.value = data || []
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat daftar pengelola.')
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesRole = !roleFilter.value || user.role === roleFilter.value

    return matchesSearch && matchesRole
  })
})

const handleAddUser = () => {
  selectedUser.value = null
  formErrors.value = {}
  isFormModalOpen.value = true
}

const handleEditUser = (user) => {
  selectedUser.value = user
  formErrors.value = {}
  isFormModalOpen.value = true
}

const handleOpenReset = (user) => {
  selectedUser.value = user
  resetErrors.value = {}
  isResetModalOpen.value = true
}

const handleOpenDelete = (user) => {
  userToDelete.value = user
  isConfirmDeleteOpen.value = true
}

const handleSaveUser = async (formData) => {
  isSaving.value = true
  formErrors.value = {}

  try {
    if (selectedUser.value?.id) {
      await updateSuperUser(selectedUser.value.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      })
      toast.success('Data pengelola berhasil diperbarui.')
    } else {
      await createSuperUser(formData)
      toast.success('Pengelola baru berhasil ditambahkan.')
    }

    isFormModalOpen.value = false
    await loadUsers()
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      formErrors.value = error.response.data.errors
    } else {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data pengelola.')
    }
  } finally {
    isSaving.value = false
  }
}

const handleToggleStatus = async (user) => {
  try {
    await toggleSuperUserStatus(user.id)
    toast.success(`Akun ${user.name} berhasil ${user.is_active ? 'dinonaktifkan' : 'diaktifkan'}.`)
    await loadUsers()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal mengubah status pengelola.')
  }
}

const handleResetPassword = async (newPassword) => {
  isSaving.value = true
  resetErrors.value = {}

  try {
    await resetSuperUserPassword(selectedUser.value.id, newPassword)
    toast.success('Kata sandi pengelola berhasil diatur ulang.')
    isResetModalOpen.value = false
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      resetErrors.value = error.response.data.errors
    } else {
      toast.error(error.response?.data?.message || 'Gagal mengatur ulang kata sandi.')
    }
  } finally {
    isSaving.value = false
  }
}

const handleDeleteUser = async () => {
  if (!userToDelete.value) return
  isSaving.value = true

  try {
    await deleteSuperUser(userToDelete.value.id)
    toast.success('Pengelola berhasil dihapus.')
    isConfirmDeleteOpen.value = false
    userToDelete.value = null
    await loadUsers()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus pengelola.')
  } finally {
    isSaving.value = false
  }
}

const deleteMessage = computed(() => {
  return `Yakin ingin menghapus akun pengelola ${userToDelete.value?.name || ''} (${userToDelete.value?.email || ''})? Tindakan ini tidak dapat dibatalkan.`
})

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Kelola Pengelola"
      subtitle="Manajemen akun admin, penetapan peran, dan status aktivasi"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Kelola Pengelola' }]"
    >
      <template #actions>
        <BaseButton variant="primary" size="md" @click="handleAddUser">
          <Plus class="w-4 h-4 mr-1.5" />
          <span>Tambah Pengelola</span>
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Filter Bar -->
    <UserFilterBar v-model:search="searchQuery" v-model:role="roleFilter" />

    <!-- Table of Users -->
    <UserTable
      :users="filteredUsers"
      :is-loading="isLoading"
      @edit="handleEditUser"
      @reset="handleOpenReset"
      @toggle="handleToggleStatus"
      @delete="handleOpenDelete"
    />

    <!-- Modals -->
    <UserFormModal
      v-model="isFormModalOpen"
      :user="selectedUser"
      :is-saving="isSaving"
      :current-user-id="authStore.user?.id"
      :errors="formErrors"
      @submit="handleSaveUser"
    />

    <UserResetPasswordModal
      v-model="isResetModalOpen"
      :user="selectedUser"
      :is-saving="isSaving"
      :errors="resetErrors"
      @submit="handleResetPassword"
    />

    <ConfirmDialog
      v-model="isConfirmDeleteOpen"
      title="Hapus Pengelola"
      :message="deleteMessage"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      @confirm="handleDeleteUser"
    />
  </PanelLayout>
</template>
