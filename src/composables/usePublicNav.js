import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { aboutPages } from '@/config/aboutPages'

// Shared navigation data and active-route helpers for the public header and footer.
export function usePublicNav() {
  const route = useRoute()
  const settingsStore = useSettingsStore()

  // Dynamic navigation links from settings store
  const navLinks = computed(() => settingsStore.navMenus)

  // "Tentang" sub-menu comes from the shared config (src/config/aboutPages.js)
  const aboutSubLinks = aboutPages

  const isActiveRoute = (path) => {
    if (path === '/') {
      return route.path === '/'
    }
    if (path === '/tentang') {
      return route.path.startsWith('/tentang')
    }
    return route.path.startsWith(path)
  }

  const isActiveSubRoute = (path) => route.path === path

  return { route, navLinks, aboutSubLinks, isActiveRoute, isActiveSubRoute }
}
