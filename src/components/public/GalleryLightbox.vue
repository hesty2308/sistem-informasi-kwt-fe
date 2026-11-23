<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['load-more'])

// Index of the photo being shown; null means the lightbox is closed.
const activeIndex = defineModel('index', { type: Number, default: null })

const lightboxRef = ref(null)
const pendingNext = ref(false)
let opener = null

const isOpen = computed(() => activeIndex.value !== null)
const currentItem = computed(() => (isOpen.value ? props.items[activeIndex.value] || null : null))
const totalCount = computed(() => Math.max(props.total, props.items.length))

const close = () => {
  activeIndex.value = null
}

const prevPhoto = () => {
  if (!props.items.length) return
  if (activeIndex.value > 0) {
    activeIndex.value -= 1
  } else if (!props.hasMore) {
    activeIndex.value = props.items.length - 1
  }
}

const nextPhoto = () => {
  if (!props.items.length) return
  if (activeIndex.value < props.items.length - 1) {
    activeIndex.value += 1
  } else if (props.hasMore) {
    pendingNext.value = true
    emit('load-more')
  } else {
    activeIndex.value = 0
  }
}

// Prefetch the next page as soon as the last loaded photo is shown.
watch(activeIndex, (index) => {
  if (index !== null && props.hasMore && index >= props.items.length - 1) {
    emit('load-more')
  }
})

// Move forward once the page requested by "next" has arrived.
watch(
  () => props.items.length,
  (length) => {
    if (pendingNext.value && isOpen.value && activeIndex.value < length - 1) {
      activeIndex.value += 1
    }
    pendingNext.value = false
  }
)

watch(isOpen, (open) => {
  pendingNext.value = false
  if (open) {
    opener = document.activeElement
    document.body.style.overflow = 'hidden'
    nextTick(() => lightboxRef.value?.focus())
  } else {
    document.body.style.overflow = ''
    opener?.focus?.()
    opener = null
  }
})

// Keyboard navigation (Esc, ArrowLeft, ArrowRight) and focus trap.
const onKeyDown = (e) => {
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevPhoto()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextPhoto()
  } else if (e.key === 'Tab') {
    const focusable = lightboxRef.value?.querySelectorAll('button')
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      ref="lightboxRef"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      data-testid="gallery-lightbox"
      :aria-label="currentItem?.title || 'Pratinjau Foto Galeri'"
      class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 outline-none select-none"
      @click.self="close"
    >
      <!-- Top bar -->
      <div class="flex items-center justify-between gap-4 text-white z-20">
        <div class="text-sm font-semibold text-white/80" data-testid="lightbox-counter">
          Foto <span class="font-bold text-accent">{{ activeIndex + 1 }}</span> dari <span class="font-bold text-white">{{ totalCount }}</span>
        </div>

        <button
          type="button"
          aria-label="Tutup pratinjau"
          class="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition text-white font-medium text-sm cursor-pointer border border-white/20"
          @click="close"
        >
          <span>Tutup</span>
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Main image with previous/next buttons -->
      <div class="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
        <button
          type="button"
          aria-label="Foto sebelumnya"
          class="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-accent hover:text-primary-dark transition active:scale-95 cursor-pointer border border-white/20"
          @click.stop="prevPhoto"
        >
          <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <img
          :src="currentItem?.image_url || ''"
          :alt="currentItem?.title"
          class="max-h-[70vh] sm:max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
        />

        <button
          type="button"
          aria-label="Foto berikutnya"
          data-testid="lightbox-next"
          class="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-accent hover:text-primary-dark transition active:scale-95 cursor-pointer border border-white/20"
          @click.stop="nextPhoto"
        >
          <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <!-- Caption -->
      <div class="max-w-3xl mx-auto text-center text-white z-20 pb-2">
        <h3 class="text-base sm:text-lg font-bold text-white mb-1">
          {{ currentItem?.title }}
        </h3>
        <p v-if="currentItem?.caption" class="text-base text-white/80 leading-relaxed font-light">
          {{ currentItem?.caption }}
        </p>
      </div>
    </div>
  </transition>
</template>
