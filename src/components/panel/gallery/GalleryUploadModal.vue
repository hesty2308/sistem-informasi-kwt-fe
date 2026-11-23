<script setup>
import { ref } from 'vue'
import { uploadPanelGalleries } from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { UploadCloud, X } from 'lucide-vue-next'

const isOpen = defineModel({ type: Boolean, default: false })

const emit = defineEmits(['uploaded'])

const toastStore = useToastStore()

const fileInput = ref(null)
const isDragging = ref(false)
const selectedFiles = ref([]) // array of { file, name, size, preview, progress }
const uploadTitle = ref('')
const uploadCaption = ref('')
const isUploading = ref(false)

// File Drag & Drop Handling
const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files)
  }
}

const onFileInputChange = (e) => {
  if (e.target.files) {
    handleFiles(e.target.files)
  }
}

const handleFiles = (fileList) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  for (const file of Array.from(fileList)) {
    if (!allowed.includes(file.type)) {
      toastStore.error(`Berkas "${file.name}" bukan format gambar yang didukung.`)
      continue
    }
    if (file.size > 3 * 1024 * 1024) {
      toastStore.error(`Ukuran "${file.name}" melebihi batas 3 MB.`)
      continue
    }

    selectedFiles.value.push({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      preview: URL.createObjectURL(file),
      progress: 0,
    })
  }
}

const removeSelectedFile = (idx) => {
  const item = selectedFiles.value[idx]
  if (item?.preview) {
    URL.revokeObjectURL(item.preview)
  }
  selectedFiles.value.splice(idx, 1)
}

const startUpload = async () => {
  if (selectedFiles.value.length === 0) {
    toastStore.error('Pilih setidaknya satu berkas foto untuk diunggah.')
    return
  }

  isUploading.value = true
  try {
    const formData = new FormData()
    selectedFiles.value.forEach((item) => {
      formData.append('images[]', item.file)
    })
    if (uploadTitle.value.trim()) {
      formData.append('title', uploadTitle.value.trim())
    }
    if (uploadCaption.value.trim()) {
      formData.append('caption', uploadCaption.value.trim())
    }

    await uploadPanelGalleries(formData, (percent) => {
      selectedFiles.value.forEach((item) => {
        item.progress = percent
      })
    })

    toastStore.success('Foto galeri berhasil diunggah.')
    selectedFiles.value = []
    uploadTitle.value = ''
    uploadCaption.value = ''
    isOpen.value = false
    emit('uploaded')
  } catch (err) {
    toastStore.error(err.message || 'Gagal mengunggah foto galeri.')
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <!-- Multi-photo upload modal (drag & drop + per-file progress) -->
  <BaseModal
    v-model="isOpen"
    title="Unggah Foto Galeri"
    max-width="max-w-xl"
  >
    <div class="space-y-5">
      <!-- Drag & Drop Zone -->
      <div
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        class="border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2"
        :class="isDragging ? 'border-primary bg-primary/5' : 'border-secondary/30 bg-surface/50 hover:bg-surface'"
        @click="fileInput?.click()"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onFileInputChange"
        />

        <div class="w-12 h-12 rounded-2xl bg-white border border-secondary/20 flex items-center justify-center text-primary shadow-xs">
          <UploadCloud class="w-6 h-6" />
        </div>

        <p class="text-sm font-bold text-ink">
          Tarik &amp; lepas foto ke sini, atau <span class="text-primary underline">pilih dari perangkat</span>
        </p>
        <p class="text-xs text-muted">
          Format: JPG, JPEG, PNG, WEBP. Maksimal 3 MB per foto. Dapat memilih banyak foto sekaligus.
        </p>
      </div>

      <!-- Optional Default Title & Caption -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BaseInput
          v-model="uploadTitle"
          label="Judul Foto (Opsional)"
          placeholder="Contoh: Panen Raya Sayur Organik"
        />
        <BaseInput
          v-model="uploadCaption"
          label="Keterangan / Takarir (Opsional)"
          placeholder="Keterangan singkat kegiatan..."
        />
      </div>

      <!-- Selected Files List with Progress -->
      <div v-if="selectedFiles.length > 0" class="space-y-2 max-h-48 overflow-y-auto pr-1">
        <span class="block text-xs font-bold text-muted uppercase">
          {{ selectedFiles.length }} foto terpilih:
        </span>

        <div
          v-for="(item, idx) in selectedFiles"
          :key="idx"
          class="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface border border-secondary/20 text-xs"
        >
          <div class="flex items-center gap-2.5 overflow-hidden">
            <img :src="item.preview" class="w-8 h-8 rounded-lg object-cover shrink-0 border" />
            <div class="truncate">
              <span class="font-bold text-ink block truncate">{{ item.name }}</span>
              <span class="text-muted text-[10px]">{{ item.size }}</span>
            </div>
          </div>

          <!-- Upload Progress Bar -->
          <div class="flex items-center gap-2 shrink-0">
            <div v-if="isUploading" class="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full transition-all duration-200" :style="{ width: `${item.progress}%` }" />
            </div>
            <button
              v-if="!isUploading"
              type="button"
              @click="removeSelectedFile(idx)"
              class="p-1 rounded text-muted hover:text-red-500"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <BaseButton
          type="button"
          variant="ghost"
          :disabled="isUploading"
          @click="isOpen = false"
          class="cursor-pointer"
        >
          Batal
        </BaseButton>

        <BaseButton
          type="button"
          variant="primary"
          :loading="isUploading"
          :disabled="selectedFiles.length === 0"
          @click="startUpload"
          class="cursor-pointer"
        >
          Mulai Unggah ({{ selectedFiles.length }})
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
