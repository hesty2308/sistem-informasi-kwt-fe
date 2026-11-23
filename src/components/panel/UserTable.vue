<script setup>
import { useAuthStore } from '@/stores/auth'
import EmptyState from '@/components/ui/EmptyState.vue'
import { PenLine, KeyRound, Trash2, Power } from 'lucide-vue-next'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

defineProps({
  users: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'reset', 'toggle', 'delete'])

const authStore = useAuthStore()

const formatDate = (dateStr) => {
  if (!dateStr) return 'Belum pernah'
  return dayjs(dateStr).format('D MMMM YYYY, HH:mm')
}
</script>

<template>
  <div class="bg-white rounded-3xl shadow-card border border-secondary/20 overflow-hidden">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 text-center text-muted">
      <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <p class="text-sm">Memuat data pengelola...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="p-12">
      <EmptyState
        title="Tidak Ada Pengelola"
        message="Tidak ditemukan pengelola yang cocok dengan kriteria pencarian Anda."
      />
    </div>

    <!-- Desktop & Mobile Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface/80 border-b border-gray-100 text-xs font-bold text-muted uppercase tracking-wider">
            <th class="py-4 px-6">Nama Pengelola</th>
            <th class="py-4 px-6">Peran</th>
            <th class="py-4 px-6">Status</th>
            <th class="py-4 px-6">Login Terakhir</th>
            <th class="py-4 px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-surface/40 transition-colors"
          >
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-ink">{{ user.name }}</span>
                    <span
                      v-if="user.id === authStore.user?.id"
                      class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-accent/30 text-primary-dark"
                    >
                      Anda
                    </span>
                  </div>
                  <span class="text-xs text-muted block">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold"
                :class="user.role === 'super_admin' ? 'bg-blue-100 text-brand-blue' : 'bg-green-100 text-primary-dark'"
              >
                {{ user.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
              </span>
            </td>
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                :class="user.is_active ? 'bg-green-100 text-primary-dark' : 'bg-gray-100 text-muted'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="user.is_active ? 'bg-primary' : 'bg-gray-400'" />
                {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="py-4 px-6 text-xs text-muted">
              {{ formatDate(user.last_login_at) }}
            </td>
            <td class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  @click="emit('edit', user)"
                  class="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface transition cursor-pointer"
                  title="Ubah Data Pengelola"
                >
                  <PenLine class="w-4 h-4" />
                </button>

                <button
                  type="button"
                  @click="emit('reset', user)"
                  class="p-2 rounded-lg text-muted hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                  title="Atur Ulang Kata Sandi"
                >
                  <KeyRound class="w-4 h-4" />
                </button>

                <button
                  type="button"
                  :disabled="user.id === authStore.user?.id"
                  @click="emit('toggle', user)"
                  class="p-2 rounded-lg transition"
                  :class="user.id === authStore.user?.id ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-muted hover:text-primary hover:bg-surface cursor-pointer'"
                  :title="user.id === authStore.user?.id ? 'Tidak dapat menonaktifkan akun sendiri' : (user.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun')"
                >
                  <Power class="w-4 h-4" />
                </button>

                <button
                  type="button"
                  :disabled="user.id === authStore.user?.id"
                  @click="emit('delete', user)"
                  class="p-2 rounded-lg transition"
                  :class="user.id === authStore.user?.id ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-muted hover:text-red-600 hover:bg-red-50 cursor-pointer'"
                  :title="user.id === authStore.user?.id ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengelola'"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
