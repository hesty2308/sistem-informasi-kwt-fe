<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PageLinkSelect from '@/components/panel/settings/PageLinkSelect.vue'
import { Plus, ArrowUp, ArrowDown, Trash2, Eye, EyeOff } from 'lucide-vue-next'

const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})

// Button actions (add, move, show/hide, delete) do not fire input events, so report the change.
const emit = defineEmits(['mark-dirty'])

const isConfirmOpen = ref(false)
const deleteIndex = ref(null)

const addMenuItem = () => {
  if (!Array.isArray(form.value.nav_menus)) {
    form.value.nav_menus = []
  }
  const nextOrder = form.value.nav_menus.length + 1
  form.value.nav_menus.push({
    id: Date.now(),
    name: '',
    path: '',
    is_active: true,
    order: nextOrder,
  })
  emit('mark-dirty')
}

const confirmDelete = (index) => {
  deleteIndex.value = index
  isConfirmOpen.value = true
}

const handleDelete = () => {
  if (deleteIndex.value !== null && form.value.nav_menus) {
    form.value.nav_menus.splice(deleteIndex.value, 1)
    form.value.nav_menus.forEach((item, idx) => {
      item.order = idx + 1
    })
  }
  isConfirmOpen.value = false
  deleteIndex.value = null
  emit('mark-dirty')
}

const moveUp = (index) => {
  if (index <= 0 || !form.value.nav_menus) return
  const temp = form.value.nav_menus[index]
  form.value.nav_menus[index] = form.value.nav_menus[index - 1]
  form.value.nav_menus[index - 1] = temp
  form.value.nav_menus.forEach((item, idx) => {
    item.order = idx + 1
  })
  emit('mark-dirty')
}

const moveDown = (index) => {
  if (!form.value.nav_menus || index >= form.value.nav_menus.length - 1) return
  const temp = form.value.nav_menus[index]
  form.value.nav_menus[index] = form.value.nav_menus[index + 1]
  form.value.nav_menus[index + 1] = temp
  form.value.nav_menus.forEach((item, idx) => {
    item.order = idx + 1
  })
  emit('mark-dirty')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-ink mb-1">Menu Utama Website</h3>
        <p class="text-sm text-muted">
          Menu di bagian atas website (juga dipakai di "Tautan Cepat" bagian bawah). Atur nama, halaman tujuan,
          urutan dengan tombol panah, dan tampil/sembunyi.
        </p>
      </div>

      <BaseButton variant="secondary" size="sm" @click="addMenuItem">
        <Plus class="w-4 h-4 mr-1.5" />
        <span>Tambah Menu</span>
      </BaseButton>
    </div>

    <!-- Repeater List -->
    <div v-if="!form.nav_menus || form.nav_menus.length === 0" class="p-8 text-center bg-surface rounded-2xl border border-secondary/20">
      <p class="text-sm text-muted mb-3">Belum ada item menu yang terdaftar.</p>
      <BaseButton variant="primary" size="sm" @click="addMenuItem">
        <Plus class="w-4 h-4 mr-1.5" />
        <span>Tambah Menu Baru</span>
      </BaseButton>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(item, index) in form.nav_menus"
        :key="item.id || index"
        class="bg-surface/70 hover:bg-surface border border-secondary/20 rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        <!-- Reorder Handles -->
        <div class="flex items-center gap-1 text-muted shrink-0">
          <span class="w-6 text-xs font-bold text-center text-primary-dark">{{ index + 1 }}</span>
          <div class="flex flex-col gap-0.5">
            <button
              type="button"
              :disabled="index === 0"
              @click="moveUp(index)"
              title="Pindah ke Atas"
              aria-label="Pindah ke Atas"
              class="p-2 rounded hover:bg-white text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ArrowUp class="w-4 h-4" />
            </button>
            <button
              type="button"
              :disabled="index === form.nav_menus.length - 1"
              @click="moveDown(index)"
              title="Pindah ke Bawah"
              aria-label="Pindah ke Bawah"
              class="p-2 rounded hover:bg-white text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ArrowDown class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow w-full">
          <div class="space-y-2">
            <label :for="`nav-name-${index}`" class="block text-sm font-semibold text-ink">Nama Menu</label>
            <input
              :id="`nav-name-${index}`"
              v-model="item.name"
              type="text"
              placeholder="Contoh: Beranda"
              class="w-full min-h-11 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-base text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <PageLinkSelect v-model="item.path" label="Halaman Tujuan" />
        </div>

        <!-- Toggle Visibility & Delete -->
        <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            @click="item.is_active = !item.is_active; emit('mark-dirty')"
            :title="item.is_active ? 'Status: Tampil (Klik untuk sembunyikan)' : 'Status: Disembunyikan (Klik untuk tampilkan)'"
            class="flex items-center gap-1.5 min-h-11 px-3 py-2 rounded-xl text-sm font-semibold transition"
            :class="item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'"
          >
            <Eye v-if="item.is_active" class="w-3.5 h-3.5" />
            <EyeOff v-else class="w-3.5 h-3.5" />
            <span>{{ item.is_active ? 'Tampil' : 'Sembunyi' }}</span>
          </button>

          <button
            type="button"
            @click="confirmDelete(index)"
            title="Hapus Menu"
            aria-label="Hapus Menu"
            class="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-model="isConfirmOpen"
      title="Hapus Item Menu"
      message="Apakah Anda yakin ingin menghapus item menu ini dari navigasi website?"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      @confirm="handleDelete"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>
