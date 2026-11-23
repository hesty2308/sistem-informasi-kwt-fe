// Public pages a menu item or button can link to. Used by the panel so non-technical users pick a page
// from a list instead of typing a URL path by hand.
export const PUBLIC_PAGE_OPTIONS = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang Kami', path: '/tentang' },
  { label: 'Tentang → Identitas', path: '/tentang/identitas' },
  { label: 'Tentang → Visi & Misi', path: '/tentang/visi-misi' },
  { label: 'Tentang → Sejarah', path: '/tentang/sejarah' },
  { label: 'Tentang → Struktur Organisasi', path: '/tentang/struktur-organisasi' },
  { label: 'Kegiatan', path: '/kegiatan' },
  { label: 'Galeri', path: '/galeri' },
  { label: 'Kontak', path: '/kontak' },
]

export const isKnownPublicPage = (path) => PUBLIC_PAGE_OPTIONS.some((page) => page.path === path)
