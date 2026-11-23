// Field lists for SettingTextGroup, worded for non-technical users.

export const GOOGLE_GROUP_HEADING = 'Tampilan di Google & Tab Browser'
export const GOOGLE_GROUP_DESCRIPTION =
  'Tidak tampil di halaman, tetapi muncul saat halaman ini dicari di Google atau dibagikan ke WhatsApp/Facebook.'

export const googleFields = (titleKey, descriptionKey) => [
  {
    key: titleKey,
    label: 'Judul di Google',
    helpText: 'Judul singkat yang muncul di hasil pencarian Google dan di tab browser.',
  },
  {
    key: descriptionKey,
    label: 'Keterangan di Google',
    multiline: true,
    helpText: 'Satu atau dua kalimat ringkasan isi halaman.',
  },
]

export const bannerFields = (titleKey, subtitleKey, examples = {}) => [
  { key: titleKey, label: 'Judul Besar', placeholder: examples.title ? `Contoh: ${examples.title}` : '' },
  {
    key: subtitleKey,
    label: 'Kalimat di Bawah Judul',
    placeholder: examples.subtitle ? `Contoh: ${examples.subtitle}` : '',
  },
]

export const sectionHeadingFields = (titleKey, subtitleKey, examples = {}) => [
  { key: titleKey, label: 'Judul Bagian', placeholder: examples.title ? `Contoh: ${examples.title}` : '' },
  {
    key: subtitleKey,
    label: 'Kalimat Penjelas',
    placeholder: examples.subtitle ? `Contoh: ${examples.subtitle}` : '',
  },
]
