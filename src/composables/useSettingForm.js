import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { getSuperSettings, updateSuperSettings, resetSuperSettings } from '@/services/panelApi'

// Setting keys edited as JSON arrays (repeater fields).
const ARRAY_FIELDS = ['nav_menus']

// Setting keys edited as plain text in the content settings page.
const TEXT_FIELDS = [
  'site_name', 'site_tagline', 'topbar_tagline', 'phone_whatsapp', 'email', 'facebook_url', 'maps_embed_url',
  'hero_title_1', 'hero_title_2', 'hero_description',
  'hero_btn1_text', 'hero_btn1_url', 'hero_btn2_text', 'hero_btn2_url',
  'about_text',
  'about_identity_full_name', 'about_identity_abbreviation', 'about_identity_short_desc',
  'about_identity_seo_title', 'about_identity_seo_description',
  'footer_text', 'footer_copyright', 'footer_facebook_btn_text', 'address',
  'vision_title', 'vision', 'mission_title', 'about_vision_seo_title', 'about_vision_seo_description',
  'vision_banner_title', 'vision_banner_subtitle', 'vision_section_title', 'vision_section_subtitle',
  'vision_badge', 'mission_badge',
  'home_posts_title', 'home_posts_subtitle', 'home_gallery_title', 'home_gallery_subtitle',
  'history_banner_title', 'history_banner_subtitle', 'structure_banner_title', 'structure_banner_subtitle',
  'identity_card_badge', 'footer_links_title', 'footer_contact_title',
  'contact_address_label', 'contact_whatsapp_label', 'contact_whatsapp_btn_text', 'contact_email_label',
  'contact_social_label', 'contact_facebook_name', 'contact_facebook_btn_text',
  'contact_map_empty_title', 'contact_map_empty_text',
  'history_title', 'history_text', 'history_seo_title', 'history_seo_description',
  'structure_title', 'structure_period', 'structure_seo_title', 'structure_seo_description',
  'posts_banner_title', 'posts_banner_subtitle',
  'gallery_banner_title', 'gallery_banner_subtitle',
  'contact_banner_title', 'contact_banner_subtitle',
  'contact_section_title', 'contact_section_subtitle', 'contact_map_title', 'contact_map_subtitle',
]

// Image fields: *_url is the stored image, *_file is a newly picked File (never sent as text).
const IMAGE_FIELDS = ['logo_url', 'logo_file', 'hero_image_url', 'hero_file']

const createEmptyForm = () => ({
  ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, ''])),
  ...Object.fromEntries(ARRAY_FIELDS.map((key) => [key, []])),
  ...Object.fromEntries(IMAGE_FIELDS.map((key) => [key, null])),
})

// State and actions for the super admin content settings page, including the unsaved-changes guard.
export function useSettingForm() {
  const settingsStore = useSettingsStore()
  const toast = useToastStore()

  const isLoading = ref(false)
  const isSaving = ref(false)
  const isResetting = ref(false)
  const errors = ref({})
  const isDirty = ref(false)
  const form = ref(createEmptyForm())

  // Set when the user removes the stored logo / hero image without picking a new one.
  const removeLogo = ref(false)
  const removeHero = ref(false)

  // After loading or saving: show the stored images and stop re-sending already uploaded files.
  const resetImageChanges = () => {
    form.value.logo_file = null
    form.value.hero_file = null
    removeLogo.value = false
    removeHero.value = false
  }

  const loadSettings = async () => {
    isLoading.value = true
    try {
      const data = await getSuperSettings()
      Object.keys(form.value).forEach((key) => {
        form.value[key] = data[key] ?? null
      })
      resetImageChanges()
      isDirty.value = false
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat pengaturan.')
    } finally {
      isLoading.value = false
    }
  }

  const handleUpdateLogo = (fileOrUrl) => {
    form.value.logo_file = fileOrUrl instanceof File ? fileOrUrl : null
    removeLogo.value = !fileOrUrl
    if (!fileOrUrl) form.value.logo_url = null
    isDirty.value = true
  }

  const handleUpdateHero = (fileOrUrl) => {
    form.value.hero_file = fileOrUrl instanceof File ? fileOrUrl : null
    removeHero.value = !fileOrUrl
    if (!fileOrUrl) form.value.hero_image_url = null
    isDirty.value = true
  }

  const handleSave = async () => {
    isSaving.value = true
    errors.value = {}

    try {
      const formData = new FormData()

      Object.keys(form.value).forEach((field) => {
        if (IMAGE_FIELDS.includes(field)) return

        const val = form.value[field]
        if (Array.isArray(val)) {
          formData.append(field, JSON.stringify(val))
        } else if (val !== null && val !== undefined) {
          formData.append(field, val)
        }
      })

      if (form.value.logo_file instanceof File) {
        formData.append('logo', form.value.logo_file)
      } else if (removeLogo.value) {
        formData.append('remove_logo', '1')
      }
      if (form.value.hero_file instanceof File) {
        formData.append('hero_image', form.value.hero_file)
      } else if (removeHero.value) {
        formData.append('remove_hero_image', '1')
      }

      const response = await updateSuperSettings(formData)
      toast.success('Pengaturan konten website berhasil disimpan.')
      isDirty.value = false

      if (response?.data) {
        form.value.logo_url = response.data.logo_url
        form.value.hero_image_url = response.data.hero_image_url
        form.value.phone_whatsapp = response.data.phone_whatsapp
      }
      resetImageChanges()
      await settingsStore.fetchSettings(true)
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        errors.value = error.response.data.errors
        toast.error('Periksa kembali kolom isian yang belum sesuai.')
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan.')
      }
    } finally {
      isSaving.value = false
    }
  }

  const handleCancel = async () => {
    if (isDirty.value) {
      const confirm = window.confirm('Batalkan perubahan dan muat ulang pengaturan saat ini?')
      if (!confirm) return
    }
    await loadSettings()
    toast.info('Perubahan dibatalkan.')
  }

  // Resets the given setting keys (one settings sub-page) to their defaults. Only those fields
  // are refreshed in the form, so unsaved edits on other sub-pages are kept.
  const handleReset = async (keys, sectionLabel = '') => {
    isResetting.value = true

    try {
      const response = await resetSuperSettings(keys)
      const data = response?.data || {}

      keys.forEach((key) => {
        if (key === 'logo') {
          form.value.logo_url = data.logo_url ?? null
          form.value.logo_file = null
          removeLogo.value = false
        } else if (key === 'hero_image') {
          form.value.hero_image_url = data.hero_image_url ?? null
          form.value.hero_file = null
          removeHero.value = false
        } else if (key in form.value) {
          form.value[key] = data[key] ?? null
        }
      })

      toast.success(
        sectionLabel
          ? `Bagian "${sectionLabel}" berhasil dikembalikan ke nilai default.`
          : 'Pengaturan berhasil dikembalikan ke nilai default.'
      )
      await settingsStore.fetchSettings(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengembalikan ke default.')
    } finally {
      isResetting.value = false
    }
  }

  const handleBeforeUnload = (e) => {
    if (isDirty.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  onBeforeRouteLeave((to, from, next) => {
    if (isDirty.value) {
      const confirm = window.confirm('Ada perubahan belum disimpan. Tinggalkan halaman?')
      confirm ? next() : next(false)
    } else {
      next()
    }
  })

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    loadSettings()
  })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', handleBeforeUnload))

  return {
    form,
    errors,
    isLoading,
    isSaving,
    isResetting,
    isDirty,
    handleUpdateLogo,
    handleUpdateHero,
    handleSave,
    handleCancel,
    handleReset,
  }
}
