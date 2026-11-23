<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { getPanelDashboard } from '@/services/panelApi'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import StatCard from '@/components/panel/StatCard.vue'
import DataTable from '@/components/panel/DataTable.vue'
import StatusBadge from '@/components/panel/StatusBadge.vue'
import PopularPostsCard from '@/components/panel/dashboard/PopularPostsCard.vue'
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Image as ImageIcon,
  PlusCircle,
  Eye,
} from 'lucide-vue-next'

useHead({
  title: 'Dashboard Pengelola - Paguyuban KWT Kartini',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})

const authStore = useAuthStore()

const isLoading = ref(true)
const stats = ref({
  total_posts: 0,
  published_posts: 0,
  draft_posts: 0,
  total_galleries: 0,
})
const recentPosts = ref([])
const popularPosts = ref([])

// Table Columns Definition
const columns = [
  { key: 'title', label: 'Judul Kegiatan', sortable: true },
  { key: 'category', label: 'Kategori', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'published_at_formatted', label: 'Tanggal Terbit', sortable: true },
  { key: 'views', label: 'Dibaca', sortable: true, class: 'text-right' },
]

const loadDashboard = async () => {
  isLoading.value = true
  try {
    const data = await getPanelDashboard()
    stats.value = data.stats || stats.value
    recentPosts.value = data.recent_posts || []
    popularPosts.value = data.popular_posts || []
  } catch {
    // Graceful fallback for mock tests
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <PanelLayout>
    <!-- Header Halaman & Breadcrumbs -->
    <PageHeader
      title="Dashboard Pengelola"
      :subtitle="`Selamat datang, ${authStore.user?.name || 'Pengelola'}. Pantau statistik dan kelola publikasi kegiatan KWT Kartini.`"
      :breadcrumbs="[{ label: 'Panel Pengelola' }, { label: 'Dashboard' }]"
    >
      <template #actions>
        <!-- Pintasan Tambah Kegiatan -->
        <router-link
          to="/pengelola/kegiatan/tambah"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark active:scale-95 transition shadow-sm"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </router-link>
      </template>
    </PageHeader>

    <!-- 1. Grid 4 Kartu Statistik (StatCard) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatCard
        title="Total Kegiatan"
        :value="stats.total_posts"
        :icon="FileText"
        variant="primary"
        description="Semua arsip kegiatan"
      />

      <StatCard
        title="Kegiatan Terbit"
        :value="stats.published_posts"
        :icon="CheckCircle2"
        variant="secondary"
        description="Tampil di website publik"
      />

      <StatCard
        title="Kegiatan Draf"
        :value="stats.draft_posts"
        :icon="FileEdit"
        variant="accent"
        description="Belum dipublikasikan"
      />

      <StatCard
        title="Foto Galeri"
        :value="stats.total_galleries"
        :icon="ImageIcon"
        variant="blue"
        description="Dokumentasi tersimpan"
      />
    </div>

    <!-- 2. Konten Grid: 5 Kegiatan Terbaru & 5 Kegiatan Terpopuler -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- 5 Kegiatan Terbaru (7 Kolom) -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-lg font-bold text-ink">
              Kegiatan Terbaru
            </h2>
            <p class="text-xs text-muted">
              5 kegiatan terakhir yang dibuat atau diperbarui
            </p>
          </div>

          <router-link
            to="/pengelola/kegiatan"
            class="text-xs font-bold text-primary hover:underline"
          >
            Semua Kegiatan &rarr;
          </router-link>
        </div>

        <DataTable
          :columns="columns"
          :items="recentPosts"
          :loading="isLoading"
          empty-text="Belum ada kegiatan."
        >
          <template #cell-title="{ item }">
            <span class="font-bold text-ink line-clamp-1 max-w-xs">
              {{ item.title }}
            </span>
          </template>

          <template #cell-category="{ item }">
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-surface text-primary border border-secondary/25">
              {{ item.category?.name || 'Umum' }}
            </span>
          </template>

          <template #cell-status="{ item }">
            <StatusBadge :status="item.status || 'published'" />
          </template>

          <template #cell-views="{ item }">
            <div class="inline-flex items-center gap-1 text-muted text-xs font-semibold">
              <Eye class="w-3.5 h-3.5" />
              <span>{{ item.views || 0 }}x</span>
            </div>
          </template>

          <template #actions="{ item }">
            <router-link
              :to="`/pengelola/kegiatan/${item.id}/ubah`"
              class="text-xs font-bold text-primary hover:underline"
            >
              Ubah
            </router-link>
          </template>
        </DataTable>
      </div>

      <!-- 5 Kegiatan Terpopuler / Terbanyak Dilihat (5 Kolom) -->
      <PopularPostsCard class="lg:col-span-5" :posts="popularPosts" :is-loading="isLoading" />
    </div>
  </PanelLayout>
</template>
