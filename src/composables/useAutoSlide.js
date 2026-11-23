import { ref, computed, watch } from 'vue'
import { useIntervalFn, usePreferredReducedMotion, useDocumentVisibility } from '@vueuse/core'

/**
 * Runs `onTick` on an interval for auto-advancing carousels.
 * Pauses while hovered, focused, touched, or when the tab is hidden,
 * and never auto-advances when the user prefers reduced motion.
 *
 * @param {() => void} onTick
 * @param {Object} options
 * @param {number} [options.interval=4000]
 * @param {import('vue').Ref<boolean>} [options.enabled] Extra condition, e.g. enough items to slide.
 */
export function useAutoSlide(onTick, options = {}) {
  const { interval = 4000, enabled = ref(true) } = options

  const reducedMotion = usePreferredReducedMotion()
  const visibility = useDocumentVisibility()

  const isHovered = ref(false)
  const isFocused = ref(false)
  const isTouching = ref(false)

  const isReducedMotion = computed(() => reducedMotion.value === 'reduce')
  const isRunning = computed(
    () =>
      enabled.value &&
      !isReducedMotion.value &&
      visibility.value !== 'hidden' &&
      !isHovered.value &&
      !isFocused.value &&
      !isTouching.value
  )

  const { pause, resume } = useIntervalFn(onTick, interval, { immediate: false })

  watch(isRunning, (running) => (running ? resume() : pause()), { immediate: true })

  // Spread onto the carousel wrapper with v-on.
  const pauseHandlers = {
    mouseenter: () => (isHovered.value = true),
    mouseleave: () => (isHovered.value = false),
    focusin: () => (isFocused.value = true),
    focusout: () => (isFocused.value = false),
    touchstart: () => (isTouching.value = true),
    touchend: () => (isTouching.value = false),
    touchcancel: () => (isTouching.value = false),
  }

  return { isRunning, isReducedMotion, pauseHandlers }
}
