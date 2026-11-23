import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPublicSettings } from '@/services/publicApi'
import { readPublicCache, writePublicCache, onPublicCacheChange } from '@/utils/publicCache'

const CACHE_KEY = 'settings'

// Section headings and page banners editable from the panel (fallback while the server responds).
const PAGE_TEXT_DEFAULTS = {
  home_posts_title: 'Kegiatan Terbaru',
  home_posts_subtitle: 'Ikuti dinamika kegiatan penyuluhan, pelatihan olah pangan, dan panen raya anggota',
  home_gallery_title: 'Galeri Dokumentasi',
  home_gallery_subtitle: 'Momen kebersamaan, aksi nyata di kebun pekarangan, dan senyum ibu-ibu tani',
  vision_banner_title: 'Visi dan Misi',
  vision_banner_subtitle: 'Arah gerak, cita-cita luhur, dan komitmen pemberdayaan wanita tani OKU Timur',
  vision_section_title: 'Arah & Tujuan Gerakan',
  vision_section_subtitle: 'Landasan dan langkah nyata yang memandu setiap langkah kegiatan KWT Kartini',
  vision_badge: 'Visi Organisasi',
  mission_badge: 'Misi Organisasi',
  history_banner_title: 'Sejarah Singkat',
  history_banner_subtitle: 'Jejak langkah perjuangan dan dedikasi pembentukan Paguyuban KWT Kartini OKU Timur',
  structure_banner_title: 'Struktur Organisasi',
  structure_banner_subtitle: 'Susunan kepengurusan dan dedikasi penggerak Paguyuban KWT Kartini OKU Timur',
  identity_card_badge: 'Identitas Resmi Organisasi',
  footer_links_title: 'Tautan Cepat',
  footer_contact_title: 'Hubungi Kami',
  contact_address_label: 'Alamat Sekretariat',
  contact_whatsapp_label: 'Telepon / WhatsApp',
  contact_whatsapp_btn_text: 'Hubungi via WhatsApp',
  contact_email_label: 'Surat Elektronik (Email)',
  contact_social_label: 'Media Sosial Resmi',
  contact_facebook_name: 'Facebook Paguyuban KWT Kartini',
  contact_facebook_btn_text: 'Kunjungi Facebook Kami',
  contact_map_empty_title: 'Peta Lokasi Sedang Disiapkan',
  contact_map_empty_text: 'Lokasi peta digital sekretariat akan segera diperbarui oleh pengurus. Anda dapat menghubungi kami melalui WhatsApp untuk panduan rute.',
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    // 1. Identitas & Top Bar
    site_name: 'Paguyuban KWT Kartini',
    site_tagline: 'Pemberdayaan Wanita Tani Menuju Kemandirian Pangan Kabupaten OKU Timur',
    topbar_tagline: 'Pemberdayaan Wanita Tani, Kabupaten OKU Timur',
    phone_whatsapp: '',
    email: '',
    facebook_url: 'https://www.facebook.com/paguyuban.kwt.kartini.okut',
    maps_embed_url: null,
    logo: null,
    logo_url: null,
    hero_image: null,
    hero_image_url: null,

    // 2. Menu Navigasi
    nav_menus: [
      { id: 1, name: 'Beranda', path: '/', is_active: true, order: 1 },
      { id: 2, name: 'Tentang', path: '/tentang', is_active: true, order: 2 },
      { id: 3, name: 'Kegiatan', path: '/kegiatan', is_active: true, order: 3 },
      { id: 4, name: 'Galeri', path: '/galeri', is_active: true, order: 4 },
      { id: 5, name: 'Kontak', path: '/kontak', is_active: true, order: 5 },
    ],

    // 3. Hero Section
    hero_title_1: 'Bersama Kartini,',
    hero_title_2: 'Kita Tumbuh dan Berdaya',
    hero_description: 'Menggerakkan kemandirian pangan keluarga, mengolah potensi bumi lokal, dan membangun kesejahteraan berkelanjutan bagi wanita tani di Kabupaten Ogan Komering Ulu Timur.',
    hero_btn1_text: 'Lihat Kegiatan',
    hero_btn1_url: '/kegiatan',
    hero_btn2_text: 'Tentang Kami',
    hero_btn2_url: '/tentang',

    // 4. Profile summary (shown on the About identity page)
    about_text: 'Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur merupakan wadah persatuan dan pemberdayaan kaum perempuan tani di wilayah Ogan Komering Ulu Timur. Fokus utama gerakan kami adalah optimalisasi lahan pekarangan rumah pangan lestari, budidaya tanaman pangan dan hortikultura ramah lingkungan, serta pengolahan hasil panen menjadi produk bernilai tambah tinggi untuk menopang ketahanan pangan dan perekonomian keluarga.',

    // 6. Footer
    footer_text: 'Hak Cipta © 2026 Paguyuban KWT Kartini Kabupaten OKU Timur. Seluruh hak cipta dilindungi undang-undang.',
    footer_facebook_btn_text: 'Kunjungi Facebook Kami',
    footer_copyright: 'Semua hak dilindungi.',
    address: '',

    // 7. Halaman Tentang
    vision_title: 'Cita-Cita Bersama',
    vision: 'Terwujudnya wanita tani Kabupaten OKU Timur yang berdaya, terampil, mandiri, dan berdaya saing dalam mewujudkan ketahanan pangan keluarga dan kemandirian ekonomi pedesaan.',
    mission_title: 'Langkah Strategis Kami',

    // 7.1 Identitas Organisasi
    about_identity_full_name: 'Paguyuban Kelompok Wanita Tani Kartini Kabupaten Ogan Komering Ulu Timur',
    about_identity_abbreviation: 'KWT Kartini OKU Timur',
    about_identity_short_desc: 'Wadah persatuan dan pemberdayaan wanita tani di wilayah Ogan Komering Ulu Timur yang berfokus pada optimalisasi lahan pekarangan pangan lestari dan peningkatan ekonomi keluarga.',
    about_identity_seo_title: 'Identitas Organisasi - Paguyuban KWT Kartini OKU Timur',
    about_identity_seo_description: 'Profil lengkap dan identitas resmi Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.',

    // 8. Halaman Lain
    posts_banner_title: 'Kegiatan Kami',
    posts_banner_subtitle: 'Berita, pengumuman, dan kegiatan terbaru Paguyuban KWT Kartini Kabupaten OKU Timur',

    gallery_banner_title: 'Galeri Dokumentasi',
    gallery_banner_subtitle: 'Potret semangat, gotong royong, dan panen hasil bumi anggota Paguyuban KWT Kartini',

    contact_banner_title: 'Hubungi Kami',
    contact_banner_subtitle: 'Terbuka untuk silaturahmi, kemitraan pemasaran pangan lokal, dan pembinaan kelompok tani',
    contact_section_title: 'Sekretariat Paguyuban',
    contact_section_subtitle: 'Silakan hubungi kami melalui saluran resmi berikut',
    contact_map_title: 'Lokasi Kami di Peta',
    contact_map_subtitle: 'Kabupaten Ogan Komering Ulu Timur, Sumatera Selatan',
  })

  // Last server values remembered in this browser win over the built-in defaults above,
  // so edited text shows immediately; fetchSettings() then refreshes it in the background.
  const cached = readPublicCache(CACHE_KEY)
  if (cached) {
    settings.value = { ...settings.value, ...cached }
  }

  // Keep other open tabs in sync when settings are saved in the panel.
  onPublicCacheChange(CACHE_KEY, (data) => {
    settings.value = { ...settings.value, ...data }
  })

  // True when remembered server values are available, so pages need no loading state.
  const hasCachedData = ref(!!cached)

  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref(null)

  // The public loading screen is shown once per full page load (not on in-app navigation).
  const isSplashDone = ref(false)

  const fetchSettings = async (force = false) => {
    if (isLoaded.value && !force) {
      return settings.value
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getPublicSettings()
      settings.value = {
        ...settings.value,
        ...data,
      }
      writePublicCache(CACHE_KEY, data)
      isLoaded.value = true
    } catch (err) {
      error.value = err.message || 'Gagal memuat pengaturan publik'
    } finally {
      isLoading.value = false
    }

    return settings.value
  }

  // Getters
  const siteName = computed(() => settings.value.site_name || 'Paguyuban KWT Kartini')
  const siteTagline = computed(() => settings.value.site_tagline || 'Kabupaten OKU Timur')
  const topbarTagline = computed(() => settings.value.topbar_tagline || 'Pemberdayaan Wanita Tani, Kabupaten OKU Timur')
  // Contact data never falls back to sample values: empty means "not filled in yet" and is hidden.
  const phoneWhatsApp = computed(() => settings.value.phone_whatsapp || '')
  const whatsappLink = computed(() => {
    const rawPhone = String(settings.value.phone_whatsapp || '').replace(/[^0-9]/g, '')
    if (!rawPhone) return ''
    const phone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone
    return `https://wa.me/${phone}`
  })
  const email = computed(() => settings.value.email || '')
  const address = computed(() => settings.value.address || '')
  const facebookUrl = computed(() => settings.value.facebook_url || 'https://www.facebook.com/paguyuban.kwt.kartini.okut')
  const logoUrl = computed(() => settings.value.logo_url)
  const heroImageUrl = computed(() => settings.value.hero_image_url)
  const footerText = computed(() => settings.value.footer_text || 'Paguyuban Kelompok Wanita Tani (KWT) Kartini berdedikasi membangun ketahanan pangan lestari dan kesejahteraan keluarga di Kabupaten OKU Timur.')
  const footerCopyright = computed(() => settings.value.footer_copyright || 'Semua hak dilindungi.')
  const footerFacebookBtnText = computed(() => settings.value.footer_facebook_btn_text || 'Kunjungi Facebook Kami')

  // Navigation Menus (filtered for active and sorted)
  const navMenus = computed(() => {
    const raw = settings.value.nav_menus
    if (!Array.isArray(raw)) return []
    return [...raw]
      .filter((m) => m.is_active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  // Hero Section Getters
  const heroTitle1 = computed(() => settings.value.hero_title_1 || 'Bersama Kartini,')
  const heroTitle2 = computed(() => settings.value.hero_title_2 || 'Kita Tumbuh dan Berdaya')
  const heroDescription = computed(() => settings.value.hero_description || 'Menggerakkan kemandirian pangan keluarga, mengolah potensi bumi lokal, dan membangun kesejahteraan berkelanjutan bagi wanita tani di Kabupaten Ogan Komering Ulu Timur.')
  const heroBtn1Text = computed(() => settings.value.hero_btn1_text || 'Lihat Kegiatan')
  const heroBtn1Url = computed(() => settings.value.hero_btn1_url || '/kegiatan')
  const heroBtn2Text = computed(() => settings.value.hero_btn2_text || 'Tentang Kami')
  const heroBtn2Url = computed(() => settings.value.hero_btn2_url || '/tentang')

  // About Getters
  const visionTitle = computed(() => settings.value.vision_title || 'Cita-Cita Bersama')
  const missionTitle = computed(() => settings.value.mission_title || 'Langkah Strategis Kami')

  // Posts, Gallery, Contact Getters
  const postsBannerTitle = computed(() => settings.value.posts_banner_title || 'Kegiatan Kami')
  const postsBannerSubtitle = computed(() => settings.value.posts_banner_subtitle || 'Berita, pengumuman, dan kegiatan terbaru Paguyuban KWT Kartini Kabupaten OKU Timur')

  const galleryBannerTitle = computed(() => settings.value.gallery_banner_title || 'Galeri Dokumentasi')
  const galleryBannerSubtitle = computed(() => settings.value.gallery_banner_subtitle || 'Potret semangat, gotong royong, dan panen hasil bumi anggota Paguyuban KWT Kartini')

  const contactBannerTitle = computed(() => settings.value.contact_banner_title || 'Hubungi Kami')
  const contactBannerSubtitle = computed(() => settings.value.contact_banner_subtitle || 'Terbuka untuk silaturahmi, kemitraan pemasaran pangan lokal, dan pembinaan kelompok tani')
  const contactSectionTitle = computed(() => settings.value.contact_section_title || 'Sekretariat Paguyuban')
  const contactSectionSubtitle = computed(() => settings.value.contact_section_subtitle || 'Silakan hubungi kami melalui saluran resmi berikut')
  const contactMapTitle = computed(() => settings.value.contact_map_title || 'Lokasi Kami di Peta')
  const contactMapSubtitle = computed(() => settings.value.contact_map_subtitle || 'Kabupaten Ogan Komering Ulu Timur, Sumatera Selatan')

  // Section headings & page banners: pageTexts.home_posts_title, pageTexts.vision_banner_title, ...
  const pageTexts = computed(() =>
    Object.fromEntries(
      Object.entries(PAGE_TEXT_DEFAULTS).map(([key, fallback]) => [key, settings.value[key] || fallback])
    )
  )

  // Identitas Organisasi Getters
  const identityFullName = computed(() => settings.value.about_identity_full_name || settings.value.site_name || 'Paguyuban KWT Kartini')
  const identityAbbreviation = computed(() => settings.value.about_identity_abbreviation || 'KWT Kartini OKU Timur')
  const identityShortDesc = computed(() => settings.value.about_identity_short_desc || settings.value.about_text || '')
  const identitySeoTitle = computed(() => settings.value.about_identity_seo_title || 'Identitas Organisasi - Paguyuban KWT Kartini OKU Timur')
  const identitySeoDescription = computed(() => settings.value.about_identity_seo_description || 'Profil lengkap dan identitas resmi Paguyuban Kelompok Wanita Tani (KWT) Kartini Kabupaten OKU Timur.')
  const aboutText = computed(() => settings.value.about_text || '')

  return {
    settings,
    isLoading,
    isLoaded,
    hasCachedData,
    isSplashDone,
    error,
    fetchSettings,
    identityFullName,
    identityAbbreviation,
    identityShortDesc,
    identitySeoTitle,
    identitySeoDescription,
    aboutText,
    siteName,
    siteTagline,
    topbarTagline,
    phoneWhatsApp,
    whatsappLink,
    email,
    address,
    facebookUrl,
    logoUrl,
    heroImageUrl,
    footerText,
    footerCopyright,
    footerFacebookBtnText,
    navMenus,
    heroTitle1,
    heroTitle2,
    heroDescription,
    heroBtn1Text,
    heroBtn1Url,
    heroBtn2Text,
    heroBtn2Url,
    visionTitle,
    missionTitle,
    postsBannerTitle,
    postsBannerSubtitle,
    galleryBannerTitle,
    galleryBannerSubtitle,
    contactBannerTitle,
    contactBannerSubtitle,
    contactSectionTitle,
    contactSectionSubtitle,
    contactMapTitle,
    contactMapSubtitle,
    pageTexts,
  }
})
