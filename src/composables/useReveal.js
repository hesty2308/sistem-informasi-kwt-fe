import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Composable for scroll-driven fade-up reveal animation using IntersectionObserver.
 * Automatically respects prefers-reduced-motion.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.15]
 * @param {string} [options.rootMargin='0px 0px -50px 0px']
 * @param {boolean} [options.once=true]
 * @returns {{ targetRef: import('vue').Ref<HTMLElement|null>, isRevealed: import('vue').Ref<boolean> }}
 */
export function useReveal(options = {}) {
  const targetRef = ref(null)
  const isRevealed = ref(false)
  let observer = null

  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  onMounted(() => {
    // Respect prefers-reduced-motion: reveal immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isRevealed.value = true
      return
    }

    if (!targetRef.value || typeof IntersectionObserver === 'undefined') {
      isRevealed.value = true
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isRevealed.value = true
          if (once && observer) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          isRevealed.value = false
        }
      })
    }, { threshold, rootMargin })

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    targetRef,
    isRevealed,
  }
}
