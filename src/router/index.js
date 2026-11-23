import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/public/HomeView.vue'
import {
  SETTINGS_BASE_PATH,
  DEFAULT_SETTING_SECTION_PATH,
  findSettingSection,
  settingSectionPath,
  LEGACY_SETTING_SECTION_SLUGS,
} from '@/config/settingSections'

const loginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH || 'masuk-pengelola'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Pertahankan posisi scroll jika berada di halaman yang sama (misal filter/search query)
    if (to.path === from.path) {
      return false
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tentang',
      redirect: '/tentang/identitas',
    },
    {
      path: '/tentang/identitas',
      name: 'about-identity',
      component: () => import('@/views/public/AboutIdentityView.vue'),
    },
    {
      path: '/tentang/visi-misi',
      name: 'about-vision-mission',
      component: () => import('@/views/public/AboutVisionMissionView.vue'),
    },
    {
      path: '/tentang/sejarah',
      name: 'about-history',
      component: () => import('@/views/public/AboutHistoryView.vue'),
    },
    {
      path: '/tentang/struktur-organisasi',
      name: 'about-structure',
      component: () => import('@/views/public/AboutStructureView.vue'),
    },
    {
      path: '/kegiatan',
      name: 'posts',
      component: () => import('@/views/public/PostIndexView.vue'),
    },
    {
      path: '/kegiatan/:slug',
      name: 'post-detail',
      component: () => import('@/views/public/PostDetailView.vue'),
    },
    {
      path: '/galeri',
      name: 'gallery',
      component: () => import('@/views/public/GalleryView.vue'),
    },
    {
      path: '/kontak',
      name: 'contact',
      component: () => import('@/views/public/ContactView.vue'),
    },
    // Rute rahasia login pengelola (sesuai VITE_ADMIN_LOGIN_PATH)
    {
      path: `/${loginPath}`,
      name: 'admin-login',
      component: () => import('@/views/panel/LoginView.vue'),
    },
    // Area panel pengelola
    {
      path: '/pengelola',
      name: 'panel-dashboard',
      component: () => import('@/views/panel/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/profil',
      name: 'panel-profile',
      component: () => import('@/views/panel/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/kegiatan',
      name: 'panel-posts',
      component: () => import('@/views/panel/PostManageView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/kegiatan/tambah',
      name: 'panel-post-create',
      component: () => import('@/views/panel/PostFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/kegiatan/:id/ubah',
      name: 'panel-post-edit',
      component: () => import('@/views/panel/PostFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/pengurus',
      name: 'panel-board-members',
      component: () => import('@/views/panel/BoardMemberManageView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/kategori',
      name: 'panel-categories',
      component: () => import('@/views/panel/CategoryManageView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pengelola/galeri',
      name: 'panel-gallery',
      component: () => import('@/views/panel/GalleryManageView.vue'),
      meta: { requiresAuth: true },
    },
    // Sub-area khusus Super Admin
    {
      path: '/pengelola/super/pengguna',
      name: 'panel-super-users',
      component: () => import('@/views/panel/super/UserManageView.vue'),
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
    },
    {
      path: SETTINGS_BASE_PATH,
      redirect: DEFAULT_SETTING_SECTION_PATH,
    },
    {
      // One page per settings section (sub-menu of "Pengaturan Website")
      path: `${SETTINGS_BASE_PATH}/:section`,
      name: 'panel-super-settings',
      component: () => import('@/views/panel/super/SettingManageView.vue'),
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
      beforeEnter: (to) => {
        if (findSettingSection(to.params.section)) return true
        const legacySlug = LEGACY_SETTING_SECTION_SLUGS[to.params.section]
        return legacySlug ? settingSectionPath(legacySlug) : DEFAULT_SETTING_SECTION_PATH
      },
    },
    {
      path: '/pengelola/super/aktivitas',
      name: 'panel-super-activity-logs',
      component: () => import('@/views/panel/super/ActivityLogView.vue'),
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
    },
    {
      path: '/pengelola/super/:subpath*',
      name: 'panel-super',
      component: () => import('@/views/panel/DashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
    },
    // Rute alias /admin khusus super admin
    {
      path: '/admin',
      redirect: DEFAULT_SETTING_SECTION_PATH,
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
    },
    {
      path: '/admin/:subpath*',
      redirect: DEFAULT_SETTING_SECTION_PATH,
      meta: { requiresAuth: true, requiredRole: 'super_admin' },
    },
    // Halaman 403 Akses Ditolak
    {
      path: '/akses-ditolak',
      name: 'forbidden',
      component: () => import('@/views/panel/ForbiddenView.vue'),
    },
    // Halaman UI Kit (Hanya aktif saat mode pengembangan / DEV)
    ...(import.meta.env.DEV
      ? [
          {
            path: '/ui-kit',
            name: 'ui-kit',
            component: () => import('@/views/public/UiKitView.vue'),
          },
        ]
      : []),
    // Halaman 404 Not Found (mencakup /login, /admin, /register, dll.)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/public/NotFoundView.vue'),
    },
  ],
})

// Route Guard modern (return values, tanpa next)
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Inisialisasi sesi pengguna saat pertama kali navigasi
  if (!authStore.isInitialized) {
    await authStore.fetchMe()
  }

  // Jika sudah login dan membuka halaman login, arahkan ke dashboard pengelola
  if (to.name === 'admin-login' && authStore.isLoggedIn) {
    return '/pengelola'
  }

  // Cek otorisasi halaman panel
  if (to.meta.requiresAuth) {
    // Sesuai aturan: jika belum login, tampilkan 404 agar alamat login tidak terbongkar
    if (!authStore.isLoggedIn) {
      return { name: 'not-found' }
    }

    // Jika butuh peran super_admin tapi bukan super_admin, tampilkan 403
    if (to.meta.requiredRole && authStore.role !== to.meta.requiredRole) {
      return { name: 'forbidden' }
    }
  }
})

// A lazily loaded page chunk can fail to load (stale dev pre-bundle, or a new deploy that
// replaced old chunk files). Reload the target URL once instead of leaving a blank page.
const CHUNK_RELOAD_KEY = 'chunk-reload-target'
const isChunkLoadError = (error) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    error?.message || ''
  )

router.onError((error, to) => {
  if (!isChunkLoadError(error) || typeof window === 'undefined') return
  try {
    if (window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === to.fullPath) return
    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, to.fullPath)
  } catch {
    // Storage unavailable: we cannot remember the attempt, so do not risk a reload loop.
    return
  }
  window.location.assign(to.fullPath)
})

router.afterEach(() => {
  try {
    window.sessionStorage.removeItem(CHUNK_RELOAD_KEY)
  } catch {
    // Storage unavailable: nothing to clear.
  }
})

export default router
