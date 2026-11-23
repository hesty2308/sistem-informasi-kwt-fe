import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { getPanelPost, createPanelPost, updatePanelPost, getPanelCategories } from '@/services/panelApi'
import { useToastStore } from '@/stores/toast'

// Helper Slug Generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// Format a date to YYYY-MM-DDTHH:mm for datetime-local inputs.
const toDateTimeLocal = (value) => {
  const d = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// State and actions for the create/edit post form, including the unsaved-changes guard.
export function usePostForm() {
  const route = useRoute()
  const router = useRouter()
  const toastStore = useToastStore()

  const isEditMode = computed(() => !!route.params.id)
  const postId = computed(() => route.params.id)

  const categories = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const isDirty = ref(false)
  const isSlugManuallyEdited = ref(false)

  const form = reactive({
    title: '',
    slug: '',
    category_id: '',
    cover_image: null,
    excerpt: '',
    content: '',
    status: 'published', // 'published' | 'draft'
    published_at: '',
  })

  const errors = reactive({
    title: '',
    slug: '',
    category_id: '',
    cover_image: '',
    excerpt: '',
    content: '',
    status: '',
  })

  // Auto-generate slug when title changes (if not manually edited)
  watch(
    () => form.title,
    (newTitle) => {
      if (!isSlugManuallyEdited.value && !isEditMode.value) {
        form.slug = slugify(newTitle)
      }
    }
  )

  const onSlugInput = () => {
    isSlugManuallyEdited.value = true
  }

  const loadCategories = async () => {
    try {
      const data = await getPanelCategories()
      categories.value = data || []
    } catch {
      categories.value = []
    }
  }

  const loadPostData = async () => {
    if (!isEditMode.value) return

    isLoading.value = true
    try {
      const post = await getPanelPost(postId.value)
      form.title = post.title || ''
      form.slug = post.slug || ''
      form.category_id = post.category?.id || ''
      form.excerpt = post.excerpt || ''
      form.content = post.content || ''
      form.cover_image = post.cover_image_url || null
      form.status = post.status || 'published'

      if (post.published_at) {
        form.published_at = toDateTimeLocal(post.published_at)
      }

      isSlugManuallyEdited.value = true
      isDirty.value = false
    } catch (err) {
      toastStore.error(err.message || 'Gagal memuat data kegiatan.')
      router.replace('/pengelola/kegiatan')
    } finally {
      isLoading.value = false
    }
  }

  // Watch for dirty changes
  watch(
    () => [form.title, form.slug, form.category_id, form.excerpt, form.content, form.status, form.published_at],
    () => {
      if (!isLoading.value) {
        isDirty.value = true
      }
    },
    { deep: true }
  )

  // Warn before leaving the page with unsaved changes
  onBeforeRouteLeave((to, from, next) => {
    if (isDirty.value && !isSubmitting.value) {
      const answer = window.confirm(
        'Peringatan: Perubahan yang Anda ketik belum disimpan. Yakin ingin meninggalkan halaman ini?'
      )
      if (answer) next()
      else next(false)
    } else {
      next()
    }
  })

  const beforeUnloadListener = (e) => {
    if (isDirty.value && !isSubmitting.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  const handleSubmit = async (targetStatus) => {
    // Clear previous errors
    Object.keys(errors).forEach((k) => (errors[k] = ''))

    if (!form.title.trim()) {
      errors.title = 'Judul kegiatan wajib diisi.'
      return
    }
    if (!form.content.trim() || form.content === '<p></p>') {
      errors.content = 'Isi artikel kegiatan wajib diisi.'
      return
    }

    isSubmitting.value = true
    form.status = targetStatus

    try {
      const formData = new FormData()
      formData.append('title', form.title.trim())
      if (form.slug.trim()) formData.append('slug', form.slug.trim())
      if (form.category_id) formData.append('category_id', form.category_id)
      if (form.excerpt?.trim()) formData.append('excerpt', form.excerpt.trim())
      formData.append('content', form.content)
      formData.append('status', form.status)
      if (form.published_at) formData.append('published_at', form.published_at)

      // Append cover image only if a new File was picked
      if (form.cover_image instanceof File) {
        formData.append('cover_image', form.cover_image)
      }

      if (isEditMode.value) {
        await updatePanelPost(postId.value, formData)
        toastStore.success('Kegiatan berhasil diperbarui.')
      } else {
        await createPanelPost(formData)
        toastStore.success(
          targetStatus === 'published'
            ? 'Kegiatan berhasil disimpan dan diterbitkan.'
            : 'Kegiatan berhasil disimpan sebagai draf.'
        )
      }

      isDirty.value = false
      router.push('/pengelola/kegiatan')
    } catch (err) {
      if (err.response?.data?.errors) {
        const errs = err.response.data.errors
        Object.keys(errs).forEach((k) => {
          if (errors[k] !== undefined) {
            errors[k] = errs[k][0]
          }
        })
        toastStore.error(err.response.data.message || 'Harap periksa kembali isian formulir.')
      } else {
        toastStore.error(err.message || 'Gagal menyimpan kegiatan.')
      }
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(async () => {
    window.addEventListener('beforeunload', beforeUnloadListener)
    await loadCategories()
    await loadPostData()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadListener)
  })

  return {
    isEditMode,
    categories,
    isSubmitting,
    form,
    errors,
    onSlugInput,
    handleSubmit,
  }
}
