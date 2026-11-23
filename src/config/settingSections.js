import { Globe, Menu, Sparkles, Layout, Newspaper, Building2, Target, History, Users, Phone } from 'lucide-vue-next'

// Sub-pages of "Pengaturan Website" (super admin). Shared by the router, the panel sidebar,
// and SettingManageView so the list and URLs stay in one place.
export const SETTINGS_BASE_PATH = '/pengelola/super/pengaturan'

// `keys`: setting keys edited on that sub-page ("Kembalikan ke Default" resets only these).
// `appearsOn`: where the content shows on the public website, in plain words for non-technical users.
// `group`: sub-pages sharing a group are nested under one expandable item in the sidebar (e.g. "Tentang").
export const settingSections = [
  {
    slug: 'identitas',
    label: 'Nama, Logo & Bilah Atas',
    icon: Globe,
    appearsOn: 'Bagian paling atas semua halaman',
    keys: ['site_name', 'site_tagline', 'topbar_tagline', 'facebook_url', 'logo'],
  },
  {
    slug: 'menu-navigasi',
    label: 'Menu Utama',
    icon: Menu,
    appearsOn: 'Menu di bagian atas semua halaman dan "Tautan Cepat" di bagian bawah',
    keys: ['nav_menus'],
  },
  {
    slug: 'hero-beranda',
    label: 'Beranda',
    icon: Sparkles,
    appearsOn: 'Halaman Beranda',
    keys: [
      'hero_title_1', 'hero_title_2', 'hero_description',
      'hero_btn1_text', 'hero_btn1_url', 'hero_btn2_text', 'hero_btn2_url', 'hero_image',
      'home_posts_title', 'home_posts_subtitle', 'home_gallery_title', 'home_gallery_subtitle',
    ],
  },
  {
    slug: 'kegiatan-galeri',
    label: 'Halaman Kegiatan & Galeri',
    icon: Newspaper,
    appearsOn: 'Judul atas halaman Kegiatan dan halaman Galeri',
    keys: ['posts_banner_title', 'posts_banner_subtitle', 'gallery_banner_title', 'gallery_banner_subtitle'],
  },
  // One sub-page per public "Tentang" page: Identitas, Visi & Misi, Sejarah, Struktur.
  {
    slug: 'identitas-organisasi',
    label: 'Identitas',
    group: 'Tentang',
    icon: Building2,
    appearsOn: 'Halaman Tentang → Identitas',
    keys: [
      'about_identity_full_name', 'about_identity_abbreviation', 'about_identity_short_desc', 'about_text',
      'identity_card_badge',
      'about_identity_seo_title', 'about_identity_seo_description',
    ],
  },
  {
    slug: 'visi-misi',
    label: 'Visi & Misi',
    group: 'Tentang',
    icon: Target,
    appearsOn: 'Halaman Tentang → Visi & Misi',
    keys: [
      'vision_banner_title', 'vision_banner_subtitle', 'vision_section_title', 'vision_section_subtitle',
      'vision_badge', 'vision_title', 'vision', 'mission_badge', 'mission_title',
      'about_vision_seo_title', 'about_vision_seo_description',
    ],
  },
  {
    slug: 'sejarah',
    label: 'Sejarah',
    group: 'Tentang',
    icon: History,
    appearsOn: 'Halaman Tentang → Sejarah',
    keys: [
      'history_banner_title', 'history_banner_subtitle',
      'history_title', 'history_text', 'history_seo_title', 'history_seo_description',
    ],
  },
  {
    slug: 'pengurus',
    label: 'Pengurus',
    group: 'Tentang',
    icon: Users,
    appearsOn: 'Halaman Tentang → Struktur Organisasi',
    keys: [
      'structure_banner_title', 'structure_banner_subtitle',
      'structure_title', 'structure_period', 'structure_seo_title', 'structure_seo_description',
    ],
  },
  {
    slug: 'kontak',
    label: 'Kontak',
    icon: Phone,
    appearsOn: 'Halaman Kontak dan bagian bawah (footer) semua halaman',
    keys: [
      'contact_banner_title', 'contact_banner_subtitle', 'contact_section_title', 'contact_section_subtitle',
      'contact_map_title', 'contact_map_subtitle', 'address', 'phone_whatsapp', 'email', 'maps_embed_url',
      'contact_address_label', 'contact_whatsapp_label', 'contact_whatsapp_btn_text', 'contact_email_label',
      'contact_social_label', 'contact_facebook_name', 'contact_facebook_btn_text',
      'contact_map_empty_title', 'contact_map_empty_text',
    ],
  },
  {
    slug: 'footer',
    label: 'Bagian Bawah (Footer)',
    icon: Layout,
    appearsOn: 'Bagian biru paling bawah semua halaman',
    keys: ['footer_text', 'footer_copyright', 'footer_facebook_btn_text', 'footer_links_title', 'footer_contact_title'],
  },
]

export const settingSectionPath = (slug) => `${SETTINGS_BASE_PATH}/${slug}`

// Page title: grouped sub-pages are prefixed with their group ("Tentang - Identitas").
export const settingSectionTitle = (section) => (section.group ? `${section.group} - ${section.label}` : section.label)

// Sidebar entries in display order: single links, and one expandable entry per group
// (placed where the group's first sub-page appears).
export const settingNavEntries = settingSections.reduce((entries, section) => {
  if (!section.group) {
    entries.push({ type: 'link', key: section.slug, section })
    return entries
  }
  const existing = entries.find((entry) => entry.type === 'group' && entry.label === section.group)
  if (existing) existing.sections.push(section)
  else entries.push({ type: 'group', key: `group-${section.group}`, label: section.group, sections: [section] })
  return entries
}, [])

export const DEFAULT_SETTING_SECTION_PATH = settingSectionPath(settingSections[0].slug)

export const findSettingSection = (slug) => settingSections.find((section) => section.slug === slug) || null

// Old sub-page slugs kept working for bookmarks: the former "Tentang" page was split in two.
export const LEGACY_SETTING_SECTION_SLUGS = { tentang: 'identitas-organisasi' }
