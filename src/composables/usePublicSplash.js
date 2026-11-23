import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

// Shortest time the loading screen stays up, so the logo is seen instead of flickering.
export const SPLASH_MIN_MS = 1200
// Longest wait: after this the site is shown anyway (remembered or built-in text).
export const SPLASH_MAX_MS = 8000

/**
 * Public loading screen shown on every full page load (refresh), never on in-app navigation.
 * It stays until the latest settings came from the server (so super admin changes are visible),
 * the browser finished loading the page, and SPLASH_MIN_MS passed; SPLASH_MAX_MS is the cap.
 */
export function usePublicSplash() {
  const settingsStore = useSettingsStore()

  const hasMinElapsed = ref(false)
  const isPageLoaded = ref(typeof document !== 'undefined' && document.readyState === 'complete')
  const hasTimedOut = ref(false)
  let minTimer = null
  let maxTimer = null

  const markPageLoaded = () => {
    isPageLoaded.value = true
  }

  const hasFreshSettings = computed(() => settingsStore.isLoaded || !!settingsStore.error)
  const isSiteReady = computed(() => hasFreshSettings.value && hasMinElapsed.value && isPageLoaded.value)

  const isVisible = computed(
    () => !settingsStore.isSplashDone && !isSiteReady.value && !hasTimedOut.value
  )

  // Once hidden, it stays hidden for the rest of this page load.
  watch(isVisible, (visible) => {
    if (!visible) settingsStore.isSplashDone = true
  })

  onMounted(() => {
    if (settingsStore.isSplashDone) return
    minTimer = window.setTimeout(() => {
      hasMinElapsed.value = true
    }, SPLASH_MIN_MS)
    maxTimer = window.setTimeout(() => {
      hasTimedOut.value = true
    }, SPLASH_MAX_MS)
    if (!isPageLoaded.value) {
      window.addEventListener('load', markPageLoaded, { once: true })
    }
  })

  onUnmounted(() => {
    window.clearTimeout(minTimer)
    window.clearTimeout(maxTimer)
    window.removeEventListener('load', markPageLoaded)
  })

  return { isVisible }
}
