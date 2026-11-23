<script setup>
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import MilestoneItem from '@/components/panel/settings/MilestoneItem.vue'
import {
  getSuperHistoryMilestones,
  createSuperHistoryMilestone,
  updateSuperHistoryMilestone,
  deleteSuperHistoryMilestone,
} from '@/services/panelApi'
import { Plus, RefreshCw } from 'lucide-vue-next'

const toast = useToastStore()

const milestones = ref([])
const isLoading = ref(true)
const loadError = ref('')
const busyId = ref(null)
const rowErrors = ref({ id: null, errors: {} })

const emptyDraft = () => ({ year: '', title: '', description: '' })
const newDraft = ref(emptyDraft())
const newErrors = ref({})
const isAdding = ref(false)

const isConfirmOpen = ref(false)
const milestoneToDelete = ref(null)
const isDeleting = ref(false)

// 422/429 are rejected as plain objects by the http interceptor; others are axios errors.
const errorMessage = (err, fallback) => {
  if (err?.status === 422 || err?.status === 429) return err.message
  return err?.response?.data?.message || fallback
}

// Keep the same chronological order as the public timeline.
const sortList = (list) => [...list].sort((a, b) => a.year - b.year || a.id - b.id)

const loadMilestones = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    milestones.value = (await getSuperHistoryMilestones()) || []
  } catch (err) {
    loadError.value = errorMessage(err, 'Gagal memuat linimasa sejarah.')
  } finally {
    isLoading.value = false
  }
}

const addMilestone = async () => {
  newErrors.value = {}
  isAdding.value = true
  try {
    const res = await createSuperHistoryMilestone({ ...newDraft.value, year: Number(newDraft.value.year) })
    milestones.value = sortList([...milestones.value, res.data])
    newDraft.value = emptyDraft()
    toast.success(res.message || 'Butir linimasa berhasil ditambahkan.')
  } catch (err) {
    newErrors.value = err?.errors || {}
    toast.error(errorMessage(err, 'Gagal menambahkan butir linimasa.'))
  } finally {
    isAdding.value = false
  }
}

const replaceMilestone = (updated) => {
  milestones.value = sortList(milestones.value.map((m) => (m.id === updated.id ? updated : m)))
}

const saveMilestone = async (milestone, data, done) => {
  busyId.value = milestone.id
  rowErrors.value = { id: null, errors: {} }
  try {
    const res = await updateSuperHistoryMilestone(milestone.id, data)
    replaceMilestone(res.data)
    done()
    toast.success(res.message || 'Butir linimasa berhasil diperbarui.')
  } catch (err) {
    rowErrors.value = { id: milestone.id, errors: err?.errors || {} }
    toast.error(errorMessage(err, 'Gagal memperbarui butir linimasa.'))
  } finally {
    busyId.value = null
  }
}

const toggleActive = async (milestone) => {
  busyId.value = milestone.id
  try {
    const res = await updateSuperHistoryMilestone(milestone.id, { is_active: !milestone.is_active })
    replaceMilestone(res.data)
    toast.success(res.data.is_active ? 'Butir ditampilkan di halaman publik.' : 'Butir disembunyikan dari halaman publik.')
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal mengubah status butir linimasa.'))
  } finally {
    busyId.value = null
  }
}

const askDelete = (milestone) => {
  milestoneToDelete.value = milestone
  isConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!milestoneToDelete.value) return
  isDeleting.value = true
  try {
    const res = await deleteSuperHistoryMilestone(milestoneToDelete.value.id)
    milestones.value = milestones.value.filter((m) => m.id !== milestoneToDelete.value.id)
    toast.success(res.message || 'Butir linimasa berhasil dihapus.')
    isConfirmOpen.value = false
    milestoneToDelete.value = null
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal menghapus butir linimasa.'))
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadMilestones)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="text-base font-bold text-ink">Linimasa Sejarah</h4>
      <p class="text-sm text-muted">
        Butir linimasa langsung tersimpan dan diurutkan otomatis berdasarkan tahun.
      </p>
    </div>

    <div v-if="isLoading" class="space-y-3" aria-busy="true" aria-label="Memuat linimasa">
      <div v-for="n in 3" :key="n" class="h-16 rounded-2xl bg-white border border-secondary/20 animate-pulse" />
    </div>

    <div v-else-if="loadError" class="p-4 rounded-2xl bg-white border border-red-200 text-center space-y-3">
      <p class="text-base text-red-700">{{ loadError }}</p>
      <BaseButton variant="outline" @click="loadMilestones">
        <RefreshCw class="w-4 h-4" />
        Coba Lagi
      </BaseButton>
    </div>

    <template v-else>
      <p
        v-if="milestones.length === 0"
        class="p-4 rounded-2xl bg-white border border-dashed border-secondary/40 text-base text-muted text-center"
        data-testid="milestone-manager-empty"
      >
        Belum ada butir linimasa. Tambahkan peristiwa pertama di bawah ini.
      </p>

      <ol v-else class="space-y-3">
        <MilestoneItem
          v-for="item in milestones"
          :key="item.id"
          :milestone="item"
          :busy="busyId === item.id"
          :errors="rowErrors.id === item.id ? rowErrors.errors : {}"
          @save="(data, done) => saveMilestone(item, data, done)"
          @toggle="toggleActive(item)"
          @delete="askDelete(item)"
        />
      </ol>

      <form class="p-4 rounded-2xl bg-white border border-secondary/30 space-y-3" @submit.prevent="addMilestone">
        <span class="block text-sm font-bold text-primary">Tambah Butir Linimasa</span>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <BaseInput v-model="newDraft.year" type="number" label="Tahun" placeholder="2018" :error-message="newErrors.year?.[0]" />
          <div class="sm:col-span-3">
            <BaseInput
              v-model="newDraft.title"
              label="Judul Peristiwa"
              placeholder="Contoh: Paguyuban resmi berdiri"
              :error-message="newErrors.title?.[0]"
            />
          </div>
        </div>
        <BaseTextarea
          v-model="newDraft.description"
          label="Keterangan (opsional)"
          :rows="2"
          :error-message="newErrors.description?.[0]"
        />
        <div class="flex justify-end">
          <BaseButton type="submit" :loading="isAdding" :disabled="!String(newDraft.year).trim() || !newDraft.title.trim()">
            <Plus class="w-4 h-4" />
            Tambah Butir
          </BaseButton>
        </div>
      </form>
    </template>

    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Hapus Butir Linimasa"
      message="Apakah Anda yakin ingin menghapus butir linimasa ini? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>
