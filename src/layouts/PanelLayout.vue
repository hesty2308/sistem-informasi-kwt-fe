<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import logoUrl from '@/assets/logo.png'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import PanelNavList from '@/components/layout/panel/PanelNavList.vue'
import PanelUserMenu from '@/components/layout/panel/PanelUserMenu.vue'
import { LogOut, ExternalLink, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toastStore = useToastStore()

const isMobileSidebarOpen = ref(false)
const isConfirmLogoutOpen = ref(false)
const isLoggingOut = ref(false)

// Load site settings (cached in the store) so the sidebar shows the uploaded logo and site name.
onMounted(() => {
  settingsStore.fetchSettings()
})

// Close mobile sidebar on route change
watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false
  }
)

const openLogoutFromDrawer = () => {
  isMobileSidebarOpen.value = false
  isConfirmLogoutOpen.value = true
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    toastStore.success('Anda berhasil keluar dari sistem.')
    router.replace('/')
  } catch {
    router.replace('/')
  } finally {
    isLoggingOut.value = false
    isConfirmLogoutOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface flex flex-col md:flex-row font-sans text-ink">
    <!-- ================================================================= -->
    <!-- 1. SIDEBAR HIJAU TUA (primary) - DESKTOP                           -->
    <!-- ================================================================= -->
    <aside
      class="hidden md:flex flex-col w-64 lg:w-72 bg-primary text-white shrink-0 shadow-lg min-h-screen sticky top-0 h-screen z-30"
    >
      <!-- Logo & Brand Header -->
      <div class="p-6 border-b border-white/10 flex items-center gap-3">
        <img
          :src="settingsStore.logoUrl || logoUrl"
          alt="Logo Paguyuban KWT Kartini"
          class="w-12 h-12 rounded-full object-contain p-0.5 bg-white shadow-xs border border-secondary/30 shrink-0"
        />
        <div class="overflow-hidden">
          <span class="block text-base font-extrabold text-white truncate leading-tight">
            {{ settingsStore.siteName }}
          </span>
          <span class="block text-xs font-medium text-accent tracking-wider uppercase truncate">
            Panel Pengelola
          </span>
        </div>
      </div>

      <!-- User Role Pill Info -->
      <div class="px-6 py-4 border-b border-white/10 bg-primary-dark/40 flex items-center justify-between">
        <div class="overflow-hidden pr-2">
          <span class="block text-xs font-semibold text-white/90 truncate">
            {{ authStore.user?.name || 'Pengelola' }}
          </span>
          <span class="block text-[11px] text-white/80 truncate">
            {{ authStore.user?.email }}
          </span>
        </div>

        <span
          class="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
          :class="authStore.isSuperAdmin ? 'bg-accent text-primary-dark' : 'bg-white/20 text-white'"
        >
          {{ authStore.isSuperAdmin ? 'Super Admin' : 'Admin' }}
        </span>
      </div>

      <!-- Navigation List -->
      <PanelNavList />

      <!-- Sidebar Bottom Action -->
      <div class="p-4 border-t border-white/10">
        <button
          type="button"
          @click="isConfirmLogoutOpen = true"
          class="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-200 hover:text-white hover:bg-red-600/30 transition cursor-pointer"
        >
          <LogOut class="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- ================================================================= -->
    <!-- 2. MOBILE DRAWER SIDEBAR (< 768px)                               -->
    <!-- ================================================================= -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex"
      @click.self="isMobileSidebarOpen = false"
    >
      <div class="w-72 bg-primary text-white h-full flex flex-col shadow-2xl">
        <!-- Mobile Drawer Header -->
        <div class="p-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              :src="settingsStore.logoUrl || logoUrl"
              alt="Logo KWT Kartini"
              class="w-10 h-10 rounded-full object-contain p-0.5 bg-white"
            />
            <div>
              <span class="block text-sm font-black text-white leading-tight">{{ settingsStore.siteName }}</span>
              <span class="block text-[10px] text-accent uppercase font-bold tracking-wider">Panel Pengelola</span>
            </div>
          </div>

          <button
            type="button"
            @click="isMobileSidebarOpen = false"
            class="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Mobile Drawer Nav List -->
        <PanelNavList mobile @navigate="isMobileSidebarOpen = false" />

        <div class="p-4 border-t border-white/10">
          <button
            type="button"
            @click="openLogoutFromDrawer"
            class="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-200 hover:text-white hover:bg-red-600/30 transition cursor-pointer"
          >
            <LogOut class="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- 3. TOPBAR PUTIH + KONTEN UTAMA                                    -->
    <!-- ================================================================= -->
    <div class="flex-grow flex flex-col min-w-0">
      <!-- Topbar Putih Sticky -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
        <div class="px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <!-- Left: Hamburger (Mobile) & Header Title -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="isMobileSidebarOpen = true"
              aria-label="Buka menu navigasi"
              class="md:hidden p-2 rounded-xl text-ink hover:text-primary hover:bg-surface transition cursor-pointer"
            >
              <Menu class="w-6 h-6" />
            </button>

            <span class="text-base sm:text-lg font-black text-primary truncate">
              Panel Pengelola
            </span>
          </div>

          <!-- Right: Tombol "Lihat Website" + User Menu -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Tombol "Lihat Website" (Tab Baru) -->
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface text-primary border border-secondary/30 hover:bg-white hover:border-secondary transition shadow-xs"
            >
              <span>Lihat Website</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>

            <PanelUserMenu @logout="isConfirmLogoutOpen = true" />
          </div>
        </div>
      </header>

      <!-- Main Body Container -->
      <main class="flex-grow p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

      <!-- Panel Footer -->
      <footer class="py-4 px-6 border-t border-secondary/15 text-center text-xs text-muted">
        Sistem Informasi Paguyuban KWT Kartini OKU Timur &copy; 2026
      </footer>
    </div>

    <!-- Confirm Dialog Logout -->
    <ConfirmDialog
      v-model="isConfirmLogoutOpen"
      title="Yakin ingin keluar?"
      message="Sesi login Anda di panel pengelola akan diakhiri. Anda perlu masuk kembali untuk mengakses panel."
      confirm-text="Ya, Keluar"
      cancel-text="Batal"
      :loading="isLoggingOut"
      @confirm="handleLogout"
    />

    <!-- Global Toast Container -->
    <ToastContainer />
  </div>
</template>
