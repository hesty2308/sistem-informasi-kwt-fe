<script setup>
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BoardMemberItem from '@/components/panel/board-member/BoardMemberItem.vue'
import BoardMemberFormDialog from '@/components/panel/board-member/BoardMemberFormDialog.vue'
import {
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  reorderBoardMembers,
  deleteBoardMember,
} from '@/services/panelApi'
import { Plus, RefreshCw } from 'lucide-vue-next'

const toast = useToastStore()

const members = ref([])
const isLoading = ref(true)
const loadError = ref('')
const busyId = ref(null)

const isFormOpen = ref(false)
const editingMember = ref(null)
const formErrors = ref({})
const isSaving = ref(false)

const isConfirmOpen = ref(false)
const memberToDelete = ref(null)
const isDeleting = ref(false)

// 422/429 are rejected as plain objects by the http interceptor; others are axios errors.
const errorMessage = (err, fallback) => {
  if (err?.status === 422 || err?.status === 429) return err.message
  return err?.response?.data?.message || fallback
}

const loadMembers = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    members.value = (await getBoardMembers()) || []
  } catch (err) {
    loadError.value = errorMessage(err, 'Gagal memuat daftar pengurus.')
  } finally {
    isLoading.value = false
  }
}

const replaceMember = (updated) => {
  const idx = members.value.findIndex((m) => m.id === updated.id)
  if (idx !== -1) members.value[idx] = updated
}

const openForm = (member = null) => {
  editingMember.value = member
  formErrors.value = {}
  isFormOpen.value = true
}

const submitForm = async (formData) => {
  isSaving.value = true
  formErrors.value = {}
  try {
    const res = editingMember.value
      ? await updateBoardMember(editingMember.value.id, formData)
      : await createBoardMember(formData)

    if (editingMember.value) {
      replaceMember(res.data)
    } else {
      members.value.push(res.data)
    }
    isFormOpen.value = false
    toast.success(res.message || 'Data pengurus berhasil disimpan.')
  } catch (err) {
    formErrors.value = err?.errors || {}
    toast.error(errorMessage(err, 'Gagal menyimpan data pengurus.'))
  } finally {
    isSaving.value = false
  }
}

const toggleActive = async (member) => {
  busyId.value = member.id
  try {
    const res = await updateBoardMember(member.id, { is_active: !member.is_active })
    replaceMember(res.data)
    toast.success(res.data.is_active ? 'Pengurus ditampilkan di halaman publik.' : 'Pengurus disembunyikan dari halaman publik.')
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal mengubah status pengurus.'))
  } finally {
    busyId.value = null
  }
}

const moveMember = async (index, direction) => {
  const target = index + direction
  if (target < 0 || target >= members.value.length) return

  const previous = [...members.value]
  const reordered = [...members.value]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  members.value = reordered.map((m, i) => ({ ...m, sort_order: i + 1 }))

  busyId.value = previous[index].id
  try {
    await reorderBoardMembers(members.value.map((m) => ({ id: m.id, sort_order: m.sort_order })))
  } catch (err) {
    members.value = previous
    toast.error(errorMessage(err, 'Gagal memperbarui urutan pengurus.'))
  } finally {
    busyId.value = null
  }
}

const askDelete = (member) => {
  memberToDelete.value = member
  isConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!memberToDelete.value) return
  isDeleting.value = true
  try {
    const res = await deleteBoardMember(memberToDelete.value.id)
    members.value = members.value.filter((m) => m.id !== memberToDelete.value.id)
    toast.success(res.message || 'Data pengurus berhasil dihapus.')
    isConfirmOpen.value = false
    memberToDelete.value = null
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal menghapus data pengurus.'))
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadMembers)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <h4 class="text-base font-bold text-ink">Daftar Pengurus</h4>
        <p class="text-sm text-muted">
          Perubahan di bagian ini langsung tersimpan. Urutan di sini menjadi urutan kartu di halaman publik.
        </p>
      </div>
      <BaseButton class="shrink-0" @click="openForm()">
        <Plus class="w-4 h-4" />
        Tambah Pengurus
      </BaseButton>
    </div>

    <div v-if="isLoading" class="space-y-3" aria-busy="true" aria-label="Memuat daftar pengurus">
      <div v-for="n in 3" :key="n" class="h-20 rounded-2xl bg-white border border-secondary/20 animate-pulse" />
    </div>

    <div v-else-if="loadError" class="p-4 rounded-2xl bg-white border border-red-200 text-center space-y-3">
      <p class="text-base text-red-700">{{ loadError }}</p>
      <BaseButton variant="outline" @click="loadMembers">
        <RefreshCw class="w-4 h-4" />
        Coba Lagi
      </BaseButton>
    </div>

    <p
      v-else-if="members.length === 0"
      class="p-4 rounded-2xl bg-white border border-dashed border-secondary/40 text-base text-muted text-center"
      data-testid="board-member-manager-empty"
    >
      Belum ada data pengurus. Klik "Tambah Pengurus" untuk menambahkan.
    </p>

    <ol v-else class="space-y-3">
      <BoardMemberItem
        v-for="(member, idx) in members"
        :key="member.id"
        :member="member"
        :index="idx"
        :total="members.length"
        :busy="busyId === member.id"
        @edit="openForm(member)"
        @toggle="toggleActive(member)"
        @move="(dir) => moveMember(idx, dir)"
        @delete="askDelete(member)"
      />
    </ol>

    <BoardMemberFormDialog
      v-model="isFormOpen"
      :member="editingMember"
      :saving="isSaving"
      :errors="formErrors"
      @submit="submitForm"
    />

    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Hapus Data Pengurus"
      message="Apakah Anda yakin ingin menghapus pengurus ini beserta fotonya? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>
