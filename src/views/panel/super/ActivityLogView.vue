<script setup>
import { ref, watch, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useToastStore } from '@/stores/toast'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getSuperActivityLogs, getSuperUsers } from '@/services/panelApi'
import { formatActionName, getActionBadgeClass } from '@/utils/actionFormatter'
import { Search, RotateCcw } from 'lucide-vue-next'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

useHead({
  title: 'Riwayat Aktivitas - Panel Super Admin KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const toast = useToastStore()

const logs = ref([])
const users = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

// Filters
const filterUser = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const searchQuery = ref('')

const loadUsersList = async () => {
  try {
    const data = await getSuperUsers()
    users.value = [
      { value: '', label: 'Semua Pengguna' },
      ...(data || []).map((u) => ({
        value: String(u.id),
        label: `${u.name} (${u.role === 'super_admin' ? 'Super Admin' : 'Admin'})`,
      })),
    ]
  } catch {
    // Silent fallback
  }
}

const loadLogs = async (page = 1) => {
  isLoading.value = true
  currentPage.value = page

  try {
    const params = {
      page,
      user_id: filterUser.value || undefined,
      start_date: filterStartDate.value || undefined,
      end_date: filterEndDate.value || undefined,
      search: searchQuery.value ? searchQuery.value.trim() : undefined,
    }

    const res = await getSuperActivityLogs(params)
    logs.value = res.data || []
    totalPages.value = res.meta?.last_page || 1
    totalItems.value = res.meta?.total || 0
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat log aktivitas.')
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  filterUser.value = ''
  filterStartDate.value = ''
  filterEndDate.value = ''
  searchQuery.value = ''
  loadLogs(1)
}

let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadLogs(1), 400)
})

watch([filterUser, filterStartDate, filterEndDate], () => {
  loadLogs(1)
})

const formatTime = (ts) => {
  if (!ts) return '-'
  return dayjs(ts).format('D MMMM YYYY, HH:mm:ss')
}

onMounted(() => {
  loadUsersList()
  loadLogs(1)
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Riwayat Aktivitas Sistem"
      subtitle="Catatan audit log aktivitas pengelola (read-only, tidak dapat dihapus)"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Riwayat Aktivitas' }]"
    />

    <!-- Filter Card -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-secondary/20 mb-6 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Search Keyword -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari aksi, deskripsi, IP..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search class="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <!-- Filter User -->
        <BaseSelect
          v-model="filterUser"
          :options="users"
          class="text-xs sm:text-sm"
        />

        <!-- Date Range Start -->
        <div class="relative">
          <input
            v-model="filterStartDate"
            type="date"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            title="Tanggal Mulai"
          />
        </div>

        <!-- Date Range End -->
        <div class="flex items-center gap-2">
          <input
            v-model="filterEndDate"
            type="date"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            title="Tanggal Selesai"
          />
          <button
            type="button"
            @click="resetFilters"
            class="p-2 rounded-xl border border-gray-200 text-muted hover:text-ink hover:bg-surface transition shrink-0 cursor-pointer"
            title="Reset Filter"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Table Read-Only -->
    <div class="bg-white rounded-3xl shadow-card border border-secondary/20 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-muted">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p class="text-sm">Memuat riwayat aktivitas...</p>
      </div>

      <div v-else-if="logs.length === 0" class="p-12">
        <EmptyState
          title="Tidak Ada Catatan Aktivitas"
          message="Tidak ditemukan riwayat log yang sesuai dengan filter pencarian Anda."
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface/80 border-b border-gray-100 text-xs font-bold text-muted uppercase tracking-wider">
              <th class="py-4 px-6">Waktu</th>
              <th class="py-4 px-6">Pengguna</th>
              <th class="py-4 px-6">Aksi</th>
              <th class="py-4 px-6">Keterangan</th>
              <th class="py-4 px-6 text-right">Alamat IP</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr
              v-for="item in logs"
              :key="item.id"
              class="hover:bg-surface/40 transition-colors"
            >
              <td class="py-4 px-6 text-xs text-muted whitespace-nowrap">
                {{ formatTime(item.created_at) }}
              </td>
              <td class="py-4 px-6 whitespace-nowrap">
                <div v-if="item.user" class="flex items-center gap-2">
                  <span class="font-bold text-ink text-xs sm:text-sm">{{ item.user.name }}</span>
                  <span
                    class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    :class="item.user.role === 'super_admin' ? 'bg-blue-50 text-brand-blue' : 'bg-green-50 text-primary-dark'"
                  >
                    {{ item.user.role === 'super_admin' ? 'Super' : 'Admin' }}
                  </span>
                </div>
                <span v-else class="text-xs text-muted italic">Sistem</span>
              </td>
              <td class="py-4 px-6 whitespace-nowrap">
                <span
                  class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                  :class="getActionBadgeClass(item.action)"
                >
                  {{ formatActionName(item.action) }}
                </span>
              </td>
              <td class="py-4 px-6 text-xs sm:text-sm text-ink max-w-md leading-relaxed">
                {{ item.description }}
              </td>
              <td class="py-4 px-6 text-right font-mono text-xs text-muted whitespace-nowrap">
                {{ item.ip_address || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-6 border-t border-gray-100">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="loadLogs"
        />
      </div>
    </div>
  </PanelLayout>
</template>
