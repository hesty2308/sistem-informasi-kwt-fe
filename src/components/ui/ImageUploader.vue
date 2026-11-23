<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null,
  },
  label: {
    type: String,
    default: 'Foto / Gambar',
  },
  helpText: {
    type: String,
    default: 'Format JPG, JPEG, PNG, atau WEBP. Ukuran maksimal 2 MB.',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'error'])

const fileInputRef = ref(null)
const previewUrl = ref('')
const errorMessage = ref('')
const isDragging = ref(false)

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

const updatePreview = (value) => {
  if (!value) {
    previewUrl.value = ''
    return
  }
  if (typeof value === 'string') {
    previewUrl.value = value
  } else if (value instanceof File) {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(value)
  }
}

watch(() => props.modelValue, (newVal) => {
  updatePreview(newVal)
}, { immediate: true })

const validateAndProcessFile = (file) => {
  errorMessage.value = ''

  if (!file) return

  if (!ALLOWED_TYPES.includes(file.type)) {
    errorMessage.value = 'Format file tidak didukung. Harap pilih gambar berformat JPG, PNG, atau WEBP.'
    emit('error', errorMessage.value)
    return
  }

  if (file.size > MAX_SIZE_BYTES) {
    errorMessage.value = 'Ukuran file melebihi batas. Maksimal ukuran gambar adalah 2 MB.'
    emit('error', errorMessage.value)
    return
  }

  emit('update:modelValue', file)
  emit('change', file)
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    validateAndProcessFile(file)
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) {
    validateAndProcessFile(file)
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const removeImage = () => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  errorMessage.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('update:modelValue', null)
  emit('change', null)
}

onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-semibold text-ink mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Preview Container -->
    <div
      v-if="previewUrl"
      class="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-secondary/30 bg-surface group"
    >
      <img
        :src="previewUrl"
        alt="Pratinjau Foto"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-full bg-white text-ink text-sm font-semibold hover:bg-gray-100 transition-all cursor-pointer shadow-md"
          @click="triggerFileInput"
        >
          Ganti Foto
        </button>
        <button
          type="button"
          class="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
          title="Hapus Foto"
          @click="removeImage"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Dropzone Upload -->
    <div
      v-else
      :class="[
        'w-full aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer',
        isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-secondary/40 bg-surface hover:bg-surface/80',
        errorMessage ? 'border-red-400 bg-red-50/20' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        <UploadCloud class="w-6 h-6" />
      </div>

      <p class="text-sm font-semibold text-ink mb-1">
        Tarik &amp; lepas gambar ke sini, atau
      </p>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-accent text-primary hover:bg-yellow-400 shadow-xs cursor-pointer my-1"
        @click.stop="triggerFileInput"
      >
        <ImageIcon class="w-3.5 h-3.5" />
        <span>Pilih Foto</span>
      </button>

      <p class="text-xs text-muted mt-2">
        {{ helpText }}
      </p>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="text-xs text-red-600 font-medium mt-1.5">
      {{ errorMessage }}
    </p>
  </div>
</template>
