/**
 * Konfigurasi bersama untuk seluruh sub-halaman Tentang Kami
 * Digunakan oleh AboutSubNav, AboutPager, PublicLayout navbar dropdown, dan footer
 */
export const aboutPages = [
  {
    id: 'identity',
    name: 'about-identity',
    label: 'Identitas Organisasi',
    shortLabel: 'Identitas',
    path: '/tentang/identitas',
    description: 'Mengenal profil dan identitas resmi Paguyuban KWT Kartini OKU Timur',
  },
  {
    id: 'vision-mission',
    name: 'about-vision-mission',
    label: 'Visi dan Misi',
    shortLabel: 'Visi & Misi',
    path: '/tentang/visi-misi',
    description: 'Arah gerak, cita-cita luhur, dan komitmen pemberdayaan wanita tani',
  },
  {
    id: 'history',
    name: 'about-history',
    label: 'Sejarah Singkat',
    shortLabel: 'Sejarah',
    path: '/tentang/sejarah',
    description: 'Jejak langkah perjuangan dan dedikasi pembentukan Paguyuban KWT Kartini',
  },
  {
    id: 'structure',
    name: 'about-structure',
    label: 'Struktur Organisasi',
    shortLabel: 'Struktur Organisasi',
    path: '/tentang/struktur-organisasi',
    description: 'Susunan kepengurusan dan dedikasi penggerak Paguyuban KWT Kartini',
  },
]

export default aboutPages
