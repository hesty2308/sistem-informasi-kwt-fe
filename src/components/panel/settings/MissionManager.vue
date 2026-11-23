<script setup>
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import MissionItem from '@/components/panel/settings/MissionItem.vue'
import {
  getSuperMissions,
  createSuperMission,
  updateSuperMission,
  reorderSuperMissions,
  deleteSuperMission,
} from '@/services/panelApi'
import { Plus, RefreshCw } from 'lucide-vue-next'

const toast = useToastStore()

const missions = ref([])
const isLoading = ref(true)
const loadError = ref('')
const busyId = ref(null)
const rowError = ref({ id: null, message: '' })

const newText = ref('')
const newError = ref('')
const isAdding = ref(false)

const isConfirmOpen = ref(false)
const missionToDelete = ref(null)
const isDeleting = ref(false)

// 422/429 are rejected as plain objects by the http interceptor; others are axios errors.
const errorMessage = (err, fallback) => {
  if (err?.status === 422 || err?.status === 429) return err.message
  return err?.response?.data?.message || fallback
}

const loadMissions = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    missions.value = (await getSuperMissions()) || []
  } catch (err) {
    loadError.value = errorMessage(err, 'Gagal memuat daftar misi.')
  } finally {
    isLoading.value = false
  }
}

const addMission = async () => {
  newError.value = ''
  isAdding.value = true
  try {
    const res = await createSuperMission({ text: newText.value })
    missions.value.push(res.data)
    newText.value = ''
    toast.success(res.message || 'Butir misi berhasil ditambahkan.')
  } catch (err) {
    newError.value = err?.errors?.text?.[0] || ''
    toast.error(errorMessage(err, 'Gagal menambahkan butir misi.'))
  } finally {
    isAdding.value = false
  }
}

const replaceMission = (updated) => {
  const idx = missions.value.findIndex((m) => m.id === updated.id)
  if (idx !== -1) missions.value[idx] = updated
}

const saveText = async (mission, text, done) => {
  busyId.value = mission.id
  rowError.value = { id: null, message: '' }
  try {
    const res = await updateSuperMission(mission.id, { text })
    replaceMission(res.data)
    done()
    toast.success(res.message || 'Butir misi berhasil diperbarui.')
  } catch (err) {
    rowError.value = { id: mission.id, message: err?.errors?.text?.[0] || '' }
    toast.error(errorMessage(err, 'Gagal memperbarui butir misi.'))
  } finally {
    busyId.value = null
  }
}

const toggleActive = async (mission) => {
  busyId.value = mission.id
  try {
    const res = await updateSuperMission(mission.id, { is_active: !mission.is_active })
    replaceMission(res.data)
    toast.success(res.data.is_active ? 'Misi ditampilkan di halaman publik.' : 'Misi disembunyikan dari halaman publik.')
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal mengubah status misi.'))
  } finally {
    busyId.value = null
  }
}

const moveMission = async (index, direction) => {
  const target = index + direction
  if (target < 0 || target >= missions.value.length) return

  const previous = [...missions.value]
  const reordered = [...missions.value]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  missions.value = reordered.map((m, i) => ({ ...m, sort_order: i + 1 }))

  busyId.value = previous[index].id
  try {
    await reorderSuperMissions(missions.value.map((m) => ({ id: m.id, sort_order: m.sort_order })))
  } catch (err) {
    missions.value = previous
    toast.error(errorMessage(err, 'Gagal memperbarui urutan misi.'))
  } finally {
    busyId.value = null
  }
}

const askDelete = (mission) => {
  missionToDelete.value = mission
  isConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!missionToDelete.value) return
  isDeleting.value = true
  try {
    const res = await deleteSuperMission(missionToDelete.value.id)
    missions.value = missions.value.filter((m) => m.id !== missionToDelete.value.id)
    toast.success(res.message || 'Butir misi berhasil dihapus.')
    isConfirmOpen.value = false
    missionToDelete.value = null
  } catch (err) {
    toast.error(errorMessage(err, 'Gagal menghapus butir misi.'))
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadMissions)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="text-base font-bold text-ink">Butir Misi Organisasi</h4>
      <p class="text-sm text-muted">
        Perubahan di bagian ini langsung tersimpan dan tampil di halaman Tentang serta Visi &amp; Misi.
      </p>
    </div>

    <div v-if="isLoading" class="space-y-3" aria-busy="true" aria-label="Memuat daftar misi">
      <div v-for="n in 3" :key="n" class="h-16 rounded-2xl bg-white border border-secondary/20 animate-pulse" />
    </div>

    <div v-else-if="loadError" class="p-4 rounded-2xl bg-white border border-red-200 text-center space-y-3">
      <p class="text-base text-red-700">{{ loadError }}</p>
      <BaseButton variant="outline" @click="loadMissions">
        <RefreshCw class="w-4 h-4" />
        Coba Lagi
      </BaseButton>
    </div>

    <template v-else>
      <p
        v-if="missions.length === 0"
        class="p-4 rounded-2xl bg-white border border-dashed border-secondary/40 text-base text-muted text-center"
        data-testid="mission-manager-empty"
      >
        Belum ada butir misi. Tambahkan misi pertama di bawah ini.
      </p>

      <ol v-else class="space-y-3">
        <MissionItem
          v-for="(mission, idx) in missions"
          :key="mission.id"
          :mission="mission"
          :index="idx"
          :total="missions.length"
          :busy="busyId === mission.id"
          :error="rowError.id === mission.id ? rowError.message : ''"
          @save="(text, done) => saveText(mission, text, done)"
          @toggle="toggleActive(mission)"
          @move="(dir) => moveMission(idx, dir)"
          @delete="askDelete(mission)"
        />
      </ol>

      <form class="p-4 rounded-2xl bg-white border border-secondary/30 space-y-3" @submit.prevent="addMission">
        <BaseTextarea
          v-model="newText"
          label="Tambah Butir Misi Baru"
          placeholder="Contoh: Melatih kewirausahaan wanita tani"
          :rows="3"
          :error-message="newError"
        />
        <div class="flex justify-end">
          <BaseButton type="submit" :loading="isAdding" :disabled="!newText.trim()">
            <Plus class="w-4 h-4" />
            Tambah Misi
          </BaseButton>
        </div>
      </form>
    </template>

    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Hapus Butir Misi"
      message="Apakah Anda yakin ingin menghapus butir misi ini? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>
