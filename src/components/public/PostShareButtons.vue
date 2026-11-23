<script setup>
import { computed } from 'vue'
import { Share2, MessageCircle, Facebook } from 'lucide-vue-next'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

// Share URL through backend /bagikan/{slug} for rich social preview
const shareUrl = computed(() => {
  if (!props.post?.slug) return ''
  const backendBase = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${backendBase}/bagikan/${props.post.slug}`
})

const whatsappShareUrl = computed(() => {
  const text = `${props.post.title} - Paguyuban KWT Kartini\n${shareUrl.value}`
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
})

const facebookShareUrl = computed(() => {
  if (!shareUrl.value) return ''
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
})
</script>

<template>
  <!-- Social share buttons -->
  <div class="pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-2 text-sm font-bold text-ink">
      <Share2 class="w-4 h-4 text-primary" />
      <span>Bagikan Kegiatan Ini:</span>
    </div>

    <div class="flex items-center gap-3">
      <!-- WhatsApp -->
      <a
        :href="whatsappShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-full bg-whatsapp text-ink font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition shadow-sm"
      >
        <MessageCircle class="w-4 h-4 fill-current" />
        <span>WhatsApp</span>
      </a>

      <!-- Facebook -->
      <a
        :href="facebookShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-full bg-facebook text-white font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition shadow-sm"
      >
        <Facebook class="w-4 h-4 fill-current" />
        <span>Facebook</span>
      </a>
    </div>
  </div>
</template>
